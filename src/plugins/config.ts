export var plugins: any = []

import * as account from "./account/account"
import * as admin from "./admin/admin"
// import * as serialports from "./serialports/serialports"
import * as efento from "./efento/plugin_efento"
import * as iotnxt from "./iotnxt/iotnxtserverside"
import * as tcpPlugin from "./tcp/pluginTcp_serverside"
import * as discord from "./discord/discord"
import * as mqttPlugin from "./mqttserver/mqttPlugin"
import * as httpPlugin from "./http/pluginHTTP_serverside"
import * as notifications from "./notifications/notifications"
import * as teltonika from "./teltonika/plugin_teltonika"


plugins.push(account)
plugins.push(admin)
// plugins.push(serialports)
plugins.push(iotnxt)
plugins.push(tcpPlugin)
plugins.push(discord);
plugins.push(mqttPlugin);
plugins.push(httpPlugin);
plugins.push(notifications);
plugins.push(teltonika);
plugins.push(efento)

import hf2111a from "./HF2111A/plugin_HF2111A"
plugins.push(hf2111a);


import * as scheduler from "./scheduler/scheduler"
plugins.push(scheduler);