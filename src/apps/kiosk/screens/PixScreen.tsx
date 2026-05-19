import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCartStore } from '../../../store'

const PIX_TIMEOUT_SECONDS = 300 // 5 minutos

// QR code visual simulado (padrão estático decorativo)
function FakeQrCode({ size = 200 }: { size?: number }) {
  const cells = 21
  const cell = size / cells
  // Padrão pseudo-aleatório determinístico para parecer um QR
  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      // Finder patterns nos cantos
      const inFinder = (
        (r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)
      )
      if (inFinder) {
        const br = r < 8 ? r : r - (cells - 8)
        const bc = c < 8 ? c : c - (cells - 8)
        if (r >= cells - 8) { // bottom-left finder
          const lr = r - (cells - 8), lc = c
          return (lr === 0 || lr === 6 || lc === 0 || lc === 6 ||
            (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4))
        }
        return (br === 0 || br === 6 || bc === 0 || bc === 6 ||
          (br >= 2 && br <= 4 && bc >= 2 && bc <= 4))
      }
      // Timing patterns
      if (r === 6 || c === 6) return (r + c) % 2 === 0
      // Data area pseudo-random
      return ((r * 7 + c * 13 + r * c) % 5) < 2
    })
  )

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" rx="8" />
      {pattern.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell + 0.5}
              y={r * cell + 0.5}
              width={cell - 0.5}
              height={cell - 0.5}
              fill="#1A1A2E"
              rx="0.5"
            />
          ) : null
        )
      )}
    </svg>
  )
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function PixScreen() {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(PIX_TIMEOUT_SECONDS)
  const totalPrice = useCartStore((s) => s.totalPrice())

  useEffect(() => {
    if (seconds <= 0) {
      navigate('/kiosk/payment')
      return
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds, navigate])

  const progress = (seconds / PIX_TIMEOUT_SECONDS) * 100

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col">
      {/* Header mínimo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="text-[#FF6B2B]">QI</span>
          <span className="text-white">OSK</span>
        </span>
        <button
          onClick={() => navigate('/kiosk/payment')}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center touch-press"
        >
          <X size={18} className="text-white/50" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-7 px-5 py-8">
        {/* Título */}
        <div className="text-center">
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Escaneie o QR Code
          </h2>
          <p className="text-white/40 text-sm mt-1">Abra seu banco e aponte a câmera</p>
        </div>

        {/* QR Code */}
        <div className="p-4 bg-white rounded-2xl shadow-2xl">
          <FakeQrCode size={220} />
        </div>

        {/* Valor */}
        <div className="text-center">
          <p className="text-white/40 text-sm">Total a pagar</p>
          <p
            className="text-white font-bold text-3xl mt-1 tabular-nums"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Timer */}
        <div className="w-full max-w-xs flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/30">Expira em</span>
            <span className={`font-mono font-semibold ${seconds < 60 ? 'text-red-400' : 'text-white/60'}`}>
              {formatTime(seconds)}
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                backgroundColor: seconds < 60 ? '#E74C3C' : '#FF6B2B',
              }}
            />
          </div>
        </div>

        {/* Botão confirmar (simula pagamento confirmado) */}
        <button
          onClick={() => navigate('/kiosk/confirmation', { state: { paymentMethod: 'pix' } })}
          className="w-full max-w-xs h-14 bg-[#2ECC71] hover:bg-[#27AE60] rounded-xl text-white font-bold text-base touch-press transition-colors"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Já paguei ✓
        </button>

        <p className="text-white/20 text-xs text-center">
          Chave PIX: qiosk@burguer.com.br
        </p>
      </div>
    </div>
  )
}
