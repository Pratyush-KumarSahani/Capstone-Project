export default function Login({ connect }) {
  return (
    <div className="login">
      <h2>🔐 Wallet Login</h2>
      <button onClick={connect}>Connect MetaMask</button>
    </div>
  );
}
