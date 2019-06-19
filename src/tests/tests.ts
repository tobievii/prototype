// https://mochajs.org/#getting-started
var mqtt = require('mqtt');
import { log } from "../utils"
import { describe, it } from "mocha";
import * as trex from "../utils";
const Cryptr = require('cryptr');
const cryptr = new Cryptr('prototype');
var testAccount = {
  email: "",
  password: cryptr.encrypt("newUser"),
  apikey: "",
  server: "http://localhost",
  port: 8080,
  testDev: "testDeviceDEV"
}

import * as http from "http";

import { teltonikaTestMocha } from "./teltonika_simulate"
import { checkApiKey } from "../accounts";

// Disabled for now until we can get a repeatable method
// teltonikaTestMocha();

describe("API", function () {
  describe("REST API", function () {
    var testvalue: any;

    /************************************   Register   ****************************************/

    it("/api/v3/admin/register", function (done: any) {
      var randomNumberEmail = generateDifficult(32);
      var emaillocal = "test" + randomNumberEmail + "@iotlocalhost.com";
      const Account: any = { email: emaillocal.toLowerCase(), pass: testAccount.password };

      trex.restJSON(
        {
          path: testAccount.server + "/api/v3/admin/register",
          method: "POST",
          body: Account,
          port: testAccount.port,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        },
        (err: Error, result: any, account: any) => {
          if (err) {
            done(err);
          }
          if (result) {
            if (result.error) {
              done(new Error(result.error));
            }
            else {
              testAccount.email = result.account.email;
              testAccount.apikey = result.account.apikey;
              done();
            }
          }
        }
      );
    });

    /************************************   Account   ****************************************/

    it("/api/v3/account", function (done: any) {

      const options = {
        hostname: "localhost",
        port: testAccount.port,
        path: "/api/v3/account",
        method: "GET",
        headers: {
          Authorization:
            "Basic " + Buffer.from("api:key-" + testAccount.apikey).toString("base64"),
          "Content-Type": "application/json"
        }
      };
      // CREATE REQUEST OBJECT
      const req = http.request(options, res => {
        var response = "";
        res.setEncoding("utf8");
        res.on("data", chunk => {
          response += chunk;
        });
        res.on("end", () => {
          var result = JSON.parse(response);

          if (result.error) {
            done(new Error(result.error));
          } else if (result.apikey == testAccount.apikey) {
            done();
          }
        });
      });

      req.on("error", e => {
        console.error(`problem with request: ${e.message}`);
      });
      req.end();
    });

    /************************************   Recover Password   ****************************************/
    // COMMENT: ROUAN : this breaks on systems without SMTP email settings set.

    // it("/api/v3/ForgetPassword", function (done: any) {
    //   const Account: any = { email: testAccount.email };

    //   this.timeout(4000)

    //   trex.restJSON(
    //     {
    //       path: testAccount.server + ":" + testAccount.port + "/api/v3/ForgetPassword",
    //       method: "POST",
    //       body: Account,
    //       headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //       }
    //     },
    //     (error: Error, result: any) => {
    //       console.log(result)
    //       if (error != null) {
    //         done(error);
    //       }
    //       if (result) {
    //         //done();
    //         trex.restJSON(
    //           {
    //             path: testAccount.server + "/api/v3/admin/recoverEmailLink",
    //             method: "POST",
    //             body: Account,
    //             port: testAccount.port,
    //             headers: {
    //               "Accept": "application/json",
    //               "Content-Type": "application/json"
    //             }
    //           },
    //           (err: Error, result: any) => {
    //             var infor = result.result.info;
    //             if (err) {
    //               done(err);
    //             } else if (infor.rejected.length < 1) {
    //               for (var email in infor.accepted) {
    //                 if (testAccount.email == infor.accepted[email]) {
    //                   done();
    //                 } else {
    //                   done(new Error("Did not fine your email in the accepted emails list."));
    //                 }
    //               }
    //             } else {
    //               done(new Error("The email was rejected."));
    //             }
    //           }
    //         );
    //       }
    //     }
    //   );
    // });

    /************************************   Sign In   ****************************************/

    it("/signIn", function (done: any) {
      const Account: any = { email: testAccount.email, pass: testAccount.password };

      trex.restJSON(
        {
          path: testAccount.server + ":" + testAccount.port + "/signIn",
          method: "POST",
          body: Account,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        },
        (err: Error, result: any, account: any) => {
          if (err) {
            done(err);
          }
          if (result) {
            if (result.error) {
              done(new Error(result.error));
            }
            else if (result.signedin == true) {
              done();
            }
          }
        }
      );
    });

    /************************************   Version   ****************************************/

    it("/api/v3/version", function (done: any) {
      const options = {
        hostname: "localhost",
        port: testAccount.port,
        path: "/api/v3/version",
        method: "GET",
        headers: {
          Authorization:
            "Basic " + Buffer.from("api:key-test").toString("base64"),
          "Content-Type": "application/json"
        }
      };
      // CREATE REQUEST OBJECT
      const req = http.request(options, res => {
        var response = "";
        res.setEncoding("utf8");
        res.on("data", chunk => {
          response += chunk;
        });
        res.on("end", () => {
          if (JSON.parse(response).version) {
            done();
          }
        });
      });

      req.on("error", e => {
        console.error(`problem with request: ${e.message}`);
      });
      req.end();
    });

    /************************************   Post   ****************************************/
    it("/api/v3/data/post", function (done: any) {
      testvalue = "DEV" + Math.round(Math.random() * 1000);
      var testDevice: any = {
        id: testAccount.testDev,
        data: { someval: testvalue, gps: { lat: 25.566, lon: -25.39955 } }
      };


      trex.restJSON(
        {
          apikey: testAccount.apikey,
          method: "POST",
          path: testAccount.server + ":" + testAccount.port + "/api/v3/data/post",
          body: testDevice,
          port: testAccount.port
        },
        (err: Error, result: any) => {
          if (err) {
            done(err);
          }
          if (result) {
            if (result.error) {
              done(new Error(result.error))
            } else {
              if (result.result == "success") {
                // mqttconnection.on("connect", () => {
                //   mqttconnection.postData();
                //   clearTimeout(timeout)
                done()
                // })
              } else {
                var timeout = setTimeout(() => {
                  done("error timeout")
                }, 6000)
                done(result);
              }
            }
          }
        }
      );
    });

    /************************************   Geo Location   ****************************************/
    // cant test with localhost..
    // it("/api/v3/getlocation", function (done: any) {
    //   console.log("-----")
    //   trex.restJSON(
    //     {
    //       apikey: testAccount.apikey,
    //       path: testAccount.server + ":" + testAccount.port + "/api/v3/getlocation",
    //       method: "GET",
    //       headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //       }
    //     },(err: Error, result: any) => {
    //       console.log(err)
    //       console.log(result)


    //     }
    //   );
    // });

    /************************************   VIEW   ****************************************/

    it("/api/v3/view", function (done: any) {
      var testDevice: any = { id: testAccount.testDev };
      trex.restJSON(
        {
          apikey: testAccount.apikey,
          method: "POST",
          path: testAccount.server + "/api/v3/view",
          body: testDevice,
          port: testAccount.port
        },
        (err: Error, result: any) => {
          if (err) {
            done(err);
          }
          if (result) {

            if (result.error) { done(new Error(result.error)); }

            if (result.data.someval == testvalue) {

              done();
            }
          }
        }
      );
    });

    /************************************   Packets   ****************************************/

    it("/api/v3/packets", function (done: any) {
      var testDevice: any = { id: testAccount.testDev };
      trex.restJSON(
        {
          apikey: testAccount.apikey,
          method: "POST",
          path: testAccount.server + "/api/v3/packets",
          body: testDevice,
          port: testAccount.port
        },
        (err: Error, result: any) => {
          if (err) {
            done(err);
          }
          if (result) {
            if (result.error) { done(new Error(result.error)); }
            //if (result.data.someval == testvalue) { done(); }
            if (result[result.length - 1].data.someval == testvalue) {

              done();
            }
          }
        }
      );
    });

    /************************************   STATE   ****************************************/

    it("/api/v3/state", function (done: any) {
      const postData = JSON.stringify({ id: testAccount.testDev });
      const options = {
        hostname: "localhost",
        port: testAccount.port,
        path: "/api/v3/state",
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from("api:key-" + testAccount.apikey).toString("base64"),
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      };
      // CREATE REQUEST OBJECT
      const req = http.request(options, res => {
        var response = "";
        res.setEncoding("utf8");
        res.on("data", chunk => {
          response += chunk;
        });
        res.on("end", () => {
          //if (JSON.parse(response).version) { done(); }
          var result = JSON.parse(response);
          if (result.error) { done(new Error(result.error)); }


          if (JSON.parse(response).payload.data.someval == testvalue) {
            done();
          }
        });
      });

      req.on("error", e => {
        console.error(`problem with request: ${e.message}`);
      });
      req.write(postData);
      req.end();
    });

    /************************************   States   ****************************************/

    it("/api/v3/states", function (done: any) {
      const postData = JSON.stringify({ id: testAccount.testDev });
      const options = {
        hostname: "localhost",
        port: testAccount.port,
        path: "/api/v3/states",
        method: "GET",
        headers: {
          Authorization:
            "Basic " + Buffer.from("api:key-" + testAccount.apikey).toString("base64"),
          "Content-Type": "application/json"
        }
      };
      // CREATE REQUEST OBJECT
      const req = http.request(options, res => {
        var response = "";
        res.setEncoding("utf8");
        res.on("data", chunk => {
          response += chunk;
        });
        res.on("end", () => {
          var result = JSON.parse(response);

          if (result.error) { done(new Error(result.error)); }

          for (var d in result) {
            if (result[d].id == "testDeviceDEV") {
              if (result[d].data.someval == testvalue) {

                done();
              }
            }
          }
        });
      });

      req.on("error", e => {
        console.error(`problem with request: ${e.message}`);
      });
      req.end();
    });

    /************************************   Delete   ****************************************/

    it("/api/v3/state/delete", function (done: any) {
      const postData = JSON.stringify({ id: testAccount.testDev });

      const options = {
        hostname: "localhost",
        port: testAccount.port,
        path: "/api/v3/state/delete",
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from("api:key-" + testAccount.apikey).toString("base64"),
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      };
      // CREATE REQUEST OBJECT
      const req = http.request(options, res => {
        var response = "";
        res.setEncoding("utf8");
        res.on("data", chunk => {
          response += chunk;
        });
        res.on("end", () => {
          var result = JSON.parse(response);

          if (result.error) {
            done(new Error(result.error));
          } else {
            done();
          }
        });
      });

      req.on("error", e => {
        console.error(`problem with request: ${e.message}`);
      });
      req.write(postData);
      req.end();
    });
  });

  /*
    The following tests are for testing protocol and device communication.
  */
  describe("DEVICE PROTOCOL TESTS", function () {

    /*
      Test sending a device packet over HTTP and recieving it on sockets and mqtt.
    */
    it("HTTP -> SOCKET & MQTT", function (done: any) {
      this.timeout(1000)

      var test = {
        socket: false,
        mqtt: false
      }

      var connected = {
        socket: false,
        mqtt: false
      }

      var testDevice = { id: "HTTPTESTDEV", data: { random: Math.round(Math.random() * 10000), asdf: "453" } }

      var socket = require("socket.io-client")(testAccount.server + ":" + testAccount.port, { transports: ['websocket'] })
      socket.on("connect", () => {
        socket.emit("join", testAccount.apikey);

        connected.socket = true;
        ready();

        socket.on("post", (data: any) => {
          if (JSON.stringify(data.data) != JSON.stringify(testDevice.data)) {
            done(new Error("Recieved SOCKET packet does not match."))
          } else {
            test.socket = true;
            check();
          }
          socket.disconnect();
        })
      });



      var client = mqtt.connect('mqtt://localhost', { username: "api", password: "key-" + testAccount.apikey });
      client.on('connect', () => {
        client.subscribe(testAccount.apikey, function (err: any) {
          if (err) { done(err) }
          connected.mqtt = true;
          ready();
        })
        client.on('message', function (topic: any, message: any) {
          var mqttpacket = JSON.parse(message.toString());

          if (JSON.stringify(mqttpacket.data) != JSON.stringify(testDevice.data)) {
            done(new Error("Packet recieved on MQTT is different from the one sent!"))
          } else {
            test.mqtt = true;
            check();
          };
          client.end();

        });
      });

      function check() {
        if (test.mqtt && test.socket) {
          test = { mqtt: false, socket: false }; // force only once
          done();
        }
      }


      function ready() {
        if (connected.mqtt && connected.socket) { httpSend(); }
      }

      function httpSend() {
        trex.restJSON(
          {
            apikey: testAccount.apikey,
            method: "POST",
            path: testAccount.server + "/api/v3/data/post",
            body: testDevice,
            port: testAccount.port
          }, (err: Error, result: any) => {
            if (err) { done(err); }
          }
        );
      }

    });

    /*
      This test sends data on MQTT and recieves it on sockets and HTTP api
    */
    it("MQTT -> HTTP & SOCKET", function (done: any) {
      this.timeout(2000)

      var test = {
        socket: false,
        http: false,
      }

      var testDevice = { id: "MQTTTESTDEV", data: { random: Math.round(Math.random() * 10000), asdf: "123" } }

      var socket = require("socket.io-client")(testAccount.server + ":" + testAccount.port, { transports: ['websocket'] })
      socket.on("connect", () => {
        socket.emit("join", testAccount.apikey);

        socket.on("post", (data: any) => {
          if (JSON.stringify(data.data) != JSON.stringify(testDevice.data)) {
            done(new Error("Recieved SOCKET packet does not match."))
          } else {
            test.socket = true;
            checkHTTP();
          }
          socket.disconnect();
        })

        //start test
        mqttsend();
      });

      // HTTP TEST
      function checkHTTP() {
        trex.restJSON(
          {
            apikey: testAccount.apikey,
            method: "POST",
            path: testAccount.server + "/api/v3/view",
            body: { id: "MQTTTESTDEV" },
            port: testAccount.port
          },
          (err: Error, result: any) => {
            if (err) done(err);

            if (JSON.stringify(result.data) != JSON.stringify(testDevice.data)) {
              done(new Error("Recieved SOCKET packet does not match."))
            } else {
              test.http = true;
              check();
            }
          }
        );
      }

      function check() { if (test.http && test.socket) { done(); } }

      var client = mqtt.connect('mqtt://localhost', { username: "api", password: "key-" + testAccount.apikey });

      function mqttsend() {
        client.publish(testAccount.apikey, JSON.stringify(testDevice), () => {
          client.end();
        });
      }
    });


    /* Test sending packet on socket and recieving on mqtt and http. */
    it("SOCKET ->  MQTT & HTTP", function (done: any) {
      this.timeout(2000)

      var testDevice = { id: "SOCKETTESTDEV", data: { random: Math.round(Math.random() * 10000), asdf: "zxcfd" } }

      var test = {
        mqtt: false,
        http: false
      }

      var client = mqtt.connect('mqtt://localhost', { username: "api", password: "key-" + testAccount.apikey });

      client.on('connect', () => {
        client.subscribe(testAccount.apikey, function (err: any) { if (err) done(err); });

        client.on('message', function (topic: any, message: any) {

          var mqttpacket = JSON.parse(message.toString());
          if (JSON.stringify(mqttpacket.data) != JSON.stringify(testDevice.data)) {
            done(new Error("Packet recieved on MQTT is different from the one sent!"))
          } else {
            test.mqtt = true;
            check();
            httptest();
          };
          client.end();

        });
      });

      var socket = require("socket.io-client")(testAccount.server + ":" + testAccount.port, { transports: ['websocket'] })

      socket.on("connect", () => {
        socket.emit("join", testAccount.apikey);
        //echo
        //socket.on("post", (data: any) => { });
      })

      setTimeout(() => {
        socket.emit("post", testDevice)
      }, 200)



      function check() {
        if (test.http && test.mqtt) {
          test = { http: false, mqtt: false }
          done();
        }
      }


      function httptest() {
        trex.restJSON(
          {
            apikey: testAccount.apikey,
            method: "POST",
            path: testAccount.server + "/api/v3/view",
            body: { id: "SOCKETTESTDEV" },
            port: testAccount.port
          },
          (err: Error, result: any) => {
            if (err) done(err);

            if (JSON.stringify(result.data) == JSON.stringify(testDevice.data)) {
              test.http = true;
              check();
            } else {
              done(new Error("HTTP packet does not match!"))
            }
          }
        );
      }

    });
  });

});


function generateDifficult(count: number) {
  var _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  var str = '';
  for (var i = 0; i < count; i++) {
    var tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
    str += "" + tmp;
  }
  return str;
}
