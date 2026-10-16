import { http, HttpResponse } from "msw";
import { NFT } from "@/src/types/nft";
import {
  CartItem,
  CollectorProfile,
  OrderConfirmationData,
  SecondaryWallet,
} from "@/src/types/cart";
import { MOCK_NFTS } from "@/src/mocks/nftData";

class StorageService {
  private memory = new Map<string, string>();

  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item) return JSON.parse(item) as T;
      } else {
        const mem = this.memory.get(key);
        if (mem) return JSON.parse(mem) as T;
      }
    } catch {
      // fallback
    }
    return defaultValue;
  }

  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      }
      this.memory.set(key, serialized);
    } catch {
      // fallback
    }
  }
}

const storage = new StorageService();

const STORAGE_KEYS = {
  SESSION: "kurio_auth_session",
  TOKEN: "kurio_auth_token",
  USERS: "kurio_registered_users",
  NFTS: "kurio_nfts",
  CART: "kurio_cart",
  ORDERS: "kurio_orders",
  FAVORITES: "kurio_favorites",
  IDEMPOTENCY: "kurio_idempotency_keys",
  PROFILES: "kurio_all_profiles",
};

if (!storage.get<NFT[] | null>(STORAGE_KEYS.NFTS, null)) {
  storage.set(STORAGE_KEYS.NFTS, MOCK_NFTS);
}

// Cria o perfil unificado usando estritamente os dados do usuário real
const createUserProfile = (
  name: string,
  email: string,
  social?: boolean,
): CollectorProfile => ({
  displayName: name,
  isSocial: social || false,
  walletNickname: "Minha carteira principal",
  username: "@" + name.toLowerCase().replace(/\s+/g, ""),
  email: email,
  ensName: name.toLowerCase().replace(/\s+/g, ""),
  notes: "",
  avatar: "/assets/hero-nft.webp",
  walletAddress:
    "0x" + Math.random().toString(16).substring(2, 22).toUpperCase(),
  isSecondaryEqualMain: false,
  secondaryWallet: undefined,
  profileName: "Galeria Kurio Principal",
  walletType: "Coinbase Wallet",
  network: "Ethereum",
  referralCode: "KURIO-" + Math.floor(1000 + Math.random() * 9000),
});

// Helper para obter o e-mail da sessão atual
const getCurrentSessionEmail = (): string | null => {
  const session = storage.get<{ email: string } | null>(
    STORAGE_KEYS.SESSION,
    null,
  );
  return session?.email || null;
};

const getStoredProfiles = (): Record<string, CollectorProfile> => {
  return storage.get<Record<string, CollectorProfile>>(
    STORAGE_KEYS.PROFILES,
    {},
  );
};

// Garante que o usuário recém-logado/cadastrado tenha seu perfil criado
const ensureUserProfileExists = (
  name: string,
  email: string,
  social: boolean = false,
) => {
  const profiles = getStoredProfiles();
  if (!profiles[email]) {
    profiles[email] = createUserProfile(name, email, social);
    storage.set(STORAGE_KEYS.PROFILES, profiles);
  }
};

