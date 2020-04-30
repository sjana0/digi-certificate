// const IPFS = require('nano-ipfs-store')
// const ipfs = IPFS.at("https://ipfs.infura.io:5001");

const openpgp = require('openpgp');
openpgp.initWorker({ path:'openpgp.worker.js' })

let generateKeys = async (username, email, passphrase) => {
    let options = {
        userIds: [{ username, email }],
        curve: "ed25519",
        passphrase
    };
    let keyPair = {
        privateKey: '',
        publicKey: ''
    };
    keys = await openpgp.generateKey(options);
    keyPair.privateKey = keys.privateKeyArmored;
    keyPair.publicKey = keys.publicKeyArmored;
    return keyPair;
};

let encrypt = async (message, publicKeyArmored, privateKeyArmored, passphrase) => {
    const privKeyObj = (await openpgp.key.readArmored(privateKeyArmored)).keys[0]
    await privKeyObj.decrypt(passphrase)
    let options = {
        message: openpgp.message.fromText(message),
        publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys,
    };
    let { data } = await openpgp.encrypt(options);
    console.log("data: ", data);
    
    return data;
};

let decrypt = async (encrypted, publicKey, privateKey, passphrase) => {
    try {
        let privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
        await privKeyObj.decrypt(passphrase);
        // console.log("privateKeyObj: ", privKeyObj);
        const options = {
            message: (await openpgp.message.readArmored(encrypted)),  
            privateKeys: [privKeyObj]
        }
        // console.log("gerererreeeeeee");
        let { data } = await openpgp.decrypt(options);

        return data;
    } catch(err) {
        throw err;
    }
};

module.exports = {
    generateKeys,
    encrypt,
    decrypt
};