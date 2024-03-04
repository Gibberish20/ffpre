const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");

// (1)
const values = [
  ["0x1111111111111111111111111111111111111111"],
  ["0x2222222222222222222222222222222222222222"]
];

// (2)
const tree = StandardMerkleTree.of(values, ["address"]);

// (3)
console.log('Merkle Root:', tree.root);

// (4)
fs.writeFileSync("./utils/m1/tree.json", JSON.stringify(tree.dump()));