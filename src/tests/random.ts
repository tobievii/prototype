// https://catonmat.net/generate-random-json-data-structures

export function generateRandomJsonDepth(maxdepth: number) {
  return generateRandomObject(maxdepth, 0);
}

export function generateRandomJson(max: number, current: number) {
  if (max == current) { return 0 };

  var choices: string[] = ["number", "string", "boolean", "array", "object"];
  var choice = chooseOne(choices);

  if (choice == "number") {
    return generateRandomNumber();
  }

  if (choice == "string") {
    return generateRandomString();
  }

  if (choice == "boolean") {
    return generateRandomBoolean();
  }

  if (choice == "array") {
    return generateRandomArray(max, current + 1);
  }

  if (choice == "object") {
    return generateRandomObject(max, current + 1);
  }
}

function chooseOne(choices: any) {
  return choices[Math.floor(Math.random() * choices.length)];
}


function generateRandomNumber() {
  var maxNum = 2 ** 4;
  var number = Math.floor(Math.random() * maxNum);
  var isInteger = chooseOne([true, false]);
  var isNegative = chooseOne([true, false]);

  if (isInteger) number = number;
  if (isNegative) number = -number;

  return number;
}

function generateRandomString() {
  var alphabet = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

  var maxLength = 100;
  var length = Math.random() * maxLength;
  var string = "";
  for (var i = 0; i < length; i++) {
    string += chooseOne(alphabet);
  }

  return string;
}

function generateRandomBoolean() {
  return chooseOne([true, false]);
}

function generateRandomArray(max: number, current: number) {
  var maxArrayLength = 10;
  var length = Math.floor(Math.random() * maxArrayLength);

  var array: any = [];
  for (var i = 0; i < length; i++) {
    array[i] = generateRandomJson(max, current + 1);
  }

  return array;
}


function generateRandomObject(max: number, current: number) {
  if (max == current) { return {} }

  var maxObjectKeys = 10;
  var keyCount = Math.floor(Math.random() * maxObjectKeys);

  if (keyCount == 0) { return {} }

  var object: any = {};
  for (var i = 0; i < keyCount; i++) {
    var key = generateRandomKeyName();
    object[key] = generateRandomJson(max, current + 1);
  }


  return object;
}

function generateRandomKeyName() {
  var maxKeyLength = 10;
  var keyLength = 1 + Math.floor(Math.random() * maxKeyLength);
  var randomString = generateRandomString();
  return randomString.substr(0, keyLength)
}