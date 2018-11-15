import * as accounts from "../../accounts"

import * as events from "events";
import * as _ from "lodash";

export var name = "admin";


export function handlePacket(db:any, packet: any, cb: any) {
}

export function init(app: any, db: any, eventHub: events.EventEmitter) {

  app.get("/api/v3/admin/registration", (req: any, res: any) => {
    if (req.user.level >= 100) {
      getRegistration(db, (err:Error, result:any)=>{
        res.json({err,result})
      })
    } else {
      console.log("USER NOT AUTHORIZED!"+req.user.email)
      res.json({err:"not sufficient user level", result:null})
    }
  });

  app.post("/api/v3/admin/registration", (req: any, res: any) => {
    if (req.user.level >= 100) {
      var userinput = req.body
      userinput.settings = "registration"
      updateRegistration(db, userinput, (err:Error, result:any)=>{
        res.json({err,result})
      })
    } else {
      console.log("USER NOT AUTHORIZED!"+req.user.email)
      res.json({err:"not sufficient user level", result:null})
    }
  });


  // handle incoming account registrations (new with optional email verification)
  app.post("/api/v3/admin/register", (req:any, res:any)=>{
    console.log("account registration")
    console.log(req.body)

    // accounts.registerExistingAccount(db, req.body.email, req.get('User-Agent'), req.ip, (err:Error,user:any)=>{
    //   res.json({err, user})
    // }, {password:req.user.pass})

    req.user.email = req.body.email
    req.user.password = req.body.pass
    req.user.level = 1
    
    accounts.registerExistingAccount(db, req.user, (error:Error, result:any)=>{
      res.json({error, result})
    })

  })

}


function getRegistration(db:any, cb:any) {
  db.plugins_admin.findOne({settings:"registration"}, cb);
}

function updateRegistration(db: any, userInput: any, cb: any) {
  var cleanInput = {
    settings : "registration",
    userRegistration            : userInput.userRegistration,
    userEmailVerify             : userInput.userEmailVerify,
    nodeMailerTransportHost     : userInput.nodeMailerTransportHost,
    nodeMailerTransportPort     : userInput.nodeMailerTransportPort,
    nodeMailerTransportAuthUser : userInput.nodeMailerTransportAuthUser,
    nodeMailerTransportAuthPass : userInput.nodeMailerTransportAuthPass,
    nodeMailerTransportFrom     : userInput.nodeMailerTransportFrom
  }

  db.plugins_admin.update({ settings: "registration" }, cleanInput, { upsert: true },cb);   
}



