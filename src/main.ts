import { log } from "./log"
log("MAIN \tStart ===============================")

// console.log("PM2 instance id:" + process.env.pm_id)
// console.log(process.env.NODE_APP_INSTANCE)


require('source-map-support').install();
var nodemailer = require("nodemailer")
var _ = require('lodash');
var randomString = require('random-string');
import * as fs from 'fs';
import * as geoip from 'geoip-lite'
const publicIp = require('public-ip');
const requestIp = require('request-ip');

import * as scrypt from "scrypt"

//var scrypt = require("scrypt");
//var config = JSON.parse(fs.readFileSync('../config.json').toString());


import * as trex from './utils'
import * as state from "./state"
//import * as discordBot from './discordBot'

//trex.log(config);

var compression = require('compression')

import express = require('express');



const app = express()
var http = require('http');
var https = require('https');
var cookieParser = require('cookie-parser')
import * as accounts from './accounts'

import * as events from "events";

import * as utilsLib from "./utils"



const { VM } = require('vm2');


var eventHub = new events.EventEmitter();

import * as stats from "./stats"
import { Config } from "./config"
var config = new Config(app, eventHub);
//console.log(config)
var db = config.db;
var version = config.version;
//import { createNotification, checkExisting } from "./plugins/notifications/notifications";

app.disable('x-powered-by');
app.use(cookieParser());
app.use(compression());

app.use(express.static('../public'))
app.use(express.static('../client'))
app.use(express.static('../client/dist'))

app.use('/view', express.static('../client/dist'))
app.use('/u/:username/view', express.static('../client/dist'))


// const bluetooth = require('node-bluetooth');
// const device = new bluetooth.DeviceINQ();


//####################################################################
// PLUGINS
import { pluginsInitialize } from "./plugins/config"

var plugins: any = [];

eventHub.on("device", (data: any) => {
  handleDeviceUpdate(data.apikey, data.packet, { socketio: true }, (e: Error, r: any) => { });
})

eventHub.on("configChange", () => {
  //event to restart all servers on UI infor change
  // config = new Config(app, eventHub);
  // db = config.db;
  // version = config.version;
  // for(var prprocess.env){
  process.exit();
  // }
  //initializeSocketio();
})

eventHub.on("plugin", (data: any) => {
  //log("EVENTHUB", data)

  /*
    In plugins please use this.eventHub.emit("plugin", {plugin: "pluginname", event: {your data in here} });

    In client side code please use:

    socket.on("plugin_pluginname", (event) => {
      console.log(event);
    })

  */

  if (data.plugin && data.event) {
    log("EVENTHUB", data.plugin);
    io.sockets.emit("plugin_" + data.plugin, data.event)
  } else {
    log("EVENTHUB", "DEPRECIATED PLUGIN EVENT FORMAT.")
    io.sockets.emit('plugin', data);
  }
})

// eventHub.on("notification", (notification: any, device: any) => {
//   if (notification != undefined || notification != null) {
//     io.to(device.apikey).emit('pushNotification', notification)
//     io.to(device.apikey).emit("notification");
//     io.to(device.key).emit('notificationState');
//   } else {
//     io.to(device).emit("notification");
//     io.to(device).emit('notificationState');
//   }
// });

//app.use(express.json())
app.use(safeParser);

//FIRST RUN
// OLD: accounts.defaultAdminAccount(db);
utilsLib.checkFirstRun(db);
utilsLib.createUsernamesForOldAccounts(db);
utilsLib.createDeviceKeysForOldAccounts(db);
utilsLib.createPublicKeysforOldAccounts(db);
utilsLib.createIotnxtPublicKeysforOldAccounts(db);

//handle accounts/cookies.
app.use(accounts.midware(db));



db.on('connect', function () {
  log("PLUGINS", "Initialize on db connect")

  plugins = pluginsInitialize(config.configGen, app, db, eventHub);

  initializeSocketio();
})


//####################################################################
// USERS LAST SEEN / ACTIVE
app.use((req: any, res: any, next: any) => {

  if (req.user) {

    if (req.user.level == 0) {
      log("USER\tunregistered" + "\t" + req.url)
    }


    db.users.findOne({ apikey: req.user.apikey }, (e: Error, user: any) => {
      user["_last_seen"] = new Date();
      db.users.update({ apikey: req.user.apikey }, user, (e2: Error, r2: any) => {
        next();
      })
    })
  } else {
    next();
  }

})

//####################################################################

app.get('/', (req: any, res: any) => {

  //redirect main page people to https.
  if (req.protocol == "http") {
    trex.log("HTTP VISITOR")
    if (config.configGen.ssl) {
      res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
      res.end();
    }
  }

  if (req.user) {
    fs.readFile('../public/react.html', (err, data: any) => {
      res.type(".html");
      res.end(data.toString())
    });
  } else {
    res.end("AN ERROR HAS OCCURED. ARE COOKIES ENABLED?")
  }

})

stats.init(app, db);

app.get("/recover/:recoverToken", (req, res) => {
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})

app.get("/accounts/secure", (req, res) => {
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})

app.get('/signout', (req, res) => {
  res.clearCookie("uuid");
  res.redirect('/');
});

// app.get('/api/v3/scanbluetoothDevices', (req: any, res: any) => {
//   var devices: any = [];
//   var done = false;
//   device
//     .on('finished', () => { done = true })
//     .on('found', function found(address: any, name: any) {
//       // console.log('Found: ' + address + ' with name ' + name);
//       devices.push({ address: address, name: name })
//     }).scan();

//   var timerObj = setInterval(() => {
//     if (done == true) {
//       clearInterval(timerObj);
//       res.json(devices)
//     }
//   }, 5000)
// });

// app.get('/api/v3/getPairedDevices', (req: any, res: any) => {
//   device.listPairedDevices((devices: any) => {
//     // console.log(devices)
//     res.json(devices);
//   });

// });

app.post('/signin', accounts.signInFromWeb(db));

app.get("/u/:username", (req, res) => {
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})


