import * as React from 'react'
import { Home, Heart, ShoppingBag, User, Scan } from 'lucide-react'
import { cn } from '@/src/lib/utils'

export interface MobileNavigationProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  onScanClick?: () => void
  cartCount?: number
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab = 'home',
  onTabChange,
  onScanClick,
  cartCount = 6,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Background container with rounded top and subtle border */}
      <div className="relative border-t border-[#34271E] bg-[#17110D]/95 backdrop-blur-lg px-6 py-2.5 pb-5">
        <div className="flex items-center justify-between">
          {/* Home */}
          <button
            type="button"
            onClick={() => onTabChange?.('home')}
            className={cn(
              'flex flex-col items-center justify-center p-2 transition-colors',
              activeTab === 'home'
                ? 'text-[#E0A96D]'
                : 'text-[#A8988B] hover:text-[#F3E8E2]'
            )}
            aria-label="Início"
          >
            <Home className="h-5 w-5" />
          </button>

          {/* Favorites */}
          <button
            type="button"
            onClick={() => onTabChange?.('favorites')}
            className={cn(
              'flex flex-col items-center justify-center p-2 transition-colors',
              activeTab === 'favorites'
                ? 'text-[#E0A96D]'
                : 'text-[#A8988B] hover:text-[#F3E8E2]'
            )}
            aria-label="Favoritos"
          >
            <Heart className="h-5 w-5" />
          </button>

          {/* Central Floating Scanner / Action Button */}
          <div className="relative -top-5 flex justify-center">
            <button
              type="button"
              onClick={onScanClick}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#C98748] via-[#E0A96D] to-[#F1C694] text-[#0D0B0A] shadow-lg shadow-[#E0A96D]/30 ring-4 ring-[#17110D] active:scale-95 transition-all"
              aria-label="Escanear ou Cunhar"
            >
              <Scan className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={() => onTabChange?.('cart')}
            className={cn(
              'relative flex flex-col items-center justify-center p-2 transition-colors',
              activeTab === 'cart'
                ? 'text-[#E0A96D]'
                : 'text-[#A8988B] hover:text-[#F3E8E2]'
            )}
            aria-label="Carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#E0A96D] text-[9px] font-bold text-[#0D0B0A] font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button
            type="button"
            onClick={() => onTabChange?.('profile')}
            className={cn(
              'flex flex-col items-center justify-center p-2 transition-colors',
              activeTab === 'profile'
                ? 'text-[#E0A96D]'
                : 'text-[#A8988B] hover:text-[#F3E8E2]'
            )}
            aria-label="Perfil"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
