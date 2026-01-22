import { useState } from "react";

export default function AdminPanel({ contract }) {
  const [status, setStatus] = useState("");

  async function startSale() {
    try {
      setStatus("⏳ Starting sale...");
      const tx = await contract.setSaleStatus(true);
      await tx.wait();
      setStatus("✅ Sale started");
    } catch {
      setStatus("❌ Failed to start sale");
    }
  }

  async function stopSale() {
    try {
      setStatus("⏳ Stopping sale...");
      const tx = await contract.setSaleStatus(false);
      await tx.wait();
      setStatus("✅ Sale stopped");
    } catch {
      setStatus("❌ Failed to stop sale");
    }
  }

  async function withdraw() {
    try {
      setStatus("⏳ Withdrawing ETH...");
      const tx = await contract.withdrawETH();
      await tx.wait();
      setStatus("✅ ETH withdrawn");
    } catch {
      setStatus("❌ Withdraw failed");
    }
  }

  return (
    <div className="card">
      <button onClick={startSale}>Start Sale</button>
      <button onClick={stopSale}>Stop Sale</button>
      <button onClick={withdraw}>Withdraw ETH</button>
      <p>{status}</p>
    </div>
  );
}
