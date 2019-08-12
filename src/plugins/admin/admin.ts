import { generate } from "../../utils"
import * as fs from 'fs';

var nodemailer = require("nodemailer")
var randomString = require('random-string');
var mongojs = require('mongojs')
var ObjectId = mongojs.ObjectId;
var io = require('socket.io')(server);
var server;
import * as accounts from "../../accounts"
import * as events from "events";
import * as _ from "lodash";
var scrypt = require("scrypt");
import { Plugin } from "../plugin"
import express = require('express');
import { log } from "../../log"

export class PluginAdmin extends Plugin {
  db: any;
  name = "admin";
  eventHub: any;

  constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
    super(app, db, eventHub);
    this.db = db;
    this.eventHub = eventHub;

    log("PLUGIN", this.name, "LOADED");

    app.get("/verify/:id", (req: any, res: any) => {
      db.users.findOne({ "_id": ObjectId(req.params.id) }, (err: Error, user: any) => {
        if (err) { log(err); return; }
        if (user == null) {
          res.json({ err: "user not found" })
          return;
        }

        if (user) {
          log("found")

          user.emailverified = true;
          db.users.update({ "_id": ObjectId(req.params.id) }, user, (err: Error, result2: any) => {
            if (err) { log(err); return; }
            if (result2) {
              log("result2:"); log(result2);
              res.redirect("/")
            }
          })
        }
      })
    })

    //####################################################################
    //Email Verification link
    app.get("/api/v3/admin/requestverificationemail", (req: any, res: any) => {

      var verifyLink = req.headers.referer + "verify/" + req.user._id

      try {
        this.getRegistration((err: Error, result: any) => {

          var smtpTransport = nodemailer.createTransport({
            host: result.nodeMailerTransportHost,
            port: result.nodeMailerTransportPort,
            auth: {
              user: result.nodeMailerTransportAuthUser,
              pass: result.nodeMailerTransportAuthPass
            }
          });

          var mail = {
            from: result.nodeMailerTransportFrom,
            to: req.user.email,
            subject: 'Account Verification',
            text: 'To verify your account please go to ' + verifyLink,
            html: '<p>To verify your account please go to <a href="' + verifyLink + '">' + verifyLink + '</a></p>'
          }

          smtpTransport.sendMail(mail, (err: any, info: any) => {
            if (err) { log(err); return; }
            if (info) {
              log(info);
              res.json({ err: {}, result: { mail: "sent" } })
            }
          })
        })
      } catch (err) {
        res.json({ err })
      }

      //Email Verification link
      //####################################################################

    })

    //Reset password after link
    app.post("/api/v3/admin/changepassword", (req: any, res: any) => {
      var today = new Date();
      today.setHours(today.getHours() + 2);
      var scryptParameters = scrypt.paramsSync(0.1);
      var kdfResult = scrypt.kdfSync(req.body.pass, scryptParameters);
      db.users.update({ 'recover.recoverToken': req.body.person }, { $set: { "password": kdfResult } }, (err: Error, response: any) => {
        if (response) {
          if (response.nModified == 0) {
            res.json(response)
          } else {
            var changeToken = randomString({ length: 128 });
            db.users.update({ 'recover.recoverToken': req.body.person }, { $set: { recover: { "recoverToken": changeToken, "recoverTime": today } } })
            res.json(response)
          }
        } else if (err) {
          res.json(err)
        }
      })

    })

    app.post("/api/v3/admin/expire", (req: any, res: any) => {

      if (req.body.button) {
        var expire = setTimeout(() => {
          var today = new Date();
          today.setHours(today.getHours() + 2);
          var changeTokens = randomString({ length: 128 });
          db.users.update({ 'email': req.body.person }, { $set: { recover: { "recoverToken": changeTokens, "recoverTime": today } } })
        }, 600000);
      }
    })

    //Reset password after link

    //Changing password while logged in
    app.post("/api/v3/admin/userpassword", (req: any, res: any) => {
      var scryptParameters = scrypt.paramsSync(0.1);
      var uuid = generate(128)
      db.users.findOne({ username: req.body.user }, (err: Error, found: any) => {

        scrypt.verifyKdf(found.password.buffer, req.body.current, function (err: Error, result: any) {
          if (result == true) {
            var newpass = scrypt.kdfSync(req.body.pass, scryptParameters);
            db.users.update({ $and: [{ username: req.body.user }] }, { $set: { "password": newpass, uuid: uuid } }, (err: Error, response: any) => {
              if (response) {
                if (response.nModified == 0) {
                  res.json(response)
                } else {
                  res.json(response)
                }
              } else if (err) {
                res.json(err)
              }
            })
          }
          else if (result == false) {
            res.json(result)
          }
        });
      })
    })
    //Changing password while logged in

