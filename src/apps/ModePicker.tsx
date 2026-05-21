'use client'
import { useRouter } from 'next/navigation'
import { Monitor, ChefHat, LayoutDashboard, ChevronRight } from 'lucide-react'

const modes = [
  {
    path: '/kiosk',
    icon: Monitor,
    label: 'Kiosk',
    sub: 'Tela do cliente',
    tint: '#FFF0E6',
    color: '#FF6B2B',
  },
  {
    path: '/kitchen',
    icon: ChefHat,
    label: 'Cozinha',
    sub: 'Fila de pedidos',
    tint: '#E8F4FF',
    color: '#2E86DE',
  },
  {
    path: '/admin',
    icon: LayoutDashboard,
    label: 'Admin',
    sub: 'Painel de gestão',
    tint: '#F0FFF6',
    color: '#22C55E',
  },
]

export default function ModePicker() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFF8F4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28,
      padding: '32px 20px',
    }}>

      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: 0,
          lineHeight: 1,
          color: '#1C1C1E',
        }}>
          <span style={{ color: '#FF6B2B' }}>QI</span>OSK
        </h1>
        <p style={{
          fontSize: 13,
          color: '#9CA3AF',
          marginTop: 6,
          letterSpacing: '0.05em',
          fontWeight: 500,
        }}>
          Autoatendimento inteligente
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        maxWidth: 360,
      }}>
        {modes.map(({ path, icon: Icon, label, sub, tint, color }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            className="touch-press"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '18px 20px',
              borderRadius: 20,
              background: '#FFFFFF',
              border: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            {/* Ícone */}
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: tint,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={26} color={color} strokeWidth={1.75} />
            </div>

            {/* Texto */}
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: 16, fontWeight: 700,
                color: '#1C1C1E',
                margin: 0,
              }}>
                {label}
              </p>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
                {sub}
              </p>
            </div>

            <ChevronRight size={20} color="#D1D5DB" />
          </button>
        ))}
      </div>

      <p style={{ fontSize: 11, color: '#D1D5DB', letterSpacing: '0.04em' }}>
        QIOSK v0.1 — MVP local
      </p>
    </div>
  )
}
