pragma solidity ^0.4.15;

import './utils/SafeMath.sol';
import './utils/Math.sol';
import './utils/UUIDProvider.sol';

import './Donations.sol';

contract NPO {
    address private owner;
    string[] public tags;
    string[] public categories;
    Donations donationsContract;  // reference to Donations contract
    UUIDProvider uuidProvider;

    struct Donation {
        bytes16 id;
        address donor;
        uint256 balance;
    }

    mapping(string => Donation[]) public donationsByCategory;
    mapping(bytes16 => Donation[]) public donationsByID;
    mapping(string => uint256) private balanceByCategory;
    mapping(address => uint256) private remainingBalance;

    event Donate(address indexed _from, address indexed _to, uint256 _value);

    modifier OwnerOnly() {
        if (msg.sender == owner) {_;}
    }

    function NPO(address NPOAddr, address _donationsContract, string[] _tags, string[] _categories) {
        owner = NPOAddr;
        donationsContract = Donations(_donationsContract);
        tags = _tags;
        categories = _categories;
        // TODO: remove this address and get source code
        uuidProvider = UUIDProvider(0xbb17fcd3f0be84478c4772cdb1035089aa36d4d1);
    }

    function donate(string category) payable returns (bool) {
        bytes16 id = uuidProvider.UUID4();
        Donation memory donation = Donation(id, msg.sender, msg.value);
        donationsByCategory[category].push(donation);
        donationsByID[id].push(donation);
        balanceByCategory[category] = SafeMath.add(balanceByCategory[category], msg.value);
        donationsContract.logDonation(id, msg.sender, address(this), msg.value, "");
        Donate(msg.sender, owner, msg.value);
        return true;
    }

    function spendBalance(uint256 amount, string category, address _to, string usedFor)
      OwnerOnly() returns (bool) {
        // TODO: add functionality so that usedFor is simehow auto-populated by
        // the transaction. This way it is not forgeable by the NPO.
        if (amount < 0 || balanceByCategory[category] < amount) {
            return false;
        } else if (!(_to.send(amount))) { // make the transfer
          return false;
        }

        balanceByCategory[category] = SafeMath.sub(balanceByCategory[category], amount);
        uint256 remaining = amount;
        Donation[] storage donationsList = donationsByCategory[category];
        for (uint i = 0; (i < donationsList.length) && (remaining > 0); i++) {
            uint256 withdrawal = Math.min256(donationsList[i].balance, remaining);
            donationsList[i].balance = SafeMath.sub(donationsList[i].balance, withdrawal);
            remaining = SafeMath.sub(remaining, withdrawal);
            donationsContract.logWithdrawal(
              address(this),
              donationsList[i].id,
              withdrawal,
              usedFor,
            );
        }
        return true;
    }
}
