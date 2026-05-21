'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { PixIcon, CloseIcon, CheckIcon } from '../components/QioskIcons'
import { useCartStore, useQioskStore } from '../../../store'
import { generatePixPayload } from '../../../lib/pix'
import { K } from '../theme'

const PIX_TIMEOUT_SECONDS = 300

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export default function PixScreen() {
  const router           = useRouter()
  const [seconds, setSeconds] = useState(PIX_TIMEOUT_SECONDS)
  const totalPrice       = useCartStore((s) => s.totalPrice())
  const setPaymentMethod = useCartStore((s) => s.setPaymentMethod)
  const settings         = useQioskStore((s) => s.settings)

  useEffect(() => {
    if (seconds <= 0) { router.push('/kiosk/payment'); return }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds, router])

  const pixPayload = useMemo(() => {
    if (!settings.pixKey) return null
    return generatePixPayload({
      pixKey:       settings.pixKey,
      merchantName: settings.name || 'QIOSK',
      merchantCity: settings.pixCity,
      amount:       totalPrice,
    })
  }, [settings.pixKey, settings.name, settings.pixCity, totalPrice])

  const progress   = (seconds / PIX_TIMEOUT_SECONDS) * 100
  const isExpiring = seconds < 60

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: K.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 60,
        background: K.surface, borderBottom: `1px solid ${K.border}`,
        boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PixIcon size={18} color={K.brand} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: K.text }}>
            Pagamento PIX
          </span>
        </div>
        <button
          onClick={() => router.push('/kiosk/payment')}
          className="touch-press"
          style={{ width: 44, height: 44, borderRadius: 12, background: K.bg, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <CloseIcon size={20} color={K.sub} strokeWidth={2} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 16px', gap: 24 }}>
        {/* Instrução */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: K.text, margin: 0 }}>
            Escaneie o QR Code
          </h2>
          <p style={{ fontSize: 13, color: K.sub, marginTop: 6 }}>
            Abra seu banco e aponte a câmera
          </p>
        </div>

        {/* QR Card */}
        <div style={{
          background: K.surface, borderRadius: 24, padding: 20,
          boxShadow: K.shadowMd,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          {/* QR Code real ou aviso de configuração */}
          {pixPayload ? (
            <div style={{ padding: 8, background: '#FFF', borderRadius: 12 }}>
              <QRCodeSVG
                value={pixPayload}
                size={220}
                bgColor="#FFFFFF"
                fgColor="#1C1C1E"
                level="M"
              />
            </div>
          ) : (
            <div style={{
              width: 220, height: 220, borderRadius: 12,
              background: K.surfaceMuted,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 10, padding: 16,
            }}>
              <PixIcon size={36} color={K.muted} />
              <p style={{ fontSize: 13, color: K.muted, textAlign: 'center', lineHeight: 1.4 }}>
                Configure a chave PIX nas definições do painel admin
              </p>
            </div>
          )}

          {/* Valor */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: K.sub }}>Total a pagar</p>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 28, fontWeight: 800, color: K.text,
              fontVariantNumeric: 'tabular-nums', marginTop: 2,
            }}>
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Timer */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: K.muted }}>Expira em</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                color: isExpiring ? K.danger : K.sub,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatTime(seconds)}
              </span>
            </div>
            <div style={{ height: 6, background: K.bg, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3, width: `${progress}%`,
                background: isExpiring ? K.danger : K.brand,
                transition: 'width 1s linear, background 0.3s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Chave PIX */}
        {settings.pixKey && (
          <p style={{ fontSize: 12, color: K.muted, textAlign: 'center' }}>
            Chave PIX: {settings.pixKey}
          </p>
        )}

        {/* Botão confirmar */}
        <button
          onClick={() => { setPaymentMethod('pix'); router.push('/kiosk/confirmation') }}
          className="touch-press"
          style={{
            width: '100%', height: 54, borderRadius: 16,
            background: '#22C55E', border: 'none',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 17, fontWeight: 700, color: '#FFF',
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(34,197,94,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <CheckIcon size={20} color="#FFF" strokeWidth={2.5} />
          Já paguei
        </button>
      </div>
    </div>
  )
}
