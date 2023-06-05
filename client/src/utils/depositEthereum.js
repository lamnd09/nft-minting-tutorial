const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8545'); // replace with your Infura Project ID

// Your account private key and the contract address
const privateKey = '0xaefcaad212aba1ac9c96f94f5dcef495467fb745179976fbe31711bc559fedcf';
const contractAddress = '0x17f713aC25039abbfFc34354d3084FC2183b49d5';

// MyNFT contract ABI
const abi = require('../contract-abi.json')

// Set up the contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

const depositETH = async () => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const valueToSend = web3.utils.toWei('100', 'ether'); // 1 Ether

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contract.methods.depositETH().estimateGas({ from: account.address, value: valueToSend });

    const receipt = await contract.methods.depositETH().send({ from: account.address, gasPrice: gasPrice, gas: gasEstimate, value: valueToSend });

    console.log(receipt);
}

depositETH();