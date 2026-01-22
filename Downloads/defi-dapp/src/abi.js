export const TOKENSALE_ADDRESS = "0x215b7d40B3B947C53dBDf42460E7F637fdaFCE53";
export const TOKEN_ADDRESS = "0x6226e814b9F5c52357EA29a9075CD6d2cFce3820";

export const TOKENSALE_ABI = [
  "function buyTokens() payable",
  "function getPrice() view returns (uint)",
  "function tokensSold() view returns (uint)",
  "function maxTokensForSale() view returns (uint)",
  "function owner() view returns (address)",
  "function setSaleStatus(bool)",
  "function withdrawETH()"
];

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint)",
  "function approve(address,uint)",
  "function allowance(address,address) view returns (uint)",
  "function decimals() view returns (uint8)"
];
