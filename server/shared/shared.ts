// removes any non standard characters
export function cleanString(str: any) {
    return str.replace(/[^a-z0-9]/gim, "").toLowerCase();
}




/**
 * Finds nested data from an object
 * @param obj source data object
 * @param str dot notation nested data path
 * @returns nested data 
 */
export function objectByString(obj: any, str: string) {

    str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    str = str.replace(/^\./, '');           // strip a leading dot
    var a = str.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in obj) {
            obj = obj[k];
        } else {
            return;
        }
    }
    return obj;
}