export const handlers = [
  // -------------------------------------------------------------
  // 1. AUTH ENDPOINTS
  // -------------------------------------------------------------
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    if (!body?.email || !body?.password) {
      return HttpResponse.json(
        { message: "E-mail e senha são obrigatórios." },
        { status: 401 },
      );
    }

    const users = storage.get<any[]>(STORAGE_KEYS.USERS, []);
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === body.email?.toLowerCase() &&
        u.password === body.password,
    );

    if (!foundUser) {
      return HttpResponse.json(
        { message: "E-mail ou senha incorretos." },
        { status: 401 },
      );
    }

    const userSession = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      avatar: foundUser.avatar || "/assets/hero-nft.webp",
    };

    const token = "jwt-mock-token-" + Date.now();
    storage.set(STORAGE_KEYS.SESSION, userSession);
    storage.set(STORAGE_KEYS.TOKEN, token);

    // Cria/garante o perfil apenas para este usuário logado
    ensureUserProfileExists(foundUser.name, foundUser.email);

    return HttpResponse.json({
      user: userSession,
      token,
      message: "Login realizado com sucesso.",
    });
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };
    if (!body?.email || !body?.password || !body?.name) {
      return HttpResponse.json(
        { message: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 },
      );
    }

    let users = storage.get<any[]>(STORAGE_KEYS.USERS, []);
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === body.email?.toLowerCase(),
    );

    if (emailExists) {
      return HttpResponse.json(
        {
          message: "Este e-mail já está cadastrado. Faça login para continuar.",
        },
        { status: 409 },
      );
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name: body.name,
      email: body.email,
      password: body.password,
      avatar: "/assets/sage-nomad.webp",
    };

    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    };

    const token = "jwt-mock-token-" + Date.now();
    storage.set(STORAGE_KEYS.SESSION, userSession);
    storage.set(STORAGE_KEYS.TOKEN, token);

    // Cria o perfil vinculado ao novo usuário cadastrado
    ensureUserProfileExists(newUser.name, newUser.email);

    return HttpResponse.json({
      user: userSession,
      token,
      message: "Cadastro realizado com sucesso.",
    });
  }),

  http.post("/api/auth/social", async ({ request }) => {
    const body = (await request.json()) as {
      provider: "google" | "facebook";
      email?: string;
      name?: string;
    };
    const providerName = body?.provider === "google" ? "Google" : "Facebook";
    const email = body?.email || `collector@${body?.provider || "social"}.com`;
    const name = body?.name || `${providerName} Collector`;

    let users = storage.get<any[]>(STORAGE_KEYS.USERS, []);
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: "usr-social-" + Date.now(),
        name: name,
        email: email,
        avatar: "/assets/hero-nft.webp",
        provider: body.provider,
      };
      users.push(user);
      storage.set(STORAGE_KEYS.USERS, users);
    }

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    const token = "jwt-mock-token-social-" + Date.now();
    storage.set(STORAGE_KEYS.SESSION, sessionData);
    storage.set(STORAGE_KEYS.TOKEN, token);

    ensureUserProfileExists(user.name, user.email, true);

    return HttpResponse.json({
      user: sessionData,
      token,
      message: `Conectado via ${providerName} com sucesso.`,
    });
  }),

  http.get("/api/auth/session", () => {
    const session = storage.get(STORAGE_KEYS.SESSION, null);
    return HttpResponse.json({ user: session });
  }),

  http.post("/api/auth/logout", () => {
    storage.set(STORAGE_KEYS.SESSION, null);
    storage.set(STORAGE_KEYS.TOKEN, null);
    return HttpResponse.json({ message: "Sessão encerrada." });
  }),

  // -------------------------------------------------------------
  // 2. NFTS ENDPOINTS
  // -------------------------------------------------------------
  http.get("/api/nfts", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const category = url.searchParams.get("category");
    const network = url.searchParams.get("network");
    const minPrice = parseFloat(url.searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(url.searchParams.get("maxPrice") || "999999");
    const sortBy = url.searchParams.get("sortBy") || "recent";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "9", 10);

    let nfts = storage.get<NFT[]>(STORAGE_KEYS.NFTS, MOCK_NFTS);

    if (search) {
      nfts = nfts.filter(
        (n) =>
          n.name.toLowerCase().includes(search) ||
          n.collection.toLowerCase().includes(search) ||
          n.tokenId.toLowerCase().includes(search),
      );
    }

    if (category) nfts = nfts.filter((n) => n.category === category);
    if (network) nfts = nfts.filter((n) => n.network === network);

    nfts = nfts.filter((n) => n.price >= minPrice && n.price <= maxPrice);

    if (sortBy === "price_asc") {
      nfts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      nfts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "likes_desc") {
      nfts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    const total = nfts.length;
    const startIndex = (page - 1) * limit;
    const paginated = nfts.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      data: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const { id } = params;
    const nfts = storage.get<NFT[]>(STORAGE_KEYS.NFTS, MOCK_NFTS);
    const found = nfts.find((n) => n.id === id);

    if (!found) {
      return HttpResponse.json(
        { message: "NFT não encontrado." },
        { status: 404 },
      );
    }

    return HttpResponse.json(found);
  }),

  // -------------------------------------------------------------
  // 3. CART ENDPOINTS
  // -------------------------------------------------------------
  http.get("/api/cart", () => {
    const cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, [
      {
        id: "cart-1",
        nft: MOCK_NFTS[0],
        quantity: 2,
        edition: "1/50",
        unitPrice: 1.19,
      },
      {
        id: "cart-2",
        nft: MOCK_NFTS[4],
        quantity: 6,
        edition: "1/1",
        unitPrice: 1.39,
      },
    ]);
    return HttpResponse.json(cart);
  }),

  http.post("/api/cart", async ({ request }) => {
    const item = (await request.json()) as CartItem;
    let cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);

    const existingIndex = cart.findIndex(
      (c) => c.nft.id === item.nft.id && c.edition === item.edition,
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = item.quantity;
    } else {
      cart.push({ ...item, id: item.id || "cart-" + Date.now() });
    }

    storage.set(STORAGE_KEYS.CART, cart);
    return HttpResponse.json(cart);
  }),

  http.delete("/api/cart/:id", ({ params }) => {
    const { id } = params;
    let cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
    cart = cart.filter((c) => c.id !== id);
    storage.set(STORAGE_KEYS.CART, cart);
    return HttpResponse.json(cart);
  }),

  http.post("/api/cart/coupon", async ({ request }) => {
    const { code } = (await request.json()) as { code: string };
    const upper = (code || "").trim().toUpperCase();

    if (upper === "KURIO10" || upper === "ARTE") {
      return HttpResponse.json({
        valid: true,
        discountPercent: 10,
        code: upper,
        message: "Cupom de 10% aplicado!",
      });
    }
    if (upper === "VIP20") {
      return HttpResponse.json({
        valid: true,
        discountPercent: 20,
        code: upper,
        message: "Cupom VIP de 20% aplicado!",
      });
    }

    return HttpResponse.json(
      { valid: false, discountPercent: 0, message: "Cupom inválido." },
      { status: 400 },
    );
  }),

  // -------------------------------------------------------------
  // 4. CHECKOUT & ORDERS
  // -------------------------------------------------------------
  http.post("/api/checkout/quote", async ({ request }) => {
    const body = (await request.json()) as {
      items: CartItem[];
      discountPercent?: number;
    };
    const items = body.items || [];
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const discount = (subtotal * (body.discountPercent || 0)) / 100;
    const networkFee = items.length > 0 ? 0.016 : 0;
    const total = Math.max(0, subtotal - discount + networkFee);

    return HttpResponse.json({
      subtotal: Number(subtotal.toFixed(3)),
      discount: Number(discount.toFixed(3)),
      networkFee,
      total: Number(total.toFixed(3)),
    });
  }),

  http.post("/api/orders", async ({ request }) => {
    const idempotencyKey =
      request.headers.get("Idempotency-Key") ||
      request.headers.get("x-idempotency-key");

    const orders = storage.get<OrderConfirmationData[]>(
      STORAGE_KEYS.ORDERS,
      [],
    );
    const idempotencyCache = storage.get<Record<string, OrderConfirmationData>>(
      STORAGE_KEYS.IDEMPOTENCY,
      {},
    );

    if (idempotencyKey && idempotencyCache[idempotencyKey]) {
      return HttpResponse.json({
        ...idempotencyCache[idempotencyKey],
        idempotentReplay: true,
      });
    }

    const body = (await request.json()) as {
      profile: CollectorProfile;
      network?: string;
      selectedWallet: string;
      items: CartItem[];
      total: number;
    };

    const items = body.items || [];

    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const networkFee = items.length > 0 ? 0.016 : 0;

    const expectedTotal = subtotal + networkFee;
    const discount =
      body.total < expectedTotal
        ? Number((expectedTotal - body.total).toFixed(3))
        : 0;

    const order: OrderConfirmationData = {
      transactionId:
        "0xA91F" +
        Math.random().toString(36).substring(2, 8).toUpperCase() +
        "...E82C",
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      total: body.total,
      subtotal: Number(subtotal.toFixed(3)),
      discount,
      networkFee,
      wallet: body.selectedWallet || body.profile?.walletType,
      items: body.items,
      network: body.network || body.profile?.network,
    };

    orders.unshift(order);
    storage.set(STORAGE_KEYS.ORDERS, orders);
    storage.set(STORAGE_KEYS.CART, []);

    if (idempotencyKey) {
      idempotencyCache[idempotencyKey] = order;
      storage.set(STORAGE_KEYS.IDEMPOTENCY, idempotencyCache);
    }

    return HttpResponse.json(order, { status: 201 });
  }),

  // -------------------------------------------------------------
  // 5. PROFILE & WALLETS (Baseados estritamente na sessão ativa)
  // -------------------------------------------------------------
  http.get("/api/profile", () => {
    const email = getCurrentSessionEmail();
    if (!email) {
      return HttpResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const profiles = getStoredProfiles();
    if (profiles[email]) {
      return HttpResponse.json(profiles[email]);
    }

    // Caso por algum motivo o perfil não exista, cria baseado na sessão
    const session = storage.get<{ name: string; email: string } | null>(
      STORAGE_KEYS.SESSION,
      null,
    );
    const newProfile = createUserProfile(session?.name || "Collector", email);
    profiles[email] = newProfile;
    storage.set(STORAGE_KEYS.PROFILES, profiles);

    return HttpResponse.json(newProfile);
  }),

  http.put("/api/profile", async ({ request }) => {
    const updates = (await request.json()) as CollectorProfile;
    const email = getCurrentSessionEmail();
    if (!email) {
      return HttpResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const profiles = getStoredProfiles();
    const session = storage.get<{ name: string; email: string } | null>(
      STORAGE_KEYS.SESSION,
      null,
    );

    const current =
      profiles[email] || createUserProfile(session?.name || "Collector", email);
    const merged = { ...current, ...updates };

    profiles[email] = merged;
    storage.set(STORAGE_KEYS.PROFILES, profiles);

    return HttpResponse.json(merged);
  }),

  // Endpoints de Wallets adaptados para ler/escrever diretamente no profile unificado do usuário logado
  http.get("/api/wallets", () => {
    const email = getCurrentSessionEmail();
    if (!email) {
      return HttpResponse.json([], { status: 401 });
    }

    const profiles = getStoredProfiles();
    const session = storage.get<{
      name: string;
      email: string;
      provider?: string;
    } | null>(STORAGE_KEYS.SESSION, null);
    const profile =
      profiles[email] ||
      createUserProfile(
        session?.name || "Collector",
        email,
        !!session?.provider,
      );

    const walletsList: any[] = [
      {
        id: "w-primary",
        isPrimary: true,
        displayName: profile.displayName,
        nickname: profile.walletNickname,
        network: profile.network,
        profileName: profile.profileName,
        address: profile.walletAddress,
        type: profile.walletType,
        referralCode: profile.referralCode,
        email: profile.email,
        ensName: profile.ensName,
      },
    ];

    if (profile.secondaryWallet) {
      walletsList.push({
        id: profile.secondaryWallet.id,
        isPrimary: false,
        nickname: profile.secondaryWallet.nickname,
        network: profile.secondaryWallet.network,
        address: profile.secondaryWallet.address,
        type: profile.secondaryWallet.type,
      });
    }

    return HttpResponse.json(walletsList);
  }),

  // por estar apertado, eu não fiz o post dos wallets a lógica é sempre alterar as mesmas carteiras e no máximo adicionar uma carteira
  // secundária atribuido a nova se eu tivesse mais tempo faria os botões de adicionar para atribuir a uma nova carteira

  http.post("/api/wallets/secondary", async ({ request }) => {
    const secondaryData = (await request.json()) as SecondaryWallet;
    const email = getCurrentSessionEmail();
    if (!email) {
      return HttpResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const profiles = getStoredProfiles();
    const session = storage.get<{
      name: string;
      email: string;
      provider?: string;
    } | null>(STORAGE_KEYS.SESSION, null);

    const profile =
      profiles[email] ||
      createUserProfile(
        session?.name || "Collector",
        email,
        !!session?.provider,
      );

    if (
      profile.secondaryWallet &&
      profile.secondaryWallet.address.trim() !== ""
    ) {
      return HttpResponse.json(
        {
          message:
            "Já existe uma carteira secundária cadastrada para este perfil.",
        },
        { status: 409 },
      );
    }

    profile.secondaryWallet = {
      id: secondaryData.id || "w-sec-" + Date.now(),
      nickname: secondaryData.nickname || "Carteira Secundária",
      address:
        secondaryData.address ||
        "0x" + Math.random().toString(16).substring(2, 22).toUpperCase(),
      type: secondaryData.type || "MetaMask",
      network: secondaryData.network || "Ethereum",
    };

    profiles[email] = profile;
    storage.set(STORAGE_KEYS.PROFILES, profiles);

    return HttpResponse.json(profile.secondaryWallet, { status: 201 });
  }),

  http.post("/api/wallets", async ({ request }) => {
    const newWallet = (await request.json()) as CollectorProfile;
    const email = getCurrentSessionEmail();
    if (!email) {
      return HttpResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const profiles = getStoredProfiles();
    const session = storage.get<{ name: string; email: string } | null>(
      STORAGE_KEYS.SESSION,
      null,
    );
    const profile =
      profiles[email] || createUserProfile(session?.name || "Collector", email);

    profile.walletAddress = newWallet.walletAddress || profile.walletAddress;
    profile.walletType = newWallet.walletType || profile.walletType;
    profile.network = newWallet.network || profile.network;

    profiles[email] = profile;
    storage.set(STORAGE_KEYS.PROFILES, profiles);

    return HttpResponse.json(
      [{ id: "w-primary", isPrimary: true, ...newWallet }],
      { status: 201 },
    );
  }),

  http.put("/api/wallets", async ({ request }) => {
    const updatedWallet = (await request.json()) as any;
    const email = getCurrentSessionEmail();
    if (!email) {
      return HttpResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const profiles = getStoredProfiles();
    const session = storage.get<{ name: string; email: string } | null>(
      STORAGE_KEYS.SESSION,
      null,
    );
    const profile =
      profiles[email] || createUserProfile(session?.name || "Collector", email);

    if (updatedWallet.address) profile.walletAddress = updatedWallet.address;
    if (updatedWallet.secondaryWallet)
      profile.secondaryWallet = updatedWallet.secondaryWallet;
    if (updatedWallet.type) profile.walletType = updatedWallet.type;
    if (updatedWallet.network) profile.network = updatedWallet.network;

    profiles[email] = profile;
    storage.set(STORAGE_KEYS.PROFILES, profiles);

    return HttpResponse.json([
      {
        displayName: profile.displayName,
        id: "w-primary",
        isPrimary: true,
        nickname: profile.walletNickname,
        network: profile.network,
        address: profile.walletAddress,
        type: profile.walletType,
        profileName: profile.profileName,
        referralCode: profile.referralCode,
        email: profile.email,
        ensName: profile.ensName,
      },
    ]);
  }),

  // -------------------------------------------------------------
  // 6. FAVORITES
  // -------------------------------------------------------------
  http.get("/api/favorites", () => {
    const favs = storage.get<string[]>(STORAGE_KEYS.FAVORITES, [
      "nft-1",
      "nft-3",
    ]);
    return HttpResponse.json(favs);
  }),

  http.post("/api/favorites", async ({ request }) => {
    const { id } = (await request.json()) as { id: string };
    let favs = storage.get<string[]>(STORAGE_KEYS.FAVORITES, []);
    if (!favs.includes(id)) favs.push(id);
    storage.set(STORAGE_KEYS.FAVORITES, favs);
    return HttpResponse.json(favs);
  }),

  http.delete("/api/favorites/:id", ({ params }) => {
    const { id } = params;
    let favs = storage.get<string[]>(STORAGE_KEYS.FAVORITES, []);
    favs = favs.filter((f) => f !== id);
    storage.set(STORAGE_KEYS.FAVORITES, favs);
    return HttpResponse.json(favs);
  }),
];
