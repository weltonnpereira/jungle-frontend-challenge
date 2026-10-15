import * as React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Wallet,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { FeaturesNewsletter } from "../home/FeaturesNewsletter";

export interface FooterProps {
  onSubscribeNewsletter?: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSubscribeNewsletter }) => {
  return (
    <footer className="w-full bg-[#0D0B0A] text-[#A8988B] pb-24 sm:pb-8">
      {/* Caixa principal centralizada (Largura máxima 5xl) */}
      <div className="w-full max-w-6xl bg-[#241612] mx-auto border-t border-[#221A15]">
        {/* Newsletter (Com padding próprio para o texto não colar) */}
        <div className="px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <FeaturesNewsletter onSubscribe={onSubscribeNewsletter} />
        </div>

        {/* Mid Banner (Dentro da caixa, com cor diferente de ponta a ponta da caixa) */}
        <div className="w-full bg-[#38220F] border-t border-b border-[#1E1712] py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-[#F5F1EB] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-center md:text-left">
            <span className="font-bold text-sm tracking-widest">
              KURIO
            </span>
            <span className="text-center">
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

        {/* Main 4 Footer Columns (Com padding próprio nas laterais) */}
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center sm:text-left">
            {/* Col 1: Meu perfil */}
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-sm font-bold text-[#F5F1EB] tracking-wide mb-4">
                Meu perfil
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  "Meu perfil",
                  "Minha coleção",
                  "Atividade",
                  "Estúdio do criador",
                  "Lista de interesse",
                ].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="hover:text-[#E0A96D] text-[#F5F1EB] transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2: Central de ajuda */}
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-sm font-bold text-[#F5F2EB] tracking-wide mb-4">
                Central de ajuda
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  "Central de ajuda",
                  "Como comprar NFTs",
                  "Carteira e segurança",
                  "Política do mercado",
                  "Denunciar item",
                ].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="hover:text-[#E0A96D] text-[#F5F1EB] transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Coleções */}
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-sm font-bold text-[#F5F2EB] tracking-wide mb-4">
                Coleções
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  "Arte digital",
                  "Fotografia",
                  "Música",
                  "Arte 3D",
                  "Utilidade",
                ].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="hover:text-[#E0A96D] text-[#F5F1EB] transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Redes sociais e Carteiras */}
            <div className="col-span-2 md:col-span-1 space-y-6 flex flex-col items-center sm:items-start">
              <div className="flex flex-col items-center sm:items-start w-full">
                <h4 className="text-sm font-bold text-[#F5F2EB] tracking-wide mb-4">
                  Redes sociais
                </h4>
                <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                  {[
                    { icon: Facebook, label: "Facebook" },
                    { icon: Instagram, label: "Instagram" },
                    { icon: Twitter, label: "Twitter" },
                    { icon: Linkedin, label: "LinkedIn" },
                    { icon: Youtube, label: "YouTube" },
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

              <div className="flex flex-col items-center sm:items-start w-full">
                <h4 className="text-xs font-bold text-[#F5F2EB] tracking-wider uppercase mb-3">
                  Carteiras compatíveis
                </h4>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {["METAMASK", "WALLETCONNECT", "COINBASE"].map((wallet) => (
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
      </div>

      {/* Copyright de ponta a ponta na tela */}
      <div className="w-full bg-[#0D0B0A] py-4 px-4 text-center text-[13px] font-mono text-[#F5F1EB]">
        © 2026 Kurio. Propriedade digital para todos.
      </div>
    </footer>
  );
};