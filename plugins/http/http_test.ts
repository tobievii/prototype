import { PluginConfigTestProps } from "../../server/tests/tests"
import { describe, it, reporters } from "mocha";
import * as request from "request";
import { generate } from "../../server/utils/utils"

export default function test(props: PluginConfigTestProps) {

    describe("PLUGIN [HTTP]", () => {



        /** ----------------------------------------------------------------- */

        it("Can add a http endpoint", done => {
            done();
            // request.post(props.uri + "/api/v3/iotnxt/addgateway",
            //     { headers: props.headers, json: gateway }, (err, res, response) => {
            //         if (err) done(err);
            //         if (!response) { done(new Error("invalid response")); return; }

            //         if (response.GatewayId != gateway.GatewayId.toUpperCase()) {
            //             done(new Error("GatewayId does not match!"));
            //             return;
            //         }

            //         if (response.Secret != gateway.Secret) {
            //             done(new Error("Secret does not match!"));
            //             return;
            //         }

            //         if (response.HostAddress != gateway.HostAddress) {
            //             done(new Error("HostAddress does not match!"));
            //             return;
            //         }

            //         if (!response.unique) {
            //             done(new Error("Missing unique parameter"));
            //             return;
            //         }

            //         if (!response["_created_on"]) {
            //             done(new Error("Missing _created_on parameter"));
            //             return;
            //         }

            //         if (!response["_created_by"]) {
            //             done(new Error("Missing _created_by parameter"));
            //             return;
            //         }

            //         if (!response._created_by.publickey) {
            //             done(new Error("Missing user publickey on _created_by"));
            //             return;
            //         }


            //         done();

            //     })
        })

        /** ----------------------------------------------------------------- */


        it("Can delete a gateway", function (done) {
            // this.timeout(props.timeout); // crazy slow on prod.

            // const gatewayremove: GatewayRemove = {
            //     GatewayId: gateway.GatewayId,
            //     HostAddress: gateway.HostAddress
            // }

            // request.post(props.uri + "/api/v3/iotnxt/removegateway",
            //     { headers: props.headers, json: gatewayremove },
            //     (err, res, response) => {

            //         if (response.deletedCount == 1) {
            //             done();
            //         } else {
            //             console.log(err, response);
            //         }
            //     })

            /** ----------------------------------------------------------------- */

        });
    });
}
