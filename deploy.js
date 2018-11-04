const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'mobile observe chair brush anger target idle chef glow exclude rabbit cave',
    'https://rinkeby.infura.io/v3/53ae9a6ca7be4ee2a0d61b59a6ebd2d6'
);

// Instantiate new instance of Web3 class
const web3 = new Web3(provider);

// Create arbitrary function in order to be able to use async/await
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account: ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x' + bytecode })
        .send({ from: accounts[0] });

    console.log('Contract deployed to:', result.options.address);
};
deploy();