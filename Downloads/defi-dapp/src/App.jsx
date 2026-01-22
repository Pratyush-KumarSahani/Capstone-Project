import { useState } from "react";
import * as ethers from "ethers";

import Login from "./components/Login";
import Header from "./components/Header";
import BuyCard from "./components/BuyCard";
import AdminPanel from "./components/AdminPanel";
import PriceTiers from "./components/PriceTiers";
import SaleProgress from "./components/SaleProgress";

import { TOKENSALE_ABI, TOKENSALE_ADDRESS } from "./abi";

export default function App() {
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contract, setContract] = useState(null);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const saleContract = new ethers.Contract(
        TOKENSALE_ADDRESS,
        TOKENSALE_ABI,
        signer
      );

      const owner = await saleContract.owner();

      setAccount(address);
      setContract(saleContract);
      setIsAdmin(owner.toLowerCase() === address.toLowerCase());
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }

  // 🔐 Login screen
  if (!account) {
    return <Login connect={connectWallet} />;
  }

  // ⏳ Safety guard (prevents blank page)
  if (!contract) {
    return <p style={{ padding: "20px" }}>Loading blockchain data...</p>;
  }

  return (
    <>
      <Header account={account} isAdmin={isAdmin} />

      {isAdmin ? (
        <div className="admin-section">
          <h2>🛠 Admin Dashboard</h2>
          <AdminPanel contract={contract} />
        </div>
      ) : (
        <div className="user-section">
          <h2>🛒 Buy MTK Tokens</h2>

          {/* Tiered pricing (dynamic) */}
          <PriceTiers contract={contract} />

          {/* Buy tokens */}
          <BuyCard contract={contract} />
        </div>
      )}
    </>
  );
}
