export function init(app: any, db: any) {
  console.log("initializing stats")

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // returns array of days device had activity and counts the amount of packets for each day
  app.post("/api/v3/activity", (req:any, res:any) => {
    db.packets.aggregate([
      { $match :
          { _created_on :{ $gt: new Date("2018-01-01T00:00:00.000Z")}, apikey:req.user.apikey, devid:req.body.deviceid}
      },
      { $group : {
          _id : { date: { $dateToString: { format: "%Y-%m-%d", date: "$_created_on" } }},
          value: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
      ], (err:Error, results:any)=>{
        for (var result of results) {
          var temp = {
            day : result["_id"].date,
            value : result.value
          }
          delete result.value
          delete result["_id"]
          result.day = temp.day
          result.value = temp.value         
        }

        res.json(results);
      })  
  })

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // returns general server statistics
  app.get("/api/v3/stats", async (req:any, res:any)=>{
    var stats = {
      users24h : await usersActiveLastDays(1),
      users24hList : await usersActiveLastDaysNames(1),
       userList : await usersNames(),
      users1w : await usersActiveLastDays(7),
      users1m : await usersActiveLastDays(30),
      states24h: await statesActiveLastDays(1),
      packets24h : await packetsActiveLastDays(1)
    }
    res.json(stats)
  })

  //all users
function usersNames():Promise<any> {
  return new Promise<any> (resolve => {
    
    db.users.find({ level : { $gt: 0 }, }, (err:Error, userList:any)=>{
      var nameList:any = []
      for (var user of userList) {


        nameList.push({ email: user.email, username: user.username});
      }
      resolve(nameList)
    })
  })
}
//   users last 24hr
function usersActiveLastDaysNames(days:number):Promise<any> {
  return new Promise<any> (resolve => {
    var time = (24*60*60 * 1000) * days;
    db.users.find({ level : { $gt: 0 }, "_last_seen":{$gt:new Date(Date.now() - time)}}, (err:Error, userList:any)=>{
      var nameList:any = []
      for (var user of userList) {


        nameList.push({ email: user.email, username: user.username});
      }
      resolve(nameList)
    })
  })
}

  //   users last 24hr
  function usersActiveLastDays(days:number):Promise<number> {
    return new Promise<number> (resolve => {
      var time = (24*60*60 * 1000) * days;
      db.users.find({ level : { $gt: 0 }, "_last_seen":{$gt:new Date(Date.now() - time)}}).count( (err:Error, usersCount:any)=>{
        resolve(usersCount)
      })
    })
  }

  //   states last 24hr
  function statesActiveLastDays(days:number):Promise<number> {
    return new Promise<number> (resolve => {
      var time = (24*60*60 * 1000) * days;
      db.states.find({"_last_seen":{$gt:new Date(Date.now() - time)}}).count( (err:Error, statesCount:any)=>{
        resolve(statesCount)
      })
    })
  }

    //   packets last 24hr
    function packetsActiveLastDays(days:number):Promise<number> {
      return new Promise<number> (resolve => {
        var time = (24*60*60 * 1000) * days;
        db.packets.find({"_created_on":{$gt:new Date(Date.now() - time)}}).count( (err:Error, packetsCount:any)=>{
          resolve(packetsCount)
        })
      })
    }


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

}