// app.post("/subscribe", (req: any, res: any) => {
//   const subscription = req.body;
//   res.status(201).json({});

//   const payload = JSON.stringify({ title: "Push Test" });

//   webpush
//     .sendNotification(subscription, payload)
//     .then((response: any) => {
//       // io.to(req.user.apikey).emit('pushNotification', { title: "Push Test" })
//     })
//     .catch((err: any) => console.error(err));
// });

app.get("/u/:username/view/:devid", (req: any, res: any) => {
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})

app.get("/notifications", (req: any, res: any) => {
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})

app.get("/logs", (req: any, res: any) => {
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})

app.get('/settings', (req: any, res: any) => {
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
});

app.get('/view/:id', (req: express.Request | any, res: express.Response | any) => {
  trex.log("client is viewing: " + JSON.stringify(req.params));
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})

app.get('/view/:id/:mode', (req: express.Request | any, res: express.Response | any) => {
  trex.log("client is viewing: " + JSON.stringify(req.params));
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})

app.get('/fbp', (req: express.Request | any, res: express.Response | any) => {
  trex.log("fbp:");
  fs.readFile('../public/react.html', (err, data: any) => {
    res.end(data.toString())
  })
})

app.get('/api/v3/version', (req: any, res: any) => {
  res.json(version);
})

app.get('/api/v3/publicip', (req: any, res: any) => {
  const clientIp = requestIp.getClientIp(req);
  // console.log(clientIp)
  res.json(clientIp);
})

app.get('/api/v3/account', (req: any, res: any) => {
  var cleanUser = _.clone(req.user);

  delete cleanUser.password;
  res.json(cleanUser);
})

app.get('/api/v3/account/stats', (req: any, res: any) => {
  stats.accountStats(req.user, (err: Error, stats: any) => {
    if (err) { res.json(err); }
    res.json(stats)
  })
})


// This is to update the workflow on a device.
app.post("/api/v3/workflow", (req: any, res: any) => {
  if (req.body) {
    trex.log("WORKFLOW UPDATE");

    state.updateWorkflow(db, req.user, req.body.id, req.body.code, (err: Error, result: any) => {
      if (err) res.json(err);
      if (result) res.json(result);
    })

  } else {
    trex.log("WORKFLOW API ERROR")
  }
})

app.post("/api/v3/packets", (req: any, res: any, next: any) => {
  if (!req.user) { res.json({ error: "user not authenticated" }); return; }

  var resolved = false;

  // find history by key
  if (req.body.key) {
    resolved = true;
    db.states.findOne({ key: req.body.key }, (e: Error, device: any) => {
      if (req.body.datapath) {
        var query: any = { apikey: device.apikey, devid: device.devid }
        query["payload." + req.body.datapath] = { $exists: true }
        var result: any = []
        db.packets.find(query).sort({ "_id": -1 }).limit(50, (packetError: Error, rawpackets: any) => {
          if (packetError) { res.json(packetError); console.log(packetError); }

          var packets: any = []

          for (var p in rawpackets) {
            var found = 0;
            for (var o in packets) {
              if (rawpackets[p]["_created_on"] == packets[o]["_created_on"]) {
                found++;
              }
            }
            if (found == 0) { packets.push(rawpackets[p]) }
          }

          for (var pa of packets) {
            var clean: any = {}
            //clean[req.body.datapath] = _.get(p, "payload." + req.body.datapath, "notfound");
            //clean["_created_on"] = p["_created_on"]
            clean["x"] = pa["_created_on"]
            clean["y"] = _.get(pa, "payload." + req.body.datapath, "notfound");
            result.push(clean)
          }
          res.json(result);
        })
      }
    })
  }

  ////////////////////////////////
  var limit = 25;
  if (req.body.limit) { limit = req.body.limit }
  if (req.body.id) {
    resolved = true;
    db.packets.find({ apikey: req.user.apikey, devid: req.body.id }).sort({ _id: -1 }).limit(limit, (err: Error, rawpackets: any) => {
      rawpackets = rawpackets.reverse();
      var packets = []

      for (var p in rawpackets) {
        //packets.push({data: rawpackets[p].payload.data, timestamp: rawpackets[p].payload.timestamp})
        var payload = rawpackets[p].payload;
        payload.meta = { userAgent: rawpackets[p].meta.userAgent, method: rawpackets[p].meta.method }
        packets.push(payload)
      }
      res.json(packets);
    })
  }

  ///////////////////////////////////

  // Packet History for log component
  if (req.body.log) {
    resolved = true
    db.packets.find({ apikey: req.user.apikey }).sort({ _id: -1 }).limit(limit, (err: Error, rawpackets: any) => {
      // rawpackets = rawpackets.reverse();
      var packets = []

      for (var p in rawpackets) {
        var payload = rawpackets[p].payload;
        // payload.meta = { userAgent: rawpackets[p].meta.userAgent, method: rawpackets[p].meta.method }
        packets.push(payload)
      }
      io.emit("log", payload)

      res.json(packets);
    })
  }

  ////////////////////////////////////////

  if (resolved == false) {
    res.json({ error: "We require either an id or device key for this query" })
  }
});

