'use client'
import type { ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PixIcon, CardPayIcon, CashIcon, type IconProps } from '../components/QioskIcons'
import { useCartStore, useQioskStore } from '../../../store'
import type { PaymentMethod } from '../../../types'
import { K } from '../theme'

const RETURN_SECONDS = 12

type QioskIcon = (props: IconProps) => ReactElement

const PAYMENT_INFO: Record<PaymentMethod, { label: string; Icon: QioskIcon; color: string }> = {
  pix:  { label: 'PIX confirmado',       Icon: PixIcon,     color: '#22C55E' },
  card: { label: 'Pague na maquininha',  Icon: CardPayIcon, color: K.brand   },
  cash: { label: 'Pague no caixa',       Icon: CashIcon,    color: K.brand   },
}

export default function ConfirmationScreen() {
  const router  = useRouter()
  const storedPaymentMethod = useCartStore((s) => s.paymentMethod)
  const paymentMethod = (storedPaymentMethod ?? 'cash') as PaymentMethod

  const { items, clear }     = useCartStore()
  const { addOrder, settings } = useQioskStore()

  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [countdown,   setCountdown]   = useState(RETURN_SECONDS)
  const [show,        setShow]        = useState(false)
  const created = useRef(false)

  useEffect(() => {
    if (created.current) return
    created.current = true
    if (items.length === 0) { router.push('/kiosk/idle'); return }
    const order = addOrder(items, paymentMethod)
    clear()
    setTimeout(() => { setOrderNumber(order.number); setShow(true) }, 120)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (countdown <= 0) { router.push('/kiosk/idle'); return }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, router])

  const { label: payLabel, Icon: PayIcon, color: payColor } = PAYMENT_INFO[paymentMethod]

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: K.bg,
      display: 'flex', flexDirection: 'column',
      opacity: show ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>

      {/* Hero verde */}
      <div style={{
        background: '#F0FFF6',
        padding: '48px 24px 36px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 20,
      }}>
        {/* Check animado */}
        <div style={{
          width: 88, height: 88, borderRadius: 44,
          background: '#DCFCE7',
          border: '3px solid #22C55E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: show ? 'scale(1)' : 'scale(0.4)',
          transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s',
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M10 20L17 27L30 13" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: 26, fontWeight: 800, color: K.text,
            margin: 0, lineHeight: 1.1,
          }}>
            Pedido confirmado!
          </h2>
          <p style={{ fontSize: 14, color: K.sub, marginTop: 8 }}>
            Vamos preparar com muito carinho
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Número do pedido */}
        <div style={{
          background: K.surface,
          borderRadius: 20,
          padding: '24px',
          boxShadow: K.shadow,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: K.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Seu número
          </p>
          <p style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: 80, fontWeight: 800, color: K.text,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            #{orderNumber ?? '—'}
          </p>
          <p style={{ fontSize: 13, color: K.sub, marginTop: 8 }}>
            Fique de olho no painel quando chamarem seu número
          </p>
        </div>

        {/* Tempo estimado */}
        <div style={{
          background: K.brandLight,
          borderRadius: 20,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 13, color: K.sub, margin: 0 }}>Tempo estimado</p>
            <p style={{ fontSize: 12, color: K.muted, marginTop: 2 }}>pode variar conforme a fila</p>
          </div>
          <p style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: 32, fontWeight: 800, color: K.brandDeep,
            fontVariantNumeric: 'tabular-nums',
          }}>
            ~{settings.estimatedMinutes}min
          </p>
        </div>

        {/* Pagamento */}
        <div style={{
          background: K.surface,
          borderRadius: 20,
          padding: '16px 20px',
          boxShadow: K.shadow,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: payColor === '#22C55E' ? 'rgba(34,197,94,0.1)' : K.brandLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <PayIcon size={22} color={payColor} strokeWidth={1.75} />
          </div>
          <div>
            <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 15, fontWeight: 600, color: K.text, margin: 0 }}>
              {payLabel}
            </p>
            {(paymentMethod === 'card' || paymentMethod === 'cash') && (
              <p style={{ fontSize: 12, color: K.sub, marginTop: 2 }}>
                Dirija-se ao atendente para finalizar
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer countdown */}
      <div style={{
        padding: '16px 16px 24px',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <p style={{ fontSize: 12, color: K.muted }}>
          Voltando ao início em {countdown}s
        </p>
        <button
          onClick={() => router.push('/kiosk/idle')}
          className="touch-press"
          style={{
            padding: '12px 32px', borderRadius: 14,
            background: K.surface,
            border: `1.5px solid ${K.border}`,
            fontSize: 14, fontWeight: 600, color: K.sub,
            cursor: 'pointer',
            fontFamily: "'Figtree', sans-serif",
          }}
        >
          Novo pedido
        </button>
      </div>
    </div>
  )
}
