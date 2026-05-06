import { useState, useEffect } from "react";
import { ethers } from "ethers";

// 🔌 Web3Modal
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from "@web3modal/ethers/react";

// 🔑 Tu Project ID (OK dejarlo público)
const projectId = "0f07a3bac26fd86a205a041187991721";

// 🌐 Sepolia
const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://rpc.sepolia.org"
};

// ⚙️ Config
const metadata = {
  name: "Web3 Access",
  description: "Access control DApp",
  url: "http://localhost:3000",
  icons: []
};

const ethersConfig = defaultConfig({ metadata });

createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId
});

// 📜 Tu contrato (NO tocado)
const contractAddress = "0x99844e61B1BDBfBE21bE86A553c94DdEd0177f14";

const abi = [
  "function authorize(address user)",
  "function revoke(address user)",
  "function isAuthorized(address user) view returns (bool)",
  "function owner() view returns (address)"
];

function App() {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [status, setStatus] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // 👑 Detectar owner
  useEffect(() => {
    if (isConnected) checkOwner();
  }, [isConnected, address]);

  async function getSigner() {
    const provider = new ethers.BrowserProvider(walletProvider);
    return await provider.getSigner();
  }

  async function getContract(signer = null) {
    if (signer) {
      return new ethers.Contract(contractAddress, abi, signer);
    }
    const provider = new ethers.BrowserProvider(walletProvider);
    return new ethers.Contract(contractAddress, abi, provider);
  }

  async function checkOwner() {
    try {
      const contract = await getContract();
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    } catch (err) {
      console.error(err);
    }
  }

  async function authorizeUser() {
    try {
      if (!ethers.isAddress(targetAddress)) {
        return setStatus("Dirección inválida");
      }

      setLoading(true);
      setStatus("Confirmá en wallet...");

      const signer = await getSigner();
      const contract = await getContract(signer);

      const tx = await contract.authorize(targetAddress);

      setStatus("Procesando...");
      await tx.wait();

      setStatus("✅ Usuario autorizado");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error");
    } finally {
      setLoading(false);
    }
  }

  async function revokeUser() {
    try {
      if (!ethers.isAddress(targetAddress)) {
        return setStatus("Dirección inválida");
      }

      setLoading(true);
      setStatus("Confirmá en wallet...");

      const signer = await getSigner();
      const contract = await getContract(signer);

      const tx = await contract.revoke(targetAddress);

      setStatus("Procesando...");
      await tx.wait();

      setStatus("❌ Usuario revocado");
    } catch {
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  }

  async function checkStatus() {
    try {
      setLoading(true);

      const contract = await getContract();
      const result = await contract.isAuthorized(address);

      setStatus(result ? "🟢 Autorizado" : "🔴 No autorizado");
    } catch {
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700">

        <h1 className="text-2xl font-bold mb-4 text-center">
          🔐 Web3 Access
        </h1>

        {/* 🔥 NUEVO BOTÓN */}
        <w3m-button />

        <p className="text-xs text-gray-400 mt-2 mb-4 break-all text-center">
          {address || "No conectado"}
        </p>

        {isOwner && (
          <div className="bg-slate-700 p-4 rounded-xl mb-4 border border-slate-600">
            <h2 className="font-semibold mb-2 text-sm text-gray-300">
              Panel Admin
            </h2>

            <input
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              placeholder="0x..."
              className="w-full p-2 rounded bg-slate-900 mb-3 outline-none border border-slate-600"
            />

            <div className="flex gap-2">
              <button
                onClick={authorizeUser}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded disabled:opacity-50"
              >
                {loading ? "..." : "Autorizar"}
              </button>

              <button
                onClick={revokeUser}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded disabled:opacity-50"
              >
                {loading ? "..." : "Revocar"}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={checkStatus}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Consultando..." : "Ver mi estado"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-300">
          {status}
        </p>

      </div>
    </div>
  );
}

export default App;