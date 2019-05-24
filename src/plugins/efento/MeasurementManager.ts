import StringUtils from './StringUtils';
import DateUtils from './DateUtils';
import Measurements from './nbiot_pb.js';
var Sample_offsets: any[] = [];

export default class MeasurementManager {
    static logToConsoleDataOfSensor(message: any) {
        var slotsList = message.getSlotsList();
        var serialNumber = StringUtils.toHexString(message.getSerialNum());
        var isBatteryOk = message.getBatteryStatus();
        var nextTransmissionDate = DateUtils.toDateWithTimeInString(message.getNextMeasure() * 1000);
        var measurementPeriodInSec = message.getMeasurementPeriod();
        var isSensorBinary = this.isSensorBinary(slotsList);
        var CloudToken = message.getCloudToken();
        if (isBatteryOk == true) {
            isBatteryOk = "ok"
        }
        else if (isBatteryOk == false) {
            isBatteryOk = "low"
        }

        CloudToken = CloudToken.replace(new RegExp("-", 'g'), "");

        var payload = {
            SerialNumber: "Efento" + serialNumber,
            packet: {
                BatteryStatus: isBatteryOk,
                NextTransmission: nextTransmissionDate,
                MeasurementPeriodInMins: measurementPeriodInSec / 60,
                TakenMeasurements: Sample_offsets
            },
            Owner: CloudToken
        };
        slotsList.map((slot: any) => {
            this.logMeasurements(slot, isSensorBinary, measurementPeriodInSec)
        });
        return payload;
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
                let type = this.mapMeasurementType(measurementType)
                var temps = {
                    MeasurementDate: measurementDate,
                    measurement: value,
                    MeasureType: type
                }
                Sample_offsets.push(temps)
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
    static mapMeasurementType(measurementType: any) {
        switch (measurementType) {
            case proto.Slot.SlotType.TEMPERATURE:
                return "Temparature";
            case proto.Slot.SlotType.PRESSURE:
                return "Pressure";
            case proto.Slot.SlotType.HUMIDITY:
                return "Humidity";
            case proto.Slot.SlotType.DIFERENTIAL_PRESSURE:
                return "Diferential Pressure";
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