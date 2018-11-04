// const assert = require('assert');
// const ganache = require('ganache-cli');
//
// // Require Web3 constructor
// const Web3 = require('web3');
//
// // Create new instance of Web3
// // Note: Web3 provider argument will change depending on provider
// const web3 = new Web3(ganache.provider());
//
//
// class Car {
//     park() {
//         return 'stopped';
//     }
//
//     drive() {
//         return 'vroom';
//     }
// }
//
// // initialize 'car' globally because
// // cannot initialize car within beforeEach and then use it within
// // the describe block to to scope
// let car;
//
// // Run any common initialization code before a test in beforeEach
// // No need to instantiate Car object within each 'it' block
// // Just instantiate Car once in a beforeEach block
// beforeEach(() => {
//     // assign value to car before each test
//     // within the describe block
//     car = new Car();
// });
//
// describe('Car', () => {
//
//     it('should park', () => {
//         // const car = new Car();
//         assert.strictEqual(car.park(), 'stopped');
//     });
//
//     it('should drive', () => {
//         // const car = new Car();
//         assert.strictEqual(car.drive(), 'vroom');
//     });
//
// });