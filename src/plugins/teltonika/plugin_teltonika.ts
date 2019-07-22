var net = require("net");
import * as events from "events";
import { Teltonika } from "./lib_teltonika"
import { log } from "../../log"
import { Plugin } from "../plugin"
import express = require('express');
var RedisEvent = require('redis-event');

export class PluginTeltonika extends Plugin {
  db: any;
  eventHub: events.EventEmitter;
  name = "teltonika";
  collection = "plugins_teltonika";

  minPort = 12001;
  maxPort = 12200;

  isCluster:boolean = false;
  ev:any;
  clustersubs:string[] = [];

  connections : Teltonika[] = [];

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.eventHub = eventHub;
    

    log("PLUGIN", this.name, "LOADED");
    //default 12000 port should handle any device for any account

    if (config.redis && process.env.pm_id) {
      this.isCluster = true;
      this.ev = new RedisEvent(config.redis.host, [this.name]);

      this.ev.on("read", ()=>{
        log(this.name, "CLUSTER", "READY")
      })
    }

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
      // console.log(req.user)
      this.db.plugins_teltonika.findOne({ apikey: req.user.apikey }, (err: Error, result: any) => {
        if (err) { res.json(err); }

        if (result == null) {
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

  handlePacket(deviceState:any, packet: any, cb:any) {
    log("PLUGIN", this.name, "HANDLE PACKET");
    // check if this device is a teltonika device
    if (!deviceState) { console.log(this.name + " handlePacket ERROR no deviceState")}
        
    if ((this.isCluster) && (packet.fromCluster == undefined)) {
      log(this.name, "CLUSTER", "EVENT handlePacket");
      packet.fromCluster = true;
      packet.fromId = process.env.pm_id;
      this.ev.pub(this.name + ":" + deviceState.apikey, {
        deviceState,
        packet,
        launchedAt: new Date()
      })
    }

    // send data to device if its connected to this node
    for (var dev of this.connections) {
      if (packet.payload.data.command) {
        dev.tcpwrite(packet.payload.data.command)
      }
    }
  }

  findOpenPort(cb: Function) {
    this.db[this.collection].find({}, (e: Error, r: any) => {
      var ports = []
      var found = false;
      for (var p of r) {
        ports.push(p.port);
      }

      //sort ascending
      ports.sort((a, b) => { if (b < a) { return 1 } else return -1 });

      //find first unused
      for (var m = this.minPort; m < this.maxPort; m++) {
        if (ports.indexOf(m) == -1 && found == false) {
          cb(null, m);
          found = true;
          m = this.maxPort + 1;
        } else {
          found = false;
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
      var device:any = new Teltonika(client, {});
      device.apikey = userPort.apikey;

      if (this.isCluster) {
        var sub = this.name + ":" + userPort.apikey

        if (this.clustersubs.indexOf(sub)== -1) {
          this.clustersubs.push(sub);
          log(this.name, "CLUSTER", "NEW SUB");
          this.ev.on(sub, (data:any)=>{
            if (data.packet.fromId != process.env.pm_id) {
              this.handlePacket(data.deviceState, data.packet, ()=>{})
            }
          })
        }
      }

      device.on("data", (data: any) => {
        data.data.connected = true;

        this.eventHub.emit("device", {
          apikey: userPort.apikey,  
          packet: { id: data.id, data: data.data, meta: { method: "teltonika" } }
        })
      })

      device.on("end", () => {

        this.eventHub.emit("device", {
          apikey: userPort.apikey,
          packet: { id: device.id, data: { connected : false}, meta: { method: "teltonika" } }
        })

        console.log("teltonika tcp disconnected")
        for (var dev in this.connections) {
          if (device == this.connections[dev]) {
            console.log("found device in list")
            this.connections.splice(parseInt(dev),1);
          }
        }
      })

      this.connections.push(device);
    })

    server.listen(userPort.port, () => {
      log("PLUGIN", this.name, "listening on " + userPort.port)
    })
  }
}