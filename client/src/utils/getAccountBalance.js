import Web3 from "web3";

async function getAccountBalance(address) {
  if (!address) {
    return ""; // or any default value
  }

  const web3 = new Web3(window.ethereum);
  const checksumAddress = web3.utils.toChecksumAddress(address);
  const balanceInWei = await web3.eth.getBalance(checksumAddress);
  const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
  return balanceInEther;
}

export default getAccountBalance;
