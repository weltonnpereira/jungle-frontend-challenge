import { NFT } from '@/src/types/nft'

export interface CartItem {
  id: string
  nft: NFT
  quantity: number
  edition: string
  unitPrice: number
}

export interface CollectorProfile {
  displayName: string
  username: string
  network: string
  profileName: string
  walletAddress: string
  secondaryWallet: string
  walletType: string
  referralCode: string
  email: string
  ensName: string
  useOtherWallet: boolean
  notes: string
}

export interface OrderConfirmationData {
  transactionId: string
  date: string
  total: number
  subtotal: number
  discount: number
  networkFee: number
  wallet: string
  items: CartItem[]
  network: string
}
