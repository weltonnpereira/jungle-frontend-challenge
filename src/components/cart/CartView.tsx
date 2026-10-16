import * as React from "react";
import {
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
} from "lucide-react";
import { CartItem } from "@/src/types/cart";
import { NFT } from "@/src/types/nft";
import { MOCK_NFTS } from "@/src/mocks/nftData";
import { NFTCard } from "@/src/components/home/NFTCard";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

export interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  discountPercent: number;
  onApplyDiscount: (percent: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  onSelectRecommendedNFT?: (nft: NFT) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  discountPercent,
  onApplyDiscount,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
  onSelectRecommendedNFT,
}) => {
  const [promoCode, setPromoCode] = React.useState("");
  const [promoMessage, setPromoMessage] = React.useState<string | null>(null);
  const [recommendedPage, setRecommendedPage] = React.useState(0);

  // Calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const networkFee = items.length > 0 ? 0.016 : 0;
  const total = Math.max(0, subtotal - discountAmount + networkFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "KURIO10" || code === "KURIO" || code === "ARTE") {
      onApplyDiscount(10);
      setPromoMessage("Cupom de 10% aplicado com sucesso!");
    } else if (code === "VIP20") {
      onApplyDiscount(20);
      setPromoMessage("Cupom VIP de 20% aplicado!");
    } else if (code.length > 0) {
      onApplyDiscount(0);
      setPromoMessage("Código inválido ou expirado.");
    }
  };

  // Recommended NFTs for "Colecionadores também viram"
  const recommendedNFTs = MOCK_NFTS.slice(3, 8);

  return (
    <div className="w-full min-h-screen bg-[#0D0B0A] text-[#F3E8E2] pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-2">
        {/* Breadcrumb (Desktop) */}
        <div className="hidden sm:flex items-center gap-2 pt-6 text-md font-mono text-[#F5F1EB]">
          <button
            onClick={onContinueShopping}
            className="hover:text-[#E0A96D] transition-colors"
          >
            Início
          </button>
          <span>/</span>
          <button
            onClick={onContinueShopping}
            className="hover:text-[#E0A96D] transition-colors"
          >
            Mercado
          </button>
          <span>/</span>
          <span className="text-[#E0A96D] font-bold">Carrinho</span>
        </div>

        {/* Mobile Header with Back Button */}
        <div className="sm:hidden flex items-center gap-3 pt-4 pb-2 border-b border-[#D28A4C]/50">
          <button
            type="button"
            onClick={onContinueShopping}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18120E] border border-[#2D231B] text-[#F3E8E2] active:scale-95"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="font-mono text-lg font-bold text-[#F5F2EB]">
            Carrinho de NFTs
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-[#2E231B] bg-[#140F0D] p-8 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E0A96D]/10 text-[#E0A96D]">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-mono text-[#F5F2EB]">
              Seu carrinho está vazio
            </h3>
            <p className="text-xs text-[#A8988B] max-w-sm mx-auto">
              Explore o marketplace e descubra peças digitais únicas para
              adicionar à sua coleção.
            </p>
            <Button
              onClick={onContinueShopping}
              className="bg-[#D48D48] text-[#0D0B0A] hover:bg-[#E0A96D] font-bold font-mono text-xs px-6 py-2.5 rounded-xl"
            >
              Explorar Coleções
            </Button>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Items Table / List (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Desktop Table Header */}
              <div className="hidden sm:grid grid-cols-12 pb-2 border-b border-[#D28A4C]/50 text-md font-mono font-semibold text-[#F5F1EB]">
                <div className="col-span-5">NFTs</div>
                <div className="col-span-2 text-center">Preço</div>
                <div className="col-span-2 text-center">Quantidade</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1"></div>
              </div>

              {/* Desktop Rows (sm and up) */}
              <div className="hidden sm:block space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid bg-[#241612] grid-cols-12 items-center py-5 transition-colors hover:bg-[#140F0D]/60 rounded-xl px-4 border border-[#2D231B]"
                  >
                    {/* Item info */}
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#2D231B] bg-[#1E1712]">
                        <img
                          src={item.nft.image}
                          alt={item.nft.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-mono text-sm font-bold text-[#F5F2EB] truncate">
                          {item.nft.name}
                        </h4>
                        <span className="font-mono text-xs text-[#8C7C6F] block mt-0.5">
                          ID do token: {item.nft.tokenId}
                        </span>
                        {item.edition && (
                          <span className="font-mono text-[11px] text-[#A8988B] block mt-0.5">
                            Edição: {item.edition}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unit price */}
                    <div className="col-span-2 text-center font-mono text-md text-[#CFB28C]">
                      {item.unitPrice.toFixed(2)} ETH
                    </div>

                    {/* Quantity controls */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#3E3025] bg-[#E89B55] text-[#0D0B0A] hover:text-[#F3E8E2] hover:border-[#E0A96D] transition-colors"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-[#F5F2EB] min-w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E89B55] text-[#0D0B0A] hover:bg-[#E0A96D] transition-colors"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3 w-3 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Row total */}
                    <div className="col-span-2 text-right font-mono text-md font-bold text-[#E89B55] pr-2">
                      {(item.unitPrice * item.quantity).toFixed(2)} ETH
                    </div>

                    {/* Remove action column */}
                    <div className="col-span-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-[#8C7C6F] hover:text-red-400 hover:bg-[#201813] rounded-lg transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cards (sm:hidden) */}
              <div className="sm:hidden space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 rounded-2xl border border-[#2D231B] bg-[#241612] p-3.5 shadow-md"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#33271E] bg-[#1E1712]">
                      <img
                        src={item.nft.image}
                        alt={item.nft.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-mono text-[14px] font-regular text-[#F5F2EB] truncate">
                        {item.nft.name}
                      </h4>
                      <p className="font-mono text-[13px] text-[#8C7C6F]">
                        Edição: {item.edition || "1/50"}
                      </p>
                      <p className="font-mono text-md font-bold text-[#E89B55]">
                        {(item.unitPrice * item.quantity).toFixed(2)} ETH
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#382B21] bg-[#1C1612] text-[#A8988B] active:scale-95"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-[#F5F2EB]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D48D48] text-[#0D0B0A] active:scale-95"
                      >
                        <Plus className="h-3 w-3 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================================= */}
            {/* DESKTOP VIEW: Sidebar (lg:col-span-4)                     */}
            {/* ========================================================= */}
            <div className="hidden sm:block lg:col-span-4 rounded-2xl  p-2 space-y-6 shadow-xl">
              <h3 className="font-mono text-base font-bold text-[#F5F2EB] border-b border-[#D28A4C]/50 tracking-wide">
                Resumo da carteira
              </h3>

              {/* Promo Code Input */}
              <div className="space-y-2">
                <label className="block font-mono text-[14px] text-[#F5F2EB]">
                  Código promocional
                </label>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <Input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Digite o código promocional..."
                    className="h-11 rounded-xl border-[#2E2219] bg-[#1B1410] font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
                  />
                  <Button
                    type="submit"
                    className="h-11 shrink-0 rounded-xl bg-[#D48D48] font-mono text-xs font-bold text-[#0D0B0A] hover:bg-[#E0A96D] px-4"
                  >
                    Aplicar
                  </Button>
                </form>
                {promoMessage && (
                  <p
                    className={cn(
                      "font-mono text-[11px] mt-1",
                      discountPercent > 0 ? "text-[#E0A96D]" : "text-red-400",
                    )}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-3 pt-3 border-t border-[#261E18] text-[14px] font-mono">
                <div className="flex justify-between items-center text-[#F5F2EB]">
                  <span>Subtotal</span>
                  <span className="text-[#F3E8E2] font-semibold">
                    {subtotal.toFixed(2)} ETH
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#F5F2EB]">
                  <span>Desconto do lançamento</span>
                  <span
                    className={
                      discountAmount > 0 ? "text-[#E0A96D]" : "text-[#F5F2EB]"
                    }
                  >
                    (-) {discountAmount.toFixed(2)} ETH
                  </span>
                </div>

                <div className="flex justify-between items-start text-[#F5F2EB">
                  <span>Taxa de rede</span>
                  <div>
                    <span className="text-[#F3E8E2] font-semibold">
                      {networkFee.toFixed(3)} ETH
                    </span>
                    <span className="block text-[10px] text-[#E89B55]">
                      Taxa estimada
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#261E18] flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#F5F2EB]">
                    Total
                  </span>
                  <span className="font-mono text-xl font-bold text-[#E0A96D]">
                    {total.toFixed(3)} ETH
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={onCheckout}
                  className="w-full h-12 rounded-xl bg-[#D48D48] font-mono text-md font-bold text-[#0D0B0A] hover:bg-[#E0A96D] shadow-lg shadow-[#D48D48]/15"
                >
                  Conectar e finalizar
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={onContinueShopping}
                    className="font-mono text-xs text-[#E89B55] hover:text-[#E0A96D] transition-colors"
                  >
                    Continuar explorando
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: "Colecionadores também viram" (Matching Carrinho de NFTs desktop 2.jpg) */}
        <section className="pt-12 border-t border-[#241A14] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm sm:text-base font-bold text-[#E0A96D] tracking-wide">
              Colecionadores também viram
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                onSelect={() => onSelectRecommendedNFT?.(nft)}
              />
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setRecommendedPage(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  recommendedPage === idx
                    ? "w-5 bg-[#E0A96D]"
                    : "w-2 bg-[#3A2D23]"
                }`}
              />
            ))}
          </div>

          {/* ========================================================= */}
          {/* MOBILE VIEW: Resumo da Carteira Fixo na Base da Tela (Fixed) */}
          {/* ========================================================= */}
          <div className="block sm:hidden">
            <div className="pb-80" />

            <div className="fixed bottom-[68px] left-0 right-0 z-40 w-full rounded-t-3xl border-t border-x border-[#2D231B] bg-[#241612] p-8 space-y-4 shadow-2xl backdrop-blur-md">
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <form onSubmit={handleApplyPromo} className="flex gap-1 w-full">
                  <Input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Digite o código promocional..."
                    className="h-10 flex-1 rounded-full border-[#2E2219] bg-[#1B1410] font-mono text-xs text-[#B39463] placeholder:text-[#B39463]"
                  />
                  <Button
                    type="submit"
                    className="h-10 shrink-0 rounded-full bg-[#D48D48] font-mono text-[14px] font-semibold text-[#F5F1EB] hover:bg-[#E0A96D] px-4"
                  >
                    Aplicar
                  </Button>
                </form>
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#261E18] text-xs font-mono">
                <div className="flex justify-between items-center text-[#F5F1EB]">
                  <span>Subtotal</span>
                  <span className="text-[#F3E8E2] font-semibold">
                    {subtotal.toFixed(2)} ETH
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#F5F1EB]">
                  <span>Desconto do lançamento</span>
                  <span
                    className={
                      discountAmount > 0 ? "text-[#E0A96D]" : "text-[#F5F1EB]"
                    }
                  >
                    (-) {discountAmount.toFixed(2)} ETH
                  </span>
                </div>

                <div className="flex justify-between items-start text-[#F5F1EB]">
                  <span>Taxa de rede</span>
                  <div>
                    <span className="text-[#F3E8E2] font-semibold">
                      {networkFee.toFixed(3)} ETH
                    </span>
                    <span className="block text-[10px] text-[#E89B55]">
                      Taxa estimada
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#261E18] flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#F5F2EB]">
                    Total
                  </span>
                  <span className="font-mono text-xl font-bold text-[#E89B55]">
                    {total.toFixed(3)} ETH
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={onCheckout}
                  className="w-full h-11 rounded-xl bg-[#D48D48] font-mono text-md font-bold text-[#0D0B0A] hover:bg-[#E0A96D] shadow-lg shadow-[#D48D48]/15"
                >
                  Conectar e finalizar
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