app.post("/api/v3/devicePathPackets", (req: any, res: any, next: any) => {

  if (!req.user) { res.json({ error: "user not authenticated" }); return; }

  var limit = 25;
  if (req.body.limit) { limit = req.body.limit }

  if (req.body.id) {
    db.packets.find({ apikey: req.user.apikey, devid: req.body.id }).sort({ _id: -1 }).limit(limit, (err: Error, rawpackets: any) => {
      // db.packets.find({ apikey: req.user.apikey, devid: req.body.id }).sort({ _id: -1 }).limit(limit, (err: Error, rawpackets: any) => {
      rawpackets = rawpackets.reverse();
      var packets = []
      var latlng = {
        ll:
          [
            0.01,
            0.01
          ]
      }

      for (var p in rawpackets) {
        var payload = rawpackets[p];
        var devicepacket: any;
        var t = {
          id: payload.payload.id,
          timestamp: payload.payload.timestamp
        }
        devicepacket = t;

        if (payload.payload.data.gps != undefined || payload.payload.data.gps != null) {
          devicepacket.data = payload.payload.data;
        } else if (payload.meta.ipLoc != undefined || payload.meta.ipLoc != null) {
          if (payload.meta.ipLoc.ll == undefined || payload.meta.ipLoc == null) {
            payload.meta.ipLoc = latlng;
          }
          devicepacket.ipLoc = payload.meta.ipLoc;
        } else {
          if (payload.meta.ipLoc == undefined || payload.meta.ipLoc == null) {
            payload.meta.ipLoc = latlng;
            devicepacket.ipLoc = payload.meta.ipLoc;
          }
        }
        packets.push(devicepacket)
      }
      res.json(packets);
    })
  } else {
    res.json({ error: "Please select a device to view device information/dashboard." })
  }
});

// run to update old packet data to have correct timestamp
// app.get("/admin/processpackets", (req:any, res:any)=>{
//   if (req.user.level < 100) { res.end("no permission"); return; }
//   db.packets.find({"_created_on" : { "$exists" : false }}).limit(10000, (err:Error, packets:any)=>{
//     res.write("packets:\t"+packets.length);
//     for (var packet of packets) {
//       if (packet["_created_on"] == undefined) {
//         packet["_created_on"] = new Date(packet.meta.created.jsonTime);
//         db.packets.update({"_id" : packet["_id"]}, packet)
//       }      
//     }
//     res.end("\ndone.")
//   })
// })

// run to update old packet data to have correct timestamp
app.get("/admin/processusers", (req: any, res: any) => {
  if (req.user.level < 100) { res.end("no permission"); return; }

  db.users.find({ "_created_on": { "$exists": false } }).limit(10000, (err: Error, users: any) => {
    res.write("users:\t" + users.length);
    for (var user of users) {
      if (user["_created_on"] == undefined) {
        user["_created_on"] = new Date(user.created.jsonTime);
        db.users.update({ "_id": user["_id"] }, user)
      }
    }
    res.end("\ndone.")
  })
})

app.post("/api/v3/account/secure", (req: any, res: any, next: any) => {
  var scryptParameters = scrypt.paramsSync(0.1);

  db.users.find({ encrypted: { $exists: false } }, (err: Error, result: any) => {
    for (var i in result) {
      var newpass = scrypt.kdfSync(result[i].password, scryptParameters);
      db.users.update({ email: result[i].email }, { $set: { password: newpass, encrypted: true } })
    }
  })
});

app.get("/admin/processusersseen", (req: any, res: any) => {
  if (req.user.level < 100) { res.end("no permission"); return; }

  db.users.find({ "_last_seen": { "$exists": false } }).limit(10000, (err: Error, users: any) => {
    res.write("users:\t" + users.length);
    for (var user of users) {
      if (user["_last_seen"] == undefined) {
        user["_last_seen"] = new Date(user.created.jsonTime);
        db.users.update({ "_id": user["_id"] }, user)
      }
    }
    res.end("\ndone.")
  })
})

app.get("/admin/processstates", (req: any, res: any) => {
  if (req.user.level < 100) { res.end("no permission"); return; }

  db.states.find({ "_last_seen": { "$exists": false } }).limit(10000, (err: Error, states: any) => {
    res.write("states:\t" + states.length);
    for (var state of states) {

      if (state["_last_seen"] == undefined) {
        state["_last_seen"] = new Date(state.meta.created.jsonTime);
      }
      if (state["_created_on"] == undefined) {
        state["_created_on"] = new Date(state.meta.created.jsonTime);
      }

      db.states.update({ "_id": state["_id"] }, state)
    }
    res.end("\ndone.")
  })
})

app.post("/api/v3/view", (req: any, res: any, next: any) => {
  if (!req.user) { res.json({ error: "user not authenticated" }); return; }


  if (req.body.username) {
    //

    if (req.body.username != req.user.username) {
      if (req.user.level < 100) {
        db.states.findOne({ devid: req.body.id }, { key: 1 }, (err: Error, give: any) => {
          db.users.findOne({ $and: [{ username: req.user.username }, { 'shared.keys.key': give.key }] }, (err: Error, found: any) => {
            if (found == null) {
              res.json({ error: "must be level 100" }); return
            }
          })
        })
      }
    }
    db.users.findOne({ username: req.body.username }, (dbError: Error, user: any) => {
      if (user) {
        ///
        if (req.body.id) {
          db.states.findOne({ $and: [{ apikey: user.apikey, devid: req.body.id }] }, (err: Error, state: any) => {
            if (state == null || state == "" || state == undefined || state.length == 0) { res.json({ "error": "id not found" }); return; }

            if (state) {
              var viewState = state.payload;
              viewState.meta = { userAgent: state.meta.userAgent, method: state.meta.method }
              res.json(viewState);
            } else {
              res.json({ error: "state not found" })
            }
          })
        } else {
          res.json({ error: "Please select a device to view device information/dashboard." })
        }
        ///
      }
    });
    //
  } else {
    if (req.body.id) {
      db.states.findOne({ $and: [{ apikey: req.user.apikey, devid: req.body.id }] }, (err: Error, state: any) => {

        if (state == null) { res.json({ "error": "id not found" }); return; }

        if (state) {
          var viewState = state.payload;
          viewState.meta = { userAgent: state.meta.userAgent, method: state.meta.method }
          res.json(viewState);
        } else {
          res.json({ error: "state not found" })
        }


      })
    } else {
      res.json({ error: "Please select a device to view device information/dashboard." })
    }
  }

});

app.post("/api/v3/state", (req: any, res: any) => {
  findstate(req, res);
});

