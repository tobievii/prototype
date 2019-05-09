import * as events from "events"
import * as net from "net"
import express = require('express');

import { Plugin } from "../plugin"
import { readFile } from "fs";

class PluginHF2111a extends Plugin {
  name = "hf2111a";
  port = 12900;

  constructor() {
    super();
    this.log("TEST ADSF")
  }

  public init(app: express.Express, db: any, eventHub: events.EventEmitter) {
    this.log("INIT HFHAKSFL")

    app.get("/api/v3/plugins/" + this.name + "/info", (req: Express.Request, res: express.Response) => {
      console.log("!!")
      res.json({ port: this.port });
    });

    this.runServer();
  }

  runServer() {
    this.log("runServer()")

    var server = net.createServer((client) => {
      console.log(this.name + " new connection from " + client.remoteAddress)
      client.on("data", (data) => {
        console.log(data);
        console.log(data.toString())
      })
    })

    console.log(this.name + " starting on port " + this.port);
    server.listen(this.port);
  }
}

export default new PluginHF2111a();

// export const name = "hf2111a";
// const port = 12900;

// export function init(app: express.Express, db: any, eventHub: events.EventEmitter) {
//   app.get(plugin + name + "/info", (req: Express.Request, res: express.Response) => {
//     res.json({ port });
//   });
//   runServer();
// }



// function runServer() {

//   var server = net.createServer((client) => {
//     console.log(name + " new connection from " + client.remoteAddress)
//     client.on("data", (data) => {
//       console.log(data);
//       console.log(data.toString())
//     })
//   })

//   console.log(name + " starting on port " + port);
//   server.listen(port);
// }