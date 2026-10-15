import * as React from 'react'
import {
  User,
  Wallet,
  Activity,
  Heart,
  Tag,
  Download,
  HelpCircle,
  LogOut,
  ChevronDown,
  Check,
  Plus,
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { api } from '@/src/services/api'
import { cn } from '@/src/lib/utils'

export interface WalletsViewProps {
  onNavigateTab?: (tab: string) => void
  onLogout?: () => void
  onSaved?: (message: string) => void
}

export const WalletsView: React.FC<WalletsViewProps> = ({
  onNavigateTab,
  onLogout,
  onSaved,
}) => {
  // Form state matching Carteiras desktop.jpg
  const [displayName, setDisplayName] = React.useState('Nova Sato')
  const [walletNickname, setWalletNickname] = React.useState('Minha Carteira Principal')
  const [network, setNetwork] = React.useState('Ethereum')
  const [profileName, setProfileName] = React.useState('Galeria Kurio Principal')
  const [walletAddress, setWalletAddress] = React.useState('0xA91F9a38C201C46E82C09b')
  const [secondaryWallet, setSecondaryWallet] = React.useState('')
  const [walletType, setWalletType] = React.useState('Coinbase Wallet')
  const [referralCode, setReferralCode] = React.useState('KURIO-2026')
  const [email, setEmail] = React.useState('nova.sato@kurio.art')
  const [ensName, setEnsName] = React.useState('novasato')

  const [sameAsPrimary, setSameAsPrimary] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  // Fetch wallets on mount
  React.useEffect(() => {
    api
      .get('/wallets')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const w = res.data[0]
          if (w.displayName) setDisplayName(w.displayName)
          if (w.nickname) setWalletNickname(w.nickname)
          if (w.network) setNetwork(w.network)
          if (w.profileName) setProfileName(w.profileName)
          if (w.address) setWalletAddress(w.address)
          if (w.secondaryWallet) setSecondaryWallet(w.secondaryWallet)
          if (w.type) setWalletType(w.type)
          if (w.referralCode) setReferralCode(w.referralCode)
          if (w.email) setEmail(w.email)
          if (w.ensName) setEnsName(w.ensName)
        }
      })
      .catch(() => {
        // fallback
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      await api.put('/wallets', {
        isPrimary: true,
        displayName,
        nickname: walletNickname,
        network,
        profileName,
        address: walletAddress,
        secondaryWallet,
        type: walletType,
        referralCode,
        email,
        ensName,
      })
      setFeedback('Carteira principal salva com sucesso!')
      onSaved?.('Carteira principal salva com sucesso!')
      setTimeout(() => setFeedback(null), 3000)
    } catch (err: any) {
      setFeedback(err.message || 'Erro ao salvar a carteira.')
    } finally {
      setIsSaving(false)
    }
  }

  const navItems = [
    { id: 'profile', label: 'Dados do perfil', icon: User, active: false },
    { id: 'wallets', label: 'Carteiras', icon: Wallet, active: true },
    { id: 'activity', label: 'Atividade', icon: Activity, active: false },
    { id: 'watchlist', label: 'Lista de interesse', icon: Heart, active: false },
    { id: 'offers', label: 'Ofertas', icon: Tag, active: false },
    { id: 'downloads', label: 'Arquivos baixados', icon: Download, active: false },
    { id: 'support', label: 'Suporte', icon: HelpCircle, active: false },
  ]

  return (
    <div className="w-full min-h-screen bg-[#0D0B0A] text-[#F3E8E2] pb-24 sm:pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================= LEFT SIDEBAR (Meu perfil) ================= */}
          <aside className="lg:col-span-3 space-y-4">
            <h3 className="font-mono text-base font-bold text-[#F5F2EB] tracking-wide mb-4">
              Meu perfil
            </h3>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigateTab?.(item.id)}
                    className={cn(
                      'flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-mono text-xs transition-colors text-left relative',
                      item.active
                        ? 'text-[#E0A96D] bg-[#1A1410] font-bold border-l-2 border-[#E0A96D]'
                        : 'text-[#A8988B] hover:text-[#F5F2EB] hover:bg-[#16110E]'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-mono text-xs text-[#8C7C6F] hover:text-red-400 hover:bg-[#1A1410] transition-colors text-left pt-3"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sair</span>
              </button>
            </div>

            {/* Mobile Horizontal Tabs */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#241A14] no-scrollbar">
              {navItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateTab?.(item.id)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-colors shrink-0',
                    item.active
                      ? 'bg-[#E0A96D] text-[#0D0B0A] font-bold'
                      : 'bg-[#18120E] text-[#A8988B] border border-[#2D231B]'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* ================= RIGHT CONTENT: Carteira principal ================= */}
          <main className="lg:col-span-9 space-y-10">
            {/* 1. Carteira Principal */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-base font-bold text-[#F5F2EB] tracking-wide">
                  Carteira principal
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setWalletAddress('0x' + Math.random().toString(16).substring(2, 42))
                    setFeedback('Novo endereço gerado.')
                  }}
                  className="font-mono text-xs text-[#E0A96D] hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              <p className="font-mono text-xs text-[#8C7C6F] leading-relaxed">
                Estas carteiras ficam disponíveis no pagamento e para receber NFTs
                comprados.
              </p>

              {feedback && (
                <div className="rounded-xl border border-[#E0A96D]/40 bg-[#1F1712] p-3 text-xs font-mono text-[#E0A96D] flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                {/* Row 1: Nome de exibição & Apelido da carteira */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Nome de exibição<span className="text-[#E0A96D]">*</span>
                    </label>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Apelido da carteira<span className="text-[#E0A96D]">*</span>
                    </label>
                    <Input
                      type="text"
                      value={walletNickname}
                      onChange={(e) => setWalletNickname(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>
                </div>

                {/* Row 2: Rede & Nome do perfil */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Rede <span className="text-[#E0A96D]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
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
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>
                </div>

                {/* Row 3: Endereço da carteira & ENS secundária */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Endereço da carteira<span className="text-[#E0A96D]">*</span>
                    </label>
                    <Input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
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
                      value={secondaryWallet}
                      onChange={(e) => setSecondaryWallet(e.target.value)}
                      placeholder="ENS ou carteira secundária (opcional)"
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
                    />
                  </div>
                </div>

                {/* Row 4: Tipo de carteira & Código de indicação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Tipo de carteira<span className="text-[#E0A96D]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={walletType}
                        onChange={(e) => setWalletType(e.target.value)}
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
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>
                </div>

                {/* Row 5: E-mail & Nome ENS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      E-mail<span className="text-[#E0A96D]">*</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Nome ENS <span className="text-[#E0A96D]">*</span>
                    </label>
                    <div className="flex">
                      <Input
                        type="text"
                        value={ensName}
                        onChange={(e) => setEnsName(e.target.value)}
                        required
                        className="h-11 rounded-l-xl rounded-r-none border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                      />
                      <div className="h-11 flex items-center px-3 border border-l-0 border-[#2E2219] bg-[#1E1712] rounded-r-xl font-mono text-xs text-[#8C7C6F]">
                        .eth
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salvar carteira Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-11 px-7 rounded-xl bg-[#D48D48] text-[#0D0B0A] hover:bg-[#E0A96D] font-mono text-xs font-bold shadow-md shadow-[#D48D48]/20"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar carteira'}
                  </Button>
                </div>
              </form>
            </div>

            {/* 2. Carteira Secundária */}
            <div className="pt-8 border-t border-[#241A14] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-base font-bold text-[#F5F2EB]">
                  Carteira secundária
                </h3>
                <button
                  type="button"
                  onClick={() => setFeedback('Formulário de carteira secundária aberto.')}
                  className="font-mono text-xs text-[#E0A96D] hover:underline"
                >
                  Adicionar
                </button>
              </div>

              <p className="font-mono text-xs text-[#8C7C6F]">
                Você ainda não adicionou uma carteira secundária.
              </p>

              <div>
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAsPrimary}
                    onChange={(e) => setSameAsPrimary(e.target.checked)}
                    className="h-4 w-4 rounded-full border-[#3A2D23] bg-[#16110E] text-[#E0A96D] focus:ring-[#E0A96D]"
                  />
                  <span className="font-mono text-xs text-[#A8988B] hover:text-[#F3E8E2]">
                    Igual à carteira principal
                  </span>
                </label>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
export default WalletsView
