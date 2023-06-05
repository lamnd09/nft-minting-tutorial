// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping to track the rewards received by each user
    mapping(address => uint256) private rewardsReceived;
    // Mapping to track the NFTs minted by each user
    mapping(address => uint256[]) private userMintedTokens;
    // Mapping to check if a token has already been minted
    mapping(string => bool) private tokenExists;

    constructor() public ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        require(!tokenExists[tokenURI], "Token already exists");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        // Reward the user with 1 ETH.
        rewardUser(recipient);

        // Track the NFTs minted by the user
        userMintedTokens[recipient].push(newItemId);

        // Mark the token as minted
        tokenExists[tokenURI] = true;

        return newItemId;
    }

    function rewardUser(address user) internal {
        uint256 rewardAmount = 1 ether;

        require(address(this).balance >= rewardAmount, "Not enough Ether to reward user");

        // Update the rewardsReceived mapping
        rewardsReceived[user] += rewardAmount;

        // Transfer the reward to the user.
        (bool success, ) = payable(user).call{value: rewardAmount}("");
        require(success, "Failed to send Ether");

        emit UserRewarded(user, rewardAmount);
    }

    // This function allows the contract owner to deposit ETH into the contract
    function depositETH() public payable {}

    // This function will allow the owner to withdraw all the remaining ETH.
    function withdrawETH() public onlyOwner {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // Function to get the total amount of rewards an user received
    function totalRewards(address user) public view returns (uint256) {
        return rewardsReceived[user];
    }

    // Function to get all tokens minted by a user
    function getMintedTokens(address user) public view returns (uint256[] memory) {
        return userMintedTokens[user];
    }

    // Function to check if a token with a given URI already exists
    function checkTokenExists(string memory tokenURI) public view returns (bool) {
        return tokenExists[tokenURI];
    }

    // Event emitted when a user is rewarded
    event UserRewarded(address indexed user, uint256 rewardAmount);
}