import * as events from "events";

export const name = "notifications"

export const workflowDefinitions = [
  "var " + name + " = { ",
  "warning: (message:string)",
  "alarm1: (message:string)",
  "info: (message:string)",
  "}"
];

var timer: any;
var eventHubGlobal: any;
var dbGlobal: any;

export function workflow(options: any) {
  this.alarm1 = function (message: string) {
    var AlarmNotification = {
      type: "ALARM",
      device: options.devid,
      created: Date.now(),
      message: message,
      notified: true,
      seen: false
    }

    dbGlobal.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
      createNotification(dbGlobal, AlarmNotification, result, { apikey: options.apikey });
    })
  }

  this.warning = function warning(message: string) {
    console.log(message);

    var AlarmNotification = {
      type: "WARNING",
      device: options.devid,
      created: Date.now(),
      message: message,
      notified: true,
      seen: false
    }

    dbGlobal.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
      createNotification(dbGlobal, AlarmNotification, result, { apikey: options.apikey });
    })
  }

  this.info = function info(message: string) {
    console.log(message);

    var AlarmNotification = {
      type: "INFO",
      device: options.devid,
      created: Date.now(),
      message: message,
      notified: true,
      seen: false
    }

    dbGlobal.users.findOne({ apikey: options.apikey }, (err: Error, result: any) => {
      createNotification(dbGlobal, AlarmNotification, result, { apikey: options.apikey });
    })
  }
}

function Timer(fn: any, t: any) {
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

var p = 0;

function getWarningNotification(db: any) {
  //console.log("Ran warning at " + new Date())
  var deviceTime: any;

  var now: any = new Date();
  var dayago = new Date(now - (1000 * 60 * 60 * 24));

  db.states.find({ "_last_seen": { $lte: dayago }, notification24: { $exists: false } }, (e: Error, listDevices: any) => {
    for (var s in listDevices) {
      var device = listDevices[s]
      db.states.update({ key: device.key }, { $set: { notification24: true } }, (err: any, result: any) => {

        var WarningNotificationL = {
          type: "CONNECTION DOWN 24HR WARNING",
          device: device.devid,
          created: new Date(),
          notified: true,
          seen: false
        };

        db.users.update({ apikey: device.apikey }, { $push: { notifications: WarningNotificationL } }, (err: Error, updated: any) => {
          eventHubGlobal.emit("notification", WarningNotificationL, device);
        })
      })
    }
  })

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
    timer.reset(deviceTime);
    timer.stop();
    timer.start();
    msToHMS(deviceTime);
  })
}

function msToHMS(ms: any) {

  var seconds: any = ms / 1000;

  var hours: any = seconds / 3600;
  seconds = seconds % 3600;

  var minutes: any = seconds / 60;

  seconds = seconds % 60;
  console.log("Next Run in:\t\t\t" + hours.toFixed(0) + ":" + minutes.toFixed(0) + ":" + seconds.toFixed(0))
}

export function init(app: any, db: any, eventHub: events.EventEmitter) {
  eventHubGlobal = eventHub;
  dbGlobal = db;
  app.post("/api/v3/notifications/seen", (req: any, res: any) => {
    deviceSeen(db, req.user);
    res.json({ result: "done" })
  });

  timer = new Timer(function () {
    if (p == 0) {
      console.log("Ran warning at " + new Date() + "  3")
      p = 1
    } else {
      getWarningNotification(db);
    }
  }, 5000);
}

export function createNotification(db: any, notification: any, user: any, device: any) {
  eventHubGlobal.emit("notification", notification, device);

  if (user.notifications) {
    user.notifications.push(notification)
  } else {
    user.notifications = [notification]
  }

  db.users.update({ apikey: user.apikey }, user, (err: Error, updated: any) => {
    if (err) console.log(err);
    if (updated) console.log(updated);
  })
}

export function deviceSeen(db: any, user: any) {
  db.users.findOne({ apikey: user.apikey }, (err: Error, result: any) => {
    var notifications = result.notifications;
    var final = [];

    for (var notification in notifications) {
      if (notifications[notification].seen == false) {
        notifications[notification].seen = true;
      }
      final.push(notifications[notification]);
    }

    eventHubGlobal.emit("notification", undefined, user.apikey);

    db.users.update({ apikey: user.apikey }, { $set: { notifications: final } }, (err: Error, updated: any) => {
    })
  });
}

export function checkExisting(req: any, res: any, db: any) {

  db.users.findOne({ apikey: req.user.apikey }, (err: Error, state: any, info: any) => {

    function findNotified(array: any) {
      var t = [];
      for (var i = 0; i < array.length; i++) {
        if (array[i].notified == undefined || array[i].notified == null) {

          array[i].notified = false;

          eventHubGlobal.emit("info", info)

          db.users.update({ apikey: req.user.apikey }, { $set: { notifications: t } }, (err: Error, updated: any) => {
            eventHubGlobal.emit("notification")
            if (err) res.json(err);
            if (updated) res.json(updated);
          })
        }
        t.push(array[i]);
      }
    }

    function findSeen(array: any) {
      var t = [];
      for (var i = 0; i < array.length; i++) {
        if (array[i].seen == undefined || array[i].seen == null) {

          array[i].seen = false;

          eventHubGlobal.emit("info", info)

          db.users.update({ apikey: req.user.apikey }, { $set: { notifications: t } }, (err: Error, updated: any) => {
            eventHubGlobal.emit("notification")
            if (err) res.json(err);
            if (updated) res.json(updated);
          })
        }
        t.push(array[i]);
      }
    }

    findNotified(state.notifications);
    findSeen(state.notifications);
  })
}

export var bot: any;


