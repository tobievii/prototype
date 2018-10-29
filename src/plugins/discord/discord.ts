
import * as events from "events";

const Discord = require('discord.js');

export var botsMem:any = {};

export function init(app: any, db: any, eventHub: events.EventEmitter) {
 
  console.log("discord plugin init")

  eventHub.on("device",(data:any)=>{ })

  eventHub.on("plugin", (data:any) => {  })

  app.post("/api/v3/discord/savebot", (req:any, res:any)=>{
    if (req.user.level < 100) { res.json({err:"permission denied"}); return; }
    savebot(db, req.body, (err:Error, botoptions:any)=>{
      if (err) { 
        res.json({err:err.toString()});
      } else {
        connectbot(db, botoptions, eventHub, (err:Error,resp:any)=>{})
        res.json(botoptions);
      }
      
    })
  })
 
  //connect bots..
  db.plugins_discord.find({}, (err:Error, bots:any)=>{
    for (var b in bots) {
      console.log(bots[b]);
      connectbot(db, bots[b], eventHub, (err:Error, result:any)=>{

      })
    }
  })

}


export function savebot(db:any, botoptions:any, cb:any) {
  db.plugins_discord.save(botoptions, cb);  
}

export function connectbot(db:any, botOptions:any, eventHub:any, cb:any) {
  const bot = new Discord.Client();
  bot.on('ready', () => { cb(undefined, bot); });
  bot.on('message', (msg:any) => { if (msg.content === 'ping') { msg.reply('pong'); } });
  bot.login(botOptions.token);
}