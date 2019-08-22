import { EventEmitter } from "events";
import { logger } from "./log"

import * as utils from "../utils/utils"

var geoip = require("geoip-lite");

import * as crypto from "crypto"
import { DocumentStore } from "./data";

import * as _ from "lodash"

import * as vm2 from "vm2"

import { User, CorePacket } from "./interfaces"

export class Core extends EventEmitter {
    db: any;
    salt: string = "nsajkdnasjkdnjkasd";
    config: any;

    constructor(options: { documentstore: DocumentStore, config: any }) {
        super();
        this.db = options.documentstore.db;
        this.config = options.config;
        //logger.log({message:{msg:"Core constructor", options}, level:"info"})
    }

    register(options: { email: string, pass: string, username?: string, ip?: string, userAgent?: string }, cb?: (err: Error | undefined, result?: any) => void) {

        //lowercase email
        if (options.email) { options.email = options.email.toLowerCase() }

        //encrypt password
        crypto.scrypt(options.pass, this.salt, 64, (err, derivedKey) => {
            if (err) { logger.log({ message: "core new user registration scrypt error", data: { err }, level: "error" }); }
            if (derivedKey) {
                //////////////
                let now = new Date();

                var user: any = {
                    uuid: utils.generate(128),
                    "_created_on": now,
                    "_last_seen": now,
                    ip: options.ip,
                    userAgent: options.userAgent,
                    password: derivedKey.toString("hex"),
                    email: options.email.toLowerCase(),
                    level: 1,
                    apikey: utils.generate(32),
                    publickey: utils.generate(32).toLowerCase()
                }

                // handle case where no username is provided.
                if (options.username) {
                    user.username = options.username;
                } else {
                    user.username = options.email.split("@")[0] + Math.round(Math.random() * 10000)
                }


                var ipLoc = geoip.lookup(options.ip);
                if (ipLoc) { user.ipLoc = ipLoc }

                //check if user exists...
                this.user({ email: user.email }, (err, checkuser) => {
                    if (err) { if (cb) cb(err); }
                    if (checkuser == null) {
                        //email is not taken.
                        logger.log({ message: "core new user registration", data: { options }, level: "verbose" })
                        this.db.users.save(user, (err: any, usersaved: any) => {
                            if (err) if (cb) cb(err);
                            if (usersaved) {
                                if (cb) cb(undefined, { account: usersaved });
                            }
                        });
                    } else {
                        //user email is taken!
                        logger.log({ message: "registration failed", data: { reason: "user email already taken", options }, level: "error" })
                        if (cb) {
                            cb(new Error("user email already taken"));
                            return;
                        }
                    }

                })

                //////////////
            }
        });
    }
    // end register

    account(options: any, cb?: (err: Error | undefined, result?: any) => void) {
        console.log("account change")
        console.log(options);
        if ((options.user) && (options.change)) {
            this.db.users.update({ apikey: options.user.apikey },
                { "$set": options.change }, (err: any, result: any) => {
                    if (err) { if (cb) cb(err); }
                    if (result) { if (cb) cb(undefined, result); }
                })
        }
    }
    // end account

