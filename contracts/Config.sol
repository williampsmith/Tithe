pragma solidity ^0.4.15;

import './utils/StringUtils.sol';
import './NPO.sol';

contract Config {
    address owner;
    Donations donationsContract;

    struct NPOMetadata {
        address npoAddress;
        string name;
        string description;
        string[] categories;
        string[] tags;
    }

    NPOMetadata[] private NPOs;
    string[] private allcategories;
    string[] private allTags;
    mapping(string => NPOMetadata) private NPOMeta;
    mapping(string => NPOMetadata[]) private tagToNPO;

    function Config() { // NOTE: should only ever be instantiated once!
        owner = msg.sender;
        // instantate and set the owner of Donations
        donationsContract = new Donations(msg.sender);
    }

    function register(string name, string description, string[] categories, string[] tags) returns (bool) {
        for (uint i = 0; i < NPOs.length; i++) {
            if (StringUtils.equal(NPOs[i].name, name)) {
                return false;
            }
        }

        NPO newNPO = new NPO(msg.sender, address(donationsContract), tags, categories);
        NPOMetadata storage newNPOMeta = NPOMetadata(address(newNPO), name, description, categories, tags);
        NPOMeta[name] = newNPOMeta;
        NPOs.push(newNPOMeta);

        for (i = 0; i < tags.length; i++) {
            tagToNPO[tags[i]].push(newNPOMeta);
            bool found = false;
            for (uint j = 0; j < allTags.length; j++) {
                if (StringUtils.equal(allTags[j], tags[i])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                allTags.push(tags[i]);
            }
        }

        return true;
    }

    function getNPO(string name) returns (string, string, string[], string[]) {
        return (NPOMeta[name].name, NPOMeta[name].description, NPOMeta[name].categories, NPOMeta[name].tags);
    }

    function getcategories(address npo) returns (string[]) {
        return allcategories;
    }

    function getTags() returns (string[]) {
        return allTags;
    }

    function searchTag(string tag) returns (NPOMetadata[]) {
        return tagToNPO[tag];
    }
}
