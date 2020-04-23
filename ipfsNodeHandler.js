let ipfsHttpClient = require('ipfs-http-client');
let ipfs;

var setIpfs = (link) => {
    ipfs = ipfsHttpClient(link)
};

let genCert = async (userPubKey, cert) => {
    let results = [];
    if(ipfs) {
        const fileObj = [{
            path: "certificates/" + userPubKey + ".cert",
            content: JSON.stringify(cert)
        }];
        for await (const result of ipfs.add(fileObj)){
            console.log("result");
            results.push(result);
        }
    } else {
        results = new Error("set HttpProvider for ipfs first");
    }
    return results;
};

let getCert = async (cid) => {
    for await (const file of this.ipfs.get(cid)) {
        const BufferList = require('bl/BufferList');
        const content = new BufferList()
        for await (const chunk of file.content) {
            content.append(chunk)
        }
        return JSON.parse(content.toString());
    }
};

module.exports = {
    setIpfs,
    genCert,
    getCert
};