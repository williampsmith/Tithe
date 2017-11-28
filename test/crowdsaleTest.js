'use strict';

/* Add the dependencies you're testing */
const Crowdsale = artifacts.require("./Crowdsale.sol");
const Token = artifacts.require("./Token.sol");
const Queue = artifacts.require("./Queue.sol");

contract('crowdsaleTest', function(accounts) {
	const args = {exchangeRate: 5, totalSupply: 1000, timeCap: 5000};
	const clients = {_owner: accounts[0], user1: accounts[1], user2: accounts[2]};
	let crowdsale, token, queue;

	/* Do something before every `describe` method */
	beforeEach(async function() {
		crowdsale = await Crowdsale.new(
				args.exchangeRate,
				args.totalSupply,
				args.timeCap,
				{from: clients._owner},
		);
		token = Token.at(await crowdsale.token());
		queue = Queue.at(await crowdsale.q())
	});

	describe('Init Tests', function() {
		it("Testing initialization", async function() {
			let owner = await crowdsale.owner.call();
			let tokensSold = await crowdsale.tokensSold.call();
		  let crowdSaleBalance = await crowdsale.crowdSaleBalance.call();
		  let startTime = await crowdsale.startTime.call();
		  let endTime = await crowdsale.endTime.call();
			let linesize = await crowdsale.lineSize.call();

			assert.equal(clients._owner, owner.valueOf(), "Owner not set");
			assert.equal(0, tokensSold.valueOf(), "tokensSold should initially be 0");
			assert.equal(0, crowdSaleBalance.valueOf(), "crowdSaleBalance should initially be 0");
			assert.isAtLeast(
				endTime.valueOf(),
				startTime.valueOf(),
				"sale end time is not after start time",
			);
			assert.equal(linesize, 0, "Queue should be initially empty");
		});
	});

	describe('Timing Tests', function() {
		it("Testing refund fails after sale ends", async function() {
			await crowdsale.getInLine(clients.user1);
			await crowdsale.getInLine(clients.user2);
			var success = await crowdsale.sell.call({from: clients.user1, value: 20});
			assert(success.valueOf(), "simple sell failed");
			web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [10000], id: 0});
			web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
			let successfulRefund = await crowdsale.refund.call(20, {from: clients.user1})
			assert.isFalse(successfulRefund.valueOf(), "refund should not succeed after timeout");

		});

		it("Testing sell fails after sale ends", async function() {
			await crowdsale.getInLine(clients.user1);
			await crowdsale.getInLine(clients.user2);
			web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [10000], id: 0});
			web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});			let success = await crowdsale.sell.call({from: clients.user1, value: 20});
			assert.isFalse(success.valueOf(), "simple sell should not succeed after timeout");
		});
	});

	describe('Sale Functionality Tests', function() {
		it("Testing wei to dragonglass conversion", async function() {
			let way = 200;
			let dg = await crowdsale.weiToDragonGlass.call(way);
			assert.equal(dg.valueOf(), way * args.exchangeRate, "wei to dg exchange incorrect");
		});
		it("Testing dragonglass to wei conversion", async function() {
			let dg = 1000;
			let way = await crowdsale.dragonGlassToWei.call(dg);
			assert.equal(
				way.valueOf(),
				dg / args.exchangeRate,
				"dg to wei exchange incorrect",
			);
		});
		it("Testing successful sales", async function() {
			var tokensSold = await crowdsale.tokensSold.call();
			var crowdSaleBalance = await crowdsale.crowdSaleBalance.call();
			assert.equal(
				tokensSold.valueOf(),
				0,
				"Tokens sold should be 0 before any sale",
			);
			assert.equal(
				crowdSaleBalance.valueOf(),
				0,
				"Crowdsale balance should be 0 before any sale",
			);

			let size1 = await crowdsale.lineSize.call();
			assert.equal(
				size1.valueOf(),
				0,
				"Line size should be 0 at beginning of sale",
			);
			await crowdsale.getInLine(clients.user1);
			let size2 = await crowdsale.lineSize.call();
			assert.equal(
				size2.valueOf(),
				1,
				"Line size should be 1 for single seller before purchase completes",
			);
			let first = await crowdsale.firstInLine.call();
			assert.equal(
				first.valueOf(),
				clients.user1,
				"Solitary buyer should be first in line after enqueue",
			);
			let success = await crowdsale.sell.call({from: clients.user1, value: 1});
			assert(!success.valueOf(), "Should not be able to sell until at least 2 ppl in line");

			// seller can only sell if there is someone in line behind them.
			await crowdsale.getInLine(clients.user2);
			let size3 = await crowdsale.lineSize.call();
			assert.equal(
				size3.valueOf(),
				2,
				"Line size should be 2 once another person is enqueued."
			);

			first = await crowdsale.firstInLine.call();
			assert.equal(
				first.valueOf(),
				clients.user1,
				"The same buyer should be first in line, even after enqueue",
			);

			let success2 = await crowdsale.sell.call({from: clients.user1, value: 20});
			assert(success2.valueOf(), "simple sell failed");


			// tokensSold = await crowdsale.tokensSold.call();
			// crowdSaleBalance = await crowdsale.crowdSaleBalance.call();
			// assert.equal(
			// 	crowdSaleBalance.valueOf(),
			// 	20,
			// 	"crowdSaleBalance not updated after successful sale",
			// );
			// assert.equal(
			// 	tokensSold.valueOf(),
			// 	20 * args.exchangeRate,
			// 	"tokensSold not updated after successful sale",
			// );
		});

		it("Testing failed sell due to insufficient funds", async function() {
			await crowdsale.getInLine(clients.user1);
			await crowdsale.getInLine(clients.user2);
			var success = await crowdsale.sell.call({from: clients.user1, value: 100});
			assert(success, "Sale failed.");
			success = await crowdsale.sell.call({from: clients.user1, value: 1000});
			assert.isFalse(success, "Sale should fail due to insufficient funds.");

			
		});

		it("Testing failed sell due to sale cap exceeded", async function() {
			await crowdsale.getInLine(clients.user1);
			await crowdsale.getInLine(clients.user2);
			let success = await crowdsale.sell.call({from: clients.user1, value: 9999});
			assert.isFalse(success, "Sale should fail since sale cap is exceeded.");
		});

		it("Testing successful refunds", async function() {

			await crowdsale.getInLine(clients.user1);
			await crowdsale.getInLine(clients.user2);
			let successfulSale = await crowdsale.sell.call({from: clients.user1, value: 20});
			assert(successfulSale, "Sale failed.");
			let successfulRefund = await crowdsale.refund.call(20, {from: clients.user1})
			// assert(successfulRefund, "Refund failed.");
			let b = await token.balanceOf.call(clients.user1);
			assert(b.valueOf(), 0, "User should have 0 balance after full refund.");
			// tokensSold = await crowdsale.tokensSold.call();
			// crowdSaleBalance = await crowdsale.crowdSaleBalance.call();
			// assert.equal(
			// 	crowdSaleBalance.valueOf(),
			// 	0,
			// 	"crowdSaleBalance not updated after successful sale",
			// );
			// assert.equal(
			// 	tokensSold.valueOf(),
			// 	0,
			// 	"tokensSold not updated after successful sale",
			// );

		});

		it("Testing failed refund due to insufficient funds", async function() {
			await crowdsale.getInLine(clients.user1);
			await crowdsale.getInLine(clients.user2);
			let successfulRefund = await crowdsale.refund.call(20, {from: clients.user1})
			assert.isFalse(successfulRefund, "Refund should fail due to insufficient funds.");
		});

		it("Testing funds tranferred to owner at end of sale", async function() {
			await crowdsale.getInLine(clients.user1);
			await crowdsale.getInLine(clients.user2);
			web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [10000], id: 0});
			web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
			let success = await crowdsale.receiveFunds.call({from: clients._owner});
			assert(success, "funds were not transferred to owner at end of sale");
		});
	});

	describe('Security and Permission Tests', function() {
		it("Testing minting and burning fails for non-owner", async function() {
			await crowdsale.mint(999, {from: clients.user1});
			var ts = await token.totalSupply.call();
			assert.equal(ts.valueOf(), args.totalSupply, "Non-owner should not be able to mint new tokens.");

			await crowdsale.burn(999, {from: clients.user1});
			ts = await token.totalSupply.call();
			assert.equal(ts.valueOf(), args.totalSupply, "Non-owner should not be able to burn tokens.");
		
		});
		it("Testing receiveFunds fails for non-owner", async function() {
			await crowdsale.getInLine(clients.user1);
			await crowdsale.getInLine(clients.user2);
			web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [100000], id: 0});
			web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
			let success = await crowdsale.receiveFunds.call({from: clients.user2});
			assert.isFalse(success, "funds should not be transferred to non-owner at end of sale");
		});
	});
});
