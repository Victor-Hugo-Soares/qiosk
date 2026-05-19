# QIOSK — Contexto do Projeto

## O que é
PWA de autoatendimento para hamburguerias. O cliente faz o pedido direto no totem/tablet, sem precisar de atendente. O sistema tem três interfaces distintas dentro do mesmo app.

## Stack
- React 19 + Vite + TypeScript
- Zustand com `persist` (localStorage)
- React Router v6 (nested routes)
- Vite PWA Plugin (service worker + manifest)
- Google Fonts: **Space Grotesk** (headings, labels, botões) + **Inter** (body) — carregadas via `<link>` no `index.html`, não via CSS `@import`

## Repositório
GitHub: https://github.com/Victor-Hugo-Soares/qiosk.git — branch `main`

---

## Três apps

### `/kiosk/*` — Cliente (totem)
- **Mobile-first**, viewport alvo 390px
- Fluxo: `idle → categories → products/:id → product/:id → cart → payment → pix (opcional) → confirmation`
- Idle timeout: 90s sem interação → volta para `/kiosk/idle`
- Se `acceptingOrders = false`: mostra tela de loja fechada; se o cliente estiver no meio do fluxo, redireciona imediatamente para idle

### `/kitchen/*` — Cozinha
- Kanban de 3 colunas: **Aguardando → Preparando → Pronto**
- Tema claro quente (não dark)
- Cores de urgência no timer: verde → amarelo → vermelho conforme tempo

### `/admin/*` — Painel Admin
- Sidebar fixa (210px) com navegação
- Rotas: `dashboard`, `menu`, `menu/new`, `menu/edit/:id`, `categories`, `settings`
- Fundo geral: `#F4F3F0`

### `/` — ModePicker
- Seletor de modo inicial com 3 cards coloridos (Totem, Cozinha, Admin)

---

## Identidade Visual

| Token | Valor | Uso |
|-------|-------|-----|
| `bg` | `#FFF8F4` | Fundo principal kiosk |
| `surface` | `#FFFFFF` | Cards |
| `brand` | `#FF6B2B` | Laranja — CTA, destaques |
| `brandLight` | `#FFF0E6` | Fundo de hero/hero tint |
| `text` | `#1C1C1E` | Texto principal |
| `sub` | `#6B6B6B` | Texto secundário |
| `muted` | `#A0A0A0` | Texto terciário, rodapés |
| `border` | `rgba(0,0,0,0.07)` | Divisores sutis |
| `shadow` | `0 2px 12px rgba(0,0,0,0.07)` | Cards |
| `shadowMd` | `0 6px 24px rgba(0,0,0,0.11)` | Cards elevados |
| `success` | `#22C55E` | Verde confirmação |
| `danger` | `#EF4444` | Vermelho erro/urgência |

**Token compartilhado kiosk:** objeto `K` em `src/apps/kiosk/theme.ts`
**Admin/Kitchen:** cada arquivo declara `const C = {...}` local com a mesma paleta

### Regras de estilo
- **Todo layout/cor crítico usa `style={{...}}` inline** — Tailwind v4 é instável para grid/opacity neste projeto
- Classes Tailwind só para utilitários: `touch-press` (active:scale press feedback), `no-scrollbar`
- Cards usam `box-shadow` (não border) para o efeito "papel quente"
- Touch targets mínimos: 44px

---

## Estado — `src/store/index.ts`

### QioskStore (persistido)
```ts
settings: StoreSettings       // name, estimatedMinutes, acceptingOrders, paymentMethods
categories: Category[]        // com order para reordenação
products: Product[]           // com extraGroups, hasDoneness, available
orders: Order[]
nextOrderNumber: number       // reset diário automático
lastOrderDate: string         // 'YYYY-MM-DD' — controla reset diário
```

### CartStore (sessão — não persistido)
```ts
items: OrderItem[]
// addItem, removeItem, updateQuantity, clear, totalItems, totalPrice
```

### Reset diário de pedidos
`addOrder` compara `lastOrderDate` com a data atual. Se for novo dia, `nextOrderNumber` volta para 1.

### `partialize`
Persiste: `settings`, `categories`, `products`, `orders`, `nextOrderNumber`, `lastOrderDate`
Não persiste: `items` do carrinho (começa do zero a cada sessão)

---

## Tipos — `src/types/index.ts`
```ts
Category    { id, name, icon, order }
Product     { id, name, description, price, categoryId, imageColor, available, hasDoneness, extraGroups }
ExtraGroup  { id, name, required, multiple, extras: Extra[] }
Extra       { id, name, price, available }
OrderItem   { id, productId, productName, productPrice, quantity, selectedExtras, doneness?, notes?, totalPrice }
Order       { id, number, items, status, paymentMethod, totalPrice, estimatedMinutes, createdAt, updatedAt }
StoreSettings { name, estimatedMinutes, acceptingOrders, paymentMethods }
```

---

## Processos Concluídos

| # | Processo |
|---|----------|
| 1 | Setup PWA, roteamento, ModePicker |
| 2 | KioskApp — fluxo cliente completo |
| 3 | KitchenScreen — Kanban, redesign tema quente |
| 4 | AdminApp — Dashboard, Menu CRUD, ProductForm, Categories CRUD, Settings |
| — | Redesign visual completo (dark navy → quente/humano, estilo iFood) |
| — | Reset diário do número do pedido |
| — | Tela de loja fechada + redirect mid-flow |

---

## Checklist Pré-Firebase

- [x] Reset diário do número do pedido
- [x] Tela de loja fechada (`acceptingOrders = false`)
- [ ] Teste de instalação PWA no tablet/celular

---

## Próximos Processos

| # | Processo |
|---|----------|
| 5 | **Firebase** — Firestore (orders/menu), Auth (admin), Realtime Database (kitchen sync) |
| 6 | **Next.js migration** — deploy, performance, SEO |
| 7 | **Pagamento por cartão** — MercadoPago Point API ou Stone TEF, configurável por loja (cada hamburgueria usa sua própria máquina/banco) |

---

## Gotchas e Decisões

- **`seedSettings.name = ''`** — propositalmente vazio. Loja nova não tem nome pré-definido. O IdleScreen mostra o logo QIOSK quando não há nome.
- **localStorage antigo com "Burguer do Zé":** `localStorage.removeItem('qiosk-store'); location.reload()` no DevTools.
- **PowerShell não tem `&&`** — usar `;` para encadear ou chamadas separadas. Commit messages multi-linha: heredoc `@'...'@`.
- **Tailwind v4 instável** — não usar para layout/cor crítico. Só inline styles.
- **`hasDoneness`** — flag no produto que habilita seleção de ponto da carne (mal passado, ao ponto, bem passado) no ProductDetailScreen.
