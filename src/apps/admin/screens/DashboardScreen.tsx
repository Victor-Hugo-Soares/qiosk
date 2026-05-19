import { useMemo, useState } from 'react'
import { ShoppingBag, DollarSign, TrendingUp, Star } from 'lucide-react'
import { useQioskStore } from '../../../store'
import type { Order } from '../../../types'

// ─── Tokens ──────────────────────────────────────────────────
const C = {
  bg:      '#F4F3F0',
  surface: '#FFFFFF',
  border:  'rgba(0,0,0,0.07)',
  altRow:  '#FAFAF8',
  text:    '#1C1C1E',
  sub:     '#6B6B6B',
  muted:   '#A0A0A0',
  brand:   '#FF6B2B',
  success: '#22C55E',
  warning: '#F59E0B',
}

type Period = 'day' | 'week' | 'month' | 'year'

// ─── Helpers ─────────────────────────────────────────────────
function filterByPeriod(orders: Order[], period: Period) {
  const now = new Date()
  return orders.filter((o) => {
    const d = new Date(o.createdAt)
    switch (period) {
      case 'day':   return d.toDateString() === now.toDateString()
      case 'week': { const wa = new Date(now); wa.setDate(now.getDate() - 7); return d >= wa }
      case 'month': return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      case 'year':  return d.getFullYear() === now.getFullYear()
    }
  })
}

const totalRevenue = (orders: Order[]) => orders.reduce((s, o) => s + o.totalPrice, 0)
const avgTicket    = (orders: Order[]) => orders.length ? totalRevenue(orders) / orders.length : 0
const totalItems   = (orders: Order[]) => orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0)

// ─── Metric card ─────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, sub, iconColor, iconBg }: {
  icon: React.ElementType; label: string; value: string; sub?: string
  iconColor: string; iconBg: string
}) {
  return (
    <div style={{ background: C.surface, borderRadius: 16, padding: '20px 24px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, color: C.sub }}>{label}</p>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={iconColor} strokeWidth={1.75} />
        </div>
      </div>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: C.text, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 12, color: C.muted }}>{sub}</p>}
    </div>
  )
}

