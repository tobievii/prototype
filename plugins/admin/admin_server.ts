import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";
import { logger } from "../../server/shared/log";
import { EmailService } from "./emailservice"

export default class Admin extends PluginSuperServerside {
    emailservice: EmailService;

    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver, plugins: any }) {
        super(props);

        // this handles the email setup api calls and so on
        this.emailservice = new EmailService(props);
    }

}

