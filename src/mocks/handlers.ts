import { http, HttpResponse } from 'msw'
import { NFT } from '@/src/types/nft'
import { CartItem, CollectorProfile, OrderConfirmationData } from '@/src/types/cart'
import { MOCK_NFTS } from '@/src/mocks/nftData'

// Helper for localStorage with memory fallback
class StorageService {
  private memory = new Map<string, string>()

  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key)
        if (item) return JSON.parse(item) as T
      } else {
        const mem = this.memory.get(key)
        if (mem) return JSON.parse(mem) as T
      }
    } catch {
      // fallback
    }
    return defaultValue
  }

  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value)
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized)
      }
      this.memory.set(key, serialized)
    } catch {
      // fallback
    }
  }
}

const storage = new StorageService()

// Initial storage seeds
const STORAGE_KEYS = {
  SESSION: 'kurio_auth_session',
  TOKEN: 'kurio_auth_token',
  NFTS: 'kurio_nfts',
  CART: 'kurio_cart',
  PROFILE: 'kurio_profile',
  WALLETS: 'kurio_wallets',
  ORDERS: 'kurio_orders',
  FAVORITES: 'kurio_favorites',
  IDEMPOTENCY: 'kurio_idempotency_keys',
}

// Ensure default data exists
if (!storage.get<NFT[] | null>(STORAGE_KEYS.NFTS, null)) {
  storage.set(STORAGE_KEYS.NFTS, MOCK_NFTS)
}

if (!storage.get<CollectorProfile | null>(STORAGE_KEYS.PROFILE, null)) {
  storage.set(STORAGE_KEYS.PROFILE, {
    displayName: 'Nova Sato',
    username: '@novasato',
    network: 'Ethereum',
    profileName: 'Galeria Kurio Principal',
    walletAddress: '0xA91F9a38C201C46E82C09b',
    secondaryWallet: '',
    walletType: 'Coinbase Wallet',
    referralCode: 'KURIO-2026',
    email: 'nova.sato@kurio.art',
    ensName: 'novasato',
    useOtherWallet: false,
    notes: '',
  })
}

