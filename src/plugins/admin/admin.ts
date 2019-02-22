var nodemailer = require("nodemailer")
var randomString = require('random-string');
var mongojs = require('mongojs')
var ObjectId = mongojs.ObjectId;
import * as accounts from "../../accounts"
import * as events from "events";
import * as _ from "lodash";

export var name = "admin";


export function handlePacket(db: any, packet: any, cb: any) {
}

export function init(app: any, db: any, eventHub: events.EventEmitter) {


  app.get("/verify/:id", (req: any, res: any) => {
    //console.log(req.user._id)
    //console.log(req.params.id)
    db.users.findOne({ "_id": ObjectId(req.params.id) }, (err: Error, user: any) => {
      if (err) { console.log(err); return; }
      if (user == null) {
        res.json({ err: "user not found" })
        return;
      }

      if (user) {
        console.log("found")

        user.emailverified = true;
        db.users.update({ "_id": ObjectId(req.params.id) }, user, (err: Error, result2: any) => {
          if (err) { console.log(err); return; }
          if (result2) {
            console.log("result2:"); console.log(result2);
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
      getRegistration(db, (err:Error, result:any)=>{

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
          text: 'To verify your account please go to '+verifyLink,
          html: '<p>To verify your account please go to <a href="'+verifyLink+'">'+verifyLink+'</a></p>'
        }

        smtpTransport.sendMail(mail, (err:any, info:any)=>{
          if (err) { console.log(err); return;}
          if (info) {
            console.log(info);
            res.json({err:{}, result:{ mail: "sent" }})
          }
        })      
      })
    } catch (err) {
      res.json({err})
    }

    //Email Verification link
//####################################################################

  })


  //Reset password after link
app.post("/api/v3/admin/changepassword", (req: any, res: any) => {
  var today = new Date();
  today.setHours(today.getHours() + 2);
  db.users.update({'recover.recoverToken':req.body.person},{ $set: {"password":req.body.pass}}, (err:Error, response:any) => {
        if (response) {
          if(response.nModified == 0){
            res.json(response)
          }else{
            res.json(response)
          }
        } else if(err){
          res.json(err)
        }
  })
  var changeToken=randomString({length:128});
  db.users.update({'recover.recoverToken':req.body.person},{ $set: {recover:{"recoverToken":changeToken,"recoverTime":today}}})
})

app.post("/api/v3/admin/expire", (req: any, res: any) => {
  
  if(req.body.button){
    var expire=setTimeout(() => {
      var today = new Date();
      today.setHours(today.getHours() + 2);
      var changeTokens=randomString({length:128});
      db.users.update({'email':req.body.person},{ $set: {recover:{"recoverToken":changeTokens,"recoverTime":today}}})
    }, 600000);
  }
})

//Reset password after link

//Changing password while logged in
app.post("/api/v3/admin/userpassword", (req: any, res: any) => {
db.users.update({$and:[{username:req.body.user},{password:req.body.current}]},{ $set: {"password":req.body.pass}}, (err:Error, response:any) => {
      if (response) {
        if(response.nModified == 0){
          res.json(response)
        }else{
          res.json(response)
        }
       } else if(err){
        res.json(err)
      }
})
})
//Changing password while logged in



  //####################################################################
//Recover Password Link sent via email
app.post("/api/v3/admin/recoverEmailLink", (req: any, res: any) => {
  var today = new Date();
today.setHours(today.getHours() + 2);
  var recoverToken=randomString({length:128});
 db.users.update({email:req.body.email},{ $set:{recover:{"recoverToken":recoverToken,"recoverTime":today}}})
 try {
 getRegistration(db, (err:Error, result:any)=>{
    var verifyLink = req.headers.referer + "recover/" +recoverToken
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
          text: 'To reset forgotten Password go to '+verifyLink,
          html: '<p>To reset forgotten Password go to <a href="'+verifyLink+'">'+verifyLink+'</a></p>'
        }

        smtpTransport.sendMail(mail, (err:any, info:any)=>{
          if (err) { console.log(err); return;}
          if (info) {
            res.json({err:{}, result:{ info }})
          }
        })    
         })  } catch (err) {
      res.json({err})
    } 
  })
//Recover Password Link sent via email
//####################################################################


 //####################################################################
//Shared Device email
app.post("/api/v3/admin/shareDevice", (req: any, res: any) => {
 var today = new Date();
today.setHours(today.getHours() + 2);
try {
 getRegistration(db, (err:Error, result:any)=>{
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
          to:req.body.email,
          subject: req.body.subject,
          text: req.body.text,
          html: req.body.html
        }

        smtpTransport.sendMail(mail, (err:any, info:any)=>{
          if (err) { console.log(err); return;}
          if (info) {
           
            res.json({err:{}, result:{ mail: "sent" }})
            db.users.findOne({email:req.body.email},{_id:1},(err:Error,result:any)=>{
              console.log(result._id)
              db.users.findOne({email:req.body.email},{uuid:1,_id:0},(err:Error,visitor:any)=>{
db.states.update({devid:req.body.dev},{ $push:{access:visitor.uuid}})
              })
               
db.states.findOne({devid:req.body.dev},{key:1,_id:0},(err:Error,give:any)=>{
db.users.update({email:req.body.email},{ $push:{shared:{$each:[{keys:give,timeshared:today}]} } })//adds users _id to keys 
}
)})
          }
        })    
         })  } catch (err) {
      res.json({err})
    } 
  })
//Shared Device email
//####################################################################
 

  app.get("/api/v3/admin/registration", (req: any, res: any) => {
    // public api to get information if server allows registration/requires email verification
    // if level > 100 then adds the server private email config.
    // if level < 100 then just sends through the public safe data.
    
    if (req.user.level >= 100) {
      getRegistration(db, (err: Error, result: any) => {
        res.json({ err, result })
      })
    } else {
      getRegistration(db, (err: Error, secret: any) => {

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
      updateRegistration(db, userinput, (err: Error, result: any) => {
        res.json({ err, result })
      })
    } else {
      console.log("USER NOT AUTHORIZED!" + req.user.email)
      res.json({ err: "not sufficient user level", result: null })
    }
  });

  // handle incoming account registrations (new with optional email verification)
  app.post("/api/v3/admin/register", (req: any, res: any) => {
    console.log("account registration")
    console.log(req.body)

    // accounts.registerExistingAccount(db, req.body.email, req.get('User-Agent'), req.ip, (err:Error,user:any)=>{
    //   res.json({err, user})
    // }, {password:req.user.pass})

    req.user.email = req.body.email
    req.user.password = req.body.pass
    req.user.level = 1

    accounts.registerExistingAccount(db, req.user, (error: Error, result: any) => {
      res.json({ error, result, account:req.user })
    })

  })

}


function getRegistration(db: any, cb: any) {
  db.plugins_admin.findOne({ settings: "registration" }, cb);
}

function updateRegistration(db: any, userInput: any, cb: any) {
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

  db.plugins_admin.update({ settings: "registration" }, cleanInput, { upsert: true }, cb);
}



