var keythereum = require('keythereum');
var fs = require('fs');
var { toChecksumAddress } = require('./eth-utils/utils');

var genPair = (pswd) => {
    const params = { keyBytes: 32, ivBytes: 16 };
    const bareKey = keythereum.create(params);
    const options = {
        kdf: "scrypt",
        cipher: "aes-128-ctr"
    };
    var keyObject = keythereum.dump(pswd, bareKey.privateKey, bareKey.salt, bareKey.iv, options);
    if(!fs.existsSync("./keystore")) {
        fs.mkdirSync("./keystore");
    }
    keythereum.exportToFile(keyObject, './keystore');
    return { pubKey: keyObject.address, checksumAddress: toChecksumAddress(keyObject.address) };
};

var listKeys = () => {
    fs.readdir("./keystore", (err, files) => {
        if (files) {
            files.map(file => {
                let arr = file.split('--')
                return { pubAddress: ('0x' + arr[arr.length - 1]), checksumAddress: toChecksumAddress(('0x' + arr[arr.length - 1])) };
            });
        }
    });
};

var extracPrivateKey = (address) => {
    const keyObject = keythereum.importFromFile(address, "./keystore");
    const privateKey = keythereum.recover(pswd, keyObject);
    return privateKey;
};

module.exports = {
    genPair,
    listKeys,
    extracPrivateKey,
    toChecksumAddress
};