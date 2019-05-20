const StringUtils = require('./utils/StringUtils.js');
const DateUtils = require('./utils/DateUtils.js');
const Measurements = require('../nbiot_pb.js');
module.exports = class MeasurementManager {
    static logToConsoleDataOfSensor(message) {
        let slotsList = message.getSlotsList();
        let serialNumber = StringUtils.toHexString(message.getSerialNum());
        let isBatteryOk = message.getBatteryStatus();
        let nextTransmissionDate = DateUtils.toDateWithTimeInString(message.getNextMeasure() * 1000);
        let measurementPeriodInSec = message.getMeasurementPeriod();
        let isSensorBinary = this.isSensorBinary(slotsList);

        console.log("Sensor serial number: " + serialNumber);
        console.log("Is battery ok?: " + isBatteryOk);
        console.log("Next transmission: " + nextTransmissionDate);
        console.log("Measurement period: " + measurementPeriodInSec + " s");
        console.log("Is sensor binary? " + isSensorBinary);
        slotsList.map(slot => {
            this.logMeasurements(slot, isSensorBinary, measurementPeriodInSec)
        });
    }

    static logMeasurements(slot, isSensorBinary, measurementPeriod) {
        let measurementTimestampInSec = slot.getTimestamp();
        let startingPoint = slot.getStartPoint();
        let measurementType = slot.getType();
        let offsets = slot.getSampleOffsetsList();
        offsets.map(offset => {
            if (offset !== -32768 && slot !== proto.Slot.SlotType.RELAY && slot !== proto.Slot.SlotType.NO_SENSOR) {
                let measurementDate = DateUtils.toDateWithTimeInString(measurementTimestampInSec * 1000);
                let value = this.mapMeasurementValue(measurementType, startingPoint, offset);
                console.log("Measurement date: " + measurementDate + "    measurement value: " + value);
                measurementTimestampInSec = isSensorBinary ? measurementTimestampInSec + (measurementPeriod * 14) : measurementTimestampInSec + measurementPeriod;
            } else if (slot === proto.Slot.SlotType.RELAY) {
                // TODO:
            }
        });
    }

    static mapMeasurementValue(measurementType, startingPoint, offset) {
        switch (measurementType) {
            case proto.Slot.SlotType.TEMPERATURE:
                return "" + (startingPoint + offset) / 10.0 + " C";
            case proto.Slot.SlotType.PRESSURE:
                return "" + (startingPoint + offset) / 10.0 + " hPa";
            case proto.Slot.SlotType.HUMIDITY:
                return "" + (startingPoint + offset) + " %";
            case proto.Slot.SlotType.DIFERENTIAL_PRESSURE:
                return "" + (startingPoint + offset) + " Pa";
            case proto.Slot.SlotType.RELAY:
            //        TODO:
        }
    }

    static isSensorBinary(slotsList) {
        slotsList.map(slot => {
            if (slot.getType() === proto.Slot.SlotType.RELAY) {
                return true
            }
        });

        return false;
    }
};
export default MeasurementManager;