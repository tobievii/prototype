var net = require("net");
import * as events from "events";
import { clearInterval } from "timers";
import { log } from "../../log"
import express = require('express');
import { Plugin } from "../plugin"
import Queue = require("bull");

export class PluginScheduler extends Plugin {
  name = "scheduler";
  db: any;
  eventHub: events.EventEmitter;

  isCluster: boolean = false;
  queue: Queue.Queue | undefined;
  ev: any;

  scheduledTasks: any = {}

  repeatEveryOptionsMS: any = {
    "second": 1000,
    "minute": 1000 * 60,
    "hour": 1000 * 60 * 60,
    "day": 1000 * 60 * 60 * 24,
    "week": 1000 * 60 * 60 * 24 * 7,
    "month": 1000 * 60 * 60 * 24 * 30,
    "year": 1000 * 60 * 60 * 24 * 365
  }

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.eventHub = eventHub;
    log("PLUGIN", this.name, "LOADED");

    app.get("/api/v3/" + this.name + "/list", (req: any, res: any) => {

    });

    app.post("/api/v3/" + this.name + "/widget", (req: any, res: any) => {
      this.updateScheduler(req.body, eventHub, (e: Error, result: any) => {
        res.json({});
      })
    });

    // initialize on startup
    this.getAllSchedulersAndStart();
  }

  updateScheduler = (request: any, eventHub: any, cb: Function) => {
    this.clearScheduler(request.props.data.i)

    if (request.state.enabled) {
      this.startJobs(request.props.state, { i: request.props.data.i, options: request.state }, cb);
    }
  }

  clearScheduler = (i: any) => {
    clearTimeout(this.scheduledTasks[i])
    clearInterval(this.scheduledTasks[i])
  }

  getAllSchedulersAndStart() {
    this.db["states"].find(
      { layout: { $elemMatch: { type: "scheduler", "options.enabled": true } } },
      { devid: 1, apikey: 1, layout: 1 },
      (e: Error, devices: any) => {
        for (var device of devices) {
          for (var widget of device.layout) {
            if (widget.type == "scheduler") {
              this.startJobs(device, widget, () => { });
            }
          }
        }
      })
  }

  startJobs(device: any, job: any, cb: Function) {
    var start = new Date(job.options.startTime).getTime();
    var now = new Date().getTime();
    var diff = (now - start);
    var intervalMS = parseInt(job.options.repeatAmount) * this.repeatEveryOptionsMS[job.options.repeatEvery];
    var count = diff / intervalMS;
    var next = Math.ceil(count);
    var nextMS = start + (next * intervalMS);
    var nextTime = new Date(nextMS);

    // calculate how many ms from now until nextTime
    var msUntilNextTrigger = nextTime.getTime() - new Date().getTime();

    //error checks incase time error
    if (isNaN(msUntilNextTrigger)) {
      return;
    }
    if (isNaN(intervalMS)) {
      return;
    }
    this.startATask(msUntilNextTrigger, intervalMS, device, job, cb)
  }

  startATask(nextMS: any, intervalMS: any, device: any, job: any, cb: Function) {

    if (isNaN(nextMS)) { return; }
    if (isNaN(intervalMS)) { return; }

    var taskToDo = () => {
      // check if this widget still exists
      this.db["states"].findOne(
        { layout: { $elemMatch: { i: job.i, type: "scheduler", "options.enabled": true } } },
        { devid: 1, apikey: 1, layout: 1 },
        (err: Error, result: any) => {
          /////
          var found = 0;

          if (result != null) {
            for (var widget of result.layout) {
              if (widget.i == job.i) {
                found = 1;
                this.eventHub.emit("device",
                  {
                    apikey: device.apikey,
                    packet: {
                      id: device.devid,
                      data: JSON.parse(widget.options.command),
                      meta: { method: "scheduler" }
                    }
                  }
                )
              }
            }
          }

          if (found == 0) {
            // if scheduler should no longer run:
            this.clearScheduler(job.i)
          }
          /////
        }
      )
    }

    this.scheduledTasks[job.i] = setTimeout(() => {
      taskToDo();
      this.scheduledTasks[job.i] = setInterval(() => {
        taskToDo();
      }, intervalMS)
    }, nextMS)

    cb(); //DONE
  }
}