    // everything to do with finding a user
    user(options: { username?: string, uuid?: string, apikey?: string, email?: string, pass?: string, authorization?: string }, cb: (err: Error | undefined, user?: any) => void) {

        // force lowercase on users
        if (options.email) { options.email = options.email.toLowerCase() }

        // finds user from db by Basic Auth base64 key
        if (options.authorization) {
            var auth = Buffer.from(options.authorization.split(" ")[1], 'base64').toString();
            if (auth.split(":")[0] != "api") { cb(new Error("Basic Authorization header username should be api")); return; }
            if (auth.split(":")[1].split("-")[0] != "key") { cb(new Error("Basic Authorization header password should start with key")); return; };

            let apikey = auth.split(":")[1].split("-")[1];
            this.db.users.findOne({ apikey }, (err: Error | undefined, user: any) => {
                if (err) {
                    logger.log({ message: "db err", data: { err }, level: "error" })
                    cb(err);
                }
                if (user) { cb(undefined, user); }
            })

        }
        // or
        if ((options.email) && (options.pass)) {
            if (typeof options.email != "string") { cb(new Error("email must be a string.")); return; }
            this.db.users.findOne({ email: options.email }, (err: Error | undefined, user: any) => {
                if (err) { logger.log({ message: "finding user by email failed.", data: { err }, level: "error" }); cb(err); return; }
                if (user) {
                    // check password:
                    var passbuf: any = options.pass;
                    crypto.scrypt(passbuf, this.salt, 64, (err, derivedKey) => {
                        if (err) { logger.log({ message: "core user signedin password match scrypt error", data: { err }, level: "error" }); }
                        if (derivedKey) {
                            if (derivedKey.toString("hex") == user.password) {
                                logger.log({ message: "core user email password match", data: { user }, level: "info" });
                                cb(undefined, user);
                            } else {
                                logger.log({ message: "core user email password mismatch!", data: { email: options.email }, level: "warn" });
                                cb(new Error("username/password incorrect"))
                            }
                        }
                    });
                }

                if (user == null) {
                    cb(new Error("user account not found"))
                }
            })

        }

        // or apikey
        if (options.apikey) {
            this.db.users.findOne({ apikey: options.apikey }, (err: Error, user: any) => {
                if (err) { cb(err); return; }
                if (user) {
                    cb(undefined, user);
                }

            })
        }

        // or only email
        if ((options.email) && (options.pass == undefined)) {
            this.db.users.findOne({ email: options.email }, (err: Error | undefined, user?: any) => {
                if (err) { cb(err); return; }
                cb(undefined, user);
            })
        }

        // or uuid
        if (options.uuid) {
            this.db.users.findOne({ uuid: options.uuid }, (err: Error | undefined, user?: any) => {
                if (err) { cb(err); return; }
                if (user) { cb(undefined, user); } else { cb(new Error("user not found by uuid")); }
            })
        }

        // or username
        if (options.username) {
            console.log("finding by username:" + options.username)
            this.db.users.findOne({ username: options.username }, (err: Error | undefined, user?: any) => {
                if (err) { cb(err); return; }
                cb(undefined, user);
            })
        }
    }
    // end user

    datapost(options: { user: any, packet: any }, cb: (err: any, result?: any) => void) {
        //device / user?
        if ((options.packet) && (options.user)) {
            const { packet, user } = options;

            //if (!cb) cb = () => { }

            // ERROR CHECK
            if (!packet.id) { if (cb) cb({ error: "id parameter missing" }); return; }
            if (typeof packet.id != "string") { if (cb) cb({ error: "id must be a string" }); return; }
            if (packet.id == "") { if (cb) cb({ error: "id may not be empty" }); return; }
            if (packet.id.indexOf(" ") != -1) { if (cb) cb({ "error": "id may not contain spaces" }); return; }
            if (packet.id.match(/^[a-z0-9_]+$/i) == null) { if (cb) cb({ "error": "id may only contain a-z A-Z 0-9 and _" }); return; }

            // gets this device's state from the db. 
            // todo: get all subscribed instances and perform workflows on the chain, then update db.
            this.state({ user, id: packet.id }, (err: any, statedb: any) => {
                if (err) { if (cb) cb({ error: "db error" }); return; }

                console.log("----------")
                console.log(statedb);




                var state: CorePacket | any = {};
                if (statedb) {
                    state = statedb; //existed!
                } else {
                    state = { "_created_on": new Date(), key: utils.generateDifficult(128) }
                }

                delete state["_id"]; //sanitize db data

                // timestamp it.
                state["_last_seen"] = new Date();

                //add data from state
                packet.key = state.key;

                //add data from user
                packet.apikey = user.apikey;
                packet.publickey = user.publickey
                packet.username = user.username

                packet.id = packet.id.toLowerCase();

                //todo: meta
                packet.meta = {};

                //flags force boolean
                if (packet.public != undefined) packet.public = (packet.public == true);

                //merge state from packet into state. this keeps state most of the latest data


                // workflow just before saving to db.
                this.workflow({ packet, state }, (err, processedPacket) => {
                    console.log(processedPacket);
                    this.db.packets.save(processedPacket, (err: any, result: any) => {
                        var stateMerged = _.merge(state, processedPacket)
                        console.log("saving to db:")
                        var stateSave = _.clone(stateMerged);
                        console.log(stateSave);
                        delete stateSave["_id"]
                        this.db.states.update({ key: stateSave.key }, stateSave, { upsert: true }, (err1: any, result1: any) => {
                            if (err1) { console.log(err1) }
                            if (result1) {
                                console.log(result1);
                                if (cb) cb(undefined, { result: "success" });
                            }
                        })
                    })
                })
                // done!




            });
        }
    }

