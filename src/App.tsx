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
import { ProfileView } from "@/src/components/profile/ProfileView";
import { WalletsView } from "@/src/components/profile/WalletsView";
import { Home } from "@/src/pages/Home";
import { NFT } from "@/src/types/nft";
import {
  CartItem,
  OrderConfirmationData,
  CollectorProfile,
} from "@/src/types/cart";
import { MOCK_NFTS } from "@/src/mocks/nftData";
import { api } from "@/src/services/api";
import { socketSimulator } from "@/src/services/socket";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useMediaQuery } from "./hooks/use-media-query";
import { NotificationItem, TypeMessage } from "./types/notify";

export type CurrentView =
  | "home"
  | "cart"
  | "checkout"
  | "nft-details"
  | "profile"
  | "wallets";

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

  React.useEffect(() => {
    const protectedViews = ["checkout", "profile", "wallets"];

    if (protectedViews.includes(currentView) && !currentUser) {
      setCurrentView("home");
      setAuthMode("login");
      setIsAuthOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentView, currentUser]);

  // NFT Details State
  const [viewingNFT, setViewingNFT] = React.useState<NFT | null>(null);

  // Order Confirmation State
  const [isOrderConfirmedOpen, setIsOrderConfirmedOpen] = React.useState(false);
  const [orderConfirmationData, setOrderConfirmationData] =
    React.useState<OrderConfirmationData | null>(null);

  // Notification Toast State
  const [notification, setNotification] =
    React.useState<NotificationItem | null>(null);

  // Cart State (Initialized with items matching screenshots)
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

  const [discountPercent, setDiscountPercent] = React.useState<number>(0);

  // Check existing session on mount via MSW api
  React.useEffect(() => {
    api
      .get("/auth/session")
      .then((res: any) => {
        if (res.data?.user) {
          setCurrentUser(res.data.user);
        }
      })
      .catch(() => {
        // no active session
      });
  }, []);

  // Listen to simulated real-time socket events
  React.useEffect(() => {
    const unsubNft = socketSimulator.on("nft.updated", (event) => {
      showToast(`Atualização em tempo real: Preço do NFT atualizado!`);
    });
    const unsubOrder = socketSimulator.on("order.updated", (event) => {
      showToast(`Status do pedido atualizado: ${event.status}`);
    });
    return () => {
      unsubNft();
      unsubOrder();
    };
  }, []);

  const showToast = (msg: string, type?: TypeMessage) => {
    setNotification({ message: msg, typeMessage: type || "success" });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Cart operations
  const handleUpdateQuantity = async (id: string, delta: number) => {
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

  const handleRemoveItem = async (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await api.delete(`/cart/${id}`);
    } catch {
      // fallback
    }
    showToast("Item removido do carrinho.");
  };

  const handleAddToCart = async (nft: NFT, quantity = 1, edition = "1/50") => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      nft,
      quantity,
      edition,
      unitPrice: nft.price,
    };

    setCartItems((prev) => {
      const existing = prev.find((item) => item.nft.id === nft.id);
      if (existing) {
        return prev.map((item) =>
          item.nft.id === nft.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, newItem];
    });

    try {
      await api.post("/cart", newItem);
    } catch {
      // fallback
    }
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

  const handleConfirmPurchase = async (data: {
    profile: Partial<CollectorProfile>;
    selectedWallet: string;
    total: number;
    items: CartItem[];
  }) => {
    try {
      const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const res = await api.post(
        "/orders",
        {
          profile: data.profile,
          selectedWallet: data.selectedWallet,
          items: data.items,
          total: data.total,
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        },
      );

      const confirmation: OrderConfirmationData = res.data;
      setOrderConfirmationData(confirmation);
      setIsOrderConfirmedOpen(true);
      setCartItems([]);
      showToast("Transação confirmada na blockchain via MSW API!");
    } catch (err: any) {
      showToast(err.message || "Erro ao processar transação.", "error");
    }
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
        <div
          className={`fixed top-24 right-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold text-[#F5F2EB] shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 font-mono ${
            notification.typeMessage === "error"
              ? "border-red-500/40 bg-[#1A1410]"
              : "border-[#E0A96D]/40 bg-[#1A1410]"
          }`}
        >
          {notification.typeMessage === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-[#E0A96D]" />
          )}
          <span>{notification.message}</span>
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
        onProfileClick={() => {
          setCurrentView("profile");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onLogout={async () => {
          try {
            await api.post("/auth/logout");
          } catch {
            // fallback
          }
          setCurrentUser(null);
          showToast("Sessão encerrada com sucesso.");
          setCurrentView("home");
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
            heroImage="/assets/hero-nft.webp"
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
            discountPercent={discountPercent}
            onApplyDiscount={(percent) => setDiscountPercent(percent)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => {
              if (currentUser) {
                setCurrentView("checkout");
              } else {
                setAuthMode("login");
                setIsAuthOpen(true);
                setCurrentView("home");
              }
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
            discountPercent={discountPercent} // <-- Passando para o Checkout
            onBackToCart={() => {
              setCurrentView("cart");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onConfirmPurchase={handleConfirmPurchase}
          />
        )}

        {/* Order Confirmation Modal */}
        <OrderConfirmationModal
          isOpen={isOrderConfirmedOpen}
          onClose={() => {
            setIsOrderConfirmedOpen(false);
            setCurrentView("home");
          }}
          orderData={orderConfirmationData}
          onViewEtherscan={(txId) => {
            showToast(
              `Consultando transação ${txId} no explorador de blocos...`,
            );
          }}
        />

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

        {currentView === "profile" && (
          <ProfileView
            onNavigateTab={(tab) => {
              if (tab === "wallets") setCurrentView("wallets");
              else if (tab === "profile") setCurrentView("profile");
              else showToast(`Aba ${tab.toUpperCase()} selecionada`);
            }}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentView("home");
              showToast("Sessão encerrada.");
            }}
            onSaved={(msg) => showToast(msg)}
          />
        )}

        {currentView === "wallets" && (
          <WalletsView
            onNavigateTab={(tab) => {
              if (tab === "profile") setCurrentView("profile");
              else if (tab === "wallets") setCurrentView("wallets");
              else showToast(`Aba ${tab.toUpperCase()} selecionada`);
            }}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentView("home");
              showToast("Sessão encerrada.");
            }}
            onSaved={(msg) => showToast(msg)}
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
          currentView === "home"
            ? "home"
            : currentView === "cart"
              ? "cart"
              : currentView === "profile" || currentView === "wallets"
                ? "profile"
                : ""
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
              setCurrentView("profile");
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              setAuthMode("login");
              setIsAuthOpen(true);
            }
          }
        }}
        onScanClick={() => {
          // Trigger a simulated real-time price change via socket
          socketSimulator.simulatePriceDrop("nft-1", 0.99);
          showToast("Sincronização em tempo real via Socket.IO!");
        }}
      />

      {/* Unified Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        authMode={authMode}
        setAuthMode={setAuthMode}
        onSuccess={async (userData) => {
          // para adiantar o processo fiz a rota ser por meio de um parametro void
          // posteriormente seria trocado para .ts somente para as rotas e ser chamado diretamente no authmodal
          try {
            if (authMode === "login") {
              const res = await api.post("/auth/login", {
                email: userData.email,
                password: userData.password,
              });

              if (res.data.token) {
                localStorage.setItem("kurio_auth_token", res.data.token);
              }

              setCurrentUser(res.data.user);
              showToast(`Bem-vindo à Kurio, ${res.data.user.name}!`);
            } else {
              const res = await api.post("/auth/register", {
                name: userData.name,
                email: userData.email,
                password: userData.password,
              });

              if (res.data.token) {
                localStorage.setItem("kurio_auth_token", res.data.token);
              }

              setCurrentUser(res.data.user);
              showToast(`Conta criada com sucesso, ${userData.name}!`);
            }
          } catch (error) {
            console.log(error);
            const errorMessage =
              error instanceof Error
                ? error.message
                : "E-mail ou senha incorretos.";
            showToast(errorMessage, "error");
            throw error;
          }
        }}
        onForgotPassword={() => {
          showToast("Instruções enviadas para seu e-mail.");
        }}
        onSocialLogin={async (provider) => {
          try {
            const res = await api.post("/auth/social", {
              provider,
              email: `collector.${provider}@kurio.art`,
              name:
                provider === "google"
                  ? "Google Collector"
                  : "Facebook Collector",
            });

            if (res.data.token) {
              localStorage.setItem("kurio_auth_token", res.data.token);
            }

            setCurrentUser(res.data.user);
            setIsAuthOpen(false);
            showToast(
              res.data.message || `Conectado com sucesso via ${provider}!`,
            );
          } catch (error) {
            const msg =
              error instanceof Error
                ? error.message
                : "Erro ao autenticar com rede social.";
            showToast(msg, "error");
          }
        }}
      />
    </div>
  );
}
