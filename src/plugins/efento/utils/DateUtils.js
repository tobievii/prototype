const format = "en-GB";

module.exports = class DateUtils {

    static toDateInString(timestampInMs) {
        return new Date(timestampInMs).toLocaleDateString(format);
    }
    static toTimeInString(timestampInMs) {
        return new Date(timestampInMs).toLocaleTimeString(format);
    }

    static toDateWithTimeInString(timestampInMs) {
        return this.toDateInString(timestampInMs) + " " + this.toTimeInString(timestampInMs);
    }
}