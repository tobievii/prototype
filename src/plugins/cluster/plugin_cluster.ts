import * as events from "events"
import express = require('express');
import * as net from "net"

import { Plugin } from "../plugin"
import { log } from "../../log"
import Queue = require("bull");

export class PluginCluster extends Plugin {
  name = "cluster";
  queue: Queue.Queue | undefined;

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);

    if (config.redis) {
      // load balance
      this.queue = new Queue(this.name, 'redis://127.0.0.1:6379');
      this.queue.process((job, done) => {
        log("PLUGIN", this.name, "RECIEVED JOB");
        this.processJob(job, () => {
          //console.log(job.data.payload.data.clusterid);

          // if (Math.random() < 0.1) {
          //   log("PLUGIN", this.name, "JOB SUCCESS");
          //   done();
          // } else {
          //   log("PLUGIN", this.name, "JOB FAIL");
          //   done(new Error('could not do job'), { asd: 123 });
          // }
          done();


        })
      })
    }

    log("PLUGIN", this.name, "INITIALIZED");
    //this.name = "Cluster";
  }

  handlePacket(packet: any, cb: Function) {
    log("PLUGIN", this.name, "HANDLE PACKET");
    if (this.queue) {
      log("PLUGIN", this.name, "QUEUE JOB");
      this.queue.add(packet);
    } else {
      this.processJob(packet, cb);
    }
  }

  processJob(job: any, cb: Function) {
    log("PLUGIN", this.name, "PROCESSING JOB");
    cb();
  }
  //public init(app: express.Express, db: any, eventHub: events.EventEmitter) {
  //   this.eventHub = eventHub;

  //   //this.log("INIT HFHAKSFL")

  //   // app.get("/api/v3/plugins/" + this.name + "/info", (req: Express.Request, res: express.Response) => {
  //   //   console.log("!!")
  //   //   res.json({ port: this.port });
  //   // });

  //   // app.get("/api/v3/plugins/" + this.name + "/test", (req: Express.Request, res: express.Response) => {
  //   //   test();
  //   //   res.json({})
  //   // });

  //   // this.runServer();
  //}

}


