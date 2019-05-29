var net = require("net");
import * as events from "events";
import { clearInterval } from "timers";
import { log } from "../../log"
export var serversMem: any = {};

export const name = "scheduler";

var scheduledTasks: any = {}

export function init(app: any, db: any, eventHub: events.EventEmitter) {

  app.get("/api/v3/" + name + "/list", (req: any, res: any) => {

  });

  app.post("/api/v3/" + name + "/widget", (req: any, res: any) => {
    updateScheduler(db, req.body, eventHub, (e: Error, result: any) => {
      res.json({});
    })
  });

  // initialize on startup
  getAllSchedulersAndStart(db, eventHub);
}

var repeatEveryOptionsMS: any = {
  "second": 1000,
  "minute": 1000 * 60,
  "hour": 1000 * 60 * 60,
  "day": 1000 * 60 * 60 * 24,
  "week": 1000 * 60 * 60 * 24 * 7,
  "month": 1000 * 60 * 60 * 24 * 30,
  "year": 1000 * 60 * 60 * 24 * 365
}

var updateScheduler = (db: any, request: any, eventHub: any, cb: Function) => {
  clearScheduler(request.props.data.i)

  if (request.state.enabled) {
    startJobs(db, request.props.state, { i: request.props.data.i, options: request.state }, eventHub);
  }
}

var clearScheduler = (i: any) => {
  clearTimeout(scheduledTasks[i])
  clearInterval(scheduledTasks[i])
}

function getAllSchedulersAndStart(db: any, eventHub: any) {
  db["states"].find(
    { layout: { $elemMatch: { type: "scheduler", "options.enabled": true } } },
    { devid: 1, apikey: 1, layout: 1 },
    (e: Error, devices: any) => {
      for (var device of devices) {
        for (var widget of device.layout) {
          if (widget.type == "scheduler") {
            startJobs(db, device, widget, eventHub);
          }
        }
      }
    })
}

function startJobs(db: any, device: any, job: any, eventHub: any) {
  var start = new Date(job.options.startTime).getTime();
  var now = new Date().getTime();
  var diff = (now - start);
  var intervalMS = parseInt(job.options.repeatAmount) * repeatEveryOptionsMS[job.options.repeatEvery];
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
  startATask(db, msUntilNextTrigger, intervalMS, eventHub, device, job)
}


function startATask(db: any, nextMS: any, intervalMS: any, eventHub: any, device: any, job: any) {

  if (isNaN(nextMS)) { return; }
  if (isNaN(intervalMS)) { return; }

  var taskToDo = () => {
    // check if this widget still exists
    db["states"].findOne(
      { layout: { $elemMatch: { i: job.i, type: "scheduler", "options.enabled": true } } },
      { devid: 1, apikey: 1, layout: 1 },
      (err: Error, result: any) => {
        /////
        var found = 0;

        if (result != null) {
          for (var widget of result.layout) {
            if (widget.i == job.i) {
              found = 1;
              eventHub.emit("device",
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
          clearScheduler(job.i)
        }
        /////
      }
    )
  }

  scheduledTasks[job.i] = setTimeout(() => {
    taskToDo();
    scheduledTasks[job.i] = setInterval(() => {
      taskToDo();
    }, intervalMS)
  }, nextMS)

}