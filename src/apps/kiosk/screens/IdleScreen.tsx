import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../../store'

export default function IdleScreen() {
  const navigate = useNavigate()
  const clearCart = useCartStore((s) => s.clear)
  const [visible, setVisible] = useState(false)

  useEffect(() => { clearCart() }, [clearCart])
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])

  return (
    <div
      className="w-full min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-between cursor-pointer select-none py-16 px-6"
      onClick={() => navigate('/kiosk/categories')}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
      {/* Topo: logo */}
      <div className="flex flex-col items-center gap-2">
        <h1
          className="text-6xl font-bold tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span style={{ color: '#FF6B2B' }}>QI</span>
          <span style={{ color: '#FFFFFF' }}>OSK</span>
        </h1>
        <p className="text-sm tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Autoatendimento inteligente
        </p>
      </div>

      {/* Centro: CTA principal */}
      <div className="flex flex-col items-center gap-8">
        {/* Anel pulsante */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full"
            style={{
              width: 160, height: 160,
              background: 'rgba(255,107,43,0.06)',
              animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{ width: 120, height: 120, background: 'rgba(255,107,43,0.08)' }}
          />
          <div
            className="relative rounded-full flex items-center justify-center"
            style={{ width: 88, height: 88, background: 'rgba(255,107,43,0.15)', border: '1.5px solid rgba(255,107,43,0.4)' }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 8v20M8 18h20" stroke="#FF6B2B" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="text-center flex flex-col gap-2">
          <p
            className="text-3xl font-bold"
            style={{ color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Toque para começar
          </p>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Monte seu pedido em segundos
          </p>
        </div>
      </div>

      {/* Rodapé: formas de pagamento */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Formas de pagamento
        </p>
        <div className="flex items-center gap-2">
          {['PIX', 'Crédito', 'Débito', 'Dinheiro'].map((m) => (
            <span
              key={m}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
