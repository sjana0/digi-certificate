var keythereum = require('keythereum');
var fs = require('fs');
var { toChecksumAddress } = require('./eth-utils/utils');

var genPair = (pswd, path = __dirname) => {
    const params = { keyBytes: 32, ivBytes: 16 };
    const bareKey = keythereum.create(params);
    const options = {
        kdf: "scrypt",
        cipher: "aes-128-ctr"
    };
    var keyObject = keythereum.dump(pswd, bareKey.privateKey, bareKey.salt, bareKey.iv, options);
    if(!fs.existsSync(path + "/keystore")) {
        fs.mkdirSync(path + "/keystore");
    }
    keythereum.exportToFile(keyObject, path + '/keystore');
    return { pubKey: keyObject.address, checksumAddress: toChecksumAddress(keyObject.address) };
};

var listKeys = (path, listCb) => {
    let keystorePath = path + "/keystore";
    if(fs.existsSync(keystorePath)) {
        fs.readdir(keystorePath, (err, files) => {
            if(err) {
                listCb(new Error(err), undefined);
            } else if (files) {
                const localAddresses = [];
                files.map(file => {
                    let arr = file.split('--')
                    localAddresses.push({ pubAddress: ('0x' + arr[arr.length - 1]), checksumAddress: toChecksumAddress((arr[arr.length - 1])) });
                });
                listCb(undefined, localAddresses);
            }
        });
    }
};

var extracPrivateKey = (address, path, pswd) => {
    const keyObject = keythereum.importFromFile(address, path);
    const privateKey = keythereum.recover(pswd, keyObject);
    return privateKey.toString('hex');
};

module.exports = {
    genPair,
    listKeys,
    extracPrivateKey,
};