import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category, Order, OrderItem, OrderStatus, Product, StoreSettings } from '../types'

// ─── Seed data ────────────────────────────────────────────────────────────────

const seedCategories: Category[] = [
  { id: 'cat-1', name: 'Lanches', icon: 'Sandwich', order: 1 },
  { id: 'cat-2', name: 'Bebidas', icon: 'Cup', order: 2 },
  { id: 'cat-3', name: 'Porções', icon: 'UtensilsCrossed', order: 3 },
  { id: 'cat-4', name: 'Sobremesas', icon: 'IceCream', order: 4 },
]

const seedProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Smash Burguer Classic',
    description: 'Blend 160g, queijo cheddar, alface, tomate, maionese da casa',
    price: 32.9,
    categoryId: 'cat-1',
    imageColor: '#8B5E3C',
    available: true,
    hasDoneness: true,
    extraGroups: [
      {
        id: 'eg-1',
        name: 'Adicionais',
        required: false,
        multiple: true,
        extras: [
          { id: 'ex-1', name: 'Bacon Crocante', price: 4.0, available: true },
          { id: 'ex-2', name: 'Cheddar Extra', price: 3.0, available: true },
          { id: 'ex-3', name: 'Ovo Frito', price: 3.0, available: true },
          { id: 'ex-4', name: 'Onion Crispy', price: 2.5, available: true },
        ],
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'Double Smash',
    description: 'Dois blends 120g, queijo americano duplo, picles, mostarda',
    price: 42.9,
    categoryId: 'cat-1',
    imageColor: '#6B4226',
    available: true,
    hasDoneness: true,
    extraGroups: [
      {
        id: 'eg-2',
        name: 'Adicionais',
        required: false,
        multiple: true,
        extras: [
          { id: 'ex-1', name: 'Bacon Crocante', price: 4.0, available: true },
          { id: 'ex-2', name: 'Cheddar Extra', price: 3.0, available: true },
        ],
      },
    ],
  },
  {
    id: 'prod-3',
    name: 'Chicken Crispy',
    description: 'Frango empanado crocante, maionese de alho, coleslaw',
    price: 28.9,
    categoryId: 'cat-1',
    imageColor: '#C8870A',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-4',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná, Sprite — 350ml',
    price: 6.9,
    categoryId: 'cat-2',
    imageColor: '#B22222',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-5',
    name: 'Suco Natural',
    description: 'Laranja, Limão ou Maracujá — 400ml',
    price: 9.9,
    categoryId: 'cat-2',
    imageColor: '#E8A020',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-6',
    name: 'Batata Frita',
    description: 'Porção média crocante com sal temperado',
    price: 16.9,
    categoryId: 'cat-3',
    imageColor: '#D4A017',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-7',
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados, molho ranch',
    price: 18.9,
    categoryId: 'cat-3',
    imageColor: '#8B6914',
    available: false,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-8',
    name: 'Milkshake',
    description: 'Chocolate, Morango ou Baunilha — 400ml',
    price: 19.9,
    categoryId: 'cat-4',
    imageColor: '#C4607A',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
]

const seedSettings: StoreSettings = {
  name: '',
  estimatedMinutes: 15,
  acceptingOrders: true,
  paymentMethods: ['cash', 'card', 'pix'],
}

// ─── Store types ──────────────────────────────────────────────────────────────

interface QioskStore {
  // Settings
  settings: StoreSettings
  updateSettings: (patch: Partial<StoreSettings>) => void
  setEstimatedMinutes: (minutes: number) => void

  // Menu — categorias
  categories: Category[]
  addCategory: (category: Category) => void
  updateCategory: (id: string, patch: Partial<Category>) => void
  deleteCategory: (id: string) => void
  moveCategoryUp: (id: string) => void
  moveCategoryDown: (id: string) => void

  // Menu — produtos
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  toggleProductAvailability: (id: string) => void
  deleteProduct: (id: string) => void

  // Orders
  orders: Order[]
  nextOrderNumber: number
  addOrder: (items: OrderItem[], paymentMethod: Order['paymentMethod']) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getTodayOrders: () => Order[]
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useQioskStore = create<QioskStore>()(
  persist(
    (set, get) => ({
      settings: seedSettings,
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      setEstimatedMinutes: (minutes) =>
        set((s) => ({ settings: { ...s.settings, estimatedMinutes: minutes } })),

      categories: seedCategories,
      addCategory: (category) =>
        set((s) => ({ categories: [...s.categories, category] })),
      updateCategory: (id, patch) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
      moveCategoryUp: (id) =>
        set((s) => {
          const sorted = [...s.categories].sort((a, b) => a.order - b.order)
          const idx = sorted.findIndex((c) => c.id === id)
          if (idx <= 0) return s
          const updated = sorted.map((c, i) => {
            if (i === idx - 1) return { ...c, order: sorted[idx].order }
            if (i === idx)     return { ...c, order: sorted[idx - 1].order }
            return c
          })
          return { categories: updated }
        }),
      moveCategoryDown: (id) =>
        set((s) => {
          const sorted = [...s.categories].sort((a, b) => a.order - b.order)
          const idx = sorted.findIndex((c) => c.id === id)
          if (idx < 0 || idx >= sorted.length - 1) return s
          const updated = sorted.map((c, i) => {
            if (i === idx)     return { ...c, order: sorted[idx + 1].order }
            if (i === idx + 1) return { ...c, order: sorted[idx].order }
            return c
          })
          return { categories: updated }
        }),

      products: seedProducts,
      addProduct: (product) =>
        set((s) => ({ products: [...s.products, product] })),
      updateProduct: (id, patch) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      toggleProductAvailability: (id) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, available: !p.available } : p
          ),
        })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      orders: [],
      nextOrderNumber: 1,
      addOrder: (items, paymentMethod) => {
        const { settings, nextOrderNumber } = get()
        const totalPrice = items.reduce((sum, i) => sum + i.totalPrice, 0)
        const order: Order = {
          id: crypto.randomUUID(),
          number: nextOrderNumber,
          items,
          status: 'pending',
          paymentMethod,
          totalPrice,
          estimatedMinutes: settings.estimatedMinutes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((s) => ({
          orders: [order, ...s.orders],
          nextOrderNumber: s.nextOrderNumber + 1,
        }))
        return order
      },
      updateOrderStatus: (orderId, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? { ...o, status, updatedAt: new Date().toISOString() }
              : o
          ),
        })),
      getTodayOrders: () => {
        const today = new Date().toDateString()
        return get().orders.filter(
          (o) => new Date(o.createdAt).toDateString() === today
        )
      },
    }),
    {
      name: 'qiosk-store',
      // Não persiste o carrinho — cada sessão começa do zero
      partialize: (s) => ({
        settings: s.settings,
        categories: s.categories,
        products: s.products,
        orders: s.orders,
        nextOrderNumber: s.nextOrderNumber,
      }),
    }
  )
)

// ─── Cart store (sessão) ──────────────────────────────────────────────────────

interface CartStore {
  items: OrderItem[]
  addItem: (item: Omit<OrderItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clear: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((s) => ({
      items: [...s.items, { ...item, id: crypto.randomUUID() }],
    })),
  removeItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, qty) =>
    set((s) => ({
      items:
        qty <= 0
          ? s.items.filter((i) => i.id !== id)
          : s.items.map((i) => {
              if (i.id !== id) return i
              const extrasTotal = i.selectedExtras.reduce((sum, e) => sum + e.price, 0)
              return {
                ...i,
                quantity: qty,
                totalPrice: (i.productPrice + extrasTotal) * qty,
              }
            }),
    })),
  clear: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.totalPrice, 0),
}))
