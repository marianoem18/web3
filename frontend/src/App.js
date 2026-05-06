import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// ⚠️ TU PROJECT ID (esto está bien que sea público)
const projectId = "0f07a3bac26fd86a205a041187991721";

// ⚠️ CONFIGURACIÓN DE RED (Sepolia)
const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://rpc.sepolia.org"
};

// ⚠️ CONFIG WALLETCONNECT
const metadata = {
  name: "Web3 Access",
  description: "DApp de control de acceso",
  url: "https://web3.vercel.app",
  icons: []
};

const ethersConfig = defaultConfig({
  metadata
});

createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: false
});

// ⚠️ TU CONTRATO
const contractAddress = "0x99844e61B1BDBfBE21bE86A553c94DdEd0177f14";

const abi = [
  "function authorize(address user)",
  "function revoke(address user)",
  "function isAuthorized(address user) view returns (bool)",
  "function owner() view returns (address)"
];

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [status, setStatus] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔌 Conectar wallet (WalletConnect + Metamask)
  const connectWallet = async () => {
    try {
      const modal = document.querySelector("w3m-button");
      if (!modal) return;

      // Web3Modal maneja conexión automáticamente
      const ethProvider = window.ethereum;
      if (!ethProvider) {
        return setStatus("Instalá una wallet compatible");
      }

      const ethersProvider = new ethers.BrowserProvider(ethProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setProvider(ethersProvider);

    } catch (err) {
      setStatus("Error al conectar");
    }
  };

  // 📦 Obtener contrato
  const getContract = async (withSigner = false) => {
    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await ethProvider.getSigner();

    return new ethers.Contract(
      contractAddress,
      abi,
      withSigner ? signer : ethProvider
    );
  };

  // 👑 Verificar owner (SOLUCIONADO ERROR ESLINT)
  const checkOwner = useCallback(async () => {
    try {
      const contract = await getContract();
      const owner = await contract.owner();

      if (account) {
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
      }
    } catch (err) {
      console.error(err);
    }
  }, [account]);

  // ⚡ Ejecutar al conectar
  useEffect(() => {
    if (account) {
      checkOwner();
    }
  }, [account, checkOwner]);

  // ✅ Autorizar
  const authorizeUser = async () => {
    try {
      if (!ethers.isAddress(targetAddress)) {
        return setStatus("Dirección inválida");
      }

      setLoading(true);
      setStatus("Confirmá en wallet...");

      const contract = await getContract(true);
      const tx = await contract.authorize(targetAddress);

      await tx.wait();
      setStatus("✅ Usuario autorizado");

    } catch {
      setStatus("❌ Error");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Revocar
  const revokeUser = async () => {
    try {
      if (!ethers.isAddress(targetAddress)) {
        return setStatus("Dirección inválida");
      }

      setLoading(true);
      setStatus("Confirmá en wallet...");

      const contract = await getContract(true);
      const tx = await contract.revoke(targetAddress);

      await tx.wait();
      setStatus("❌ Usuario revocado");

    } catch {
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Ver estado
  const checkStatus = async () => {
    try {
      setLoading(true);

      const contract = await getContract();
      const result = await contract.isAuthorized(account);

      setStatus(result ? "🟢 Autorizado" : "🔴 No autorizado");

    } catch {
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700">

        <h1 className="text-2xl font-bold mb-4 text-center">
          🔐 Web3 Access
        </h1>

        {/* BOTÓN WALLETCONNECT */}
        <w3m-button />

        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg mt-4"
        >
          Conectar manual
        </button>

        <p className="text-xs text-gray-400 mt-2 break-all text-center">
          {account || "No conectado"}
        </p>

        {isOwner && (
          <div className="bg-slate-700 p-4 rounded-xl mt-4 border border-slate-600">
            <h2 className="text-sm mb-2 text-gray-300">Panel Admin</h2>

            <input
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              placeholder="0x..."
              className="w-full p-2 rounded bg-slate-900 mb-3 border border-slate-600"
            />

            <div className="flex gap-2">
              <button
                onClick={authorizeUser}
                disabled={loading}
                className="flex-1 bg-green-600 p-2 rounded"
              >
                Autorizar
              </button>

              <button
                onClick={revokeUser}
                disabled={loading}
                className="flex-1 bg-red-600 p-2 rounded"
              >
                Revocar
              </button>
            </div>
          </div>
        )}

        <button
          onClick={checkStatus}
          disabled={loading}
          className="w-full bg-purple-600 p-2 rounded-lg mt-4"
        >
          Ver estado
        </button>

        <p className="mt-4 text-center text-sm text-gray-300">
          {status}
        </p>

      </div>
    </div>
  );
}

export default App;