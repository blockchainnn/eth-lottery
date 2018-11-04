const path = require('path');
const fs = require('fs');
const solc = require('solc');

// Get path to solidity contract (cannot 'require' as it's .sol not .js)
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

// Read in the raw source code from the .sol file
const source = fs.readFileSync(lotteryPath, 'utf8');

// View the output of the compiled .sol file
console.log(solc.compile(source, 1));

module.exports = solc.compile(source, 1).contracts[':Lottery'];