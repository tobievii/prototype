# PROTOTYPE 5.1 ALPHA
next generation realtime data store and display system

# todo
devid -> id                 // rename all devid to id 

# references:

https://www.pluralsight.com/guides/typescript-react-getting-started
https://pusher.com/tutorials/mongodb-change-streams


To get this to work you have to set mongo into replica/sharded mode:

```
mongod --replSet "rs"
mongo
rs.initiate()
```

------------

migration notes:

db.packets


