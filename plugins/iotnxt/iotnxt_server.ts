import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";
import { generateDifficult } from "../../server/utils/utils";
import { Gateway, GatewayType } from "./lib/gateway"
import { User } from "../../server/shared/interfaces";
import { logger } from "../../server/shared/log";
import { userInfo } from "os";


export default class Iotnxt extends PluginSuperServerside {
    name = "iotnxt";
    gateways: Gateway[] = [];

    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver }) {
        super(props);


        this.webserver.app.post("/api/v3/iotnxt/addgateway", (req: any, res: any) => {
            this.addgateway({
                gateway: req.body,
                user: req.user
            }, (err: Error, result: any, gateway: any) => {
                if (err) { res.json({ err: err.toString() }); return; }
                res.json(result);
            });
        });

        this.webserver.app.post("/api/v3/iotnxt/removegateway", (req: any, res: any) => {
            this.removegateway({
                gateway: req.body,
                user: req.user
            }, (err: Error, result: any) => {
                if (err) res.json({ err: err.toString() });
                res.json(result);
            });
            // TODO
            // if (req.body._created_by) {
            //   if (req.body._created_by.publickey != req.user.publickey && req.user.level < 100) {
            //     res.json({ err: "permission denied" }); return;
            //   } else {
            //     this.removegateway(db, req.body, (err: Error, result: any) => {
            //       if (err) res.json({ err: err.toString() });
            //       res.json(result);
            //     });
            //   }
            // } else if (req.user.level >= 100) {
            //   this.removegateway(db, req.body, (err: Error, result: any) => {
            //     if (err) res.json({ err: err.toString() });
            //     res.json(result);
            //   });
            // }
        });

        this.webserver.app.get("/api/v3/iotnxt/gateways", (req: any, res: any) => {
            this.getgateways({ user: req.user }, (err: Error, gateways: any) => {

                if (err) res.json({ err: err.toString() });

                for (var g in gateways) {
                    delete gateways[g].Secret
                }

                res.json(gateways);
            });
        });

        this.webserver.app.post("/api/v3/iotnxt/setgatewaydevice", (req: any, res: any) => {
            var gateway = {
                GatewayId: req.body.GatewayId,
                HostAddress: req.body.HostAddress
            }
            this.setgatewaydevice(req.user, req.body.key, gateway, req.body.id, req.body.currentGateway,
                (err: Error, result: any) => {
                    if (err) { res.json({ err: err.toString() }); return; }
                    res.json(result);
                })
        });

        this.webserver.app.post("/api/v3/iotnxt/reconnectgateway", (req: any, res: any) => {
            this.reconnectgateway({ gateway: req.body, user: req.user }, (err, result) => {
                if (err) { res.json({ err: err.toString() }); return; }
                res.json(result);
            })
        })
    }

    reconnectgateway(query: { gateway: GatewayType, user: User }, cb: any) {
        var { gateway, user } = query;
        logger.log({ message: "reconnect gateway " + gateway.GatewayId, level: "warn", group: "iotnxt" })
    }

    addgateway(query: { gateway: any, user: User }, cb: any) {
        //var gateway = gatewayRequest;
        // if (!user.publickey) {
        //   user["publickey"] = utils.generate(32).toLowerCase();
        // }

        var { gateway, user } = query

        if (user.level <= 0) { cb(new Error("level must be 1 or higher")); return; }

        this.documentstore.db.plugins_iotnxt.find({ GatewayId: gateway.GatewayId }, (err: Error, result: any) => {
            if (err) { cb(err); console.log(err); return; }
            if (result) {
                if (result.length != 0) { cb(new Error("Gateway with this GatewayId already exists!")); return; }
                //////////////
                // ADD GATEWAY
                gateway.default = false; // defaults to not the default
                gateway.connected = false;
                gateway.unique = generateDifficult(64);
                gateway.type = "gateway"
                gateway["_created_on"] = new Date();
                gateway["_created_by"] = { publickey: user["publickey"] };
                this.documentstore.db.plugins_iotnxt.save(gateway, (err: Error, result: any) => { cb(err, result, gateway); });
                //////////////


            }
        })
    }

    /** Removing of gateways */
    removegateway = (query: { gateway: Gateway, user: User }, cb: any) => {
        var { gateway, user } = query;

        var dbQuery: any = {
            type: "gateway",
            GatewayId: query.gateway.GatewayId,
            HostAddress: query.gateway.HostAddress
        }

        // If you are not admin you can only delete gateways you created.
        if (!user.admin) { dbQuery["_createdby"] = { publickey: query.user.publickey } }
        this.documentstore.db.plugins_iotnxt.remove(dbQuery, cb);
    }

    handlenewgateway(gateway: any) {
        this.connectGateway(gateway);
    }

    getgateways(query: { user: User }, cb: any) {
        var { user } = query;
        var dbquery: any = { type: "gateway" }
        console.log("asdf")
        if (!user.admin) { dbquery["_created_by.publickey"] = query.user.publickey }
        console.log(dbquery);
        this.documentstore.db.plugins_iotnxt.find(dbquery, cb);
    }

    connectGateway(gateway: GatewayType) {



        logger.log({ group: this.name, message: gateway.GatewayId + "connecting... ", data: { GatewayId: gateway.GatewayId }, level: "verbose" })

        // this.eventHub.emit("plugin", {
        //     plugin: this.name,
        //     event: {
        //         type: "gatewayUpdate",
        //         gateway: {
        //             unique: gateway.unique,
        //             connected: "connecting"
        //         }
        //     }
        // })

        //this.calculateGatewayTree(gateway);

        /** We have to pass in the db for it to calculate the registration tree structure.. I know. It sucks. */
        var gatewayConnection = new Gateway(gateway, this.documentstore.db)
        //
        gatewayConnection.on("connected", () => {
            var instance_id = "0";
            if (process.env.pm_id) {
                instance_id = process.env.pm_id
            }
            var update = {
                unique: gateway.unique,
                connected: true,
                instance_id,
                _connected_last: new Date()
            }
            this.updateGatewayDB(gateway.unique, update, () => { })

            // this.eventHub.emit("plugin", {
            //     plugin: this.name,
            //     event: {
            //         type: "gatewayUpdate",
            //         gateway: update
            //     }
            // })

            // if we're part of a cluster subscribe to cluster events for this gateway
            // if (this.isCluster) {
            //     this.ev.on('iotnxtevents:' + gateway.HostAddress + '|' + gateway.GatewayId, (data: any) => {
            //         // console.log("IOTNXT CLUSTER RECIEVED GATEWAY PACKET")
            //         // console.log(data);
            //         // console.log("RECIEVED AT:" + new Date().toISOString())
            //         this.handlePacket(data.deviceState, data.packet, () => { })
            //     });
            // }

        })
        //

        // handling incoming requests from commander/portal
        gatewayConnection.on("request", (request: any) => {
            console.log("iotnxt incoming request!!!! TODO unhandled in 5.1")
            //this.eventHub.emit("device", request);
        })

        // error
        gatewayConnection.on("error", (error) => {
            var update = {
                unique: gateway.unique,
                connected: "error",
                error
            }

            this.updateGatewayDB(gateway.unique, update, () => { })
            // this.eventHub.emit("plugin", {
            //     plugin: this.name,
            //     event: {
            //         type: "gatewayUpdate",
            //         gateway: update
            //     }
            // })
        })

        this.gateways.push(gatewayConnection);
        //
    }




    setgatewaydevice(user: any, key: any, gateway: any, id: any, current: any, cb: Function) {
        var changes;
        if (current) {
            changes = "changed gateway from " + current + " to " + gateway.GatewayId
        }
        else {
            changes = "changed gateway to " + gateway.GatewayId + " [via POSTMAN]"
        }

        if (user.level >= 100) {
            //admins
            if (key) {
                this.documentstore.db.states.update({ key }, { $push: { history: { $each: [{ date: new Date(), user: user.username, publickey: user.publickey, change: changes }] } } })
                this.documentstore.db.states.update(
                    { key },
                    { "$set": { "plugins_iotnxt_gateway": { GatewayId: gateway.GatewayId, HostAddress: gateway.HostAddress } } },
                    cb)
            }
            else {
                this.documentstore.db.states.update({ devid: id, apikey: user.apikey }, { $push: { history: { $each: [{ date: new Date(), user: user.username, publickey: user.publickey, change: changes }] } } })
                this.documentstore.db.states.update(
                    { devid: id, apikey: user.apikey },
                    { "$set": { "plugins_iotnxt_gateway": { GatewayId: gateway.GatewayId, HostAddress: gateway.HostAddress } } },
                    cb)
            }
        } else {
            if (key) {
                this.documentstore.db.states.update({ key }, { $push: { history: { $each: [{ date: new Date(), user: user.username, publickey: user.publickey, change: changes }] } } })
                this.documentstore.db.states.update(
                    { key: key, apikey: user.apikey },
                    { "$set": { "plugins_iotnxt_gateway": { GatewayId: gateway.GatewayId, HostAddress: gateway.HostAddress } } },
                    cb)
            }
            else {
                this.documentstore.db.states.update({ devid: id, apikey: user.apikey }, { $push: { history: { $each: [{ date: new Date(), user: user.username, publickey: user.publickey, change: changes }] } } })
                this.documentstore.db.states.update(
                    { devid: id, apikey: user.apikey },
                    { "$set": { "plugins_iotnxt_gateway": { GatewayId: gateway.GatewayId, HostAddress: gateway.HostAddress } } },
                    cb)
            }
        }
    }



    updateGatewayDB(unique: string, update: any, cb: Function) {
        this.documentstore.db.plugins_iotnxt.update(
            { type: "gateway", unique },
            { "$set": update }, (err: Error, result: any) => {
                if (err) { cb(err, undefined); }
                if (result) { cb(err, result); }
            })
    }


};

