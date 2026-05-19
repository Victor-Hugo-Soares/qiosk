import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banknote, CreditCard, QrCode } from 'lucide-react'
import KioskHeader from '../components/KioskHeader'
import { useCartStore, useQioskStore } from '../../../store'
import type { PaymentMethod } from '../../../types'

const OPTIONS: { method: PaymentMethod; icon: React.ElementType; label: string; sub: string }[] = [
  { method: 'pix',  icon: QrCode,     label: 'PIX',      sub: 'Pague com QR Code'   },
  { method: 'card', icon: CreditCard, label: 'Cartão',   sub: 'Crédito ou débito'   },
  { method: 'cash', icon: Banknote,   label: 'No caixa', sub: 'Pague ao atendente'  },
]

export default function PaymentScreen() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<PaymentMethod>('pix')
  const totalPrice = useCartStore((s) => s.totalPrice())
  const accepted   = useQioskStore((s) => s.settings.paymentMethods)

  const available = OPTIONS.filter((o) => accepted.includes(o.method))

  const handleConfirm = () =>
    selected === 'pix'
      ? navigate('/kiosk/pix')
      : navigate('/kiosk/confirmation', { state: { paymentMethod: selected } })

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: '#1A1A2E', paddingBottom: 96 }}>
      <KioskHeader showCart={false} />

      <div className="flex-1 flex flex-col px-5 py-6" style={{ gap: 24 }}>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}>
            Como vai pagar?
          </h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Escolha a forma de pagamento
          </p>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{ background: '#16213E', border: '1.5px solid rgba(255,255,255,0.09)' }}>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Total do pedido</span>
          <span className="font-bold text-2xl tabular-nums" style={{ color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}>
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Opções */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {available.map(({ method, icon: Icon, label, sub }) => {
            const active = selected === method
            return (
              <button
                key={method}
                onClick={() => setSelected(method)}
                className="touch-press flex items-center rounded-2xl px-5 text-left"
                style={{
                  height: 76,
                  gap: 16,
                  background: active ? 'rgba(255,107,43,0.08)' : '#16213E',
                  border: `2px solid ${active ? '#FF6B2B' : 'rgba(255,255,255,0.09)'}`,
                  transition: 'all 0.15s ease',
                }}
              >
                <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: 48, height: 48,
                    background: active ? '#FF6B2B' : 'rgba(255,255,255,0.07)',
                    transition: 'background 0.15s ease',
                  }}>
                  <Icon size={22} color={active ? '#FFF' : 'rgba(255,255,255,0.5)'} strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base"
                    style={{ color: active ? '#FFF' : 'rgba(255,255,255,0.75)', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {label}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
                </div>
                <div className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: 20, height: 20,
                    border: `2px solid ${active ? '#FF6B2B' : 'rgba(255,255,255,0.2)'}`,
                  }}>
                  {active && <div style={{ width: 10, height: 10, borderRadius: 5, background: '#FF6B2B' }} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{ background: 'rgba(26,26,46,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
        <button onClick={handleConfirm}
          className="touch-press w-full rounded-xl font-bold text-lg text-white"
          style={{ height: 56, background: '#FF6B2B', fontFamily: "'Space Grotesk', sans-serif" }}>
          Confirmar pagamento
        </button>
      </div>
    </div>
  )
}
