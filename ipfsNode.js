class certIpfsMethods {
    constructor(link) {
        this.ipfsHttpClient = require('ipfs-http-client');
        this.ipfs = this.ipfsHttpClient(link);
    }

    genCert = async (userPubKey, cert) => {
        const results = [];
        const fileObj = [{
            path: userPubKey + ".cert",
            content: JSON.stringify(cert)
        }];
        for await (const result of this.ipfs.add(fileObj)){
            console.log("result");
            results.push(result);
        }
        return results;
    }
    
    getCert = async (cid) => {
        for await (const file of this.ipfs.get(cid)) {
            const BufferList = require('bl/BufferList');
            const content = new BufferList()
            for await (const chunk of file.content) {
              content.append(chunk)
            }
            return JSON.parse(content.toString());
        }
    }
}

module.exports = {
    digiCert: certIpfsMethods
};