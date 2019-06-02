var net = require("net");
import * as events from "events";



export const name = "tcp";

import { Plugin } from "../plugin"
import express = require('express');

export class PluginTCP extends Plugin {
  db: any;
  eventHub: any;
  serversMem: any[] = [];

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.eventHub = eventHub;

    app.get("/api/v3/tcp/ports", (req: any, res: any) => {
      db.plugins_tcp.find({}, (err: Error, ports: any) => {
        if (err) { res.json(err); return; }
        res.json(ports);
      });
    });

    app.post("/api/v3/tcp/setapikey", (req: any, res: any) => {

      db.plugins_tcp.update(
        { portNum: req.body.portNum },
        { $set: { apikey: req.user.apikey } },
        (err: Error, resultUpd: any) => {
          if (err) { res.json(err) }
          if (resultUpd) {
            res.json(resultUpd)
          }
        }
      );

    })

    app.post("/api/v3/tcp/addport", (req: any, res: any) => {
      if (req.user.level < 100) {
        res.json({ err: "permission denied" });
        return;
      }

      var port = req.body
      port.apikey = req.user.apikey


      this.addport(port, (err: Error, result: any) => {
        if (err) {
          res.json({ err: err.toString() });
        } else {
          this.connectport(port, eventHub, (err: any, result: any) => {
            res.json(result);
          });

        }
      });
    });

    app.post("/api/v3/tcp/removeport", (req: any, res: any) => {
      if (req.user.level < 100) {
        res.json({ err: "permission denied" });
        return;
      }

      this.removeport(req.body, (err: Error, result: any) => {
        if (err) res.json({ err: err.toString() });
        res.json(result);
      });
    });

    //connects ports on startup
    this.getports((err: Error, ports: any) => {
      if (ports) {
        for (var port of ports) {
          this.connectport(port, eventHub, (err: any, result: any) => { });
        }
      }
    });
  }



  getports(cb: any) {
    this.db.plugins_tcp.find({}, cb);
  }

  addport(portOptions: any, cb: any) {
    if (portOptions.portNum < 1000) {
      cb(new Error("portNum can not be in the range 0-1000"), undefined);
      return;
    }

    this.db.plugins_tcp.find(
      { portNum: portOptions.portNum },
      (err: Error, conflictingPorts: any) => {
        if (err) console.log(err);
        if (conflictingPorts.length == 0) {
          this.db.plugins_tcp.save(portOptions, cb);
        } else {
          cb(new Error("portNum already taken"), undefined);
        }
      }
    );
  }

  removeport(portOptions: any, cb: any) {
    this.db.plugins_tcp.remove({ portNum: portOptions.portNum }, cb);
  }

  updateport(portNum: number, update: any, cb: any) {
    this.db.plugins_tcp.update({ portNum }, { $set: update }, cb);
  }

  connectport(portOptions: any, eventHub: any, cb: any) {
    console.log("TCP Server " + portOptions.portNum + " \t| loading...");

    var server = net.createServer((client: any) => {
      server.getConnections((err: Error, count: number) => {
        console.log("There are %d connections now. ", count);
        this.updateport(
          portOptions.portNum,
          { connections: count },
          (err: Error, result: any) => { }
        );
        eventHub.emit("plugin", { plugin: "tcp", event: "connections" });
      });

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      client.on("data", (data: any) => {
        //console.log(data);
        eventHub.emit("device", {
          //apikey: config.apikey,
          apikey: portOptions.apikey,
          packet: {
            id: "tcpPort" + portOptions.portNum,
            level: 1,
            data: { text: data.toString().replace("\r\n", "") },
            tcp: { hexBuffer: data.toString("hex"), },
            portOptions,
            meta: { method: "tcp" }
          }
        });
      });
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      client.on("end", () => {
        // Get current connections count.
        server.getConnections((err: Error, count: number) => {
          console.log("There are %d connections now. ", count);
          this.updateport(
            portOptions.portNum,
            { connections: count },
            (err: Error, result: any) => { }
          );
        });
        eventHub.emit("plugin", { plugin: "tcp", event: "connections" });
      });
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    });

    server.listen(portOptions.portNum, () => {
      console.log("TCP Server " + portOptions.portNum + " \t| ready.");
      cb(undefined, portOptions);
    });

    server.on("close", function () {
      console.log("TCP server socket is closed.");
    });

    server.on("error", function (error: Error) {
      console.error(JSON.stringify(error));
    });

    this.serversMem[portOptions.portNum] = server;
  }

}