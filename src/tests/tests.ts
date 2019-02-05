// https://mochajs.org/#getting-started

import { describe, it } from "mocha";
import * as trex from "../utils";
import { configure, shallow } from 'enzyme';
import { expect } from 'chai';
import { signInFromWeb } from '../accounts'

var testAccount = {
  email: "",
  password: "newUser",
  apikey: "",
  server: "http://localhost",
  port: 8080,
  testDev: "testDeviceDEV"
}

import * as http from "http";

describe("API", function () {
  describe("REST API", function () {
    var testvalue: any;

    /************************************   Register   ****************************************/

    it("/api/v3/admin/register", function (done: any) {
      var randomNumberEmail = generateDifficult(32);
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
              testAccount.apikey = result.account.apikey;
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
          } else{
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

  describe("MQTT+SOCKETS+REST API", function () {

    /************************************   MQTT+SOCKETS+REST API   ****************************************/
    it("/api/v3/data/post + SOCKETS + MQTT", function (done: any) {

      var mqtt = require('mqtt');
      var client  = mqtt.connect('mqtt://localhost', {username:"api", password:"key-"+testAccount.apikey});

      var randomnumber = Math.round(Math.random()*10000)
      var socket = require("socket.io-client")("http://localhost:8080")

      var counter = 0;

      var mqttpacket: any;
      var socketpacket: any;
      var originalData: any;

      function checkSuccess() {
        if (counter == 2) {
          comparePackets();
        }
      }

      function comparePackets(){
        if(mqttpacket === socketpacket){
          if(mqttpacket === originalData){
            if(socketpacket === originalData){
              socket.disconnect();
              done();
            }else{
              done (new Error("Original Data sent and Socket packets recieved not the same!"))
            }  
          }else{
            done (new Error("Original Data sent and Mqtt packets recieved not the same!"))
          } 
        }else{
          done (new Error("Mqtt and Socket packets recieved not the same!"))
        } 
      }

      /*************************** Socket Connect *************************************/

      socket.on("connect", () => {
        socket.emit("join", testAccount.apikey ); 

        /*************************** MQTT Connect *************************************/

        client.on('connect', function () {
          var dataVar = { random : randomnumber, temp: {cold: Math.round(Math.random()*10000), hot: Math.round(Math.random()*10000)} };
          /*************************** Http POST *************************************/
          trex.restJSON(
            {
              apikey: testAccount.apikey,
              method: "POST",
              path: testAccount.server + "/api/v3/data/post",
              body: {id:testAccount.testDev, data:dataVar},
              port: testAccount.port
            },(err: Error, result: any) => {
              if (err) { done(err); }
            }
          );

          originalData =  JSON.stringify(dataVar);

          client.subscribe(testAccount.apikey, function (err: any) {
            if (err) { done(err) }
          })

          client.on('message', function (topic: any, message: any) {
            //console.log(message+"-------mqtt")
            var t = JSON.parse(message.toString());

            mqttpacket = JSON.stringify(t.data);
            //console.log(mqttpacket+"---------------mqtt1")
            counter++;
            checkSuccess()
          })
        })
      });

      socket.on("post", (data: any) => {
        //console.log(JSON.stringify(data)+"-------------------socket")
        socketpacket = JSON.stringify(data.data);
        counter++;
        checkSuccess()        
      });
      
    });

    /************************************   MQTT+SOCKETS+REST API   ****************************************/  
    it("MQTT + /api/v3/data/post + SOCKETS", function (done: any) {
      var mqtt = require('mqtt');
      var client  = mqtt.connect('mqtt://localhost', {username:"api", password:"key-"+testAccount.apikey});

      var socket = require("socket.io-client")("http://localhost:8080")

      var randomnumber = Math.round(Math.random()*10000)
      var dataVar = { random : randomnumber, temp: {cold: 1, hot: 0} };

      var counter = 0;

      var restpacket: any;
      var socketpacket: any;
      var originalData: any;

      function checkSuccess() {
        if (counter == 2) {
          comparePackets();
        }
      }

      function comparePackets(){
        if(restpacket === socketpacket){
          if(restpacket === originalData){
            if(socketpacket === originalData){
              socket.disconnect();
              done();
            }else{
              done (new Error("Original Data sent and Socket packets recieved not the same!"))
            }  
          }else{
            done (new Error("Original Data sent and Mqtt packets recieved not the same!"))
          } 
        }else{
          done (new Error("Mqtt and Socket packets recieved not the same!"))
        } 
      }

      socket.on("connect", () => {
        socket.emit("join", testAccount.apikey ); 
        
        /*************************** MQTT Connect *************************************/

        client.on('connect', function () {

          client.subscribe(testAccount.apikey, function (err: any) {
            if (err) { 
              console.log(err) 
            }else{
              client.publish(testAccount.apikey, JSON.stringify({id: testAccount.testDev, data: dataVar}) );
              originalData =  JSON.stringify(dataVar);
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
                  if(err){
                    console.log(err)
                  }else{
                    restpacket = JSON.stringify(result.data)
                   // console.log(restpacket+"-----------Rest1")
                    counter++;
                  } 
                }
              );
            }   
          })
        })
      });

      socket.on("post", (data: any) => {
        socketpacket = JSON.stringify(data.data);
        counter++;
        checkSuccess()       
      });
    });

    /************************************   MQTT+SOCKETS+REST API   ****************************************/  
    it("SOCKETS  +  MQTT + /api/v3/data/post", function (done: any) {
      var mqtt = require('mqtt');
      var client  = mqtt.connect('mqtt://localhost', {username:"api", password:"key-"+testAccount.apikey});

      var socket = require("socket.io-client")("http://localhost:8080")

      var randomnumber = Math.round(Math.random()*10000)
      var dataVar = { 
        random : randomnumber, 
        temp: {cold: 1, hot: 0} 
      };

      var counter = 0;

      var restpacket: any;
      var mqttpacket: any;
      var socketpacket: any;
      var originalData: any;

      socket.on("connect", () => {
        socket.emit("join", testAccount.apikey ); 
        
        /*************************** MQTT Connect *************************************/

        client.on('connect', function () {

          client.subscribe(testAccount.apikey, function (err: any) {
            if (err) { 
              console.log(err) 
            }else{
              //client.publish(testAccount.apikey, JSON.stringify({id: testAccount.testDev, data: dataVar}));
              
            }   
          })

          socket.emit("post", {id: testAccount.testDev, data: dataVar })
          originalData = JSON.stringify(dataVar);
          //console.log(originalData+"---------------------original data sent")

          
        })

        client.on('message', function (topic: any, message: any){
          var t = JSON.parse(message.toString());
          mqttpacket = JSON.stringify(t.data);
          //console.log(message+"--------------------------mqtt")
          checkSuccess()
        })

      });

      socket.on("post", (data: any) => {
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
            if(err){
              console.log(err)
            }else{
              restpacket = JSON.stringify(result.data)
              //console.log(JSON.stringify(result)+"----------------------------rest")
              counter++;
              checkSuccess();
            } 
          }
        ); 
        socketpacket = JSON.stringify(data.data);
        //console.log(socketpacket+"--------------------------socket")
        counter++;
        checkSuccess()     
      });

      function checkSuccess() {
        if (counter >= 2) {
          comparePackets();
        }
      }

      function comparePackets(){
        if(restpacket === socketpacket){
          if(restpacket === originalData){
            if(socketpacket === originalData){
              if(mqttpacket === originalData){
                socket.disconnect();
                done();
              }else{
                done (new Error("Original Data sent and MQTT packets recieved not the same!"))
              }
            }else{
              done (new Error("Original Data sent and Socket packets recieved not the same!"))
            }  
          }else{
            done (new Error("Original Data sent and Rest packets recieved not the same!"))
          }
        }else{
           done (new Error("Rest and Socket packets recieved not the same!"))
         } 
      }
    });
  });

});

describe("UI Test", function(){
  it('Contains Login Button', function(done: any){
    done();
  });
});

function generateDifficult(count: number){
  var _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  var str = '';
  for (var i = 0; i < count; i++){
    var tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
    str += "" + tmp;
  }
  return str;
}