import { useNavigate } from 'react-router-dom'
import {
  Sandwich, Coffee, UtensilsCrossed, IceCream2,
  Pizza, Beef, Salad, ShoppingBag,
} from 'lucide-react'
import KioskHeader from '../components/KioskHeader'
import { useQioskStore } from '../../../store'

const iconMap: Record<string, React.ElementType> = {
  Sandwich, Cup: Coffee, UtensilsCrossed, IceCream: IceCream2,
  Pizza, Beef, Salad, ShoppingBag,
}

export default function CategoriesScreen() {
  const navigate = useNavigate()
  const categories = useQioskStore((s) => s.categories)
  const products   = useQioskStore((s) => s.products)

  const sorted = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: '#1A1A2E' }}>
      <KioskHeader showBack={false} />

      <div className="flex-1 flex flex-col px-5 py-6" style={{ gap: 24 }}>
        {/* Título */}
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            O que vai ser hoje?
          </h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Escolha uma categoria
          </p>
        </div>

        {/* Grid 2 colunas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            width: '100%',
          }}
        >
          {sorted.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Sandwich
            const count = products.filter((p) => p.categoryId === cat.id && p.available).length

            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/kiosk/products/${cat.id}`)}
                className="touch-press flex flex-col items-center justify-center rounded-2xl"
                style={{
                  background: '#16213E',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  padding: '28px 16px',
                  gap: 14,
                  cursor: 'pointer',
                  minHeight: 148,
                  width: '100%',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,107,43,0.5)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              >
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: 56, height: 56, background: 'rgba(255,107,43,0.12)' }}
                >
                  <Icon size={26} color="#FF6B2B" strokeWidth={1.75} />
                </div>
                <div className="text-center" style={{ gap: 4 }}>
                  <p
                    className="font-semibold text-base"
                    style={{ color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {cat.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {count} {count === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
