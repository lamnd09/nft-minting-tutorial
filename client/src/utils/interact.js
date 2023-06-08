
import getMintedTokens from "./getMintedTokens";
import getRewardBalance from "./getRewardBalance";
import getAccountBalance from "./getAccountBalance";
import uploadToIPFS from './ipfs.js';

const Web3 = require('web3');
const web3 = new Web3(window.ethereum);

const contractABI = require('../contract-abi.json')

let contractAddress = '0x17f713aC25039abbfFc34354d3084FC2183b49d5';
contractAddress = web3.utils.toChecksumAddress(contractAddress);

export const mintNFT = async (url, name, description) => {
    //error handling
    if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        }
    }
    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    let tokenURI;
    try {
        tokenURI = await uploadToIPFS(metadata);
    } catch (error) {
        console.error("Error uploading data to IPFS", error);
        return {
            success: false,
            status: "Could not upload metadatato IPFS",
        };
    }

    //load smart contract
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const address = window.ethereum.selectedAddress;
    const nonce = await web3.eth.getTransactionCount(address);

    console.log(nonce)

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        'data': contract.methods.mintNFT(address, tokenURI).encodeABI(), //make call to NFT smart contract 
        nonce: nonce.toString()
    };

    console.log(transactionParameters)
    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

        // Fetch and update the minted tokens
        const tokens = await getMintedTokens(address);

        // Fetch and update the reward balance
        const rewardBalance = await getRewardBalance(address);

        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash,
            mintedTokens: tokens,
            rewardBalance: rewardBalance,
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }


}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};
