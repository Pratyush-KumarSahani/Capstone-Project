import { useEffect, useState } from "react";

export default function PriceTiers({ contract }) {
  const [sold, setSold] = useState(0);

  useEffect(() => {
    if (!contract) return;

    async function load() {
      const s = await contract.tokensSold();
      setSold(Number(s));
    }

    load();
  }, [contract]);

  return (
    <div className="card">
      <h4 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  💎 <span>Tiered Pricing</span>
</h4>


      <p style={{ color: sold < 10000 ? "#22c55e" : "gray" }}>
        🟢 Tier 1: 1 ETH = 1000 MTK  
        <br />
        <small>(0 – 9,999 MTK sold)</small>
      </p>

      <p style={{ color: sold >= 10000 && sold < 20000 ? "#22c55e" : "gray" }}>
        🟡 Tier 2: 1 ETH = 800 MTK  
        <br />
        <small>(10,000 – 19,999 MTK sold)</small>
      </p>

      <p style={{ color: sold >= 20000 ? "#22c55e" : "gray" }}>
        🔴 Tier 3: 1 ETH = 500 MTK  
        <br />
        <small>(20,000+ MTK sold)</small>
      </p>

      <p style={{ marginTop: "10px" }}>
        📊 Tokens sold so far: <b>{sold}</b>
      </p>
    </div>
  );
}
