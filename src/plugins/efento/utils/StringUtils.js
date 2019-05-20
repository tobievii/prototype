module.exports = class StringUtils {
    static toHexString(byteArray) {
        return Array.from(byteArray, function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('').toLocaleUpperCase()
    }
};