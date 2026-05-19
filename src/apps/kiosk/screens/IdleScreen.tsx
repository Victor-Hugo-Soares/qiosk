import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore, useQioskStore } from '../../../store'
import { K } from '../theme'

export default function IdleScreen() {
  const navigate   = useNavigate()
  const clearCart  = useCartStore((s) => s.clear)
  const storeName  = useQioskStore((s) => s.settings.name)
  const [visible, setVisible] = useState(false)

  useEffect(() => { clearCart() }, [clearCart])
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      onClick={() => navigate('/kiosk/categories')}
      style={{
        width: '100%',
        minHeight: '100vh',
        background: K.bg,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        userSelect: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
    >
      {/* Hero com ilustração */}
      <div style={{
        background: K.brandLight,
        padding: '48px 24px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: K.brand,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            Bem-vindo ao
          </p>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 40,
            fontWeight: 800,
            color: K.text,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
          }}>
            {storeName || 'QIOSK'}
          </h1>
        </div>

        {/* Ilustração de comida */}
        <div style={{ position: 'relative', width: 180, height: 160 }}>
          {/* Prato de fundo */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: 160, height: 20,
            borderRadius: '50%',
            background: 'rgba(255,107,43,0.15)',
          }} />
          {/* Burger ilustrado */}
          <svg width="160" height="150" viewBox="0 0 160 150" fill="none" style={{ display: 'block', margin: '0 auto' }}>
            {/* Sombra */}
            <ellipse cx="80" cy="140" rx="55" ry="8" fill="rgba(0,0,0,0.08)" />
            {/* Bun superior */}
            <ellipse cx="80" cy="58" rx="55" ry="34" fill="#D4873E" />
            <ellipse cx="80" cy="50" rx="52" ry="30" fill="#E8963F" />
            <ellipse cx="80" cy="46" rx="50" ry="28" fill="#F5A44A" />
            {/* Sesame */}
            <circle cx="65" cy="36" r="4" fill="#C8830A" opacity="0.7" />
            <circle cx="80" cy="32" r="3.5" fill="#C8830A" opacity="0.7" />
            <circle cx="94" cy="37" r="4" fill="#C8830A" opacity="0.7" />
            <circle cx="72" cy="44" r="3" fill="#C8830A" opacity="0.5" />
            <circle cx="87" cy="43" r="3" fill="#C8830A" opacity="0.5" />
            {/* Alface */}
            <path d="M24 88 Q40 78 56 86 Q72 78 88 86 Q104 78 120 86 Q136 78 136 88" stroke="#5A9A3E" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Queijo */}
            <rect x="22" y="90" width="116" height="14" rx="4" fill="#F5C842" />
            {/* Carne */}
            <rect x="18" y="100" width="124" height="22" rx="6" fill="#8B4513" />
            <rect x="20" y="102" width="120" height="18" rx="5" fill="#A0522D" />
            {/* Bun inferior */}
            <ellipse cx="80" cy="126" rx="62" ry="18" fill="#E8963F" />
            <ellipse cx="80" cy="130" rx="60" ry="14" fill="#F5A44A" />
          </svg>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: K.text,
            margin: 0,
            lineHeight: 1.2,
          }}>
            Monte o seu pedido
          </h2>
          <p style={{ fontSize: 15, color: K.sub, marginTop: 8 }}>
            Rápido, fácil e sem fila
          </p>
        </div>

        {/* Botão CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: K.brand,
          borderRadius: 20,
          padding: '18px 40px',
          boxShadow: `0 8px 24px rgba(255,107,43,0.35)`,
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: '#FFF',
          }}>
            Toque para começar
          </span>
        </div>
      </div>

      {/* Rodapé */}
      <div style={{
        padding: '20px 24px',
        borderTop: `1px solid ${K.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}>
        <p style={{ fontSize: 11, color: K.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Formas de pagamento
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {['PIX', 'Crédito', 'Débito', 'Dinheiro'].map((m) => (
            <span key={m} style={{
              padding: '5px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              color: K.sub,
              background: K.surface,
              border: `1px solid ${K.border}`,
            }}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
