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

class Logger {

  logverbosity: number;

  log(event: LogEvent) {

    return;

    this.logverbosity = 1;
    if (event.message) {
      var tabs = "\t"
      if (event.message.length < 10) { tabs = "\t\t" }
      var data = "";
      if (event.data) { data = JSON.stringify(event.data) }

      var leveltabs = "\t"
      if (event.level.length <= 5) {
        leveltabs = "\t\t"
      }

      if (this.logverbosity == 1) {
        console.log(new Date().toISOString() + " " + event.level + leveltabs + " " + event.message);
      }

      if (this.logverbosity == 2) {
        if (process.pid) {
          console.log(new Date().toISOString() + " " + event.level + leveltabs + process.pid + " " + event.message + tabs + data);
        } else {
          console.log(new Date().toISOString() + " " + event.level + leveltabs + " " + event.message + tabs + data);
        }
      }




      //+JSON.stringify(event.message.msg))
    } else {
      console.log("ERROR invalid log format...")
    }

  }
}


export const logger = new Logger();