'use strict';

const Donations = artifacts.require("./Donations.sol");
const Config = artifacts.require("./Config.sol");
const NPO = artifacts.require("./NPO.sol");

contract('donationsTest', function(accounts) {
	const args = {};
	const clients = {_owner: accounts[0], user1: accounts[1], user2: accounts[2]};
	let donations, config, npo;

	beforeEach(async function() {
		donations = await Donations.new(clients._owner);
	});

	describe('Init Tests', function() {
		it("Testing initialization", async function() {
      // TODO: implement
		});
	});

	describe('Log Donation and Withdrawal Tests', function() {
		it("Test logging donation and withdrawal updates balance", async function() {
			await donations.logDonation('abcdefghijklmnop', clients.user1, clients.user2, 500, "");
			var balance = await donations.getBalance.call({from: clients.user1});
			assert(balance.valueOf(), 500);

      address donor, bytes16 id, uint256 amount, string usedFor)
      await donations.logWithdrawal(clients.user1, 'abcdefghijklmnop', 250, "Soup from Angies Soup Kitchen");
			var balance = await donations.getBalance.call({from: clients.user1});
			assert(balance.valueOf(), 250);
		});

		it("Test logging donation and withdrawal generates correct report", async function() {
			// TODO: implement
		});
	});

	describe('Donation Report Tests', function() {
		it("Test Donation Report contains the right number of usedFor strings", async function() {
      // TODO: implement
		});
	});
});
