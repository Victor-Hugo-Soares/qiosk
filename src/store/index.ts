import { create } from 'zustand'
import type { Category, Order, OrderItem, OrderStatus, Product, StoreSettings } from '../types'
import { saveOrder, updateOrderStatusFS } from '../lib/firestore'
import {
  saveCategoryFS, updateCategoryFS, deleteCategoryFS,
  saveProductFS, updateProductFS, deleteProductFS,
  saveSettingsFS,
} from '../lib/firestore'

// ─── Store types ──────────────────────────────────────────────────────────────

interface QioskStore {
  // Settings
  settings: StoreSettings
  setSettings:    (settings: StoreSettings) => void
  updateSettings: (patch: Partial<StoreSettings>) => void
  setEstimatedMinutes: (minutes: number) => void

  // Menu — categorias
  categories: Category[]
  setCategories:    (cats: Category[]) => void
  addCategory:      (category: Category) => void
  updateCategory:   (id: string, patch: Partial<Category>) => void
  deleteCategory:   (id: string) => void
  moveCategoryUp:   (id: string) => void
  moveCategoryDown: (id: string) => void

  // Menu — produtos
  products: Product[]
  setProducts:               (products: Product[]) => void
  addProduct:                (product: Product) => void
  updateProduct:             (id: string, patch: Partial<Product>) => void
  toggleProductAvailability: (id: string) => void
  deleteProduct:             (id: string) => void

  // Orders
  orders: Order[]
  nextOrderNumber: number
  lastOrderDate:   string
  addOrder:         (items: OrderItem[], paymentMethod: Order['paymentMethod']) => Order
  updateOrderStatus:(orderId: string, status: OrderStatus) => void
  getTodayOrders:   () => Order[]
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultSettings: StoreSettings = {
  name: '',
  estimatedMinutes: 15,
  acceptingOrders: true,
  paymentMethods: ['cash', 'card', 'pix'],
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useQioskStore = create<QioskStore>()((set, get) => ({

  // ── Settings ────────────────────────────────────────────────────────────────
  settings: defaultSettings,
  setSettings: (settings) => set({ settings }),
  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }))
    saveSettingsFS(patch).catch(console.error)
  },
  setEstimatedMinutes: (minutes) => {
    set((s) => ({ settings: { ...s.settings, estimatedMinutes: minutes } }))
    saveSettingsFS({ estimatedMinutes: minutes }).catch(console.error)
  },

  // ── Categories ──────────────────────────────────────────────────────────────
  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (category) => {
    set((s) => ({ categories: [...s.categories, category] }))
    saveCategoryFS(category).catch(console.error)
  },
  updateCategory: (id, patch) => {
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
    updateCategoryFS(id, patch).catch(console.error)
  },
  deleteCategory: (id) => {
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
    deleteCategoryFS(id).catch(console.error)
  },
  moveCategoryUp: (id) =>
    set((s) => {
      const sorted = [...s.categories].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex((c) => c.id === id)
      if (idx <= 0) return s
      const a = { ...sorted[idx - 1], order: sorted[idx].order }
      const b = { ...sorted[idx],     order: sorted[idx - 1].order }
      saveCategoryFS(a).catch(console.error)
      saveCategoryFS(b).catch(console.error)
      return { categories: sorted.map((c, i) => (i === idx - 1 ? a : i === idx ? b : c)) }
    }),
  moveCategoryDown: (id) =>
    set((s) => {
      const sorted = [...s.categories].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex((c) => c.id === id)
      if (idx < 0 || idx >= sorted.length - 1) return s
      const a = { ...sorted[idx],     order: sorted[idx + 1].order }
      const b = { ...sorted[idx + 1], order: sorted[idx].order }
      saveCategoryFS(a).catch(console.error)
      saveCategoryFS(b).catch(console.error)
      return { categories: sorted.map((c, i) => (i === idx ? a : i === idx + 1 ? b : c)) }
    }),

  // ── Products ────────────────────────────────────────────────────────────────
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) => {
    set((s) => ({ products: [...s.products, product] }))
    saveProductFS(product).catch(console.error)
  },
  updateProduct: (id, patch) => {
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))
    updateProductFS(id, patch).catch(console.error)
  },
  toggleProductAvailability: (id) => {
    const product = get().products.find((p) => p.id === id)
    if (!product) return
    const available = !product.available
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? { ...p, available } : p)),
    }))
    updateProductFS(id, { available }).catch(console.error)
  },
  deleteProduct: (id) => {
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
    deleteProductFS(id).catch(console.error)
  },

  // ── Orders ──────────────────────────────────────────────────────────────────
  orders: [],
  nextOrderNumber: 1,
  lastOrderDate: '',
  addOrder: (items, paymentMethod) => {
    const { settings, nextOrderNumber, lastOrderDate } = get()
    const today    = new Date().toISOString().slice(0, 10)
    const isNewDay = lastOrderDate !== today
    const number   = isNewDay ? 1 : nextOrderNumber
    const totalPrice = items.reduce((sum, i) => sum + i.totalPrice, 0)
    const order: Order = {
      id: crypto.randomUUID(),
      number,
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
      nextOrderNumber: number + 1,
      lastOrderDate: today,
    }))
    saveOrder(order).catch(console.error)
    return order
  },
  updateOrderStatus: (orderId, status) => {
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    }))
    updateOrderStatusFS(orderId, status).catch(console.error)
  },
  getTodayOrders: () => {
    const today = new Date().toDateString()
    return get().orders.filter((o) => new Date(o.createdAt).toDateString() === today)
  },
}))

// ─── Cart store (sessão) ──────────────────────────────────────────────────────

interface CartStore {
  items: OrderItem[]
  addItem:        (item: Omit<OrderItem, 'id'>) => void
  removeItem:     (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clear:          () => void
  totalItems:     () => number
  totalPrice:     () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((s) => ({ items: [...s.items, { ...item, id: crypto.randomUUID() }] })),
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
              return { ...i, quantity: qty, totalPrice: (i.productPrice + extrasTotal) * qty }
            }),
    })),
  clear: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.totalPrice, 0),
}))
