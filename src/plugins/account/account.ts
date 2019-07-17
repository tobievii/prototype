import { Plugin } from "../plugin"
import * as events from "events";
import express = require('express');
import * as _ from "lodash";
import { log } from "../../log"

export class PluginAccount extends Plugin {
    db: any;
    name = "account";

    constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
        super(app, db, eventHub);
        this.db = db;

        log("PLUGIN", this.name, "LOADED");

        app.post("/api/v3/account/checkupdateusername", (req: any, res: any) => {
            this.checkupdateusername(req.body.username, (result: any) => {
                res.json(result)
            })
        })

        app.post("/api/v3/account/updateusername", (req: any, res: any) => {
            this.checkupdateusername(req.body.username, (result: any) => {
                if (result.available == true) {
                    this.updateusername(req.user.uuid, result.username, () => {
                        res.json({})
                    })
                }
            })
        })

        app.get("/api/v3/user/:username", (req: any, res: any) => {
            this.getuser(req.params.username, (user: any) => {
                res.json(user);
            })
        })

    }

    checkupdateusername(username: string, cb: any) {
        //checks to see if a username has been taken by someone
        this.db.users.find({ username: username }).count((e: Error, result: any) => {
            if (result == 0) {
                // available
                cb({ username: username, available: true })
            } else {
                cb({ username: username, available: false })
            }

        })
    }

    updateusername(uuid: any, username: string, cb: any) {
        this.db.users.findOne({ uuid: uuid }, (e: Error, user: any) => {
            user["_last_seen"] = new Date();
            user["username"] = this.cleaner(username);
            user["usernameSet"] = true;
            this.db.users.update({ uuid: uuid }, user, (e2: Error, r2: any) => {
                cb();
            })
        })

    }

    cleaner(str: string) {
        var strLower = str.toLowerCase();
        return strLower.replace(/\W/g, '');
    }

    getuser(username: any, cb: any) {
        // gets a user by username and sanitizes data for security purposes.
        this.db.users.findOne({ username: username }, (e: Error, user: any) => {
            //delete user["_id"]
            var cleandata = _.clone(user);
            delete cleandata["password"]
            delete cleandata["uuid"]

            this.db.states.find({ apikey: user.apikey }, (e: Error, states: any) => {
                cleandata.devicecount = states.length;
                cb(cleandata);
            })
        })
    }
}