export const handlers = [
  // -------------------------------------------------------------
  // 1. AUTH ENDPOINTS
  // -------------------------------------------------------------
  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    if (!body?.email || !body?.password) {
      return HttpResponse.json(
        { message: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      )
    }

    const user = {
      id: 'usr-' + Date.now(),
      name: body.email.split('@')[0],
      email: body.email,
      avatar: '/assets/hero-nft.png',
    }

    const token = 'jwt-mock-token-' + Date.now()
    storage.set(STORAGE_KEYS.SESSION, user)
    storage.set(STORAGE_KEYS.TOKEN, token)

    return HttpResponse.json({
      user,
      token,
      message: 'Login realizado com sucesso.',
    })
  }),

  http.post('*/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string
      email?: string
      password?: string
    }

    if (!body?.email || !body?.password || !body?.name) {
      return HttpResponse.json(
        { message: 'Nome, e-mail e senha são obrigatórios.' },
        { status: 400 }
      )
    }

    const user = {
      id: 'usr-' + Date.now(),
      name: body.name,
      email: body.email,
      avatar: '/assets/sage-nomad.png',
    }

    const token = 'jwt-mock-token-' + Date.now()
    storage.set(STORAGE_KEYS.SESSION, user)
    storage.set(STORAGE_KEYS.TOKEN, token)

    return HttpResponse.json({
      user,
      token,
      message: 'Cadastro realizado com sucesso.',
    })
  }),

  http.get('*/api/auth/session', () => {
    const session = storage.get(STORAGE_KEYS.SESSION, null)
    return HttpResponse.json({ user: session })
  }),

  http.post('*/api/auth/logout', () => {
    storage.set(STORAGE_KEYS.SESSION, null)
    storage.set(STORAGE_KEYS.TOKEN, null)
    return HttpResponse.json({ message: 'Sessão encerrada.' })
  }),

  // -------------------------------------------------------------
  // 2. NFTS ENDPOINTS
  // -------------------------------------------------------------
  http.get('*/api/nfts', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const category = url.searchParams.get('category')
    const network = url.searchParams.get('network')
    const minPrice = parseFloat(url.searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '999999')
    const sortBy = url.searchParams.get('sortBy') || 'recent'
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '9', 10)

    let nfts = storage.get<NFT[]>(STORAGE_KEYS.NFTS, MOCK_NFTS)

    if (search) {
      nfts = nfts.filter(
        (n) =>
          n.name.toLowerCase().includes(search) ||
          n.collection.toLowerCase().includes(search) ||
          n.tokenId.toLowerCase().includes(search)
      )
    }

    if (category) {
      nfts = nfts.filter((n) => n.category === category)
    }

    if (network) {
      nfts = nfts.filter((n) => n.network === network)
    }

    nfts = nfts.filter((n) => n.price >= minPrice && n.price <= maxPrice)

    if (sortBy === 'price_asc') {
      nfts.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      nfts.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'likes_desc') {
      nfts.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    }

    const total = nfts.length
    const startIndex = (page - 1) * limit
    const paginated = nfts.slice(startIndex, startIndex + limit)

    return HttpResponse.json({
      data: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    })
  }),

  http.get('*/api/nfts/:id', ({ params }) => {
    const { id } = params
    const nfts = storage.get<NFT[]>(STORAGE_KEYS.NFTS, MOCK_NFTS)
    const found = nfts.find((n) => n.id === id)

    if (!found) {
      return HttpResponse.json(
        { message: 'NFT não encontrado.' },
        { status: 404 }
      )
    }

    return HttpResponse.json(found)
  }),

  // -------------------------------------------------------------
  // 3. CART ENDPOINTS
  // -------------------------------------------------------------
  http.get('*/api/cart', () => {
    const cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, [
      {
        id: 'cart-1',
        nft: MOCK_NFTS[0],
        quantity: 2,
        edition: '1/50',
        unitPrice: 1.19,
      },
      {
        id: 'cart-2',
        nft: MOCK_NFTS[4],
        quantity: 6,
        edition: '1/1',
        unitPrice: 1.39,
      },
      {
        id: 'cart-3',
        nft: MOCK_NFTS[5],
        quantity: 9,
        edition: '1/10',
        unitPrice: 1.79,
      },
    ])
    return HttpResponse.json(cart)
  }),

  http.post('*/api/cart', async ({ request }) => {
    const item = (await request.json()) as CartItem
    let cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, [])

    const existingIndex = cart.findIndex(
      (c) => c.nft.id === item.nft.id && c.edition === item.edition
    )

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = item.quantity
    } else {
      cart.push({ ...item, id: item.id || 'cart-' + Date.now() })
    }

    storage.set(STORAGE_KEYS.CART, cart)
    return HttpResponse.json(cart)
  }),

  http.delete('*/api/cart/:id', ({ params }) => {
    const { id } = params
    let cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, [])
    cart = cart.filter((c) => c.id !== id)
    storage.set(STORAGE_KEYS.CART, cart)
    return HttpResponse.json(cart)
  }),

  http.post('*/api/cart/coupon', async ({ request }) => {
    const { code } = (await request.json()) as { code: string }
    const upper = (code || '').trim().toUpperCase()

    if (upper === 'KURIO10' || upper === 'ARTE') {
      return HttpResponse.json({
        valid: true,
        discountPercent: 10,
        code: upper,
        message: 'Cupom de 10% de desconto aplicado!',
      })
    }

    if (upper === 'VIP20') {
      return HttpResponse.json({
        valid: true,
        discountPercent: 20,
        code: upper,
        message: 'Cupom VIP de 20% aplicado!',
      })
    }

    return HttpResponse.json(
      { valid: false, discountPercent: 0, message: 'Cupom inválido ou expirado.' },
      { status: 400 }
    )
  }),

  // -------------------------------------------------------------
  // 4. CHECKOUT & ORDERS (IDEMPOTENT)
  // -------------------------------------------------------------
  http.post('*/api/checkout/quote', async ({ request }) => {
    const body = (await request.json()) as {
      items: CartItem[]
      discountPercent?: number
    }

    const items = body.items || []
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )
    const discount = (subtotal * (body.discountPercent || 0)) / 100
    const networkFee = items.length > 0 ? 0.016 : 0
    const total = Math.max(0, subtotal - discount + networkFee)

    return HttpResponse.json({
      subtotal: Number(subtotal.toFixed(3)),
      discount: Number(discount.toFixed(3)),
      networkFee,
      total: Number(total.toFixed(3)),
    })
  }),

  http.post('*/api/orders', async ({ request }) => {
    const idempotencyKey =
      request.headers.get('Idempotency-Key') ||
      request.headers.get('x-idempotency-key')

    const orders = storage.get<OrderConfirmationData[]>(STORAGE_KEYS.ORDERS, [])
    const idempotencyCache = storage.get<Record<string, OrderConfirmationData>>(
      STORAGE_KEYS.IDEMPOTENCY,
      {}
    )

    // Check idempotency key to prevent double charging
    if (idempotencyKey && idempotencyCache[idempotencyKey]) {
      return HttpResponse.json({
        ...idempotencyCache[idempotencyKey],
        idempotentReplay: true,
      })
    }

    const body = (await request.json()) as {
      profile: CollectorProfile
      selectedWallet: string
      items: CartItem[]
      total: number
    }

    const order: OrderConfirmationData = {
      transactionId: '0xA91F' + Math.random().toString(36).substring(2, 8).toUpperCase() + '...E82C',
      date: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      total: body.total,
      subtotal: body.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      ),
      discount: 0,
      networkFee: 0.016,
      wallet: body.selectedWallet || 'MetaMask',
      items: body.items,
      network: body.profile?.network || 'Ethereum',
    }

    orders.unshift(order)
    storage.set(STORAGE_KEYS.ORDERS, orders)

    // Clear cart on successful order
    storage.set(STORAGE_KEYS.CART, [])

    if (idempotencyKey) {
      idempotencyCache[idempotencyKey] = order
      storage.set(STORAGE_KEYS.IDEMPOTENCY, idempotencyCache)
    }

    return HttpResponse.json(order, { status: 201 })
  }),

  // -------------------------------------------------------------
  // 5. PROFILE & WALLETS
  // -------------------------------------------------------------
  http.get('*/api/profile', () => {
    const profile = storage.get(STORAGE_KEYS.PROFILE, {
      displayName: 'Nova Sato',
      username: '@novasato',
      email: 'nova.sato@kurio.art',
      ensName: 'novasato',
      walletNickname: 'Minha Carteira Principal',
      avatar: '/assets/hero-nft.png',
    })
    return HttpResponse.json(profile)
  }),

  http.put('*/api/profile', async ({ request }) => {
    const updates = (await request.json()) as Record<string, any>
    const current = storage.get<Record<string, any>>(STORAGE_KEYS.PROFILE, {})
    const merged = { ...current, ...updates }
    storage.set(STORAGE_KEYS.PROFILE, merged)
    return HttpResponse.json(merged)
  }),

  http.get('*/api/wallets', () => {
    const wallets = storage.get(STORAGE_KEYS.WALLETS, [
      {
        id: 'w-1',
        isPrimary: true,
        displayName: 'Nova Sato',
        nickname: 'Minha Carteira Principal',
        network: 'Ethereum',
        profileName: 'Galeria Kurio Principal',
        address: '0xA91F9a38C201C46E82C09b',
        secondaryWallet: '',
        type: 'Coinbase Wallet',
        referralCode: 'KURIO-2026',
        email: 'nova.sato@kurio.art',
        ensName: 'novasato',
      },
    ])
    return HttpResponse.json(wallets)
  }),

  http.post('*/api/wallets', async ({ request }) => {
    const wallet = (await request.json()) as Record<string, any>
    let wallets = storage.get<any[]>(STORAGE_KEYS.WALLETS, [])
    wallets.push({ ...wallet, id: 'w-' + Date.now() })
    storage.set(STORAGE_KEYS.WALLETS, wallets)
    return HttpResponse.json(wallets, { status: 201 })
  }),

  http.put('*/api/wallets', async ({ request }) => {
    const updatedWallet = (await request.json()) as any
    let wallets = storage.get<any[]>(STORAGE_KEYS.WALLETS, [])
    wallets = wallets.map((w) =>
      w.id === updatedWallet.id || w.isPrimary ? { ...w, ...updatedWallet } : w
    )
    storage.set(STORAGE_KEYS.WALLETS, wallets)
    return HttpResponse.json(wallets)
  }),

  // -------------------------------------------------------------
  // 6. FAVORITES
  // -------------------------------------------------------------
  http.get('*/api/favorites', () => {
    const favs = storage.get<string[]>(STORAGE_KEYS.FAVORITES, ['nft-1', 'nft-3'])
    return HttpResponse.json(favs)
  }),

  http.post('*/api/favorites', async ({ request }) => {
    const { id } = (await request.json()) as { id: string }
    let favs = storage.get<string[]>(STORAGE_KEYS.FAVORITES, [])
    if (!favs.includes(id)) favs.push(id)
    storage.set(STORAGE_KEYS.FAVORITES, favs)
    return HttpResponse.json(favs)
  }),

  http.delete('*/api/favorites/:id', ({ params }) => {
    const { id } = params
    let favs = storage.get<string[]>(STORAGE_KEYS.FAVORITES, [])
    favs = favs.filter((f) => f !== id)
    storage.set(STORAGE_KEYS.FAVORITES, favs)
    return HttpResponse.json(favs)
  }),
]
