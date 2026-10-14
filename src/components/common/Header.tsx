import * as React from 'react'
import {
  Search,
  ShoppingBag,
  LogIn,
  SlidersHorizontal,
  X,
  UserCheck,
  LogOut,
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { cn } from '@/src/lib/utils'

export interface HeaderProps {
  activeNav?: string
  onNavClick?: (nav: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
  cartCount?: number
  onOpenCart?: () => void
  onOpenFiltersSheet?: () => void
  onLoginClick?: () => void
  currentUser?: { name: string; email: string } | null
  onLogout?: () => void
  activeFiltersCount?: number
}

const NAV_LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'mercado', label: 'Mercado' },
  { id: 'criadores', label: 'Criadores' },
  { id: 'aprenda', label: 'Aprenda' },
]

export const Header: React.FC<HeaderProps> = ({
  activeNav = 'inicio',
  onNavClick,
  searchValue,
  onSearchChange,
  cartCount = 6,
  onOpenCart,
  onOpenFiltersSheet,
  onLoginClick,
  currentUser = null,
  onLogout,
  activeFiltersCount = 0,
}) => {
  const [showDesktopSearch, setShowDesktopSearch] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D0B0A]/95 backdrop-blur-md border-b border-[#241A14]">
      {/* ================= DESKTOP HEADER (sm and up) ================= */}
      <div className="hidden sm:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => onNavClick?.('inicio')}
            className="text-xl font-black uppercase tracking-widest text-[#F5F2EB] hover:text-[#E0A96D] transition-colors font-mono"
          >
            KURIO
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeNav === link.id
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavClick?.(link.id)}
                className={cn(
                  'relative py-2 text-sm font-medium tracking-wide transition-colors',
                  isActive
                    ? 'text-[#E0A96D] font-bold'
                    : 'text-[#A8988B] hover:text-[#F3E8E2]'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E0A96D] rounded-full" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right Tools: Search, Cart, Login */}
        <div className="flex items-center gap-4">
          {/* Desktop Search */}
          {showDesktopSearch ? (
            <div className="relative flex items-center">
              <Input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar NFTs, coleções..."
                className="w-60 h-9 text-xs pl-8 pr-7 bg-[#1A1410] border-[#382B21] text-[#F3E8E2] placeholder:text-[#8C7C6F] rounded-lg"
              />
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-[#8C7C6F]" />
              <button
                type="button"
                onClick={() => {
                  setShowDesktopSearch(false)
                  onSearchChange('')
                }}
                className="absolute right-2 text-[#8C7C6F] hover:text-[#F3E8E2]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDesktopSearch(true)}
              aria-label="Buscar"
              className="p-2 text-[#F3E8E2] hover:text-[#E0A96D] transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {/* Cart Icon with Counter */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Carrinho de compras"
            className="relative p-2 text-[#F3E8E2] hover:text-[#E0A96D] transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0A96D] px-1 text-[10px] font-bold text-[#0D0B0A] font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile or Entrar Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-[#34271E] bg-[#17110E] px-3 py-1.5 text-xs text-[#F5F2EB]">
                <UserCheck className="h-3.5 w-3.5 text-[#E0A96D]" />
                <span className="font-mono font-bold truncate max-w-[100px]">
                  {currentUser.name}
                </span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Sair"
                className="p-2 text-[#8C7C6F] hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button
              onClick={onLoginClick}
              size="default"
              className="bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E9B880] font-bold text-xs gap-2 px-5 py-2 rounded-lg font-mono"
            >
              <LogIn className="h-4 w-4" />
              <span>Entrar</span>
            </Button>
          )}
        </div>
      </div>

      {/* ================= MOBILE HEADER (exact match to "início mobile.png") ================= */}
      <div className="sm:hidden px-4 py-3.5">
        <div className="flex items-center gap-3">
          {/* Mobile Search Bar Pill */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8988B]" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Explorar coleções"
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#18120E] border border-[#2F231A] text-xs text-[#E0A96D] placeholder:text-[#A8988B] focus:outline-none focus:border-[#E0A96D] focus:ring-1 focus:ring-[#E0A96D] font-mono"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7C6F] hover:text-[#F3E8E2]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Button - opens Mobile Filter Sheet */}
          <button
            type="button"
            onClick={onOpenFiltersSheet}
            aria-label="Abrir filtros"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E0A96D] text-[#0D0B0A] shadow-md shadow-[#E0A96D]/15 active:scale-95 transition-all"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#18120E] text-[10px] font-bold text-[#E0A96D] border border-[#E0A96D]">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
