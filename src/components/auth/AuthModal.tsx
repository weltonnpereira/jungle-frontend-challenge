import * as React from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/src/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/src/components/ui/sheet'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { cn } from '@/src/lib/utils'

export type AuthMode = 'login' | 'register'

export interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  authMode: AuthMode
  setAuthMode: (mode: AuthMode) => void
  onSuccess?: (userData: { name: string; email: string }) => void
  onForgotPassword?: () => void
  onSocialLogin?: (provider: 'google' | 'facebook') => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onOpenChange,
  authMode,
  setAuthMode,
  onSuccess,
  onForgotPassword,
  onSocialLogin,
}) => {
  // Form state
  const [email, setEmail] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  // Password visibility toggles
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  // Feedback state
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset error when switching mode
  React.useEffect(() => {
    setErrorMsg(null)
  }, [authMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (authMode === 'login') {
      if (!email || !password) {
        setErrorMsg('Por favor, preencha todos os campos.')
        return
      }
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        onSuccess?.({
          name: email.split('@')[0],
          email,
        })
        onOpenChange(false)
      }, 600)
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setErrorMsg('Por favor, preencha todos os campos.')
        return
      }
      if (password !== confirmPassword) {
        setErrorMsg('As senhas não coincidem.')
        return
      }
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        onSuccess?.({
          name: username,
          email,
        })
        onOpenChange(false)
      }, 600)
    }
  }

  // Google multi-colored icon
  const GoogleIcon = () => (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
      />
    </svg>
  )

  // Facebook official icon
  const FacebookIcon = () => (
    <svg className="h-4 w-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )

  // Shared Form Body
  const renderFormContent = (isMobile: boolean = false) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Feedback Alert */}
      {errorMsg && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-center text-xs text-red-400 font-mono">
          {errorMsg}
        </div>
      )}

      {/* Register: Username */}
      {authMode === 'register' && (
        <div className="space-y-1">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome de usuário"
            required
            className="h-12 rounded-xl border-[#2E2219] bg-[#16110E] px-4 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
          />
        </div>
      )}

      {/* Email input */}
      <div className="space-y-1">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={
            authMode === 'login' ? 'contato@email.com' : 'Digite seu e-mail'
          }
          required
          className="h-12 rounded-xl border-[#2E2219] bg-[#16110E] px-4 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
        />
      </div>

      {/* Password input with eye toggle */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={authMode === 'login' ? '************' : 'Senha'}
            required
            className="h-12 rounded-xl border-[#2E2219] bg-[#16110E] pl-4 pr-11 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7C6F] hover:text-[#E0A96D] transition-colors p-1"
            aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
          >
            {showPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Register: Confirm Password input */}
      {authMode === 'register' && (
        <div className="space-y-1">
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar senha"
              required
              className="h-12 rounded-xl border-[#2E2219] bg-[#16110E] pl-4 pr-11 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7C6F] hover:text-[#E0A96D] transition-colors p-1"
              aria-label={
                showConfirmPassword ? 'Ocultar confirmação' : 'Exibir confirmação'
              }
            >
              {showConfirmPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password link (Login mode only) */}
      {authMode === 'login' && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onForgotPassword}
            className="font-mono text-xs text-[#E0A96D] hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-[#D48D48] font-mono text-sm font-bold text-[#0D0B0A] shadow-md transition-all hover:bg-[#E0A96D] hover:shadow-[#D48D48]/20 active:scale-[0.99]"
        >
          {isSubmitting
            ? 'Processando...'
            : authMode === 'login'
            ? 'Entrar'
            : isMobile
            ? 'Criar perfil'
            : 'Criar conta'}
        </Button>
      </div>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2A1E16]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#17110E] px-3 font-mono text-[11px] text-[#A8988B]">
            Ou continue com
          </span>
        </div>
      </div>

      {/* Social Providers */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => onSocialLogin?.('google')}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#2E2219] bg-[#16110E] px-4 font-mono text-xs text-[#F3E8E2] transition-colors hover:border-[#E0A96D]/50 hover:bg-[#201813]"
        >
          <GoogleIcon />
          <span>Continuar com Google</span>
        </button>

        <button
          type="button"
          onClick={() => onSocialLogin?.('facebook')}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#2E2219] bg-[#16110E] px-4 font-mono text-xs text-[#F3E8E2] transition-colors hover:border-[#E0A96D]/50 hover:bg-[#201813]"
        >
          <FacebookIcon />
          <span>Continuar com Facebook</span>
        </button>
      </div>

      {/* Mobile Footer text toggle */}
      {isMobile && (
        <div className="pt-6 text-center">
          {authMode === 'login' ? (
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className="font-mono text-xs text-[#F5F2EB] hover:text-[#E0A96D] transition-colors"
            >
              Novo na Kurio?{' '}
              <span className="text-[#E0A96D] underline underline-offset-4">
                Crie uma conta
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="font-mono text-xs text-[#F5F2EB] hover:text-[#E0A96D] transition-colors"
            >
              Já tem uma conta?{' '}
              <span className="text-[#E0A96D] underline underline-offset-4">
                Entre
              </span>
            </button>
          )}
        </div>
      )}
    </form>
  )

  return (
    <>
      {/* ================= DESKTOP MODAL (sm and up) ================= */}
      <div className="hidden sm:block">
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-md rounded-2xl border border-[#34271E] bg-[#17110E] p-8 pb-7 text-[#F3E8E2] shadow-2xl">
            {/* Desktop Header */}
            <div className="text-center space-y-3 pb-2">
              <DialogTitle asChild>
                <div className="flex items-center justify-center gap-3 font-mono text-2xl font-bold tracking-tight">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={cn(
                      'transition-colors hover:text-[#E0A96D]',
                      authMode === 'login' ? 'text-[#E0A96D]' : 'text-[#F5F2EB]'
                    )}
                  >
                    Entrar
                  </button>
                  <span className="text-[#6E5D50] font-normal">|</span>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={cn(
                      'transition-colors hover:text-[#E0A96D]',
                      authMode === 'register'
                        ? 'text-[#E0A96D]'
                        : 'text-[#F5F2EB]'
                    )}
                  >
                    Criar conta
                  </button>
                </div>
              </DialogTitle>

              <DialogDescription className="font-mono text-xs text-[#A8988B] leading-relaxed max-w-xs mx-auto">
                {authMode === 'login'
                  ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
                  : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
              </DialogDescription>
            </div>

            {/* Desktop Form */}
            {renderFormContent(false)}

            {/* Bottom caramel accent strip */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#D48D48]" />
          </DialogContent>
        </Dialog>
      </div>

      {/* ================= MOBILE MODAL (Sheet full/drawer) ================= */}
      <div className="sm:hidden">
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent
            side="bottom"
            className="h-[92vh] max-h-[92vh] w-full rounded-t-3xl border-t border-[#34271E] bg-[#140E0B] p-6 pt-5 overflow-y-auto"
          >
            {/* Top Drag Indicator */}
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[#3D2E23]" />

            {/* Mobile Header with KURIO Brand */}
            <div className="text-center space-y-3 pb-4">
              <span className="block font-mono text-xl font-black uppercase tracking-[0.25em] text-[#F5F2EB]">
                KURIO
              </span>

              <SheetTitle asChild>
                <h3 className="font-mono text-base font-bold text-[#F5F2EB]">
                  {authMode === 'login' ? 'Entrar' : 'Criar perfil de colecionador'}
                </h3>
              </SheetTitle>

              <SheetDescription className="sr-only">
                {authMode === 'login'
                  ? 'Acesse sua conta na Kurio'
                  : 'Crie seu perfil de colecionador'}
              </SheetDescription>
            </div>

            {/* Mobile Form with Footer switch */}
            {renderFormContent(true)}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
