var net = require("net");
import * as events from "events";
import { generate, generateDifficult } from "../../utils";

import { Plugin } from "../plugin"
import express = require('express');
import { log } from "../../log"

export class PluginHTTP extends Plugin {
  serversMem: any[] = [];
  db: any;
  app: any;
  eventHub: any;
  name = "HTTP";

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.app = app;
    this.eventHub = eventHub;

    log("PLUGIN", this.name, "LOADED");

    app.get("/api/v3/http/routes", (req: any, res: any) => {
      this.getroutes(req.user, (err: Error, routes: any) => {
        if (err) res.json({ err: err.toString() });
        res.json(routes);
      });
    });

    app.post("/api/v3/http/setapikey", (req: any, res: any) => {
      console.log("--..")
      console.log(req.body);

      db.plugins_http.update(
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

    app.post("/api/v3/http/addroute", (req: any, res: any) => {
      if (req.user.level < 1) {
        res.json({ err: "permission denied" });
        return;
      }

      req.body.route = generateDifficult(32);

      this.addroute(req.body, req.user.apikey, (err: Error, result: any) => {
        if (err) {
          res.json({ err: err.toString() });
        } else {
          this.listenRoute(result);
          res.json(result);
        }
      });
    });

    app.post("/api/v3/http/removeroute", (req: any, res: any) => {
      req.body.apikey = req.user.apikey
      this.removeroute(req.body, (err: Error, result: any) => {
        if (err) res.json({ err: err.toString() });
        res.json(result);
      });
    });

    //CONNECT ROUTES!
    this.getroutes(undefined, (err: Error, routes: any) => {
      if (routes) {
        for (var route of routes) {
          ///////
          this.listenRoute(route)
          ////////////
        }
      }
    });

  }



  listenRoute(route: any) {
    this.app[route.method]("/plugin/http/" + route.route, (req: any, res: any) => {

      this.eventHub.emit("device", {
        //apikey: config.apikey,
        apikey: route.apikey,
        packet: {
          id: route.id,
          data: req.body,
          //http: { route: route },
          meta: { method: "http" }
        }
      });

      res.end("success")

    })
  }

  getroutes(user: any, cb: any) {
    if (user) {
      this.db.plugins_http.find({ apikey: user.apikey }, cb);
    }

    if (user == undefined) {
      this.db.plugins_http.find({}, cb);
    }
  }


  addroute(routeOptions: any, apikey: any, cb: any) {

    routeOptions.apikey = apikey;
    this.db.plugins_http.find({ route: routeOptions.route, method: routeOptions.method, apikey: apikey },
      (err: Error, conflictingroutes: any) => {
        if (err) console.log(err);

        if (conflictingroutes.length == 0) {

          this.db.plugins_http.save(routeOptions, cb);
        } else {
          cb(new Error("route already taken"), undefined);
        }

      }
    );
  }

  removeroute(routeOptions: any, cb: any) {
    this.db.plugins_http.remove({ route: routeOptions.route, method: routeOptions.method }, cb);
  }

  updateport(portNum: number, update: any, cb: any) {
    this.db.plugins_http.update({ portNum }, { $set: update }, cb);
  }

  connectport(routeOptions: any, cb: any) {
    console.log("http Server " + routeOptions.portNum + " \t| loading...");

    var server = net.createServer((client: any) => {
      server.getConnections((err: Error, count: number) => {
        console.log("There are %d connections now. ", count);
        this.updateport(
          routeOptions.portNum,
          { connections: count },
          (err: Error, result: any) => { }
        );
        this.eventHub.emit("plugin", { plugin: "http", event: "connections" });
      });

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      client.on("data", (data: any) => {
        console.log(data);
        this.eventHub.emit("device", {
          //apikey: config.apikey,
          apikey: "mfradh6drivbykz7s4p3vlyeljb8666v",
          packet: {
            id: "httpPort" + routeOptions.portNum,
            level: 1,
            data: { text: data.toString().replace("\r\n", "") },
            http: { hexBuffer: data.toString("hex"), },
            routeOptions,
            meta: { method: "http" }
          }
        });
      });
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      client.on("end", () => {
        // Get current connections count.
        server.getConnections((err: Error, count: number) => {
          console.log("There are %d connections now. ", count);
          this.updateport(
            routeOptions.portNum,
            { connections: count },
            (err: Error, result: any) => { }
          );
        });
        this.eventHub.emit("plugin", { plugin: "http", event: "connections" });
      });
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    });

    server.listen(routeOptions.portNum, () => {
      console.log("http Server " + routeOptions.portNum + " \t| ready.");
    });

    server.on("close", function () {
      console.log("http server socket is closed.");
    });

    server.on("error", function (error: Error) {
      console.error(JSON.stringify(error));
    });

    this.serversMem[routeOptions.portNum] = server;
  }
}

