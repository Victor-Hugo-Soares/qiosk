import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, Settings, ArrowLeft } from 'lucide-react'

const C = {
  bg:      '#1A1A2E',
  active:  'rgba(255,107,43,0.12)',
  brand:   '#FF6B2B',
  text:    '#FFFFFF',
  muted:   'rgba(255,255,255,0.45)',
  border:  'rgba(255,255,255,0.07)',
}

const NAV = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { path: '/admin/menu',      icon: UtensilsCrossed,  label: 'Cardápio'   },
  { path: '/admin/settings',  icon: Settings,         label: 'Config.'    },
]

export default function AdminSidebar() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside
      style={{
        width: 200,
        minHeight: '100vh',
        background: C.bg,
        borderRight: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>
          <span style={{ color: C.brand }}>QI</span>
          <span style={{ color: C.text }}>OSK</span>
        </span>
        <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Painel Admin</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ path, icon: Icon, label }) => {
          const active = pathname.startsWith(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="touch-press"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                background: active ? C.active : 'transparent',
                border: active ? `1px solid rgba(255,107,43,0.25)` : '1px solid transparent',
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} color={active ? C.brand : C.muted} strokeWidth={1.75} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? C.text : C.muted,
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Voltar ao seletor */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={() => navigate('/')}
          className="touch-press"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 10, width: '100%',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} color={C.muted} />
          <span style={{ fontSize: 13, color: C.muted, fontFamily: "'Inter', sans-serif" }}>
            Sair
          </span>
        </button>
      </div>
    </aside>
  )
}
