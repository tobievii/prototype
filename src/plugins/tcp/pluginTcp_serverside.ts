var net = require("net");
import * as events from "events";

export var serversMem: any = {};

export function init(app: any, db: any, eventHub: events.EventEmitter) {
  console.log("init tcp plugin");

  app.get("/api/v3/tcp/ports", (req: any, res: any) => {
    getports(db, (err: Error, ports: any) => {
      
      if (err) res.json({ err: err.toString() });
      
      var cleanports:any = []
      for (var p in ports) {
        //delete ports[p].apikey
        if (ports[p].apikey == req.user.apikey) {
          // keep the apikey
          ports[p].apikey = true
        } else {
          ports[p].apikey = false
        } 
        // cleanports
        
      }      

      res.json(ports);
    });
  });

  app.post("/api/v3/tcp/setapikey", (req:any, res:any)=>{
    console.log("--..")
    console.log(req.body);

    db.plugins_tcp.update(
      { portNum: req.body.portNum },
      { $set: { apikey: req.user.apikey } },
      (err: Error, resultUpd: any) => {
        if (err) { res.json( err )}
        if (resultUpd) {
          res.json(resultUpd)
        }
      }
    );

  })

  app.post("/api/v3/tcp/addport", (req: any, res: any) => {
    if (req.user.level < 100) {
      res.json({ err: "permission denied" });
      return;
    }

    addport(db, req.body, (err: Error, result: any) => {
      if (err) {
        res.json({ err: err.toString() });
      } else {
        res.json(result);
      }
    });
  });

  app.post("/api/v3/tcp/removeport", (req: any, res: any) => {
    if (req.user.level < 100) {
      res.json({ err: "permission denied" });
      return;
    }

    removeport(db, req.body, (err: Error, result: any) => {
      if (err) res.json({ err: err.toString() });
      res.json(result);
    });
  });

  getports(db, (err: Error, ports: any) => {
    if (ports) {
      for (var p in ports) {
        connectport(db, ports[p], eventHub, (err: any, result: any) => {});
      }
    }
  });
}

export function getports(db: any, cb: any) {
  db.plugins_tcp.find({}, cb);
}

export function addport(db: any, portOptions: any, cb: any) {
  if (portOptions.portNum < 1000) {
    cb(new Error("portNum can not be in the range 0-1000"), undefined);
    return;
  }

  db.plugins_tcp.find(
    { portNum: portOptions.portNum },
    (err: Error, conflictingPorts: any) => {
      if (err) console.log(err);
      if (conflictingPorts.length == 0) {
        db.plugins_tcp.save(portOptions, cb);
      } else {
        cb(new Error("portNum already taken"), undefined);
      }
    }
  );
}

export function removeport(db: any, portOptions: any, cb: any) {
  db.plugins_tcp.remove({ portNum: portOptions.portNum }, cb);
}

export function updateport(db: any, portNum: number, update: any, cb: any) {
  db.plugins_tcp.update({ portNum }, { $set: update }, cb);
}

export function connectport(db: any, portOptions: any, eventHub: any, cb: any) {
  console.log("TCP Server " + portOptions.portNum + " \t| loading...");

  var server = net.createServer((client: any) => {
    server.getConnections(function(err: Error, count: number) {
      console.log("There are %d connections now. ", count);
      updateport(
        db,
        portOptions.portNum,
        { connections: count },
        (err: Error, result: any) => {}
      );
      eventHub.emit("plugin", { plugin: "tcp", event: "connections" });
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    client.on("data", (data: any) => {
      console.log(data);
      eventHub.emit("device", {
        //apikey: config.apikey,
        apikey: "mfradh6drivbykz7s4p3vlyeljb8666v",
        packet: {
          id: "tcpPort"+portOptions.portNum,
          level: 1,
          data: { text: data.toString().replace("\r\n","")},
          tcp: { hexBuffer: data.toString("hex"), },
          portOptions,
          meta: { method: "tcp" }
        }});
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    client.on("end", () => {
      // Get current connections count.
      server.getConnections(function(err: Error, count: number) {
        console.log("There are %d connections now. ", count);
        updateport(
          db,
          portOptions.portNum,
          { connections: count },
          (err: Error, result: any) => {}
        );
      });
      eventHub.emit("plugin", { plugin: "tcp", event: "connections" });
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  });

  server.listen(portOptions.portNum, () => {
    console.log("TCP Server " + portOptions.portNum + " \t| ready.");
  });

  server.on("close", function() {
    console.log("TCP server socket is closed.");
  });

  server.on("error", function(error: Error) {
    console.error(JSON.stringify(error));
  });

  serversMem[portOptions.portNum] = server;
}
