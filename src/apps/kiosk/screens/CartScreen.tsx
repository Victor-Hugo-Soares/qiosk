import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import KioskHeader from '../components/KioskHeader'
import ProductPlaceholder from '../components/ProductPlaceholder'
import { useCartStore, useQioskStore } from '../../../store'

const S = {
  surface: '#16213E',
  border: 'rgba(255,255,255,0.09)',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.5)',
  dim: 'rgba(255,255,255,0.3)',
  brand: '#FF6B2B',
}

export default function CartScreen() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore()
  const products = useQioskStore((s) => s.products)

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col" style={{ background: '#1A1A2E' }}>
        <KioskHeader showCart={false} />
        <div className="flex-1 flex flex-col items-center justify-center px-5" style={{ gap: 20 }}>
          <div className="flex items-center justify-center rounded-full"
            style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.05)' }}>
            <ShoppingBag size={36} color="rgba(255,255,255,0.2)" />
          </div>
          <div className="text-center" style={{ gap: 6, display: 'flex', flexDirection: 'column' }}>
            <p className="font-semibold text-base" style={{ color: S.muted, fontFamily: "'Space Grotesk', sans-serif" }}>
              Carrinho vazio
            </p>
            <p className="text-sm" style={{ color: S.dim }}>Adicione itens para continuar</p>
          </div>
          <button onClick={() => navigate('/kiosk/categories')}
            className="touch-press px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: S.brand, fontFamily: "'Space Grotesk', sans-serif" }}>
            Ver cardápio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: '#1A1A2E', paddingBottom: 120 }}>
      <KioskHeader showCart={false} />

      <div className="flex-1 flex flex-col px-5 py-6" style={{ gap: 20 }}>
        <h2 className="text-2xl font-bold" style={{ color: S.text, fontFamily: "'Space Grotesk', sans-serif" }}>
          Seu pedido
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId)
            return (
              <div key={item.id} className="flex rounded-2xl p-4"
                style={{ background: S.surface, border: `1.5px solid ${S.border}`, gap: 14 }}>
                {/* Thumb */}
                <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 64, height: 64, background: '#1A1A2E' }}>
                  <ProductPlaceholder color={product?.imageColor ?? '#8B5E3C'} size={44} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p className="font-semibold text-sm leading-tight truncate"
                    style={{ color: S.text, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.productName}
                  </p>

                  {item.doneness && (
                    <p className="text-xs" style={{ color: S.dim }}>{item.doneness}</p>
                  )}
                  {item.selectedExtras.map((ex) => (
                    <p key={ex.extraId} className="text-xs" style={{ color: S.dim }}>+ {ex.extraName}</p>
                  ))}
                  {item.notes && (
                    <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.25)' }}>"{item.notes}"</p>
                  )}

                  {/* Preço + controles */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm tabular-nums"
                      style={{ color: S.brand, fontFamily: "'Space Grotesk', sans-serif" }}>
                      R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => removeItem(item.id)}
                        className="touch-press flex items-center justify-center rounded-xl"
                        style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)' }}>
                        <Trash2 size={15} color="rgba(255,255,255,0.4)" />
                      </button>
                      <div className="flex items-center rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.06)', height: 40, gap: 0 }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="touch-press flex items-center justify-center"
                          style={{ width: 40, height: 40 }}>
                          <Minus size={14} color="rgba(255,255,255,0.65)" />
                        </button>
                        <span className="font-semibold text-sm text-white tabular-nums"
                          style={{ width: 24, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="touch-press flex items-center justify-center"
                          style={{ width: 40, height: 40 }}>
                          <Plus size={14} color="rgba(255,255,255,0.65)" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={() => navigate('/kiosk/categories')}
          className="touch-press w-full py-3.5 rounded-xl text-sm"
          style={{ border: `1.5px solid ${S.border}`, color: S.muted }}>
          + Adicionar mais itens
        </button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{ background: 'rgba(26,26,46,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm" style={{ color: S.muted }}>Total</span>
          <span className="font-bold text-xl tabular-nums" style={{ color: S.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            R$ {totalPrice().toFixed(2).replace('.', ',')}
          </span>
        </div>
        <button onClick={() => navigate('/kiosk/payment')}
          className="touch-press w-full rounded-xl font-bold text-lg text-white"
          style={{ height: 56, background: S.brand, fontFamily: "'Space Grotesk', sans-serif" }}>
          Finalizar pedido
        </button>
      </div>
    </div>
  )
}
