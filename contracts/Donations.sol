pragma solidity ^0.4.15;

import './NPO.sol';
import './utils/SafeMath.sol';

contract Donations {

  struct Donation {
    uint256 id;  // unique key for donation
    address donor;
  	uint256 amount;
  	string usedFor;
  	address npo;
  }

  // maps donor address to Donation
  mapping(address => Donation[]) private donations;


  function logDonation(address donor, address npo, uint256 amount, uint256 id) {
    donations[npo].push(Donation(id, donor, amount, "", npo));
  }

  function logWithdrawal(address npo, uint256 id, string usedFor) {
    donations[npo][id].usedFor = usedFor;
  }
}