    //####################################################################
    //Recover Password Link sent via email
    app.post("/api/v3/admin/recoverEmailLink", (req: any, res: any) => {
      var today = new Date();
      today.setHours(today.getHours() + 2);
      var recoverToken = randomString({ length: 128 });
      db.users.update({ email: req.body.email }, { $set: { recover: { "recoverToken": recoverToken, "recoverTime": today } } })
      try {
        this.getRegistration((err: Error, result: any) => {
          var verifyLink = req.headers.referer + "recover/" + recoverToken
          var smtpTransport = nodemailer.createTransport({
            host: result.nodeMailerTransportHost,
            port: result.nodeMailerTransportPort,
            auth: {
              user: result.nodeMailerTransportAuthUser,
              pass: result.nodeMailerTransportAuthPass
            }
          });

          var mail = {
            from: result.nodeMailerTransportFrom,
            to: req.body.email,
            subject: 'Password Recovery',
            text: 'To reset forgotten Password go to ' + verifyLink,
            html: '<p>To reset forgotten Password go to <a href="' + verifyLink + '">' + verifyLink + '</a></p>'
          }

          smtpTransport.sendMail(mail, (err: any, info: any) => {
            if (err) { log(err); return; }
            if (info) {
              res.json({ err: {}, result: { info } })
            }
          })
        })
      } catch (err) {
        res.json({ err })
      }
    })
    //Recover Password Link sent via email
    //####################################################################

    //####################################################################
    //Shared Device email
    app.post("/api/v3/admin/shareDevice", (req: any, res: any) => {

      console.log(req.body);
      res.json({})
      
      // for (var i in req.body.chosen) {
      //   db.states.update({ $and: [{ devid: req.body.chosen[i].devid, apikey: req.user.apikey }] }, { $push: { access: req.body.publickey } })
      //   db.states.findOne({ devid: req.body.chosen[i].devid }, { key: 1, _id: 0 }, (err: Error, give: any) => {
      //     this.eventHub.emit("deviceShare", {
      //       plugin: this.name,
      //       notification: shareDeviceNotification,
      //       device: give,
      //       from: req.user.apikey
      //     })
      //     db.users.update({ email: req.body.email }, { $push: { shared: { $each: [{ keys: give, timeshared: today }] } } })//adds users _id to keys 
      //   })
      // }

      /*
      var today = new Date();
      var shareDeviceNotification = {
        type: "A DEVICE WAS SHARED WITH YOU", //req.body.email
        device: req.body.dev,
        from: req.body.person,
        to: req.body.email,
        created: today,
        notified: true,
        seen: false
      }

      today.setHours(today.getHours() + 2);
      try {
        this.getRegistration((err: Error, result: any) => {
          var smtpTransport = nodemailer.createTransport({
            host: result.nodeMailerTransportHost,
            port: result.nodeMailerTransportPort,
            auth: {
              user: result.nodeMailerTransportAuthUser,
              pass: result.nodeMailerTransportAuthPass
            },
            pool: true, // use pooled connection
            rateLimit: true, // enable to make sure we are limiting
            maxConnections: 1, // set limit to 1 connection only
            maxMessages: 1 // send 3 emails per second
          });

          var mail = {
            from: result.nodeMailerTransportFrom,
            to: req.body.email,
            subject: req.body.subject,
            text: req.body.text,
            html: req.body.html,
            attachments: req.body.attachments
          }

          smtpTransport.sendMail(mail, (err: any, info: any, packet: any) => {
            if (err) { log(err); return; }
            if (info) {

              res.json({ err: {}, result: { mail: "sent" } })
              if (req.body.chosen) {
                for (var i in req.body.chosen) {
                  db.states.update({ $and: [{ devid: req.body.chosen[i].devid, apikey: req.user.apikey }] }, { $push: { access: req.body.publickey } })
                  db.states.findOne({ devid: req.body.chosen[i].devid }, { key: 1, _id: 0 }, (err: Error, give: any) => {
                    this.eventHub.emit("deviceShare", {
                      plugin: this.name,
                      notification: shareDeviceNotification,
                      device: give,
                      from: req.user.apikey
                    })
                    db.users.update({ email: req.body.email }, { $push: { shared: { $each: [{ keys: give, timeshared: today }] } } })//adds users _id to keys 
                  })
                }
              }
              else if (!req.body.chosen) {
                db.states.update({ $and: [{ devid: req.body.dev, apikey: req.user.apikey }] }, { $push: { access: req.body.publickey } })
                db.states.findOne({ devid: req.body.dev }, { key: 1, _id: 0 }, (err: Error, give: any) => {
                  this.eventHub.emit("deviceShare", {
                    plugin: this.name,
                    notification: shareDeviceNotification,
                    device: give,
                    from: req.user.apikey
                  })
                  db.users.update({ email: req.body.email }, { $push: { shared: { $each: [{ keys: give, timeshared: today }] } } })//adds users _id to keys 
                })
              }
            }
          })
        })
      } catch (err) {
        res.json({ err })
      }
      */
    })
    //Shared Device email
    //####################################################################


