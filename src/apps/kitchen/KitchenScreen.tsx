import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, CheckCheck, ChefHat, Clock } from 'lucide-react'
import { useQioskStore } from '../../store'
import { useOrders } from '../../hooks/useOrders'
import type { Order, OrderStatus } from '../../types'

// ─── Tokens ───────────────────────────────────────────────────
const C = {
  bg:       '#F4F3F0',
  surface:  '#FFFFFF',
  border:   'rgba(0,0,0,0.07)',
  text:     '#1C1C1E',
  sub:      '#6B6B6B',
  muted:    '#A0A0A0',
  brand:    '#FF6B2B',
  success:  '#22C55E',
  warning:  '#F59E0B',
  danger:   '#EF4444',
}

// ─── Helpers ──────────────────────────────────────────────────
function elapsedMinutes(createdAt: string) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)
}

function elapsedLabel(min: number) {
  if (min < 1) return '< 1 min'
  return `${min} min`
}

function elapsedColor(min: number, estimated: number) {
  if (min < estimated * 0.5) return C.success
  if (min < estimated)       return C.warning
  return C.danger
}

function elapsedBg(min: number, estimated: number) {
  if (min < estimated * 0.5) return '#F0FDF4'
  if (min < estimated)       return '#FFFBEB'
  return '#FEF2F2'
}

function paymentLabel(method: Order['paymentMethod']) {
  return { pix: 'PIX', card: 'Cartão', cash: 'Dinheiro' }[method]
}

