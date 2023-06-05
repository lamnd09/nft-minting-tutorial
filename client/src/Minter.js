//import { ur } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./utils/interact";
import Web3 from "web3";
import getRewardBalance from "./utils/getRewardBalance";
import getMintedTokens from "./utils/getMintedTokens";

const Minter = (props) => {

    //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [url, setURL] = useState("");

    const [balance, setBalance] = useState("");
    const [rewardBalance, setRewardBalance] = useState("");
    const [mintedTokens, setMintedTokens] = useState([]);
    const [minting, setMinting] = useState(false);


    useEffect(() => {
        async function initialize() {
            const { address, status } = await getCurrentWalletConnected();
            setWallet(address);
            setStatus(status);

            addWalletListener();

            // Fetch and update the account balance
            const balance = await getAccountBalance(address);
            setBalance(balance);

            const mintedTokens = await getMintedTokens(address);
            setMintedTokens(mintedTokens)
        }

        initialize();
    }, []);

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Write a message in the text-field above.");
                    // Fetch and update the account balance
                    const balance = getAccountBalance(accounts[0]);
                    setBalance(balance);

                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                    setBalance("");
                }
            });
        } else {
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
        }
    }


    useEffect(async () => { //TODO: implement react hook
        const { address, status } = await getCurrentWalletConnected();
        setWallet(address);
        setStatus(status);

        addWalletListener();

        // Fetch and update the account balance
        const balance = await getAccountBalance(address);
        setBalance(balance);

        // Fetch and update the account balance
        const rewardBalance = await getRewardBalance(address);
        setRewardBalance(rewardBalance);

    }, []);

    async function getAccountBalance(address) {
        const web3 = new Web3(window.ethereum);
        const balanceInWei = await web3.eth.getBalance(address);
        const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
        return balanceInEther;
    }

    const connectWalletPressed = async () => { //TODO: implement
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);

        // Fetch and update the account balance
        const balance = await getAccountBalance(walletResponse.address);
        setBalance(balance);

    };

    const onMintPressed = async () => { //TODO: implement
        setMinting(true); // Start loading at the beginning of the operation
        const { status } = await mintNFT(url, name, description);
        setStatus(status);
        setMinting(false); // End loading after the operation is performed
        setRewardBalance(rewardBalance);
        setMintedTokens(mintedTokens);
    };

    return (
        <div className="Minter">
            <button id="walletButton" onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                    <>
                        <span>
                            Account 🦊: {String(walletAddress).substring(0, 6)}...
                            {String(walletAddress).substring(38)}
                        </span>
                        <br />
                        <span>💰 Balance: {balance} ETH</span> {/* Display account balance */}
                        <br />
                        <span> 💰 Total Reward: {rewardBalance} ETH </span>{ }
                    </>

                ) : (
                    <span>Connect Wallet</span>
                )}
            </button>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h1 id="title"> NFT Assignment</h1>
            <p>
                This is a simple application to mint NFT tokens and get rewarded with ETH.
                Mint your first NFT and get rewarded with 1 ETH.
            </p>
            <form>
                <h2> 🚀 NFT Name: </h2>
                <input
                    type="text"
                    placeholder="e.g. NFT number #1!"
                    onChange={(event) => setName(event.target.value)}
                />

                <h2> 🚀 NFT Description: </h2>
                <input
                    type="text"
                    placeholder="e.g. Type smt cool here ;)"
                    onChange={(event) => setDescription(event.target.value)}
                />

                <h2> 🚀 Link to Digital Asset (e.g, IPFS link): </h2>
                <input
                    type="text"
                    placeholder="e.g. http://localhost:8080/ipfs/QmSimUVgZxkQ4vK2Qh2kcMruebQ9kyWdWNBE88CyXRnu5n"
                    onChange={(event) => setURL(event.target.value)}
                />

            </form>
            <button id="mintButton" onClick={onMintPressed} disabled={minting}>
                {minting ? (
                    <>
                        <div className="spinner"></div>
                        Minting NFT...
                    </>
                ) : (
                    "Mint NFT ⛏️"
                )}
            </button>
            <p id="status">
                {status}
            </p>

            <h2>Minted Tokens </h2>
            <ul>
                {mintedTokens.map((token, index) => (
                    <li key={index}>
                        <p>{token.uri}</p> {/* You can customize this based on the structure of your tokens */}
                        <img src={token.image} width="250" height="250" /> {/* Change size as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Minter;