const format = "en-GB";

export default class DateUtils {

    static toDateInString(timestampInMs: any) {
        return new Date(timestampInMs).toLocaleDateString(format);
    }
    static toTimeInString(timestampInMs: any) {
        return new Date(timestampInMs).toLocaleTimeString(format);
    }

    static toDateWithTimeInString(timestampInMs: any) {
        return this.toDateInString(timestampInMs) + " " + this.toTimeInString(timestampInMs);
    }
}