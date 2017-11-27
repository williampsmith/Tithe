pragma solidity ^0.4.15;

import './NPO.sol';
import './utils/SafeMath.sol';

contract Donations {

  struct Donation {
  	uint256 amount;
  	string usedFor;
  	address npo;
  }

  mapping(address => Donation[]) private donations;

  function donate() payable returns (bool) {
  }


}
