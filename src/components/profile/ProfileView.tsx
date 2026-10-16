import * as React from "react";
import {
  User,
  Wallet,
  Activity,
  Heart,
  Tag,
  Download,
  HelpCircle,
  LogOut,
  Eye,
  EyeOff,
  Camera,
  Check,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { api } from "@/src/services/api";
import { cn } from "@/src/lib/utils";

export interface ProfileViewProps {
  onNavigateTab?: (tab: string) => void;
  onLogout?: () => void;
  onSaved?: (message: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigateTab,
  onLogout,
  onSaved,
}) => {
  // Form State
  const [displayName, setDisplayName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [ensName, setEnsName] = React.useState("");
  const [walletNickname, setWalletNickname] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("/assets/hero-nft.webp");

  console.log("Avatar URL atual:", avatarUrl);

  // Password fields
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  // Password visibility
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);
  const [isSocial, setIsSocial] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Load profile from API / localStorage on mount
  React.useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        if (res.data) {
          if (res.data.displayName) setDisplayName(res.data.displayName);
          if (res.data.username) setUsername(res.data.username);
          if (res.data.email) setEmail(res.data.email);

          if (res.data.isSocial) setIsSocial(res.data.isSocial);
          if (res.data.ensName) setEnsName(res.data.ensName);
          if (res.data.walletNickname)
            setWalletNickname(res.data.walletNickname);
          if (res.data.avatar) setAvatarUrl(res.data.avatar);
        }
      })
      .catch(() => {
        // use defaults
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await api.put("/profile", {
        displayName,
        username,
        email,
        ensName,
        walletNickname,
        avatar: avatarUrl,
      });
      setFeedback("Perfil atualizado com sucesso!");
      onSaved?.("Perfil atualizado com sucesso!");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(err.message || "Erro ao salvar o perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = () => {
    // Cycle between avatars for demonstration
    const avatars = [
      "/assets/hero-nft.webp",
      "/assets/sage-nomad.webp",
      "/assets/ivory-baron.webp",
      "/assets/golden-beat.webp",
    ];
    const nextIdx = (avatars.indexOf(avatarUrl) + 1) % avatars.length;
    setAvatarUrl(avatars[nextIdx]);
  };

  const navItems = [
    { id: "profile", label: "Dados do perfil", icon: User, active: true },
    { id: "wallets", label: "Carteiras", icon: Wallet, active: false },
    { id: "activity", label: "Atividade", icon: Activity, active: false },
    {
      id: "watchlist",
      label: "Lista de interesse",
      icon: Heart,
      active: false,
    },
    { id: "offers", label: "Ofertas", icon: Tag, active: false },
    {
      id: "downloads",
      label: "Arquivos baixados",
      icon: Download,
      active: false,
    },
    { id: "support", label: "Suporte", icon: HelpCircle, active: false },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0D0B0A] text-[#F3E8E2] pb-24 sm:pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================= LEFT SIDEBAR (Meu perfil) ================= */}
          <aside className="lg:col-span-3 space-y-4">
            <h3 className="font-mono text-base font-bold text-[#F5F2EB] tracking-wide mb-4">
              Meu perfil
            </h3>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigateTab?.(item.id)}
                    className={cn(
                      "flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-mono text-xs transition-colors text-left relative",
                      item.active
                        ? "text-[#E0A96D] bg-[#1A1410] font-bold border-l-2 border-[#E0A96D]"
                        : "text-[#A8988B] hover:text-[#F5F2EB] hover:bg-[#16110E]",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-mono text-xs text-[#8C7C6F] hover:text-red-400 hover:bg-[#1A1410] transition-colors text-left pt-3"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sair</span>
              </button>
            </div>

            {/* Mobile Horizontal Tabs */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#241A14] no-scrollbar">
              {navItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateTab?.(item.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-colors shrink-0",
                    item.active
                      ? "bg-[#E0A96D] text-[#0D0B0A] font-bold"
                      : "bg-[#18120E] text-[#A8988B] border border-[#2D231B]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* ================= RIGHT CONTENT: Perfil do colecionador ================= */}
          <main className="lg:col-span-9 space-y-8">
            <div className="space-y-6">
              <h2 className="font-mono text-base font-bold text-[#F5F2EB] tracking-wide">
                Perfil do colecionador
              </h2>

              {feedback && (
                <div className="rounded-xl border border-[#E0A96D]/40 bg-[#1F1712] p-3 text-xs font-mono text-[#E0A96D] flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                {/* Row 1: Nome de exibição & Nome de usuário */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Nome de exibição<span className="text-[#E0A96D]">*</span>
                    </label>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Nome de usuário<span className="text-[#E0A96D]">*</span>
                    </label>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>
                </div>

                {/* Row 2: E-mail & Nome ENS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      E-mail<span className="text-[#E0A96D]">*</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Nome ENS<span className="text-[#E0A96D]">*</span>
                    </label>
                    <div className="flex">
                      <Input
                        type="text"
                        value={ensName}
                        onChange={(e) => setEnsName(e.target.value)}
                        required
                        className="h-11 rounded-l-xl rounded-r-none border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                      />
                      <div className="h-11 flex items-center px-3 border border-l-0 border-[#2E2219] bg-[#1E1712] rounded-r-xl font-mono text-xs text-[#8C7C6F]">
                        .eth
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Apelido da carteira & Avatar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Apelido da carteira
                      <span className="text-[#E0A96D]">*</span>
                    </label>
                    <Input
                      type="text"
                      value={walletNickname}
                      onChange={(e) => setWalletNickname(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                    />
                  </div>

                  {/* Avatar Picker matching Perfil do Colecionador desktop.jpg */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-[#A8988B]">
                      Avatar
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden border border-[#3E3025] bg-[#1F1712] shrink-0">
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleAvatarChange}
                        size="sm"
                        className="h-9 px-4 rounded-xl bg-[#D48D48] text-[#0D0B0A] hover:bg-[#E0A96D] font-mono text-xs font-bold"
                      >
                        Alterar
                      </Button>
                      <button
                        type="button"
                        onClick={() => setAvatarUrl("/assets/hero-nft.webp")}
                        className="font-mono text-xs text-[#8C7C6F] hover:text-[#F5F2EB] transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section: Alterar senha */}
                {!isSocial && (
                  <div className="pt-6 border-t border-[#241A14] space-y-4">
                    <h3 className="font-mono text-sm font-bold text-[#F5F2EB]">
                      Alterar senha
                    </h3>

                    {/* Senha atual */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs text-[#A8988B]">
                        Senha atual
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] pr-10 font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7C6F] hover:text-[#E0A96D]"
                        >
                          {showCurrent ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Nova senha */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs text-[#A8988B]">
                        Nova senha
                      </label>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] pr-10 font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7C6F] hover:text-[#E0A96D]"
                        >
                          {showNew ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirmar nova senha */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs text-[#A8988B]">
                        Confirmar nova senha
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          placeholder="••••••••••••"
                          className="h-11 rounded-xl border-[#2E2219] bg-[#16110E] pr-10 font-mono text-xs text-[#F3E8E2] focus-visible:border-[#E0A96D]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7C6F] hover:text-[#E0A96D]"
                        >
                          {showConfirm ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Salvar Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-11 px-8 rounded-xl bg-[#D48D48] text-[#0D0B0A] hover:bg-[#E0A96D] font-mono text-xs font-bold shadow-md shadow-[#D48D48]/20"
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default ProfileView;
