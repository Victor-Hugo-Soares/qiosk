export type Doneness = 'mal-passado' | 'ao-ponto' | 'bem-passado'

export interface Extra {
  id: string
  name: string
  price: number
  available: boolean
}

export interface ExtraGroup {
  id: string
  name: string
  required: boolean
  multiple: boolean
  extras: Extra[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  imageColor: string   // cor do placeholder SVG (fallback)
  imageUrl?: string    // URL real da imagem (opcional)
  available: boolean
  extraGroups: ExtraGroup[]
  hasDoneness: boolean
}

export interface Category {
  id: string
  name: string
  icon: string  // nome do ícone Lucide
  order: number
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  quantity: number
  doneness?: Doneness
  selectedExtras: { extraId: string; extraName: string; price: number }[]
  notes: string
  totalPrice: number
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered'
export type PaymentMethod = 'cash' | 'card' | 'pix'

export interface Order {
  id: string
  number: number
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: PaymentMethod
  totalPrice: number
  estimatedMinutes: number
  tableNumber: number | null   // null = tablet fixo no balcão
  createdAt: string
  updatedAt: string
}

export interface DaySchedule {
  enabled: boolean
  open: string    // "HH:MM"
  close: string   // "HH:MM"
}

// índice 0 = Domingo, 1 = Segunda ... 6 = Sábado
export type BusinessHours = [
  DaySchedule, DaySchedule, DaySchedule, DaySchedule,
  DaySchedule, DaySchedule, DaySchedule
]

export interface StoreSettings {
  name: string
  estimatedMinutes: number
  acceptingOrders: boolean
  paymentMethods: PaymentMethod[]
  businessHours: BusinessHours
  pixKey?: string
  pixCity?: string
}
