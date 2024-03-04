const { StandardMerkleTree } = require('@openzeppelin/merkle-tree');
const fs = require('fs');

//load tree from json
const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync('./utils/merkle/airdrop.json', 'utf8')));

function verifyAirdrop(address) {
    for (const [i, v] of tree.entries()) {
        if (v[0] === address) {
            var verified = false;
            var proof;
            var value;
            try {
                proof = tree.getProof(i);
                verified = tree.verify(i, proof);
                value = v[1]
            } catch(err) {
                console.error('error:', err.message);
            }
            return {
                verified, proof, value
            };
        }
    }
    return {verified: false, proof: null, value: null};
}

module.exports = verifyAirdrop;