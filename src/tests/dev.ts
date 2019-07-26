import { TeltonikaDeviceSim } from "../plugins/teltonika/test_teltonika"

var device = new TeltonikaDeviceSim({host:"localhost", port: 12002 })

device.test()