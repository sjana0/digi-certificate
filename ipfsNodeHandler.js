let ipfsHttpClient = require('ipfs-http-client');
let ipfs = ipfsHttpClient('http://localhost:5001');

let genCert = async (candidatePubKey, cert) => {
    try {
        let results = [];
        if(ipfs) {
            const fileObj = [{
                path: "certificates/" + candidatePubKey + ".cert",
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
    } catch(err) {
        return new Error(err);
    }
};

let getCert = async (cid) => {
    try {
        for await (const file of ipfs.get(cid)) {
            const BufferList = require('bl/BufferList');
            const content = new BufferList();
            for await (const chunk of file.content) {
                content.append(chunk)
            }
            return JSON.parse(content.toString());
        }
    } catch(err) {
        return new Error(err);
    }
};

module.exports = {
    genCert,
    getCert
};