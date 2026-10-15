/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react'
import { Header } from '@/src/components/common/Header'
import { Footer } from '@/src/components/common/Footer'
import { MobileNavigation } from '@/src/components/common/MobileNavigation'
import { AuthModal, AuthMode } from '@/src/components/auth/AuthModal'
import { CartView } from '@/src/components/cart/CartView'
import { CheckoutView } from '@/src/components/checkout/CheckoutView'
import { OrderConfirmationModal } from '@/src/components/checkout/OrderConfirmationModal'
import { NFTDetailView } from '@/src/components/nft/NFTDetailView'
import { ProfileView } from '@/src/components/ProfileView'
import { WalletsView } from '@/src/components/WalletsView'
import { Home } from '@/src/pages/Home'
import { NFT } from '@/src/types/nft'
import { CartItem, OrderConfirmationData, CollectorProfile } from '@/src/types/cart'
import { MOCK_NFTS } from '@/src/mocks/nftData'
import { api } from '@/src/services/api'
import { socketSimulator } from '@/src/services/socket'
import { CheckCircle2 } from 'lucide-react'

export type CurrentView =
  | 'home'
  | 'cart'
  | 'checkout'
  | 'nft-details'
  | 'profile'
  | 'wallets'

export default function App() {
  const [currentView, setCurrentView] = React.useState<CurrentView>('home')
  const [activeNav, setActiveNav] = React.useState('inicio')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false)

  // Auth Modal state
  const [isAuthOpen, setIsAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<AuthMode>('login')
  const [currentUser, setCurrentUser] = React.useState<{
    name: string
    email: string
  } | null>(null)

  // NFT Details State
  const [viewingNFT, setViewingNFT] = React.useState<NFT | null>(null)

  // Order Confirmation State
  const [isOrderConfirmedOpen, setIsOrderConfirmedOpen] = React.useState(false)
  const [orderConfirmationData, setOrderConfirmationData] =
    React.useState<OrderConfirmationData | null>(null)

  // Notification Toast State
  const [notification, setNotification] = React.useState<string | null>(null)

  // Cart State (Initialized with items matching screenshots)
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => [
    {
      id: 'cart-1',
      nft: MOCK_NFTS[0], // Emerald Ape #042
      quantity: 2,
      edition: '1/50',
      unitPrice: 1.19,
    },
    {
      id: 'cart-2',
      nft: MOCK_NFTS[4], // Violet Nomad #314
      quantity: 6,
      edition: '1/1',
      unitPrice: 1.39,
    },
    {
      id: 'cart-3',
      nft: MOCK_NFTS[5], // Ivory Baron #088
      quantity: 9,
      edition: '1/10',
      unitPrice: 1.79,
    },
  ])

  // Check existing session on mount via MSW api
  React.useEffect(() => {
    api
      .get('/auth/session')
      .then((res) => {
        if (res.data?.user) {
          setCurrentUser(res.data.user)
        }
      })
      .catch(() => {
        // no active session
      })
  }, [])

  // Listen to simulated real-time socket events
  React.useEffect(() => {
    const unsubNft = socketSimulator.on('nft.updated', (event) => {
      showToast(`Atualização em tempo real: Preço do NFT atualizado!`)
    })
    const unsubOrder = socketSimulator.on('order.updated', (event) => {
      showToast(`Status do pedido atualizado: ${event.status}`)
    })
    return () => {
      unsubNft()
      unsubOrder()
    }
  }, [])

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev))
    }, 3000)
  }

  // Cart operations
  const handleUpdateQuantity = async (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta
            return nextQty > 0 ? { ...item, quantity: nextQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const handleRemoveItem = async (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
    try {
      await api.delete(`/cart/${id}`)
    } catch {
      // fallback
    }
    showToast('Item removido do carrinho.')
  }

  const handleAddToCart = async (nft: NFT, quantity = 1, edition = '1/50') => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      nft,
      quantity,
      edition,
      unitPrice: nft.price,
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.nft.id === nft.id)
      if (existing) {
        return prev.map((item) =>
          item.nft.id === nft.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, newItem]
    })

    try {
      await api.post('/cart', newItem)
    } catch {
      // fallback
    }
    showToast(`"${nft.name}" adicionado ao carrinho!`)
  }

  const handleBuyNow = (nft: NFT, quantity = 1, edition = '1/50') => {
    handleAddToCart(nft, quantity, edition)
    setCurrentView('checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectNFT = (nft: NFT) => {
    setViewingNFT(nft)
    setCurrentView('nft-details')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirmPurchase = async (data: {
    profile: CollectorProfile
    selectedWallet: string
    total: number
    items: CartItem[]
  }) => {
    try {
      const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const res = await api.post(
        '/orders',
        {
          profile: data.profile,
          selectedWallet: data.selectedWallet,
          items: data.items,
          total: data.total,
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        }
      )

      const confirmation: OrderConfirmationData = res.data
      setOrderConfirmationData(confirmation)
      setIsOrderConfirmedOpen(true)
      setCartItems([])
      showToast('Transação confirmada na blockchain via MSW API!')
    } catch (err: any) {
      showToast(err.message || 'Erro ao processar transação.')
    }
  }

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-[#0D0B0A] text-[#F3E8E2] flex flex-col font-sans">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 flex items-center gap-2 rounded-xl border border-[#E0A96D]/40 bg-[#1A1410] px-4 py-3 text-xs font-semibold text-[#F5F2EB] shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 font-mono">
          <CheckCircle2 className="h-4 w-4 text-[#E0A96D]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Responsive Header */}
      <Header
        activeNav={currentView === 'home' ? activeNav : 'mercado'}
        onNavClick={(nav) => {
          setActiveNav(nav)
          if (nav === 'inicio') {
            setCurrentView('home')
          } else {
            setCurrentView('home')
            showToast(`Navegando para: ${nav.toUpperCase()}`)
          }
        }}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => {
          setCurrentView('cart')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onOpenFiltersSheet={() => {
          if (currentView !== 'home') {
            setCurrentView('home')
          }
          setIsMobileFilterOpen(true)
        }}
        currentUser={currentUser}
        onProfileClick={() => {
          setCurrentView('profile')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onLogout={async () => {
          try {
            await api.post('/auth/logout')
          } catch {
            // fallback
          }
          setCurrentUser(null)
          showToast('Sessão encerrada com sucesso.')
          setCurrentView('home')
        }}
        onLoginClick={() => {
          setAuthMode('login')
          setIsAuthOpen(true)
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            searchQuery={searchQuery}
            heroImage="/assets/hero-nft.png"
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
            onSelectNFT={handleSelectNFT}
            onToggleLike={(_id) => showToast('Favoritos atualizados')}
            onExploreGenesis={() => {
              showToast('Explorando Lançamentos Gênesis')
              document
                .getElementById('catalogo-nfts')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
            onExploreCurated={() => {
              showToast('Explorando Coleções Curadas')
              document
                .getElementById('catalogo-nfts')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
            onReadArticle={(slug) => showToast(`Abrindo artigo: ${slug}`)}
            onSubscribeNewsletter={(email) =>
              showToast(`Inscrição confirmada para ${email}!`)
            }
          />
        )}

        {currentView === 'cart' && (
          <CartView
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => {
              setCurrentView('checkout')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onContinueShopping={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSelectRecommendedNFT={handleSelectNFT}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            items={cartItems}
            onBackToCart={() => {
              setCurrentView('cart')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onConfirmPurchase={handleConfirmPurchase}
          />
        )}

        {currentView === 'nft-details' && viewingNFT && (
          <NFTDetailView
            nft={viewingNFT}
            onBack={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onAddToCart={(nft, quantity, edition) => {
              handleAddToCart(nft, quantity, edition)
            }}
            onBuyNow={(nft, quantity, edition) => {
              handleBuyNow(nft, quantity, edition)
            }}
            onSelectNFT={handleSelectNFT}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            onNavigateTab={(tab) => {
              if (tab === 'wallets') setCurrentView('wallets')
              else if (tab === 'profile') setCurrentView('profile')
              else showToast(`Aba ${tab.toUpperCase()} selecionada`)
            }}
            onLogout={() => {
              setCurrentUser(null)
              setCurrentView('home')
              showToast('Sessão encerrada.')
            }}
            onSaved={(msg) => showToast(msg)}
          />
        )}

        {currentView === 'wallets' && (
          <WalletsView
            onNavigateTab={(tab) => {
              if (tab === 'profile') setCurrentView('profile')
              else if (tab === 'wallets') setCurrentView('wallets')
              else showToast(`Aba ${tab.toUpperCase()} selecionada`)
            }}
            onLogout={() => {
              setCurrentUser(null)
              setCurrentView('home')
              showToast('Sessão encerrada.')
            }}
            onSaved={(msg) => showToast(msg)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Navigation Dock */}
      <MobileNavigation
        cartCount={totalCartCount}
        activeTab={
          currentView === 'home'
            ? 'home'
            : currentView === 'cart'
            ? 'cart'
            : currentView === 'profile' || currentView === 'wallets'
            ? 'profile'
            : ''
        }
        onTabChange={(tab) => {
          if (tab === 'home') {
            setCurrentView('home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else if (tab === 'cart') {
            setCurrentView('cart')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else if (tab === 'favorites') {
            showToast('Visualizando lista de favoritos')
          } else if (tab === 'profile') {
            if (currentUser) {
              setCurrentView('profile')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              setAuthMode('login')
              setIsAuthOpen(true)
            }
          }
        }}
        onScanClick={() => {
          // Trigger a simulated real-time price change via socket
          socketSimulator.simulatePriceDrop('nft-1', 0.99)
          showToast('Sincronização em tempo real via Socket.IO!')
        }}
      />

      {/* Unified Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        authMode={authMode}
        setAuthMode={setAuthMode}
        onSuccess={async (userData) => {
          try {
            if (authMode === 'login') {
              const res = await api.post('/auth/login', {
                email: userData.email,
                password: 'password123',
              })
              setCurrentUser(res.data.user)
            } else {
              const res = await api.post('/auth/register', {
                name: userData.name,
                email: userData.email,
                password: 'password123',
              })
              setCurrentUser(res.data.user)
            }
          } catch {
            setCurrentUser(userData)
          }
          showToast(`Bem-vindo à Kurio, ${userData.name}!`)
        }}
        onForgotPassword={() => {
          showToast('Instruções enviadas para seu e-mail.')
        }}
        onSocialLogin={async (provider) => {
          const providerName = provider === 'google' ? 'Google' : 'Facebook'
          const user = {
            name: `${providerName} Collector`,
            email: `collector@${provider}.com`,
          }
          setCurrentUser(user)
          setIsAuthOpen(false)
          showToast(`Conectado com sucesso via ${providerName}!`)
        }}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isOrderConfirmedOpen}
        onClose={() => {
          setIsOrderConfirmedOpen(false)
          setCurrentView('home')
        }}
        orderData={orderConfirmationData}
        onViewEtherscan={(txId) => {
          showToast(`Consultando transação ${txId} no explorador de blocos...`)
        }}
      />
    </div>
  )
}
