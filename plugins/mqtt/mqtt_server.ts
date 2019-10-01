import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";


import { MQTTServer } from "./lib/mqtt"
import { logger } from "../../server/shared/log";

export default class MQTT extends PluginSuperServerside {

    server_mqtt: MQTTServer
    server_mqtt_tls: MQTTServer | undefined;

    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver, plugins: any }) {
        super(props);


        this.server_mqtt = new MQTTServer({ mqtts: false })
        this.server_mqtt.on("userauth", this.userauth)
        this.server_mqtt.on("publish", this.publish);


        /** enable SECURE MQTTS ? */
        if (this.core.config.ssl) {
            this.server_mqtt_tls = new MQTTServer({ mqtts: true, sslOptions: this.core.config.sslOptions })
            this.server_mqtt_tls.on("userauth", this.userauth)
            this.server_mqtt_tls.on("publish", this.publish);
        }



        //

        // this.webserver.app.get("/api/v4/myplugin/test", (req, res) => {
        //     res.json({ test: "successful123!" })
        // })

        // this.webserver.app.post("/api/v4/myplugin/sendtest", (req, res) => {
        //     console.log(req.body);
        //     res.json({ test: "sendtestsuccess", recieved: req.body })
        // })
    }

    userauth = (apikey, cb) => {
        logger.log({ group: "mqtt_server", message: "userauth", data: {}, level: "verbose" })
        this.core.user({ apikey }, cb);
    }

    publish = (data, cb) => {
        logger.log({ group: "mqtt_server", message: "publish", data, level: "verbose" })
        this.core.datapost({ user: data.user, packet: data.packet }, cb)
    }
};

