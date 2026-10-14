import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/src/components/ui/sheet'
import { FiltersSidebar } from '@/src/components/home/FiltersSidebar'
import { Button } from '@/src/components/ui/button'

export interface MobileFilterSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  selectedNetwork: string | null
  onSelectNetwork: (network: string | null) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  onApplyPrice: () => void
  onResetFilters: () => void
  activeFiltersCount?: number
}

export const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  isOpen,
  onOpenChange,
  selectedCategory,
  onSelectCategory,
  selectedNetwork,
  onSelectNetwork,
  priceRange,
  onPriceRangeChange,
  onApplyPrice,
  onResetFilters,
  activeFiltersCount = 0,
}) => {
  const handleApply = () => {
    onApplyPrice()
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#130E0B] border-l border-[#2D231B] p-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <SheetHeader className="text-left pb-4 border-b border-[#2D231B]">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold text-[#F5F2EB]">
                Filtros
              </SheetTitle>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-xs text-[#E0A96D] hover:underline"
                >
                  Limpar tudo ({activeFiltersCount})
                </button>
              )}
            </div>
            <SheetDescription className="text-xs text-[#A8988B]">
              Refine os NFTs por coleção, preço e rede blockchain.
            </SheetDescription>
          </SheetHeader>

          <div className="py-2">
            <FiltersSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              selectedNetwork={selectedNetwork}
              onSelectNetwork={onSelectNetwork}
              priceRange={priceRange}
              onPriceRangeChange={onPriceRangeChange}
              onApplyPrice={handleApply}
              showFeaturedCard={false}
            />
          </div>
        </div>

        <SheetFooter className="pt-6 border-t border-[#2D231B] flex-row gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="flex-1 text-xs border-[#342921]"
          >
            Limpar
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 text-xs bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold"
          >
            Ver Resultados
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
