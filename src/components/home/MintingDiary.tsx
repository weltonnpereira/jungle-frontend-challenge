import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { MOCK_ARTICLES } from '@/src/mocks/nftData'
import { Card } from '@/src/components/ui/card'

export interface MintingDiaryProps {
  onReadArticle?: (slug: string) => void
}

export const MintingDiary: React.FC<MintingDiaryProps> = ({ onReadArticle }) => {
  return (
    <section className="w-full py-12">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EB] tracking-wide">
          Diário da Cunhagem
        </h2>
        <p className="text-xs sm:text-sm text-[#A8988B] max-w-xl mx-auto">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_ARTICLES.map((article) => (
          <Card
            key={article.id}
            onClick={() => onReadArticle?.(article.slug)}
            className="group overflow-hidden rounded-2xl border-[#2D231B] bg-[#16120F] transition-all duration-300 hover:border-[#E0A96D]/40 cursor-pointer flex flex-col h-full"
          >
            {/* Article Image */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#201814]">
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-1 flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#8C7C6F] block">
                  {article.date} &nbsp;|&nbsp; {article.readTime}
                </span>
                <h4 className="text-sm font-bold text-[#F5F2EB] group-hover:text-[#E0A96D] transition-colors leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-[#A8988B] line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E0A96D] group-hover:underline">
                  <span>Ler mais</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
