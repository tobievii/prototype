import { EventEmitter } from "events";
import { LogEvent } from "../interfaces/interfaces"

/*
import { createLogger, format, transports } from 'winston';
const { label, combine, timestamp , prettyPrint, json, colorize, splat } = format;

export const logger:any = createLogger({
  format: combine(
        timestamp(),
        format.json(),
      ),
  transports: [
    new transports.Console({format: combine(format.timestamp(), format.prettyPrint({colorize:true}))}),
    new transports.File({ filename: './error.log' , level: 'error'  }),
    new transports.File({ filename: './info.log' , level: 'info'  }),
  ],
  exitOnError: false,
});

*/

class Logger extends EventEmitter {
  constructor() {
    super();
  }

  log(event:LogEvent) {
    if (event.message) {
      //console.log(new Date().toISOString()+" "+process.pid+" "+JSON.stringify(event.message))
      var tabs = "\t"
      if (event.message.length<10) { tabs = "\t\t"}
      var data = "";
      if (event.data) { data = JSON.stringify(event.data)}
      console.log(new Date().toISOString()+" "+event.level+" "+process.pid+" "+event.message + tabs + data);
      //+JSON.stringify(event.message.msg))
    } else {
      console.log("ERROR invalid log format...")
    }
    
  }
}


export const logger = new Logger();