const { StandardMerkleTree } = require('@openzeppelin/merkle-tree');
const wlJson = require('./wl.json');
const web3 = require('web3');
//load tree from json
const tree = StandardMerkleTree.load(wlJson);

function verifyWl(address) {
    for (const [i, v] of tree.entries()) {
        if (v[0] === address) {
            var verified = false;
            var proof;
            
            try {
                proof = tree.getProof(i);
                
                verified = tree.verify(i, proof);
                
                
            } catch (err) {
                console.error('error:', err.message);
            }
            return {
                verified,
                proof,
                
            };
        }
    }
    return { verified: false, proof: []};
}

module.exports = verifyWl;