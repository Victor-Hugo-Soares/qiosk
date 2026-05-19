import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCartStore, useQioskStore } from '../../../store'
import type { PaymentMethod } from '../../../types'

const RETURN_SECONDS = 10

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX confirmado',
  card: 'Pague na maquininha',
  cash: 'Pague no caixa',
}

export default function ConfirmationScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const paymentMethod = (location.state?.paymentMethod ?? 'cash') as PaymentMethod

  const { items, clear } = useCartStore()
  const { addOrder, settings }       = useQioskStore()

  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [countdown, setCountdown]     = useState(RETURN_SECONDS)
  const [show, setShow]               = useState(false)
  const created = useRef(false)

  useEffect(() => {
    if (created.current) return
    created.current = true
    if (items.length === 0) { navigate('/kiosk/idle'); return }
    const order = addOrder(items, paymentMethod)
    setOrderNumber(order.number)
    clear()
    setTimeout(() => setShow(true), 120)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (countdown <= 0) { navigate('/kiosk/idle'); return }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, navigate])

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: '#1A1A2E', gap: 28,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Check */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 96, height: 96,
          background: 'rgba(46,204,113,0.12)',
          border: '1.5px solid rgba(46,204,113,0.3)',
          transform: show ? 'scale(1)' : 'scale(0.5)',
          transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M12 22L19 29L32 15" stroke="#2ECC71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Número */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Pedido
        </p>
        <p
          className="font-bold tabular-nums"
          style={{ color: '#FFF', fontFamily: "'Space Grotesk', sans-serif", fontSize: 80, lineHeight: 1 }}
        >
          #{orderNumber ?? '—'}
        </p>
      </div>

      {/* Mensagem */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p className="text-xl font-bold" style={{ color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}>
          Pedido recebido!
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Prepare-se — seu lanche vai ficar incrível.
        </p>
      </div>

      {/* Tempo estimado */}
      <div
        className="flex flex-col items-center rounded-2xl px-10 py-5"
        style={{ background: '#16213E', border: '1.5px solid rgba(255,255,255,0.09)', gap: 6 }}
      >
        <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Tempo estimado
        </p>
        <p className="font-bold text-4xl tabular-nums"
          style={{ color: '#FF6B2B', fontFamily: "'Space Grotesk', sans-serif" }}>
          ~{settings.estimatedMinutes} min
        </p>
      </div>

      {/* Pagamento */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: '#2ECC71' }} />
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {PAYMENT_LABELS[paymentMethod]}
        </span>
      </div>

      {/* Countdown */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Voltando ao início em {countdown}s
        </p>
        <button
          onClick={() => navigate('/kiosk/idle')}
          className="touch-press px-5 py-2 rounded-xl text-sm"
          style={{ border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
        >
          Novo pedido
        </button>
      </div>
    </div>
  )
}
