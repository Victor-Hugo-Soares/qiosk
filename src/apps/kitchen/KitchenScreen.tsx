import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, CheckCheck, ChefHat, Clock } from 'lucide-react'
import { useQioskStore } from '../../store'
import type { Order, OrderStatus } from '../../types'

// ─── Design tokens ────────────────────────────────────────────
const C = {
  bg:       '#111827',
  surface:  '#1A1A2E',
  card:     '#16213E',
  border:   'rgba(255,255,255,0.07)',
  text:     '#FFFFFF',
  sub:      'rgba(255,255,255,0.55)',
  muted:    'rgba(255,255,255,0.30)',
  brand:    '#FF6B2B',
  success:  '#2ECC71',
  warning:  '#F59E0B',
  danger:   '#E74C3C',
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

function paymentLabel(method: Order['paymentMethod']) {
  return { pix: 'PIX', card: 'Cartão', cash: 'Dinheiro' }[method]
}

// ─── Beep via Web Audio API ───────────────────────────────────
function beep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch { /* silencia se browser bloquear */ }
}

// ─── Coluna ───────────────────────────────────────────────────
const COLUMNS: { status: OrderStatus; label: string; accent: string }[] = [
  { status: 'pending',   label: 'Aguardando', accent: C.warning  },
  { status: 'preparing', label: 'Em preparo',  accent: C.brand   },
  { status: 'ready',     label: 'Pronto',      accent: C.success },
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
  const min   = elapsedMinutes(order.createdAt)
  const color = elapsedColor(min, estimated)

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    pending:   'preparing',
    preparing: 'ready',
    ready:     'delivered',
    delivered: null,
  }
  const btnLabel: Record<OrderStatus, string> = {
    pending:   'Iniciar preparo',
    preparing: 'Marcar pronto',
    ready:     'Entregue',
    delivered: '',
  }

  const next = nextStatus[order.status]

  return (
    <div
      style={{
        background: C.card,
        border: `1.5px solid ${color}33`,
        borderRadius: 16,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        borderLeft: `4px solid ${color}`,
      }}
    >
      {/* Número + tempo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1,
            }}
          >
            #{order.number}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.07)',
              padding: '2px 7px',
              borderRadius: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {paymentLabel(order.paymentMethod)}
          </span>
        </div>

        {/* Tempo decorrido */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={13} color={color} />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {elapsedLabel(min)}
          </span>
        </div>
      </div>

      {/* Itens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.text,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  padding: '1px 7px',
                  flexShrink: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.quantity}×
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.text,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {item.productName}
              </span>
            </div>

            {/* Customizações */}
            {item.doneness && (
              <p style={{ fontSize: 12, color: C.sub, paddingLeft: 36 }}>
                → {item.doneness}
              </p>
            )}
            {item.selectedExtras.map((ex) => (
              <p key={ex.extraId} style={{ fontSize: 12, color: C.sub, paddingLeft: 36 }}>
                + {ex.extraName}
              </p>
            ))}
            {item.notes && (
              <p style={{ fontSize: 12, color: C.muted, paddingLeft: 36, fontStyle: 'italic' }}>
                "{item.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Divisor */}
      <div style={{ height: 1, background: C.border }} />

      {/* Botão de ação */}
      {next && (
        <button
          onClick={() => onAdvance(order.id, next)}
          className="touch-press w-full"
          style={{
            height: 44,
            borderRadius: 10,
            background: next === 'delivered' ? 'rgba(46,204,113,0.12)' : C.brand,
            border: next === 'delivered' ? `1.5px solid ${C.success}` : 'none',
            color: next === 'delivered' ? C.success : '#FFF',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {next === 'delivered' && <CheckCheck size={16} />}
          {btnLabel[order.status]}
        </button>
      )}

      {order.status === 'delivered' && (
        <p style={{ textAlign: 'center', fontSize: 12, color: C.success, fontWeight: 600 }}>
          ✓ Entregue
        </p>
      )}
    </div>
  )
}

// ─── Tela principal ───────────────────────────────────────────
export default function KitchenScreen() {
  const orders            = useQioskStore((s) => s.orders)
  const updateOrderStatus = useQioskStore((s) => s.updateOrderStatus)
  const settings          = useQioskStore((s) => s.settings)
  const setEstimatedMinutes = useQioskStore((s) => s.setEstimatedMinutes)

  const [, forceRender] = useState(0)
  const [now, setNow]   = useState(new Date())
  const prevCountRef    = useRef(0)

  // Atualiza tempo decorrido a cada 30s
  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date())
      forceRender((n) => n + 1)
    }, 30_000)
    return () => clearInterval(t)
  }, [])

  // Relógio a cada segundo
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1_000)
    return () => clearInterval(t)
  }, [])

  // Beep em novo pedido
  useEffect(() => {
    const pending = orders.filter((o) => o.status === 'pending').length
    if (prevCountRef.current > 0 && pending > prevCountRef.current) beep()
    prevCountRef.current = pending
  }, [orders])

  const handleAdvance = (id: string, next: OrderStatus) => updateOrderStatus(id, next)

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
  )

  const countByStatus = (s: OrderStatus) => todayOrders.filter((o) => o.status === s).length

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
          gap: 16,
        }}
      >
        {/* Logo + ícone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: 'rgba(255,107,43,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChefHat size={20} color={C.brand} strokeWidth={1.75} />
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 20, fontWeight: 700,
              }}
            >
              <span style={{ color: C.brand }}>QI</span>
              <span style={{ color: C.text }}>OSK</span>
            </span>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Cozinha</p>
          </div>
        </div>

        {/* Contadores */}
        <div style={{ display: 'flex', gap: 12 }}>
          {COLUMNS.map((col) => (
            <div
              key={col.status}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 10, padding: '6px 16px',
                border: `1px solid ${C.border}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 20, fontWeight: 700,
                  color: col.accent,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {countByStatus(col.status)}
              </span>
              <span style={{ fontSize: 10, color: C.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {col.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tempo estimado + relógio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Editor de tempo estimado */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <p style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tempo estimado
            </p>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 10, padding: '4px 6px',
                border: `1px solid ${C.border}`,
              }}
            >
              <button
                onClick={() => setEstimatedMinutes(Math.max(1, settings.estimatedMinutes - 1))}
                className="touch-press flex items-center justify-center rounded-lg"
                style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer' }}
              >
                <Minus size={14} color={C.sub} />
              </button>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 16, fontWeight: 700,
                  color: C.brand,
                  width: 52, textAlign: 'center',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {settings.estimatedMinutes} min
              </span>
              <button
                onClick={() => setEstimatedMinutes(settings.estimatedMinutes + 1)}
                className="touch-press flex items-center justify-center rounded-lg"
                style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer' }}
              >
                <Plus size={14} color={C.sub} />
              </button>
            </div>
          </div>

          {/* Relógio */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 22, fontWeight: 700,
                color: C.text,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
              }}
            >
              {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>
              {now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>
      </header>

      {/* ── Colunas ─────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 0,
          overflow: 'hidden',
        }}
      >
        {COLUMNS.map((col, idx) => {
          const colOrders = todayOrders.filter((o) => o.status === col.status)

          return (
            <div
              key={col.status}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRight: idx < 2 ? `1px solid ${C.border}` : 'none',
                overflow: 'hidden',
              }}
            >
              {/* Cabeçalho da coluna */}
              <div
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${C.border}`,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 8, height: 8, borderRadius: 4,
                      background: col.accent,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 14, fontWeight: 700,
                      color: C.text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {col.label}
                  </span>
                </div>
                {colOrders.length > 0 && (
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 12, fontWeight: 700,
                      color: col.accent,
                      background: `${col.accent}18`,
                      padding: '2px 10px',
                      borderRadius: 20,
                    }}
                  >
                    {colOrders.length}
                  </span>
                )}
              </div>

              {/* Cards */}
              <div
                className="no-scrollbar"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {colOrders.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      paddingTop: 48,
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 20,
                        background: 'rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 16, height: 16, borderRadius: 8,
                          border: `2px solid ${C.border}`,
                        }}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: C.muted, textAlign: 'center' }}>
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

      {/* ── Footer: pedidos entregues do dia ─────────────── */}
      <div
        style={{
          padding: '10px 24px',
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, color: C.muted }}>Hoje:</span>
        <span style={{ fontSize: 12, color: C.sub }}>
          <strong style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            {todayOrders.length}
          </strong>{' '}
          pedidos recebidos
        </span>
        <span style={{ fontSize: 12, color: C.sub }}>
          <strong style={{ color: C.success, fontFamily: "'Space Grotesk', sans-serif" }}>
            {countByStatus('delivered')}
          </strong>{' '}
          entregues
        </span>
        <span style={{ fontSize: 12, color: C.sub }}>
          Total:{' '}
          <strong style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            R${' '}
            {todayOrders
              .reduce((sum, o) => sum + o.totalPrice, 0)
              .toFixed(2)
              .replace('.', ',')}
          </strong>
        </span>
      </div>
    </div>
  )
}
