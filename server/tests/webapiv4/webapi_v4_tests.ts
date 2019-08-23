import { describe, it } from "mocha";
import * as _ from "lodash"

import * as request from "request"

var config = {
    uri: "http://localhost:8080"
}

export function webapi_v4() {
    describe("REST API V4", () => {
        it("version", function (done) {
            request.get(config.uri + "/api/v4/version", { json: true }, (err: Error, res: any, body: any) => {
                if (err) done(err);
                if (body) {
                    if (!body.name) { done("missing name property"); return }
                    if (!body.version) { done("missing version property"); return }
                    if (!body.description) { done("missing description property"); return }

                    done();
                }
            })
        })
    })

    describe("REST API V4 - ACCOUNT", () => {

        it("should respond with user not authenticated", function (done) {
            request.get(config.uri + "/api/v4/account", { json: true }, (err: Error, res: any, body: any) => {
                if (err) done(err);
                if (body) {

                    // should only respond with {err:'Error: user not authenticated'} 
                    if (Object.keys(body).length != 1) {
                        done(new Error("incorrect response from server. too many properties"))
                    }

                    if (body.err == 'Error: user not authenticated') { done(); } else {
                        done(new Error("incorrect response from server"))
                    }
                }
            })
        })

        it("should not allow changing of account data maliciously", function (done) {
            request.post(config.uri + "/api/v4/account", { json: { change: { a: 1 } } }, (err, res, body) => {
                if (err) done(err);
                if (body) {
                    // should only respond with {err:'Error: user not authenticated'} 
                    if (Object.keys(body).length != 1) {
                        done(new Error("incorrect response from server. too many properties"))
                    }

                    if (body.err == 'Error: user not authenticated') { done(); } else {
                        done(new Error("incorrect response from server"))
                    }
                }
            })
        })

    })

}



/*
    // gets our latest account details
    account(cb: Function) {
        request.get(this.uri + "/api/v4/account",
            { headers: this.headers, json: true },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) cb(null, body);
            }
        )
    }

    signin(email: string, pass: any, cb: Function) {
        request.post(this.uri + "/signin", { json: { email, pass } }, (err: Error, res: any, body: any) => {
            if (err) cb(err);
            if (body) {
                if (body.err) { cb(new Error(body.err)); return; }
                if (body.error) { cb(new Error(body.error)); return; }
                if (body.signedin == true) cb(null, body);
            }
        })
    }

    version(cb: Function) {
        request.get(this.uri + "/api/v4/version", { json: true }, (err: Error, res: any, body: any) => {
            if (err) cb(err);
            if (body) {
                cb(null, body);
            }
        })
    }

    */