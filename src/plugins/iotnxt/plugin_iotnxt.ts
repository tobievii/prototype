import * as events from "events"
import express = require('express');
import * as net from "net"

import { Plugin } from "../plugin"
import { log } from "../../log"
import Queue = require("bull");
var mongojs = require("mongojs")

import * as utils from "../../utils"

import { Gateway, GatewayType } from "./gateway"
var RedisEvent = require('redis-event');

export class PluginIotnxt extends Plugin {
  name = "iotnxt";
  db: any;
  eventHub: events.EventEmitter;

  isCluster: boolean = false;
  queue: Queue.Queue | undefined;
  ev: any;

  gateways: Gateway[] = [];

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.eventHub = eventHub;

    log("PLUGIN", this.name, "LOADED");
    // console.log(config.redis);
    // console.log(process.env.pm_id);
    // if redis is on and this is running inside PM2
    if (config.redis && process.env.pm_id && config.redis.redisEnable == true) {
      log("CLUSTER MODE ENABLED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      this.isCluster = true;
      // load balance
      this.queue = new Queue(this.name, 'redis://' + config.redis.host + ':' + config.redis.port);
      this.queue.process((job, done) => {
        log("PLUGIN", this.name, "RECIEVED JOB");
        this.processJob(job, () => {
          done();
        })
      })

      //listen to cluster events
      log("PLUGIN", this.name, "STARTING REDIS EVENT");
      this.ev = new RedisEvent(config.redis.host, ['iotnxtevents']);

      this.ev.on('ready', () => {
        console.log("REDIS EVENTS READY")
      });

      // is this the main node?
      if (process.env.pm_id == "0") {

        //wait for some other nodes to spin up
        setTimeout(() => {
          log("PLUGIN", this.name, "MAIN NODE " + process.env.pm_id);
          log("PLUGIN", this.name, "STARTING CLUSTER JOBS");
          this.clusterStart();
        }, 2500)
      }

    } else {
      // single instance
      setTimeout(() => {
        this.singleInstanceStart();
      }, 1500)
    }

    app.post("/api/v3/iotnxt/addgateway", (req: any, res: any) => {
      this.addgateway(req.body, req.user, (err: Error, result: any, gateway: any) => {
        if (err) res.json({ err: err.toString() });
        this.handlenewgateway(gateway);
        //this.connectgateway(db, req.body, eventHub, (errC: any, resultC: any) => { })
        res.json(result);
      });
    });

    app.get("/api/v3/iotnxt/gateways", (req: any, res: any) => {
      this.getgateways((err: Error, gateways: any) => {
        if (err) res.json({ err: err.toString() });

        for (var g in gateways) {
          delete gateways[g].Secret
        }

        res.json(gateways);
      });
    });

    app.post("/api/v3/iotnxt/setgatewaydevice", (req: any, res: any) => {
      var gateway = {
        GatewayId: req.body.GatewayId,
        HostAddress: req.body.HostAddress
      }
      this.setgatewaydevice(req.user, req.body.key, gateway, (err: Error, result: any) => {
        res.json(result);
      })
    });

  }

  handlePacket(deviceState: any, packet: any, cb: Function) {
    // log("PLUGIN", this.name, "HANDLE PACKET");
    // var job = { data: { type: "packet", packet } }
    // if (this.queue) {
    //   log("PLUGIN", this.name, "QUEUE JOB");
    //   this.queue.add(job);
    // } else {
    //   this.processJob(job, cb);
    // }
    //console.log(packet);

    if (deviceState.plugins_iotnxt_gateway) {
      // "DEVICE HAS IOTNXT GATEWAY SET!"

      var dispatchToCluster = false;
      if (this.isCluster) dispatchToCluster = true;

      for (var gateway of this.gateways) {
        if ((gateway.GatewayId == deviceState.plugins_iotnxt_gateway.GatewayId) &&
          (gateway.HostAddress == deviceState.plugins_iotnxt_gateway.HostAddress)) {
          //console.log("SUCCESS WE ARE CONNECTED TO THIS GATEWAY ALREADY")
          dispatchToCluster = false;
          gateway.handlePacket(deviceState, packet);
        }
      }
      // if we're running as a single instance or if we have this gateway connected..
      if (dispatchToCluster) {
        this.ev.pub('iotnxtevents:' + deviceState.plugins_iotnxt_gateway.HostAddress + "|" + deviceState.plugins_iotnxt_gateway.GatewayId, {
          deviceState, packet,
          launchedAt: new Date()
        });
      }
      // if we're running as a cluster
    }
  }

  /*
    ONLY USED IN PM2 CLUSTER MODE + redis
    process a cluster job
  */
  processJob(job: any, cb: Function) {
    log("PLUGIN", this.name, "PROCESSING JOB");

    if (job.data.type == "connect") {
      this.connectGateway(job.data.gateway);
    }

    if (job.data.type == "packet") {
      // handle packet
    }

    cb();
  }

