import { plugins } from "../config"
export var devices = []

for (var i in plugins) {
    if (plugins[i].AddDevice) {
        devices.push(plugins[i].AddDevice)
    }
}

devices.push(require("./bosch.jsx"))
devices.push(require("./efento.jsx"))

