const MyNFT = artifacts.require('MyNFT');
const { assert } = require('chai');
const BN = web3.utils.BN;
const { expectRevert } = require('@openzeppelin/test-helpers');

let myNFTInstance;
beforeEach(async function () {
    myNFTInstance = await MyNFT.new();
});

contract('MyNFT', (accounts) => {
    it('should mint a new NFT', async () => {
        let recipient = accounts[1];
        let tokenURI = "tokenURI1";
        await myNFTInstance.depositETH({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });
        await myNFTInstance.mintNFT(recipient, tokenURI, { from: accounts[0] });

        let exists = await myNFTInstance.checkTokenExists(tokenURI);
        assert.isTrue(exists, "TokenURI does not exist");

        let mintedTokens = await myNFTInstance.getMintedTokens(recipient);
        assert.equal(mintedTokens.length, 1, "Minted tokens length should be 1");

        let totalRewards = await myNFTInstance.totalRewards(recipient);
        assert.equal(totalRewards.toString(), web3.utils.toWei('1', 'ether'), "Reward should be 1 ether");
    });

    it('should fail when minting a token with a URI that already exists', async () => {
        let recipient = accounts[1];
        let tokenURI = "tokenURI2";
        await myNFTInstance.depositETH({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });
        await myNFTInstance.mintNFT(recipient, tokenURI, { from: accounts[0] });

        await expectRevert(
            myNFTInstance.mintNFT(recipient, tokenURI, { from: accounts[0] }),
            "Token already exists"
        );
    });

    it('should deposit ETH', async () => {
        await myNFTInstance.depositETH({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });

        let contractBalance = await web3.eth.getBalance(myNFTInstance.address);
        assert.equal(contractBalance, web3.utils.toWei('2', 'ether'), "Contract balance should be 2 ether");
    });

    it('should withdraw all ETH', async () => {
        await myNFTInstance.depositETH({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });

        await myNFTInstance.withdrawETH({ from: accounts[0] });

        let contractBalance = await web3.eth.getBalance(myNFTInstance.address);
        assert.equal(contractBalance, '0', "Contract balance should be 0");
    });

});