// ─── Gráfico por hora ─────────────────────────────────────────
function HourlyChart({ orders }: { orders: Order[] }) {
  const hours = useMemo(() => {
    const map: Record<number, number> = {}
    for (let h = 6; h <= 23; h++) map[h] = 0
    orders.forEach((o) => {
      const h = new Date(o.createdAt).getHours()
      if (h >= 6) map[h] = (map[h] ?? 0) + 1
    })
    return Object.entries(map).map(([h, c]) => ({ hour: Number(h), count: c }))
  }, [orders])

  const max = Math.max(...hours.map((h) => h.count), 1)
  const now = new Date().getHours()

  return (
    <div style={{ background: C.surface, borderRadius: 16, padding: '20px 24px', border: `1px solid ${C.border}` }}>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 20 }}>
        Pedidos por hora — hoje
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 100 }}>
        {hours.map(({ hour, count }) => (
          <div key={hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
            <div
              title={`${count} pedidos`}
              style={{
                width: '100%', borderRadius: '3px 3px 0 0',
                height: count === 0 ? 3 : `${Math.max((count / max) * 100, 6)}%`,
                background: hour === now ? C.brand : count > 0 ? 'rgba(255,107,43,0.3)' : '#E5E4E0',
                transition: 'height 0.3s ease',
              }}
            />
            {hour % 3 === 0 && (
              <span style={{ fontSize: 9, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{hour}h</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Top produtos ─────────────────────────────────────────────
function TopProducts({ orders }: { orders: Order[] }) {
  const top = useMemo(() => {
    const map: Record<string, { name: string; qty: number }> = {}
    orders.forEach((o) =>
      o.items.forEach((it) => {
        if (!map[it.productId]) map[it.productId] = { name: it.productName, qty: 0 }
        map[it.productId].qty += it.quantity
      })
    )
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5)
  }, [orders])

  if (top.length === 0) return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 13, color: C.muted }}>Nenhum dado ainda</p>
    </div>
  )

  const maxQty = top[0].qty
  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: '20px 24px' }}>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 16 }}>
        Mais vendidos
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {top.map((item, i) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700, color: i === 0 ? C.brand : C.muted, width: 18, textAlign: 'center' }}>
              {i === 0 ? '★' : i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontSize: 12, color: C.sub, fontVariantNumeric: 'tabular-nums' }}>{item.qty}×</span>
              </div>
              <div style={{ height: 4, background: '#E5E4E0', borderRadius: 2 }}>
                <div style={{ height: '100%', borderRadius: 2, background: i === 0 ? C.brand : 'rgba(255,107,43,0.35)', width: `${(item.qty / maxQty) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Pedidos recentes ─────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Aguardando', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  preparing: { label: 'Em preparo', color: '#FF6B2B', bg: 'rgba(255,107,43,0.1)'  },
  ready:     { label: 'Pronto',     color: '#22C55E', bg: 'rgba(34,197,94,0.1)'   },
  delivered: { label: 'Entregue',   color: '#A0A0A0', bg: 'rgba(160,160,160,0.1)' },
}
const PAY_CFG: Record<string, string> = { pix: 'PIX', card: 'Cartão', cash: 'Dinheiro' }

function RecentOrders({ orders }: { orders: Order[] }) {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 15)

  const cols = '60px 1fr 90px 90px 100px 110px'
  const headers = ['Nº', 'Itens', 'Total', 'Pagamento', 'Status', 'Horário']

  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: C.text }}>
          Pedidos recentes
        </p>
      </div>

      {recent.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: C.muted }}>Nenhum pedido no período selecionado</p>
        </div>
      ) : (
        <>
          {/* Cabeçalho */}
          <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '10px 24px', gap: 12, background: C.altRow, borderBottom: `1px solid ${C.border}` }}>
            {headers.map((h) => (
              <p key={h} style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</p>
            ))}
          </div>

          {/* Linhas */}
          {recent.map((order, i) => {
            const st = STATUS_CFG[order.status]
            const time = new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            const date = new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            return (
              <div key={order.id} style={{
                display: 'grid', gridTemplateColumns: cols,
                padding: '12px 24px', gap: 12, alignItems: 'center',
                borderBottom: i < recent.length - 1 ? `1px solid ${C.border}` : 'none',
                background: i % 2 === 0 ? C.surface : C.altRow,
              }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>
                  #{order.number}
                </span>
                <span style={{ fontSize: 13, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {order.items.map((it) => `${it.quantity}× ${it.productName}`).join(', ')}
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: C.text, fontVariantNumeric: 'tabular-nums' }}>
                  R$ {order.totalPrice.toFixed(2).replace('.', ',')}
                </span>
                <span style={{ fontSize: 13, color: C.sub }}>{PAY_CFG[order.paymentMethod]}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: '3px 8px', borderRadius: 20, display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {st.label}
                </span>
                <span style={{ fontSize: 12, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>
                  {time} · {date}
                </span>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

// ─── Tela ────────────────────────────────────────────────────
const PERIODS: { key: Period; label: string }[] = [
  { key: 'day',   label: 'Hoje'   },
  { key: 'week',  label: 'Semana' },
  { key: 'month', label: 'Mês'    },
  { key: 'year',  label: 'Ano'    },
]

export default function DashboardScreen() {
  const allOrders = useQioskStore((s) => s.orders)
  const [period, setPeriod] = useState<Period>('day')

  const orders      = filterByPeriod(allOrders, period)
  const todayOrders = filterByPeriod(allOrders, 'day')
  const openToday   = todayOrders.filter((o) => o.status !== 'delivered').length

  const metrics = [
    {
      icon: ShoppingBag, label: 'Pedidos',
      value: String(orders.length),
      sub: `${openToday} em aberto hoje`,
      iconColor: C.brand, iconBg: 'rgba(255,107,43,0.1)',
    },
    {
      icon: DollarSign, label: 'Faturamento',
      value: `R$ ${totalRevenue(orders).toFixed(2).replace('.', ',')}`,
      sub: `${orders.filter((o) => o.paymentMethod === 'pix').length} via PIX`,
      iconColor: C.success, iconBg: 'rgba(46,204,113,0.1)',
    },
    {
      icon: TrendingUp, label: 'Ticket médio',
      value: `R$ ${avgTicket(orders).toFixed(2).replace('.', ',')}`,
      sub: orders.length ? `${orders.length} pedidos no período` : 'Sem pedidos',
      iconColor: C.warning, iconBg: 'rgba(245,158,11,0.1)',
    },
    {
      icon: Star, label: 'Itens vendidos',
      value: String(totalItems(orders)),
      sub: `${orders.filter((o) => o.paymentMethod === 'card').length} via cartão`,
      iconColor: '#8B5CF6', iconBg: 'rgba(139,92,246,0.1)',
    },
  ]

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: C.text }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Seletor de período */}
        <div style={{ display: 'flex', background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, padding: 4, gap: 2 }}>
          {PERIODS.map((p) => (
            <button key={p.key} onClick={() => setPeriod(p.key)} className="touch-press"
              style={{
                padding: '6px 18px', borderRadius: 8,
                background: period === p.key ? C.brand : 'transparent',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13, fontWeight: 600,
                color: period === p.key ? '#FFF' : C.sub,
                transition: 'all 0.15s ease',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
        {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      {/* Gráfico + top produtos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <HourlyChart orders={todayOrders} />
        <TopProducts orders={todayOrders} />
      </div>

      {/* Tabela */}
      <RecentOrders orders={orders} />
    </div>
  )
}
