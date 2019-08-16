import { describe, it } from "mocha";
import { generateDifficult } from "../utils/utils"
import { Prototype } from "../utils/api"

import * as _ from "lodash"
import { start } from "repl";

var count = 1;
var last: any = new Date();

/*
  prototype test suite
  env server=https://prototype.dev.iotnxt.io port=443 https=true npm run test
*/

// https://mochajs.org/#getting-started

var toggle = true; //local or online

var testAccount: any = {};

if (toggle) {
    testAccount = {
        email: "test" + generateDifficult(32) + "@iotlocalhost.com",
        password: "newUser",

        /* dev server:                          */
        // host: "prototype.dev.iotnxt.io",
        // https: true

        /* localhost:                           */
        host: "localhost",
        https: false,
        port: 8080
    }
} else {
    testAccount = {
        email: "test" + generateDifficult(32) + "@iotlocalhost.com",
        password: "newUser",

        /* dev server:                          */
        host: "prototype.dev.iotnxt.io",
        https: true

        /* localhost:                           */
        // host: "localhost",
        // https: false,
        // port: 8080
    }
}




class TestBot {
    email: string;
    pass: string;
    protocon: Prototype;
    count: number = 0;

    constructor() {

        this.email = "test" + generateDifficult(32) + "@iotlocalhost.com"
        this.pass = "newUser"

        this.protocon = new Prototype({ host: "localhost", port: 8080 })
        this.protocon.register({ email: this.email, pass: this.pass }, (err, result) => {
            //console.log(err);
            //console.log(result);
            this.sendData();
            this.sendData();
            this.sendData();
            this.sendData();
            this.sendData();
        })
    }

    sendData() {

        var packet = { id: "test_httppost", data: { random: generateDifficult(32) } }
        count++;



        this.protocon.post(packet, (err, result) => {
            if (result) {
                //console.log(count);
                if (count % 1000 == 0) {
                    var now: any = new Date();
                    var delta = now - last;
                    last = now;
                    console.log(new Date().toISOString() + " " + delta + " " + count);
                }
                this.sendData();
            }
        })
    }
}


for (var users = 0; users < 100; users++) {
    var a = new TestBot;
}

