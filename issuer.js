var wallet = require('./wallet/keyPair');
var sendCert = require('./ethTxHandler').signSendTx;
var getCurrentGasPrices = require('./ethTxHandler').getCurrentGasPrices;
let pswd = "qwerty";
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
var toChecksumAddress = require('./wallet/eth-utils/utils').toChecksumAddress;
var { setIpfs, genCert } = require('./ipfsNodeHandler');

let candidatePubKey = "0x64c199d56a2b206831585a60db5a4463d75a8a26";
let link = 'http://localhost:5001';
let fileName = candidatePubKey;
let certificate = {
    "name": "As Ketchup",
    "job": "pokrmon Trainer",
    "exam": "BIG pokemon tournament with charizard",
    "percentile": "better than most",
    "to_certify_that": "he's a pokemon master now"
};

if(!candidatePubKey.match(/^0x/g)){
    fileName = "0x" + candidatePubKey;
}

if(!isChecksum(candidatePubKey)) {
    fileName = toChecksumAddress(candidatePubKey);
    console.log("checksum: ", candidatePubKey);
}

setIpfs(link);
genCert(fileName, certificate).then(async (results, err) => {
    if(results) {
        console.log(results);
        if(results[0]) {
            console.log("yes", fileName);
            let gasPrices = await getCurrentGasPrices();
            let txParams = {
                "from": toChecksumAddress("0x8742a5ae5aeff449fb7c90cba2017dafab427c87"),
                "to": fileName,
                "value": "0x00",
                "data": JSON.stringify(results[0]),
                "gasPrice": gasPrices.low * 1000000000,
                "gas": 100000
            };
            console.log(txParams);
            
            tx = sendCert(txParams, pvtKey);
            console.log("tx: ", tx);
            
        }
    }
});