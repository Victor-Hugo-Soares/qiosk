'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, useQioskStore } from '../../../store'
import { LockIcon } from '../components/QioskIcons'
import { K } from '../theme'
import type { BusinessHours } from '../../../types'

function isWithinBusinessHours(hours: BusinessHours | undefined): boolean {
  if (!hours || hours.length < 7) return true  // sem config → assume aberto
  const now      = new Date()
  const schedule = hours[now.getDay()]
  if (!schedule?.enabled) return false
  const cur = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  return cur >= schedule.open && cur < schedule.close
}

// ─── Tela: Loja Fechada ───────────────────────────────────────
function ClosedScreen({ storeName }: { storeName: string }) {
  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: K.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
      userSelect: 'none',
    }}>
      {/* Ícone */}
      <div style={{
        width: 96, height: 96, borderRadius: 32,
        background: '#FFF0E6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
      }}>
        <LockIcon size={44} color={K.brand} strokeWidth={1.75} />
      </div>

      {/* Texto */}
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <h2 style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: 28, fontWeight: 800, color: K.text,
          margin: 0, lineHeight: 1.2,
        }}>
          Estamos fechados
        </h2>
        <p style={{
          fontSize: 16, color: K.sub,
          marginTop: 12, lineHeight: 1.6,
        }}>
          {storeName
            ? `O ${storeName} não está aceitando pedidos no momento.`
            : 'Não estamos aceitando pedidos no momento.'}
        </p>
        <p style={{ fontSize: 14, color: K.muted, marginTop: 8 }}>
          Volte em breve!
        </p>
      </div>

      {/* Rodapé */}
      <p style={{
        position: 'absolute', bottom: 24,
        fontSize: 11, color: K.muted,
        letterSpacing: '0.06em',
      }}>
        {storeName || 'QIOSK'}
      </p>
    </div>
  )
}

// ─── Tela: Idle normal ────────────────────────────────────────
export default function IdleScreen() {
  const router          = useRouter()
  const clearCart       = useCartStore((s) => s.clear)
  const storeName       = useQioskStore((s) => s.settings.name)
  const acceptingOrders = useQioskStore((s) => s.settings.acceptingOrders)
  const businessHours   = useQioskStore((s) => s.settings.businessHours as BusinessHours | undefined)
  const [visible, setVisible] = useState(false)
  const [tick,    setTick]    = useState(0)
  const isOpen = useMemo(() => isWithinBusinessHours(businessHours), [businessHours, tick])

  useEffect(() => { clearCart() }, [clearCart])
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Re-verifica a cada minuto (sem setState síncrono no effect)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60_000)
    return () => clearInterval(t)
  }, [])

  if (!acceptingOrders || !isOpen) {
    return <ClosedScreen storeName={storeName} />
  }

  return (
    <div
      onClick={() => router.push('/kiosk/categories')}
      style={{
        width: '100%', minHeight: '100vh',
        background: K.bg,
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', userSelect: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
    >
      {/* Hero */}
      <div style={{
        background: K.brandLight,
        padding: '48px 24px 36px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20,
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: 13, fontWeight: 600, color: K.brand,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4,
          }}>
            {storeName ? 'Bem-vindo ao' : ''}
          </p>
          {storeName ? (
            <h1 style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: 40, fontWeight: 800, color: K.text,
              letterSpacing: '-0.02em', lineHeight: 1, margin: 0,
            }}>
              {storeName}
            </h1>
          ) : (
            <h1 style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: 48, fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1, margin: 0,
            }}>
              <span style={{ color: K.brand }}>QI</span>
              <span style={{ color: K.text }}>OSK</span>
            </h1>
          )}
        </div>

        {/* Ilustração burger */}
        <div style={{ position: 'relative', width: 180, height: 160 }}>
          <div style={{
            position: 'absolute', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: 160, height: 20, borderRadius: '50%',
            background: 'rgba(255,107,43,0.15)',
          }} />
          <svg width="160" height="150" viewBox="0 0 160 150" fill="none" style={{ display: 'block', margin: '0 auto' }}>
            <ellipse cx="80" cy="140" rx="55" ry="8" fill="rgba(0,0,0,0.08)" />
            <ellipse cx="80" cy="58" rx="55" ry="34" fill="#D4873E" />
            <ellipse cx="80" cy="50" rx="52" ry="30" fill="#E8963F" />
            <ellipse cx="80" cy="46" rx="50" ry="28" fill="#F5A44A" />
            <circle cx="65" cy="36" r="4" fill="#C8830A" opacity="0.7" />
            <circle cx="80" cy="32" r="3.5" fill="#C8830A" opacity="0.7" />
            <circle cx="94" cy="37" r="4" fill="#C8830A" opacity="0.7" />
            <circle cx="72" cy="44" r="3" fill="#C8830A" opacity="0.5" />
            <circle cx="87" cy="43" r="3" fill="#C8830A" opacity="0.5" />
            <path d="M24 88 Q40 78 56 86 Q72 78 88 86 Q104 78 120 86 Q136 78 136 88" stroke="#5A9A3E" strokeWidth="8" strokeLinecap="round" fill="none" />
            <rect x="22" y="90" width="116" height="14" rx="4" fill="#F5C842" />
            <rect x="18" y="100" width="124" height="22" rx="6" fill="#8B4513" />
            <rect x="20" y="102" width="120" height="18" rx="5" fill="#A0522D" />
            <ellipse cx="80" cy="126" rx="62" ry="18" fill="#E8963F" />
            <ellipse cx="80" cy="130" rx="60" ry="14" fill="#F5A44A" />
          </svg>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', gap: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: 26, fontWeight: 700, color: K.text,
            margin: 0, lineHeight: 1.2,
          }}>
            Monte o seu pedido
          </h2>
          <p style={{ fontSize: 15, color: K.sub, marginTop: 8 }}>
            Rápido, fácil e sem fila
          </p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: K.brand, borderRadius: 20,
          padding: '18px 40px',
          boxShadow: '0 8px 24px rgba(255,107,43,0.35)',
        }}>
          <span style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: 18, fontWeight: 700, color: '#FFF',
          }}>
            Toque para começar
          </span>
        </div>
      </div>

      {/* Rodapé pagamentos */}
      <div style={{
        padding: '20px 24px',
        borderTop: `1px solid ${K.border}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 10,
      }}>
        <p style={{ fontSize: 11, color: K.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Formas de pagamento
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {['PIX', 'Crédito', 'Débito', 'Dinheiro'].map((m) => (
            <span key={m} style={{
              padding: '5px 12px', borderRadius: 20,
              fontSize: 12, fontWeight: 500, color: K.sub,
              background: K.surface, border: `1px solid ${K.border}`,
            }}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
