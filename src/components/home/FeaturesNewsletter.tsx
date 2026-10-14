import * as React from 'react'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'

export interface FeaturesNewsletterProps {
  onSubscribe?: (email: string) => void
}

export const FeaturesNewsletter: React.FC<FeaturesNewsletterProps> = ({
  onSubscribe,
}) => {
  const [email, setEmail] = React.useState('')
  const [isSubscribed, setIsSubscribed] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubscribed(true)
    onSubscribe?.(email)
    setEmail('')
    setTimeout(() => setIsSubscribed(false), 4000)
  }

  const features = [
    {
      letter: 'W',
      title: 'Segurança da carteira',
      description:
        'Proteja sua carteira e colecione arte digital verificada com confiança.',
    },
    {
      letter: 'C',
      title: 'Criadores em destaque',
      description:
        'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
    },
    {
      letter: 'D',
      title: 'Alertas de lançamentos',
      description:
        'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
    },
  ]

  return (
    <section className="w-full py-12 border-t border-[#221A15]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
        {/* 3 Value Propositions */}
        {features.map((item, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E0A96D] text-[#0D0B0A] font-bold text-lg font-mono shadow-md shadow-[#E0A96D]/15">
              {item.letter}
            </div>
            <h4 className="text-sm font-bold text-[#F5F2EB]">{item.title}</h4>
            <p className="text-xs text-[#A8988B] leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}

        {/* Newsletter Box */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#F5F2EB]">
            Antecipe-se ao próximo lançamento
          </h4>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="digite seu e-mail..."
              required
              className="h-10 text-xs bg-[#1A1410] border-[#342921] text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
            />
            <Button
              type="submit"
              size="sm"
              className="h-10 bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold text-xs px-4 rounded-xl shrink-0"
            >
              {isSubscribed ? 'Enviado!' : 'Enviar'}
            </Button>
          </form>

          <p className="text-[11px] text-[#8C7C6F] leading-relaxed">
            Receba lançamentos selecionados, histórias de criadores e novidades
            do mercado.
          </p>
        </div>
      </div>
    </section>
  )
}