  addgateway(gateway: any, user: any, cb: any) {
    //var gateway = gatewayRequest;
    gateway.default = false; // defaults to not the default
    gateway.connected = false;
    gateway.unique = utils.generateDifficult(64);
    gateway.type = "gateway"
    gateway["_created_on"] = new Date();
    gateway["_created_by"] = user["_id"];
    this.db.plugins_iotnxt.save(gateway, (err: Error, result: any) => { cb(err, result, gateway); });
  }

  handlenewgateway(gateway: any) {
    if (this.isCluster) {
      // let cluster connect to it
      if (this.queue) this.queue.add({ type: "connect", gateway });
    } else {
      // we connect to it.
      this.connectGateway(gateway);
    }
  }

  getgateways(cb: any) {
    this.db.plugins_iotnxt.find({ type: "gateway" }, (err: Error, data: any) => {
      if (err) {
        console.error("iotnxt plugin cannot get gateways");
        cb(err, undefined);
      }

      if (data == null) {
        cb(undefined, []);
      } else {
        cb(undefined, data);
      }
    });
  }

  /* 
    This function should only be run by one instance in a cluster.
    It gets the gateways to connect to and dispatches jobs to the cluster nodes to connect to the gateways individually.
  */
  clusterStart() {
    this.getgateways((err: Error, gateways: GatewayType[]) => {
      for (var gateway of gateways) {
        if (this.queue) this.queue.add({ type: "connect", gateway });
      }
    })
  }

  /*
    single instance version of the above. This connects to all gateways.
  */

  singleInstanceStart() {
    this.getgateways((err: Error, gateways: GatewayType[]) => {
      for (var gateway of gateways) {
        //if (this.queue) this.queue.add({ type: "connect", gateway });
        this.connectGateway(gateway);
      }
    })
  }


  /* connects to a gateway */
  connectGateway(gateway: GatewayType) {
    log("PLUGIN", this.name, "CONNECTING TO [" + gateway.GatewayId + "]");

    this.eventHub.emit("plugin", {
      plugin: this.name,
      event: {
        type: "gatewayUpdate",
        gateway: {
          unique: gateway.unique,
          connected: "connecting"
        }
      }
    })

    //this.calculateGatewayTree(gateway);
    var gatewayConnection = new Gateway(gateway, this.db)
    //
    gatewayConnection.on("connected", () => {
      var instance_id = "0";
      if (process.env.pm_id) {
        instance_id = process.env.pm_id
      }
      var update = {
        unique: gateway.unique,
        connected: true,
        instance_id,
        _connected_last: new Date()
      }
      this.updateGatewayDB(gateway.unique, update, () => { })
      this.eventHub.emit("plugin", {
        plugin: this.name,
        event: {
          type: "gatewayUpdate",
          gateway: update
        }
      })

      // if we're part of a cluster subscribe to cluster events for this gateway
      if (this.isCluster) {
        this.ev.on('iotnxtevents:' + gateway.HostAddress + '|' + gateway.GatewayId, (data: any) => {
          // console.log("IOTNXT CLUSTER RECIEVED GATEWAY PACKET")
          // console.log(data);
          // console.log("RECIEVED AT:" + new Date().toISOString())
          this.handlePacket(data.deviceState, data.packet, () => { })
        });
      }

    })
    //

    // handling incoming requests from commander/portal
    gatewayConnection.on("request", (request: any) => {
      this.eventHub.emit("device", request);
    })

    // error
    gatewayConnection.on("error", (error) => {
      var update = {
        unique: gateway.unique,
        connected: "error",
        error
      }

      this.updateGatewayDB(gateway.unique, update, () => { })
      this.eventHub.emit("plugin", {
        plugin: this.name,
        event: {
          type: "gatewayUpdate",
          gateway: update
        }
      })
    })

    this.gateways.push(gatewayConnection);
    //
  }

  setgatewaydevice(user: any, key: string, gateway: any, cb: Function) {

    if (user.level >= 100) {
      //admins
      this.db.states.update(
        { key },
        { "$set": { "plugins_iotnxt_gateway": { GatewayId: gateway.GatewayId, HostAddress: gateway.HostAddress } } },
        cb)
    } else {
      //users
      this.db.states.update(
        { key, apikey: user.apikey },
        { "$set": { "plugins_iotnxt_gateway": { GatewayId: gateway.GatewayId, HostAddress: gateway.HostAddress } } },
        cb)
    }
  }

  updateGatewayDB(unique: string, update: any, cb: Function) {
    this.db.plugins_iotnxt.update(
      { type: "gateway", unique },
      { "$set": update }, (err: Error, result: any) => {
        if (err) { cb(err, undefined); }
        if (result) { cb(err, result); }
      })
  }
}


