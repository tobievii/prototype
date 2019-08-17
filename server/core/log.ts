import { EventEmitter } from "events";
import { LogEvent } from "./interfaces"

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

  log(event: LogEvent) {
    if (event.message) {

      // if (event.level != "debug") { return; }
      // if (event.level == "info") { return; }

      //console.log(new Date().toISOString()+" "+process.pid+" "+JSON.stringify(event.message))
      var tabs = "\t"
      if (event.message.length < 10) { tabs = "\t\t" }
      var data = "";
      if (event.data) { data = JSON.stringify(event.data) }

      var leveltabs = "\t"
      if (event.level.length <= 5) {
        leveltabs = "\t\t"
      }
      console.log(new Date().toISOString() + " " + event.level + leveltabs + process.pid + " " + event.message + tabs + data);
      //+JSON.stringify(event.message.msg))
    } else {
      console.log("ERROR invalid log format...")
    }

  }
}


export const logger = new Logger();