import * as React from 'react'
import { ChevronDown, SlidersHorizontal, Sparkles } from 'lucide-react'
import { NFT, SortOption, TabCategory } from '@/src/types/nft'
import { NFTCard } from '@/src/components/home/NFTCard'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/components/ui/pagination'
import { cn } from '@/src/lib/utils'

export interface NFTGridProps {
  nfts: NFT[]
  isLoading?: boolean
  activeTab: TabCategory
  onTabChange: (tab: TabCategory) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  currentPage: number
  totalPages?: number
  onPageChange: (page: number) => void
  onSelectNFT?: (nft: NFT) => void
  onToggleLike?: (id: string) => void
}

const TABS: { id: TabCategory; label: string }[] = [
  { id: 'all', label: 'Todos os NFTs' },
  { id: 'new', label: 'Novos lançamentos' },
  { id: 'trending', label: 'Em alta' },
]

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'recent', label: 'Listados recentemente' },
  { id: 'price_asc', label: 'Menor preço' },
  { id: 'price_desc', label: 'Maior preço' },
  { id: 'likes_desc', label: 'Mais populares' },
]

export const NFTGrid: React.FC<NFTGridProps> = ({
  nfts,
  isLoading = false,
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  currentPage,
  totalPages = 4,
  onPageChange,
  onSelectNFT,
  onToggleLike,
}) => {
  const [isSortOpen, setIsSortOpen] = React.useState(false)
  const sortRef = React.useRef<HTMLDivElement>(null)

  // Close sort popover on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortBy)?.label || 'Listados recentemente'

  return (
    <div className="w-full space-y-6">
      {/* Top Filter Bar: Tabs & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2D231B] pb-3">
        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative pb-3 text-sm font-regular tracking-wide whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-[#E89B55]'
                    : 'text-[#F3E8E2] hover:text-[#F5F1EB]'
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E0A96D] rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Sort Dropdown Selector */}
        <div className="relative self-end sm:self-auto" ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs text-[#A8988B] hover:text-[#F3E8E2] transition-colors"
          >
            <span>Ordenar por:</span>
            <span className="font-semibold text-[#F5F2EB]">{currentSortLabel}</span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                isSortOpen && 'rotate-180'
              )}
            />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 z-30 rounded-xl border border-[#342921] bg-[#16120F] p-1.5 shadow-xl">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSortChange(opt.id)
                    setIsSortOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors',
                    sortBy === opt.id
                      ? 'bg-[#241B15] text-[#E0A96D] font-bold'
                      : 'text-[#A8988B] hover:bg-[#1E1712] hover:text-[#F3E8E2]'
                  )}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid of NFTs */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-[#1A1410] animate-pulse border border-[#2D231B]"
            />
          ))}
        </div>
      ) : nfts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-[#342921] bg-[#140F0D]">
          <p className="text-base font-bold text-[#F5F2EB]">
            Nenhum NFT encontrado
          </p>
          <p className="mt-1 text-xs text-[#8C7C6F] max-w-sm">
            Tente ajustar os filtros de categoria, faixa de preço ou termos de busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onSelect={onSelectNFT}
              onToggleLike={onToggleLike}
            />
          ))}
        </div>
      )}

      {/* Pagination Container */}
      {nfts.length > 0 && (
        <div className="pt-8 pb-4">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(currentPage - 1)}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(currentPage + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
