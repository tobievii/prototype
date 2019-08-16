//import express = require('express');
import lodash = require('lodash');
import express = require("express")

const cookieParser = require('cookie-parser');
const session = require('express-session');

import { EventEmitter } from 'events';

import * as http from "http";
import * as https from "https";

import * as fs from "fs";
import { logger } from "./log"
import { Core } from "./core"

import { webapiv3 } from "./webapi_v3"



export class Webserver extends EventEmitter {
    app: express.Application;
    ssl: any;
    server: http.Server;

    port: number = 8080;
    core: Core;

    constructor(options: { core: Core }) {
        super();

        this.app = express();

        this.app.disable('x-powered-by'); //security

        this.app.use(cookieParser());
        this.app.use(session({
            secret: "ajnsjdknasjkdnjkasd",
            resave: false,
            saveUninitialized: false
        }))

        this.core = options.core;

        this.app.use(this.safeParser);
        this.app.use(this.parseHeaderAuth(this.core));

        this.app.use(express.static('../public'))
        this.app.use(express.static('../client/dist'))

        webapiv3(this.app, this.core);

        var reactHtml = "";

        fs.readFile('../public/index.html', (err, data: any) => {
            reactHtml = data.toString();

        })

        this.app.get("/", (req, res) => { res.end(reactHtml); })
        this.app.get("/resources", (req, res) => { res.end(reactHtml); })
        this.app.get("/features", (req, res) => { res.end(reactHtml); })
        this.app.get("/products", (req, res) => { res.end(reactHtml); })
        this.app.get("/register", (req, res) => { res.end(reactHtml); })
        this.app.get("/login", (req, res) => { res.end(reactHtml); })


        this.app.post("/signin", (req, res) => {
            this.core.user({ email: req.body.email, pass: req.body.pass }, (err: Error | undefined, user: any) => {
                if (err) { res.json({ err }); return; }
                if (user) {
                    var auth = 'Basic ' + Buffer.from("api:key-" + user.apikey).toString('base64')
                    res.json({ signedin: true, auth })
                }
            })
        })

        this.app.get('/signout', (req, res) => {
            res.clearCookie("uuid");
            res.redirect('/');
        });

        this.app.get("*", (req, res) => {
            res.status(404).json({ error: "404 not found " + req.method + " " + req.url, url: req.url, method: req.method })
        })

        this.app.post("*", (req, res) => {
            res.status(404).json({ error: "404 not found " + req.method + " " + req.url, url: req.url, method: req.method })
        })

        // todo ssl
        // this.server = https.createServer(this.sslOptions, this.app);
        this.server = http.createServer(this.app);


    }

    listen() {
        this.server.listen(this.port, () => {
            logger.log({ message: "webserver started", data: { port: this.port }, level: "info" })
        });
    }

    safeParser(req: any, res: any, next: any) {
        var buf = ""
        req.on("data", (chunk: any) => { buf += chunk.toString(); })
        req.on("end", () => {
            if (buf.length > 0) {
                try {
                    var jsonin = JSON.parse(buf)
                    req.body = jsonin;
                    next();
                } catch (err) {
                    res.status(400).json({ "error:": err.toString() + ". Make sure you are sending valid JSON" })
                    next();
                }
            } else { next(); }
        })
    }

    parseHeaderAuth(core: Core) {
        return (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
            if (req.headers.authorization) {

                this.core.user({ authorization: req.headers.authorization }, (err, user) => {
                    if (err) { next(); }
                    if (user) {
                        req.user = user;
                        next();
                    }
                })

            } else {
                next();
            }
        }
    }

}
