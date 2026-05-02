import { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x99844e61B1BDBfBE21bE86A553c94DdEd0177f14";

const abi = [
  "function authorize(address user)",
  "function revoke(address user)",
  "function isAuthorized(address user) view returns (bool)",
  "function owner() view returns (address)"
];

function App() {
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    try {
      if (!window.ethereum) return alert("Instalá MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      await checkOwner(accounts[0]);

    } catch (err) {
      setStatus("Error al conectar");
    }
  }

  async function checkOwner(acc) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const owner = await contract.owner();
    setIsOwner(owner.toLowerCase() === acc.toLowerCase());
  }

  async function authorizeUser() {
    try {
      if (!ethers.isAddress(targetAddress)) {
        return setStatus("Dirección inválida");
      }

      setLoading(true);
      setStatus("Confirmá en wallet...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.authorize(targetAddress);

      setStatus("Procesando...");
      await tx.wait();

      setStatus("✅ Usuario autorizado");

    } catch {
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

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

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

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const result = await contract.isAuthorized(account);

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

        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-2 rounded-lg mb-4 disabled:opacity-50"
          disabled={loading}
        >
          {account ? "Wallet conectada" : "Conectar Wallet"}
        </button>

        <p className="text-xs text-gray-400 mb-4 break-all text-center">
          {account || "No conectado"}
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