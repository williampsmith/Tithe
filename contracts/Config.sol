pragma solidity ^0.4.15;

import './utils/StringUtils.sol';
import './NPO.sol';

contract Config {
    address owner;

    struct NPOMetadata {
        NPO NPOContract;
        string name;
        string description;
        string[] buckets;
        string[] tags;
    }

    NPOMetadata[] private NPOs;
    string[] private allBuckets;
    string[] private allTags;
    mapping(string => NPOMetadata) private NPOMeta;
    mapping(string => NPOMetadata[]) private tagToNPO;
    mapping(string => NPOMetadata[]) private bucketToNPO;

    function Config() {
        owner = msg.sender;
    }

    function register(string name, string description, string[] buckets, string[] tags) returns (bool) {
        for (uint i = 0; i < NPOs.length; i++) {
            // TODO: might need keccak256 for string comparison or use manual string compare function
            if (StringUtils.equal(NPOs[i].name, name)) {
                return false;
            }
        }

        NPO newNPO = NPO(msg.sender);
        NPOMetadata newNPOMeta = NPOMetadata(newNPO, name, description, buckets, tags);
        NPOMeta[name] = newNPOMeta;
        NPOs.push(newNPOMeta);

        for (i = 0; i < buckets.length; i++) {
            bucketToNPO[buckets[i]].push(newNPOMeta);
            bool found = false;
            for (uint j = 0; j < allBuckets.length; j++) {
                // TODO: might need keccak256 for string comparison or use manual string compare function
                if (StringUtils.equal(allBuckets[j], buckets[i])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                allBuckets.push[buckets[i]];
            }
        }

        for (i = 0; i < tags.length; i++) {
            tagToNPO[tags[i]].push(newNPOMeta);
            found = false;
            for (j = 0; j < allTags.length; j++) {
                // TODO: might need keccak256 for string comparison or use manual string compare function
                if (allTags[j] == tags[i]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                allTags.push[tags[i]];
            }
        }

        return true;
    }

    function getNPO(string name) {
        return NPOMeta[name];
    }

    function getBuckets() {
        return allBuckets;
    }

    function getTags() {
        return allTags;
    }

    function searchBucket(string bucket) {
        return bucketToNPO[bucket];
    }

    function searchTag(string tag) {
        return tagToNPO[tag];
    }

    function stringsEqual(string memory _a, string memory _b) internal returns (bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length)
            return false;
        // @todo unroll this loop
        for (uint i = 0; i < a.length; i ++)
            if (a[i] != b[i])
                return false;
        return true;
    }
}