async function findstate(req: any, res: any) {


  if (req.body.username) {
    if (req.body.username != req.user.username) {

      if (req.user.level < 100) {
        await db.states.findOne({ devid: req.body.id }, (err: Error, give: any) => {
          db.users.findOne({ $and: [{ username: req.user.username }, { 'shared.keys.key': give.key }] }, (err: Error, found: any) => {
            if (give.public == false || give.public == null || give.public == undefined || !give.public || give.public == "") {
              if (found == null || found.length == 0 || !found || found == undefined || found == "") {
                res.json({ error: "must be level 100" }); return;
              }
            }
          })
        });
      }
    }

    await db.users.findOne({ username: req.body.username }, (dbError: Error, user: any) => {
      if (user) {
        if (req.body.id) {
          db.states.findOne({ $and: [{ apikey: user.apikey, devid: req.body.id }] }, (err: Error, state: any) => {
            if (state == null || state == undefined) {
              res.json({ error: "Device " + req.body.id + " was not found." })
            } else {
              res.json(state);
            }
          })
        } else {
          res.json({ error: "Please select a device to view device information/dashboard." })
        }
      }
    })
  } else {

    if (!req.user) { res.json({ error: "user not authenticated" }); return; }

    if (req.body.id) {
      db.states.findOne({ $and: [{ apikey: req.user.apikey, devid: req.body.id }] }, (err: Error, state: any) => {

        res.json(state);
      })
    } else {
      res.json({ error: "Please select a device to view device information/dashboard." })
    }
  }
}

app.post('/api/v3/publicStates', (req: any, res: any) => {
  if (req.user.level == 0) {
    db.states.find({ public: true }, { "meta.user": 0, "meta.uuid": 0 }, (err: Error, result: any) => {
      res.json(result);
    })
  }
})

app.post('/api/v3/setprivateorpublic', (req: any, res: any) => {
  //to public
  if (req.body.public == true) {
    if (req.body.type) {
      for (var i in req.body.devid) {
        db.states.update({ key: req.body.devid[i].key }, { $set: { public: true } }, (err: Error, result: any) => {
          res.json(result);
        })
      }
    }
    else if (!req.body.type) {
      db.states.update({ key: req.body.devid }, { $set: { public: true } }, (err: Error, result: any) => {
        res.json(result);
      })
    }
  }
  //to private
  if (req.body.public == false) {
    if (req.body.type) {
      for (var i in req.body.devid) {
        db.states.update({ key: req.body.devid[i].key }, { $set: { public: false } }, (err: Error, result: any) => {
          res.json(result);
        })
      }
    }
    else if (!req.body.type) {
      db.states.update({ key: req.body.devid }, { $set: { public: false } }, (err: Error, result: any) => {
        res.json(result);
      })
    }
  }
})

app.get('/api/v3/states', (req: any, res: any) => {
  if (!req.user) { res.json({ error: "user not authenticated" }); return; }

  db.states.find({ apikey: req.user.apikey }, (err: Error, states: any[]) => {
    var cleanStates = []
    for (var a in states) { cleanStates.push(states[a].payload) }
    res.json(cleanStates);
  })
})

//Share Device
app.post('/api/v3/shared', (req: any, res: any) => {
  if (!req.user) { res.json({ error: "user not authenticated" }); return; }
  db.states.findOne({ $and: [{ apikey: req.user.apikey, devid: req.body.dev }] }, { access: 1, _id: 0 }, (err: Error, states: any) => {
    if (states.access) {
      res.json(states)
    } else {
      res.json({ result: "No Devices" })
    }
  })
})
//Share Device

//unshare Device
app.post('/api/v3/unshare', (req: any, res: any) => {
  if (!req.user) { res.json({ error: "user not authenticated" }); return; }
  db.states.findOne({ $and: [{ devid: req.body.dev }, { apikey: req.user.apikey }] }, { _id: 0, key: 1 }, (err: Error, result: any) => {
    db.users.update({ publickey: req.body.removeuser }, { "$pull": { shared: { keys: { key: result.key } } } })
  })

  db.states.update({ apikey: req.user.apikey, devid: req.body.dev }, { "$pull": { access: { $in: [req.body.removeuser] } } }, (err: Error, states: any) => {
    res.json(states)
  })
  //unshare device
})
//unshare device

// new in 5.0.34:
app.post("/api/v3/states", (req: any, res: any, packet: any) => {
  changePassword(req, res)
  findstates(req, res)

})
async function findstates(req: any, res: any) {
  if (req.body) {
    // find state by username
    if (req.body.username != req.user.username) {
      if (req.user.level < 100) {
        await db.users.findOne({ username: req.body.username }, { apikey: 1, _id: 0 }, (err: Error, sharedwith: any) => {
          db.states.find({ $or: [{ apikey: sharedwith.apikey, 'access': req.user.publickey }, { apikey: sharedwith.apikey, 'public': true }] }, (err: Error, known: any) => {
            if (known == null || known.length == 0 || !known || known == undefined || known == "") {
              res.json([])
              return;
            }
            else {
              res.json(known)
            }
          })
        })
      }
      else if (req.user.level) {
        db.users.findOne({ username: req.body.username }, (e: Error, user: any) => {
          if (e) { res.json({ error: "db error" }) }
          if (user) {
            db.states.find({ apikey: user.apikey }, (er: Error, states: any[]) => {
              var cleanStates: any = []
              for (var a in states) {
                var cleanState = _.clone(states[a])
                delete cleanState["apikey"]
                cleanStates.push(cleanState);
              }
              res.json(cleanStates)
            })
          }
        })
      }
    }

    // todo filter by permission/level
    if (req.body.username != req.user.username) {
      if (req.user.level < 100) {
        if (req.body.username) {
          db.users.findOne({ username: req.body.username }, (e: Error, user: any) => {
            if (e) { res.json({ error: "db error" }) }
            if (user) {
              db.states.find({ $or: [{ apikey: user.apikey, 'access': req.user.publickey }, { apikey: user.apikey, 'public': true }] }, (er: Error, states: any[]) => {
                var cleanStates: any = []
                for (var a in states) {
                  var cleanState = _.clone(states[a])
                  delete cleanState["apikey"]
                  cleanStates.push(cleanState);
                }
                res.json(cleanStates)
              })
            }
          })
        }
      }
    }
    else {
      if (req.body.username) {
        db.users.findOne({ username: req.body.username }, (e: Error, user: any) => {
          if (e) { res.json({ error: "db error" }) }
          if (user) {
            db.states.find({ apikey: user.apikey }, (er: Error, states: any[]) => {
              var cleanStates: any = []
              for (var a in states) {
                // filter out bad device ids
                if (states[a].devid.match(/^[a-z0-9_]+$/i) == null) {
                  console.log({
                    device: {
                      devid: states[a].devid
                    },
                    "error": "id may only contain a-z A-Z 0-9 and _"
                  });
                } else {
                  var cleanState = _.clone(states[a])
                  delete cleanState["apikey"]
                  cleanStates.push(cleanState);
                }
                //end filter
              }
              res.json(cleanStates)
            })
          }
        })
      }
    }
  }
}

