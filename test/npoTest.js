'use strict';

/* Add the dependencies you're testing */
const Token = artifacts.require("./NPO.sol");

contract('npoTest', function(accounts) {
    /* Define your constant variables and instantiate constantly changing
     * ones
     */
    const args = {tags: ["food", "hunger"], categories: ["feed the hungry", "school"]};
    const clients = {owner: accounts[0], donor1: accounts[1], donor2: accounts[2]};
    let donations_contract, npo;

    /* Do something before every `describe` method */
    beforeEach(async function() {
        donations_contract = await Donations.new(accounts[0]);
        npo = await NPO.new(clients.owner, donations_contract.contractAddress, tags, categories);
    });

    /* Group test cases together
     * Make sure to provide descriptive strings for method arguements and
     * assert statements
     */
    describe('NPO functionality', function() {
        it("Testing donate", async function() {
            var success = await npo.donate.call("school", {from: clients.user1, value: 20});
            assert(success.valueOf(), "simple donate failed");
            web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
        });
        it("Testing spendBalance", async function() {
            var success = await npo.donate.call("school", {from: clients.user1, value: 20});
            assert(success.valueOf(), "simple donate failed");
            web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});

            success = await npo.spendBalance(30, "school", donor2, "pencils");
            assert.isFalse(success.valueOf(), "spend balance should not succeed without sufficient funds");

            success = await npo.spendBalance(20, "school", donor2, "pencils");
            assert(success.valueOf(), "simple spend balance failed");
        });
    });
});
