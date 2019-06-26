var UInt4 = function (value) {
    return (value & 0xF);
};

var Int4 = function (value) {
    var ref = UInt4(value);
    return (ref > 0x7) ? ref - 0x10 : ref;
};

var UInt8 = function (value) {
    return (value & 0xFF);
};

var Int8 = function (value) {
    var ref = UInt8(value);
    return (ref > 0x7F) ? ref - 0x100 : ref;
};

var UInt16 = function (value) {
    return (value & 0xFFFF);
};

var Int16 = function (value) {
    var ref = UInt16(value);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
};

var UInt32 = function (value) {
    return (value & 0xFFFFFFFF);
};

var Int32 = function (value) {
    var ref = UInt32(value);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
};

function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    var decoded = {};

    if (port === 1) {
        decoded.ProtocolVersion = bytes[0];
        decoded.MessageType = bytes[1];
        if (decoded.MessageType === 0x00) {
            // Standard Message Type
            decoded.BattState = (bytes[2] >> 4) & 0x07;
            decoded.AccVector = (bytes[2] >> 1) & 0x07;
            decoded.AccState = (bytes[2]) & 0x01;
            decoded.GPSLongitude = Int32((bytes[6] << 24) | (bytes[5] << 16) | (bytes[4] << 8) | (bytes[3] << 0)) / 10000000;
            decoded.GPSLatitude = Int32((bytes[10] << 24) | (bytes[9] << 16) | (bytes[8] << 8) | (bytes[7] << 0)) / 10000000;
            decoded.GPSAltitude = Int16(bytes[12] << 8) | (bytes[11] << 0);
            weekNumberTimeOfWeek = (bytes[16] << 24) | (bytes[15] << 16) | (bytes[14] << 8) | (bytes[13] << 0);
            decoded.GPSWeekNumber = (weekNumberTimeOfWeek >> 20) & 0x3FF;
            decoded.GPSTimeOfWeek = weekNumberTimeOfWeek & 0x000FFFFF;

            var GPSDate = new Date(1980, 0, 1, 0, 0, 0, 0); // reference date 1. january 1980
            var GPSWeekRollovers = 2;
            // add weeknumber in days relative to 1st january 1980; add 6 because weeks started at 6th january 1980
            GPSDate.setDate(6 + ((decoded.GPSWeekNumber + (GPSWeekRollovers * 1024)) * 7));
            GPSDate.setSeconds(decoded.GPSTimeOfWeek); // add seconds to gps week
            decoded.GPSTimestamp = GPSDate.toString();
            decoded.GPSHorizontalAccuracy = ((bytes[18] << 8) | (bytes[17] << 0)) / 10;
            decoded.GPSVerticalAccuracy = ((bytes[20] << 8) | (bytes[19] << 0)) / 10;
            decoded.AccOperatingMinutes1 = (bytes[22] << 8) | (bytes[21] << 0);
            decoded.AccOperatingMinutes2 = (bytes[24] << 8) | (bytes[23] << 0);
            decoded.AccNumberShocks = bytes[25];
            decoded.Temperature = Int8(bytes[26]) + 23;
            decoded.MagneticFieldX = Int16((bytes[28] << 8) | (bytes[27] << 0)) / 16;
            decoded.MagneticFieldY = Int16((bytes[30] << 8) | (bytes[29] << 0)) / 16;
            decoded.MagneticFieldZ = Int16((bytes[32] << 8) | (bytes[31] << 0)) / 16;
            decoded.BTNum = bytes[33];
        }
        if (decoded.MessageType === 0x01) {
            // Alive message type
            decoded.Temperature = Int8(bytes[2]) + 23;
            decoded.BTNum = bytes[3];
        }

        if (decoded.MessageType === 0x02) {
            // startup message type
            decoded.SoftwareVersion = bytes.slice(2, 17);
            decoded.BootblockVersion = bytes.slice(18, 33);
            decoded.HardwareVersion = bytes.slice(34, 49);
            decoded.RegionCode = bytes[50];
        }

        if (decoded.MessageType === 0x5F) {
            // configurtaion acknowledged message type
            decoded.ConfigurationMessageId = bytes[2];
            decoded.ConfigurationState = bytes[3];
        }

        if (decoded.MessageType === 0x10) {
            // bluetooth collection message type
            var BluetoothBeacons = {};
            for (var cnt = 0; cnt < 4; cnt++) {
                MACAdress = bytes.slice((cnt * 7) + 2, (cnt * 7) + 8).map(function (byte) {
                    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
                }).join(':');
                BluetoothBeacons[MACAdress] = Int8(bytes[(cnt * 7) + 8]);
            }
            decoded.BluetoothBeacons = BluetoothBeacons;
        }
    }

    var Tracker = {
        "id": "Bosch_Sensor",
        "data": decoded
    };


    return Tracker;
}