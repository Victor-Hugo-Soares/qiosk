import { saveCategoryFS, saveProductFS, saveSettingsFS, updateProductFS } from './firestore'
import type { Category, Product } from '../types'

const U = (id: string) => `https://images.unsplash.com/photo-${id}`

// Mapa prod-id → URL da imagem real (Unsplash, gratuitas)
const PRODUCT_IMAGES: Record<string, string> = {
  'prod-1':  U('1568901346375-23c9450c58cd'), // Smash Burguer Classic
  'prod-2':  U('1713330801172-03f8d1c0dde7'), // Double Smash
  'prod-3':  U('1760533536738-f0965fd52354'), // Chicken Crispy
  'prod-4':  U('1571091718767-18b5b1457add'), // Veggie Burguer
  'prod-5':  U('1554866585-cd94860890b7'),    // Refrigerante Lata
  'prod-6':  U('1641659735894-45046caad624'), // Suco Natural
  'prod-7':  U('1548839140-29a749e1cf4d'),    // Água Mineral
  'prod-8':  U('1652448259130-729d9fb02a2d'), // Batata Frita
  'prod-9':  U('1639024471283-03518883512d'), // Onion Rings
  'prod-10': U('1553787499-6f9133860278'),    // Milkshake
}

const DEFAULT_BUSINESS_HOURS = [
  { enabled: false, open: '11:00', close: '22:00' },
  { enabled: true,  open: '11:00', close: '22:00' },
  { enabled: true,  open: '11:00', close: '22:00' },
  { enabled: true,  open: '11:00', close: '22:00' },
  { enabled: true,  open: '11:00', close: '22:00' },
  { enabled: true,  open: '11:00', close: '23:00' },
  { enabled: true,  open: '11:00', close: '23:00' },
]

/** Garante que settings antigos têm businessHours */
export async function migrateSettings(s: Record<string, unknown>) {
  if (!s.businessHours) {
    await saveSettingsFS({ businessHours: DEFAULT_BUSINESS_HOURS } as Parameters<typeof saveSettingsFS>[0])
    console.info('[QIOSK] businessHours migrado para settings.')
  }
}

/** Adiciona imageUrl nos produtos que ainda não têm */
export async function migrateProductImages(products: Product[]) {
  const missing = products.filter(
    (p) => PRODUCT_IMAGES[p.id] && !p.imageUrl
  )
  if (missing.length === 0) return
  await Promise.all(
    missing.map((p) => updateProductFS(p.id, { imageUrl: PRODUCT_IMAGES[p.id] }))
  )
  console.info(`[QIOSK] ${missing.length} imagens migradas.`)
}

const categories: Category[] = [
  { id: 'cat-1', name: 'Lanches',     icon: 'Sandwich',         order: 1 },
  { id: 'cat-2', name: 'Bebidas',     icon: 'Cup',              order: 2 },
  { id: 'cat-3', name: 'Porções',     icon: 'UtensilsCrossed',  order: 3 },
  { id: 'cat-4', name: 'Sobremesas',  icon: 'IceCream',         order: 4 },
]

const products: Product[] = [
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
        id: 'eg-1', name: 'Adicionais', required: false, multiple: true,
        extras: [
          { id: 'ex-1', name: 'Bacon Crocante', price: 4.0,  available: true },
          { id: 'ex-2', name: 'Cheddar Extra',  price: 3.0,  available: true },
          { id: 'ex-3', name: 'Ovo Frito',      price: 3.0,  available: true },
          { id: 'ex-4', name: 'Onion Crispy',   price: 2.5,  available: true },
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
        id: 'eg-2', name: 'Adicionais', required: false, multiple: true,
        extras: [
          { id: 'ex-1', name: 'Bacon Crocante', price: 4.0, available: true },
          { id: 'ex-2', name: 'Cheddar Extra',  price: 3.0, available: true },
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
    name: 'Veggie Burguer',
    description: 'Blend de grão-de-bico, rúcula, tomate seco, aioli de ervas',
    price: 31.9,
    categoryId: 'cat-1',
    imageColor: '#4CAF50',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-5',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Sprite — 350ml',
    price: 6.9,
    categoryId: 'cat-2',
    imageColor: '#B22222',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-6',
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
    id: 'prod-7',
    name: 'Água Mineral',
    description: 'Com ou sem gás — 500ml',
    price: 4.0,
    categoryId: 'cat-2',
    imageColor: '#64B5F6',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-8',
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
    id: 'prod-9',
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados, molho ranch',
    price: 18.9,
    categoryId: 'cat-3',
    imageColor: '#8B6914',
    available: true,
    hasDoneness: false,
    extraGroups: [],
  },
  {
    id: 'prod-10',
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

export async function seedIfEmpty(currentCategoryCount: number) {
  if (currentCategoryCount > 0) return  // já tem dados, não faz nada

  await saveSettingsFS({
    name: 'Minha Hamburgueria',
    estimatedMinutes: 15,
    acceptingOrders: true,
    paymentMethods: ['cash', 'card', 'pix'],
    businessHours: [
      { enabled: false, open: '11:00', close: '22:00' },
      { enabled: true,  open: '11:00', close: '22:00' },
      { enabled: true,  open: '11:00', close: '22:00' },
      { enabled: true,  open: '11:00', close: '22:00' },
      { enabled: true,  open: '11:00', close: '22:00' },
      { enabled: true,  open: '11:00', close: '23:00' },
      { enabled: true,  open: '11:00', close: '23:00' },
    ],
  })
  await Promise.all(categories.map(saveCategoryFS))
  await Promise.all(
    products.map((p) =>
      saveProductFS({ ...p, imageUrl: PRODUCT_IMAGES[p.id] })
    )
  )
  console.info('[QIOSK] Seed carregado no Firestore.')
}
