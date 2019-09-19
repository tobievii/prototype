import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";


export default class Admin extends PluginSuperServerside {
    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver }) {
        super(props);

        this.webserver.app.get("/api/v4/admin/test", (req, res) => {
            res.json({ test: "successful123!" })
        })
    }
};

