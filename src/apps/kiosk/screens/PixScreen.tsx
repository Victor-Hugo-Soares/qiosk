import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCartStore } from '../../../store'
import { K } from '../theme'

const PIX_TIMEOUT_SECONDS = 300

function FakeQrCode({ size = 200 }: { size?: number }) {
  const cells = 21
  const cell  = size / cells

  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)
      if (inFinder) {
        if (r >= cells - 8) {
          const lr = r - (cells - 8), lc = c
          return (lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4))
        }
        const br = r < 8 ? r : r - (cells - 8)
        const bc = c < 8 ? c : c - (cells - 8)
        return (br === 0 || br === 6 || bc === 0 || bc === 6 || (br >= 2 && br <= 4 && bc >= 2 && bc <= 4))
      }
      if (r === 6 || c === 6) return (r + c) % 2 === 0
      return ((r * 7 + c * 13 + r * c) % 5) < 2
    })
  )

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="12" />
      {pattern.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect key={`${r}-${c}`} x={c * cell + 0.5} y={r * cell + 0.5} width={cell - 0.5} height={cell - 0.5} fill={K.text} rx="0.5" />
          ) : null
        )
      )}
    </svg>
  )
}

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export default function PixScreen() {
  const navigate   = useNavigate()
  const [seconds, setSeconds] = useState(PIX_TIMEOUT_SECONDS)
  const totalPrice = useCartStore((s) => s.totalPrice())

  useEffect(() => {
    if (seconds <= 0) { navigate('/kiosk/payment'); return }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds, navigate])

  const progress = (seconds / PIX_TIMEOUT_SECONDS) * 100
  const isExpiring = seconds < 60

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: K.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Header simples */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 60,
        background: K.surface,
        borderBottom: `1px solid ${K.border}`,
        boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: K.text }}>
          Pagamento PIX ⚡
        </span>
        <button
          onClick={() => navigate('/kiosk/payment')}
          className="touch-press"
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: K.bg, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={20} color={K.sub} />
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
          background: K.surface,
          borderRadius: 24,
          padding: 20,
          boxShadow: K.shadowMd,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <FakeQrCode size={220} />

          {/* Valor */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: K.sub }}>Total a pagar</p>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 28, fontWeight: 800, color: K.text,
              fontVariantNumeric: 'tabular-nums',
              marginTop: 2,
            }}>
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Timer */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: K.muted }}>Expira em</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                color: isExpiring ? K.danger : K.sub,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatTime(seconds)}
              </span>
            </div>
            <div style={{ height: 6, background: K.bg, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${progress}%`,
                background: isExpiring ? K.danger : K.brand,
                transition: 'width 1s linear, background 0.3s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Chave PIX */}
        <p style={{ fontSize: 12, color: K.muted }}>
          Chave PIX: qiosk@burguer.com.br
        </p>

        {/* Botão confirmar */}
        <button
          onClick={() => navigate('/kiosk/confirmation', { state: { paymentMethod: 'pix' } })}
          className="touch-press"
          style={{
            width: '100%',
            height: 54, borderRadius: 16,
            background: '#22C55E', border: 'none',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 17, fontWeight: 700, color: '#FFF',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(34,197,94,0.28)',
          }}
        >
          ✓ Já paguei
        </button>
      </div>
    </div>
  )
}
