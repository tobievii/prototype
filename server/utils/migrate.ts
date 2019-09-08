/** This code helps to migrate database from 5.0.x to 5.1.x
 *
 *  Changes:
 *
 *  db.states
 *
 *  device id parameter renamed from "devid" to "id" to conform to the rest of the protocol and system standard.
 */


import { EventEmitter } from "events";
import { logger } from "../shared/log"
import { DocumentStore } from "../core/data";

import * as _ from "lodash"
import { User } from "../shared/interfaces";



export class Migration extends EventEmitter {
    db: any;

    constructor(options: { documentstore: DocumentStore }) {
        super();
        this.db = options.documentstore.db;
        //logger.log({message:{msg:"Core constructor", options}, level:"info"})

        console.log("Migration 5.0 to 5.1 helper: ")
        this.migrateDeviceStatesId(() => {
            this.migrateDeviceStateUsernames(() => {
                this.migrateDeviceStateWidgets(() => {
                    console.log("done.")
                })
            })
        });
    }


    /** migrate device dbs from 5.0 to 5.1 */
    migrateDeviceStatesId(cb: Function) {
        // rename devid to id
        this.db.states.update({ devid: { $exists: true } }, { $rename: { 'devid': 'id', 'payload.data': 'data' } }, (err: Error, result: any) => {
            console.log(result.nModified + " device id updated.")
            cb();
        })
    }


    migrateDeviceStateUsernames(cb: Function) {
        // add user username to device state (this is mostly optimization)
        var countdone = 0;

        this.db.states.find({ username: { $exists: false } }, (err: Error, result: any) => {
            for (var dev of result) {
                var thisdev = JSON.parse(JSON.stringify(dev)); //clone
                this.db.users.findOne({ apikey: dev.apikey }, (errU: Error, user: User) => {
                    if (user) {
                        //this.db.states.update({ apikey: user.apikey }, { $set: { username: user.username } }, (errUpd: Error, resultUpda: any) => {
                        this.db.states.update({ apikey: user.apikey, username: { $exists: false } }, { $set: { username: user.username } }, (errUpd: Error, resultUpda: any) => {
                            console.log(resultUpda.nModified + " device username updated for user " + user.username)
                            countdone++;
                            if (result.length == countdone) (cb())
                        })
                    }
                })
            }

            if (result.length == 0) cb();
        })
    }

    migrateDeviceStateWidgets(cb: Function) {
        // migrate widgets
        this.db.states.find({ layout: { $exists: true } }, (err: Error, result: any) => {

            if (result.length == 0) cb();

            var counttodo = 0;
            var countdone = 0;

            for (var dev of result) {
                var updatethisdev = false;
                for (var widget of dev.layout) {
                    if (widget.datapath) {
                        if (widget.datapath.indexOf("root.payload.data") >= 0) {
                            widget.datapath = widget.datapath.replace("root.payload.data", "root.data");
                            updatethisdev = true;
                            counttodo++;
                        }
                    }
                }


                if (updatethisdev) {
                    this.db.states.update({ "_id": dev["_id"] }, dev, (e: Error, r: any) => {
                        console.log(dev.id + " widgets migrated for user " + dev.username)
                        countdone++;

                        if (countdone == counttodo) cb();
                    })
                }
            }

            if (counttodo == 0) { cb(); }

        })
        // end migrate widget
    }

}


