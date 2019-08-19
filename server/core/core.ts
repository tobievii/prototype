import { EventEmitter } from "events";
import { logger } from "./log"

import * as utils from "../utils/utils"

var geoip = require("geoip-lite");

import * as crypto from "crypto"
import { DocumentStore } from "./data";

import * as lodash from "lodash"

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
                var username;
                if (options.username) { username = options.username; } else {
                    username = options.email.split("@")[0] + Math.round(Math.random() * 10000)
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
                                console.log({ account: usersaved });
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

    account(options: any, cb?: any) {

    }
    // end account

    user(options: { uuid?: string, apikey?: string, email?: string, pass?: string, authorization?: string }, cb: (err: Error | undefined, user?: any) => void) {

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

    }
    // end user

    datapost(options: { user: any, packet: any }, cb: (err: any, result?: any) => void) {
        //device / user?
        if ((options.packet) && (options.user)) {
            const { packet, user } = options;

            if (!cb) cb = () => { }

            // data format error checking
            if (!packet.id) { cb({ error: "id parameter missing" }); return; }
            if (typeof packet.id != "string") { cb({ error: "id must be a string" }); return; }
            if (packet.id == "") { cb({ error: "id may not be empty" }); return; }
            if (packet.id.indexOf(" ") != -1) { cb({ "error": "id may not contain spaces" }); return; }
            if (packet.id.match(/^[a-z0-9_]+$/i) == null) { cb({ "error": "id may only contain a-z A-Z 0-9 and _" }); return; }

            // todo, run through plugins...
            // todo, run through VM

            this.state({ user, id: packet.id }, (err: any, statedb: any) => {
                if (err) { cb({ error: "db error" }) }

                var state: any = {}

                // no state yet, create new entry.
                if (statedb == null) {
                    state = {
                        "_created_on": new Date(),
                        key: utils.generateDifficult(128)
                    }
                }
                if (statedb) {
                    state = statedb;
                }

                // timestamp it.
                state["_last_seen"] = new Date();
                packet.key = state.key;
                packet.apikey = user.apikey;

                packet.meta = {};
                var stateMerged = lodash.merge(state, packet)

                this.db.packets.save(packet, (err: any, result: any) => {
                    this.db.states.save(stateMerged, (err1: any, result1: any) => {
                        if (err1) { }
                        if (result1) {
                            cb(undefined, { result: "success" });
                        }
                    })
                })

                // update device state db.
                //
            })
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

        // all devices
        if ((options.user) && (options.id == undefined)) {
            this.db.states.find({ apikey: options.user.apikey }, (err: Error, result: any) => {
                if (err) { cb({ error: "db error" }); return; }
                cb(undefined, result);
            })
        }
    }

    // returns device packets (history);
    packets(options: any, cb: any) {
        if ((options.id) && (options.user)) {
            this.db.packets.find({ apikey: options.user.apikey, id: options.id }, (err: Error, result: any) => {
                if (err) { cb({ error: "db error" }) }
                if (result) { cb(undefined, result); }
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

    delete(options: any, cb: any) {
        if ((options.id) && (options.user)) {
            this.db.states.remove({ apikey: options.user.apikey, id: options.id }, (err: Error, result: any) => {
                if (err) { cb({ error: "db error" }); }
                cb(undefined, result);
            })
        }
    }
}


