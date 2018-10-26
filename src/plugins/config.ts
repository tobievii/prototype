export var plugins:any = []

import * as serialports from "./serialports/serialports"
import * as iotnxt from "./iotnxt/iotnxtserverside"
import * as tcp from "./tcp/pluginTcp_serverside"
import * as discord from "./discord/discord"
import * as mqttPlugin from "./mqttserver/mqttPlugin"

plugins.push(serialports)
plugins.push(iotnxt)
plugins.push(tcp)
plugins.push(discord);
plugins.push(mqttPlugin);