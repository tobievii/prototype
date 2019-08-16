import { Core } from "./core";
import { Application } from "express"
import lodash = require('lodash');

export function webapiv3(app:Application, core:Core) {
    app.post("/api/v3/admin/register", (req: any, res) => {
        core.register({
            email: req.body.email,
            username: req.body.username,
            pass: req.body.pass,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        }, (err:any, result) => {
            if (err) res.json(err);
            if (result) res.json(result);
        })
    })

    app.get("/api/v3/account", (req: any, res) => {
        if (!req.user) { res.json({ err: "user not authenticated" }); return; }
        var cleanUser = lodash.clone(req.user);
        delete cleanUser.password;
        res.json(cleanUser);
    })


    app.get("/api/v3/version", (req:any, res) => {
        res.json(core.config.version)
    })

    // post packet data
    app.post("/api/v3/data/post", (req:any, res) => {
        core.datapost({ packet: req.body, user: req.user }, (err: object, result: object) => {
            if (err) { res.status(400).json(err); }
            if (result) { res.json(result); }
        })
    })

    // view state simple
    app.post("/api/v3/view", (req: any, res) => {
        core.view({ id: req.body.id, user: req.user }, (err, result) => {
            if (err) { res.status(400).json(err); }
            if (result) { res.json(result); }
        })
    })

    app.post("/api/v3/state", (req: any, res) => {
        core.view({ id: req.body.id, user: req.user }, (err, result) => {
            if (err) { res.status(400).json(err); }
            if (result) { 
                //compatibility fix for v3..
                result.devid = result.id;
                result.payload = lodash.clone(result);
                res.json(result); 
            }
        })
    })

    app.get("/api/v3/states", (req:any, res) => {
        core.view({user: req.user}, (err,result) => {
            if (err) { res.status(400).json(err); }
            if (result) { res.json(result); }
        })
    })

    // view packets history
    app.post("/api/v3/packets", (req: any, res) => {
        core.packets({ id: req.body.id, user: req.user }, (err: any, result: any) => {
            if (err) { res.status(400).json(err); }
            if (result) { res.json(result); }
        })
    })

    app.post("/api/v3/state/delete", (req:any, res)=>{
        core.delete({id:req.body.id, user: req.user}, (err:any, result:any)=>{
            if (err) { res.status(400).json(err); }
            if (result) { res.json(result); }
        })
    })
    
}