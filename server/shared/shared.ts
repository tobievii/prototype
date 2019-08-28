// removes any non standard characters
export function cleanString(str:any) {
    return str.replace(/[^a-z0-9]/gim,"").toLowerCase();
}