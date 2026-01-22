import { useState } from "react";
import * as ethers from "ethers";
import { ERC20_ABI, TOKEN_ADDRESS, TOKENSALE_ADDRESS } from "../abi";

export default function ApprovePanel({ signer }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function approve() {
    try {
      setLoading(true);
      setStatus("Approving tokens...");

      const token = new ethers.Contract(
        TOKEN_ADDRESS,
        ERC20_ABI,
        signer
      );

      const tx = await token.approve(
        TOKENSALE_ADDRESS,
        ethers.MaxUint256
      );

      await tx.wait();
      setStatus("TokenSale approved ✅");
    } catch (err) {
      console.error(err);
      setStatus("Approval failed ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card admin">
      <h3>Approve Tokens</h3>
      <button onClick={approve} disabled={loading}>
        Approve TokenSale
      </button>
      <p>{status}</p>
    </div>
  );
}
