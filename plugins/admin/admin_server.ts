import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";
import { logger } from "../../server/shared/log";


export default class Admin extends PluginSuperServerside {
    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver, plugins: any }) {
        super(props);

        this.webserver.app.get("/api/v3/admin/registration", (req: any, res: any) => {
            if (req.user.admin) {
                this.documentstore.db.plugins_admin.findOne({ settings: "registration" }, (err, result) => {
                    if (err) { res.json(err); } else {
                        delete result["_id"]
                        res.json(result);
                    }
                });
            } else { res.json({ err: "not sufficient user level", result: null }); }
        });

        this.webserver.app.post("/api/v3/admin/registration", (req: any, res: any) => {
            logger.log({ group: "admin", message: "recieved net server registration settings", level: "warn", data: req.body })
            if (req.user.admin) {
                console.log(req.body);
                this.documentstore.db.plugins_admin.update({
                    settings: "registration"
                }, req.body, { upsert: true }, (err, result) => {
                    console.log(result);
                    res.json(result);
                });
            } else { res.json({ err: "not sufficient user level", result: null }); }
        });

        this.checkifdbentryexists();
    }



    /** this creates the default entry for email registration */
    checkifdbentryexists() {
        this.documentstore.db.plugins_admin.findOne({ settings: "registration" }, (err, result) => {
            if (result == null) {
                // create new
                var cleanInput = {
                    settings: "registration",
                    userRegistration: true, //default on
                    userEmailVerify: false, //default off
                    nodeMailerTransportHost: "",
                    nodeMailerTransportPort: "",
                    nodeMailerTransportAuthUser: "",
                    nodeMailerTransportAuthPass: "",
                    nodeMailerTransportFrom: ""
                }
                this.documentstore.db.plugins_admin.update({ settings: "registration" }, cleanInput, { upsert: true });
                //
            }
        });
    }



}

