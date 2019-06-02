var net = require("net");
import * as events from "events";
import { Teltonika } from "./lib_teltonika"
import { log } from "../../log"
import { Plugin } from "../plugin"
import express = require('express');

export class PluginTeltonika extends Plugin {
  db: any;
  eventHub: any;
  name = "teltonika";
  collection = "plugins_teltonika";

  minPort = 12001;
  maxPort = 12200;

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.eventHub = eventHub;

    log("PLUGIN", this.name, "LOADED");
    //default 12000 port should handle any device for any account

    app.get("/api/v3/teltonika/info", (req: any, res: any) => {
      this.db[this.collection].findOne({ apikey: req.user.apikey }, (err: Error, result: any) => {
        if (err) { res.json(err); }
        if (result) {
          delete result.apikey;
          delete result["_id"]
          res.json(result);
        }
      })
    });
    app.get("/api/v3/teltonika/reqport", (req: any, res: any) => {
      // check if account has port assigned
      this.db[this.collection].findOne({ apikey: req.user.apikey }, (err: Error, result: any) => {
        if (err) { res.json(err); }

        if (result.length == 0) {
          // no ports yet
          // find open port
          this.findOpenPort((err: Error, openport: any) => {
            // asign to account
            this.registerPort(req.user, openport, (err: Error, port: any) => {
              this.connectPort(port);
              res.json(port);
            });
          });

        } else {
          res.json({ error: "account already has port assigned", port: result[0].port })
        }
      })

    });

    // open ports at startup
    this.findPorts((err: Error, userPorts: any) => {
      for (var userPort of userPorts) {
        this.connectPort(userPort);
      }
    })
  }

  handlePacket(packet: any) {
    log("PLUGIN", this.name, "HANDLE PACKET TODO");
    // check if this device is a teltonika device
    // send data to device if its connected to this node
  }

  findOpenPort(cb: Function) {
    this.db[this.collection].find({}, (e: Error, r: any) => {
      var ports = []
      for (var p of r) {
        ports.push(p.port);
      }

      //sort ascending
      ports.sort((a, b) => { if (b < a) { return 1 } else return -1 });

      //find first unused
      for (var m = this.minPort; m < this.maxPort; m++) {
        if (ports.indexOf(m) == -1) {
          cb(null, m);
        }
      }
    })
  }

  findPorts(cb: Function) {
    this.db[this.collection].find({}, (err: Error, result: any) => {
      if (err) { cb(err); }
      if (result) { cb(null, result); }
    })
  }


  registerPort(user: any, port: number, cb: Function) {
    this.db[this.collection].save({ apikey: user.apikey, port }, cb)
  }

  connectPort(userPort: any) {
    var server = net.createServer((client: any) => {
      var device = new Teltonika(client, {});
      device.on("data", (data: any) => {
        this.eventHub.emit("device", {
          apikey: userPort.apikey,
          packet: { id: data.id, data: data.data, meta: { method: "teltonika" } }
        })
      })
    })

    server.listen(userPort.port, () => {
      log("PLUGIN", this.name, "listening on " + userPort.port)
    })
  }
}