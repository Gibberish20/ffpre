const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const treeJson = require('./tree.json')
// (1)
var address = '0x1111111111111111111111111111111111111111'
function ver(address) {
    const tree = StandardMerkleTree.load(treeJson);

    // (2)
    for (const [i, v] of tree.entries()) {
        if (v[0] === address) {
            // (3)
            var proof = tree.getProof(i);
            var v1 = tree.verify(i, proof);
            console.log('Value:', v);
            console.log('Proof:', proof);
            console.log('Verified:', v1);
            if (v1 == true) {
                return v1, proof;
            }
            else {
                proof = null
                return v1, proof;
            }
        }
    }
}
module.exports = ver;