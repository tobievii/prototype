
import * as events from "events";

export const name = "notifications"

export const workflowDefinitions = [
  "var " + name + " = { ",
  "warning: (message:string)",
  "alarm: (message:string)",
  "info: (message:string)",
  "}"
];

export const workflow = { warning, alarm, info }

export function warning(message: string) {
  console.log(message);
}

export function alarm(message: string) {
  console.log(message);
}

export function info(message: string) {
  console.log(message);
}

export var bot: any;

export function init(app: any, db: any, eventHub: events.EventEmitter) {



}
