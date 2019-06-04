var net = require("net");
import * as events from "events";
import { log } from "../../log"
import { Plugin } from "../plugin"
import express = require('express');
import { checkExisting } from "./backup_notifications";

const webpush = require("web-push");

export class PluginNotifications extends Plugin {
  db: any;
  eventHub: events.EventEmitter;
  serversMem: any[] = [];
  name = "notifications";

  //todo make this part of config file.. not in source code.
  publicVapidKey = "BNOtJNzlbDVQ0UBe8jsD676zfnmUTFiBwC8vj5XblDSIBqnNrCdBmwv6T-EMzcdbe8Di56hbZ_1Z5s6uazRuAzA";
  privateVapidKey = "IclWedYTzNBuMaDHjCjA1B5km-Y3NAxTGbxR7BqhU90";

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.eventHub = eventHub;

    webpush.setVapidDetails("mailto:prototype@iotnxt.com", this.publicVapidKey, this.privateVapidKey);

    log("PLUGIN", this.name, "LOADED");

    // recieve device notification subscriptions
    app.post("/api/v3/iotnxt/subscribe", (req: any, res: any) => {
      this.subscribe(req.user.apikey, req.body);
      res.status(201).json({});
    });
  }

  subscribe(apikey: string, subscriptionData: any) {
    this.db["plugins_" + this.name].find({ apikey, subscriptionData }, (e: Error, dbSubscriptions: any) => {
      if (dbSubscriptions.length == 0) {
        log("PLUGIN", this.name, "SUBSCRIPTION");
        this.db["plugins_" + this.name].save({ apikey, subscriptionData })
      }
    })
  }

  handlePacket(deviceState: any, packet: any, user: any, cb: Function) {
    log("PLUGIN", this.name, "HANDLE PACKET");
    //this.checkExisting(deviceState.apikey);

    if (deviceState.newdevice) {
      this.db["plugins_" + this.name].find({ apikey: deviceState.apikey }, (e: Error, dbSubscriptions: any) => {

        for (var sub of dbSubscriptions) {
          // IF NEW DEVICE:
          var message = "Device Added";
          var newDeviceNotification = {
            type: "NEW DEVICE ADDED",
            device: deviceState.devid,
            created: packet._created_on,
            notified: true,
            seen: false
          }

          if (user.notifications) {
            user.notifications.push(newDeviceNotification)
          } else {
            user.notifications = [newDeviceNotification]
          }

          this.db.users.update({ apikey: user.apikey }, user, (err: Error, updated: any) => {
            if (err) console.log(err);
            if (updated) {
              this.eventHub.emit("plugin", {
                plugin: this.name,
                event: {
                  newdevice: true,
                  device: deviceState
                }
              })
              webpush.sendNotification(sub.subscriptionData, message).then((response: any) => {
                console.log(response);
              }).catch((err: any) => console.error(err));
            };
          })
        }
      });
    }


  };

  checkExisting(apikey: string) {
    log("PLUGIN", this.name, "checkExisting");

    // this.db.users.findOne({ apikey }, (err: Error, state: any, info: any) => {
    //   this.findNotified(state.notifications, apikey, info);
    //   this.findSeen(state.notifications, apikey, info);
    // })
  }

  findNotified(array: any, apikey: string, info: any) {
    var t = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i].notified == undefined || array[i].notified == null) {

        array[i].notified = false;

        this.eventHub.emit("info", info)

        this.db.users.update({ apikey }, { $set: { notifications: t } }, (err: Error, updated: any) => {
          this.eventHub.emit("notification")
        })
      }
      t.push(array[i]);
    }
  }

  findSeen(array: any, apikey: string, info: any) {
    var t = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i].seen == undefined || array[i].seen == null) {

        array[i].seen = false;

        this.eventHub.emit("info", info)

        this.db.users.update({ apikey }, { $set: { notifications: t } }, (err: Error, updated: any) => {
          this.eventHub.emit("notification")
        })
      }
      t.push(array[i]);
    }
  }
}