pragma solidity ^0.4.15;

/**
 * interface for UUID UUIDProvider
 * as seen here: https://github.com/pipermerriam/ethereum-uuid
 **/
contract UUIDProvider {
    function UUID4() returns (bytes16 uuid);
}
