/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react'
import { Header } from '@/src/components/common/Header'
import { Footer } from '@/src/components/common/Footer'
import { MobileNavigation } from '@/src/components/common/MobileNavigation'
import { Home } from '@/src/pages/Home'
import { NFT } from '@/src/types/nft'
import { MOCK_NFTS } from '@/src/mocks/nftData'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/src/components/ui/sheet'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { X, CheckCircle2, Wallet, ExternalLink } from 'lucide-react'

export default function App() {
  const [activeNav, setActiveNav] = React.useState('inicio')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false)
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [isLoginOpen, setIsLoginOpen] = React.useState(false)
  const [selectedNFT, setSelectedNFT] = React.useState<NFT | null>(null)
  const [notification, setNotification] = React.useState<string | null>(null)
  const [cartItems, setCartItems] = React.useState<NFT[]>(() => MOCK_NFTS.slice(0, 6))

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev))
    }, 3000)
  }

  const handleSelectNFT = (nft: NFT) => {
    setSelectedNFT(nft)
  }

  const handleAddToCart = (nft: NFT) => {
    if (!cartItems.some((item) => item.id === nft.id)) {
      setCartItems((prev) => [...prev, nft])
      showToast(`"${nft.name}" adicionado ao carrinho!`)
    } else {
      showToast(`"${nft.name}" já está no carrinho.`)
    }
    setSelectedNFT(null)
  }

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
    showToast('Item removido do carrinho.')
  }

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.price, 0)

  return (
    <div className="min-h-screen bg-[#0D0B0A] text-[#F3E8E2] flex flex-col font-sans">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 flex items-center gap-2 rounded-xl border border-[#E0A96D]/40 bg-[#1A1410] px-4 py-3 text-xs font-semibold text-[#F5F2EB] shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-[#E0A96D]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Responsive Header */}
      <Header
        activeNav={activeNav}
        onNavClick={(nav) => {
          setActiveNav(nav)
          if (nav !== 'inicio') {
            showToast(`Navegando para a seção: ${nav.toUpperCase()}`)
          }
        }}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFiltersSheet={() => setIsMobileFilterOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      {/* Main Home Page */}
      <main className="flex-1 pb-16">
        <Home
          searchQuery={searchQuery}
          heroImage="/assets/hero-nft.png"
          isMobileFilterOpen={isMobileFilterOpen}
          setIsMobileFilterOpen={setIsMobileFilterOpen}
          onSelectNFT={handleSelectNFT}
          onToggleLike={(id) => showToast('Favoritos atualizados')}
          onExploreGenesis={() => {
            showToast('Explorando Lançamentos Gênesis')
            document.getElementById('catalogo-nfts')?.scrollIntoView({ behavior: 'smooth' })
          }}
          onExploreCurated={() => {
            showToast('Explorando Coleções Curadas')
            document.getElementById('catalogo-nfts')?.scrollIntoView({ behavior: 'smooth' })
          }}
          onReadArticle={(slug) => showToast(`Abrindo artigo: ${slug}`)}
          onSubscribeNewsletter={(email) => showToast(`Inscrição confirmada para ${email}!`)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Navigation Dock */}
      <MobileNavigation
        cartCount={cartItems.length}
        onTabChange={(tab) => {
          if (tab === 'cart') setIsCartOpen(true)
          else if (tab === 'favorites') showToast('Visualizando lista de favoritos')
          else if (tab === 'profile') setIsLoginOpen(true)
        }}
        onScanClick={() => showToast('Abrindo leitor de QR e cunhagem rápida...')}
      />

      {/* Shopping Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-[#140F0D] border-l border-[#2E231B] p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <SheetHeader className="text-left pb-4 border-b border-[#2E231B]">
              <SheetTitle className="text-lg font-bold text-[#F5F2EB]">
                Carrinho de Compras ({cartItems.length})
              </SheetTitle>
              <SheetDescription className="text-xs text-[#A8988B]">
                Revise os NFTs selecionados antes de finalizar a transação na blockchain.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#8C7C6F]">
                  Seu carrinho está vazio.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-[#2D231B] bg-[#1A1410] p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-lg object-cover bg-[#221812]"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="truncate text-xs font-bold text-[#F5F2EB]">
                        {item.name}
                      </h5>
                      <span className="text-[11px] text-[#8C7C6F] block">
                        {item.collection}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#E0A96D]">
                        {item.price.toFixed(2)} {item.currency}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-1.5 text-[#8C7C6F] hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <SheetFooter className="pt-4 border-t border-[#2E231B] flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A8988B]">Total Estimado</span>
              <span className="font-mono text-base font-bold text-[#E0A96D]">
                {cartTotal.toFixed(2)} ETH
              </span>
            </div>
            <Button
              disabled={cartItems.length === 0}
              onClick={() => {
                showToast('Transação enviada para assinatura da carteira!')
                setIsCartOpen(false)
              }}
              className="w-full bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold"
            >
              Finalizar Compra
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#342921] bg-[#16120F] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedNFT(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-[#8C7C6F] hover:bg-[#201814] hover:text-[#F3E8E2]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden border border-[#2D231B] bg-[#201814]">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-3 text-left w-full">
                <Badge variant="rare" className="bg-[#D48D48] text-[#0D0B0A]">
                  {selectedNFT.rarity || 'Autêntico'}
                </Badge>
                <h3 className="text-xl font-bold text-[#F5F2EB]">
                  {selectedNFT.name}
                </h3>
                <p className="text-xs text-[#A8988B]">
                  Coleção: <span className="text-[#E0A96D]">{selectedNFT.collection}</span>
                </p>
                <p className="text-xs text-[#A8988B]">
                  Rede: <span className="text-[#F3E8E2]">{selectedNFT.network}</span>
                </p>

                <div className="pt-2">
                  <span className="text-xs text-[#8C7C6F] block">Preço Atual</span>
                  <span className="font-mono text-2xl font-black text-[#E0A96D]">
                    {selectedNFT.price.toFixed(2)} {selectedNFT.currency}
                  </span>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(selectedNFT)}
                    className="flex-1 bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold text-xs"
                  >
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login / Wallet Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#342921] bg-[#16120F] p-6 shadow-2xl text-center space-y-5">
            <button
              type="button"
              onClick={() => setIsLoginOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-[#8C7C6F] hover:bg-[#201814] hover:text-[#F3E8E2]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E0A96D]/15 text-[#E0A96D]">
              <Wallet className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#F5F2EB]">
                Conecte sua Carteira
              </h3>
              <p className="text-xs text-[#A8988B] mt-1">
                Acesse sua coleção ou adquira artes digitais selecionadas.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {['MetaMask', 'WalletConnect', 'Coinbase Wallet'].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    showToast(`Conectado com sucesso via ${w}!`)
                    setIsLoginOpen(false)
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-[#2D231B] bg-[#1A1410] px-4 py-3 text-xs font-semibold text-[#F3E8E2] hover:border-[#E0A96D] hover:bg-[#221812] transition-colors"
                >
                  <span>{w}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#8C7C6F]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
