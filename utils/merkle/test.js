const ethers = require("ethers");
const verifyWl = require("./verifyWl");
var res = verifyWl('0x887181E185b5A9b34b9B445A33ac15E2843F454e')

console.log('wlVerify', res.verified, res.proof);


