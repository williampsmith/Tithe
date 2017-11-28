pragma solidity ^0.4.15;

import './NPO.sol';
import './utils/SafeMath.sol';

contract Donations {
  address owner;

  struct Donation {
    bytes16 id;
    address donor;
    address npo;
  	uint256 amount;
  	string usedFor;
  }

  // maps donor address to Donation
  mapping(address => Donation[]) public donations;

  function Donations(address _owner) {
    // should only be called once, and from Config contract
    owner = _owner;
  }


  function logDonation(bytes16 id, address donor, address npo, uint256 amount, string usedFor) {
    donations[npo].push(Donation(id, donor, amount, "", npo));
  }

  function logWithdrawal(address npo, bytes16 id, string usedFor) {
    donations[npo][id].usedFor = usedFor;
  }
}
