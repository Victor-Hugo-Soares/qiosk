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
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#1A1A2E' }}>
      <KioskHeader showBack={false} />

      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Título */}
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            O que vai ser hoje?
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
            Escolha uma categoria
          </p>
        </div>

        {/* Grid 2 colunas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {sorted.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Sandwich
            const count = products.filter((p) => p.categoryId === cat.id && p.available).length

            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/kiosk/products/${cat.id}`)}
                className="touch-press"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  padding: '24px 12px',
                  borderRadius: 20,
                  background: '#16213E',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,107,43,0.5)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'rgba(255,107,43,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={26} color="#FF6B2B" strokeWidth={1.75} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14, fontWeight: 600,
                    color: '#FFFFFF',
                    margin: 0,
                  }}>
                    {cat.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>
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
