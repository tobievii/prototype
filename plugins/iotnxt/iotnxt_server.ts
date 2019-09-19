import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";
import { generateDifficult } from "../../server/utils/utils";
import { Gateway, GatewayType } from "./lib/gateway"
import { User } from "../../server/shared/interfaces";
import { logger } from "../../server/shared/log";
import { userInfo } from "os";

import { IotnxtCore } from "./lib/iotnxt"

export default class Iotnxt extends PluginSuperServerside {

    iotnxt: IotnxtCore;


    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver }) {
        super(props);

        this.iotnxt = new IotnxtCore(props);

        this.webserver.app.post("/api/v3/iotnxt/addgateway", (req: any, res: any) => {
            this.iotnxt.addgateway({ gateway: req.body, user: req.user }, (err: Error, result: any, gateway: any) => {
                if (err) { res.json({ err: err.toString() }); return; }
                res.json(result);
            });
        });

        this.webserver.app.post("/api/v3/iotnxt/removegateway", (req: any, res: any) => {
            this.iotnxt.removegateway({ gateway: req.body, user: req.user }, (err: Error, result: any) => {
                if (err) { res.json({ err: err.toString() }); return };
                res.json(result);
            });
        });

        this.webserver.app.get("/api/v3/iotnxt/gateways", (req: any, res: any) => {
            this.iotnxt.getgateways({ user: req.user }, (err: Error, gateways: any) => {
                if (err) res.json({ err: err.toString() });
                for (var g in gateways) { delete gateways[g].Secret }
                res.json(gateways);
            });
        });

        this.webserver.app.post("/api/v3/iotnxt/setgatewaydevice", (req: any, res: any) => {
            var gateway = { GatewayId: req.body.GatewayId, HostAddress: req.body.HostAddress }
            this.iotnxt.setgatewaydevice(req.user, req.body.key, gateway, req.body.id, req.body.currentGateway,
                (err: Error, result: any) => {
                    if (err) { res.json({ err: err.toString() }); return; }
                    res.json(result);
                })
        });

        this.webserver.app.post("/api/v3/iotnxt/reconnectgateway", (req: any, res: any) => {
            this.iotnxt.reconnectgateway({ gateway: req.body, user: req.user }, (err, result) => {
                if (err) { res.json({ err: err.toString() }); return; }
                res.json(result);
            })
        })
    }




};

