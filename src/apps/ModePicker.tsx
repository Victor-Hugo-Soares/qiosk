import { useNavigate } from 'react-router-dom'
import { Monitor, ChefHat, LayoutDashboard } from 'lucide-react'

const modes = [
  { path: '/kiosk',   icon: Monitor,         label: 'Kiosk',   sub: 'Tela do cliente'  },
  { path: '/kitchen', icon: ChefHat,         label: 'Cozinha', sub: 'Fila de pedidos'  },
  { path: '/admin',   icon: LayoutDashboard, label: 'Admin',   sub: 'Painel de gestão' },
]

export default function ModePicker() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A1A2E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      padding: '24px 20px',
    }}>

      {/* Logo */}
      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 48,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        margin: 0,
        userSelect: 'none',
      }}>
        <span style={{ color: '#FF6B2B' }}>QI</span>
        <span style={{ color: '#FFFFFF' }}>OSK</span>
      </h1>

      {/* Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        maxWidth: 360,
      }}>
        {modes.map(({ path, icon: Icon, label, sub }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="touch-press"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '18px 20px',
              borderRadius: 16,
              background: '#16213E',
              border: '1.5px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FF6B2B')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            {/* Icon container */}
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(255,107,43,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={24} color="#FF6B2B" strokeWidth={1.75} />
            </div>

            {/* Text */}
            <div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 1.2,
              }}>
                {label}
              </p>
              <p style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                margin: '3px 0 0',
              }}>
                {sub}
              </p>
            </div>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', margin: 0 }}>
        QIOSK v0.1 — MVP local
      </p>
    </div>
  )
}
