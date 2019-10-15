import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";
import { logger } from "../../server/shared/log";
import { EmailService } from "./emailservice"
import { AccountRecovery } from "./accountrecovery";
import { AccountVerification } from "./accountverification"
import { validEmail } from "../../server/shared/shared";
import { User } from "../../server/shared/interfaces";


var mongojs = require('mongojs')
var ObjectId = mongojs.ObjectId;

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

        // -------------------------------------------
        // user account email change:
        this.webserver.app.post("/api/v4/admin/emailchange", (req: any, res) => {
            if (!req.user) { res.json({ result: "error", message: "user not authenticated" }); return; }
            if (!req.body.email) { res.json({ result: "error", message: "expecting email string" }); return; }
            if (!validEmail(req.body.email)) { res.json({ result: "error", message: "not a valid email" }); return; }
            ///
            this.documentstore.db.users.findOne({ "apikey": req.user.apikey }, (e: Error, user: User) => {
                if (user) {
                    ////
                    delete user["_id"];
                    user.email = req.body.email;
                    user.emailverified = false;

                    this.documentstore.db.users.update({ "apikey": req.user.apikey }, user, (err: Error, result: any) => {
                        if (err) { console.log(err); return; }
                        if (result) {
                            res.json({ result: "success", message: "email successfully changed" })
                        }
                    })

                    ////
                }

            })
            ///
        })

        // -----------------------------------------------
    }


}

