'use client'
import { useRouter, useParams } from 'next/navigation'
import KioskHeader from '../components/KioskHeader'
import ProductImage from '../components/ProductImage'
import { ChevronRightIcon } from '../components/QioskIcons'
import { ProductsSkeleton } from '../../../components/Skeleton'
import { useQioskStore } from '../../../store'
import { K } from '../theme'

export default function ProductsScreen() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.categoryId as string
  const categories = useQioskStore((s) => s.categories)
  const products   = useQioskStore((s) => s.products)

  const synced   = useQioskStore((s) => s.synced)
  const isAll    = categoryId === 'all'
  const category = categories.find((c) => c.id === categoryId)
  const list     = isAll
    ? products.filter((p) => p.available)
    : products.filter((p) => p.categoryId === categoryId)

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: K.bg }}>
      <KioskHeader />
      {!synced && <ProductsSkeleton />}

      {synced && <div style={{ flex: 1, padding: '20px 16px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Título */}
        <div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22, fontWeight: 700,
            color: K.text, margin: 0,
          }}>
            {isAll ? 'Cardápio completo' : (category?.name ?? 'Produtos')}
          </h2>
          <p style={{ fontSize: 13, color: K.sub, marginTop: 4 }}>
            {list.filter((p) => p.available).length} disponíveis
          </p>
        </div>

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((product) => (
            <button
              key={product.id}
              onClick={() => product.available && router.push(`/kiosk/product/${product.id}`)}
              disabled={!product.available}
              className="touch-press"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px',
                borderRadius: 18,
                background: K.surface,
                border: 'none',
                boxShadow: product.available ? K.shadow : 'none',
                opacity: product.available ? 1 : 0.45,
                cursor: product.available ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 84, height: 84,
                borderRadius: 14,
                background: K.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <ProductImage product={product} size={84} borderRadius={14} />
                {!product.available && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,248,244,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: K.muted,
                      background: K.surface,
                      padding: '2px 7px', borderRadius: 20,
                      border: `1px solid ${K.border}`,
                    }}>
                      Indisponível
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 15, fontWeight: 600, color: K.text,
                  margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {product.name}
                </p>
                {product.description && (
                  <p style={{
                    fontSize: 12, color: K.sub,
                    margin: '3px 0 0',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {product.description}
                  </p>
                )}
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 17, fontWeight: 700, color: K.brand,
                  margin: '8px 0 0',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Chevron */}
              {product.available && (
                <ChevronRightIcon size={20} color={K.muted} strokeWidth={2} />
              )}
            </button>
          ))}
        </div>
      </div>}
    </div>
  )
}
