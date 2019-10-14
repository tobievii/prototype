import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";
import { logger } from "../../server/shared/log";
import { User } from "../../server/shared/interfaces";
import { validEmail } from "../../server/shared/shared";
import { EmailFormat } from "./emailservice"


export class AccountRecovery extends PluginSuperServerside {

    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver, plugins: any }) {
        super(props);

        // this adds a listener for POST /api/v4/admin/recover 
        this.webserver.app.post("/api/v4/admin/recover", this.handleEmailRecoveryRequest);
    }


    /** recieves a json request from webserver, checks if the user with that email 
     * exists in the db, and if so starts the recovery process.
     */
    handleEmailRecoveryRequest = (req, res) => {

        logger.log({
            group: "admin",
            message: "user request account recovery " + req.body.email,
            data: req.body,
            level: "info"
        })

        if (!req.body.email) { res.json({ error: "missing email property" }); return; }
        if (!validEmail(req.body.email)) { res.json({ error: "invalid email format" }); return; }

        this.core.user({ email: req.body.email }, (err, user) => {
            if (err) { res.json({ result: "error", message: "db error", error: "db error" }); return; }
            if (user) {

                this.emit("sendmail", this.generateRecoveryEmail(user), (err, result) => {
                    if (result) {
                        res.json({
                            result: "success",
                            message: "Success! User found. Email sent."
                        })
                    } else {
                        res.json({
                            result: "success",
                            message: "Success! User found. But something went wrong sending the email."
                        })
                    }
                })


            } else {
                res.json({
                    result: "notfound",
                    message: "Error! User with that email not found. Try again."
                })
            }
        })
    }


    generateRecoveryEmail = (user: User) => {
        var mail: EmailFormat = {
            from: "",
            to: user.email,
            subject: "Recover your account",
            text: "Test email for account recovery.",
            html: "<p>Test email for account recovery.</p>"
        }
        return mail;
    }
}

