import { log } from "./utils";

var dbStats: any;

export async function accountStats(user: any, cb: Function) {
  var db = dbStats;

  var stats = {
    packetsMonth: await accountPacketsThisMonth(),
    packetsTotal: await accountPacketsTotal(),
    packetsToday: await accountPacketsToday(),
    statesTotal: await accountStatesTotal(),
    statesActive: await accountStatesActive24h()
  };

  cb(undefined, stats);

  // ---------------------------------------------------------
  function accountPacketsTotal(): Promise<any> {
    return new Promise<any>(resolve => {
      db.packets
        .find({ apikey: user.apikey })
        .count((err: Error, packetCount: any) => {
          resolve(packetCount);
        });
    });
  }
  // ---------------------------------------------------------
  function accountPacketsThisMonth(): Promise<number> {
    return new Promise<any>(resolve => {
      //var time = (24 * 60 * 60 * 1000) * days;
      var now = new Date();
      var startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        now.getTimezoneOffset() / -60
      );
      db.packets
        .find({ apikey: user.apikey, _created_on: { $gt: startOfMonth } })
        .count((err: Error, packetsCount: any) => {
          var data = {
            packetsCount: packetsCount,
            startOfMonth: startOfMonth
          };
          resolve(data);
        });
    });
  }
  // ---------------------------------------------------------
  function accountPacketsToday(): Promise<number> {
    return new Promise<number>(resolve => {
      var time = 24 * 60 * 60 * 1000 * 1;
      db.packets
        .find({
          apikey: user.apikey,
          _created_on: { $gt: new Date(Date.now() - time) }
        })
        .count((err: Error, packetsCount: any) => {
          resolve(packetsCount);
        });
    });
  }
  // ---------------------------------------------------------
  function accountStatesTotal(): Promise<any> {
    return new Promise<any>(resolve => {
      db.states
        .find({ apikey: user.apikey })
        .count((err: Error, statesCount: any) => {
          resolve(statesCount);
        });
    });
  }
  // ---------------------------------------------------------
  function accountStatesActive24h(): Promise<number> {
    return new Promise<number>(resolve => {
      var time = 24 * 60 * 60 * 1000 * 1;
      db.states
        .find({
          apikey: user.apikey,
          _last_seen: { $gt: new Date(Date.now() - time) }
        })
        .count((err: Error, statesCount: any) => {
          resolve(statesCount);
        });
    });
  }
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
}
////// END ACCOUNT STATS

///////////////////////////////// SYSTEM WIDE

export function init(app: any, db: any) {
  dbStats = db;
  //const person =this.props.username;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // returns array of days device had activity and counts the amount of packets for each day
  app.post("/api/v3/activity", (req: any, res: any) => {
    db.packets.aggregate(
      [
        {
          $match: {
            _created_on: { $gt: new Date("2019-01-01T00:00:00.000Z") },
            key: req.body.key
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$_created_on" }
              }
            },
            value: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ],
      (err: Error, results: any) => {
        for (var result of results) {
          var temp = {
            day: result["_id"].date,
            value: result.value
          };
          delete result.value;
          delete result["_id"];
          result.day = temp.day;
          result.value = temp.value;
        }

        res.json(results);
      }
    );
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // returns general server statistics
  var statsCache: any;
  var statsCacheTimestamp: any = new Date("1980");

  app.get("/api/v3/stats", async (req: any, res: any) => {
    res.json({}); //disable stats

    // var now: any = new Date();

    // // update stats every 5 minutes only
    // if ((now - statsCacheTimestamp) > 1000 * 60 * 5) {
    //   var stats = {
    //     users24h: await usersActiveLastDays(1),
    //     users24hList: await usersActiveLastDaysNames(1),
    //     userList: await usersNames(),
    //     users1w: await usersActiveLastDays(7),
    //     users1m: await usersActiveLastDays(30),
    //     states24h: await statesActiveLastDays(1),
    //     packets24h: await packetsActiveLastDays(1)
    //   };

    //   statsCacheTimestamp = now;
    //   statsCache = stats;
    //   res.json(stats);
    // } else {
    //   res.json(statsCache);
    // }

  });

  //all users
  function usersNames(): Promise<any> {
    return new Promise<any>(resolve => {
      db.users.find({ level: { $gt: 0 } }, (err: Error, userList: any) => {
        var nameList: any = [];
        for (var user of userList) {
          if (user.username != null && user.username != undefined) {
            nameList.push({
              //email: user.email,
              username: user.username,
              selected: "deselected",
              sharekey: user.publickey,
              shared: "no"
            });
          }
        }
        resolve(nameList);
      });
    });
  }
  //   users last 24hr
  function usersActiveLastDaysNames(days: number): Promise<any> {
    return new Promise<any>(resolve => {
      var time = 24 * 60 * 60 * 1000 * days;
      db.users.find(
        { level: { $gt: 0 }, _last_seen: { $gt: new Date(Date.now() - time) } },
        (err: Error, userList: any) => {
          var nameList: any = [];
          for (var user of userList) {
            if (user.username != null && user.username != undefined) {
              nameList.push({
                //email: user.email,
                username: user.username,
                //uuid: user.uuid
              });
            }
          }
          resolve(nameList);
        }
      );
    });
  }

  //   users last 24hr
  function usersActiveLastDays(days: number): Promise<number> {
    return new Promise<number>(resolve => {
      var time = 24 * 60 * 60 * 1000 * days;
      db.users
        .find({
          level: { $gt: 0 },
          _last_seen: { $gt: new Date(Date.now() - time) }
        })
        .count((err: Error, usersCount: any) => {
          resolve(usersCount);
        });
    });
  }

  //   states last 24hr
  function statesActiveLastDays(days: number): Promise<number> {
    return new Promise<number>(resolve => {
      var time = 24 * 60 * 60 * 1000 * days;
      db.states
        .find({ _last_seen: { $gt: new Date(Date.now() - time) } })
        .count((err: Error, statesCount: any) => {
          resolve(statesCount);
        });
    });
  }

  //   packets last 24hr
  function packetsActiveLastDays(days: number): Promise<number> {
    return new Promise<number>(resolve => {
      var time = 24 * 60 * 60 * 1000 * days;
      db.packets
        .find({ _created_on: { $gt: new Date(Date.now() - time) } })
        .count((err: Error, packetsCount: any) => {
          resolve(packetsCount);
        });
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}
