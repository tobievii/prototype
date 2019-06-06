var net = require("net");
import * as events from "events";
import { log } from "../../log"
import { Plugin } from "../plugin"
import express = require('express');


const webpush = require("web-push");

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

  //todo make this part of config file.. not in source code.
  publicVapidKey = "BNOtJNzlbDVQ0UBe8jsD676zfnmUTFiBwC8vj5XblDSIBqnNrCdBmwv6T-EMzcdbe8Di56hbZ_1Z5s6uazRuAzA";
  privateVapidKey = "IclWedYTzNBuMaDHjCjA1B5km-Y3NAxTGbxR7BqhU90";

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.eventHub = eventHub;

    webpush.setVapidDetails("mailto:prototype@iotnxt.com", this.publicVapidKey, this.privateVapidKey);

    log("PLUGIN", this.name, "LOADED");

    app.post("/api/v3/iotnxt/subscribe", (req: any, res: any) => {
      this.subscribe(req.user.apikey, req.body);
      res.status(201).json({});
    });

    app.post("/api/v3/notifications/seen", (req: any, res: any) => {
      this.deviceSeen(this.db, req.user);
      res.json({ result: "done" })
    });
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
  //   //   this.createNotification(this.db, AlarmNotification, result, options);
  //   // })
  // }

  workflow(options: any) {
    this.alarm = function (message: string) {
      // console.log(message + " is the alarm");
      var AlarmNotification = {
        type: "ALARM",
        device: options.devid,
        created: Date.now(),
        message: message,
        notified: true,
        seen: false
      }

      options.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
        // this.createNotification(this.db, AlarmNotification, result, options);
        var opt = options;
        options.db["plugins_" + "notifications"].find({ apikey: options.apikey }, (e: Error, dbSubscriptions: any) => {

          var opt2 = opt;
          for (var sub of dbSubscriptions) {
            options.eventHub.emit("plugin", {
              plugin: "notifications",
              event: {
                notification: AlarmNotification,
                device: options
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
        created: Date.now(),
        message: message,
        notified: true,
        seen: false
      }

      // this.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => { //if In use this format it doesn't understand whats contained in this, tried binding it nothing.
      //   this.createNotification(this.db, AlarmNotification, result, options);
      // })

      options.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
        // this.createNotification(this.db, AlarmNotification, result, options);
        var opt = options;
        options.db["plugins_" + "notifications"].find({ apikey: options.apikey }, (e: Error, dbSubscriptions: any) => {

          var opt2 = opt;
          for (var sub of dbSubscriptions) {
            options.eventHub.emit("plugin", {
              plugin: "notifications",
              event: {
                notification: AlarmNotification,
                device: options
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
    //     this.createNotification(this.db, AlarmNotification, result, options);
    //   })
    // }

    this.info = function (message: string) {
      var AlarmNotification = {
        type: "INFO",
        device: options.devid,
        created: Date.now(),
        message: message,
        notified: true,
        seen: false
      }
      options.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
        // this.createNotification(this.db, AlarmNotification, result, options);
        var opt = options;
        options.db["plugins_" + "notifications"].find({ apikey: options.apikey }, (e: Error, dbSubscriptions: any) => {

          var opt2 = opt;
          for (var sub of dbSubscriptions) {
            options.eventHub.emit("plugin", {
              plugin: "notifications",
              event: {
                notification: AlarmNotification,
                device: options
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
    //     this.createNotification(this.db, AlarmNotification, result, options);
    //   })
    // }
  }

  createNotification(db: any, notification: any, user: any, device: any) {
    this.db["plugins_" + this.name].find({ apikey: device.apikey }, (e: Error, dbSubscriptions: any) => {
      for (var sub of dbSubscriptions) {
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

        webpush.sendNotification(sub.subscriptionData, JSON.stringify({ title: notification })).then((response: any) => {
        }).catch((err: any) => console.error(err));
      }
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
      var message = "Device Added";
      var newDeviceNotification = {
        type: "NEW DEVICE ADDED",
        device: deviceState.devid,
        created: packet._created_on,
        notified: true,
        seen: false
      }
      this.createNotification(this.db, newDeviceNotification, user, deviceState);
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

// export class notificationsExtend extends PluginNotifications {
//   options: any;
//   db: any;
//   eventHub: any;

//   constructor(options: any) {
//     super(config, app, db, eventHub);

//     this.options = options;
//     this.db = db;
//     this.eventHub = eventHub;
//   }

//   alarm(message: string) {
//     console.log(message + " is the alarm");
//     // var AlarmNotification = {
//     //   type: "ALARM",
//     //   device: options.devid,
//     //   created: Date.now(),
//     //   message: message,
//     //   notified: true,
//     //   seen: false
//     // }

//     // this.db.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
//     //   this.createNotification(this.db, AlarmNotification, result, options);
//     // })
//   }


// }