// ─── Beep ─────────────────────────────────────────────────────
function beep() {
  try {
    const ctx  = new AudioContext()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch { /* silencia */ }
}

// ─── Colunas config ───────────────────────────────────────────
const COLUMNS: { status: OrderStatus; label: string; emoji: string; accent: string; colBg: string }[] = [
  { status: 'pending',   label: 'Aguardando', emoji: '🕐', accent: C.warning, colBg: '#FFFDF5' },
  { status: 'preparing', label: 'Em preparo',  emoji: '🔥', accent: C.brand,   colBg: '#FFF9F6' },
  { status: 'ready',     label: 'Pronto',      emoji: '✅', accent: C.success, colBg: '#F6FFF8' },
]

// ─── Card de pedido ───────────────────────────────────────────
function OrderCard({
  order,
  estimated,
  onAdvance,
}: {
  order: Order
  estimated: number
  onAdvance: (id: string, next: OrderStatus) => void
}) {
  const min    = elapsedMinutes(order.createdAt)
  const color  = elapsedColor(min, estimated)
  const timeBg = elapsedBg(min, estimated)

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    pending:   'preparing',
    preparing: 'ready',
    ready:     'delivered',
    delivered: null,
  }
  const btnConfig: Record<OrderStatus, { label: string; bg: string; color: string }> = {
    pending:   { label: 'Iniciar preparo',  bg: C.brand,   color: '#FFF'     },
    preparing: { label: 'Marcar pronto',    bg: C.success, color: '#FFF'     },
    ready:     { label: '✓ Entregue',       bg: '#F0FDF4', color: C.success  },
    delivered: { label: '',                 bg: '',        color: ''          },
  }

  const next = nextStatus[order.status]
  const btn  = btnConfig[order.status]

  return (
    <div style={{
      background: C.surface,
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      borderLeft: `4px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Cabeçalho do card */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px 10px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Número + pagamento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 26, fontWeight: 800, color: C.text,
            lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          }}>
            #{order.number}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: C.sub,
            background: C.bg,
            padding: '2px 8px',
            borderRadius: 20,
            border: `1px solid ${C.border}`,
          }}>
            {paymentLabel(order.paymentMethod)}
          </span>
        </div>

        {/* Tempo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: timeBg,
          padding: '4px 10px',
          borderRadius: 20,
          border: `1px solid ${color}30`,
        }}>
          <Clock size={12} color={color} strokeWidth={2.5} />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13, fontWeight: 700, color,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {elapsedLabel(min)}
          </span>
        </div>
      </div>

      {/* Itens */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13, fontWeight: 800,
                color: C.brand,
                background: '#FFF0E6',
                borderRadius: 6,
                padding: '1px 7px',
                flexShrink: 0,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {item.quantity}×
              </span>
              <span style={{
                fontSize: 14, fontWeight: 600, color: C.text,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {item.productName}
              </span>
            </div>

            {/* Customizações */}
            {item.doneness && (
              <p style={{ fontSize: 12, color: C.sub, paddingLeft: 36, margin: 0 }}>
                → {item.doneness}
              </p>
            )}
            {item.selectedExtras.map((ex) => (
              <p key={ex.extraId} style={{ fontSize: 12, color: C.sub, paddingLeft: 36, margin: 0 }}>
                + {ex.extraName}
              </p>
            ))}
            {item.notes && (
              <p style={{ fontSize: 12, color: C.muted, paddingLeft: 36, fontStyle: 'italic', margin: 0 }}>
                "{item.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Botão */}
      {next && (
        <div style={{ padding: '0 14px 14px' }}>
          <button
            onClick={() => onAdvance(order.id, next)}
            className="touch-press"
            style={{
              width: '100%', height: 44,
              borderRadius: 12,
              background: btn.bg,
              border: next === 'delivered' ? `1.5px solid ${C.success}` : 'none',
              color: btn.color,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: next === 'delivered' ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {next === 'delivered' && <CheckCheck size={16} />}
            {btn.label}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Tela principal ───────────────────────────────────────────
export default function KitchenScreen() {
  const orders              = useOrders(1)   // pedidos de hoje via Firestore
  const updateOrderStatus   = useQioskStore((s) => s.updateOrderStatus)
  const settings            = useQioskStore((s) => s.settings)
  const setEstimatedMinutes = useQioskStore((s) => s.setEstimatedMinutes)
  const storeName           = useQioskStore((s) => s.settings.name)

  const [, forceRender] = useState(0)
  const [now, setNow]   = useState(new Date())
  const prevCountRef    = useRef(0)

  useEffect(() => {
    const t = setInterval(() => { setNow(new Date()); forceRender((n) => n + 1) }, 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const pending = orders.filter((o) => o.status === 'pending').length
    if (prevCountRef.current > 0 && pending > prevCountRef.current) beep()
    prevCountRef.current = pending
  }, [orders])

  const handleAdvance = (id: string, next: OrderStatus) => updateOrderStatus(id, next)

  const todayOrders  = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString())
  const countByStatus = (s: OrderStatus) => todayOrders.filter((o) => o.status === s).length

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: C.bg,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        flexShrink: 0, gap: 16,
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: '#FFF0E6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChefHat size={22} color={C.brand} strokeWidth={1.75} />
          </div>
          <div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 16, fontWeight: 700, color: C.text, margin: 0, lineHeight: 1,
            }}>
              {storeName || 'QIOSK'} <span style={{ color: C.muted, fontWeight: 500 }}>· Cozinha</span>
            </p>
            <p style={{ fontSize: 11, color: C.muted, margin: '3px 0 0' }}>
              {now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </p>
          </div>
        </div>

        {/* Contadores de status */}
        <div style={{ display: 'flex', gap: 10 }}>
          {COLUMNS.map((col) => (
            <div key={col.status} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: col.colBg,
              borderRadius: 12, padding: '6px 18px',
              border: `1px solid ${col.accent}25`,
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 22, fontWeight: 800,
                color: col.accent,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}>
                {countByStatus(col.status)}
              </span>
              <span style={{ fontSize: 10, color: C.muted, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {col.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tempo estimado + relógio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Editor tempo estimado */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <p style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
              Tempo estimado
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: C.bg, borderRadius: 12, padding: '4px',
              border: `1px solid ${C.border}`,
            }}>
              <button
                onClick={() => setEstimatedMinutes(Math.max(1, settings.estimatedMinutes - 1))}
                className="touch-press"
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: C.surface, border: `1px solid ${C.border}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Minus size={14} color={C.sub} />
              </button>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 16, fontWeight: 700, color: C.brand,
                width: 54, textAlign: 'center',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {settings.estimatedMinutes} min
              </span>
              <button
                onClick={() => setEstimatedMinutes(settings.estimatedMinutes + 1)}
                className="touch-press"
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: C.surface, border: `1px solid ${C.border}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Plus size={14} color={C.sub} />
              </button>
            </div>
          </div>

          {/* Relógio */}
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24, fontWeight: 800, color: C.text,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em', margin: 0, lineHeight: 1,
            }}>
              {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </header>

      {/* ── Colunas kanban ─────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        overflow: 'hidden',
      }}>
        {COLUMNS.map((col, idx) => {
          const colOrders = todayOrders.filter((o) => o.status === col.status)

          return (
            <div key={col.status} style={{
              display: 'flex', flexDirection: 'column',
              borderRight: idx < 2 ? `1px solid ${C.border}` : 'none',
              background: col.colBg,
              overflow: 'hidden',
            }}>
              {/* Cabeçalho da coluna */}
              <div style={{
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: `1px solid ${C.border}`,
                background: C.surface,
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{col.emoji}</span>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13, fontWeight: 700, color: C.text,
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    {col.label}
                  </span>
                </div>
                {colOrders.length > 0 && (
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13, fontWeight: 700,
                    color: col.accent,
                    background: `${col.accent}18`,
                    padding: '2px 10px', borderRadius: 20,
                  }}>
                    {colOrders.length}
                  </span>
                )}
              </div>

              {/* Cards */}
              <div
                className="no-scrollbar"
                style={{
                  flex: 1, overflowY: 'auto',
                  padding: '14px 12px',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                {colOrders.length === 0 ? (
                  <div style={{
                    flex: 1,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 8, paddingTop: 48,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 22,
                      background: 'rgba(0,0,0,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20,
                    }}>
                      {col.emoji}
                    </div>
                    <p style={{ fontSize: 13, color: C.muted, textAlign: 'center' }}>
                      Nenhum pedido
                    </p>
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      estimated={settings.estimatedMinutes}
                      onAdvance={handleAdvance}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div style={{
        padding: '10px 24px',
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 24,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: C.muted }}>Hoje</span>
        <span style={{ fontSize: 12, color: C.sub }}>
          <strong style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.text }}>
            {todayOrders.length}
          </strong>{' '}pedidos
        </span>
        <span style={{ fontSize: 12, color: C.sub }}>
          <strong style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.success }}>
            {countByStatus('delivered')}
          </strong>{' '}entregues
        </span>
        <span style={{ fontSize: 12, color: C.sub }}>
          Total:{' '}
          <strong style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.text }}>
            R$ {todayOrders.reduce((sum, o) => sum + o.totalPrice, 0).toFixed(2).replace('.', ',')}
          </strong>
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C.muted }}>
          ● Ao vivo
        </span>
      </div>
    </div>
  )
}
