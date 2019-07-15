import React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const name = "Bosch TRACI";

export class AddDevice extends React.PureComponent {
    config = [{
        "id": "cd7a632c.b4017",
        "type": "lora in",
        "z": "d45ecedb.5b0ab",
        "name": "Bosch_Sensor",
        "datatype": "bytes",
        "x": 134,
        "y": 204,
        "wires": [
            [
                "c8055bb9.6f6228",
                "3b308c50.94e3a4"
            ]
        ]
    },
    {
        "id": "c8055bb9.6f6228",
        "type": "debug",
        "z": "d45ecedb.5b0ab",
        "name": "",
        "active": false,
        "console": "false",
        "complete": "payload",
        "x": 328,
        "y": 85,
        "wires": []
    },
    {
        "id": "3b308c50.94e3a4",
        "type": "function",
        "z": "d45ecedb.5b0ab",
        "name": "decoder",
        "func": "var UInt4 = function (value) {\n    return (value & 0xF);\n};\n\nvar Int4 = function (value) {\n    var ref = UInt4(value);\n    return (ref > 0x7) ? ref - 0x10 : ref;\n};\n\nvar UInt8 = function (value) {\n    return (value & 0xFF);\n};\n\nvar Int8 = function (value) {\n    var ref = UInt8(value);\n    return (ref > 0x7F) ? ref - 0x100 : ref;\n};\n\nvar UInt16 = function (value) {\n    return (value & 0xFFFF);\n};\n\nvar Int16 = function (value) {\n    var ref = UInt16(value);\n    return (ref > 0x7FFF) ? ref - 0x10000 : ref;\n};\n\nvar UInt32 = function (value) {\n    return (value & 0xFFFFFFFF);\n};\n\nvar Int32 = function (value) {\n    var ref = UInt32(value);\n    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;\n};\n\n\n    \n    var bytes = msg.payload;\n    var port = 1;\n    // Decode an uplink message from a buffer\n    // (array) of bytes to an object of fields.\n    var decoded = {};\n\n    if (port === 1) {\n        decoded.ProtocolVersion = bytes[0];\n        decoded.MessageType = bytes[1];\n        if (decoded.MessageType === 0x00) {\n            // Standard Message Type\n            decoded.BattState = (bytes[2] >> 4) & 0x07;\n            decoded.AccVector = (bytes[2] >> 1) & 0x07;\n            decoded.AccState = (bytes[2]) & 0x01;\n            decoded.GPSLongitude = Int32((bytes[6] << 24) | (bytes[5] << 16) | (bytes[4] << 8) | (bytes[3] << 0)) / 10000000;\n            decoded.GPSLatitude = Int32((bytes[10] << 24) | (bytes[9] << 16) | (bytes[8] << 8) | (bytes[7] << 0)) / 10000000;\n            decoded.GPSAltitude = Int16(bytes[12] << 8) | (bytes[11] << 0);\n            weekNumberTimeOfWeek = (bytes[16] << 24) | (bytes[15] << 16) | (bytes[14] << 8) | (bytes[13] << 0);\n            decoded.GPSWeekNumber = (weekNumberTimeOfWeek >> 20) & 0x3FF;\n            decoded.GPSTimeOfWeek = weekNumberTimeOfWeek & 0x000FFFFF;\n\n            var GPSDate = new Date(1980, 0, 1, 0, 0, 0, 0); // reference date 1. january 1980\n            var GPSWeekRollovers = 2;\n            // add weeknumber in days relative to 1st january 1980; add 6 because weeks started at 6th january 1980\n            GPSDate.setDate(6 + ((decoded.GPSWeekNumber + (GPSWeekRollovers * 1024)) * 7));\n            GPSDate.setSeconds(decoded.GPSTimeOfWeek); // add seconds to gps week\n            decoded.GPSTimestamp = GPSDate.toString();\n            decoded.GPSHorizontalAccuracy = ((bytes[18] << 8) | (bytes[17] << 0)) / 10;\n            decoded.GPSVerticalAccuracy = ((bytes[20] << 8) | (bytes[19] << 0)) / 10;\n            decoded.AccOperatingMinutes1 = (bytes[22] << 8) | (bytes[21] << 0);\n            decoded.AccOperatingMinutes2 = (bytes[24] << 8) | (bytes[23] << 0);\n            decoded.AccNumberShocks = bytes[25];\n            decoded.Temperature = Int8(bytes[26]) + 23;\n            decoded.MagneticFieldX = Int16((bytes[28] << 8) | (bytes[27] << 0)) / 16;\n            decoded.MagneticFieldY = Int16((bytes[30] << 8) | (bytes[29] << 0)) / 16;\n            decoded.MagneticFieldZ = Int16((bytes[32] << 8) | (bytes[31] << 0)) / 16;\n            decoded.BTNum = bytes[33];\n        }\n\n        if (decoded.MessageType === 0x01) {\n            // Alive message type\n            decoded.Temperature = Int8(bytes[2]) + 23;\n            decoded.BTNum = bytes[3];\n        }\n\n        if (decoded.MessageType === 0x02) {\n            // startup message type\n            decoded.SoftwareVersion = bytes.slice(2, 17);\n            decoded.BootblockVersion = bytes.slice(18, 33);\n            decoded.HardwareVersion = bytes.slice(34, 49);\n            decoded.RegionCode = bytes[50];\n        }\n\n        if (decoded.MessageType === 0x5F) {\n            // configurtaion acknowledged message type\n            decoded.ConfigurationMessageId = bytes[2];\n            decoded.ConfigurationState = bytes[3];\n        }\n\n        if (decoded.MessageType === 0x10) {\n            // bluetooth collection message type\n            var BluetoothBeacons = {};\n            for (var cnt = 0; cnt < 4; cnt++) {\n                MACAdress = bytes.slice((cnt * 7) + 2, (cnt * 7) + 8).map(function (byte) {\n                    return ('0' + (byte & 0xFF).toString(16)).slice(-2);\n                }).join(':');\n                BluetoothBeacons[MACAdress] = Int8(bytes[(cnt * 7) + 8]);\n            }\n            decoded.BluetoothBeacons = BluetoothBeacons;\n        }\n    }\n\n    var Tracker = {\n        \"payload\":{\n        \"id\": \"Bosch_Sensor\",\n        \"data\": decoded\n        }\n    };\n\n\n\n\nreturn Tracker\n;",
        "outputs": 1,
        "noerr": 0,
        "x": 325,
        "y": 542,
        "wires": [
            [
                "a2390625.6a7608",
                "686e37ce.6e5688"
            ]
        ]
    },
    {
        "id": "686e37ce.6e5688",
        "type": "mqtt out",
        "z": "d45ecedb.5b0ab",
        "name": "",
        "topic": "",
        "qos": "",
        "retain": "",
        "broker": "d4ddd3b3.f4313",
        "x": 587,
        "y": 430,
        "wires": []
    },
    {
        "id": "a2390625.6a7608",
        "type": "debug",
        "z": "d45ecedb.5b0ab",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "payload",
        "x": 628,
        "y": 540,
        "wires": []
    },
    {
        "id": "d4ddd3b3.f4313",
        "type": "mqtt-broker",
        "z": "",
        "broker": "prototype.dev.iotnxt.io",
        "port": "1883",
        "clientid": "",
        "usetls": false,
        "compatmode": false,
        "keepalive": "60",
        "cleansession": true,
        "willTopic": "",
        "willQos": "0",
        "willPayload": "",
        "birthTopic": "",
        "birthQos": "0",
        "birthPayload": ""
    }
    ]

