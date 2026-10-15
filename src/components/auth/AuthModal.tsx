import * as React from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { useMediaQuery } from "@/src/hooks/use-media-query";
import FacebookIcon from "@/src/assets/images/svg/Icons/Facebook.svg?react";
import GoogleIcon from "@/src/assets/images/svg/Icons/Google.svg?react";

export type AuthMode = "login" | "register";

export interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  onSuccess?: (userData: { name: string; email: string }) => void;
  onForgotPassword?: () => void;
  onSocialLogin?: (provider: "google" | "facebook") => void;
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
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Password visibility toggles
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Feedback state
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset error when switching mode
  React.useEffect(() => {
    setErrorMsg(null);
  }, [authMode]);

  function useIsMounted() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return mounted;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (authMode === "login") {
      if (!email || !password) {
        setErrorMsg("Por favor, preencha todos os campos.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.({
          name: email.split("@")[0],
          email,
        });
        onOpenChange(false);
      }, 600);
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setErrorMsg("Por favor, preencha todos os campos.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("As senhas não coincidem.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.({
          name: username,
          email,
        });
        onOpenChange(false);
      }, 600);
    }
  };

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
      {authMode === "register" && (
        <div className="space-y-1">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome de usuário"
            required
            className="h-12 rounded-xl border-[#3F2319] bg-[#16110E] px-4 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
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
            authMode === "login" ? "contato@email.com" : "Digite seu e-mail"
          }
          required
          className="h-12 rounded-xl border-[#3F2319] bg-[#16110E] px-4 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
        />
      </div>

      {/* Password input with eye toggle */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={authMode === "login" ? "************" : "Senha"}
            required
            className="h-12 rounded-xl border-[#3F2319] bg-[#16110E] pl-4 pr-11 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7C6F] hover:text-[#E0A96D] transition-colors p-1"
            aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
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
      {authMode === "register" && (
        <div className="space-y-1">
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar senha"
              required
              className="h-12 rounded-xl border-[#3F2319] bg-[#16110E] pl-4 pr-11 font-mono text-xs text-[#F3E8E2] placeholder:text-[#6E5D50] focus-visible:border-[#E0A96D]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7C6F] hover:text-[#E0A96D] transition-colors p-1"
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmação"
                  : "Exibir confirmação"
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
      {authMode === "login" && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onForgotPassword}
            className="font-mono text-xs text-[#E89B55] hover:underline"
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
            ? "Processando..."
            : authMode === "login"
              ? "Entrar"
              : isMobile
                ? "Criar perfil"
                : "Criar conta"}
        </Button>
      </div>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2A1E16]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#17110E] px-3 font-mono text-[12px] text-[#F5F1EB]">
            Ou continue com
          </span>
        </div>
      </div>

      {/* Social Providers */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => onSocialLogin?.("google")}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#3F2319] bg-[#16110E] px-4 font-mono text-xs text-[#CFB28C] transition-colors hover:border-[#E0A96D]/50 hover:bg-[#201813]"
        >
          <GoogleIcon className="w-4.8 h-4.8" />
          <span>Continuar com Google</span>
        </button>

        <button
          type="button"
          onClick={() => onSocialLogin?.("facebook")}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#3F2319] bg-[#16110E] px-4 font-mono text-xs text-[#CFB28C] transition-colors hover:border-[#E0A96D]/50 hover:bg-[#201813]"
        >
          <FacebookIcon className="w-4.8 h-4.8" />
          <span>Continuar com Facebook</span>
        </button>
      </div>

      {/* Mobile Footer text toggle */}
      {isMobile && (
        <div className="pt-6 text-center">
          {authMode === "login" ? (
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className="font-mono text-[15px] text-[#F5F2EB] hover:text-[#E0A96D] transition-colors"
            >
              Novo na Kurio?{" "}
              <span className="text-[#E0A96D] underline underline-offset-4">
                Crie uma conta
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className="font-mono text-[15px] text-[#F5F2EB] hover:text-[#E0A96D] transition-colors"
            >
              Já tem uma conta?{" "}
              <span className="text-[#E0A96D] underline underline-offset-4">
                Entre
              </span>
            </button>
          )}
        </div>
      )}
    </form>
  );

  const isDesktop = useMediaQuery("(min-width: 640px)");
  const isMounted = useIsMounted();

  if (!isMounted || !isOpen) return null;

  return (
    <>
      {isDesktop ? (
        /* ================= DESKTOP MODAL ================= */
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-md rounded-none border-[#3F2319] bg-[#17110E] p-10 pb-15 text-[#F3E8E2] shadow-2xl">
            {/* Container superior (Header + Formulário) */}
            <div className="space-y-6">
              {/* Desktop Header */}
              <div className="text-center space-y-5 pb-5">
                <DialogTitle asChild>
                  <div className="flex items-center justify-center gap-3 font-mono text-2xl font-regular tracking-tight">
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className={cn(
                        "transition-colors hover:text-[#E0A96D]",
                        authMode === "login"
                          ? "text-[#E89B55]"
                          : "text-[#F5F2EB]",
                      )}
                    >
                      Entrar
                    </button>
                    <span className="text-[#F0805F] font-normal">|</span>
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className={cn(
                        "transition-colors hover:text-[#E0A96D]",
                        authMode === "register"
                          ? "text-[#E0A96D]"
                          : "text-[#F5F2EB]",
                      )}
                    >
                      Criar conta
                    </button>
                  </div>
                </DialogTitle>

                <DialogDescription className="font-mono tracking-wider text-[15px] text-[#F5F1EB] leading-relaxed max-w-xs mx-auto">
                  {authMode === "login"
                    ? "Entre para gerenciar sua carteira, coleção e perfil de criador."
                    : "Crie seu perfil de colecionador e conecte uma carteira quando quiser."}
                </DialogDescription>
              </div>

              {/* Desktop Form */}
              {renderFormContent(false)}
            </div>

            {/* Bottom caramel accent strip fixado na base do conteúdo */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#D28A4C] rounded-none pointer-events-none" />
          </DialogContent>
        </Dialog>
      ) : (
        /* ================= MOBILE MODAL ================= */
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent
            side="bottom"
            className="h-full w-full rounded-t-3xl border-t border-[#34271E] bg-[#140E0B] p-6 pt-5 overflow-y-auto flex flex-col"
          >
            {/* Top Drag Indicator */}
            <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-[#3D2E23]" />

            {/* KURIO Brand (Mais para baixo) */}
            <div className="text-center pb-20">
              <span className="block mt-16 font-mono text-[31px] font-black uppercase tracking-[0.25em] text-[#F5F2EB]">
                KURIO
              </span>
            </div>

            {/* Container que junta o Título e o Formulário colados */}
            <div className="space-y-7">
              <div className="text-center">
                <SheetTitle asChild>
                  <h3 className="font-mono text-[20px] font-normal text-[#F5F2EB]">
                    {authMode === "login"
                      ? "Entrar"
                      : "Criar perfil de colecionador"}
                  </h3>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {authMode === "login"
                    ? "Acesse sua conta na Kurio"
                    : "Crie seu perfil de colecionador"}
                </SheetDescription>
              </div>

              {/* Formulário */}
              {renderFormContent(true)}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
