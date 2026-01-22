export default function Header({ account, isAdmin }) {
  return (
    <header>
      <h2>MTK Token Sale</h2>
      <p>{isAdmin ? "🟢 Admin" : "🔵 User"}</p>
      <a
        href={`https://sepolia.etherscan.io/address/${account}`}
        target="_blank"
      >
        View on Etherscan
      </a>
    </header>
  );
}