app.get("/api/v3/states/full", (req: any, res: any) => {
  db.states.find({ apikey: req.user.apikey }, (err: Error, states: any[]) => {
    res.json(states);
  })
})

app.get("/api/v3/states/usernameToDevice", (req: any, res: any) => {
  // if (req.user.level == 100) {
  //   db.states.aggregate([{
  //     $lookup: { from: "users", localField: "meta.user.email", foreignField: "email", as: "fromUsers" }
  //   },
  //   { $unwind: '$fromUsers' }, { $match: { apikey: req.user.apikey } },
  //   ], (err: Error, result: any) => {
  //     res.json(result)
  //   })
  // }
  // else if (req.user.level == 0) {
  db.states.aggregate([{
    $lookup: { from: "users", localField: "meta.user.email", foreignField: "email", as: "fromUsers" }
  },
  { $unwind: '$fromUsers' }, { $match: { public: true } }, {
    $project: {
      uuid: 0, apikey: 0, 'meta.user': 0, 'fromUsers._id': 0, 'fromUsers.uuid': 0,
      'fromUsers.email': 0, 'fromUsers.apikey': 0, 'fromUsers.password': 0, 'fromUsers.recover': 0, 'fromUsers.notifications': 0, 'fromUsers.lastSeen': 0,
      'fromUsers.created': 0, 'fromUsers.level': 0, 'fromUsers.shared': 0, 'fromUsers.encrypted': 0, 'fromUsers.sort': 0, 'fromUsers._created_on': 0,
      'fromUsers.userAgent': 0, 'fromUsers._last_seen': 0, 'fromUsers.emailverified': 0, 'fromUsers.settingsMenuTab': 0, 'fromUsers.ip': 0, 'fromUsers.ipLoc': 0, _id: 0,
      "meta.uuid": 0, public: 0, notification24: 0
    }
  }
  ], (err: Error, result: any) => {
    res.json(result)
  })
  //}
})

app.post("/api/v3/dashboard", (req: any, res: any) => {
  var modifier;
  if (req.user.username) {
    if (req.user.level > 0) { modifier = "" }
    else {
      modifier = "[UNREGISTERED USER]"
    }
  }
  else {
    modifier = "[UNREGISTERED USER]"
  }
  db.states.update({ key: req.body.key }, { $push: { history: { $each: [{ date: new Date(), user: req.user.username, publickey: req.user.publickey, change: "modifided dashboard" + modifier }] } } })
  db.states.findOne({ key: req.body.key }, (e: Error, dev: any) => {
    dev.layout = req.body.layout
    db.states.update({ key: req.body.key }, dev, (errorUpdating: Error, resultUpdating: any) => {
      res.json(resultUpdating);
    })
  })
}
)

app.post("/api/v3/selectedIcon", (req: any, res: any) => {
  db.states.findOne({ key: req.body.key }, (e: Error, dev: any) => {
    dev.selectedIcon = req.body.selectedIcon
    db.states.update({ key: req.body.key }, dev)
  })
})

app.post("/api/v3/boundaryLayer", (req: any, res: any) => {
  db.states.findOne({ key: req.body.key }, (e: Error, dev: any) => {
    dev.boundaryLayer = req.body.boundaryLayer

    io.to(req.body.key).emit('boundary', dev)
    var device = dev;
    delete device["_last_seen"]
    delete device["selectedIcon"]
    delete device["layout"]
    device.boundaryLayer["_created_on"] = new Date();
    db.packets.save(dev, (errSave: Error, resSave: any) => {

      dev["_last_seen"] = new Date();
      dev.payload["timestamp"] = new Date();
      db.states.update({ key: req.body.key }, dev)
      // update user account activity timestamp
      db.users.findOne({ apikey: req.user.apikey }, (e: Error, user: any) => {
        user["_last_seen"] = new Date();
        db.users.update({ apikey: user.apikey }, user, (e2: Error, r2: any) => {
          if (e2) {
            res.json(e2)
          } else if (r2) {
            res.json({ result: "Successfully Added Boundary" })
          }
        })
      })
    })
  })
})

app.post('/api/v3/accounts/create', (req: any, res: any) => {
  if (req.user.level < 100) { res.json({ error: "permission denied" }); return; }

  if (req.body) {
    if (req.body.email) {
      accounts.accountCreate(db, req.body.email, req.get('User-Agent'), req.ip, (err: Error, user: any) => {
        if (err) res.json({ error: err.toString() });
        if (user) res.json(user)
      }, req.body);
    }
  }
})

app.post('/api/v3/account/update', (req: any, res: any) => {
  db.users.update({ apikey: req.user.apikey }, { "$set": req.body }, (err: Error, result: any) => {
    if (err) res.json({ error: err.toString() });
    if (result) res.json(result);
  })
})

function safeParser(req: any, res: any, next: any) {
  var buf = ""
  req.on("data", (chunk: any) => { buf += chunk.toString(); })
  req.on("end", () => {
    if (buf.length > 0) {
      try {
        var jsonin = JSON.parse(buf)
        req.body = jsonin;
        next();
      } catch (err) {
        res.status(400).json({ "error:": err.toString() + ". Make sure you are sending valid JSON" })
        next();
      }
    } else { next(); }
  })
}

