// https://mochajs.org/#getting-started

import { describe, it } from "mocha";
import * as trex from "../utils";

import { MqttProto } from "./mqttproto"
import { SocketProto } from "./socketproto"

var testAccount = {
  email: "",
  password: "newUser",
  apikey: "",
  server: "http://localhost",
  port: 8080,
  testDev: "testDeviceDEV"
}
var mqttconnection: any;
var socketconnection: any;

// var socket = require("socket.io-client")("http://localhost:8080");

import * as http from "http";

describe("API", function () {
  describe("REST API", function () {
    var testvalue: any;

    /************************************   Register   ****************************************/

    it("/api/v3/admin/register", function (done: any) {
      var randomNumberEmail = Math.floor(Math.random() * (1000) + 1);
      const Account: any = { email: "test" + randomNumberEmail + "@iotlocalhost.com", password: testAccount.password };

      trex.restJSON(
        {
          path: "http://localhost:8080/api/v3/admin/register",
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
            if (result.error) 
            { 
              done(new Error(result.error)); 
            }
            //if (result.data.someval == testvalue) { done(); }
            else {
              testAccount.email = result.account.email;
              testAccount.apikey = result.account.apikey
              mqttconnection = new MqttProto(result.account.apikey);
              socketconnection = new SocketProto(testAccount.apikey);
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

    /************************************   MQTT   ****************************************/
    it("/MQTT  connection/", (done) => {
      testvalue = 0;
      var timeout = setTimeout(() => {
        done("error timeout")
      }, 3000)

      var mqttconnection = new MqttProto(testAccount.apikey)

      mqttconnection.on("connect", () => {
        var test = mqttconnection.postData();

        if(test){
          clearTimeout(timeout)
          done()
        }else{
          done(new Error("Could Not post to device.")) 
        } 
      })
    })

    /************************************   SocketIo   ****************************************/

    // it("Socket connection", (done) => {

    //   var timeout = setTimeout(() => {
    //     done("error timeout")
    //   }, 2000)

    //   socketconnection = new SocketProto(testAccount.apikey);
    //   socketconnection.on("connect", () => {
    //     console.log("successfully connected to socket prototype")
    //     clearTimeout(timeout)
    //     done()
    //   })
    // })

    /************************************   Post   ****************************************/
    it("/api/v3/data/post", function (done: any) {
      testvalue = "DEV" + Math.round(Math.random() * 1000);
      var testDevice: any = {
        id: testAccount.testDev,
        data: { someval: testvalue }
      };

      
      trex.restJSON(
        {
          apikey: testAccount.apikey,
          method: "POST",
          path: testAccount.server + "/api/v3/data/post",
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
                }, 3000)
                done(result);
              }
            }
          }
        }
      );
    });

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
});
