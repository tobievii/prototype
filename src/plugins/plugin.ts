import { EventEmitter } from "events";

export const urlpath = "/api/v3/plugins/";

import { log } from "../log"

export class Plugin extends EventEmitter {
    log = log;
    constructor() {
        super();
    }
}