const Web3 = require('web3');
const contractABI = require('../contract-abi.json'); // Replace with the actual path to your contract's ABI JSON file

async function getRewardBalance(userAddress) {
    // Create a new web3 instance and connect to the blockchain
    const web3 = new Web3('http://localhost:8545');

    // Get the contract instance
    const contractAddress = '0x17f713aC25039abbfFc34354d3084FC2183b49d5';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        // Call the contract's totalRewards function
        const balanceInWei = await contract.methods.totalRewards(userAddress).call();

        // Convert balance from wei to ETH
        const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');

        // Return the total reward balance
        return balanceInEth;
    } catch (error) {
        console.error('Error retrieving reward balance:', error);
        return 0;
    }
}

export default getRewardBalance;