//var inp = 'FgMBANMBAADPAwGQ1ZhgFf3nU+ofbHj5LMjHuEtPfTGi2fREOu/00rPtvwAATsAUwAoAOQA4'


var inp = `FgMBANMBAADPAwGQ1ZhdkVMbIa2OIbJPXaqf7MGcD4SWsgYt4aBmWVr06gAATsAUwAoAOQA4
wA/ABQA1wBLACAAWABPADcADAArAE8AJADMAMgCaAJnADsAEAC8AlsARwAfADMACAAUABAAV
ABIACQAUABEACAAGAAMA/wEAAFgAAAAQAA4AAAsxOTIuMTY4LjQuMQALAAQDAAECAAoANAAy
AAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAIwAA`;

var tcp_decode = Buffer.from(inp, "base64");

console.log(tcp_decode.length);





function bufferToHex(buf) {
  var bufchar = ""
  for (var d = 0; d < tcp_decode.length; d++) {
    var hex = tcp_decode[d].toString(16)
    if (hex.length == 1) { hex = "0" + hex }

    hex += " "

    if (d % 16 == 15) {
      hex += "\n"
    }
    bufchar += hex;
  }
  return bufchar;
}


console.log(bufferToHex(tcp_decode));



//console.log(tcp_decode.toString("hex"))