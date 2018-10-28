export var plugins:any = []

import * as serialports from "./serialports/serialports"
import * as iotnxt from "./iotnxt/iotnxtserverside"
import * as tcpPlugin from "./tcp/pluginTcp_serverside"
import * as discord from "./discord/discord"
import * as mqttPlugin from "./mqttserver/mqttPlugin"
import * as httpPlugin from "./http/pluginHTTP_serverside"

plugins.push(serialports)
plugins.push(iotnxt)
plugins.push(tcpPlugin)
plugins.push(discord);
plugins.push(mqttPlugin);
plugins.push(httpPlugin);