import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";
import { hostname } from "os"

export default class Cluster extends PluginSuperServerside {

    heartbeatms = 5000;
    thresholdms;

    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver }) {
        super(props);

        this.thresholdms = this.heartbeatms * 2;

        setInterval(() => {
            this.heartbeat();
        }, this.heartbeatms)

        //on startup
        this.heartbeat();

        /** retrieves cluster data from db and sends to user */
        this.webserver.app.get("/api/v4/cluster/info", (req, res) => {
            this.refresh(() => {
                this.documentstore.db.cluster.findOne({ datatype: "clusterWorkers" }, (err, data) => {
                    data.worker = {
                        hostname: hostname(),
                        pid: process.pid,
                        updated: new Date()
                    }
                    res.json(data);
                });
            })

        })

        /** clear out old entries from db */
        this.webserver.app.get("/api/v4/cluster/refresh", (req, res) => {
            this.refresh(() => {
                res.json({ success: true })
            })
        })

        // setTimeout(() => {
        //     this.refresh(() => { })
        // }, this.thresholdms);
    }

    heartbeat() {

        //STARTUP:
        var worker = {
            hostname: hostname(),
            pid: process.pid,
            updated: new Date(),
            state: this.core.clusterstate
        }

        var workerupdate = {
            "$push": {
                workers: worker
            }
        }

        this.documentstore.db.cluster.update({ datatype: "clusterWorkers", "workers.hostname": worker.hostname, "workers.pid": worker.pid }, { $set: { "workers.$": worker } }, (err, result) => {
            // console.log(err)
            // console.log(result);
            if (result.nModified == 0) {
                this.documentstore.db.cluster.update({ datatype: "clusterWorkers" }, workerupdate, { upsert: true }, () => { });
            }
        })
    }


    refresh(cb) {
        this.documentstore.db.cluster.findOne({ datatype: "clusterWorkers" }, (err, data) => {

            var cleandata = { datatype: "clusterWorkers", workers: [] }

            for (var worker of data.workers) {
                var ago = new Date().getTime() - new Date(worker.updated).getTime()
                if (ago < this.thresholdms) {
                    cleandata.workers.push(worker);
                }
            }

            this.documentstore.db.cluster.update({ datatype: "clusterWorkers" }, cleandata, (err, res) => {
                cb();
            })
        })
    }
};

