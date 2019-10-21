/**  Removes any non standard characters. */
export function cleanString(str: string) {
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


/** checks if the input string is a valid email address. */
export function validEmail(input: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}


export const passwordSettings = { minlength: 5 }

export const usernameSettings = { minlength: 4, maxlength: 15 }

export interface passwordValidation {
    valid: boolean
    capitals: boolean
    lowercase: boolean
    numbers: boolean
    symbols: boolean
    /** does the length match the passwordSettings minimum length? */
    length: boolean,
    /** if the password is free of spaces. true is good, false is bad */
    noSpace: boolean
}

export function validPassword(pw) {

    var valid = /[A-Z]/.test(pw) &&
        /[a-z]/.test(pw) &&
        /[0-9]/.test(pw) &&
        /[^A-Za-z0-9]/.test(pw) &&
        (pw.indexOf(" ") < 0) &&
        pw.length >= passwordSettings.minlength;

    return {
        valid,
        capitals: /[A-Z]/.test(pw),
        lowercase: /[a-z]/.test(pw),
        numbers: /[0-9]/.test(pw),
        symbols: /[^A-Za-z0-9]/.test(pw),
        noSpace: (pw.indexOf(" ") < 0),
        length: (pw.length >= passwordSettings.minlength)
    }

}


export function validUsername(username) {

    var test = {
        valid: false,
        capitals: /[A-Z]/.test(username),
        lowercase: /[a-z]/.test(username),
        numbers: /[0-9]/.test(username),
        symbols: /[^A-Za-z0-9]/.test(username),
        noSpace: (username.indexOf(" ") < 0),
        length: ((username.length >= usernameSettings.minlength) && (username.length <= usernameSettings.maxlength))
    }

    test.valid = ((!test.capitals) && (test.length) && (test.noSpace) && (!test.symbols));

    return test;
}



export function escapeNonUnicode(str: any) {
    return str.replace(/[^a-z0-9{}\"\[\]: \.,_-]/gim, "");
}