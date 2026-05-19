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
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center gap-10 p-6">

      {/* Logo */}
      <h1
        className="text-5xl font-bold tracking-tight select-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <span className="text-[#FF6B2B]">QI</span>
        <span className="text-white">OSK</span>
      </h1>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        {modes.map(({ path, icon: Icon, label, sub }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-4 h-44 rounded-2xl border-2 border-white/10 hover:border-[#FF6B2B] bg-[#16213E] transition-all duration-200 touch-press cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#FF6B2B]/10">
              <Icon size={28} className="text-[#FF6B2B]" strokeWidth={1.75} />
            </div>
            <div className="text-center">
              <p
                className="text-lg font-semibold leading-tight text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {label}
              </p>
              <p className="text-xs mt-1 text-white/40">{sub}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-white/20 text-xs">QIOSK v0.1 — MVP local</p>
    </div>
  )
}
