// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControl {

    address public owner;

    mapping(address => bool) public authorizedUsers;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "No sos el admin");
        _;
    }

    function authorize(address user) public onlyOwner {
        authorizedUsers[user] = true;
    }

    function revoke(address user) public onlyOwner {
        authorizedUsers[user] = false;
    }

    function isAuthorized(address user) public view returns (bool) {
        return authorizedUsers[user];
    }
}