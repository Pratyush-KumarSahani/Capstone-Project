import { useEffect, useState } from "react";

export default function SaleProgress({ contract }) {
  const [sold, setSold] = useState(0);
  const [max, setMax] = useState(0);

  async function load() {
    if (!contract) return;

    const s = await contract.tokensSold();
    const m = await contract.maxTokensForSale();

    setSold(Number(s));
    setMax(Number(m));
  }

  useEffect(() => {
    load();
  }, [contract]); // 👈 important

  const percent = max ? ((sold / max) * 100).toFixed(1) : 0;

  return (
    <div className="card">
      <h4 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  📊 <span>Token Sale Progress</span>
</h4>


      <div
        style={{
          background: "#334155",
          borderRadius: "12px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            background: "linear-gradient(to right, #22c55e, #4ade80)",
            padding: "8px",
            color: "black",
            fontWeight: "bold",
            borderRadius: "12px",
            transition: "width 0.5s ease-in-out"
          }}
        >
          {percent}%
        </div>
      </div>

      <p style={{ marginTop: "10px" }}>
        🪙 Remaining Tokens: <b>{max - sold}</b> MTK
      </p>
    </div>
  );
}
