const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'});

    lottery.setProvider(provider);

});

describe('Lottery Contract', () => {
    it('should deploy a contract', () => {
        assert.ok(lottery.options.address);
    });
    it('should allow one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.01', 'ether')
        });

        const entrants = await lottery.methods.getEntrants().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], entrants[0]);
        assert.strictEqual(1, entrants.length);
    });

    it('should allow multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.01', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.01', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.01', 'ether')
        });

        const entrants = await lottery.methods.getEntrants().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], entrants[0]);
        assert.strictEqual(accounts[1], entrants[1]);
        assert.strictEqual(accounts[2], entrants[2]);
        assert.strictEqual(3, entrants.length);

    });

    it('should require a minimum amount of ether', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false)
        } catch (err) {
            assert(err);
        }
    });

    it('should only allow manager to pick a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false)
        } catch (err) {
            assert(err)
        }
    });

    it('should send money to the winner and reset the entrants array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        });

        // 1. Get initial balance of accounts[0] after paying entry fee
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        // 2. Pick the winner (which will be accounts[0])
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        // 3. Get the updated balance of accounts[0] after receiving winnings
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        // console.log('difference:', finalBalance - initialBalance);

        // Check that the difference is with ~1 or so ether, to account for gas
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('0.9', 'ether'));

        const entrants = await lottery.methods.getEntrants().call();
        assert.strictEqual(0, entrants.length);

    })

});
