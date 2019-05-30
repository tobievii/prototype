import MeasurementManager from "./MeasurementManager";
import * as events from "events";
var Measurements, proto = require('./nbiot_pb');
var coap = require('coap');
export const server = coap.createServer();
export const name = "efento";

export function init(app: any, db: any, eventHub: events.EventEmitter) {
    server.on('request', function (req: any, res: any) {
        let requestUrl = req.url.split('/')[1];
        if (requestUrl === 'm') {
            let payload = req.payload;
            var message = proto.Measurements.deserializeBinary(payload);
            var devicepacket = MeasurementManager.logToConsoleDataOfSensor(message);

            if (devicepacket.Owner && devicepacket.Owner.length == 32) {
                eventHub.emit("device",
                    {
                        apikey: devicepacket.Owner,
                        packet: {
                            id: devicepacket.SerialNumber,
                            data: devicepacket.packet,
                            meta: { method: "efento" }
                        }
                    }
                )
            }
            res.statusCode = '2.01';
            res.end(''); // put here optional payload
        }
    });
}
server.listen();

