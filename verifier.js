var { getReceipt, sha3 } = require('./ethTxHandler');
var { decrypt } = require('./encrypt');
var { getCert } = require('./ipfsNodeHandler');
var { sha3 } = require('./wallet/eth-utils/utils');
var fs = require('fs');

let passphrase = "long and hard and big and black and and..., and she started crying DAMN. Yeah steven she got raped by a black guy Again.";

let uniqueCode = "a random hash or a secret key";

let txHash = "0x1539a0fd1c2ffeb4e53a369644a0de9410b4d8ca2c94b7dac670f450a87d50c3";

let keyPair = JSON.parse(fs.readFileSync('./p.json'));

getReceipt(txHash).then(async (txInput) => {
    try {
        console.log("txInput: ", txInput);        
        let decrypted = await decrypt(txInput, keyPair.publicKey, keyPair.privateKey, passphrase);
        // console.log("decrypted: ", decrypted);
        return decrypted;
    } catch(err) {
        console.log("error: ", err);
        return new Error(err);
    }
}).then(async (decrypted) => {
    try {
        let data = await getCert(decrypted);
        return data;
    } catch(err) {
        return new Error(err);
    }
}).then(async (data) => {
    try {
        let verified = false;
        console.log("data: ", data);
        decryptedCert = JSON.parse(await decrypt(data, keyPair.publicKey, keyPair.privateKey, passphrase));
        if(decryptedCert['my_secret'] === sha3(uniqueCode)) {
            verified = true;
        }
        return { decryptedCert, verified };
    } catch(err) {
        console.log("error", err);
        return new Error(err);
    }
}).then(({ decryptedCert, verified }) => {
    if(verified)console.log("verified: ", decryptedCert); 
}).catch((err) => {
    throw err;
});