function addRawBody(req: any, res: any, buf: any, encoding: any) {
  req.rawBody = buf.toString();
}

///////// END

app.get("/api/v3/getlocation", (req: any, res: any) => {
  //console.log("-------")
  //console.log(req.ip)
  var geoIPLoc = geoip.lookup(req.ip);
  // console.log(geoIPLoc)
  res.json(geoIPLoc)
});

app.put("/api/v3/data/put", (req: any, res: any, next: any) => {
  handleState(req, res, next);
});

app.post("/api/v3/data/post", (req: any, res: any, next: any) => {
  handleState(req, res, next);
});

app.post("/api/v3/sort", (req: any, res: any) => {
  db.users.update({ apikey: req.user.apikey }, { $set: { sort: req.body.sort, sortvalues: req.body.sortvalues } }, (err: Error, response: any) => {
    if (err) res.json(err);
    if (response) res.json({ result: "added sort" });
  })
});

app.get("/api/v3/getsort", (req: any, res: any) => {
  db.users.findOne({ apikey: req.user.apikey }, (err: Error, response: any) => {
    if (err) res.json(err);
    if (response) res.json({ sort: response.sort, sortvalues: response.sortvalues });
  })
});

app.post("/api/v3/passChanged", (req: any, res: any) => {
  db.users.update({ username: req.body.username }, { $set: { passChange: true } }, (err: Error, updated: any) => {
    if (err) res.json(err);
    if (updated) res.json(updated);
  })
})

function changePassword(req: any, res: any) {
  db.users.findOne({ apikey: req.user.apikey }, (err: Error, user: any) => {
    if (user.email == "admin@localhost.com") {
      if (user.passChange == undefined || user.passChange == null) {
        db.users.update({ apikey: req.user.apikey }, { $set: { passChange: false } }, (err: Error, updated: any) => {
          if (err) res.json(err);
          if (updated) res.json(updated);
        })
      }
    }
  })
}

function handleState(req: any, res: any, next: any) {
  var hrstart = process.hrtime()

  if (req.body === undefined) { return; }

  if ((req.user) && (req.user.level) > 0) {
    if (req.body.id == "") { res.json({ "error": "id may not be empty" }) }

    if (!req.body.id) { res.json({ "error": "id parameter missing" }); return; }

    if (typeof req.body.id != "string") {
      res.json({ "error": "id must be a string" })
    }
    if (req.body.id.indexOf(" ") != -1) {
      res.json({ "error": "id may not contain spaces" })
    }

    if (req.body.id.match(/^[a-z0-9_]+$/i) == null) {
      res.json({ "error": "id may only contain a-z A-Z 0-9 and _" });
    }

    if (typeof req.body.id != "string") { res.status(400).json({ "error": "parameter id must be of type string" }); return; }
    if (!req.body.data) { res.status(400).json({ "error": "data parameter missing" }); return; }
    if (req.body.id == null) { res.json({ "error": "id parameter null" }); return; }
    if (!req.body.data) { res.json({ "error": "data parameter missing" }); return; }

    var meta = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method
    }

    //checkExisting(req, res, db);


    processPacketWorkflow(db, req.user.apikey, req.body.id, req.body, plugins, (err: Error, newpacket: any) => {
      state.postState(db, req.user, newpacket, meta, (packet: any, info: any) => {
        db.states.findOne({ apikey: req.user.apikey, devid: req.body.id }, (Err: Error, deviceState: any) => {

          // inject into deviceState.
          deviceState.newdevice = info.newdevice;

          if (deviceState) {
            for (var p in plugins) {
              if (plugins[p].handlePacket) {
                plugins[p].handlePacket(deviceState, packet, (err: Error, packet: any) => { });
              }
            }
          }

          if (info.newdevice) {
            io.to(req.user.username).emit("info", info);
          }

          // var message = "";
          // var AlarmNotification = {
          //   type: "ALARM",
          //   device: req.body.id,
          //   created: Date.now(),
          //   message: message,
          //   notified: true,
          //   seen: false
          // }

          // if (deviceState.boundaryLayer != undefined) {
          //   if (deviceState.boundaryLayer.inbound == false) {
          //     AlarmNotification.message = "has gone out of its boundary";
          //     //createNotification(db, AlarmNotification, req.user, deviceState);
          //   }
          // }

        })

        io.to(req.user.apikey).emit('post', packet.payload);
        io.to(req.user.apikey + "|" + req.body.id).emit('post', packet.payload);
        io.to(packet.key).emit('post', packet.payload)

        // db.states.findOne({ apikey: req.user.apikey, devid: req.body.id }, (findErr: Error, findResult: any) => {
        //   if (findResult.notification24 == true) {
        //     db.states.update({ key: findResult.key }, { $unset: { notification24: 1 } }, (err: any, result: any) => {
        //       //console.log(result)
        //       //console.log(err)
        //     })
        //   }
        // })



        res.json({ result: "success" });

        var hrend = process.hrtime(hrstart)
        // log('Execution time (hr): ')
        // log(hrend);
      })
    })
  } else {
    res.json({ "error": "user not authenticated" })
  }
}

/* ----------------------------------------------------------------------------- 
    DB QUERY
*/

