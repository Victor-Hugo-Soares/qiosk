'use client'
import { useRouter } from 'next/navigation'
import {
  Hamburger, Wine, ForkKnife, IceCream,
  Pizza, BowlFood, CookingPot, Coffee,
  SquaresFour,
} from '@phosphor-icons/react'
import { ChevronRight } from 'lucide-react'
import KioskHeader from '../components/KioskHeader'
import { CategoriesSkeleton } from '../../../components/Skeleton'
import { useQioskStore } from '../../../store'
import { K } from '../theme'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PhosphorIcon = React.FC<any>

const iconMap: Record<string, PhosphorIcon> = {
  Sandwich:        Hamburger,
  Hamburger,
  Cup:             Wine,
  CupSoda:         Wine,
  Wine,
  Coffee,
  UtensilsCrossed: ForkKnife,
  ForkKnife,
  IceCream,
  Star:            Pizza,
  Pizza,
  Beef:            BowlFood,
  BowlFood,
  CookingPot,
  Salad:           ForkKnife,
  ShoppingBag:     SquaresFour,
  LayoutGrid:      SquaresFour,
  SquaresFour,
}

export default function CategoriesScreen() {
  const router     = useRouter()
  const categories = useQioskStore((s) => s.categories)
  const products   = useQioskStore((s) => s.products)
  const synced     = useQioskStore((s) => s.synced)

  const sorted = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: K.bg }}>
      <KioskHeader showBack={false} />
      {!synced && <CategoriesSkeleton />}

      {synced && <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Título */}
        <div>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: 22, fontWeight: 700,
            color: K.text, margin: 0,
          }}>
            O que vai ser hoje?
          </h2>
          <p style={{ fontSize: 13, color: K.sub, marginTop: 4 }}>
            Escolha uma categoria para começar
          </p>
        </div>

        {/* Grid 2 colunas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {sorted.map((cat) => {
            const Icon  = iconMap[cat.icon] ?? Sandwich
            const count = products.filter((p) => p.categoryId === cat.id && p.available).length

            return (
              <button
                key={cat.id}
                onClick={() => router.push(`/kiosk/products/${cat.id}`)}
                className="touch-press"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '18px 16px',
                  borderRadius: 20,
                  background: K.surface,
                  border: 'none',
                  boxShadow: K.shadow,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 14,
                  background: K.brandLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={26} color={K.brand} weight="fill" />
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: 15, fontWeight: 700,
                    color: K.text, margin: 0,
                  }}>
                    {cat.name}
                  </p>
                  <p style={{ fontSize: 12, color: K.muted, marginTop: 3 }}>
                    {count} {count === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Ver tudo */}
        <button
          onClick={() => router.push('/kiosk/products/all')}
          className="touch-press"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderRadius: 16,
            background: K.surface,
            border: 'none',
            boxShadow: K.shadow,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: K.brandLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SquaresFour size={22} color={K.brand} weight="fill" />
            </div>
            <div>
              <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 15, fontWeight: 600, color: K.text, margin: 0 }}>
                Ver tudo
              </p>
              <p style={{ fontSize: 12, color: K.muted, marginTop: 2 }}>
                {products.filter((p) => p.available).length} itens disponíveis
              </p>
            </div>
          </div>
          <ChevronRight size={20} color={K.muted} strokeWidth={2} />
        </button>
      </div>}
    </div>
  )
}
