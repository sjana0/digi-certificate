var Web3 = require('web3');
var axios = require('axios');
var web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/0104fc70dc744b10bcbb51ae406d21ca'));

async function getCurrentGasPrices() {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    };
    return prices;
}

let signSendTx = async (txParams, privateKey) => {
    console.log("here1");
    txParams.nonce = web3.utils.toHex(await web3.eth.getTransactionCount(txParams.from, 'pending'));
    console.log("txParams: ", txParams);
    console.log("nonce: ");
    console.log(txParams.nonce);
    // txParams.gasPrice = web3.eth.gasPrice;
    txParams.data = web3.utils.toHex(txParams.data)
    console.log("here2");
    console.log(txParams);
    txParams.gas = (await web3.eth.estimateGas({ to: txParams.to, data: txParams.data })) * 5;
    console.log("gas: ", txParams.gas);
    let transaction = {
        transactionHash: ''
    };
    
    web3.eth.accounts.signTransaction(txParams, privateKey)
    .then(async (signedTx) => {
        const rawTx = (signedTx.rawTransaction || signedTx.raw);
        console.log("rawTx: ", rawTx);
        let tx = await web3.eth.sendSignedTransaction(rawTx);
        return tx;
    })
    .then((tx) => {
        console.log("tx: ", tx);
        transaction.transactionHash = tx.transactionHash;
    })
    .catch((err) => {
        console.log(err);        
        return err;
    });
    return transaction.transactionHash;
}

let getReceipt = async (txHash) => {
    try {
        let transaction = (await web3.eth.getTransaction(txHash));
        let inp = web3.utils.hexToUtf8(transaction.input);
        return inp;
    } catch(err) {
        return new Error(err);
    }
}

module.exports = {
    signSendTx,
    getCurrentGasPrices,
    getReceipt
};