function handleDeviceUpdate(apikey: string, packetIn: any, options: any, cb: any) {
  log("main.ts", "handleDeviceUpdate", "start")
  state.getUserByApikey(db, apikey, (err: any, user: any) => {
    if (err) { log(err); cb(err, undefined); return; }

    processPacketWorkflow(db, apikey, packetIn.id, packetIn, plugins, (err: Error, newpacket: any) => {
      if (err) { console.error(err) }
      //log("main.ts", "handleDeviceUpdate", user)
      state.postState(db, user, newpacket, packetIn.meta, (packet: any, info: any) => {
        if (options) {
          if (options.socketio == true) {
            io.to(apikey).emit('post', packet.payload);
            io.to(apikey + "|" + packetIn.id).emit('post', packet.payload);
            io.to(packet.key).emit('post', packet.payload)

            if (info.newdevice) {
              io.to(user.username).emit("info", info)
            }

          }
        }


        for (var p in plugins) {
          if (plugins[p].handlePacket) {
            plugins[p].handlePacket(info.deviceStateDBpreupdate, packet, (err: Error, packet: any) => {

            });
          }
        }

        // iotnxtUpdateDevice(packet, (err:Error, result:any)=>{
        //   if (err) log("couldnt publish")
        // }); 

        cb(undefined, { result: "success" });

      })
    })

  })

}

app.get("/api/v3/state", (req: any, res: any, packet: any) => {

  db.states.find({ "payload.id": req.body.id }, (err: Error, state: any) => {
    res.json(state);
  })
});

app.get("/api/v3/u/notifications", (req: any, res: any) => {
  db.users.findOne({ apikey: req.user.apikey, notifications: req.user.notifications }, (err: Error, state: any) => {
    res.json(state.notifications);
  })
});

app.post("/api/v3/u/notifications/delete", (req: any, res: any) => {
  db.users.update({ apikey: req.user.apikey }, { $unset: { notifications: 1 } }, (err: Error, state: any) => {
    if (err != null) {
      console.log(err)
    } else if (state) {
      console.log(state)
    }
    res.json(state.notifications);
  })
});

app.post("/api/v3/state/delete", (req: any, res: any) => {
  if (req.body.username) {
    if (req.body.username != req.user.username) {
      if (req.user.level < 100) { res.json({ error: "must be level 100" }); return; }
    }

    db.users.findOne({ username: req.body.username }, (dbError: Error, user: any) => {
      if (user) {
        var meta = {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          method: req.method
        }
        if (req.user.level < 100 && req.user.level > 0) {

          if (req.body.id) {
            db.states.remove({ apikey: user.apikey, devid: req.body.id }, (err: Error, removed: any) => {
              if (err) res.json(err);
              if (removed) res.json(removed);
            })
          } else {
            res.json({ result: "auth failed" });
          }
        }
        else if (req.user.level >= 100) {
          if (req.body.id) {
            db.states.remove({ key: req.body.key, devid: req.body.id }, (err: Error, removed: any) => {
              if (err) res.json(err);
              if (removed) res.json(removed);
            })
          } else {
            res.json({ result: "auth failed" });
          }
        }
      }
    })

  } else {
    if ((req.user) && (req.user.level) > 0) {
      if (!req.body.id) { res.json({ "error": "id parameter missing" }); return; }

      var meta = {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method
      }
      if (req.user.level < 100 && req.user.level > 0) {
        if (req.body.id) {
          db.states.remove({ apikey: req.user.apikey, devid: req.body.id }, (err: Error, removed: any) => {
            if (err) res.json(err);
            if (removed) res.json(removed);
          })
        }
        else {
          res.json({ result: "auth failed" });
        }
      }
      else if (req.user.level >= 100) {
        if (req.body.id) {
          db.states.remove({ key: req.body.key, devid: req.body.id }, (err: Error, removed: any) => {
            if (err) res.json(err);
            if (removed) res.json(removed);
          })
        }
        else {
          res.json({ result: "auth failed" });
        }
      }
    }
  }
})

app.post("/api/v3/account/recoveraccount", (req: any, res: any) => {
  log("account registration")
  log(req.body)


  req.user.email = req.body.email
  accounts.Forgotpassword(db, req.user, (error: Error, result: any) => {
    res.json({ error, result, account: req.user })
  })

})



app.post("/api/v3/state/clear", (req: any, res: any) => {

  if (!req.user) { return; }
  if (req.user.level < 1) { return; }
  if (!req.body.id) { res.json({ "error": "id parameter missing" }); return; }

  if (req.body.type) {
    for (var i in req.body.id) {
      db.states.update({ apikey: req.user.apikey, devid: req.body.id[i].devid }, { "$set": { payload: { id: req.body.id[i].devid, data: {} }, "meta.method": "clear", "meta.userAgent": "api" } }, (err: Error, cleared: any) => {
        if (req.body.clearhistory == false) {
          if (err) res.json(err);
          if (cleared) res.json(cleared);
        }
        else {
          clearhistoryfunction(req, res);
        }
      })
    }
  }

  else {
    db.states.update({ apikey: req.user.apikey, devid: req.body.id }, { "$set": { payload: { id: req.body.id, data: {} }, "meta.method": "clear", "meta.userAgent": "api" } }, (err: Error, cleared: any) => {
      if (err) res.json(err);
      if (cleared) res.json(cleared);
    })
  }
}
)

async function clearhistoryfunction(req: any, res: any) {
  for (var i in req.body.id) {
    await db.packets.remove({ key: req.body.id[i].key }, (err: Error, clearedhistory: any) => {
      if (err) res.json(err);
      if (clearedhistory) res.json(clearedhistory);
    })
  }
}

app.post("/api/v3/state/deleteBoundary", (req: any, res: any) => {
  if (!req.user) { return; }
  if (req.user.level < 1) { return; }
  if (!req.body.id) { res.json({ "error": "id parameter missing" }); return; }

  db.states.update({ apikey: req.user.apikey, devid: req.body.id }, { $set: { 'boundaryLayer': undefined } }, (err: Error, cleared: any) => {
    if (err) res.json(err);
    if (cleared) {
      db.states.findOne({ apikey: req.user.apikey, devid: req.body.id }, (e: Error, dev: any) => {
        io.to(dev.key).emit('boundary', dev)
        res.json(cleared);
      })
    }
  })
})

