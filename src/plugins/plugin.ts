import { EventEmitter } from "events";

export const urlpath = "/api/v3/plugins/";

import { log } from "../log"
import express = require('express');

import * as events from "events"

export class Plugin extends EventEmitter {
    log = log;
    eventHub: any;

    constructor(app: express.Express, db: any, eventHub: events.EventEmitter) {
        super();
        this.eventHub = eventHub;
    }
}