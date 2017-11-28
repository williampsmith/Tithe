'use strict';

/* Add the dependencies you're testing */
const Token = artifacts.require("./Token.sol");

contract('tokenTest', function(accounts) {
	/* Define your constant variables and instantiate constantly changing
	 * ones
	 */
	const args = {_supply: 1000};
	let token;

	/* Do something before every `describe` method */
	beforeEach(async function() {
		token = await Token.new(args._supply);
	});

	/* Group test cases together
	 * Make sure to provide descriptive strings for method arguements and
	 * assert statements
	 */
	describe('Token functionality', function() {
		it("Testing transfer", async function() {
			let balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), args._supply, "incorrect balance");

			await token.transfer(accounts[1], 10);

			balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), args._supply - 10, "incorrect balance");

			balance = await token.balanceOf.call(accounts[1]);
			assert.equal(balance.valueOf(), 10, "incorrect balance");
		});
		it("Testing transferFrom, approve, and allowance", async function() {
			await token.approve(accounts[1], 50);
			let allowance = await token.allowance.call(accounts[0], accounts[1]);
			assert.equal(allowance.valueOf(), 50, "incorrect allowance");

			await token.approve(accounts[1], 50);
			allowance = await token.allowance.call(accounts[0], accounts[1]);
			assert.equal(allowance.valueOf(), 100, "incorrect allowance");

			await token.approve(accounts[2], 1000);
			allowance = await token.allowance.call(accounts[0], accounts[2]);
			assert.equal(allowance.valueOf(), 0, "incorrect allowance");

			await token.approve(accounts[2], 150);
			allowance = await token.allowance.call(accounts[0], accounts[2]);
			assert.equal(allowance.valueOf(), 150, "incorrect allowance");

			await token.transferFrom(accounts[0], accounts[3], 10, {from: accounts[2]});
			allowance = await token.allowance.call(accounts[0], accounts[2]);
			assert.equal(allowance.valueOf(), 140, "incorrect allowance");

			await token.transferFrom(accounts[0], accounts[3], 10, {from: accounts[1]});
			allowance = await token.allowance.call(accounts[0], accounts[1]);
			assert.equal(allowance.valueOf(), 90, "incorrect allowance");

			await token.transferFrom(accounts[0], accounts[2], 100, {from: accounts[1]});
			allowance = await token.allowance.call(accounts[0], accounts[1]);
			assert.equal(allowance.valueOf(), 90, "incorrect allowance");

			allowance = await token.allowance.call(accounts[0], accounts[2]);
			assert.equal(allowance.valueOf(), 140, "incorrect allowance");

			let balance = await token.balanceOf.call(accounts[3]);
			assert.equal(balance.valueOf(), 20, "incorrect balance");

			await token.approve(accounts[5], 10, {from: accounts[3]});
			allowance = await token.allowance.call(accounts[3], accounts[5]);
			assert.equal(allowance.valueOf(), 10, "incorrect allowance");

			await token.transferFrom(accounts[3], accounts[6], 20, {from: accounts[5]});
			balance = await token.balanceOf.call(accounts[3]);
			assert.equal(balance.valueOf(), 20, "incorrect balance");

			await token.transferFrom(accounts[3], accounts[6], 10, {from: accounts[5]});
			balance = await token.balanceOf.call(accounts[3]);
			assert.equal(balance.valueOf(), 10, "incorrect balance");

			balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), args._supply - 20, "incorrect balance");

			await token.transfer(accounts[3], 900);
			balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), 980, "incorrect balance");

			await token.transfer(accounts[3], 20);
			balance = await token.balanceOf.call(accounts[3]);
			assert.equal(balance.valueOf(), 30, "incorrect balance");
			balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), args._supply - 40, "incorrect balance");
		});
		it("Testing mint", async function() {
			await token.mint(100);
			let balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), args._supply + 100, "incorrect balance");
		});
		it("Testing burn", async function() {
			await token.burn(100);
			let balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), args._supply - 100, "incorrect balance");
		});
		it("Testing refund", async function() {
			await token.transfer(accounts[1], 10);

			let balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), args._supply - 10, "incorrect balance");

			balance = await token.balanceOf.call(accounts[1]);
			assert.equal(balance.valueOf(), 10, "incorrect balance");

			await token.refund(accounts[1], 5);

			balance = await token.balanceOf.call(accounts[0]);
			assert.equal(balance.valueOf(), args._supply - 5, "incorrect balance");

			balance = await token.balanceOf.call(accounts[1]);
			assert.equal(balance.valueOf(), 5, "incorrect balance");
		});
	});
});
