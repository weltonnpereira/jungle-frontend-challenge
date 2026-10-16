import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { OrderConfirmationData } from "@/src/types/cart";
import { ExternalLink, X } from "lucide-react";
import { useMediaQuery } from "@/src/hooks/use-media-query";

export interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: OrderConfirmationData | null;
  onViewEtherscan?: (txId: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onViewEtherscan,
}) => {
  function useIsMounted() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return mounted;
  }

  // Fallback default data matching Confirmação de Pedido desktop 4.jpg
  const data = orderData;

  // Envelope with THANK YOU seal SVG
  const ThankYouEnvelopeIcon = () => (
    <svg
      className="h-16 w-16 text-[#E0A96D]"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Envelope */}
      <rect x="8" y="20" width="48" height="34" rx="4" stroke="#E0A96D" />
      {/* Envelope flap lines */}
      <path d="M8 22l24 18 24-18" stroke="#E0A96D" />
      {/* Letter popping up */}
      <path d="M16 26V10a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v16" stroke="#E0A96D" />
      {/* "THANK YOU" seal text simulation */}
      <text
        x="32"
        y="16"
        fill="#E0A96D"
        fontSize="5.5"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
        stroke="none"
      >
        THANK
      </text>
      <text
        x="32"
        y="22"
        fill="#E0A96D"
        fontSize="5.5"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
        stroke="none"
      >
        YOU
      </text>
    </svg>
  );

  const renderReceiptContent = () => (
    <div className="space-y-6 pt-2">
      {/* Top Graphic & Headline */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <div className="p-2">
          <ThankYouEnvelopeIcon />
        </div>
        <h2 className="font-mono text-lg sm:text-md font-bold text-[#CFB28C]">
          Seus NFTs agora estão na sua carteira
        </h2>
      </div>

      {/* Meta Summary Box (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#261E18] text-xs font-mono">
        <div>
          <span className="block text-[11px] text-[#CFB28C]">
            ID da transação
          </span>
          <span className="text-[#CFB28C] font-semibold truncate block mt-0.5">
            {data?.transactionId}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#CFB28C]">Data</span>
          <span className="text-[#CFB28C] font-semibold block mt-0.5">
            {data?.date}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#CFB28C]">Total</span>
          <span className="text-[#CFB28C] font-bold block mt-0.5">
            {data?.total.toFixed(3)} ETH
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#CFB28C]">Carteira</span>
          <span className="text-[#CFB28C] font-semibold block mt-0.5">
            {data?.wallet}
          </span>
        </div>
      </div>

      {/* Detalhes da transação Table */}
      <div className="space-y-3">
        <h4 className="font-mono text-xs font-bold text-[#F5F2EB]">
          Detalhes da transação
        </h4>

        {/* Table header */}
        <div className="flex items-center justify-between text-xs font-mono text-[#F5F1EB] pb-1 border-b border-[#261E18]">
          <span className="w-1/2">NFTs</span>
          <span className="w-1/4 text-center">Edições</span>
          <span className="w-1/4 text-right">Subtotal</span>
        </div>

        {/* Item Rows */}
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {data && data.items.length > 0 ? (
            data?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs font-mono py-1"
              >
                <div className="flex items-center gap-2.5 w-1/2 min-w-0">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#2D231B] bg-[#1E1712]">
                    <img
                      src={item.nft.image}
                      alt={item.nft.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[#F5F2EB] truncate block">
                      {item.nft.name}
                    </span>
                    <span className="text-[10px] text-[#6E5D50] block">
                      ID do token: {item.nft.tokenId}
                    </span>
                  </div>
                </div>

                <div className="w-1/4 text-center text-[#8C7C6F]">
                  (x {item.quantity})
                </div>

                <div className="w-1/4 text-right font-bold text-[#E0A96D]">
                  {(item.unitPrice * item.quantity).toFixed(2)} ETH
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-xs font-mono text-[#8C7C6F]">
              Nenhum item na transação.
            </div>
          )}
        </div>

        {/* Breakdown Subtotals */}
        <div className="space-y-1.5 pt-3 border-t border-[#261E18] text-xs font-mono">
          <div className="flex justify-between text-[#8C7C6F]">
            <span>Taxa de rede</span>
            <span className="text-[#F3E8E2]">
              {data?.networkFee.toFixed(3)} ETH
            </span>
          </div>
          <div className="flex justify-between font-bold pt-1">
            <span className="text-[#F5F2EB]">Total</span>
            <span className="text-base text-[#E0A96D]">
              {data?.total.toFixed(3)} ETH
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Narration */}
      <p className="font-mono text-xs text-[#CFB28C] text-center leading-relaxed max-w-sm mx-auto">
        Transação confirmada na Ethereum. A propriedade foi transferida para sua
        carteira conectada e registrada na rede.
      </p>

      {/* Etherscan Button */}
      <div className="pt-2 flex justify-center">
        <Button
          onClick={() => {
            onViewEtherscan?.(data?.transactionId || "");
            window.open(
              `https://etherscan.io/tx/${data?.transactionId}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className="w-[50%] h-11 rounded-xl bg-[#D48D48] font-mono text-md font-bold text-[#0D0B0A] hover:bg-[#E0A96D] shadow-lg shadow-[#D48D48]/15"
        >
          <span>Ver no Etherscan</span>
          <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
        </Button>
      </div>
    </div>
  );

  const isDesktop = useMediaQuery("(min-width: 640px)");
  const isMounted = useIsMounted();

  if (!isMounted || !isOpen) return null;

  return (
    <>
      {isDesktop ? (
        <div className="hidden sm:block">
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg border border-[#34271E] rounded-none bg-[#241612] p-8 pb-7 text-[#F3E8E2] shadow-2xl overflow-hidden">
              <DialogTitle className="sr-only">
                Confirmação de Pedido de NFTs
              </DialogTitle>
              <DialogDescription className="sr-only">
                Recibo e detalhes da transação na blockchain
              </DialogDescription>

              {renderReceiptContent()}

              {/* Bottom caramel accent strip */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#D28A4C] rounded-none pointer-events-none" />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="sm:hidden">
          <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
              side="bottom"
              className="h-[95vh] max-h-[95vh] w-full rounded-t-3xl border-t border-[#34271E] bg-[#241612] p-6 pt-5 overflow-y-auto"
            >
              <SheetTitle className="sr-only">
                Confirmação de Pedido de NFTs
              </SheetTitle>
              <SheetDescription className="sr-only">
                Recibo de compra
              </SheetDescription>

              {/* Top Drag Indicator */}
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#3D2E23]" />

              {renderReceiptContent()}
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
};
