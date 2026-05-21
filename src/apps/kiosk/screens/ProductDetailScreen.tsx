'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import KioskHeader from '../components/KioskHeader'
import ProductImage from '../components/ProductImage'
import { SteakIcon, SparkleIcon, PencilIcon, PlusIcon, MinusIcon, MeatSliceIcon } from '../components/QioskIcons'
import { useQioskStore, useCartStore } from '../../../store'
import type { Doneness, OrderItem } from '../../../types'
import { K } from '../theme'

// Cores do corte transversal por ponto:
// mal-passado → crosta clara + interior vermelho vivo
// ao-ponto    → crosta média + interior rosado
// bem-passado → crosta escura + interior marrom (sem rosa)
const DONENESS: { value: Doneness; label: string; crustColor: string; innerColor: string }[] = [
  { value: 'mal-passado', label: 'Mal passado', crustColor: '#A0673A', innerColor: '#C0392B' },
  { value: 'ao-ponto',    label: 'Ao ponto',    crustColor: '#8B4513', innerColor: '#C87941' },
  { value: 'bem-passado', label: 'Bem passado', crustColor: '#4A2008', innerColor: '#6B3515' },
]

export default function ProductDetailScreen() {
  const router      = useRouter()
  const params      = useParams()
  const productId   = params.productId as string
  const product       = useQioskStore((s) => s.products.find((p) => p.id === productId))
  const addItem       = useCartStore((s) => s.addItem)

  const [qty,       setQty]      = useState(1)
  const [doneness,  setDoneness] = useState<Doneness>('ao-ponto')
  const [extras,    setExtras]   = useState<Record<string, boolean>>({})
  const [notes,     setNotes]    = useState('')
  const [iceOption, setIceOption] = useState('com-gelo')
  if (!product) { router.push('/kiosk/categories'); return null }

  const isDrink = product.categoryId === 'cat-2'

  const ICE_OPTIONS = [
    { value: 'sem-gelo',          label: 'Sem gelo',          emoji: '🚫' },
    { value: 'com-gelo',          label: 'Com gelo',          emoji: '🧊' },
    { value: 'gelo-limao',        label: 'Gelo + Limão',      emoji: '🍋' },
    { value: 'gelo-limao-menta',  label: 'Gelo + Limão + Hortelã', emoji: '🌿' },
  ]

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
      notes: isDrink
        ? `[${ICE_OPTIONS.find((o) => o.value === iceOption)?.label ?? iceOption}]${notes ? ' ' + notes : ''}`
        : notes,
      totalPrice: total,
    }
    addItem(item)
    router.push('/kiosk/cart')
  }

  return (
    <div style={{
      width: '100%',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: K.bg,
    }}>
      {/* Header fixo no topo */}
      <KioskHeader />

      {/* Área scrollável */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

        {/* Hero — sticky: fica no topo enquanto o conteúdo sobe sobre ele */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: 300,
          background: K.surfaceMuted,
          overflow: 'hidden',
          zIndex: 0,
          flexShrink: 0,
        }}>
          {product.imageUrl ? (
            <img
              src={`${product.imageUrl}?auto=format&fit=crop&w=800&q=85`}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                display: 'block',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <ProductImage product={product} size={180} borderRadius={20} />
            </div>
          )}

          {/* Gradiente na base da imagem */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 80,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,244,241,0.7) 60%, rgba(245,244,241,0.98) 100%)',
            zIndex: 1,
          }} />
        </div>

        {/* Conteúdo — sobe sobre a imagem sticky */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginTop: -32,
          borderRadius: '24px 24px 0 0',
          background: K.bg,
          padding: '24px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          minHeight: '60vh',
        }}>
          {/* Puxador visual */}
          <div style={{
            width: 40, height: 4, borderRadius: 2,
            background: K.border,
            alignSelf: 'center',
            marginBottom: 8,
            flexShrink: 0,
          }} />

          {/* Nome + preço */}
          <div style={{ background: K.surface, borderRadius: 20, padding: '20px', boxShadow: K.shadow }}>
            <h2 style={{
              fontFamily: "'Figtree', sans-serif",
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
              fontFamily: "'Figtree', sans-serif",
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <SteakIcon size={20} color={K.brand} strokeWidth={1.75} />
                <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, fontWeight: 700, color: K.text, margin: 0 }}>
                  Ponto da carne
                </p>
              </div>
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
                      <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                        <MeatSliceIcon size={28} crustColor={opt.crustColor} innerColor={opt.innerColor} />
                      </div>
                      <p style={{
                        fontFamily: "'Figtree', sans-serif",
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <SparkleIcon size={18} color={K.brand} strokeWidth={1.75} />
                <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, fontWeight: 700, color: K.text, margin: 0 }}>
                  {group.name}
                </p>
              </div>
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
                          fontFamily: "'Figtree', sans-serif",
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

          {/* Gelo — bebidas */}
          {isDrink && (
            <div style={{ background: K.surface, borderRadius: 20, padding: '20px', boxShadow: K.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>🧊</span>
                <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, fontWeight: 700, color: K.text, margin: 0 }}>
                  Gelo
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ICE_OPTIONS.map((opt) => {
                  const active = iceOption === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setIceOption(opt.value)}
                      className="touch-press"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderRadius: 14,
                        border: `2px solid ${active ? K.brand : K.border}`,
                        background: active ? K.brandLight : K.bg,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                        <span style={{ fontSize: 14, color: K.text, fontWeight: 500 }}>{opt.label}</span>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: 10,
                        background: active ? K.brand : 'transparent',
                        border: `2px solid ${active ? K.brand : K.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease', flexShrink: 0,
                      }}>
                        {active && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#FFF' }} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Observações */}
          <div style={{ background: K.surface, borderRadius: 20, padding: '20px', boxShadow: K.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <PencilIcon size={18} color={K.brand} strokeWidth={1.75} />
              <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, fontWeight: 700, color: K.text, margin: 0 }}>
                Observações <span style={{ fontWeight: 400, color: K.muted, fontSize: 13 }}>(opcional)</span>
              </p>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              placeholder={isDrink ? 'Ex: sem açúcar, bem gelado...' : 'Ex: sem cebola, sem tomate...'}
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
      </div>

      {/* Footer fixo */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 16px',
        background: K.surface,
        borderTop: `1px solid ${K.border}`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        zIndex: 10,
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
              <MinusIcon size={16} color={K.text} strokeWidth={2.5} />
            </button>
            <span style={{
              fontFamily: "'Figtree', sans-serif",
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
              <PlusIcon size={16} color={K.text} strokeWidth={2.5} />
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
            <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: 16, fontWeight: 700, color: '#FFF' }}>
              Adicionar
            </span>
            <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: 16, fontWeight: 700, color: '#FFF', fontVariantNumeric: 'tabular-nums' }}>
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
