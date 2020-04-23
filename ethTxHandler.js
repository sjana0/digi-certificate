var Web3 = require('web3');
var axios = require('axios');
var web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/<your project id>'));

async function getCurrentGasPrices() {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    };
    return prices;
}

let signSendTx = (txParams, privateKey) => {
    console.log("here1");
    web3.eth.getTransactionCount(txParams.from, 'pending').then((nonce) => {
        txParams.nonce = nonce;
    }).catch(e => {
        return e;
    });
    console.log("txParams: ", txParams);
    console.log("nonce: ");
    console.log(txParams.nonce);
    // txParams.gasPrice = web3.eth.gasPrice;
    txParams.data = web3.utils.toHex(txParams.data)
    console.log("here2");
    console.log(txParams);
    web3.eth.estimateGas({ to: txParams.to, data: txParams.data }).then((gasEst) => {
        txParams.gas = gasEst;
    }).catch((err) => {
        console.log(err);
        throw err;
    });
    web3.eth.accounts.signTransaction(txParams, privateKey).then((signedTx) => {
        console.log("here3");
        console.log(signedTx.rawTransaction);
        const rawTx = (signedTx.rawTransaction || signedTx.raw);
        console.log("rawTx: ");
        console.log(rawTx);
        web3.eth.sendSignedTransaction(rawTx).then((tx) => {
            console.log("tx: ", web3.utils.toHex(tx));
            return web3.utils.toHex(tx);
        });
    }).catch((err) => {
        console.log(err);        
        return err;
    });
}

let getReceipt = (txHash) => {
    web3.eth.getTransactionReceipt(txHash).then((txReceipt) => {
        console.log("txReceipt: ");
        console.log(txReceipt);
    });
}

// let sign = (data, address) => {
//     web3.eth.personal.accounts
// }

module.exports = {
    signSendTx,
    getCurrentGasPrices
};