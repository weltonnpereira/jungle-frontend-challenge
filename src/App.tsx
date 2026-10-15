/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Header } from "@/src/components/common/Header";
import { Footer } from "@/src/components/common/Footer";
import { MobileNavigation } from "@/src/components/common/MobileNavigation";
import { AuthModal, AuthMode } from "@/src/components/auth/AuthModal";
import { CartView } from "@/src/components/cart/CartView";
import { CheckoutView } from "@/src/components/checkout/CheckoutView";
import { OrderConfirmationModal } from "@/src/components/checkout/OrderConfirmationModal";
import { NFTDetailView } from "@/src/components/nft/NFTDetailView";
import { Home } from "@/src/pages/Home";
import { NFT } from "@/src/types/nft";
import {
  CartItem,
  OrderConfirmationData,
  CollectorProfile,
} from "@/src/types/cart";
import { MOCK_NFTS } from "@/src/mocks/nftData";
import { CheckCircle2 } from "lucide-react";
import { useMediaQuery } from "./hooks/use-media-query";

export type CurrentView = "home" | "cart" | "checkout" | "nft-details";

export default function App() {
  function useIsMounted() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return mounted;
  }

  const [currentView, setCurrentView] = React.useState<CurrentView>("home");
  const [activeNav, setActiveNav] = React.useState("inicio");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  // Auth Modal state
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<AuthMode>("login");
  const [currentUser, setCurrentUser] = React.useState<{
    name: string;
    email: string;
  } | null>(null);

  // NFT Details State
  const [viewingNFT, setViewingNFT] = React.useState<NFT | null>(null);

  // Order Confirmation State
  const [isOrderConfirmedOpen, setIsOrderConfirmedOpen] = React.useState(false);
  const [orderConfirmationData, setOrderConfirmationData] =
    React.useState<OrderConfirmationData | null>(null);

  // Notification Toast State
  const [notification, setNotification] = React.useState<string | null>(null);

  // Cart State (Initialized with the exact items shown in Carrinho de NFTs desktop 2.jpg)
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => [
    {
      id: "cart-1",
      nft: MOCK_NFTS[0], // Emerald Ape #042
      quantity: 2,
      edition: "1/50",
      unitPrice: 1.19,
    },
    {
      id: "cart-2",
      nft: MOCK_NFTS[4], // Violet Nomad #314
      quantity: 6,
      edition: "1/1",
      unitPrice: 1.39,
    },
    {
      id: "cart-3",
      nft: MOCK_NFTS[5], // Ivory Baron #088
      quantity: 9,
      edition: "1/10",
      unitPrice: 1.79,
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Cart operations
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const nextQty = item.quantity + delta;
              return nextQty > 0 ? { ...item, quantity: nextQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removido do carrinho.");
  };

  const handleAddToCart = (nft: NFT, quantity = 1, edition = "1/50") => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.nft.id === nft.id);
      if (existing) {
        return prev.map((item) =>
          item.nft.id === nft.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          nft,
          quantity,
          edition,
          unitPrice: nft.price,
        },
      ];
    });
    showToast(`"${nft.name}" adicionado ao carrinho!`);
  };

  const handleBuyNow = (nft: NFT, quantity = 1, edition = "1/50") => {
    handleAddToCart(nft, quantity, edition);
    setCurrentView("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectNFT = (nft: NFT) => {
    setViewingNFT(nft);
    setCurrentView("nft-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmPurchase = (data: {
    profile: CollectorProfile;
    selectedWallet: string;
    total: number;
    items: CartItem[];
  }) => {
    const confirmation: OrderConfirmationData = {
      transactionId: "0xA91F9a38C201C46E82C09b",
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      total: data.total,
      subtotal: data.items.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0,
      ),
      discount: 0,
      networkFee: 0.016,
      wallet: data.selectedWallet,
      items: [...data.items],
      network: data.profile.network,
    };

    setOrderConfirmationData(confirmation);
    setIsOrderConfirmedOpen(true);
    setCartItems([]); // Empty cart after successful purchase
    showToast("Transação confirmada na blockchain!");
  };

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const isDesktop = useMediaQuery("(min-width: 640px)");
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F3E8E2] flex flex-col font-sans">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 flex items-center gap-2 rounded-xl border border-[#E0A96D]/40 bg-[#1A1410] px-4 py-3 text-xs font-semibold text-[#F5F2EB] shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 font-mono">
          <CheckCircle2 className="h-4 w-4 text-[#E0A96D]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Responsive Header */}
      <Header
        activeNav={currentView === "home" ? activeNav : "mercado"}
        onNavClick={(nav) => {
          setActiveNav(nav);
          if (nav === "inicio") {
            setCurrentView("home");
          } else {
            setCurrentView("home");
            showToast(`Navegando para: ${nav.toUpperCase()}`);
          }
        }}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => {
          setCurrentView("cart");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenFiltersSheet={() => {
          if (currentView !== "home") {
            setCurrentView("home");
          }
          setIsMobileFilterOpen(true);
        }}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          showToast("Sessão encerrada com sucesso.");
        }}
        onLoginClick={() => {
          setAuthMode("login");
          setIsAuthOpen(true);
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === "home" && (
          <Home
            searchQuery={searchQuery}
            heroImage="/assets/hero-nft.png"
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
            onSelectNFT={handleSelectNFT}
            onToggleLike={(_id) => showToast("Favoritos atualizados")}
            onExploreGenesis={() => {
              showToast("Explorando Lançamentos Gênesis");
              document
                .getElementById("catalogo-nfts")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            onExploreCurated={() => {
              showToast("Explorando Coleções Curadas");
              document
                .getElementById("catalogo-nfts")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            onReadArticle={(slug) => showToast(`Abrindo artigo: ${slug}`)}
          />
        )}

        {currentView === "cart" && (
          <CartView
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => {
              setCurrentView("checkout");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onContinueShopping={() => {
              setCurrentView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectRecommendedNFT={handleSelectNFT}
          />
        )}

        {currentView === "checkout" && (
          <CheckoutView
            items={cartItems}
            onBackToCart={() => {
              setCurrentView("cart");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onConfirmPurchase={handleConfirmPurchase}
          />
        )}

        {currentView === "nft-details" && viewingNFT && (
          <NFTDetailView
            nft={viewingNFT}
            onBack={() => {
              setCurrentView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={(nft, quantity, edition) => {
              handleAddToCart(nft, quantity, edition);
            }}
            onBuyNow={(nft, quantity, edition) => {
              handleBuyNow(nft, quantity, edition);
            }}
            onSelectNFT={handleSelectNFT}
          />
        )}
      </main>

      {/* Footer */}
      {(isDesktop ||
        !["checkout", "nft-details", "cart"].includes(currentView)) && (
        <Footer
          onSubscribeNewsletter={(email) =>
            showToast(`Inscrição confirmada para ${email}!`)
          }
        />
      )}

      {/* Mobile Sticky Navigation Dock */}
      <MobileNavigation
        cartCount={totalCartCount}
        activeTab={
          currentView === "home" ? "home" : currentView === "cart" ? "cart" : ""
        }
        onTabChange={(tab) => {
          if (tab === "home") {
            setCurrentView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (tab === "cart") {
            setCurrentView("cart");
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (tab === "favorites") {
            showToast("Visualizando lista de favoritos");
          } else if (tab === "profile") {
            if (currentUser) {
              showToast(`Perfil conectado: ${currentUser.name}`);
            } else {
              setAuthMode("login");
              setIsAuthOpen(true);
            }
          }
        }}
        onScanClick={() =>
          showToast("Abrindo leitor de QR e cunhagem rápida...")
        }
      />

      {/* Unified Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        authMode={authMode}
        setAuthMode={setAuthMode}
        onSuccess={(userData) => {
          setCurrentUser(userData);
          showToast(`Bem-vindo à Kurio, ${userData.name}!`);
        }}
        onForgotPassword={() => {
          showToast("Instruções enviadas para seu e-mail.");
        }}
        onSocialLogin={(provider) => {
          const providerName = provider === "google" ? "Google" : "Facebook";
          setCurrentUser({
            name: `${providerName} Collector`,
            email: `collector@${provider}.com`,
          });
          setIsAuthOpen(false);
          showToast(`Conectado com sucesso via ${providerName}!`);
        }}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isOrderConfirmedOpen}
        onClose={() => {
          setIsOrderConfirmedOpen(false);
          setCurrentView("home");
        }}
        orderData={orderConfirmationData}
        onViewEtherscan={(txId) => {
          showToast(`Consultando transação ${txId} no explorador de blocos...`);
        }}
      />
    </div>
  );
}
