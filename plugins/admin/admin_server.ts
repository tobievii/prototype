import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";
import { logger } from "../../server/shared/log";
import { EmailService } from "./emailservice"
import { AccountRecovery } from "./accountrecovery";
import { AccountVerification } from "./accountverification"

export default class Admin extends PluginSuperServerside {
    emailservice: EmailService;
    accountrecoveryservice: AccountRecovery;
    accountverificationservice: AccountVerification;

    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver, plugins: any }) {
        super(props);

        // this handles the email setup api calls and so on
        this.emailservice = new EmailService(props);
        this.accountrecoveryservice = new AccountRecovery(props);
        this.accountverificationservice = new AccountVerification(props);

        // allows acccount recover service to be able to send emails.
        this.accountrecoveryservice.on("sendmail", (mail, cb) => {
            this.emailservice.sendmail(mail, cb);
        })

        // allows account verification service to be able to send emails.
        this.accountverificationservice.on("sendmail", (mail, cb) => {
            this.emailservice.sendmail(mail, cb);
        })
    }

}

