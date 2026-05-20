'use client'
import { useRouter } from 'next/navigation'
import KioskHeader from '../components/KioskHeader'
import ProductImage from '../components/ProductImage'
import { MinusIcon, PlusIcon, TrashIcon, EmptyBagIcon } from '../components/QioskIcons'
import { useCartStore, useQioskStore } from '../../../store'
import { K } from '../theme'

export default function CartScreen() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore()
  const products = useQioskStore((s) => s.products)

  if (items.length === 0) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: K.bg }}>
        <KioskHeader showCart={false} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 24px' }}>
          <div style={{
            width: 88, height: 88, borderRadius: 28,
            background: K.brandLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <EmptyBagIcon size={40} color={K.brand} strokeWidth={1.75} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: K.text, margin: 0 }}>
              Carrinho vazio
            </p>
            <p style={{ fontSize: 14, color: K.sub, marginTop: 6 }}>
              Adicione itens para continuar
            </p>
          </div>
          <button
            onClick={() => router.push('/kiosk/categories')}
            className="touch-press"
            style={{
              padding: '14px 32px', borderRadius: 16,
              background: K.brand, border: 'none',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15, fontWeight: 700, color: '#FFF',
              cursor: 'pointer',
            }}
          >
            Ver cardápio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: K.bg, paddingBottom: 120 }}>
      <KioskHeader showCart={false} />

      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: K.text, margin: 0 }}>
          Seu pedido
        </h2>

        {/* Itens */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId)
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex', gap: 14,
                  padding: '14px',
                  borderRadius: 18,
                  background: K.surface,
                  boxShadow: K.shadow,
                }}
              >
                {/* Thumb */}
                <div style={{
                  width: 68, height: 68, borderRadius: 12,
                  background: K.bg, flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {product && (
                    <ProductImage product={product} size={68} borderRadius={12} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14, fontWeight: 600, color: K.text,
                    margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.productName}
                  </p>

                  {item.doneness && (
                    <p style={{ fontSize: 12, color: K.muted, marginTop: 2 }}>{item.doneness}</p>
                  )}
                  {item.selectedExtras.map((ex) => (
                    <p key={ex.extraId} style={{ fontSize: 12, color: K.muted }}>+ {ex.extraName}</p>
                  ))}
                  {item.notes && (
                    <p style={{ fontSize: 12, color: K.muted, fontStyle: 'italic', marginTop: 2 }}>
                      "{item.notes}"
                    </p>
                  )}

                  {/* Preço + controles */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 15, fontWeight: 700, color: K.brand,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="touch-press"
                        style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: '#FFF5F5', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <TrashIcon size={15} color={K.danger} strokeWidth={1.75} />
                      </button>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        background: K.bg,
                        borderRadius: 12,
                        border: `1.5px solid ${K.border}`,
                        height: 40,
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="touch-press"
                          style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <MinusIcon size={14} color={K.text} strokeWidth={2.5} />
                        </button>
                        <span style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 14, fontWeight: 700, color: K.text,
                          width: 22, textAlign: 'center',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="touch-press"
                          style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <PlusIcon size={14} color={K.text} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Adicionar mais */}
        <button
          onClick={() => router.push('/kiosk/categories')}
          className="touch-press"
          style={{
            padding: '14px', borderRadius: 16,
            background: K.surface,
            border: `1.5px dashed ${K.border}`,
            cursor: 'pointer',
            fontSize: 14, color: K.sub,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
          }}
        >
          + Adicionar mais itens
        </button>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '14px 16px 16px',
        background: K.surface,
        borderTop: `1px solid ${K.border}`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: K.sub, fontWeight: 500 }}>Total</span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22, fontWeight: 700, color: K.text,
            fontVariantNumeric: 'tabular-nums',
          }}>
            R$ {totalPrice().toFixed(2).replace('.', ',')}
          </span>
        </div>
        <button
          onClick={() => router.push('/kiosk/payment')}
          className="touch-press"
          style={{
            width: '100%', height: 54,
            borderRadius: 16,
            background: K.brand, border: 'none',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 17, fontWeight: 700, color: '#FFF',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,107,43,0.3)',
          }}
        >
          Finalizar pedido
        </button>
      </div>
    </div>
  )
}
