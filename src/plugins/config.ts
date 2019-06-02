import * as events from "events"
import express = require('express');

import { PluginAdmin } from "./admin/admin"
import { PluginAccount } from "./account/account"
import { PluginIotnxt } from "./iotnxt/plugin_iotnxt"

export function pluginsInitialize(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
  var plugins: any = [];

  // if (config.redis) {
  //   plugins.push(new PluginCluster(config, app, db, eventHub));
  // }

  plugins.push(new PluginAdmin(config, app, db, eventHub));
  plugins.push(new PluginAccount(config, app, db, eventHub));
  plugins.push(new PluginIotnxt(config, app, db, eventHub));

  return plugins;
}

//// OLD BELOW

import * as account from "./account/account"
import * as admin from "./admin/admin"
// import * as serialports from "./serialports/serialports"
import * as efento from "./efento/plugin_efento"
import * as tcpPlugin from "./tcp/pluginTcp_serverside"
import * as discord from "./discord/discord"
import * as mqttPlugin from "./mqttserver/mqttPlugin"
import * as httpPlugin from "./http/pluginHTTP_serverside"
import * as notifications from "./notifications/notifications"
import * as teltonika from "./teltonika/plugin_teltonika"

// pluginClasses.push(account)
// pluginClasses.push(admin)
// pluginClasses.push(serialports)
//pluginClasses.push(iotnxt)
//pluginClasses.push(tcpPlugin)
//pluginClasses.push(discord);
//pluginClasses.push(mqttPlugin);
//pluginClasses.push(httpPlugin);
//pluginClasses.push(notifications);
//pluginClasses.push(teltonika);
//pluginClasses.push(efento)

// import hf2111a from "./HF2111A/plugin_HF2111A"
// pluginClasses.push(hf2111a);


// import * as scheduler from "./scheduler/scheduler"
// pluginClasses.push(scheduler);


//import { PluginCluster } from "./cluster/plugin_cluster"