    app.get("/api/v3/admin/registration", (req: any, res: any) => {
      // public api to get information if server allows registration/requires email verification
      // if level > 100 then adds the server private email config.
      // if level < 100 then just sends through the public safe data.

      if (req.user.level >= 100) {
        this.getRegistration((err: Error, result: any) => {
          res.json({ err, result })
        })
      } else {
        this.getRegistration((err: Error, secret: any) => {
          if (secret) {
            var result = {
              userEmailVerify: secret.userEmailVerify,
              userRegistration: secret.userRegistration
            }
            res.json({ err, result })
          } else {
            res.json({})
          }
        })
      }

    });

    app.post("/api/v3/admin/registration", (req: any, res: any) => {
      if (req.user.level >= 100) {
        var userinput = req.body
        userinput.settings = "registration"
        this.updateRegistration(userinput, (err: Error, result: any) => {
          res.json({ err, result })
        })
      } else {
        log("USER NOT AUTHORIZED!" + req.user.email)
        res.json({ err: "not sufficient user level", result: null })
      }
    });

    // handle incoming account registrations (new with optional email verification)
    app.post("/api/v3/admin/register", (req: any, res: any) => {
      log("ADMIN\tNew Account registration: email: " + req.body.email)

      req.user.email = req.body.email
      req.user.username = req.body.username;
      req.user.usernameSet = true;
      req.user.level = 1
      var scryptParameters = scrypt.paramsSync(0.1);
      //encrypts password
      var kdfResult = scrypt.kdfSync(req.body.pass, scryptParameters);
      req.user.password = kdfResult;
      accounts.registerExistingAccount(this.db, req.user, (error: Error, result: any) => {
        db.users.update({ email: req.user.email }, { $set: { encrypted: true } })
        res.json({ error, result, account: req.user })
      })
    })

    app.get("/api/v3/admin/redis", (req: any, res: any) => {


      if (req.user.level >= 100) {
        this.getRedis((err: Error, result: any) => {
          var redis = null;
          if (result != undefined || result != null) {
            redis = result.redis
          }
          res.json({ err, redis })
        })
      }
    });

    app.post("/api/v3/admin/redis", (req: any, res: any) => {
      if (req.user.level >= 100) {
        var userinput = req.body
        userinput.settings = "redis"
        this.updateRedis(userinput, (err: Error, result: any) => {
          res.json({ err, result })
        })
      } else {
        log("USER NOT AUTHORIZED!" + req.user.email)
        res.json({ err: "not sufficient user level", result: null })
      }
    });
  }

  getRegistration(cb: any) {
    this.db.plugins_admin.findOne({ settings: "registration" }, cb);
  }

  getRedis(cb: any) {
    try {
      var mainconfig = JSON.parse(fs.readFileSync('../../../iotconfig.json').toString())
      cb(null, mainconfig);
    } catch (err) {
      cb(err, null);
    }
  }

  updateRegistration(userInput: any, cb: any) {
    var cleanInput = {
      settings: "registration",
      userRegistration: userInput.userRegistration,
      userEmailVerify: userInput.userEmailVerify,
      nodeMailerTransportHost: userInput.nodeMailerTransportHost,
      nodeMailerTransportPort: userInput.nodeMailerTransportPort,
      nodeMailerTransportAuthUser: userInput.nodeMailerTransportAuthUser,
      nodeMailerTransportAuthPass: userInput.nodeMailerTransportAuthPass,
      nodeMailerTransportFrom: userInput.nodeMailerTransportFrom
    }
    this.db.plugins_admin.update({ settings: "registration" }, cleanInput, { upsert: true }, cb);
  }

  updateRedis(userInput: any, cb: any) {
    var cleanInput = {
      redisEnable: userInput.redisEnable,
      host: userInput.host,
      port: userInput.port,
      AuthPass: userInput.AuthPass,
    }
    try {
      var mainconfig = JSON.parse(fs.readFileSync('../../iotconfig.json').toString())
      mainconfig = _.merge(mainconfig, { redis: cleanInput });
      fs.writeFile("../../../iotconfig.json", JSON.stringify(mainconfig), (r: any) => {
        cb(null, mainconfig);
        this.eventHub.emit("configChange")
      });
    } catch (err) {
      cb(err, null)
    }
  }
}
