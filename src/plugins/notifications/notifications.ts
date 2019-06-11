import * as events from "events";
import { log } from "../../log"
import { Plugin } from "../plugin"
import express = require('express');
import { webpushkeys } from "../../config"
const webpush = require("web-push");

let keys: any = webpushkeys();

export class PluginNotifications extends Plugin {
  db: any;
  eventHub: events.EventEmitter;
  serversMem: any[] = [];
  name = "notifications";
  workflowDefinitions = [
    "var " + this.name + " = { ",
    "warning: (message:string)",
    "alarm: (message:string)",
    "info: (message:string)",
    "}"
  ];
  alarm: any;
  info: any;
  warning: any;
  workflowfunction: any;

  publicVapidKey = keys.publicVapidKey;
  privateVapidKey = keys.privateVapidKey;

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

    app.get("/api/v3/notifications/seen", (req: any, res: any) => {
      this.deviceSeen(this.db, req.user);
      res.json({ result: "done" })
    });

    app.get("/api/v3/notifications/getNew", (req: any, res: any) => {
      db.users.findOne({ apikey: req.user.apikey }, (err: Error, result: any) => {
        res.json(result.notifications[result.notifications.length - 1]);
      })
    });

    app.get("/api/v3/notifications/publicKey", (req: any, res: any) => {
      res.json(this.publicVapidKey)
    });
  }

  getNewNotification(db: any, user: any, res: any) {

  }

  deviceSeen(db: any, user: any) {
    db.users.findOne({ apikey: user.apikey }, (err: Error, result: any) => {
      var notifications = result.notifications;
      var final = [];

      for (var notification in notifications) {
        if (notifications[notification].seen == false) {
          notifications[notification].seen = true;
        }
        final.push(notifications[notification]);
      }

      this.eventHub.emit("plugin", {
        plugin: "notifications",
        event: {
          Seen: true
        }
      })

      db.users.update({ apikey: user.apikey }, { $set: { notifications: final } }, (err: Error, updated: any) => {
      })
    });
  }

  // alarm = function (message: string, options: any) {
  //   console.log(message + " is the alarm");
  //   // var AlarmNotification = {
  //   //   type: "ALARM",
  //   //   device: options.devid,
  //   //   created: Date.now(),
  //   //   message: message,
  //   //   notified: true,
  //   //   seen: false
  //   // }

  //   // this.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
  //   //   this.createNotification(this.db, AlarmNotification, options);
  //   // })
  // }

  workflow(options: any) {
    this.alarm = function (message: string) {
      // console.log(message + " is the alarm");
      var AlarmNotification = {
        type: "ALARM",
        device: options.devid,
        created: new Date(),
        message: message,
        notified: true,
        seen: false
      }

      options.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
        // this.createNotification(this.db, AlarmNotification, options);
        var opt = options;
        options.db["plugins_" + "notifications"].find({ apikey: options.apikey }, (e: Error, dbSubscriptions: any) => {

          var opt2 = opt;
          for (var sub of dbSubscriptions) {
            options.eventHub.emit("plugin", {
              plugin: "notifications",
              event: {
                notification: AlarmNotification,
                device: { apikey: options.apikey, devid: options.devid }
              }
            })

            if (result.notifications) {
              result.notifications.push(AlarmNotification)
            } else {
              result.notifications = [AlarmNotification]
            }

            opt2.db.users.update({ apikey: result.apikey }, result, (err: Error, updated: any) => {
              if (err) console.log(err);
              if (updated) console.log(updated);
            })

            webpush.sendNotification(sub.subscriptionData, JSON.stringify({ title: AlarmNotification })).then((response: any) => {
            }).catch((err: any) => console.error(err));
          }
        });
      })
    }

    this.warning = (message: string) => {
      // console.log(message + " is the warning");
      var AlarmNotification = {
        type: "WARNING",
        device: options.devid,
        created: new Date(),
        message: message,
        notified: true,
        seen: false
      }

      // this.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => { //if this format is used, VM doesn't understand/access whats contained in "this", tried binding it nothing.
      //   this.createNotification(this.db, AlarmNotification, options);
      // })

      options.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
        // this.createNotification(this.db, AlarmNotification, options);
        options.db["plugins_" + "notifications"].find({ apikey: options.apikey }, (e: Error, dbSubscriptions: any) => {

          for (var sub of dbSubscriptions) {
            options.eventHub.emit("plugin", {
              plugin: "notifications",
              event: {
                notification: AlarmNotification,
                device: { apikey: options.apikey, devid: options.devid }
              }
            })

            if (result.notifications) {
              result.notifications.push(AlarmNotification)
            } else {
              result.notifications = [AlarmNotification]
            }

            options.db.users.update({ apikey: result.apikey }, result, (err: Error, updated: any) => {
              if (err) console.log(err);
              if (updated) console.log(updated);
            })

            webpush.sendNotification(sub.subscriptionData, JSON.stringify({ title: AlarmNotification })).then((response: any) => {
            }).catch((err: any) => console.error(err));
          }
        });
      })
    }
    // this.warning = (message: string) => {
    //   // console.log(message + " is the warning");
    //   var AlarmNotification = {
    //     type: "WARNING",
    //     device: options.devid,
    //     created: Date.now(),
    //     message: message,
    //     notified: true,
    //     seen: false
    //   }

    //   this.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => { if In use this format it doesn't understand whats contained in this, tried binding it nothing.
    //     this.createNotification(this.db, AlarmNotification, options);
    //   })
    // }

    this.info = function (message: string) {
      var AlarmNotification = {
        type: "INFO",
        device: options.devid,
        created: new Date(),
        message: message,
        notified: true,
        seen: false
      }
      options.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
        // this.createNotification(this.db, AlarmNotification, options);
        var opt = options;
        options.db["plugins_" + "notifications"].find({ apikey: options.apikey }, (e: Error, dbSubscriptions: any) => {

          var opt2 = opt;
          for (var sub of dbSubscriptions) {
            options.eventHub.emit("plugin", {
              plugin: "notifications",
              event: {
                notification: AlarmNotification,
                device: { apikey: options.apikey, devid: options.devid }
              }
            })

            if (result.notifications) {
              result.notifications.push(AlarmNotification)
            } else {
              result.notifications = [AlarmNotification]
            }

            opt2.db.users.update({ apikey: result.apikey }, result, (err: Error, updated: any) => {
              if (err) console.log(err);
              if (updated) console.log(updated);
            })

            webpush.sendNotification(sub.subscriptionData, JSON.stringify({ title: AlarmNotification })).then((response: any) => {
            }).catch((err: any) => console.error(err));
          }
        });
      })
    }
    // this.info = function (message: string) {
    //   var AlarmNotification = {
    //     type: "INFO",
    //     device: options.devid,
    //     created: Date.now(),
    //     message: message,
    //     notified: true,
    //     seen: false
    //   }
    //   console.log(options)
    //   options.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
    //     console.log(result)
    //     this.createNotification(this.db, AlarmNotification, options);
    //   })
    // }
  }

  createNotification(db: any, notification: any, device: any) {
    db.users.findOne({ apikey: device.apikey }, (err: Error, user: any) => {
      this.db["plugins_" + this.name].find({ apikey: device.apikey }, (e: Error, dbSubscriptions: any) => {
        for (var sub of dbSubscriptions) {
          var subscription = {
            endpoint: sub.subscriptionData.endpoint,
            keys: {
              p256dh: sub.subscriptionData.keys.p256dh,
              auth: sub.subscriptionData.keys.auth
            }
          }

          var opt = {
            vapidDetails: {
              subject: "mailto:prototype@iotnxt.com",
              publicKey: this.publicVapidKey,
              privateKey: this.privateVapidKey
            }
          }

          this.eventHub.emit("plugin", {
            plugin: this.name,
            event: {
              notification: notification,
              device: device
            }
          })

          if (user.notifications) {
            user.notifications.push(notification)
          } else {
            user.notifications = [notification]
          }

          db.users.update({ apikey: user.apikey }, user, (err: Error, updated: any) => {
            if (err) console.log(err);
            if (updated) console.log(updated);
          })

          webpush.sendNotification(subscription, JSON.stringify({ notification }), opt).then((response: any) => {
          }).catch((err: any) => console.error(err));
        }
      });
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

  handlePacket(deviceState: any, packet: any, cb: Function) {
    log("PLUGIN", this.name, "HANDLE PACKET");
    //this.checkExisting(deviceState.apikey);


    if (deviceState.newdevice) {
      var message = "Device Added";
      var newDeviceNotification = {
        type: "NEW DEVICE ADDED",
        device: deviceState.devid,
        created: packet._created_on,
        notified: true,
        seen: false
      }
      this.createNotification(this.db, newDeviceNotification, deviceState);
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