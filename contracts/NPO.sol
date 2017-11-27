pragma solidity ^0.4.15;

import './utils/SafeMath.sol';
import './utils/Math.sol';

contract NPO {
    address owner;

    struct Donation {
        address donor;
        uint256 balance;
    }

    mapping(string => Donation[]) private categoryDonations;
    mapping(string => uint256) private categoryBalances;
    mapping(address => uint256) private donationAmount;
    mapping(address => uint256) private remainingBalance;

    event Donate(address indexed _from, address indexed _to, uint256 _value);

    modifier OwnerOnly() {
        if (msg.sender == owner) {_;}
    }

    function NPO() {
        owner = msg.sender;
    }

    function donate(string category) payable returns (bool) {
        Donation[] storage donorArray = categoryDonations[category];
        bool done = false;
        for (uint i = 0; i < donorArray.length; i++) {
            if (donorArray[i].donor == msg.sender) {
                donorArray[i].balance = SafeMath.add(donorArray[i].balance, msg.value);
                done = true;
                break;
            }
        }

        if (!done) {
            donorArray.push(Donation(msg.sender, msg.value));
        }

        categoryBalances[category] = SafeMath.add(categoryBalances[category], msg.value);
        donationAmount[msg.sender] = SafeMath.add(donationAmount[msg.sender], msg.value);
        remainingBalance[msg.sender] = SafeMath.add(remainingBalance[msg.sender], msg.value);
        Donate(msg.sender, owner, msg.value);
        return true;
    }

    function spendBalance(uint256 amount, string category, address _to) OwnerOnly() returns (bool) {
        if (amount < 0 || categoryBalances[category] < amount) {
            return false;
        }

        uint256[] memory withdrawals;
        Donation[] storage donorArray = categoryDonations[category];

        categoryBalances[category] = SafeMath.sub(categoryBalances[category], amount);
        uint256 remaining = amount;
        for (uint i = 0; (i < donorArray.length) && (remaining > 0); i++) {
            uint256 withdrawal = Math.min256(donorArray[i].balance, remaining);
            withdrawals[i] = withdrawal;
            remainingBalance[donorArray[i].donor] = SafeMath.sub(remainingBalance[donorArray[i].donor], withdrawal);
            donorArray[i].balance = SafeMath.sub(donorArray[i].balance, withdrawal);
            remaining = SafeMath.sub(remaining, withdrawal);
        }

        if (!(_to.send(amount))) {
            remaining = amount;
            categoryBalances[category] = SafeMath.add(categoryBalances[category], amount);
            for (i = 0; i < withdrawals.length; i++) {
                remainingBalance[donorArray[i].donor] = SafeMath.add(remainingBalance[donorArray[i].donor], withdrawals[i]);
                donorArray[i].balance = SafeMath.add(donorArray[i].balance, withdrawals[i]);
                withdrawals[i] = 0;
            }

            return false;
        }

        return true;
    }

    function getDonated() returns (uint256) {
        return donationAmount[msg.sender];
    }

    function getBalance() returns (uint256) {
        return remainingBalance[msg.sender];
    }
}
