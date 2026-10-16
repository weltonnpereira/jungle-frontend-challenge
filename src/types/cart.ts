import { NFT } from "@/src/types/nft";

export interface CartItem {
  id: string;
  nft: NFT;
  quantity: number;
  edition: string;
  unitPrice: number;
}

export type BlockchainNetwork = "Ethereum" | "Polygon";

export type WalletType = "WalletConnect" | "MetaMask" | "Coinbase Wallet";

export interface SecondaryWallet {
  id: string;
  nickname: string;
  address: string;
  type: WalletType;
  network: BlockchainNetwork;
}

// Dados de carteira unificados diretamente no profile
// Por falta de tempo eu estou fazendo dessa forma mas o certo seria separa-los via fk para interligar depois
export interface CollectorProfile {
  displayName: string;
  username: string;
  isSocial: boolean;
  walletNickname: string;
  email: string;
  ensName: string;
  notes?: string;
  avatar?: string;
  isSecondaryEqualMain: boolean;

  // Carteira Principal
  walletAddress: string;
  profileName: string;
  walletType: WalletType;
  network: BlockchainNetwork;
  referralCode: string;

  // Carteira secundária
  secondaryWallet?: SecondaryWallet;
}

export interface OrderConfirmationData {
  transactionId: string;
  date: string;
  total: number;
  subtotal: number;
  discount: number;
  networkFee: number;
  wallet: string;
  items: CartItem[];
  network: string;
}
