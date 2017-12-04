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
  	uint256 balance;
  	string[] usedFor;
  }

  // mapping of donation ID to Donation
  mapping(bytes16 => Donation) private donationsByID;
  // mapping of donor to array of Donations
  mapping(address => Donation[]) private donationListByDonor;
  // maps donor address to total balance
  mapping(address => uint256) private balanceByDonor;

  function Donations(address _owner) {
    // should only be called once, and from Config contract
    owner = _owner;
  }


  function logDonation(bytes16 id, address donor, address npo, uint amount, string usedFor) {
    string[] memory emptyUsedForList;
    Donation memory donation = Donation(id, donor, npo, amount, amount, emptyUsedForList);
    donationsByID[id] = donation;
    donationListByDonor[donor].push(donation);
    balanceByDonor[donor] = SafeMath.add(balanceByDonor[donor], amount);
  }

  function logWithdrawal(address donor, bytes16 id, uint256 amount, string usedFor) {
    if (!(donationsByID[id].balance >= amount)) {
      return;
    }
    donationsByID[id].balance = SafeMath.sub(donationsByID[id].balance, amount);
    donationsByID[id].usedFor.push(usedFor);
    // TODO: update donations by NPO
    balanceByDonor[donor] = SafeMath.sub(balanceByDonor[donor], amount);
  }

  function getDonationReportByID(bytes16 id) returns (string[]) {
    return donationsByID[id].usedFor;
  }

  function getDonationReport() returns (string[][]) {
    string[][] memory donationReport;
    for (uint i = 0; i < donationListByDonor[msg.sender].length; i++) {
      donationReport[i] = donationListByDonor[msg.sender][i].usedFor;
    }
    return donationReport;
  }

  function getBalance() returns (uint256) {
    return balanceByDonor[msg.sender];
  }
}
