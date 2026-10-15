import * as React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

export interface HeroSectionProps {
  onExploreClick?: () => void
  heroImage?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  heroImage = '/assets/hero-nft.png',
}) => {
  const [activeDot, setActiveDot] = React.useState(0)

  return (
    <section id="inicio" className="relative w-full pt-4 pb-8 sm:py-12">
      {/* Desktop Hero View (hidden on small mobile, visible on sm and up) */}
      <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="text-[15px] tracking-[0.2em] font-regular text-[#F5F1EB]">
              Bem-vindo à Kurio
            </span>
          </div>

          <h1 className="text-a4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-[#F5F2EB] leading-[1.08]">
            SEJA DONO DO FUTURO <br />
            DA ARTE DIGITAL
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-[#CFB28C] leading-relaxed">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </p>

          <div className="pt-2">
            <Button
              onClick={onExploreClick}
              size="lg"
              className="bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold tracking-wider px-8 py-6 rounded-xl uppercase text-sm shadow-lg shadow-[#E0A96D]/15 transition-all hover:scale-[1.02]"
            >
              EXPLORAR
            </Button>
          </div>

          {/* Carousel dots indicator */}
          <div className="flex items-center gap-2.5 pt-4">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveDot(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeDot === idx
                    ? 'w-6 bg-[#E0A96D]'
                    : 'w-2.5 bg-[#3D3025] hover:bg-[#5A4839]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Hero Art Card */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative group w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-[#342921] bg-[#16120F] shadow-2xl shadow-black/80">
            <img
              src={heroImage}
              alt="Hero NFT - Emerald Ape"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Ambient inner rim glow */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Hero View (exact match to "início mobile.png") */}
      <div className="sm:hidden w-full">
        <div className="relative overflow-hidden rounded-3xl border border-[#382B21] bg-gradient-to-br from-[#2D1D13] via-[#1B110B] to-[#100A08] p-5 shadow-2xl">
          {/* Subtle concentric rings background decoration */}
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-[#E0A96D]/10 pointer-events-none" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#E0A96D]/5 pointer-events-none" />

          <div className="relative flex items-center justify-between gap-3">
            {/* Left Content */}
            <div className="flex-1 space-y-2 pr-2">
              <span className="text-[11px] font-medium tracking-wide text-[#E0A96D]/90">
                Bem-vindo à Kurio
              </span>

              <h2 className="text-xl font-extrabold uppercase leading-tight text-[#F5F2EB]">
                SEJA DONO DA <br />
                CULTURA DIGITAL
              </h2>

              <p className="text-xs text-[#A8988B] leading-relaxed line-clamp-3">
                Descubra NFTs selecionados de criadores do mundo todo.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E0A96D] hover:text-[#F3E8E2] transition-colors"
                >
                  <span>EXPLORAR</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right NFT Showcase with overlapping badge avatar */}
            <div className="relative shrink-0 w-32 aspect-square">
              <div className="h-full w-full overflow-hidden rounded-2xl border border-[#443328] bg-[#16120F] shadow-lg">
                <img
                  src={heroImage}
                  alt="Ape NFT"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Overlapping mini avatar */}
              <div className="absolute -bottom-2 -left-2 h-14 w-14 overflow-hidden rounded-xl border-2 border-[#1B110B] bg-[#221812] shadow-md">
                <img
                  src="/assets/sage-nomad.png"
                  alt="Sage Nomad NFT"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile pagination dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeDot === idx
                    ? 'w-4 bg-[#E0A96D]'
                    : 'w-2 bg-[#423429]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
