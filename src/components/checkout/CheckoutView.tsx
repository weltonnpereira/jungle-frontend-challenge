import * as React from 'react'
import {
  ChevronLeft,
  ChevronDown,
  MoreVertical,
  Check,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { CartItem, CollectorProfile } from '@/src/types/cart'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Badge } from '@/src/components/ui/badge'
import { cn } from '@/src/lib/utils'

export interface CheckoutViewProps {
  items: CartItem[]
  onBackToCart: () => void
  onConfirmPurchase: (orderData: {
    profile: CollectorProfile
    selectedWallet: string
    total: number
    items: CartItem[]
  }) => void
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  onBackToCart,
  onConfirmPurchase,
}) => {
  // Collector Profile Form State
  const [profile, setProfile] = React.useState<CollectorProfile>({
    displayName: 'Nova Sato',
    username: '@novasato',
    network: 'Ethereum',
    profileName: 'Galeria Kurio Principal',
    walletAddress: '0xA91F9a38C201C46E82C09b',
    secondaryWallet: '',
    walletType: 'Coinbase Wallet',
    referralCode: 'KURIO-2026',
    email: 'nova.sato@kurio.art',
    ensName: 'novasato',
    useOtherWallet: false,
    notes: '',
  })

  // Selected Wallet
  const [selectedWallet, setSelectedWallet] = React.useState<string>(
    'Coinbase Wallet'
  )
  const [selectedMobileAccount, setSelectedMobileAccount] = React.useState<
    'reserva' | 'principal'
  >('reserva')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  )
  const discountAmount = 0
  const networkFee = items.length > 0 ? 0.016 : 0
  const total = subtotal - discountAmount + networkFee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onConfirmPurchase({
        profile,
        selectedWallet,
        total,
        items,
      })
    }, 800)
  }

  return (
    <div className="w-full min-h-screen bg-[#0D0B0A] text-[#F3E8E2] pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Breadcrumb (Desktop) */}
        <div className="hidden sm:flex items-center gap-2 pt-6 text-xs font-mono text-[#8C7C6F]">
          <button
            onClick={onBackToCart}
            className="hover:text-[#E0A96D] transition-colors"
          >
            Início
          </button>
          <span>/</span>
          <button
            onClick={onBackToCart}
            className="hover:text-[#E0A96D] transition-colors"
          >
            Mercado
          </button>
          <span>/</span>
          <span className="text-[#F5F2EB] font-bold">Pagamento</span>
        </div>

        {/* Mobile Header with Back Button */}
        <div className="sm:hidden flex items-center gap-3 pt-4 pb-2 border-b border-[#241A14]">
          <button
            type="button"
            onClick={onBackToCart}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18120E] border border-[#2D231B] text-[#F3E8E2] active:scale-95"
            aria-label="Voltar para o carrinho"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="font-mono text-lg font-bold text-[#F5F2EB]">
            Pagamento com carteira
          </h1>
        </div>

        {/* ================= DESKTOP VIEW (sm and up) ================= */}
        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Collector Profile Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-mono text-base font-bold text-[#F5F2EB] tracking-wide">
              Perfil do colecionador
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    Nome de exibição<span className="text-[#E0A96D]">*</span>
                  </label>
                  <Input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) =>
                      setProfile({ ...profile, displayName: e.target.value })
                    }
                    required
                    className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    Nome de usuário<span className="text-[#E0A96D]">*</span>
                  </label>
                  <Input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    required
                    className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    Rede<span className="text-[#E0A96D]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={profile.network}
                      onChange={(e) =>
                        setProfile({ ...profile, network: e.target.value })
                      }
                      className="w-full h-11 appearance-none rounded-xl border border-[#2E2219] bg-[#16110E] px-4 font-mono text-xs text-[#F3E8E2] focus:outline-none focus:border-[#E0A96D]"
                    >
                      <option value="Ethereum">Ethereum</option>
                      <option value="Polygon">Polygon</option>
                      <option value="Solana">Solana</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7C6F] pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    Nome do perfil<span className="text-[#E0A96D]">*</span>
                  </label>
                  <Input
                    type="text"
                    value={profile.profileName}
                    onChange={(e) =>
                      setProfile({ ...profile, profileName: e.target.value })
                    }
                    required
                    className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    Endereço da carteira
                    <span className="text-[#E0A96D]">*</span>
                  </label>
                  <Input
                    type="text"
                    value={profile.walletAddress}
                    onChange={(e) =>
                      setProfile({ ...profile, walletAddress: e.target.value })
                    }
                    placeholder="Endereço 0x da carteira"
                    required
                    className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    ENS ou carteira secundária (opcional)
                  </label>
                  <Input
                    type="text"
                    value={profile.secondaryWallet}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        secondaryWallet: e.target.value,
                      })
                    }
                    placeholder="ENS ou carteira secundária (opcional)"
                    className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    Tipo de carteira<span className="text-[#E0A96D]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={profile.walletType}
                      onChange={(e) => {
                        setProfile({ ...profile, walletType: e.target.value })
                        setSelectedWallet(e.target.value)
                      }}
                      className="w-full h-11 appearance-none rounded-xl border border-[#2E2219] bg-[#16110E] px-4 font-mono text-xs text-[#F3E8E2] focus:outline-none focus:border-[#E0A96D]"
                    >
                      <option value="Coinbase Wallet">Coinbase Wallet</option>
                      <option value="MetaMask">MetaMask</option>
                      <option value="WalletConnect">WalletConnect</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7C6F] pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    Código de indicação<span className="text-[#E0A96D]">*</span>
                  </label>
                  <Input
                    type="text"
                    value={profile.referralCode}
                    onChange={(e) =>
                      setProfile({ ...profile, referralCode: e.target.value })
                    }
                    required
                    className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    E-mail<span className="text-[#E0A96D]">*</span>
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    required
                    className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-[#A8988B]">
                    Nome ENS<span className="text-[#E0A96D]">*</span>
                  </label>
                  <div className="flex">
                    <Input
                      type="text"
                      value={profile.ensName}
                      onChange={(e) =>
                        setProfile({ ...profile, ensName: e.target.value })
                      }
                      required
                      className="h-11 rounded-l-xl rounded-r-none border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                    <div className="h-11 flex items-center px-3 border border-l-0 border-[#2E2219] bg-[#1E1712] rounded-r-xl font-mono text-xs text-[#8C7C6F]">
                      .eth
                    </div>
                  </div>
                </div>
              </div>

              {/* Radio: Usar outra carteira? */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profile.useOtherWallet}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        useOtherWallet: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded-full border-[#3A2D23] bg-[#16110E] text-[#E0A96D] focus:ring-[#E0A96D]"
                  />
                  <span className="font-mono text-xs text-[#A8988B] hover:text-[#F3E8E2]">
                    Usar outra carteira?
                  </span>
                </label>
              </div>

              {/* Textarea: Observação do colecionador */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-mono text-xs text-[#A8988B]">
                  Observação do colecionador (opcional)
                </label>
                <textarea
                  value={profile.notes}
                  onChange={(e) =>
                    setProfile({ ...profile, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-xl border border-[#2E2219] bg-[#16110E] p-3 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus:outline-none focus:border-[#E0A96D]"
                />
              </div>
            </form>
          </div>

          {/* Right Column: Seus NFTs & Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#2D231B] bg-[#16110E] p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D231B]">
                <h3 className="font-mono text-base font-bold text-[#F5F2EB]">
                  Seus NFTs
                </h3>
                <span className="font-mono text-xs text-[#8C7C6F]">Subtotal</span>
              </div>

              {/* NFTs list */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#2D231B] bg-[#1E1712]">
                        <img
                          src={item.nft.image}
                          alt={item.nft.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-mono text-xs font-bold text-[#F5F2EB] truncate">
                          {item.nft.name}{' '}
                          <span className="text-[#8C7C6F] font-normal">
                            (x {item.quantity})
                          </span>
                        </h5>
                        <span className="font-mono text-[10px] text-[#6E5D50] block">
                          ID do token: {item.nft.tokenId}
                        </span>
                      </div>
                    </div>

                    <div className="font-mono text-xs font-bold text-[#E0A96D] shrink-0">
                      {(item.unitPrice * item.quantity).toFixed(2)} ETH
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  className="font-mono text-xs text-[#A8988B] hover:text-[#E0A96D] transition-colors"
                >
                  Tem um código promocional? Aplique aqui
                </button>
              </div>

              {/* Subtotals */}
              <div className="space-y-2.5 pt-3 border-t border-[#261E18] text-xs font-mono">
                <div className="flex justify-between items-center text-[#A8988B]">
                  <span>Subtotal</span>
                  <span className="text-[#F3E8E2]">{subtotal.toFixed(2)} ETH</span>
                </div>
                <div className="flex justify-between items-center text-[#A8988B]">
                  <span>Desconto do lançamento</span>
                  <span className="text-[#8C7C6F]">(-) 00.00</span>
                </div>
                <div className="flex justify-between items-start text-[#A8988B]">
                  <div>
                    <span>Taxa de rede</span>
                    <span className="block text-[10px] text-[#6E5D50]">
                      Taxa estimada
                    </span>
                  </div>
                  <span className="text-[#F3E8E2]">
                    {networkFee.toFixed(3)} ETH
                  </span>
                </div>
                <div className="pt-3 border-t border-[#261E18] flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#F5F2EB]">Total</span>
                  <span className="font-mono text-lg font-bold text-[#E0A96D]">
                    {total.toFixed(3)} ETH
                  </span>
                </div>
              </div>

              {/* Carteira e rede selection */}
              <div className="space-y-3 pt-3 border-t border-[#261E18]">
                <h4 className="font-mono text-xs font-bold text-[#F5F2EB] tracking-wide text-center">
                  Carteira e rede
                </h4>

                {/* Compatibility Badges */}
                <div className="rounded-xl border border-[#2D231B] bg-[#140F0D] p-2.5 text-center">
                  <span className="font-mono text-[10px] tracking-widest text-[#E0A96D]">
                    METAMASK &nbsp;•&nbsp; WALLETCONNECT &nbsp;•&nbsp; COINBASE
                  </span>
                </div>

                {/* Wallet Radio Buttons */}
                <div className="space-y-2">
                  {[
                    { id: 'MetaMask', label: 'MetaMask' },
                    { id: 'Coinbase Wallet', label: 'Coinbase Wallet' },
                  ].map((w) => {
                    const isSelected = selectedWallet === w.id
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWallet(w.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl border p-3 text-left font-mono text-xs transition-colors',
                          isSelected
                            ? 'border-[#E0A96D] bg-[#221812] text-[#F5F2EB]'
                            : 'border-[#2D231B] bg-[#16110E] text-[#A8988B] hover:border-[#3D2E24]'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                            isSelected
                              ? 'border-[#E0A96D] bg-[#E0A96D]'
                              : 'border-[#5A4739]'
                          )}
                        >
                          {isSelected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0D0B0A]" />
                          )}
                        </span>
                        <span>{w.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Confirm Purchase Button */}
              <div className="pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-[#D48D48] font-mono text-xs font-bold text-[#0D0B0A] hover:bg-[#E0A96D] shadow-lg shadow-[#D48D48]/15"
                >
                  {isSubmitting ? 'Confirmando transação...' : 'Confirmar compra'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE VIEW (sm:hidden) ================= */}
        <div className="sm:hidden space-y-6">
          {/* Section: Carteira conectada */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-bold text-[#F5F2EB]">
                Carteira conectada
              </h3>
              <button
                type="button"
                className="font-mono text-xs text-[#E0A96D] hover:underline"
              >
                Trocar carteira
              </button>
            </div>

            {/* Wallet Account Card 1: Reserva */}
            <div
              onClick={() => setSelectedMobileAccount('reserva')}
              className={cn(
                'relative flex items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer',
                selectedMobileAccount === 'reserva'
                  ? 'border-[#E0A96D]/60 bg-[#1D1612]'
                  : 'border-[#2D231B] bg-[#16110E]'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                    selectedMobileAccount === 'reserva'
                      ? 'border-[#E0A96D] bg-[#E0A96D]'
                      : 'border-[#5A4739]'
                  )}
                >
                  {selectedMobileAccount === 'reserva' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0D0B0A]" />
                  )}
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-mono text-xs font-bold text-[#F5F2EB]">
                    Reserva
                  </h4>
                  <p className="font-mono text-[11px] text-[#A8988B]">
                    nova.kurio.eth
                  </p>
                  <p className="font-mono text-[10px] text-[#6E5D50]">
                    Rede Polygon
                  </p>
                </div>
              </div>
              <button type="button" className="p-1 text-[#8C7C6F]">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Wallet Account Card 2: Principal */}
            <div
              onClick={() => setSelectedMobileAccount('principal')}
              className={cn(
                'relative flex items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer',
                selectedMobileAccount === 'principal'
                  ? 'border-[#E0A96D]/60 bg-[#1D1612]'
                  : 'border-[#2D231B] bg-[#16110E]'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                    selectedMobileAccount === 'principal'
                      ? 'border-[#E0A96D] bg-[#E0A96D]'
                      : 'border-[#5A4739]'
                  )}
                >
                  {selectedMobileAccount === 'principal' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0D0B0A]" />
                  )}
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-mono text-xs font-bold text-[#F5F2EB]">
                    Principal
                  </h4>
                  <p className="font-mono text-[11px] text-[#A8988B]">
                    0xA91F...E82C
                  </p>
                  <p className="font-mono text-[10px] text-[#6E5D50]">
                    Rede principal Ethereum
                  </p>
                </div>
              </div>
              <button type="button" className="p-1 text-[#8C7C6F]">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Section: Carteira e rede */}
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-bold text-[#F5F2EB]">
              Carteira e rede
            </h3>

            {/* WalletConnect */}
            <div
              onClick={() => setSelectedWallet('WalletConnect')}
              className={cn(
                'flex items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer',
                selectedWallet === 'WalletConnect'
                  ? 'border-[#E0A96D]/60 bg-[#1D1612]'
                  : 'border-[#2D231B] bg-[#16110E]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#261B14] font-mono text-xs font-bold text-[#E0A96D]">
                  W
                </div>
                <span className="font-mono text-xs text-[#F5F2EB]">
                  WalletConnect
                </span>
              </div>
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                  selectedWallet === 'WalletConnect'
                    ? 'border-[#E0A96D] bg-[#E0A96D]'
                    : 'border-[#5A4739]'
                )}
              >
                {selectedWallet === 'WalletConnect' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0D0B0A]" />
                )}
              </span>
            </div>

            {/* MetaMask */}
            <div
              onClick={() => setSelectedWallet('MetaMask')}
              className={cn(
                'flex items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer',
                selectedWallet === 'MetaMask'
                  ? 'border-[#E0A96D]/60 bg-[#1D1612]'
                  : 'border-[#2D231B] bg-[#16110E]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#261B14] font-mono text-xs font-bold text-[#E0A96D]">
                  M
                </div>
                <span className="font-mono text-xs text-[#F5F2EB]">
                  MetaMask
                </span>
              </div>
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                  selectedWallet === 'MetaMask'
                    ? 'border-[#E0A96D] bg-[#E0A96D]'
                    : 'border-[#5A4739]'
                )}
              >
                {selectedWallet === 'MetaMask' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0D0B0A]" />
                )}
              </span>
            </div>

            {/* Coinbase Wallet */}
            <div
              onClick={() => setSelectedWallet('Coinbase Wallet')}
              className={cn(
                'flex items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer',
                selectedWallet === 'Coinbase Wallet'
                  ? 'border-[#E0A96D]/60 bg-[#1D1612]'
                  : 'border-[#2D231B] bg-[#16110E]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#261B14] font-mono text-xs font-bold text-[#E0A96D]">
                  <Wallet className="h-4 w-4 text-[#E0A96D]" />
                </div>
                <span className="font-mono text-xs text-[#F5F2EB]">
                  Coinbase Wallet
                </span>
              </div>
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                  selectedWallet === 'Coinbase Wallet'
                    ? 'border-[#E0A96D] bg-[#E0A96D]'
                    : 'border-[#5A4739]'
                )}
              >
                {selectedWallet === 'Coinbase Wallet' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0D0B0A]" />
                )}
              </span>
            </div>
          </div>

          {/* Mobile Total Row & CTA */}
          <div className="pt-4 space-y-4">
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-sm font-bold text-[#F5F2EB]">Total:</span>
              <span className="text-xl font-bold text-[#E0A96D]">
                {total.toFixed(3)} ETH
              </span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-[#D48D48] font-mono text-xs font-bold text-[#0D0B0A] hover:bg-[#E0A96D] active:scale-[0.98] shadow-lg shadow-[#D48D48]/20"
            >
              {isSubmitting ? 'Processando transação...' : 'Confirmar compra'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
