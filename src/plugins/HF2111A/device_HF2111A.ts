import * as net from "net";
import { EventEmitter } from "events";


export class DeviceHF2111A extends EventEmitter {

  device: any = {};

  constructor(socket: net.Socket) {
    super();
    this.handleSocket(socket);
  }

  handleSocket(socket: net.Socket) {
    socket.on("data", (data) => {
      // console.log(new Date().toISOString())
      // console.log(data)
      // console.log(data.toString())

      this.device.remoteAddress = socket.remoteAddress;
      if (data.toString().indexOf("HF2111A") == 0) {
        this.device.iccid = data.toString().split("_")[1]
        this.emit("connected", this.device)
      }
    })
  }
}