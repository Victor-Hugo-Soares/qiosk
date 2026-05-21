import { saveCategoryFS, saveProductFS, saveSettingsFS, updateProductFS } from './firestore'
import type { Category, Product } from '../types'

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=80`

const PRODUCT_IMAGES: Record<string, string> = {
  // ── Lanches ──────────────────────────────────────────────────
  'prod-1':  U('1568901346375-23c9450c58cd'), // Smash Classic
  'prod-2':  U('1713330801172-03f8d1c0dde7'), // Double Smash
  'prod-3':  U('1760533536738-f0965fd52354'), // Chicken Crispy
  'prod-4':  U('1571091718767-18b5b1457add'), // Veggie
  'prod-11': U('1550547660-d9054cb887'),       // Bacon Monster
  'prod-12': U('1586816879360-cb8e6e50e2e8'), // X-Tudo
  'prod-13': U('1547592180-85f173990554'),     // BBQ Smokehouse
  'prod-14': U('1565299624946-b28f40a84272'), // Truffle Burguer
  'prod-15': U('1565958022017-66591c68ac71'), // Fish Burguer
  'prod-16': U('1603360946369-dc9bb6258143'), // Spicy Nashville
  'prod-17': U('1561626423-afe06ab54a23'),    // Mushroom Swiss
  'prod-18': U('1544025162-d76538d7d3fd'),    // Texas Melt
  'prod-19': U('1619740455424-afab7a1fab2d'), // Crispy Ranch
  'prod-20': U('1607013251379-e6eecfffe234'), // Smash Picante
  // ── Bebidas ──────────────────────────────────────────────────
  'prod-5':  U('1554866585-cd94860890b7'),    // Refrigerante Lata
  'prod-6':  U('1641659735894-45046caad624'), // Suco Natural
  'prod-7':  U('1548839140-29a749e1cf4d'),    // Água Mineral
  'prod-21': U('1551024506-0c92c89f28e3'),    // Cerveja Artesanal
  'prod-22': U('1544787219-7f47ccb76574'),    // Limonada Suíça
  'prod-23': U('1556679908-3d3cf1b88b7c'),    // Chá Gelado
  'prod-24': U('1536515032-b28d1e3b23df'),    // Água de Coco
  'prod-25': U('1590080945-e9d9aef5c1c9'),    // Açaí Drink
  'prod-26': U('1509042239860-f550ce710b93'), // Café Gelado
  'prod-27': U('1546069901-ba9599a7e63c'),    // Kombucha
  // ── Porções ──────────────────────────────────────────────────
  'prod-8':  U('1652448259130-729d9fb02a2d'), // Batata Frita
  'prod-9':  U('1639024471283-03518883512d'), // Onion Rings
  'prod-28': U('1625944261-24d2accd2a0b'),    // Batata Rústica
  'prod-29': U('1529611016-3a70bf30f6e8'),    // Nuggets
  'prod-30': U('1551703591-cb40370ca282'),    // Mozzarella Sticks
  'prod-31': U('1518843875459-f738682238a1'), // Fritas Cheddar Bacon
  'prod-32': U('1527477396000-e27163b481c2'), // Asinha de Frango
  'prod-33': U('1599490613039-2c99bdbeab6e'), // Chips de Mandioca
  'prod-34': U('1573080496219-bb964701c4f4'), // Batata Palito
  'prod-35': U('1549611016-3a70bf30f6e8'),    // Mandioca Frita
  // ── Sobremesas ───────────────────────────────────────────────
  'prod-10': U('1553787499-6f9133860278'),    // Milkshake
  'prod-36': U('1606313564200-e75d5e1ca95e'), // Brownie
  'prod-37': U('1565958022017-66591c68ac71'), // Cheesecake
  'prod-38': U('1551024506-0c92c89f28e3'),    // Sundae
  'prod-39': U('1563805642-b09b2e2f7ace'),    // Sorvete
  'prod-40': U('1542314831-068cd1dbfeeb'),    // Crepe Nutella
  'prod-41': U('1587314168485-3236d6710814'), // Pudim
  'prod-42': U('1590080945-e9d9aef5c1c9'),    // Açaí Tigela
  'prod-43': U('1568051243851-f9b136146e14'), // Torta Limão
  // ── Combos ───────────────────────────────────────────────────
  'prod-44': U('1568901346375-23c9450c58cd'), // Combo Classic
  'prod-45': U('1713330801172-03f8d1c0dde7'), // Combo Double
  'prod-46': U('1760533536738-f0965fd52354'), // Combo Chicken
  'prod-47': U('1550547660-d9054cb887'),       // Combo Família
  'prod-48': U('1571091718767-18b5b1457add'), // Combo Kids
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

export async function migrateSettings(s: Record<string, unknown>) {
  if (!s.businessHours) {
    await saveSettingsFS({ businessHours: DEFAULT_BUSINESS_HOURS } as Parameters<typeof saveSettingsFS>[0])
    console.info('[QIOSK] businessHours migrado.')
  }
}

export async function migrateProductImages(products: Product[]) {
  const missing = products.filter((p) => PRODUCT_IMAGES[p.id] && !p.imageUrl)
  if (missing.length === 0) return
  await Promise.all(missing.map((p) => updateProductFS(p.id, { imageUrl: PRODUCT_IMAGES[p.id] })))
  console.info(`[QIOSK] ${missing.length} imagens migradas.`)
}

export const categories: Category[] = [
  { id: 'cat-1', name: 'Lanches',    icon: 'Sandwich',        order: 1 },
  { id: 'cat-2', name: 'Bebidas',    icon: 'Cup',             order: 2 },
  { id: 'cat-3', name: 'Porções',    icon: 'UtensilsCrossed', order: 3 },
  { id: 'cat-4', name: 'Sobremesas', icon: 'IceCream',        order: 4 },
  { id: 'cat-5', name: 'Combos',     icon: 'Star',            order: 5 },
]

const EXTRAS_BURGER = [
  { id: 'ex-1', name: 'Bacon Crocante', price: 4.0, available: true },
  { id: 'ex-2', name: 'Cheddar Extra',  price: 3.0, available: true },
  { id: 'ex-3', name: 'Ovo Frito',      price: 3.0, available: true },
  { id: 'ex-4', name: 'Onion Crispy',   price: 2.5, available: true },
  { id: 'ex-5', name: 'Jalapeño',       price: 2.0, available: true },
]

const eg = (id: string) => [{
  id, name: 'Adicionais', required: false, multiple: true, extras: EXTRAS_BURGER,
}]

export const products: Product[] = [
  // ────────────────────────────── LANCHES ──────────────────────────────────
  {
    id: 'prod-1', name: 'Smash Burguer Classic',
    description: 'Blend 160g, queijo cheddar, alface, tomate, maionese da casa',
    price: 32.9, categoryId: 'cat-1', imageColor: '#8B5E3C',
    available: true, hasDoneness: true, extraGroups: eg('eg-1'),
  },
  {
    id: 'prod-2', name: 'Double Smash',
    description: 'Dois blends 120g, queijo americano duplo, picles, mostarda',
    price: 42.9, categoryId: 'cat-1', imageColor: '#6B4226',
    available: true, hasDoneness: true, extraGroups: eg('eg-2'),
  },
  {
    id: 'prod-3', name: 'Chicken Crispy',
    description: 'Frango empanado crocante, maionese de alho, coleslaw',
    price: 28.9, categoryId: 'cat-1', imageColor: '#C8870A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-4', name: 'Veggie Burguer',
    description: 'Blend de grão-de-bico, rúcula, tomate seco, aioli de ervas',
    price: 31.9, categoryId: 'cat-1', imageColor: '#4CAF50',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-11', name: 'Bacon Monster',
    description: 'Blend 180g, três tiras de bacon, cheddar, cebola caramelizada',
    price: 45.9, categoryId: 'cat-1', imageColor: '#7B3F00',
    available: true, hasDoneness: true, extraGroups: eg('eg-11'),
  },
  {
    id: 'prod-12', name: 'X-Tudo',
    description: 'Blend 160g, ovo, presunto, queijo, alface, tomate, milho',
    price: 38.9, categoryId: 'cat-1', imageColor: '#8B4513',
    available: true, hasDoneness: true, extraGroups: eg('eg-12'),
  },
  {
    id: 'prod-13', name: 'BBQ Smokehouse',
    description: 'Blend defumado 180g, molho BBQ artesanal, cheddar, jalapeño',
    price: 44.9, categoryId: 'cat-1', imageColor: '#5C3317',
    available: true, hasDoneness: true, extraGroups: eg('eg-13'),
  },
  {
    id: 'prod-14', name: 'Truffle Burguer',
    description: 'Blend 160g, maionese trufada, cogumelo paris, queijo brie',
    price: 52.9, categoryId: 'cat-1', imageColor: '#6D5A3F',
    available: true, hasDoneness: true, extraGroups: eg('eg-14'),
  },
  {
    id: 'prod-15', name: 'Fish Burguer',
    description: 'Filé de peixe empanado, molho tártaro, alface americana',
    price: 34.9, categoryId: 'cat-1', imageColor: '#E8C870',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-16', name: 'Spicy Nashville',
    description: 'Frango frito apimentado, mel picante, picles, brioche',
    price: 36.9, categoryId: 'cat-1', imageColor: '#D2691E',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-17', name: 'Mushroom Swiss',
    description: 'Blend 160g, cogumelos salteados, queijo suíço, aioli',
    price: 39.9, categoryId: 'cat-1', imageColor: '#A0785A',
    available: true, hasDoneness: true, extraGroups: eg('eg-17'),
  },
  {
    id: 'prod-18', name: 'Texas Melt',
    description: 'Blend 200g, pimenta biquinho, cheddar derretido, onion crispy',
    price: 46.9, categoryId: 'cat-1', imageColor: '#8B0000',
    available: true, hasDoneness: true, extraGroups: eg('eg-18'),
  },
  {
    id: 'prod-19', name: 'Crispy Ranch',
    description: 'Frango crocante, molho ranch, bacon bits, tomate cereja',
    price: 33.9, categoryId: 'cat-1', imageColor: '#D2B48C',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-20', name: 'Smash Picante',
    description: 'Blend 160g, molho sriracha, pimenta jalapeño, queijo pepper jack',
    price: 36.9, categoryId: 'cat-1', imageColor: '#C0392B',
    available: true, hasDoneness: true, extraGroups: eg('eg-20'),
  },
  {
    id: 'prod-44', name: 'Burguer Especial da Casa',
    description: 'Receita exclusiva do chef: blend 180g, molho secreto, ingredientes premium',
    price: 55.9, categoryId: 'cat-1', imageColor: '#4A2C0A',
    available: true, hasDoneness: true, extraGroups: eg('eg-44'),
  },

  // ────────────────────────────── BEBIDAS ──────────────────────────────────
  {
    id: 'prod-5', name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Sprite — 350ml',
    price: 6.9, categoryId: 'cat-2', imageColor: '#B22222',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-6', name: 'Suco Natural',
    description: 'Laranja, Limão, Maracujá ou Abacaxi — 400ml',
    price: 9.9, categoryId: 'cat-2', imageColor: '#E8A020',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-7', name: 'Água Mineral',
    description: 'Com ou sem gás — 500ml',
    price: 4.0, categoryId: 'cat-2', imageColor: '#64B5F6',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-21', name: 'Cerveja Artesanal',
    description: 'IPA, Pale Ale ou Weiss — 355ml gelada',
    price: 16.9, categoryId: 'cat-2', imageColor: '#D4A017',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-22', name: 'Limonada Suíça',
    description: 'Limão siciliano, leite condensado, creme de leite — 450ml',
    price: 14.9, categoryId: 'cat-2', imageColor: '#9DC183',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-23', name: 'Chá Gelado',
    description: 'Pêssego, Limão ou Hibisco — 400ml',
    price: 8.9, categoryId: 'cat-2', imageColor: '#C2924A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-24', name: 'Água de Coco',
    description: 'Natural gelada — 300ml',
    price: 9.9, categoryId: 'cat-2', imageColor: '#E8F5E9',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-25', name: 'Shake de Açaí',
    description: 'Açaí, banana, granola, mel — 400ml',
    price: 19.9, categoryId: 'cat-2', imageColor: '#4A235A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-26', name: 'Cold Brew',
    description: 'Café coado a frio, serve gelado — 300ml',
    price: 12.9, categoryId: 'cat-2', imageColor: '#3E2723',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-27', name: 'Kombucha',
    description: 'Gengibre e limão, fermentação natural — 300ml',
    price: 13.9, categoryId: 'cat-2', imageColor: '#8BC34A',
    available: true, hasDoneness: false, extraGroups: [],
  },

  // ────────────────────────────── PORÇÕES ──────────────────────────────────
  {
    id: 'prod-8', name: 'Batata Frita',
    description: 'Porção média crocante com sal temperado',
    price: 16.9, categoryId: 'cat-3', imageColor: '#D4A017',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-9', name: 'Onion Rings',
    description: 'Anéis de cebola empanados, molho ranch',
    price: 18.9, categoryId: 'cat-3', imageColor: '#8B6914',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-28', name: 'Batata Rústica',
    description: 'Batata com casca, chimichurri e parmesão',
    price: 19.9, categoryId: 'cat-3', imageColor: '#C8A04A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-29', name: 'Nuggets de Frango',
    description: '10 unidades empanadas, molho à escolha',
    price: 22.9, categoryId: 'cat-3', imageColor: '#D4A060',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-30', name: 'Mozzarella Sticks',
    description: '6 palitos de mozzarella empanados, molho marinara',
    price: 24.9, categoryId: 'cat-3', imageColor: '#F5DEB3',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-31', name: 'Fritas Cheddar Bacon',
    description: 'Batata frita coberta com cheddar derretido e bacon',
    price: 26.9, categoryId: 'cat-3', imageColor: '#B8860B',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-32', name: 'Asinha de Frango',
    description: '6 unidades grelhadas ou fritas, molho Buffalo',
    price: 29.9, categoryId: 'cat-3', imageColor: '#CD853F',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-33', name: 'Chips de Mandioca',
    description: 'Mandioca fatiada fina e frita, sal grosso e ervas',
    price: 17.9, categoryId: 'cat-3', imageColor: '#DEB887',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-34', name: 'Mandioca Frita',
    description: 'Porção de mandioca frita com alho, azeite e salsinha',
    price: 18.9, categoryId: 'cat-3', imageColor: '#F5DEB3',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-35', name: 'Dadinho de Tapioca',
    description: '8 unidades crocantes com geleia de pimenta',
    price: 21.9, categoryId: 'cat-3', imageColor: '#FAEBD7',
    available: true, hasDoneness: false, extraGroups: [],
  },

  // ────────────────────────────── SOBREMESAS ───────────────────────────────
  {
    id: 'prod-10', name: 'Milkshake',
    description: 'Chocolate, Morango ou Baunilha — 400ml',
    price: 19.9, categoryId: 'cat-4', imageColor: '#C4607A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-36', name: 'Brownie com Sorvete',
    description: 'Brownie quente de chocolate 70%, sorvete de creme',
    price: 22.9, categoryId: 'cat-4', imageColor: '#3C1A0A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-37', name: 'Cheesecake de Morango',
    description: 'Base de biscoito, creme philadelphia, coulis de morango fresco',
    price: 19.9, categoryId: 'cat-4', imageColor: '#E8608A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-38', name: 'Sundae de Caramelo',
    description: 'Sorvete de baunilha, caramelo salgado, nozes trituradas',
    price: 17.9, categoryId: 'cat-4', imageColor: '#C68642',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-39', name: 'Sorvete Artesanal',
    description: '2 bolas: Chocolate Belga, Baunilha, Morango ou Pistache',
    price: 15.9, categoryId: 'cat-4', imageColor: '#F4C2C2',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-40', name: 'Crepe Nutella',
    description: 'Crepe fino com Nutella, banana e granola crocante',
    price: 18.9, categoryId: 'cat-4', imageColor: '#5C3317',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-41', name: 'Pudim de Leite',
    description: 'Pudim caseiro com calda de caramelo',
    price: 14.9, categoryId: 'cat-4', imageColor: '#D4A060',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-42', name: 'Açaí na Tigela',
    description: 'Açaí puro 300ml, granola, banana, morango e mel',
    price: 23.9, categoryId: 'cat-4', imageColor: '#4A235A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-43', name: 'Torta de Limão',
    description: 'Torta no pote, creme de limão siciliano, merengue maçaricado',
    price: 16.9, categoryId: 'cat-4', imageColor: '#C8D45A',
    available: true, hasDoneness: false, extraGroups: [],
  },

  // ────────────────────────────── COMBOS ───────────────────────────────────
  {
    id: 'prod-45', name: 'Combo Classic',
    description: 'Smash Classic + Batata Frita M + Refrigerante',
    price: 49.9, categoryId: 'cat-5', imageColor: '#8B5E3C',
    available: true, hasDoneness: true, extraGroups: [],
  },
  {
    id: 'prod-46', name: 'Combo Double',
    description: 'Double Smash + Fritas Cheddar Bacon + Refrigerante',
    price: 59.9, categoryId: 'cat-5', imageColor: '#6B4226',
    available: true, hasDoneness: true, extraGroups: [],
  },
  {
    id: 'prod-47', name: 'Combo Chicken',
    description: 'Chicken Crispy + Onion Rings + Suco Natural',
    price: 52.9, categoryId: 'cat-5', imageColor: '#C8870A',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-48', name: 'Combo Família',
    description: '4 Smash Classic + 2 Fritas G + 4 Refrigerantes',
    price: 169.9, categoryId: 'cat-5', imageColor: '#4A2C0A',
    available: true, hasDoneness: true, extraGroups: [],
  },
  {
    id: 'prod-49', name: 'Combo Kids',
    description: 'Mini Burguer 100g + Batata P + Suco Caixinha + Sorvete',
    price: 34.9, categoryId: 'cat-5', imageColor: '#FF8C00',
    available: true, hasDoneness: false, extraGroups: [],
  },
  {
    id: 'prod-50', name: 'Combo Veggie',
    description: 'Veggie Burguer + Chips de Mandioca + Kombucha',
    price: 54.9, categoryId: 'cat-5', imageColor: '#4CAF50',
    available: true, hasDoneness: false, extraGroups: [],
  },
]

export async function seedIfEmpty(currentCategoryCount: number) {
  if (currentCategoryCount > 0) return

  await saveSettingsFS({
    name: 'Minha Hamburgueria',
    estimatedMinutes: 15,
    acceptingOrders: true,
    paymentMethods: ['cash', 'card', 'pix'],
    businessHours: DEFAULT_BUSINESS_HOURS,
  })
  await Promise.all(categories.map(saveCategoryFS))
  await Promise.all(
    products.map((p) => saveProductFS({ ...p, imageUrl: PRODUCT_IMAGES[p.id] }))
  )
  console.info('[QIOSK] Seed completo carregado.')
}

export async function forceReseed() {
  await saveSettingsFS({
    name: 'Minha Hamburgueria',
    estimatedMinutes: 15,
    acceptingOrders: true,
    paymentMethods: ['cash', 'card', 'pix'],
    businessHours: DEFAULT_BUSINESS_HOURS,
  })
  await Promise.all(categories.map(saveCategoryFS))
  await Promise.all(
    products.map((p) => saveProductFS({ ...p, imageUrl: PRODUCT_IMAGES[p.id] }))
  )
  console.info('[QIOSK] Reseed forçado: 50 produtos carregados.')
}
