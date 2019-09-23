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
  showdata: boolean = false;

  constructor() {
    this.logverbosity = 1;
  }

  /**
   * Logging
   * @param event message test
   */
  log(event: LogEvent) {

    if (event.message) {
      var tabs = "\t"
      if (event.message.length < 10) { tabs = "\t\t" }

      var data = "";
      if (this.showdata) {
        if (event.data) { data = JSON.stringify(event.data) }
      }

      var leveltabs = "\t"
      if (event.level.length <= 5) {
        leveltabs = "\t\t"
      }


      if (process) {
        console.log(new Date().toISOString() + " " + event.level + leveltabs + process.pid + " " + event.message + tabs + data);
      } else {
        console.log(new Date().toISOString() + " " + event.level + leveltabs + " " + event.message + tabs + data);
      }

    }
  }

}




export const logger = new Logger();