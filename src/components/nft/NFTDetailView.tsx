import * as React from 'react'
import {
  ChevronLeft,
  Heart,
  Star,
  Plus,
  Minus,
  Share2,
  ZoomIn,
  Linkedin,
  Mail,
  Twitter,
  ShoppingBag,
} from 'lucide-react'
import { NFT } from '@/src/types/nft'
import { MOCK_NFTS } from '@/src/mocks/nftData'
import { NFTCard } from '@/src/components/home/NFTCard'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'

export interface NFTDetailViewProps {
  nft: NFT
  onBack: () => void
  onAddToCart: (nft: NFT, quantity: number, edition: string) => void
  onBuyNow: (nft: NFT, quantity: number, edition: string) => void
  onSelectNFT?: (nft: NFT) => void
}

export const NFTDetailView: React.FC<NFTDetailViewProps> = ({
  nft,
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectNFT,
}) => {
  const [quantity, setQuantity] = React.useState(1)
  const [selectedEdition, setSelectedEdition] = React.useState('1/50')
  const [activeTab, setActiveTab] = React.useState<'details' | 'reviews'>('details')
  const [isLiked, setIsLiked] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState(nft.image)

  const editions = ['1/10', '1/25', '1/50', 'ABERTA']

  // Gallery thumbnails
  const gallery = [
    nft.image,
    '/assets/sage-nomad.png',
    '/assets/ivory-baron.png',
    '/assets/golden-beat.png',
  ]

  const moreFromCollection = MOCK_NFTS.filter((n) => n.id !== nft.id).slice(0, 5)

  return (
    <div className="w-full min-h-screen bg-[#0D0B0A] text-[#F3E8E2] pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Breadcrumb (Desktop) */}
        <div className="hidden sm:flex items-center gap-2 pt-6 text-xs font-mono text-[#8C7C6F]">
          <button
            onClick={onBack}
            className="hover:text-[#E0A96D] transition-colors"
          >
            Início
          </button>
          <span>/</span>
          <button
            onClick={onBack}
            className="hover:text-[#E0A96D] transition-colors"
          >
            Mercado
          </button>
          <span>/</span>
          <span className="text-[#F5F2EB] font-bold">{nft.name}</span>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between pt-4 pb-2 border-b border-[#241A14]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18120E] border border-[#2D231B] text-[#F3E8E2]"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18120E] border border-[#2D231B] text-[#F3E8E2]"
            aria-label="Favoritar"
          >
            <Heart
              className={cn('h-5 w-5', isLiked && 'fill-[#E0A96D] text-[#E0A96D]')}
            />
          </button>
        </div>

        {/* Top Section: Media Gallery (Left) & NFT Specs (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery (6 cols) */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-4">
            {/* Thumbnails list (Desktop) */}
            <div className="hidden sm:flex flex-col gap-3 shrink-0">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    'h-16 w-16 overflow-hidden rounded-xl border transition-all',
                    selectedImage === img
                      ? 'border-[#E0A96D] ring-2 ring-[#E0A96D]/30'
                      : 'border-[#2D231B] hover:border-[#4A392C]'
                  )}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Big Image */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden border border-[#34271E] bg-[#16120F] shadow-2xl">
              <img
                src={selectedImage}
                alt={nft.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-[#F3E8E2] hover:text-[#E0A96D]"
                aria-label="Ampliar imagem"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: Info & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F5F2EB]">
                  {nft.name}
                </h1>
                <div className="flex items-center gap-1.5 rounded-full border border-[#3D2F24] bg-[#1D1611] px-3 py-1 font-mono text-xs text-[#E0A96D]">
                  <Star className="h-3.5 w-3.5 fill-[#E0A96D]" />
                  <span>4.8</span>
                  <span className="text-[#8C7C6F]">(19)</span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#E0A96D]">
                  {nft.price.toFixed(2)} {nft.currency}
                </span>
                <span className="font-mono text-xs text-[#8C7C6F]">
                  19 avaliações de colecionadores
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-mono text-xs font-bold text-[#A8988B] uppercase tracking-wider">
                Sobre este NFT:
              </h4>
              <p className="font-mono text-xs text-[#A8988B] leading-relaxed">
                Um colecionável digital 1/50 finalizado à mão da coleção Kurio
                Editions, verificado na Ethereum, com arte desbloqueável e acesso
                para colecionadores.
              </p>
            </div>

            {/* Edition Selection */}
            <div className="space-y-2">
              <h4 className="font-mono text-xs font-bold text-[#A8988B]">
                Edição:
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {editions.map((ed) => (
                  <button
                    key={ed}
                    type="button"
                    onClick={() => setSelectedEdition(ed)}
                    className={cn(
                      'rounded-full px-4 py-1.5 font-mono text-xs transition-colors',
                      selectedEdition === ed
                        ? 'border border-[#E0A96D] bg-[#221812] text-[#E0A96D] font-bold ring-1 ring-[#E0A96D]/50'
                        : 'border border-[#34271E] bg-[#16110E] text-[#8C7C6F] hover:text-[#F3E8E2]'
                    )}
                  >
                    {ed}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata pills */}
            <div className="space-y-2 pt-2 border-t border-[#261E18] font-mono text-xs text-[#8C7C6F]">
              <div>
                ID do token:{' '}
                <span className="text-[#F3E8E2]">{nft.tokenId}</span>
              </div>
              <div>
                Coleção:{' '}
                <span className="text-[#E0A96D]">{nft.collection}</span>
              </div>
              <div>
                Atributos:{' '}
                <span className="text-[#F3E8E2]">
                  Óculos, Esmeralda, {nft.rarity || 'Raro'}
                </span>
              </div>
            </div>

            {/* Quantity and CTA Buttons */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#8C7C6F]">Qtd.</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3E3025] bg-[#1A1410] text-[#A8988B] hover:text-[#F3E8E2]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-sm font-bold text-[#F5F2EB] min-w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D48D48] text-[#0D0B0A]"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => onBuyNow(nft, quantity, selectedEdition)}
                  className="flex-1 h-12 rounded-xl bg-[#D48D48] font-mono text-xs font-bold text-[#0D0B0A] hover:bg-[#E0A96D] shadow-lg shadow-[#D48D48]/20 uppercase tracking-wider"
                >
                  Comprar NFT
                </Button>

                <Button
                  variant="outline"
                  onClick={() => onAddToCart(nft, quantity, selectedEdition)}
                  className="h-12 w-12 p-0 rounded-xl border-[#34271E] bg-[#1A1410] text-[#F3E8E2] hover:text-[#E0A96D] hover:border-[#E0A96D]"
                  aria-label="Adicionar ao carrinho"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsLiked(!isLiked)}
                  className="hidden sm:inline-flex h-12 px-4 rounded-xl border-[#34271E] bg-[#1A1410] font-mono text-xs text-[#F3E8E2] hover:text-[#E0A96D]"
                >
                  <Heart
                    className={cn(
                      'h-4 w-4 mr-1.5',
                      isLiked && 'fill-[#E0A96D] text-[#E0A96D]'
                    )}
                  />
                  <span>Favoritar</span>
                </Button>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-3 pt-3 font-mono text-xs text-[#8C7C6F]">
              <span>Compartilhar este NFT:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1.5 hover:text-[#E0A96D] transition-colors"
                  aria-label="Compartilhar no LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:text-[#E0A96D] transition-colors"
                  aria-label="Enviar por e-mail"
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:text-[#E0A96D] transition-colors"
                  aria-label="Compartilhar no Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Details & Contract Section */}
        <div className="pt-8 border-t border-[#241A14] space-y-6">
          <div className="flex items-center gap-8 border-b border-[#241A14] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={cn(
                'relative pb-3 font-mono text-sm font-bold transition-colors',
                activeTab === 'details'
                  ? 'text-[#E0A96D]'
                  : 'text-[#8C7C6F] hover:text-[#F3E8E2]'
              )}
            >
              Detalhes do NFT
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E0A96D]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={cn(
                'relative pb-3 font-mono text-sm font-bold transition-colors',
                activeTab === 'reviews'
                  ? 'text-[#E0A96D]'
                  : 'text-[#8C7C6F] hover:text-[#F3E8E2]'
              )}
            >
              Avaliações de colecionadores (19)
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E0A96D]" />
              )}
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="space-y-4 font-mono text-xs text-[#A8988B] leading-relaxed max-w-3xl">
              <p>
                {nft.name} é uma obra digital 1/50 finalizada à mão da coleção
                Kurio Editions. Cada atributo fica armazenado nos metadados do
                token e verificado na Ethereum. A obra explora identidade,
                movimento e luz em um mundo digital sem fronteiras.
              </p>
              <p>
                A propriedade inclui a arte em alta resolução, lançamentos
                exclusivos para colecionadores e um registro permanente de
                procedência registrada na rede. Nova Sato recebe 5% de direitos
                autorais nas vendas secundárias, apoiando novos trabalhos e
                lançamentos da comunidade.
              </p>
              <div className="space-y-1.5 pt-3">
                <p>
                  <strong className="text-[#F5F2EB]">Rede:</strong> Cunhado na
                  Ethereum com procedência imutável e metadados armazenados no
                  IPFS.
                </p>
                <p>
                  <strong className="text-[#F5F2EB]">Contrato:</strong> Direitos
                  autorais do criador: 5% nas vendas secundárias, pagos
                  automaticamente pelos mercados compatíveis.
                </p>
                <p>
                  <strong className="text-[#F5F2EB]">
                    Direitos autorais:
                  </strong>{' '}
                  <span className="text-[#E0A96D]">0x7A42...19E8</span> •
                  Contrato inteligente ERC-721 verificado.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-6 font-mono text-xs text-[#8C7C6F] space-y-4">
              <p>
                ★ ★ ★ ★ ★ "Arte espetacular e procedência perfeita. Ansioso pelo
                próximo drop!" - <span className="text-[#F5F2EB]">@crypto_art</span>
              </p>
              <p>
                ★ ★ ★ ★ ★ "A qualidade dos detalhes em 3D supera qualquer avatar
                comum." - <span className="text-[#F5F2EB]">@ape_collector</span>
              </p>
            </div>
          )}
        </div>

        {/* Section: "Mais desta coleção" */}
        <section className="pt-8 border-t border-[#241A14] space-y-6">
          <h3 className="font-mono text-base font-bold text-[#E0A96D]">
            Mais desta coleção
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {moreFromCollection.map((item) => (
              <NFTCard
                key={item.id}
                nft={item}
                onSelect={() => onSelectNFT?.(item)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
