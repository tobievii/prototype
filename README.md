# Prototype

Typescrypt based IoT framework for general purpose remote monitoring/control.
Built using react, mongodb, express and socketio.

![alt text](https://i.imgur.com/GPRoU1h.png)

See a live realtime list of your devices, when they were last active and a summary of the raw data state.

![alt text](https://i.imgur.com/rpgVIff.png)

You can set javascript code to process the device JSON data server side (using sandboxed VM) to make REST calls or perform different actions depending on the state of other devices.

# Install instructions

Clone the repo.

## _Step 1_ **_Build the client side app_**

```sh
cd prototype/client

# install node_modules for client side
npm install

# build development optimized automatically on client file changes
npm run buildwatch

# or build production optimized
npm run build
```

## _Step 2_ **_Build and run the backend server_**

```sh
cd prototype

# install node_modules for server side
npm install

# build automatically on server file changes for development
npm run buildwatch

# or build for production
npm run build
```

## _Step 3_ **_Run the backend server_**

```sh
cd build
node main.js

# or use nodemon to automatically reload the server on file changes
nodemon main.js
```

Go to [http://localhost:8080/](http://localhost:8080/) and log in with the default account:

       email: admin@localhost.com
    password: admin

# HTTP REST API

To get started we recommend using the HTTP REST api at first. After you've logged into your account using the web interface you will find your api key and pregenerated HTTP Authorization headers at the bottom of the screen:

![webapi example](https://i.imgur.com/n86DoeL.png)



GET [http://localhost:8080/api/v3/version](http://localhost:8080/api/v3/version)

Returns the server version:

```json
{ "version": "5.0.30", "description": "prototype" }
```

---

GET [http://localhost:8080/api/v3/account](http://localhost:8080/api/v3/account)

Returns your account information:

```json
{
  "_id": "5bd359c27e6e3a36fc4dbfa4",
  "uuid": "v856q9myqoc0bozhyj835liy7ketfc9oqrimt2vm7buzdjyxn6tz9ds71lvtpi3smlzuq3urbyvi1r80ovwmj6ra37bh7yx2xhjw288ite658yv94zens9naflylo5tz",
  "created": { "unix": 1540577730242, "jsonTime": "2018-10-26T18:15:30.242Z" },
  "lastSeen": { "unix": 1540577730242, "jsonTime": "2018-10-26T18:15:30.242Z" },
  "ip": "",
  "ipLoc": null,
  "userAgent": "defaultAdmin",
  "emailverified": false,
  "email": "admin@localhost.com",
  "apikey": "mfradh6drivbykz7s4p3vlyeljb8666v",
  "level": 100,
  "settingsMenuTab": 3
}
```

---

POST [http://localhost:8080/api/v3/data/post](http://localhost:8080/api/v3/data/post)

You can post JSON formatted data to the api as a device.

```json
{
  "id": "yourDevice001",
  "data": {
    "temperature": 24.54,
    "doorOpen": false,
    "gps": {
      "lat": 25.123,
      "lon": 28.125
    }
  }
}
```

RESPONSE:

```json
{"result":"success"}
```

---

GET [http://localhost:8080/api/v3/states](http://localhost:8080/api/v3/states)

Returns your account's summarized device states.

```json
[
  {
    "id": "usb-Unknown_Arduino_M0_Pro_396E300A514D30324A4B2020FF0F311F-if00",
    "data": {
      "device": {
        "manufacturer": "Unknown",
        "serialNumber": "396E300A514D30324A4B2020FF0F311F",
        "pnpId": "usb-Unknown_Arduino_M0_Pro_396E300A514D30324A4B2020FF0F311F-if00",
        "locationId": null,
        "vendorId": "2a03",
        "productId": "804f",
        "comName": "/dev/ttyACM0"
      },
      "options": { "baudRate": 115200 },
      "raw": "{\"id\":\"flowMeter\",\"data\":{\"up\":59446000,\"flow\":0}}",
      "datajson": { "id": "flowMeter", "data": { "up": 59446000, "flow": 0 } },
      "err": "",
      "connected": true
    },
    "meta": { "method": "serialport" },
    "timestamp": "2018-10-27T13:45:32.765Z"
  },
  {
    "id": "flowMeter",
    "data": { "up": 59446000, "flow": 0 },
    "level": 1,
    "serial": {
      "device": {
        "manufacturer": "Unknown",
        "serialNumber": "396E300A514D30324A4B2020FF0F311F",
        "pnpId": "usb-Unknown_Arduino_M0_Pro_396E300A514D30324A4B2020FF0F311F-if00",
        "locationId": null,
        "vendorId": "2a03",
        "productId": "804f",
        "comName": "/dev/ttyACM0"
      },
      "options": { "baudRate": 115200 },
      "raw": "{\"id\":\"flowMeter\",\"data\":{\"up\":59446000,\"flow\":0}}",
      "datajson": { "id": "flowMeter", "data": { "up": 59446000, "flow": 0 } },
      "err": "",
      "connected": true
    },
    "meta": { "method": "serialport" },
    "flowtotal": 7462,
    "err": "",
    "timestamp": "2018-10-27T13:45:32.764Z",
    "totalup": 50422000
  }
]
```

GET [/api/v3/states/full](/api/v3/states/full)

Returns your account's full device states. Includes additional meta data as well as workflow processing code on each device.

```json
[
  {
    "_id": "5bd3739e915407a02b04ea81",
    "apikey": "mfradh6drivbykz7s4p3vlyeljb8666v",
    "devid": "usb-Unknown_Arduino_M0_Pro_396E300A514D30324A4B2020FF0F311F-if00",
    "payload": {
      "id": "usb-Unknown_Arduino_M0_Pro_396E300A514D30324A4B2020FF0F311F-if00",
      "data": {
        "device": {
          "manufacturer": "Unknown",
          "serialNumber": "396E300A514D30324A4B2020FF0F311F",
          "pnpId": "usb-Unknown_Arduino_M0_Pro_396E300A514D30324A4B2020FF0F311F-if00",
          "locationId": null,
          "vendorId": "2a03",
          "productId": "804f",
          "comName": "/dev/ttyACM0"
        },
        "options": { "baudRate": 115200 },
        "raw": "{\"id\":\"flowMeter\",\"data\":{\"up\":59623000,\"flow\":0}}",
        "datajson": {
          "id": "flowMeter",
          "data": { "up": 59623000, "flow": 0 }
        },
        "err": "",
        "connected": true
      },
      "meta": { "method": "serialport" },
      "timestamp": "2018-10-27T13:48:29.743Z"
    },
    "meta": {
      "user": {
        "email": "admin@localhost.com",
        "uuid": "v856q9myqoc0bozhyj835liy7ketfc9oqrimt2vm7buzdjyxn6tz9ds71lvtpi3smlzuq3urbyvi1r80ovwmj6ra37bh7yx2xhjw288ite658yv94zens9naflylo5tz"
      },
      "created": {
        "unix": 1540648109743,
        "jsonTime": "2018-10-27T13:48:29.743Z"
      },
      "ip": "",
      "ipLoc": {},
      "userAgent": null,
      "uuid": "otxbkytav97vonsllim4uajcpbvm51uxe4eh9t9nx505e2t296a47od8fv0mqam6hg0euv3gws8hmy8f73noikyz4qyl4crdajts4z7ke5usckh1uos69fgj9jnxjd1o",
      "method": "serialport"
    }
  },
  {
    "_id": "5bd37c71915407a02b062f23",
    "apikey": "mfradh6drivbykz7s4p3vlyeljb8666v",
    "devid": "flowMeter",
    "payload": {
      "id": "flowMeter",
      "data": { "up": 59623000, "flow": 0 },
      "level": 1,
      "serial": {
        "device": {
          "manufacturer": "Unknown",
          "serialNumber": "396E300A514D30324A4B2020FF0F311F",
          "pnpId": "usb-Unknown_Arduino_M0_Pro_396E300A514D30324A4B2020FF0F311F-if00",
          "locationId": null,
          "vendorId": "2a03",
          "productId": "804f",
          "comName": "/dev/ttyACM0"
        },
        "options": { "baudRate": 115200 },
        "raw": "{\"id\":\"flowMeter\",\"data\":{\"up\":59623000,\"flow\":0}}",
        "datajson": {
          "id": "flowMeter",
          "data": { "up": 59623000, "flow": 0 }
        },
        "err": "",
        "connected": true
      },
      "meta": { "method": "serialport" },
      "flowtotal": 7462,
      "err": "",
      "timestamp": "2018-10-27T13:48:29.748Z",
      "totalup": 50599000
    },
    "meta": {
      "user": {
        "email": "admin@localhost.com",
        "uuid": "v856q9myqoc0bozhyj835liy7ketfc9oqrimt2vm7buzdjyxn6tz9ds71lvtpi3smlzuq3urbyvi1r80ovwmj6ra37bh7yx2xhjw288ite658yv94zens9naflylo5tz"
      },
      "created": {
        "unix": 1540648109748,
        "jsonTime": "2018-10-27T13:48:29.748Z"
      },
      "ip": "",
      "ipLoc": {},
      "userAgent": "api",
      "uuid": "vgkhkkklbu7c8jkxhpy75jnhmchmx43z15hlfptu7zsjynzsy187l2mpoaennjdgei5afbroizjqycz7imhe7gmd2y9dmwv4d35du8uqztxb87ayqrkpoyo2fc9mlqht",
      "method": "serialport"
    },
    "workflowCode": "\ncountTotal(packet.data.flow, \"flowtotal\")\ncountTotal(1000,\"totalup\")\n\ncallback(packet); \n\n\nfunction countTotal(val, varname) {\n\n    if (state.payload[varname]) {\n        packet[varname] = state.payload[varname] + val;\n    }  else {\n        packet[varname] = val;\n    }\n\n}"
  }
]
```


# PLUGINS

## Plugin: Discord

Enables logging to discord when events occur on the server.

![discord](https://i.imgur.com/rPMvLfR.png)

![alt text](https://i.imgur.com/8UtpHRp.png)

Todo: Expose the discord bot in process scripts so the bot would be able to notify a chatroom when some event occurs.

---

## Plugin: Iot.nxt

Enables linking device state bidirectionally to the [Iot.nxt](https://www.iotnxt.com/) cloud.

![iotnxt gateway connected](https://i.imgur.com/9LoepRr.png)

---

## Plugin: Serialports

![serialport autodetect](https://i.imgur.com/bIEqUL6.png)

The serialports plugin enables autodetection of arduino or similar serialport devices. Also enables the serialports object in process scripts that enables listing of devices and writing to ports.

![serialport device](https://i.imgur.com/8n1spaY.png)

# Changelog

**26 Oct 2018 Fri at 19:41 SAST**  
Rouan van der Ende - Initial public release v5.0.30
