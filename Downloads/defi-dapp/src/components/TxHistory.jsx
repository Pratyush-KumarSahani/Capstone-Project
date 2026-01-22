import { useEffect, useState } from "react";

export default function TxHistory({ contract }) {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    async function load() {
      const events = await contract.queryFilter("TokensPurchased");
      setTxs(events.slice(-5).reverse());
    }
    load();
  }, []);

  return (
    <div className="card">
      <h4>Recent Transactions</h4>
      {txs.map((e, i) => (
        <p key={i}>
          {e.args.buyer.slice(0,6)}... bought {e.args.tokens} MTK
        </p>
      ))}
    </div>
  );
}
