"use strict";
var randombytes = require("randombytes");
var sha3 = require("./sha3");

var toChecksumAddress = (address) => {
    if (typeof address === undefined)
        return "";
    if (!(/^(0x)?[0-9a-f]{40}$/i.test(address))) {
        throw new Error('Given address "' + address + '" is not a valid Ethereum address.');
    }
    address = address.toLowerCase().replace(/^0x/i, "");
    var addressHash = sha3.sha3(address).replace(/^0x/i, "");
    var checksumAddress = "0x";
    for (var i = 0; i < address.length; i++) {
        // If ith character is 9 to f then make it uppercase
        if (parseInt(addressHash[i], 16) > 7) {
            checksumAddress += address[i].toUpperCase();
        }
        else {
            checksumAddress += address[i];
        }
    }
    return checksumAddress;
}
var asciiToHex = (str) => {
    if (!str) {
        return "0x00";
    }
    var hex = "";
    for (var i in str) {
        var charCode = str[i].charCodeAt(0).toString(16);
        hex += charCode.length < 2 ? '0' + charCode : charCode;
    }
    return "0x" + hex;
}
var hexToAscii = (hex) => {
    var i;
    var str;
    if (!sha3.isHexStrict(hex)) {
        throw new Error('The parameter must be a valid HEX string.');
    }
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substring(i, 2), 16));
    }
}
var randomHex = (size) => {
    return '0x' + randombytes["default"](size).toString('hex');
}

module.exports = {
    toChecksumAddress,
    asciiToHex,
    hexToAscii,
    randomHex,
    isChecksum: sha3.isChecksum
};