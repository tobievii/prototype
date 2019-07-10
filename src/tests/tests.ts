import { describe, it } from "mocha";
import { generateDifficult } from "../utils"
import { Prototype } from "../utils/api"

const Cryptr = require('cryptr');
const cryptr = new Cryptr('prototype');

import * as _ from "lodash"

/*

  prototype test suite

  env server=https://prototype.dev.iotnxt.io port=443 https=true npm run test

*/

// https://mochajs.org/#getting-started


var testAccount: any = {
    email: "test" + generateDifficult(32) + "@iotlocalhost.com",
    password: cryptr.encrypt("newUser"),

    /* dev server:                          */
    // host: "prototype.dev.iotnxt.io",
    // https: true

    /* localhost:                           */
    host: "localhost",
    https: false,
    port: 8080
}



/*

if (process.env) {
  if (process.env.server) testAccount.server = process.env.server
  if (process.env.port) testAccount.port = parseInt(process.env.port)
  if (process.env.https) testAccount.https = (process.env.https === 'true')
  console.log(testAccount);
}

*/

describe("PROTOTYPE", () => {
    // instance for new user
    var prototype = new Prototype(testAccount);

    it("register", function (done) {
        this.timeout(5000);
        prototype.register(testAccount.email, testAccount.password, (err: Error, result: any) => {
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

    /* --------------------------------------------------------------------- */

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

    /* --------------------------------------------------------------------- */

    it("version", done => {
        prototype.version((err: Error, version: any) => {
            if (err) done(err);
            if (version) {
                done();
            }
        })
    })


    /* --------------------------------------------------------------------- */

    it("signin", done => {
        // fresh instance
        new Prototype(testAccount).signin(testAccount.email, testAccount.password, (err: Error, result: any) => {
            if (err) done(err);
            if (result) {
                if (result.signedin == true) done();
            }
        })
    })

    /* --------------------------------------------------------------------- */

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

    /* --------------------------------------------------------------------- */

    var packet = {
        id: "test_httppost",
        data: { random: generateDifficult(32) }
    }

    it("device HTTP POST", done => {
        if (testAccount.apikey == "") { done("no apikey yet!"); }

        new Prototype(testAccount).post(packet, (err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                if (response.result != "success") { done(new Error(response)); return; }
                done();
            }
        })
    })

    /* --------------------------------------------------------------------- */

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

    /* --------------------------------------------------------------------- */

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

    /* --------------------------------------------------------------------- */

    it("device HTTP STATE", done => {
        new Prototype(testAccount).state(packet.id, (err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                if (!response.key) { done(new Error("key missing from state")); return; }
                if (!response.apikey) { done(new Error("apikey missing")); return; }
                if (!response.devid) { done(new Error("devid missing")); return; }
                if (!response.payload) { done(new Error("payload missing")); return; }
                if (packet.data.random != response.payload.data.random) { done(new Error("date mismatch")); return; }
                done();
            }
        })
    })

    /* --------------------------------------------------------------------- */

    it("device HTTP STATES", done => {
        new Prototype(testAccount).states((err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                if (response[0].id != packet.id) { done(new Error("id mismatch")); return; }
                if (response[0].data.random != packet.data.random) { done(new Error("data mismatch")); return; }
                done();
            }
        })
    })

    /* --------------------------------------------------------------------- */

    it("device HTTP DELETE", done => {
        new Prototype(testAccount).delete(packet.id, (err: Error, response: any) => {
            if (err) done(err);
            if (response) {
                done();
            }
        })
    })

    /* --------------------------------------------------------------------- */


    it("HTTP -> SOCKET", done => {
        var id = "protTestHttpSocket"
        var test = Math.random()

        // SOCKET
        var account = _.clone(testAccount);
        account.protocol = "socketio";
        account.id = id;
        var protSocket = new Prototype(account);

        protSocket.on("connect", () => {
            // HTTP POST
            setTimeout(() => {
                new Prototype(testAccount).post({ id, data: { test } }, (e: Error, r: any) => {
                    if (e) done(e);
                })
            }, 100)

        })
        protSocket.on("data", (data: any) => {
            if (data.id != id) { done(new Error("id missing from socket packet")); return; }
            if (!data.data) { done(new Error("data missing from socket packet")); return; }
            if (data.data.test != test) { done(new Error("data mismatch from socket packet")); return; }
            done();
            protSocket.disconnect();
        })
    })

    /* --------------------------------------------------------------------- */

    it("HTTP -> MQTT", done => {
        var id = "protTestHttpMqtt"
        var test = Math.random()

        // MQTT
        var mqttaccount = _.clone(testAccount);
        mqttaccount.protocol = "mqtt";

        var protMqtt = new Prototype(mqttaccount);
        protMqtt.on("connect", () => {
            // HTTP POST
            new Prototype(testAccount).post({ id, data: { test } }, (e: Error, r: any) => { })
        })
        protMqtt.on("data", (data: any) => {
            if (data.id != id) { done(new Error("id missing from socket packet")); return; }
            if (!data.data) { done(new Error("data missing from socket packet")); return; }
            if (data.data.test != test) { done(new Error("data mismatch from socket packet")); return; }
            done();
            protMqtt.disconnect();
        })
    })

    /* --------------------------------------------------------------------- */

    it("MQTT -> SOCKET", function (done) {
        this.timeout(5000);
        var id = "protTestMqttSocket"
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

    /* --------------------------------------------------------------------- */

    it("MQTT -> HTTP", done => {
        var id = "protTestMqtt"
        var test = Math.random()

        var mqttaccount = _.clone(testAccount);
        mqttaccount.protocol = "mqtt";

        var protMqtt = new Prototype(mqttaccount);

        protMqtt.post({ id, data: { test } }, (e: Error, result: any) => {

            // Delay a bit
            setTimeout(() => {
                new Prototype(testAccount).view(id, (e: Error, data: any) => {
                    if (data.id != id) { done(new Error("id missing from packet")); return; }
                    if (!data.data) { done(new Error("data missing from packet")); return; }
                    if (data.data.test != test) { done(new Error("data mismatch from packet")); return; }
                    done();
                })
            }, 100)

            protMqtt.disconnect();
        })

    })

    /* --------------------------------------------------------------------- */

    it("SOCKET -> HTTP", done => {
        var id = "protTestSocketHttp"
        var test = Math.random()


        var socketAccount = _.clone(testAccount);
        socketAccount.protocol = "socketio";

        var protSocket = new Prototype(socketAccount)

        protSocket.on("connect", () => {

            setTimeout(() => {
                protSocket.post({ id, data: { test } }, (e: Error, result: any) => {
                    //
                    new Prototype(testAccount).view(id, (e: Error, data: any) => {
                        if (data.id != id) { done(new Error("id missing from packet")); return; }
                        if (!data.data) { done(new Error("data missing from packet")); return; }
                        if (data.data.test != test) { done(new Error("data mismatch from packet")); return; }
                        done();
                    })
                    protSocket.disconnect();
                    //
                })
            }, 100)

        })

    })

    /* --------------------------------------------------------------------- */

    it("SOCKET -> MQTT", done => {
        var id = "protTestSocketMqtt"
        var test = Math.random()

        var mqttaccount = _.clone(testAccount);
        mqttaccount.protocol = "mqtt";
        mqttaccount.id = id;

        var protMqtt = new Prototype(mqttaccount)

        protMqtt.on("connect", () => {
            var socketaccount = _.clone(testAccount);
            socketaccount.protocol = "socketio"
            new Prototype(socketaccount).post({ id, data: { test } })
        })

        protMqtt.on("data", (data) => {
            if (data.id != id) { done(new Error("id missing from packet")); return; }
            if (!data.data) { done(new Error("data missing from packet")); return; }
            if (data.data.test != test) { done(new Error("data mismatch from packet")); return; }
            done();
            protMqtt.disconnect();
        })
    })

    /* --------------------------------------------------------------------- */
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
})

