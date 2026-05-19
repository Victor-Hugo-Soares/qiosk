import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import KioskHeader from '../components/KioskHeader'
import ProductPlaceholder from '../components/ProductPlaceholder'
import { useQioskStore } from '../../../store'

export default function ProductsScreen() {
  const navigate = useNavigate()
  const { categoryId } = useParams<{ categoryId: string }>()
  const categories = useQioskStore((s) => s.categories)
  const products   = useQioskStore((s) => s.products)

  const category = categories.find((c) => c.id === categoryId)
  const list     = products.filter((p) => p.categoryId === categoryId)

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#1A1A2E' }}>
      <KioskHeader />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 16px', gap: 16 }}>
        {/* Título */}
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            {category?.name ?? 'Produtos'}
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
            {list.filter((p) => p.available).length} disponíveis
          </p>
        </div>

        {/* Lista vertical */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((product) => (
            <button
              key={product.id}
              onClick={() => product.available && navigate(`/kiosk/product/${product.id}`)}
              disabled={!product.available}
              className="touch-press"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px',
                borderRadius: 16,
                background: '#16213E',
                border: `1.5px solid ${product.available ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                opacity: product.available ? 1 : 0.5,
                cursor: product.available ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                background: '#1A1A2E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <ProductPlaceholder color={product.imageColor} size={60} />
                {!product.available && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(26,26,46,0.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.08)',
                      padding: '2px 6px', borderRadius: 20,
                    }}>
                      Indisponível
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 15, fontWeight: 600,
                  color: '#FFFFFF',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  margin: 0,
                }}>
                  {product.name}
                </p>
                {product.description && (
                  <p style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.45)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    margin: 0,
                  }}>
                    {product.description}
                  </p>
                )}
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 16, fontWeight: 700,
                  color: '#FF6B2B',
                  marginTop: 4,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Seta */}
              {product.available && (
                <ChevronRight size={20} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
