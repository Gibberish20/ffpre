const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const csv = require("csv-parser");

const values1 = [];
const values2 = [];
const values3 = [];

fs.createReadStream("./utils/merkle/airdrop.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row.address && row.value) values1.push([row.address, row.value])
  })
  .on("end", () => {
    const tree = StandardMerkleTree.of(values1, ["address", "uint256"]);
    fs.writeFileSync("./utils/merkle/airdrop.json", JSON.stringify(tree.dump()));
    console.log('Airdrop Merkle root:', tree.root.toString())
  })

  fs.createReadStream("./utils/merkle/wl.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row.address) values2.push([row.address])
  })
  .on("end", () => {
    const tree = StandardMerkleTree.of(values2, ["address"]);
    fs.writeFileSync("./utils/merkle/wl.json", JSON.stringify(tree.dump()));
    console.log('Wl Merkle root:', tree.root.toString())
  })

  fs.createReadStream("./utils/merkle/air.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row.address) values3.push([row.address])
  })
  .on("end", () => {
    const tree = StandardMerkleTree.of(values3, ["address"]);
    fs.writeFileSync("./utils/merkle/air.json", JSON.stringify(tree.dump()));
    console.log('air_no_val merkle root:', tree.root.toString())
  })
