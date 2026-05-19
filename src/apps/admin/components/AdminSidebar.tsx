import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, Tag, Settings, ArrowLeft } from 'lucide-react'
import { useQioskStore } from '../../../store'

const NAV = [
  { path: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard'   },
  { path: '/admin/menu',       icon: UtensilsCrossed,  label: 'Cardápio'    },
  { path: '/admin/categories', icon: Tag,              label: 'Categorias'  },
  { path: '/admin/settings',   icon: Settings,         label: 'Config.'     },
]

export default function AdminSidebar() {
  const navigate    = useNavigate()
  const { pathname } = useLocation()
  const storeName   = useQioskStore((s) => s.settings.name)

  return (
    <aside style={{
      width: 210,
      minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
        }}>
          <span style={{ color: '#FF6B2B' }}>QI</span>
          <span style={{ color: '#1C1C1E' }}>OSK</span>
        </span>
        <p style={{
          fontSize: 12, color: '#A0A0A0', marginTop: 3,
          fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {storeName || 'Painel Admin'}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ path, icon: Icon, label }) => {
          const active = pathname.startsWith(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="touch-press"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                background: active ? '#FFF0E6' : 'transparent',
                border: 'none',
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F4F3F0' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon
                size={18}
                color={active ? '#FF6B2B' : '#9CA3AF'}
                strokeWidth={active ? 2 : 1.75}
              />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: active ? '#FF6B2B' : '#6B6B6B',
              }}>
                {label}
              </span>
              {active && (
                <div style={{
                  marginLeft: 'auto',
                  width: 6, height: 6, borderRadius: 3,
                  background: '#FF6B2B',
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Sair */}
      <div style={{ padding: '10px 10px 16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <button
          onClick={() => navigate('/')}
          className="touch-press"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 12, width: '100%',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F4F3F0' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <ArrowLeft size={16} color='#9CA3AF' />
          <span style={{ fontSize: 13, color: '#9CA3AF', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}>
            Sair
          </span>
        </button>
      </div>
    </aside>
  )
}
