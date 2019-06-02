export var plugins = []

plugins.push(require("./admin/admin_main.jsx"))
plugins.push(require("./account/pluginAccount.jsx"))
plugins.push(require("./iotnxt/pluginIotnxt.jsx"))
plugins.push(require("./http/pluginHTTP.jsx"))
plugins.push(require("./tcp/pluginTcp.jsx"))

// todo: convert to cluster compatible plugins:

// plugins.push(require("./discord/discord.jsx"))


// plugins.push(require("./teltonika/plugin_teltonika.jsx"))
// plugins.push(require("./hf2111a/client_hf2111a.jsx"))
// plugins.push(require("./Efento/plugin_efento.jsx"))
//plugins.push(require("./serialports/pluginSerialPort.jsx"))
//plugins.push(require("./editor/pluginEditor.jsx"))