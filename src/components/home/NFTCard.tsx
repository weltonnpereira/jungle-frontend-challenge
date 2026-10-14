import * as React from 'react'
import { Heart, ExternalLink, ShieldCheck } from 'lucide-react'
import { NFT } from '@/src/types/nft'
import { Card } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { cn } from '@/src/lib/utils'

export interface NFTCardProps {
  nft: NFT
  onSelect?: (nft: NFT) => void
  onToggleLike?: (id: string) => void
  isLiked?: boolean
  className?: string
}

export const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  onSelect,
  onToggleLike,
  isLiked = false,
  className,
}) => {
  const [liked, setLiked] = React.useState(isLiked)
  const [likesCount, setLikesCount] = React.useState(nft.likes ?? 0)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextState = !liked
    setLiked(nextState)
    setLikesCount((prev) => (nextState ? prev + 1 : prev - 1))
    onToggleLike?.(nft.id)
  }

  return (
    <Card
      onClick={() => onSelect?.(nft)}
      className={cn(
        'group relative overflow-hidden rounded-2xl border-[#2D231B] bg-[#16120F] transition-all duration-300 hover:border-[#E0A96D]/50 hover:shadow-xl hover:shadow-[#E0A96D]/5 cursor-pointer',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-[#201814]">
        <img
          src={nft.image}
          alt={nft.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
          {nft.rarity && (
            <Badge
              variant="rare"
              className="bg-[#D48D48] text-[#0D0B0A] font-bold text-[10px] tracking-wider px-2 py-0.5 shadow"
            >
              {nft.rarity}
            </Badge>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleLike}
          aria-label={liked ? 'Remover dos favoritos' : 'Favoritar'}
          className={cn(
            'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200',
            liked
              ? 'bg-[#E0A96D] text-[#0D0B0A] shadow-md scale-105'
              : 'bg-black/50 text-[#F3E8E2] hover:bg-black/80 hover:text-[#E0A96D]'
          )}
        >
          <Heart
            className={cn('h-4 w-4 transition-transform', liked && 'fill-current scale-110')}
          />
        </button>

        {/* Subtle gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#16120F] to-transparent opacity-60" />
      </div>

      {/* Card Info */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate text-sm sm:text-base font-bold text-[#F5F2EB] group-hover:text-[#E0A96D] transition-colors">
              {nft.name}
            </h4>
            {nft.creator && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8C7C6F]">
                <span>{nft.creator.name}</span>
                {nft.creator.verified && (
                  <ShieldCheck className="h-3 w-3 text-[#E0A96D]" />
                )}
              </p>
            )}
          </div>
        </div>

        {/* Price Row */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-sm sm:text-base font-bold text-[#E0A96D]">
            {nft.price.toFixed(2)} {nft.currency}
          </span>
          {nft.originalPrice && (
            <span className="font-mono text-xs text-[#8C7C6F] line-through">
              {nft.originalPrice.toFixed(2)} {nft.currency}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
