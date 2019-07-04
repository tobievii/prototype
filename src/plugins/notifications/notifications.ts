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
  stop: any;
  start: any;
  reset: any;
  p = 0;

  publicVapidKey: any;
  privateVapidKey: any;

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.publicVapidKey = config.webpushkeys.publicVapidKey
    this.privateVapidKey = config.webpushkeys.privateVapidKey
    this.db = db;
    this.eventHub = eventHub;

    webpush.setVapidDetails("mailto:prototype@iotnxt.com", this.publicVapidKey, this.privateVapidKey);

    log("PLUGIN", this.name, "LOADED");

    eventHub.on("deviceShare", (data: any) => {
      this.createNotification(this.db, data.notification, data.device);
    })

    // recieve device notification subscriptions
    app.post("/api/v3/iotnxt/subscribe", (req: any, res: any) => {
      this.subscribe(req.user.apikey, req.body);
      res.status(201).json({});
    });

    app.get("/api/v3/notifications/seen", (req: any, res: any) => {
      this.deviceSeen(this.db, req.user);
      res.json({ result: "done" })
    });

    //Needs to be changed so that the notification is directly sent instead of being featched
    app.get("/api/v3/notifications/getNew", (req: any, res: any) => {
      this.getNewNotification(this.db, req.user, (result: any) => {
        res.json(result);
      })
    });

    app.get("/api/v3/notifications/publicKey", (req: any, res: any) => {
      res.json(this.publicVapidKey)
    });
  }

  timer = this.timerfunction(() => {
    if (this.p == 0) {
      console.log("Ran warning at " + new Date())
      this.p = 1
    } else {
      this.getWarningNotification(this.db);
    }
  }, 1000);

  getNewNotification(db: any, user: any, res: any) {
    db.users.findOne({ apikey: user.apikey }, (err: Error, result: any) => {
      var notifications = [];
      if (err) res({ err: err });
      if (result) {
        for (var n in result.notifications) {
          if (!result.notifications[n].notified) {
            notifications.push(result.notifications[n])
          }
        }
        res({ result: notifications })
        this.deviceNotified(db, user);
      };
    })
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

  deviceNotified(db: any, user: any) {
    db.users.findOne({ apikey: user.apikey }, (err: Error, result: any) => {
      var notifications = result.notifications;
      var final = [];

      for (var notification in notifications) {
        if (notifications[notification].notified == false) {
          notifications[notification].notified = true;
        }
        final.push(notifications[notification]);
      }

      db.users.update({ apikey: user.apikey }, { $set: { notifications: final } }, (err: Error, updated: any) => {
      })
    });
  }

  workflow(options: any) {
    this.alarm = function (message: string) {
      // console.log(message + " is the alarm");
      var AlarmNotification = {
        type: "ALARM",
        device: options.devid,
        created: new Date(),
        message: message,
        notified: false,
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
        notified: false,
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
        notified: false,
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

  sharedDevice(db: any, notification: any, device: any) {
    db.users.findOne({ email: notification.to }, (err: Error, user: any) => {
      notification.notified = false;

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
      })
    })
  }

  createNotification(db: any, notification: any, device: any) {

    if (notification.type == "A DEVICE WAS SHARED WITH YOU") {
      this.sharedDevice(db, notification, device);
    } else {
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
            notification.notified = false;

            this.eventHub.emit("sharedDevice", {
              plugin: this.name,
              event: {
                notification: notification,
                user: user.username
              }
            })

            if (user.notifications) {
              user.notifications.push(notification)
            } else {
              user.notifications = [notification]
            }

            db.users.update({ apikey: user.apikey }, user, (err: Error, updated: any) => {
              if (err) console.log(err);
            })

            webpush.sendNotification(subscription, JSON.stringify({ notification }), opt).then((response: any) => {
            }).catch((err: any) => console.error(err));
          }
        });
      });
    }
  }

  subscribe(apikey: string, subscriptionData: any) {
    this.db["plugins_" + this.name].find({ apikey: apikey }, (e: Error, dbSubscriptions: any) => {
      if (dbSubscriptions.length == 0) {
        log("PLUGIN", this.name, "SUBSCRIPTION");
        this.db["plugins_" + this.name].save({ apikey, subscriptionData })
      }
    })
  }

  handlePacket(deviceState: any, packet: any, cb: Function) {
    log("PLUGIN", this.name, "HANDLE PACKET");
    //this.checkExisting(deviceState.apikey);
    if (deviceState.notification24 == true) {
      this.db.states.update({ key: deviceState.key }, { $unset: { notification24: 1 } }, (err: any, result: any) => {
        this.eventHub.emit("plugin", {
          plugin: this.name,
          event: {
            device: deviceState
          }
        })
      })
    }

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

    if (deviceState.boundaryLayer != undefined) {
      if (deviceState.boundaryLayer.inbound == false) {
        var message = "";
        var AlarmNotification = {
          type: "ALARM",
          device: deviceState.devid,
          created: Date.now(),
          message: message,
          notified: true,
          seen: false
        }
        AlarmNotification.message = "has gone out of its boundary";
        this.createNotification(this.db, AlarmNotification, deviceState);
      }
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

  timerfunction(fn: any, t: any) {
    var timerObj: any = setInterval(fn, t);

    this.stop = function () {
      if (timerObj) {
        clearInterval(timerObj);
        timerObj = null;
      }
      return this;
    }

    // start timer using current settings (if it's not already running)
    this.start = function () {
      if (!timerObj) {
        this.stop();
        timerObj = setInterval(fn, t);
      }
      return this;
    }

    // start with new interval, stop current interval
    this.reset = function (newT: any) {
      if (newT != null || newT != undefined) {
        t = newT;
      }
      return this.stop().start();
    }
  }

  getWarningNotification(db: any) {
    //console.log("Ran warning at " + new Date())
    var deviceTime: any;

    var now: any = new Date();
    var dayago = new Date(now - (1000 * 60 * 60 * 24));

    db.states.find({ "_last_seen": { $lte: dayago }, notification24: { $exists: false } }, (e: Error, listDevices: any) => {
      // console.log(listDevices)
      for (var s in listDevices) {
        var device = listDevices[s]
        this.db["plugins_" + this.name].find({ apikey: device.apikey }, (e: Error, dbSubscriptions: any) => {
          for (var sub of dbSubscriptions) {
            var subscription = {
              endpoint: sub.subscriptionData.endpoint,
              keys: {
                p256dh: sub.subscriptionData.keys.p256dh,
                auth: sub.subscriptionData.keys.auth
              }
            }
            db.states.update({ key: device.key }, { $set: { notification24: true } }, (err: any, result: any) => {

              var WarningNotificationL = {
                type: "CONNECTION DOWN 24HR WARNING",
                device: device.devid,
                created: new Date(),
                notified: false,
                seen: false
              };
              // this.createNotification(this.db, WarningNotificationL, device)
              db.users.update({ apikey: device.apikey }, { $push: { notifications: WarningNotificationL } }, (err: Error, updated: any) => {
                console.log("here")
                this.eventHub.emit("warningNotification", {
                  plugin: "notifications",
                  event: {
                    notification: WarningNotificationL,
                    device: { apikey: device.apikey, devid: device.devid }
                  }
                })
              })
              webpush.sendNotification(subscription, JSON.stringify(WarningNotificationL)).then((response: any) => {
              }).catch((err: any) => console.error(err));
            })
          }
        });
      }

      db.states.find({}, { devid: 1, apikey: 1, _last_seen: 1 }, (err: Error, states: any) => {
        var final: any;
        var x = 0;
        for (var state in states) {
          if (x == 0) {
            final = states[state];
          } else if (states[state]._last_seen <= dayago && states[state]._last_seen > final._last_seen) {
            final = states[state];
          }
        }
        deviceTime = final._last_seen.getTime() - dayago.getTime();
        if (deviceTime < 0) {
          deviceTime = 86000000;
        }
        this.reset(deviceTime);
        this.stop();
        this.start();
        this.msToHMS(deviceTime);
      })
    })
  }

  msToHMS(ms: any) {

    var seconds: any = ms / 1000;

    var hours: any = seconds / 3600;
    seconds = seconds % 3600;

    var minutes: any = seconds / 60;

    seconds = seconds % 60;
    console.log("Next Run in:\t\t\t" + hours.toFixed(0) + ":" + minutes.toFixed(0) + ":" + seconds.toFixed(0))
  }

}