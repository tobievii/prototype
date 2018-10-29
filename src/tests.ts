// https://mochajs.org/#getting-started

import { describe, it } from "mocha";
import * as trex from "./utils";


var testAcccount = { email: "admin@localhost.com", password: "admin", apikey: "xxxxxxxxxxx" };
var testServer = "http://localhost";

import * as http from "http";

describe("API", function() {
  describe("REST API", function() {
    var testvalue: any;
    /*********************************************************/
    it("/api/v3/version", function(done: any) {
      const options = {
        hostname: "localhost",
        port: 80,
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
    /*********************************************************/
    it("/api/v3/data/post", function(done: any) {
      testvalue = "DEV" + Math.round(Math.random() * 1000);
      var testDevice: any = {
        id: "testDeviceDEV",
        data: { someval: testvalue }
      };

      trex.restJSON(
        {
          apikey: testAcccount.apikey,
          method: "POST",
          path: testServer + "/api/v3/data/post",
          body: testDevice
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
                done();  
              } else {
                done(result);
              }
              
            }
            
          }
        }
      );
    });
    /*********************************************************/
    it("/api/v3/view", function(done: any) {
      var testDevice: any = { id: "testDeviceDEV" };
      trex.restJSON(
        {
          apikey: testAcccount.apikey,
          method: "POST",
          path: testServer + "/api/v3/view",
          body: testDevice
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
    /*********************************************************/
    it("/api/v3/packets", function(done: any) {
      var testDevice: any = { id: "testDeviceDEV" };
      trex.restJSON(
        {
          apikey: testAcccount.apikey,
          method: "POST",
          path: testServer + "/api/v3/packets",
          body: testDevice
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
    /*********************************************************/
    it("/api/v3/state", function(done: any) {
      const postData = JSON.stringify({ id: "testDeviceDEV" });
      const options = {
        hostname: "localhost",
        port: 80,
        path: "/api/v3/state",
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from("api:key-"+testAcccount.apikey).toString("base64"),
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
    /*********************************************************/
    it("/api/v3/states", function(done: any) {
      const postData = JSON.stringify({ id: "testDeviceDEV" });
      const options = {
        hostname: "localhost",
        port: 80,
        path: "/api/v3/states",
        method: "GET",
        headers: {
          Authorization:
            "Basic " + Buffer.from("api:key-"+testAcccount.apikey).toString("base64"),
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
    /*********************************************************/
   
  });

  /*######################################################################*/
});
