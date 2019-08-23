import { describe, it } from "mocha";
import { generateDifficult } from "../utils/utils"
import { Prototype } from "../utils/api"

import * as _ from "lodash"

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






// if (process.env) {
//   if (process.env.server) testAccount.server = process.env.server
//   if (process.env.port) testAccount.port = parseInt(process.env.port)
//   if (process.env.https) testAccount.https = (process.env.https === 'true')
//   console.log(testAccount);
// }



describe("PROTOTYPE", () => {

    // instance for new user
    var prototype = new Prototype(testAccount);

    it("register", function (done) {
        this.timeout(5000);
        prototype.register({ email: testAccount.email, pass: testAccount.password }, (err: Error, result: any) => {
            if (err) done(err);
            if (result) {
                if (result.error) done(new Error(result.error))
                if (result.account.apikey) {
                    testAccount.apikey = result.account.apikey;
                    done();
                }
            }
        })
    })

    it("account", done => {
        prototype.account((err: Error, account: any) => {
            if (err) done(err);
            if (account) {
                if (!account.uuid) { done(new Error("uuid missing")); return; }
                if (!account.apikey) { done(new Error("apikey missing")); return; }
                if (testAccount.apikey != account.apikey) { done(new Error("apikey mismatch")); return; }
                done();
            }
        })
    })

    it("version", done => {
        prototype.version((err: Error, version: any) => {
            if (err) done(err);
            if (version) {
                done();
            }
        })
    })

    it("signin", done => {
        // fresh instance
        new Prototype(testAccount).signin(testAccount.email, testAccount.password, (err: Error, result: any) => {
            if (err) done(err);
            if (result) {
                if (result.signedin == true) done();
            }
        })
    })

    it("account", done => {
        if (testAccount.apikey == "") { done("no apikey yet!"); }
        // fresh instance
        new Prototype(testAccount).account((err: Error, account: any) => {
            if (err) done(err);
            if (account) {
                if (!account.uuid) { done(new Error("uuid missing")); return; }
                if (!account.apikey) { done(new Error("apikey missing")); return; }
                if (testAccount.apikey != account.apikey) { done(new Error("apikey mismatch")); return; }
                done();
            }
        })
    })



    var packet = {
        id: "test_httppost",
        data: { random: generateDifficult(32) }
    }

    it("device HTTP POST", done => {
        if (testAccount.apikey == "") { done("no apikey yet!"); }

        new Prototype(testAccount).post(packet, (err, response) => {
            if (err) done(err);
            if (response) {
                if (response.result != "success") { done(new Error(response)); return; }
                done();
            }
        })
    })



    it("device HTTP VIEW", done => {
        if (testAccount.apikey == "") { done("no apikey yet!"); }

        new Prototype(testAccount).view(packet.id, (err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                if (response.data.random == packet.data.random) {
                    done();
                } else {
                    done(new Error("data mismatch"))
                }

            }
        })
    })



    it("device HTTP PACKETS", done => {
        new Prototype(testAccount).packets(packet.id, (err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                if (response[response.length - 1].data.random == packet.data.random) {
                    done();
                } else {
                    done(new Error("data mismatch"))
                }
            }
        })
    })



    it("device HTTP STATE", done => {
        new Prototype(testAccount).state(packet.id, (err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                console.log(response);
                if (!response.key) { done(new Error("key missing from state")); return; }
                if (!response.apikey) { done(new Error("apikey missing")); return; }
                if (!response.id) { done(new Error("id missing")); return; }
                if (!response.data) { done(new Error("payload missing")); return; }
                if (packet.data.random != response.data.random) { done(new Error("date mismatch")); return; }
                done();
            }
        })
    })



    it("device HTTP STATES", done => {
        new Prototype(testAccount).states((err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                if (response.error) { done(new Error(response.error)); return; }
                if (response[0].id != packet.id) { done(new Error("id mismatch")); return; }
                if (response[0].data.random != packet.data.random) { done(new Error("data mismatch")); return; }
                done();
            }
        })
    })




    it("device HTTP DELETE", done => {
        new Prototype(testAccount).delete(packet.id, (err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                done();
            }
        })
    })




    it("HTTP -> SOCKET", done => {
        var id = "prottesthttpsocket"
        var test = Math.random()

        // SOCKET
        var account = _.clone(testAccount);
        account.protocol = "socketio";
        account.id = id;

        var protSocket = new Prototype(account);

        protSocket.on("connect", () => {
            // HTTP POST
            //setTimeout(() => {
            new Prototype(testAccount).post({ id, data: { test } }, (e, r) => {
                if (e) done(e);
                //console.log(r);
                if (r.result != "success") { done(new Error("http post did not result success")) }
            })
            //}, 100)

        })
        protSocket.on("data", (data: any) => {
            if (data.id != id) { done(new Error("id missing from socket packet")); return; }
            if (!data.data) { done(new Error("data missing from socket packet")); return; }
            if (data.data.test != test) { done(new Error("data mismatch from socket packet")); return; }
            done();
            protSocket.disconnect();
        })
    })



    it("HTTP -> MQTT", done => {
        var id = "prottesthttpmqtt"
        var test = Math.random()

        // MQTT
        var mqttaccount = _.clone(testAccount);
        mqttaccount.protocol = "mqtt";

        var protMqtt = new Prototype(mqttaccount);
        protMqtt.on("connect", () => {
            // HTTP POST

            new Prototype(testAccount).post({ id, data: { test } }, (e, r) => { })


        })
        protMqtt.on("data", (data: any) => {
            if (data.id != id) { done(new Error("id missing from socket packet")); return; }
            if (!data.data) { done(new Error("data missing from socket packet")); return; }
            if (data.data.test != test) { done(new Error("data mismatch from socket packet")); return; }
            done();
            protMqtt.disconnect();
        })
    })


    it("MQTT -> SOCKET", function (done) {
        this.timeout(5000);
        var id = "prottestmqttsocket"
        var test = Math.random()

        // SOCKET LISTEN
        var socketaccount = _.clone(testAccount);
        socketaccount.protocol = "socketio";
        socketaccount.id = id;
        var protSocket = new Prototype(socketaccount)

        protSocket.on("connect", () => {
            // MQTT POST
            var mqttaccount = _.clone(testAccount);
            mqttaccount.protocol = "mqtt";
            mqttaccount.id = id;
            var protMqtt = new Prototype(mqttaccount).post({ id, data: { test } })
        })

        protSocket.on("data", data => {
            if (data.id != id) { done(new Error("id missing from socket packet")); return; }
            if (!data.data) { done(new Error("data missing from socket packet")); return; }
            if (data.data.test != test) { done(new Error("data mismatch from socket packet")); return; }
            done();
            protSocket.disconnect();
        });




    })



    it("MQTT -> HTTP", done => {
        var id = "prottestmqtt"
        var test = Math.random()

        var mqttaccount = _.clone(testAccount);
        mqttaccount.protocol = "mqtt";

        var protMqtt = new Prototype(mqttaccount);

        protMqtt.post({ id, data: { test } }, (e, result) => {

            new Prototype(testAccount).view(id, (e: Error, data: any) => {
                if (data.id != id) { done(new Error("id missing from packet")); return; }
                if (!data.data) { done(new Error("data missing from packet")); return; }
                if (data.data.test != test) { done(new Error("data mismatch from packet")); return; }
                done();
            })

            protMqtt.disconnect();
        })

    })



    it("SOCKET -> HTTP", done => {
        var id = "prottestsockethttp"
        var test = Math.random()


        var socketAccount = _.clone(testAccount);
        socketAccount.protocol = "socketio";

        var protSocket = new Prototype(socketAccount)

        protSocket.on("connect", () => {
            protSocket.post({ id, data: { test } }, (e, result) => {
                new Prototype(testAccount).view(id, (e: Error, data: any) => {
                    if (data.id != id) { done(new Error("id missing from packet")); return; }
                    if (!data.data) { done(new Error("data missing from packet")); return; }
                    if (data.data.test != test) { done(new Error("data mismatch from packet")); return; }
                    done();
                })
                protSocket.disconnect();
            })
        })
    })



    it("SOCKET -> MQTT", done => {
        var id = "prottestsocketmqtt"
        var test = Math.random()

        var mqttaccount = _.clone(testAccount);
        mqttaccount.protocol = "mqtt";
        mqttaccount.id = id;

        var protMqtt = new Prototype(mqttaccount)

        protMqtt.on("connect", () => {
            var socketaccount = _.clone(testAccount);
            socketaccount.protocol = "socketio"
            new Prototype(socketaccount).post({ id, data: { test, asdf: "zzz" } }, () => { })
        })

        protMqtt.on("data", (data) => {
            if (data.id != id) { done(new Error("id missing from packet")); return; }
            if (!data.data) { done(new Error("data missing from packet")); return; }
            if (data.data.test != test) { done(new Error("data mismatch from packet")); return; }
            done();
            protMqtt.disconnect();
        })
    })

    /*
})

describe("PLUGINS", () => {
    describe("TELTONIKA", () => {
        var portInfo: any;

        it("Register Port", function (done) {
            //this.timeout(5000);
            new Prototype(testAccount).setTeltonikaPort((err: any, response: any) => {

                if (err) { done(new Error(err)); return }
                if (response) {
                    portInfo = response;
                    if (response.apikey == testAccount.apikey && response.port) {
                        done(); return
                    } else {
                        done(new Error("The port was assigned to a different user.")); return
                    }
                }
            })
        })

        it("Get Port", function (done) {
            //this.timeout(5000);
            new Prototype(testAccount).getTeltonikaPort((err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                if (response) {
                    if (response.port == portInfo.port) {
                        done(); return
                    } else {
                        done(new Error("The port returned it not the same as the port just created.")); return
                    }
                }
            })
        })

        it("send data", function (done: any) {
            new Prototype(testAccount).teltonikaTest(portInfo.port, testAccount.host, (e: Error, result: any) => {
                if (e) { done(e); }
                if (result) { done(); }
            });
        });
    })

    describe("IOTNXT", () => {
        var options: any;
        var packet = {
            id: "protTestHttpSocket",
            data: { random: generateDifficult(32) }
        }
        var packet2 = {
            id: "protTestHttpMqtt",
            data: { random: generateDifficult(32) }
        }
        var gateway = {
            GatewayId: "gateway",
            Secret: generateDifficult(16),
            HostAddress: "greenqueue.prod.iotnxt.io",
            PublicKey: "<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>"
        }

        it("Add Gateway", function (done) {
            new Prototype(testAccount).addgateway(gateway, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })

        it("Set Device Gateway(KEY)", function (done) {
            options = "key"
            new Prototype(testAccount).setdevicegateway(packet.id, gateway.GatewayId, gateway.HostAddress, options, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })

        it("Set Device Gateway(DEVID)", function (done) {
            options = "devid"
            new Prototype(testAccount).setdevicegateway(packet2.id, gateway.GatewayId, gateway.HostAddress, options, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })

        it("Get Gateways", function (done) {
            new Prototype(testAccount).getgateways((err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })

        it("Remove Gateway", function (done) {
            new Prototype(testAccount).deletegateway((err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) {
                    done(); return
                }
            })
        })
    })
})

describe("FEATURES", () => {
    var packet = {
        id: "protTestHttpSocket",
        data: { random: generateDifficult(32) }
    }
    var code = "// uncomment below to test \"workflow\" processing \n// packet.data.test = \"testing\"\nworkflow code;\ncallback(packet); "
    var layout = [
        {
            "i": "0",
            "x": 0,
            "y": 0,
            "w": 8,
            "h": 4,
            "type": "Calendar",
            "dataname": "calendar"
        },]

    describe("DEVICE SHARING", () => {
        it("SHARE DEVICE", function (done) {
            new Prototype(testAccount).shareDevice(packet.id, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })

        it("UNSHARE DEVICE", function (done) {
            new Prototype(testAccount).unshareDevice(packet.id, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })
    })

    describe("WORKFLOW", () => {
        it("ASSIGN DEVICE WORKFLOW", function (done) {
            new Prototype(testAccount).assignDevWorkflow(code, packet.id, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })
    })

    describe("DASHBOARD", () => {
        it("ASSIGN DEVICE DASHBOARD", function (done) {
            new Prototype(testAccount).assignDevDasboard(packet.id, layout, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })
    })

    describe("CLEAR DATA", () => {
        it("CLEAR DEVICE DATA", function (done) {
            new Prototype(testAccount).clearDeviceData(packet.id, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })

        it("CLEAR DEVICE DATA & HISTORY", function (done) {
            new Prototype(testAccount).clearDevDataHist(packet.id, (err: any, response: any) => {
                if (err) { done(new Error(err)); return }
                else if (response) { done(); return }
            })
        })
    })
    */
})

