import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import KioskHeader from '../components/KioskHeader'
import ProductImage from '../components/ProductImage'
import { useQioskStore, useCartStore } from '../../../store'
import type { Doneness, OrderItem } from '../../../types'
import { K } from '../theme'

const DONENESS: { value: Doneness; label: string; emoji: string }[] = [
  { value: 'mal-passado', label: 'Mal passado', emoji: '🩷' },
  { value: 'ao-ponto',    label: 'Ao ponto',    emoji: '❤️' },
  { value: 'bem-passado', label: 'Bem passado', emoji: '🖤' },
]

export default function ProductDetailScreen() {
  const navigate      = useNavigate()
  const { productId } = useParams<{ productId: string }>()
  const product       = useQioskStore((s) => s.products.find((p) => p.id === productId))
  const addItem       = useCartStore((s) => s.addItem)

  const [qty,      setQty]      = useState(1)
  const [doneness, setDoneness] = useState<Doneness>('ao-ponto')
  const [extras,   setExtras]   = useState<Record<string, boolean>>({})
  const [notes,    setNotes]    = useState('')

  if (!product) { navigate('/kiosk/categories'); return null }

  const toggleExtra = (id: string) => setExtras((p) => ({ ...p, [id]: !p[id] }))

  const extrasTotal = product.extraGroups.flatMap((g) => g.extras)
    .reduce((sum, ex) => sum + (extras[ex.id] ? ex.price : 0), 0)
  const total = (product.price + extrasTotal) * qty

  const handleAdd = () => {
    const item: Omit<OrderItem, 'id'> = {
      productId:      product.id,
      productName:    product.name,
      productPrice:   product.price,
      quantity:       qty,
      doneness:       product.hasDoneness ? doneness : undefined,
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
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: K.bg, paddingBottom: 100 }}>
      <KioskHeader />

      {/* Hero foto */}
      <div style={{
        width: '100%',
        height: 260,
        background: K.brandLight,
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
      }}>
        {product.imageUrl ? (
          <img
            src={`${product.imageUrl}?auto=format&fit=crop&w=800&q=85`}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <ProductImage product={product} size={180} borderRadius={20} />
          </div>
        )}
        {/* Gradiente suave na base para o conteúdo não cortar bruto */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 60,
          background: 'linear-gradient(to bottom, transparent, rgba(255,248,244,0.8))',
        }} />
      </div>

      <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Nome + preço */}
        <div style={{ background: K.surface, borderRadius: 20, padding: '20px', boxShadow: K.shadow }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22, fontWeight: 700, color: K.text,
            margin: 0, lineHeight: 1.2,
          }}>
            {product.name}
          </h2>
          {product.description && (
            <p style={{ fontSize: 14, color: K.sub, marginTop: 8, lineHeight: 1.5 }}>
              {product.description}
            </p>
          )}
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 24, fontWeight: 700, color: K.brand,
            margin: '12px 0 0',
            fontVariantNumeric: 'tabular-nums',
          }}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Ponto da carne */}
        {product.hasDoneness && (
          <div style={{ background: K.surface, borderRadius: 20, padding: '20px', boxShadow: K.shadow }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14, fontWeight: 700, color: K.text, marginBottom: 14,
            }}>
              🥩 Ponto da carne
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {DONENESS.map((opt) => {
                const active = doneness === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDoneness(opt.value)}
                    className="touch-press"
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      borderRadius: 14,
                      border: `2px solid ${active ? K.brand : K.border}`,
                      background: active ? K.brandLight : K.bg,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.emoji}</div>
                    <p style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 11, fontWeight: 600,
                      color: active ? K.brand : K.sub,
                      margin: 0,
                    }}>
                      {opt.label}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Adicionais */}
        {product.extraGroups.map((group) => (
          <div key={group.id} style={{ background: K.surface, borderRadius: 20, padding: '20px', boxShadow: K.shadow }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14, fontWeight: 700, color: K.text, marginBottom: 12,
            }}>
              ✨ {group.name}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.extras.map((ex) => {
                const checked = !!extras[ex.id]
                return (
                  <button
                    key={ex.id}
                    onClick={() => ex.available && toggleExtra(ex.id)}
                    disabled={!ex.available}
                    className="touch-press"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 14,
                      border: `2px solid ${checked ? K.brand : K.border}`,
                      background: checked ? K.brandLight : K.bg,
                      opacity: ex.available ? 1 : 0.4,
                      cursor: ex.available ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: checked ? K.brand : K.surface,
                        border: `2px solid ${checked ? K.brand : K.muted}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}>
                        {checked && (
                          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: 14, color: K.text, fontWeight: 500 }}>{ex.name}</span>
                    </div>
                    {ex.price > 0 && (
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 14, fontWeight: 700, color: K.brand,
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        +R$ {ex.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Observações */}
        <div style={{ background: K.surface, borderRadius: 20, padding: '20px', boxShadow: K.shadow }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14, fontWeight: 700, color: K.text, marginBottom: 10,
          }}>
            📝 Observações (opcional)
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            placeholder="Ex: sem cebola, sem tomate..."
            rows={2}
            style={{
              width: '100%',
              background: K.bg,
              border: `1.5px solid ${K.border}`,
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 14, color: K.text,
              fontFamily: "'Inter', sans-serif",
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Footer fixo */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 16px',
        background: K.surface,
        borderTop: `1px solid ${K.border}`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Qty */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: K.bg,
            borderRadius: 14,
            height: 52,
            border: `1.5px solid ${K.border}`,
          }}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="touch-press"
              style={{ width: 44, height: 52, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Minus size={16} color={K.text} strokeWidth={2.5} />
            </button>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 700, color: K.text,
              width: 28, textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="touch-press"
              style={{ width: 44, height: 52, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={16} color={K.text} strokeWidth={2.5} />
            </button>
          </div>

          {/* Adicionar */}
          <button
            onClick={handleAdd}
            className="touch-press"
            style={{
              flex: 1, height: 52,
              borderRadius: 14,
              background: K.brand,
              border: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px',
            }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: '#FFF' }}>
              Adicionar
            </span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: '#FFF', fontVariantNumeric: 'tabular-nums' }}>
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
