//import { MeasurementManager } from './utils/MeasurementManager';
const fs = require('fs');
var coap = require('coap');
var server = coap.createServer();
export const name = "efento";
server.on('request', function (req: any, res: any) {
    let requestUrl = req.url.split('/')[1];
    if (requestUrl === 'm') {
        let payload = req.payload;
        //let message = proto.Measurements.deserializeBinary(payload);
        //MeasurementManager.logToConsoleDataOfSensor(message);
        res.statusCode = '2.01';
        res.end(''); // put here optional payload
        //console.log(res.payload)
    }
});

server.listen();

