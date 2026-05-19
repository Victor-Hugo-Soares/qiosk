import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
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
    <div className="w-full min-h-screen flex flex-col" style={{ background: '#1A1A2E' }}>
      <KioskHeader />

      <div className="flex-1 flex flex-col px-5 py-6" style={{ gap: 20 }}>
        {/* Título */}
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {category?.name ?? 'Produtos'}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {list.filter((p) => p.available).length} disponíveis
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%' }}>
          {list.map((product) => (
            <button
              key={product.id}
              onClick={() => product.available && navigate(`/kiosk/product/${product.id}`)}
              disabled={!product.available}
              className="touch-press flex flex-col text-left overflow-hidden rounded-2xl"
              style={{
                background: '#16213E',
                border: `1.5px solid ${product.available ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                opacity: product.available ? 1 : 0.5,
                cursor: product.available ? 'pointer' : 'not-allowed',
              }}
            >
              {/* Imagem */}
              <div
                className="relative w-full flex items-center justify-center"
                style={{ aspectRatio: '4/3', background: '#1A1A2E' }}
              >
                <ProductPlaceholder color={product.imageColor} size={88} />
                {!product.available && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(26,26,46,0.75)' }}
                  >
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)' }}
                    >
                      Indisponível
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col p-3" style={{ gap: 6 }}>
                <p
                  className="font-semibold text-sm leading-snug line-clamp-2"
                  style={{ color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {product.name}
                </p>
                <p
                  className="text-xs leading-snug line-clamp-2"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="font-bold text-base tabular-nums"
                    style={{ color: '#FF6B2B', fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {product.available && (
                    <div
                      className="flex items-center justify-center rounded-lg"
                      style={{ width: 28, height: 28, background: '#FF6B2B' }}
                    >
                      <Plus size={16} color="#FFF" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
