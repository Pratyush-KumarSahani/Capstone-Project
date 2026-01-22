import { useEffect, useState } from "react";
import * as ethers from "ethers";
import { ERC20_ABI, TOKEN_ADDRESS } from "../abi";

export default function BuyCard({ contract }) {
  const [eth, setEth] = useState("");
  const [status, setStatus] = useState("");
  const [mtkBalance, setMtkBalance] = useState("0");

  // demo rate (frontend preview only)
  const RATE = 1000;
  const preview = eth ? (Number(eth) * RATE).toFixed(2) : 0;

  async function loadMtkBalance() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);

      const decimals = await token.decimals();
      const user = await contract.signer.getAddress();
      const bal = await token.balanceOf(user);

      setMtkBalance(ethers.formatUnits(bal, decimals));
    } catch (err) {
      console.error("Balance load failed:", err);
    }
  }

  async function buy() {
    if (!eth || Number(eth) <= 0) {
      setStatus("❌ Enter valid ETH amount");
      return;
    }

    try {
      setStatus("⏳ Sending transaction...");

      const tx = await contract.buyTokens({
        value: ethers.parseEther(eth),
      });

      setStatus("⏳ Waiting for confirmation...");
      await tx.wait();

      setStatus("✅ Tokens purchased!");
      setEth("");
      await loadMtkBalance();
    } catch (err) {
      console.error("Buy failed:", err);
      setStatus("❌ Transaction failed");
    }
  }

  useEffect(() => {
    loadMtkBalance();
  }, []);

  return (
    <div className="card">
      <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  🛒 <span>Buy MTK</span>
</h3>


      <p>🪙 Your MTK Balance: <b>{mtkBalance}</b></p>

      <input
        type="number"
        step="0.001"
        placeholder="ETH amount"
        value={eth}
        onChange={(e) => setEth(e.target.value)}
      />

      <p>💱 You will receive approx <b>{preview}</b> MTK</p>

      <button onClick={buy}>Buy Tokens</button>

      <p>{status}</p>
    </div>
  );
}
