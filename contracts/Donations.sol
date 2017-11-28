pragma solidity ^0.4.15;

import './NPO.sol';
import './utils/SafeMath.sol';

contract Donations {
  address owner;

  struct Donation {
    bytes16 id;
    address donor;
    address npo;
  	uint256 balance;
  	string[] usedFor;
  }

  // maps donor address to mapping of donation ID to Donation
  mapping(address => mapping(bytes16 => Donation)) private donationsByID;
  // maps donor address to mapping of npo address to array of Donations
  mapping(address => mapping(address => Donation[])) private donationListByNPO;
  // maps donor address to total balance
  mapping(address => uint256) private balanceByDonor;

  function Donations(address _owner) {
    // should only be called once, and from Config contract
    owner = _owner;
  }


  function logDonation(bytes16 id, address donor, address npo, uint256 amount, string usedFor) {
    string[] storage emptyDonationsList; // TODO: fix this
    donationsByID[npo][id] = Donation(id, donor, npo, amount, emptyDonationsList);
    balanceByDonor[donor] = SafeMath.add(balanceByDonor[donor], amount);
  }

  function logWithdrawal(address donor, bytes16 id, uint256 amount, string usedFor) {
    donationsByID[donor][id].balance = SafeMath.sub(donationsByID[donor][id].balance, amount);
    donationsByID[donor][id].usedFor.push(usedFor);
    address npo = donationsByID[donor][id].npo;
    // TODO: update donations by NPO
    balanceByDonor[donor] = SafeMath.sub(balanceByDonor[donor], amount);
  }

  function getDonationReportByID(bytes16 id) returns (string[]) {
    return donationsByID[msg.sender][id].usedFor;
  }

  function getDonationReport(address npo) returns (string[][]) {
    string[][] memory donationReport;
    for (uint i = 0; i < donationListByNPO[msg.sender].length; i++) {
      donationReport[i] = donationListByNPO[msg.sender][i];
    }
    return donationReport;
  }

  function getBalance() returns (uint256) {
    return balanceByDonor[msg.sender];
  }
}
