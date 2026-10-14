import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

export interface PromoBannersProps {
  onExploreGenesis?: () => void
  onExploreCurated?: () => void
}

export const PromoBanners: React.FC<PromoBannersProps> = ({
  onExploreGenesis,
  onExploreCurated,
}) => {
  return (
    <section className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1: Lançamentos gênesis */}
        <div className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#2E241D] bg-[#16120F] transition-all hover:border-[#E0A96D]/40">
          <div className="sm:w-2/5 aspect-square shrink-0 overflow-hidden bg-[#201814]">
            <img
              src="/assets/hero-nft.png"
              alt="Lançamentos gênesis"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 space-y-3">
            <h3 className="text-lg font-bold text-[#F5F2EB] leading-snug">
              Lançamentos gênesis <br />
              de edição limitada
            </h3>
            <p className="text-xs text-[#A8988B] leading-relaxed">
              Colecione edições escassas diretamente dos criadores antes da
              revelação pública.
            </p>
            <div className="pt-2">
              <Button
                onClick={onExploreGenesis}
                size="sm"
                className="bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold text-xs gap-1.5 px-4 py-2 rounded-lg"
              >
                <span>Explorar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Banner 2: Arte digital selecionada */}
        <div className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#2E241D] bg-[#16120F] transition-all hover:border-[#E0A96D]/40">
          <div className="sm:w-2/5 aspect-square shrink-0 overflow-hidden bg-[#201814]">
            <img
              src="/assets/ivory-baron.png"
              alt="Arte digital selecionada"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 space-y-3">
            <h3 className="text-lg font-bold text-[#F5F2EB] leading-snug">
              Arte digital selecionada <br />
              e muito mais
            </h3>
            <p className="text-xs text-[#A8988B] leading-relaxed">
              Explore novos artistas, coleções verificadas e obras digitais que
              definem a cultura.
            </p>
            <div className="pt-2">
              <Button
                onClick={onExploreCurated}
                size="sm"
                className="bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold text-xs gap-1.5 px-4 py-2 rounded-lg"
              >
                <span>Explorar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
