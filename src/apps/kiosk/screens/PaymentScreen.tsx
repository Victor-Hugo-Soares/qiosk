import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KioskHeader from '../components/KioskHeader'
import { PixIcon, CardPayIcon, CashIcon, type IconProps } from '../components/QioskIcons'
import { useCartStore, useQioskStore } from '../../../store'
import type { PaymentMethod } from '../../../types'
import { K } from '../theme'

type QioskIcon = (props: IconProps) => React.ReactElement

const OPTIONS: { method: PaymentMethod; Icon: QioskIcon; label: string; sub: string }[] = [
  { method: 'pix',  Icon: PixIcon,     label: 'PIX',      sub: 'Pague com QR Code'  },
  { method: 'card', Icon: CardPayIcon, label: 'Cartão',   sub: 'Crédito ou débito'  },
  { method: 'cash', Icon: CashIcon,    label: 'No caixa', sub: 'Pague ao atendente' },
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
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: K.bg, paddingBottom: 100 }}>
      <KioskHeader showCart={false} />

      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Título */}
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: K.text, margin: 0 }}>
            Como vai pagar?
          </h2>
          <p style={{ fontSize: 13, color: K.sub, marginTop: 4 }}>
            Escolha a forma de pagamento
          </p>
        </div>

        {/* Total destaque */}
        <div style={{
          background: K.brand,
          borderRadius: 20,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 6px 20px rgba(255,107,43,0.28)',
        }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
            Total do pedido
          </span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28, fontWeight: 800, color: '#FFF',
            fontVariantNumeric: 'tabular-nums',
          }}>
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Opções */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {available.map(({ method, Icon, label, sub }) => {
            const active = selected === method
            return (
              <button
                key={method}
                onClick={() => setSelected(method)}
                className="touch-press"
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: 16, padding: '16px 18px',
                  borderRadius: 18,
                  background: active ? K.brandLight : K.surface,
                  border: `2px solid ${active ? K.brand : K.border}`,
                  boxShadow: active ? 'none' : K.shadow,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Ícone */}
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: active ? K.brand : K.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s ease',
                }}>
                  <Icon
                    size={24}
                    color={active ? '#FFF' : K.sub}
                    strokeWidth={1.75}
                  />
                </div>

                {/* Texto */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 16, fontWeight: 700,
                    color: active ? K.brand : K.text,
                    margin: 0,
                  }}>
                    {label}
                  </p>
                  <p style={{ fontSize: 13, color: K.sub, marginTop: 2 }}>{sub}</p>
                </div>

                {/* Radio */}
                <div style={{
                  width: 22, height: 22, borderRadius: 11,
                  border: `2px solid ${active ? K.brand : K.muted}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}>
                  {active && (
                    <div style={{ width: 12, height: 12, borderRadius: 6, background: K.brand }} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 16px',
        background: K.surface,
        borderTop: `1px solid ${K.border}`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}>
        <button
          onClick={handleConfirm}
          className="touch-press"
          style={{
            width: '100%', height: 54,
            borderRadius: 16,
            background: K.brand, border: 'none',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 17, fontWeight: 700, color: '#FFF',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,107,43,0.3)',
          }}
        >
          Confirmar pagamento
        </button>
      </div>
    </div>
  )
}
