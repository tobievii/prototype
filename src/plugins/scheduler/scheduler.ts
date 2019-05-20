var net = require("net");
import * as events from "events";
import { clearInterval } from "timers";

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




var repeatEveryOptionsMS = {
  "second": 1000,
  "minute": 1000 * 60,
  "hour": 1000 * 60 * 60,
  "day": 1000 * 60 * 60 * 24,
  "week": 1000 * 60 * 60 * 24 * 7,
  "month": 1000 * 60 * 60 * 24 * 30,
  "year": 1000 * 60 * 60 * 24 * 365
}



var updateScheduler = (db: any, request: any, eventHub: any, cb: Function) => {
  //console.log(request);
  //console.log(request.props.data.i)

  if (request.state.enabled) {
    console.log("enable")
    clearTimeout(scheduledTasks[request.props.data.i])
    clearInterval(scheduledTasks[request.props.data.i])
    startJobs(request.props.state, { i: request.props.data.i, options: request.state }, eventHub);
  } else {
    console.log("disable")
    clearTimeout(scheduledTasks[request.props.data.i])
    clearInterval(scheduledTasks[request.props.data.i])
  }
}



function getAllSchedulersAndStart(db: any, eventHub: any) {
  db["states"].find(
    { layout: { $elemMatch: { type: "scheduler", "options.enabled": true } } },
    { devid: 1, apikey: 1, layout: { $elemMatch: { type: "scheduler", "options.enabled": true } } },
    (e: Error, devices: any) => {
      for (var device of devices) {
        for (var scheduler of device.layout) {
          startJobs(device, scheduler, eventHub);
        }
      }
    })
}


function startJobs(device: any, job: any, eventHub: any) {
  //console.log(JSON.stringify(device, null, 2))

  var start = new Date(job.options.startTime).getTime();
  var now = new Date().getTime();
  var diff = (now - start);
  var intervalMS = parseInt(job.options.repeatAmount) * repeatEveryOptionsMS[job.options.repeatEvery];


  var count = diff / intervalMS;
  var next = Math.ceil(count);
  //console.log(next)

  var nextMS = start + (next * intervalMS);
  var nextTime = new Date(nextMS);
  //console.log(nextTime);

  /////
  // calculate how many ms from now until nextTime

  var msUntilNextTrigger = nextTime.getTime() - new Date().getTime();


  if (isNaN(msUntilNextTrigger)) {
    console.log("SCHEDULER error msUntilNextTrigger is Nan")
    return;
  }
  if (isNaN(intervalMS)) {
    console.log("SCHEDULER error intervalMS is Nan")
    return;
  }
  startATask(msUntilNextTrigger, intervalMS, eventHub, device, job)
}


function startATask(nextMS: any, intervalMS: any, eventHub: any, device: any, job: any) {

  if (isNaN(nextMS)) { return; }
  if (isNaN(intervalMS)) { return; }

  console.log("SCHEDULER - STARTING TASK")

  var taskToDo = () => {
    console.log("SCHEDULED TASK RUN:" + device.devid + " " + job.options.command)
    eventHub.emit("device",
      {
        apikey: device.apikey,
        packet: {
          id: device.devid,
          data: JSON.parse(job.options.command),
          meta: { method: "scheduler" }
        }
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