app.post("/api/v3/allUsers", (req: any, res: any) => {
  db.users.find({
    $or: [{ 'username': { '$regex': req.body.search } }, { 'email': { '$regex': req.body.search } }],
    level: { $gte: 1 },
    "username": { "$exists": true },
    "$expr": { "$ne": [{ "$strLenCP": "$username" }, 32] } // default random usernames are 32 so we skip these.. usernames shouldnt be this long anyways. I know its kinda a hack.
  }, { username: 1, "_created_on": 1 }, //only return data we need
    (err: Error, resp: any) => {
      res.json(resp)
    })
});

app.post("/api/v3/state/query", (req: any, res: any) => {
  if (!req.user) { res.json({ error: "user not authenticated" }); return; }

  if ((req.user) && (req.user.level) > 0) {
    if (!req.body.id) { res.json({ "error": "id parameter missing" }); return; }

    var meta = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method
    }

    if (req.body.data) {
      state.queryProject(db, req.user, req.body, meta, (packet: any) => {

        io.to(req.user.apikey).emit('post', packet.payload);
        io.to(req.user.apikey + "|" + req.body.id).emit('post', packet.payload);

        db.states.findOne({ apikey: req.user.apikey, devid: req.body.id }, (e: Error, state: any) => {
          for (var p in plugins) {
            if (plugins[p].handlePacket) {
              plugins[p].handlePacket(state, packet, (err: Error, packet: any) => {

              });
            }
          }
        })

        res.json(packet);

      })
    } else {
      state.queryProject(db, req.user, req.body, meta, (packet: any) => { res.json(packet); })
    }
  }

});

app.get("/api/v3/plugins/definitions", (req: any, res: any) => {

  var definitions: any = [];

  for (var plugin of plugins) {
    if (plugin.workflow) {
      log("loading workflow definitions for plugin: " + plugin.name)
      definitions.push(plugin.workflowDefinitions);
    }
  }

  res.json({ definitions })
})

export function processPacketWorkflow(db: any, apikey: string, deviceId: string, packet: any, plugins: any, cb: any) {
  db.states.find({ apikey: apikey }, (err: Error, states: any) => {
    if (err) { log("WORKFLOW ERROR"); }

    var statesObj: any = {}
    for (var s in states) { statesObj[states[s].devid] = states[s]; }

    var state: any = {};
    for (var s in states) {
      if (states[s].devid == deviceId) {
        state = states[s];
      }
    }

    if (state) {
      if (state.workflowCode) {
        // WORKFLOW EXISTS ON THIS DEVICE

        var sandbox: any = {
          http: require("http"),
          https: require("https"),
          state: state,
          states: states,
          statesObj: statesObj,
          packet: packet,
          callback: (packetDone: any) => {
            //if (alreadyExitScript == false) { 
            packetDone.err = "";
            alreadyExitScript = true;
            cb(undefined, packetDone);
            //}

          }
        }

        var options = {
          apikey: state.apikey,
          devid: state.devid,
          app: undefined,
          db: db,
          eventHub: eventHub
        }

        for (var plugin of plugins) {
          if (plugin.workflow) {
            var workflow = plugin.workflow;
            sandbox[plugin.name] = new workflow(options);
          }
        }

        var alreadyExitScript = false;

        const vm = new VM({
          timeout: 1000,
          sandbox: sandbox
        });

        // Sync
        try {
          vm.run(state.workflowCode);
        } catch (err) {
          //console.error('Failed to execute script.', err);

          //if (alreadyExitScript == false) { 
          log("VM WORKFLOW ERROR!")
          //console.error(err);
          alreadyExitScript = true;
          packet.err = err.toString();
          cb(undefined, packet);
          //}        
        }
      } else {
        // NO WORKFLOW ON THIS DEVICE
        cb(undefined, packet);
      }
    } else {
      // NO DEVICE YET
      cb(undefined, packet);
    }
  })
}

var server;

if (config.configGen.ssl) {
  server = https.createServer(config.configGen.sslOptions, app);
} else {
  server = http.createServer(app);
}

/* ############################################################################## */

var io = require('socket.io')(server);

function bindListeners(ioIn: any) {
  io.on('connection', function (socket: any) {
    // setTimeout(function () {
    //   socket.emit("connect", { hello: "world" })
    // }, 5000)


    socket.on('join', function (path: string) {
      socket.join(path);
    });

    socket.on('post', (data: any) => {
      for (var key in socket.rooms) {
        if (socket.rooms.hasOwnProperty(key)) {

          var testkey = key;

          if (key.split("|").length == 2) { testkey = key.split("|")[0] }

          var packet = {
            id: data.id,
            data: data.data,
            meta: { method: "socketioclient" }
          }

          handleDeviceUpdate(testkey, packet, { socketio: true }, (e: Error, r: any) => { });

        }
      }
    })
    socket.on('disconnect', function () { })
  });
}


function initializeSocketio() {
  if (config.configGen.redis) {
    log("socketio", "REDIS ENABLED")
    const redis = require('socket.io-redis')
    io.adapter(redis({ host: config.configGen.redis.host, port: config.configGen.redis.port }))
    bindListeners(io)
  } else {
    log("socketio", "REDIS NOT ENABLED")
    bindListeners(io)
  }
}




/* ############################################################################## */

if (config.configGen.ssl) {
  server.listen(443);

  // temporary open ports for shockwave pivot
  var httpserver = http.createServer(app);
  httpserver.listen(80);

  // REDIR TO HTTPS
  // var http = require('http');
  // http.createServer(function (req: any, res: any) {
  //   res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  //   res.end();
  // }).listen(80);

  /////
} else {
  trex.log("HTTP\tServer port: " + config.configGen.httpPort)
  server.listen(config.configGen.httpPort).on("error", (err: Error) => {
    console.error("HTTP Caught error")
    console.error(err);
    console.log("You must have another process running that is using this port. EXITING")
    process.exit();
  })


}

server.on('error', (e: any) => {

  if (e.code == "EACCES") {
    trex.log("\nERROR do you have permission for this port? Try sudo.\n")
  } else {
    trex.log(e);
  }
})

process.on('unhandledRejection', log);
process.on("uncaughtException", log);
