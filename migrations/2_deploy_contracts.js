var Config = artifacts.require("./Config.sol");
var Donations = artifacts.require("./Donations.sol");
var NPO = artifacts.require("./NPO.sol");

module.exports = function(deployer) {
	deployer.deploy(Config);
	deployer.deploy(Donations);
	deployer.deploy(NPO);
};
