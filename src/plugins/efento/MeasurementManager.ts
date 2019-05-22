import StringUtils from './StringUtils';
import DateUtils from './DateUtils';
import Measurements from './nbiot_pb.js';

export default class MeasurementManager {
    static logToConsoleDataOfSensor(message: any) {
        let slotsList = message.getSlotsList();
        let serialNumber = StringUtils.toHexString(message.getSerialNum());
        let isBatteryOk = message.getBatteryStatus();
        let nextTransmissionDate = DateUtils.toDateWithTimeInString(message.getNextMeasure() * 1000);
        let measurementPeriodInSec = message.getMeasurementPeriod();
        let isSensorBinary = this.isSensorBinary(slotsList);
        let CloudToken = message.getCloudToken();


        console.log("Sensor serial number: " + serialNumber);
        console.log("Is battery ok?: " + isBatteryOk);
        console.log("Next transmission: " + nextTransmissionDate);
        console.log("Measurement period: " + measurementPeriodInSec / 60 + " m");
        console.log("Cloud Token: " + CloudToken);
        // console.log("Is sensor binary? " + isSensorBinary);

        slotsList.map((slot: any) => {
            this.logMeasurements(slot, isSensorBinary, measurementPeriodInSec)
        });

    }

    static logMeasurements(slot: any, isSensorBinary: any, measurementPeriod: any) {
        let measurementTimestampInSec = slot.getTimestamp();
        let startingPoint = slot.getStartPoint();
        let measurementType = slot.getType();
        let offsets = slot.getSampleOffsetsList();
        offsets.map((offset: any) => {
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

    static mapMeasurementValue(measurementType: any, startingPoint: any, offset: any) {
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

    static isSensorBinary(slotsList: any) {
        slotsList.map((slot: any) => {
            if (slot.getType() === proto.Slot.SlotType.RELAY) {
                return true
            }
        });

        return false;
    }
};