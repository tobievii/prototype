import { EventEmitter } from "events";
import { version } from "../../config";
import * as iotnxt from "./iotnxtqueue";
import { log } from "../../log"
import * as _ from "lodash";

export interface GatewayType {
  "GatewayId": string;
  "Secret": string,
  "HostAddress": string;
  "PublicKey": string;
  "connected": boolean | undefined,
  "unique": string,
  "type": string,
  "_created_on": Date,
  "_created_by": any,
  "error": any
}

export class Gateway extends EventEmitter {
  GatewayId: string = "";
  HostAddress: string = "";
  iotnxtqueue: iotnxt.IotnxtQueue;
  gateway: GatewayType;
  db: any;
  deviceTree: any;

  constructor(gateway: GatewayType, db: any) {
    super();
    this.db = db;

    // just makes it easier
    this.GatewayId = gateway.GatewayId;
    this.HostAddress = gateway.HostAddress;

    this.gateway = gateway;

    this.deviceTree = {}

    this.calculateGatewayTree((e: Error, deviceTree: object) => {
      if (deviceTree) {
        this.deviceTree = deviceTree;
        this.connect(deviceTree, (err: Error, queue: any) => {
          this.emit("connected")
        });
      }
    });

  }


  /* find devices and calculate their equivalent tree for compatibility with iotnxt portal */
  calculateGatewayTree(cb: Function) {
    this.db.states.find({
      "plugins_iotnxt_gateway": {
        GatewayId: this.gateway.GatewayId,
        HostAddress: this.gateway.HostAddress
      }
    }, (err: Error, devices: any[]) => {


      if (devices == null) {
        cb(null, {}); //empty
      } else {
        var deviceTree: any = {};

        for (var device of devices) {
          var flatdata = recursiveFlat(device.payload.data);
          var Properties: any = {};
          for (var key in flatdata) {
            if (flatdata.hasOwnProperty(key)) {
              Properties[key] = {
                PropertyName: key,
                DataType: null
              };
            }
          }

          var Route = (device.apikey + "|1:" + device.devid + "|1").toUpperCase();
          deviceTree[Route] = {
            Make: null,
            Model: null,
            DeviceName: Route,
            DeviceType: device.devid,
            Properties: Properties
          };
        }
        cb(null, deviceTree);
      }


    })
  }

  connect(deviceTree: any, cb: Function) {
    this.iotnxtqueue = new iotnxt.IotnxtQueue(
      {
        GatewayId: this.gateway.GatewayId,
        secretkey: this.gateway.Secret,
        FirmwareVersion: version.version,
        Make: "PROTOTYPE",
        Model: version.description,
        publickey: this.gateway.PublicKey,
        hostaddress: this.gateway.HostAddress
      }, deviceTree, true);


    this.iotnxtqueue.on("error", (err: Error) => {
      log("IOTNXT [" + this.gateway.GatewayId + "] ERROR: " + err);
      this.emit("error", err);
    })

    this.iotnxtqueue.on("connect", () => {
      log("IOTNXT [" + this.GatewayId + "] CONNECTED");
      cb(undefined, this.iotnxtqueue);
    });

    this.iotnxtqueue.on("disconnect", () => { });

  }


  handlePacket(deviceState: any, packet: any) {
    //calculate new device tree;
    //console.log("calculate new device tree")
    this.calculateGatewayTree((e: Error, deviceTree: object) => {
      if (deviceTree) {
        // any new endpoints?
        var diff = difference(deviceTree, this.deviceTree)
        if (_.isEmpty(diff)) {
          //console.log("no need to register new endpoints");
          this.updateDevicePublish(packet);
        } else {
          //console.log("need to register new endpoints");
          // register endpoints
          this.iotnxtqueue.registerEndpoints(deviceTree, (e: Error, result: any) => {
            if (result) {
              this.deviceTree = deviceTree;
              this.updateDevicePublish(packet);
            }
          })
          // updateDevicePublish
        }
      }
    });
  }

  /* takes a prototype packet and converts it to iotnxt portal format 
    updates the state
    publishes state
  */
  updateDevicePublish(packet: any) {
    var Route = (packet.apikey + "|1:" + packet.devid + "|1").toUpperCase();

    this.iotnxtqueue.clearState();

    var flatdata = recursiveFlat(packet.payload.data);
    for (var propertyName in flatdata) {
      if (flatdata.hasOwnProperty(propertyName)) {
        if (typeof flatdata[propertyName] == "object") {
          this.iotnxtqueue.updateState(
            Route,
            propertyName,
            JSON.stringify(flatdata[propertyName])
          );
        } else {
          this.iotnxtqueue.updateState(
            Route,
            propertyName,
            flatdata[propertyName]
          );
        }
      }
    }

    this.iotnxtqueue.publishState(packet, (err: Error, result: any) => {
      if (err) {
        //todo: cleanup error code and retry
        log("IOTNXT [" + this.gateway.GatewayId + "] PUBLISHSTATE ERROR: " + err);
        delete this.iotnxtqueue;
        this.connect(this.deviceTree, () => {
          log("IOTNXT [" + this.gateway.GatewayId + "] PUBLISHSTATE RECONNECTED");
          //once reconnected try again... recursive.
          this.updateDevicePublish(packet);
          // todo: buffer packets while reconnected?.. needs special testing here.
        })
      }
      if (result) log("IOTNXT [" + this.gateway.GatewayId + "] PUBLISHSTATE SUCCESS");
    })
  }
}




export function recursiveFlat(inObj: any) {
  var res: any = {};

  (function recurse(obj, current) {
    for (var key in obj) {
      var value = obj[key];
      var newKey: any = current ? current + "." + key : key; // joined key with dot
      if (value && typeof value === "object") {
        recurse(value, newKey); // it's a nested object, so do it again
      } else {
        res[newKey] = value; // it's not an object, so set the property
      }
    }
  })(inObj);

  return res;
}

export function difference(object: any, base: any) {

  if (typeof object !== "object") { object = {} }
  if (typeof base !== "object") { base = {} }

  function changes(object: any, base: any) {
    return _.transform(object, function (result: any, value: any, key: any) {
      if (!_.isEqual(value, base[key])) {
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }

  return changes(object, base);
}