    state = {
        value: JSON.stringify(this.config),
        copied: false
    }

    nodeRedConfig = () => {
        return (
            <div>
                {
                    this.state.copied
                        ? <span><i className="fas fa-check-circle" style={{ color: "green", opacity: 0.85, fontSize: "22px" }}></i> Copied</span>
                        : <CopyToClipboard text={this.state.value}
                            onCopy={() => this.setState({ copied: true })}>
                            <button className="btn" style={{ color: "white", borderRadius: 8, opacity: 0.8 }}><i className="fas fa-clipboard"></i> Copy to clipboard</button>
                        </CopyToClipboard>
                }
            </div>
        );
    }

    render() {
        return (
            <div style={{ background: "#16202C", paddingLeft: "20px", paddingBottom: "35px" }}>
                <br></br>
                <h5>Bosch Asset Tracking Tag</h5>
                The below config is to be uploaded to Node-Red on a MultiTech MultiConnect Conduit. Please ensure that your Gateway is set up according to your region and set-up correctly.
                <br /><br />
                If you're using a different Gateway, please contact your Gateway manufacturer for configuration.
                Node-Red config:

                <center >
                    <div align="center" className="" style={{ marginTop: 20, width: "50%", height: "43px", textAlign: "center" }}>
                        {this.nodeRedConfig()}
                    </div>
                </center>
            </div>
        )
    }
}