    view(options: any, cb: (error: { error: string } | undefined, result?: any) => void) {

        // secure
        if (options.user) {
            if (typeof options.user.apikey != "string") { cb({ error: "invalid user apikey" }); return; }
        }

        // one device
        if ((options.id) && (options.user)) {
            this.db.states.findOne({ apikey: options.user.apikey, id: options.id }, (err: Error, result: any) => {
                if (err) { cb({ error: "db error" }) }
                if (result) {
                    if (result) cb(undefined, result); return;
                } else {
                    cb({ error: "device state not found" }); return;
                }
            })
        }

        // all own devices 
        if ((options.user) && (options.id == undefined) && (options.username == undefined)) {
            this.db.states.find({ apikey: options.user.apikey }, (err: Error, result: any) => {
                if (err) { cb({ error: "db error" }); return; }
                cb(undefined, result);
            })
        }

        // all visible devices from a username
        if ((options.username) && (options.user)) {
            let username = options.username;
            this.user({ username }, (err, user) => {
                if (err) cb({ error: "db error" });
                if (user) {
                    this.db.states.find({ apikey: user.apikey, public: true }, (err: Error, result: any) => {
                        if (err) { cb({ error: "db error" }); return; }
                        cb(undefined, result);
                    })
                }
            })

        }
    }

    // returns device packets (history);
    packets(options: any, cb: any) {
        if ((options.id) && (options.user)) {
            this.db.packets.find({ apikey: options.user.apikey, id: options.id }, (err: Error, result: any) => {
                if (err) { cb({ error: "db error" }) }
                if (result) { cb(undefined, result) }
            })
        }
    }


    // returns device state    
    state(options: any, cb: any) {
        if ((options.id) && (options.user)) {
            this.db.states.findOne({ apikey: options.user.apikey, id: options.id }, (err: Error, result: any) => {
                if (err) { cb({ error: "db error" }) }
                cb(undefined, result);
            })
        }
    }

    // --------------------------------- 

    delete(options: any, cb: any) {
        if ((options.id) && (options.user)) {
            this.db.states.remove({ apikey: options.user.apikey, id: options.id }, (err: Error, result: any) => {
                if (err) { cb({ error: "db error" }); }
                cb(undefined, result);
            })
        }
    }

    // --------------------------------- 

    search(options: any, cb: (err: any, result?: User | User[]) => void) {
        var securityfilter = { username: 1, publickey: 1 }
        if (options.request.searchtext) {
            if (options.request.searchtext.trim() == "") { cb(undefined, []); return; }
            this.db.users.find({
                $or: [{ 'username': { '$regex': options.request.searchtext } },
                { 'email': options.request.searchtext }]
            }, securityfilter, (err: Error, result: User[]) => {
                if (err) { cb({ error: "db error" }); return; }
                if (result) { cb(undefined, result) }
            })
        }

        if (options.request.username) {
            this.db.users.findOne({ username: options.request.username }, securityfilter, (err: Error, result: User) => {
                if (err) { cb({ error: "db error" }); return; }
                if (result) { cb(undefined, result) }
            })
        }
    }

    // --------------------------------- 

    workflow(options: { packet: CorePacket, state: CorePacket }, cb: (err: Error | undefined, result?: CorePacket) => void) {

        var packet = options.packet;
        var state = options.state;

        console.log(options);

        if (packet.workflowCode == undefined) { cb(undefined, packet); return; }

        let sandbox: any = { packet, state }
        sandbox.callback = (packetProcessed: CorePacket) => {
            cb(undefined, packetProcessed)
        }

        const vm = new vm2.VM({ timeout: 100, sandbox })

        try {
            vm.run(packet.workflowCode)
        } catch (err) {
            packet.workflowerror = err.toString();
            logger.log({ message: "workflow error", data: { packet, state, err }, level: "warn" })
            cb(undefined, packet);
        }
    }
    // -------------------------------
}


