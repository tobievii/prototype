import { describe, it } from "mocha";
import { generateDifficult } from "../../utils/utils"

import * as _ from "lodash"
import * as request from "request";
import * as mqtt from "mqtt";

interface TESTCONFIG {
    hostname: string
    httpprot: string
    httpport: string
    mqttprot: string
}

export function webapi_v3() {

    var testconfig: TESTCONFIG = { hostname: "", httpprot: "", httpport: "", mqttprot: "" };


    var preset = "localhost";
    //var preset = "dev";
    //var preset = "prod";
    //var preset = "8bo";

    if (preset == "localhost") {
        testconfig.hostname = "localhost"
        testconfig.httpport = ":8080"
        testconfig.httpprot = "http://"
        testconfig.mqttprot = "mqtt://"
    }

    if (preset == "dev") {
        testconfig.hostname = "prototype.dev.iotnxt.io"
        testconfig.httpport = "" // default to 443
        testconfig.httpprot = "https://"
        testconfig.mqttprot = "mqtts://"
    }

    if (preset == "prod") {
        testconfig.hostname = "prototype.iotnxt.io"
        testconfig.httpport = "" // default to 443
        testconfig.httpprot = "https://"
        testconfig.mqttprot = "mqtt://"
    }

    if (preset == "8bo") {
        testconfig.hostname = "8bo.org"
        testconfig.httpport = "" // default to 443
        testconfig.httpprot = "https://"
        testconfig.mqttprot = "mqtt://"
    }



    var testAccount: any = { email: "test" + generateDifficult(32) + "@iotlocalhost.com", password: "newUser" };



    var uri = testconfig.httpprot + testconfig.hostname + testconfig.httpport;
    var mqtturi = testconfig.mqttprot + testconfig.hostname

    var headers = { Authorization: "" };
    var timeout = 5000;

    var account: any;           // instance for new user

    describe("PROTOTYPE V3 API", () => {

        /** test registration of new accounts */
        it("register", function (done) {
            this.timeout(timeout);
            request.post(uri + "/api/v3/admin/register", { json: { email: testAccount.email, pass: testAccount.password } }, (err, res, response) => {
                if (err) { done(err); return }
                if (response) {
                    if (!response.account) { done(new Error("Missing account from response.")); return; }
                    if (!response.account.apikey) { done(new Error("Missing apikey from account response.")); return; }
                    account = response.account;
                    done();
                }
            })
        })

        /** get account information using auth header */
        it("account", function (done) {
            this.timeout(timeout); // crazy slow on prod.

            //generate headers
            headers = { Authorization: "Basic " + Buffer.from("api:key-" + account.apikey).toString("base64") }

            request.get(uri + "/api/v3/account", { headers, json: true }, (err, res, response) => {
                if (err) done(err);
                if (response) {
                    if (!response.uuid) { done(new Error("uuid missing from response")); return; }
                    if (!response.apikey) { done(new Error("apikey missing from response")); return; }
                    if (account.apikey != response.apikey) { done(new Error("apikey mismatch from response")); return; }
                    done();
                }
            })
        })

        /** get server version information */
        it("version", done => {
            request.get(uri + "/api/v3/version", { json: true }, (err, res, response) => {
                if (err) done(err);
                if (response) {
                    if (!response.version) { done(new Error("version missing from response")); return; }
                    if (!response.description) { done(new Error("description missing from response")); return; }
                    done();
                }
            })
        })

        /** test signin using username and pass */
        it("signin", done => {
            // singin
            request.post(uri + "/signin", { json: { email: testAccount.email, pass: testAccount.password } }, (err, res, response) => {
                if (err) done(err);
                if (response) {
                    if (response.signedin) { done(); } else done(new Error("signedin true missing from response"));
                }
            })
        })

        /** TEST POSTING OF DEVICE DATA USING REST API */

        var packet = {
            id: "test_httppost",
            data: { random: generateDifficult(32) }
        }

        it("device HTTP POST", function (done) {
            this.timeout(timeout);
            request.post(uri + "/api/v3/data/post", { headers, json: packet }, (err, res, response) => {
                if (err) done(err);
                if (response) {
                    if (response.result == "success") {
                        done();
                    } else {
                        done(new Error("post failure"));
                    }

                }
            })
        })


        /** view device states */
        it("device HTTP VIEW", function (done) {
            this.timeout(timeout);
            request.post(uri + "/api/v3/view",
                { headers, json: { id: packet.id } }, (err, res, response) => {
                    if (err) done(err);
                    if (response) {
                        if (!response.id) { done(new Error("missing id from response")); return; }
                        if (!response.data) { done(new Error("missing data from response")); return; }
                        if (!response.timestamp) { done(new Error("missing timestamp from response")); return; }
                        if (!response.meta) { done(new Error("missing meta from response")); return; }
                        //if (response.meta.method != "POST") { done(new Error("meta.method should be POST")); return; }


                        if (response.data.random == packet.data.random) {
                            done();
                        } else {
                            done(new Error("Data mismatch!")); return;
                        }

                    }
                })
        })



        it("device HTTP PACKETS", function (done) {
            this.timeout(timeout); // crazy slow on prod.
            request.post(uri + "/api/v3/packets", { headers, json: { id: packet.id } }, (err, res, response) => {
                if (err) done(err);
                if (response) {
                    if (!Array.isArray(response)) { done(new Error("Expecting array response")); return; }
                    if (response[response.length - 1].data.random == packet.data.random) {
                        done();
                    }
                }
            })
        })



        /** please note that in v4 the response structure will change. payload is no longer used and will instead be merged with the higher level object. 
         * 
         * instead of using "payload.data.foo"
         * v4 will use "data.foo"
        */

        it("device HTTP STATE", function (done) {
            this.timeout(timeout); // crazy slow on prod.
            request.post(uri + "/api/v3/state", { headers, json: { id: packet.id } }, (err, res, response) => {
                if (err) done(err);
                if (response) {
                    if (response.payload.data.random == packet.data.random) { done(); } else {
                        done(new Error("Data is missing from device state response"))
                    }
                }
            })
        })



        it("device HTTP STATES", function (done) {
            this.timeout(timeout); // crazy slow on prod.
            request.get(uri + "/api/v3/states", { headers, json: true }, (err, res, response) => {
                if (err) done(err);
                if (response) {
                    if (!Array.isArray(response)) { done(new Error("Expected an array")) }
                    if (response[0].data.random == packet.data.random) { done(); } else { done(new Error("Response structure missing data")) }
                }
            })
        })




        it("device HTTP DELETE", function (done) {
            this.timeout(timeout); // crazy slow on prod.
            request.post(uri + "/api/v3/state/delete", { headers, json: { id: packet.id } }, (err, res, response) => {
                if (err) done(err);
                if (response) {
                    if (response.deletedCount == 1) {
                        done();
                    } else {
                        done(new Error(response.toString()))
                    }
                }
            })
        })
    })

    //////// MQTT START

    describe("PROTOTYPE V3 API MQTT", () => {

        it("MQTT can connect", done => {
            var client = mqtt.connect(mqtturi, { username: "api", password: "key-" + account.apikey });

            client.on('connect', () => {
                done();
            })

        })

        it("HTTP -> MQTT (APIKEY WIDE SUB)", function (done) {
            this.timeout(timeout); // crazy slow on prod.

            var packet = {
                id: "prottesthttpmqtt"+generateDifficult(8),  // make the test id more unique
                data: { random: generateDifficult(32) }
            }

            var client = mqtt.connect(mqtturi, { username: "api", password: "key-" + account.apikey });

            client.on('connect', () => {
                client.subscribe(account.apikey, { qos: 1 }, (err: Error) => {
                    if (err) { console.log(err) }

                    request.post(uri + "/api/v3/data/post", { headers, json: packet })

                })
            })

            client.on('message', (topic: string, message: Buffer) => {
                var parsed = JSON.parse(message.toString());
                if (parsed.data.random == packet.data.random) { 
                    // wait for close ACK then done().
                    client.end(false,()=>{
                        done(); 
                    }); 
                } else { 
                    // we might get more packets on this apikey, so removing this.
                    // done(new Error("MQTT Packet does not match posted over HTTP")) 
                }
                
            })

        })

        /** This tests if per device subscriptions work as expected. We test by subscribing to a device, then sending a dummypacket then the real packet.
         * We verify we only recieve the expected packet for the subscription.
         */
        it("HTTP -> MQTT (PER DEVICE SUB)", function (done) {
            this.timeout(timeout); // crazy slow on prod.

            var packet = {
                id: "prottesthttpmqtt"+generateDifficult(8), // more unique devid
                data: { random: generateDifficult(32) }
            }

            var dummypacket = {
                id: "shouldnotseethis",
                data: { random: generateDifficult(32) }
            }

            var client = mqtt.connect(mqtturi, { username: "api", password: "key-" + account.apikey });

            client.on('connect', () => {
                client.subscribe(account.apikey + "|" + packet.id, { qos: 1 }, (err: Error) => {
                    if (err) { console.log(err) }

                    request.post(uri + "/api/v3/data/post", { headers, json: dummypacket }, () => {
                        // once done we post the real one.
                        request.post(uri + "/api/v3/data/post", { headers, json: packet });
                    })

                })
            })

            client.on('message', (topic: string, message: Buffer) => {
                var parsed = JSON.parse(message.toString());
                if (parsed.data.random == packet.data.random) {
                    // wait for close ACK then done()
                    client.end(false,()=>{
                        done();                    
                    });
                } else { done(new Error("MQTT Packet does not match posted over HTTP")) }
            })

        })


        /** We test publishing on MQTT and using HTTP API to check if data was recieved correctly. */
        it("MQTT -> HTTP", done => {
            const packet = { id: "mqttdevicetest1", data: { a: Math.random() } };

            var client = mqtt.connect(mqtturi, { username: "api", password: "key-" + account.apikey });

            client.on('connect', function () {
                client.publish(account.apikey, JSON.stringify(packet), { qos: 1 }, () => {
                    request.post(uri + "/api/v3/view", { headers, json: { id: packet.id } }, (err, res, response) => {
                        if (err) done(err);
                        if (response) {
                            if (response.data.a = packet.data.a) { done() } else { done(new Error("faulty data packet")); }
                        }
                    });
                });
            })

        })



      
    })

}





  /*


TODO:::::

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