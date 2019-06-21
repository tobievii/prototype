import { describe, it } from "mocha";
import { Prototype } from "../utils/api"
import { promises } from "fs";

const Cryptr = require('cryptr');
const cryptr = new Cryptr('prototype');


/*

  prototype test suite

  env server=https://prototype.dev.iotnxt.io port=443 https=true npm run test

*/

// https://mochajs.org/#getting-started


//var prototype = new Prototype({ uri: "https://prototype.dev.iotnxt.io" });
//var prototype = new Prototype({ uri: "https://prototype.iotnxt.io" });

var testAccount = {
    email: "test" + generateDifficult(32) + "@iotlocalhost.com",
    password: cryptr.encrypt("newUser"),
    apikey: ""
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
    var prototype = new Prototype();

    it("register", done => {
        //this.timeout(5000);
        prototype.register(testAccount.email, testAccount.password, (err:Error, result:any)=>{
                if (err) done(err);
                if (result) { 
                    if (result.error) done(new Error(result.error))
                    if (result.account.apikey) { 
                        testAccount.apikey = result.account.apikey;
                        done(); }
                }
        })
    })
    //////
    it("account", done => {
        prototype.account( (err:Error,account:any)=>{
            if (err) done(err);
            if (account) { 
                if (!account.uuid) { done(new Error("uuid missing")); return;}
                if (!account.apikey) { done(new Error("apikey missing")); return;}
                if (testAccount.apikey != account.apikey) { done(new Error("apikey mismatch")); return;}
                done();
            }
        })
    })

    // checks server version
    it("version", done => {
        prototype.version( (err:Error,version:any)=>{
            if (err) done(err);
            if (version) {
                done();
            }
        })
    })

    
    // attempt signin using email/pass
    it("signin", done => {
        // fresh instance
        new Prototype().signin(testAccount.email,testAccount.password, (err:Error, result:any)=>{
            if (err) done(err);
            if (result) { 
                if(result.signedin == true) done();
            }
        })
    })    

    // attempt to get account info with only apikey
    it("account", done => {
        if (testAccount.apikey == "") { done("no apikey yet!"); } 
        // fresh instance
        new Prototype({apikey: testAccount.apikey}).account( (err:Error,account:any)=>{
            if (err) done(err);
            if (account) { 
                if (!account.uuid) { done(new Error("uuid missing")); return;}
                if (!account.apikey) { done(new Error("apikey missing")); return;}
                if (testAccount.apikey != account.apikey) { done(new Error("apikey mismatch")); return;}
                done();
            }
        })
    })

    ////// DEVICE

    var packet = {
        id : "test_httppost",
        data: { random: generateDifficult(32) }
    }

    it("device HTTP POST", done => {
        if (testAccount.apikey == "") { done("no apikey yet!"); } 
        
        new Prototype({apikey: testAccount.apikey}).post(packet, (err:Error,response:any)=>{
            if (err) done(err);
            if (response) { 
                if (response.result != "success") { done(new Error(response)); return;}
                done();
            }
        })
    })

    it("device HTTP VIEW", done => {
        if (testAccount.apikey == "") { done("no apikey yet!"); } 
        
        new Prototype({apikey: testAccount.apikey}).view(packet.id, (err:Error,response:any)=>{
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

    it("device HTTP PACKETS", done  => {
        new Prototype({apikey: testAccount.apikey}).packets(packet.id, (err:Error,response:any)=>{
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
        new Prototype({apikey: testAccount.apikey}).state(packet.id, (err:Error,response:any)=>{
            if (err) done(err);
            if (response) {  
                if (!response.key) { done(new Error("key missing from state")); return;}
                if (!response.apikey) { done(new Error("apikey missing")); return;}
                if (!response.devid) { done(new Error("devid missing")); return;}
                if (!response.payload) { done(new Error("payload missing")); return;}
                if (packet.data.random != response.payload.data.random) { done(new Error("date mismatch")); return;}
                done();          
            }
        })
    })

    it("device HTTP STATES", done => {
        new Prototype({apikey: testAccount.apikey}).states( (err:Error,response:any)=>{
            if (err) done(err);
            if (response) {  
                if (response[0].id != packet.id) { done(new Error("id mismatch")); return;}
                if (response[0].data.random != packet.data.random) { done(new Error("data mismatch")); return;}
                done();          
            }
        })
    })

    it("device HTTP DELETE", done => {
        new Prototype({apikey: testAccount.apikey}).delete(packet.id, (err:Error,response:any)=>{
            if (err) done(err);
            if (response) {  
                done();          
            }
        })
    })

    /* 
        Tests sending data over http post and recieving it on socket         */
    
    it("HTTP -> SOCKET", done => {
        var id = "protTestHttpSocket"
        var test = Math.random()
        // SOCKET
        var protSocket = new Prototype({apikey: testAccount.apikey, protocol: "socketio", id});
        protSocket.on("connect", ()=>{
            // HTTP POST
            new Prototype({apikey: testAccount.apikey}).post({id, data:{test}}, (e:Error,r:any)=>{})
        })
        protSocket.on("data", (data:any)=>{
            if (data.id != id) { done(new Error("id missing from socket packet")); return;}
            if (!data.data) { done(new Error("data missing from socket packet"));return;}
            if (data.data.test != test) { done(new Error("data mismatch from socket packet"));return;}
            done();
            protSocket.disconnect();
        })
    })

    /* 
        Tests sending data over http post and recieving it on mqtt         */

    it("HTTP -> MQTT", done => {
        var id = "protTestHttpMqtt"
        var test = Math.random()
        // MQTT
        var protMqtt = new Prototype({apikey: testAccount.apikey, protocol: "mqtt", id});
        protMqtt.on("connect", ()=>{
            // HTTP POST
            new Prototype({apikey: testAccount.apikey}).post({id, data:{test}}, (e:Error,r:any)=>{})
        })
        protMqtt.on("data", (data:any)=>{
            if (data.id != id) { done(new Error("id missing from socket packet")); return;}
            if (!data.data) { done(new Error("data missing from socket packet"));return;}
            if (data.data.test != test) { done(new Error("data mismatch from socket packet"));return;}
            done();
            protMqtt.disconnect();
        })
    })

    /* MQTT to SOCKET */
    it("MQTT -> SOCKET", done => {
        var id = "protTestMqttSocket"
        var test = Math.random()

        // SOCKET LISTEN
        var protSocket = new Prototype({
            apikey: testAccount.apikey, 
            protocol: "socketio", 
            id}).on("data", data => {
                if (data.id != id) { done(new Error("id missing from socket packet")); return;}
                if (!data.data) { done(new Error("data missing from socket packet"));return;}
                if (data.data.test != test) { done(new Error("data mismatch from socket packet"));return;}
                done();
                protSocket.disconnect();
        });

        // MQTT POST
        var protMqtt = new Prototype({
            apikey: testAccount.apikey, 
            protocol: "mqtt", 
            id}).post({id, data:{test}})
    })

    /* MQTT to HTTP */
    it("MQTT -> HTTP", done => {
        var id = "protTestMqtt"
        var test = Math.random()

        var protMqtt = new Prototype({
            apikey: testAccount.apikey, 
            protocol: "mqtt"})
                    
        protMqtt.post({id, data:{test}}, (e:Error, result:any)=>{

            new Prototype({apikey:testAccount.apikey}).view(id, (e:Error, data:any)=>{
                if (data.id != id) { done(new Error("id missing from packet")); return;}
                if (!data.data) { done(new Error("data missing from packet"));return;}
                if (data.data.test != test) { done(new Error("data mismatch from packet"));return;}
                done();
            })

            protMqtt.disconnect();
        })
        
    })

})



function generateDifficult(count: number) {
    var _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    var str = '';
    for (var i = 0; i < count; i++) {
      var tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
      str += "" + tmp;
    }
    return str;
  }
  



  