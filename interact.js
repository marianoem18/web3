const { ethers } = require("ethers");

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const abi = [
  "function authorize(address user)",
  "function isAuthorized(address user) view returns (bool)"
];

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const myAddress = await signer.getAddress();

    console.log("Mi address:", myAddress);

    // 👇 FORZAMOS formato correcto
    const tx = await contract.authorize(myAddress.toString());
    await tx.wait();

    const result = await contract.isAuthorized(myAddress);

    console.log("Está autorizado:", result);
}

main();