import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import KioskHeader from '../components/KioskHeader'
import ProductPlaceholder from '../components/ProductPlaceholder'
import { useQioskStore, useCartStore } from '../../../store'
import type { Doneness, OrderItem } from '../../../types'

const DONENESS: { value: Doneness; label: string }[] = [
  { value: 'mal-passado', label: 'Mal passado' },
  { value: 'ao-ponto',    label: 'Ao ponto'    },
  { value: 'bem-passado', label: 'Bem passado' },
]

const S = {
  surface: '#16213E',
  border: 'rgba(255,255,255,0.09)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.3)',
  label: 'rgba(255,255,255,0.45)',
  brand: '#FF6B2B',
}

export default function ProductDetailScreen() {
  const navigate   = useNavigate()
  const { productId } = useParams<{ productId: string }>()
  const product    = useQioskStore((s) => s.products.find((p) => p.id === productId))
  const addItem    = useCartStore((s) => s.addItem)

  const [qty, setQty]         = useState(1)
  const [doneness, setDoneness] = useState<Doneness>('ao-ponto')
  const [extras, setExtras]   = useState<Record<string, boolean>>({})
  const [notes, setNotes]     = useState('')

  if (!product) { navigate('/kiosk/categories'); return null }

  const toggleExtra = (id: string) => setExtras((p) => ({ ...p, [id]: !p[id] }))

  const extrasTotal = product.extraGroups.flatMap((g) => g.extras)
    .reduce((sum, ex) => sum + (extras[ex.id] ? ex.price : 0), 0)
  const total = (product.price + extrasTotal) * qty

  const handleAdd = () => {
    const item: Omit<OrderItem, 'id'> = {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity: qty,
      doneness: product.hasDoneness ? doneness : undefined,
      selectedExtras: product.extraGroups.flatMap((g) => g.extras)
        .filter((ex) => extras[ex.id])
        .map((ex) => ({ extraId: ex.id, extraName: ex.name, price: ex.price })),
      notes,
      totalPrice: total,
    }
    addItem(item)
    navigate('/kiosk/cart')
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: '#1A1A2E', paddingBottom: 96 }}>
      <KioskHeader />

      {/* Hero */}
      <div className="w-full flex items-center justify-center py-10" style={{ background: S.surface }}>
        <ProductPlaceholder color={product.imageColor} size={140} />
      </div>

      <div className="flex-1 flex flex-col px-5 py-6" style={{ gap: 28 }}>
        {/* Nome + preço */}
        <div style={{ gap: 8, display: 'flex', flexDirection: 'column' }}>
          <h2 className="text-2xl font-bold leading-tight"
            style={{ color: S.textPrimary, fontFamily: "'Space Grotesk', sans-serif" }}>
            {product.name}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: S.textSecondary }}>
            {product.description}
          </p>
          <p className="text-xl font-bold tabular-nums mt-1"
            style={{ color: S.brand, fontFamily: "'Space Grotesk', sans-serif" }}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Ponto da carne */}
        {product.hasDoneness && (
          <div style={{ gap: 12, display: 'flex', flexDirection: 'column' }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: S.label }}>
              Ponto da carne
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {DONENESS.map((opt) => {
                const active = doneness === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDoneness(opt.value)}
                    className="flex-1 touch-press rounded-xl py-3 text-sm font-semibold"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      background: active ? S.brand : 'transparent',
                      border: `1.5px solid ${active ? S.brand : S.border}`,
                      color: active ? '#FFF' : S.textSecondary,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Adicionais */}
        {product.extraGroups.map((group) => (
          <div key={group.id} style={{ gap: 10, display: 'flex', flexDirection: 'column' }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: S.label }}>
              {group.name}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.extras.map((ex) => {
                const checked = !!extras[ex.id]
                return (
                  <button
                    key={ex.id}
                    onClick={() => ex.available && toggleExtra(ex.id)}
                    disabled={!ex.available}
                    className="touch-press flex items-center justify-between px-4 rounded-xl"
                    style={{
                      height: 52,
                      background: checked ? 'rgba(255,107,43,0.10)' : S.surface,
                      border: `1.5px solid ${checked ? 'rgba(255,107,43,0.5)' : S.border}`,
                      opacity: ex.available ? 1 : 0.4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        className="flex items-center justify-center rounded-md"
                        style={{
                          width: 20, height: 20,
                          background: checked ? S.brand : 'transparent',
                          border: `2px solid ${checked ? S.brand : 'rgba(255,255,255,0.25)'}`,
                          transition: 'all 0.15s ease',
                          flexShrink: 0,
                        }}
                      >
                        {checked && (
                          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                            <path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm" style={{ color: S.textPrimary }}>{ex.name}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums"
                      style={{ color: S.brand, fontFamily: "'Space Grotesk', sans-serif" }}>
                      +R$ {ex.price.toFixed(2).replace('.', ',')}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Observações */}
        <div style={{ gap: 8, display: 'flex', flexDirection: 'column' }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: S.label }}>
            Observações (opcional)
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: sem cebola, sem tomate..."
            rows={2}
            className="w-full text-sm resize-none outline-none rounded-xl px-4 py-3"
            style={{
              background: S.surface,
              border: `1.5px solid ${S.border}`,
              color: S.textPrimary,
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>
      </div>

      {/* Footer fixo */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{ background: 'rgba(26,26,46,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Qty */}
          <div
            className="flex items-center rounded-xl px-1"
            style={{ background: S.surface, height: 52, gap: 4 }}
          >
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="touch-press flex items-center justify-center rounded-lg"
              style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.06)' }}>
              <Minus size={16} color="rgba(255,255,255,0.75)" />
            </button>
            <span className="font-bold text-lg text-white tabular-nums"
              style={{ width: 28, textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>
              {qty}
            </span>
            <button onClick={() => setQty((q) => q + 1)}
              className="touch-press flex items-center justify-center rounded-lg"
              style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.06)' }}>
              <Plus size={16} color="rgba(255,255,255,0.75)" />
            </button>
          </div>

          {/* Adicionar */}
          <button
            onClick={handleAdd}
            className="touch-press flex-1 flex items-center justify-between px-5 rounded-xl font-bold text-white"
            style={{ height: 52, background: S.brand, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span>Adicionar</span>
            <span className="tabular-nums">R$ {total.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
