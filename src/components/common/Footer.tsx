import * as React from 'react'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Wallet,
} from 'lucide-react'
import { Badge } from '@/src/components/ui/badge'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#221A15] bg-[#0A0807] text-[#A8988B] pb-24 sm:pb-8">
      {/* Top Banner Row */}
      <div className="border-b border-[#1E1712] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <span className="font-bold text-sm tracking-widest text-[#F5F2EB]">
            KURIO
          </span>
          <span className="text-[#8C7C6F] text-center">
            Feito para colecionadores, criadores e cultura
          </span>
          <a
            href="mailto:contato@email.com"
            className="hover:text-[#E0A96D] transition-colors"
          >
            contato@email.com
          </a>
          <a
            href="tel:+551140028922"
            className="hover:text-[#E0A96D] transition-colors"
          >
            +55 11 4002 8922
          </a>
        </div>
      </div>

      {/* Main 4 Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Meu perfil */}
          <div>
            <h4 className="text-sm font-bold text-[#F5F2EB] tracking-wide mb-4">
              Meu perfil
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                'Meu perfil',
                'Minha coleção',
                'Atividade',
                'Estúdio do criador',
                'Lista de interesse',
              ].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="hover:text-[#E0A96D] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Central de ajuda */}
          <div>
            <h4 className="text-sm font-bold text-[#F5F2EB] tracking-wide mb-4">
              Central de ajuda
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                'Central de ajuda',
                'Como comprar NFTs',
                'Carteira e segurança',
                'Política do mercado',
                'Denunciar item',
              ].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="hover:text-[#E0A96D] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Coleções */}
          <div>
            <h4 className="text-sm font-bold text-[#F5F2EB] tracking-wide mb-4">
              Coleções
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                'Arte digital',
                'Fotografia',
                'Música',
                'Arte 3D',
                'Utilidade',
              ].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="hover:text-[#E0A96D] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Redes sociais e Carteiras */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-[#F5F2EB] tracking-wide mb-4">
                Redes sociais
              </h4>
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Youtube, label: 'YouTube' },
                ].map(({ icon: Icon, label }, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2D231B] bg-[#140F0D] text-[#A8988B] hover:text-[#E0A96D] hover:border-[#E0A96D]/40 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#F5F2EB] tracking-wider uppercase mb-3">
                Carteiras compatíveis
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {['METAMASK', 'WALLETCONNECT', 'COINBASE'].map((wallet) => (
                  <Badge
                    key={wallet}
                    variant="wallet"
                    className="border-[#2D231B] bg-[#140F0D] text-[#8C7C6F] hover:text-[#E0A96D] transition-colors py-1 px-2.5"
                  >
                    {wallet}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#1B140F] py-6 px-4 text-center text-[11px] font-mono text-[#6E5D50]">
        © 2026 Kurio. Propriedade digital para todos.
      </div>
    </footer>
  )
}
