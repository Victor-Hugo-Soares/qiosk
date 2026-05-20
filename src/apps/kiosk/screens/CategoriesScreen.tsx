import React from 'react'
import { useNavigate } from 'react-router-dom'
import KioskHeader from '../components/KioskHeader'
import {
  BurgerIcon, DrinkIcon, FriesIcon, IceCreamIcon,
  AllMenuIcon, ChevronRightIcon,
  type IconProps,
} from '../components/QioskIcons'
import { CategoriesSkeleton } from '../../../components/Skeleton'
import { useQioskStore } from '../../../store'
import { K } from '../theme'

type QioskIcon = (props: IconProps) => React.ReactElement

const iconMap: Record<string, QioskIcon> = {
  Sandwich:         BurgerIcon,
  Cup:              DrinkIcon,
  UtensilsCrossed:  FriesIcon,
  IceCream:         IceCreamIcon,
  Pizza:            BurgerIcon,
  Beef:             BurgerIcon,
  Salad:            DrinkIcon,
  ShoppingBag:      AllMenuIcon,
}

const CARD_TINTS = [
  '#FFF3E8', '#FFF8E1', '#F3FFF0', '#E8F4FF',
  '#FFF0F3', '#F5F0FF', '#FFFDE8', '#F0FFFA',
]
const ICON_COLORS = [
  '#FF6B2B', '#F5A623', '#27AE60', '#2E86DE',
  '#E84393', '#8B5CF6', '#F39C12', '#00B894',
]

export default function CategoriesScreen() {
  const navigate   = useNavigate()
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
            fontFamily: "'Space Grotesk', sans-serif",
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
          {sorted.map((cat, i) => {
            const Icon      = iconMap[cat.icon] ?? BurgerIcon
            const count     = products.filter((p) => p.categoryId === cat.id && p.available).length
            const tint      = CARD_TINTS[i % CARD_TINTS.length]
            const iconColor = ICON_COLORS[i % ICON_COLORS.length]

            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/kiosk/products/${cat.id}`)}
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
                  width: 52, height: 52,
                  borderRadius: 16,
                  background: tint,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={26} color={iconColor} strokeWidth={1.75} />
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
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
          onClick={() => navigate('/kiosk/products/all')}
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
              <AllMenuIcon size={22} color={K.brand} strokeWidth={1.75} />
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: K.text, margin: 0 }}>
                Ver tudo
              </p>
              <p style={{ fontSize: 12, color: K.muted, marginTop: 2 }}>
                {products.filter((p) => p.available).length} itens disponíveis
              </p>
            </div>
          </div>
          <ChevronRightIcon size={20} color={K.muted} strokeWidth={2} />
        </button>
      </div>}
    </div>
  )
}
