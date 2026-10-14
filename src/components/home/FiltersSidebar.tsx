import * as React from 'react'
import { Slider } from '@/src/components/ui/slider'
import { Button } from '@/src/components/ui/button'
import { MOCK_COLLECTIONS, MOCK_NETWORKS } from '@/src/mocks/nftData'
import { cn } from '@/src/lib/utils'

export interface FiltersSidebarProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  selectedNetwork: string | null
  onSelectNetwork: (network: string | null) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  onApplyPrice: () => void
  className?: string
  showFeaturedCard?: boolean
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedNetwork,
  onSelectNetwork,
  priceRange,
  onPriceRangeChange,
  onApplyPrice,
  className,
  showFeaturedCard = true,
}) => {
  // Local state for smooth slider dragging before applying
  const [localPrice, setLocalPrice] = React.useState<[number, number]>(priceRange)

  React.useEffect(() => {
    setLocalPrice(priceRange)
  }, [priceRange])

  const handleSliderChange = (vals: number[]) => {
    if (vals.length >= 2) {
      const newRange: [number, number] = [
        Number(vals[0].toFixed(2)),
        Number(vals[1].toFixed(2)),
      ]
      setLocalPrice(newRange)
      onPriceRangeChange(newRange)
    }
  }

  return (
    <aside className={cn('w-full space-y-8 select-none', className)}>
      {/* 1. Coleções */}
      <div>
        <h3 className="mb-4 text-base font-bold tracking-wide text-[#F5F2EB]">
          Coleções
        </h3>
        <ul className="space-y-2.5 text-sm">
          {MOCK_COLLECTIONS.map((col) => {
            const isSelected = selectedCategory === col.name
            return (
              <li key={col.slug}>
                <button
                  type="button"
                  onClick={() =>
                    onSelectCategory(isSelected ? null : col.name)
                  }
                  className={cn(
                    'group flex w-full items-center justify-between py-1 transition-colors text-left',
                    isSelected
                      ? 'text-[#E0A96D] font-semibold'
                      : 'text-[#A8988B] hover:text-[#F3E8E2]'
                  )}
                >
                  <span className="truncate group-hover:translate-x-0.5 transition-transform">
                    {col.name}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-xs',
                      isSelected ? 'text-[#E0A96D]' : 'text-[#6E5D50]'
                    )}
                  >
                    ({col.count})
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 2. Faixa de preço */}
      <div>
        <h3 className="mb-4 text-base font-bold tracking-wide text-[#F5F2EB]">
          Faixa de preço
        </h3>

        <div className="space-y-4">
          <Slider
            defaultValue={[0.02, 12.3]}
            value={[localPrice[0], localPrice[1]]}
            min={0}
            max={15}
            step={0.01}
            onValueChange={handleSliderChange}
            className="py-2"
          />

          <div className="flex items-center justify-between text-xs text-[#A8988B]">
            <span>
              Preço:{' '}
              <strong className="font-mono text-[#F3E8E2]">
                {localPrice[0].toFixed(2).replace('.', ',')} -{' '}
                {localPrice[1].toFixed(2).replace('.', ',')} ETH
              </strong>
            </span>
          </div>

          <Button
            type="button"
            onClick={onApplyPrice}
            size="sm"
            className="w-full sm:w-auto bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold text-xs px-5 py-2 rounded-lg"
          >
            Aplicar
          </Button>
        </div>
      </div>

      {/* 3. Rede */}
      <div>
        <h3 className="mb-4 text-base font-bold tracking-wide text-[#F5F2EB]">
          Rede
        </h3>
        <ul className="space-y-2.5 text-sm">
          {MOCK_NETWORKS.map((net) => {
            const isSelected = selectedNetwork === net.name
            return (
              <li key={net.slug}>
                <button
                  type="button"
                  onClick={() =>
                    onSelectNetwork(isSelected ? null : net.name)
                  }
                  className={cn(
                    'group flex w-full items-center justify-between py-1 transition-colors text-left',
                    isSelected
                      ? 'text-[#E0A96D] font-semibold'
                      : 'text-[#A8988B] hover:text-[#F3E8E2]'
                  )}
                >
                  <span className="truncate group-hover:translate-x-0.5 transition-transform">
                    {net.name}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-xs',
                      isSelected ? 'text-[#E0A96D]' : 'text-[#6E5D50]'
                    )}
                  >
                    ({net.count})
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 4. NFT EM DESTAQUE / OFERTA LIMITADA */}
      {showFeaturedCard && (
        <div className="pt-2">
          <div className="text-center mb-3">
            <span className="block text-xs font-bold uppercase tracking-widest text-[#E0A96D]">
              NFT EM DESTAQUE
            </span>
            <span className="block text-sm font-extrabold uppercase tracking-wider text-[#F5F2EB]">
              OFERTA LIMITADA
            </span>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-[#342921] bg-[#16120F] shadow-lg transition-all hover:border-[#E0A96D]/50">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src="/assets/sage-nomad.png"
                alt="NFT em Destaque"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3 text-center bg-[#1A1410] border-t border-[#2D231B]">
              <p className="text-xs font-bold text-[#F5F2EB]">Sage Nomad #009</p>
              <p className="font-mono text-xs font-bold text-[#E0A96D] mt-0.5">
                1.69 ETH
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
