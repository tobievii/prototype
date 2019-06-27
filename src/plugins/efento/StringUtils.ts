export default class StringUtils {
    static toHexString(byteArray: any) {
        return Array.from(byteArray, function (byte: any) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('').toLocaleUpperCase()
    }
};