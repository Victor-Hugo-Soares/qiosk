import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../../store'

interface Props {
  showBack?: boolean
  showCart?: boolean
  onBack?: () => void
}

export default function KioskHeader({ showBack = true, showCart = true, onBack }: Props) {
  const navigate = useNavigate()
  const totalItems = useCartStore((s) => s.totalItems())

  const handleBack = () => {
    if (onBack) { onBack(); return }
    navigate(-1)
  }

  return (
    <header
      className="w-full flex items-center justify-between px-5 py-4 sticky top-0 z-10"
      style={{
        background: 'rgba(26,26,46,0.96)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Voltar */}
      <div style={{ width: 44 }}>
        {showBack && (
          <button
            onClick={handleBack}
            className="touch-press flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.07)' }}
          >
            <ArrowLeft size={20} color="rgba(255,255,255,0.75)" />
          </button>
        )}
      </div>

      {/* Logo */}
      <span
        className="text-2xl font-bold tracking-tight select-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <span style={{ color: '#FF6B2B' }}>QI</span>
        <span style={{ color: '#FFFFFF' }}>OSK</span>
      </span>

      {/* Carrinho */}
      <div style={{ width: 44 }}>
        {showCart && (
          <button
            onClick={() => navigate('/kiosk/cart')}
            className="touch-press relative flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.07)' }}
          >
            <ShoppingBag size={20} color="rgba(255,255,255,0.75)" />
            {totalItems > 0 && (
              <span
                className="absolute flex items-center justify-center text-white font-bold"
                style={{
                  top: -4, right: -4,
                  width: 18, height: 18,
                  borderRadius: 9,
                  background: '#FF6B2B',
                  fontSize: 10,
                }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
