import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";

import { Teltonika as TeltonikaProtocol } from "./lib/lib_teltonika"
import * as net from "net"
import { logger } from "../../server/shared/log";

export default class Teltonika extends PluginSuperServerside {
    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver, plugins: any }) {
        super(props);

        var mainteltonika = net.createServer(socket => {



            socket.on("error", (err) => {
                logger.log({ group: "teltonika", message: "error " + err.toString(), level: "error" })
            })

            var device = new TeltonikaProtocol(socket);

            device.on("data", (data: any) => {
                logger.log({ group: "teltonika", message: "data recieved", level: "info" })
                console.log(data);
            })

            device.on("end", () => {
                logger.log({ group: "teltonika", message: "connection end", level: "info" })
            })
        })


        logger.log({ group: "teltonika", message: "server listening on port 12000", level: "info" })
        mainteltonika.listen(12000);

        // start webserver for port 12000 that should ideally handle any teltonika device type

        // this.webserver.app.get("/api/v4/myplugin/test", (req, res) => {
        //     res.json({ test: "successful123!" })
        // })

        // this.webserver.app.post("/api/v4/myplugin/sendtest", (req, res) => {
        //     console.log(req.body);
        //     res.json({ test: "sendtestsuccess", recieved: req.body })
        // })
    }
};

