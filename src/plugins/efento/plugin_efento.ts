import MeasurementManager from "./MeasurementManager";
var Measurements = require('./nbiot_pb');
var coap = require('coap');
export const server = coap.createServer();
export const name = "efento";

server.on('request', function (req: any, res: any) {
    let requestUrl = req.url.split('/')[1];
    if (requestUrl === 'm') {
        let payload = req.payload;
        var message = proto.Measurements.deserializeBinary(payload);
        MeasurementManager.logToConsoleDataOfSensor(message);
        res.statusCode = '2.01';
        res.end(''); // put here optional payload
    }
});

server.listen();
