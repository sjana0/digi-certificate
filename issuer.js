var wallet = require('./wallet/keyPair');
var sendCert = require('./ethTxHandler').signSendTx;
var getCurrentGasPrices = require('./ethTxHandler').getCurrentGasPrices;
let pswd = "qwerty";
var secure = require('./encrypt');
var fs = require('fs');
// console.log(wallet.genPair(pswd));

let pvtKey = wallet.extracPrivateKey('0x' + '8742a5ae5aeff449fb7c90cba2017dafab427c87', '.', pswd);
console.log(pvtKey);

// wallet.listKeys('.', (err, keyList) => {
//     if(err) {
//         console.log("err: ", err);
//     } else if(keyList) {
//         console.log("arr: ", keyList);
//     }
// });



var isChecksum = require('./wallet/eth-utils/utils').isChecksum;
var { toChecksumAddress, sha3 } = require('./wallet/eth-utils/utils');
var { genCert } = require('./ipfsNodeHandler');

let candidatePubKey = "0x64c199d56a2b206831585a60db5a4463d75a8a26";
let fileName = candidatePubKey;
let certificate = {
    "name": "As Ketchup",
    "job": "pokrmon Trainer",
    "exam": "BIG pokemon tournament with charizard",
    "percentile": "better than most",
    "to_certify_that": "he's a pokemon master now",
    "my_secret": ""
};

if(!candidatePubKey.match(/^0x/g)){
    fileName = "0x" + candidatePubKey;
}

if(!isChecksum(candidatePubKey)) {
    fileName = toChecksumAddress(candidatePubKey);
    console.log("checksum: ", candidatePubKey);
}

let passphrase = "long and hard and big and black and and..., and blah started crying DAMN. Yeah steven blah has got it by hat's off Again.";

let uniqeCode = "a random hash or a secret key";

let pgpKeys = {
    privateKey: '',
    publicKey: ''
};

secure.generateKeys("myName", "myEmail@I.com", passphrase)
.then(async (keyPair) => {
    try {
        certificate['my_secret'] = sha3(uniqeCode);
        pgpKeys.privateKey = keyPair.privateKey;
        pgpKeys.publicKey = keyPair.publicKey;
        fs.writeFileSync('./p.json', JSON.stringify(pgpKeys));
        let encryptedData = await secure.encrypt(JSON.stringify(certificate), keyPair.publicKey, keyPair.privateKey, passphrase);
        return encryptedData;
    } catch(err) {
        return new Error(err);
    }
})
.then(async data => {
    try {
        let fileLogs = await genCert(fileName, data);
        console.log("fileLog: ");
        console.log(fileLogs[0]);
        if(fileLogs[0]) return fileLogs[0];
        else return undefined;
    } catch(err) {
        return new Error(err);
    }
})
.then(async fileLog => {
    try {
        if(fileLog) {
            console.log("keyPair: ", pgpKeys);
            console.log("fileLog: ", fileLog.cid.toString());
            console.log("yes", fileName);
            let gasPrices = await getCurrentGasPrices();
            let txParams = {
                "from": toChecksumAddress("0x8742a5ae5aeff449fb7c90cba2017dafab427c87"),
                "to": fileName,
                "value": "0x00",
                "data": await secure.encrypt(fileLog.cid.toString(), pgpKeys.publicKey, pgpKeys.privateKey, passphrase),
                "gasPrice": gasPrices.low * 1000000000,
                "gas": 100000
            };
            console.log(txParams);
            
            tx = await sendCert(txParams, pvtKey);
            console.log("txxxxxxxxxxxxxxxxx: ", tx);
        }
    } catch(err) {
        console.log("error: ", err);
        return new Error(err);
    };
});
