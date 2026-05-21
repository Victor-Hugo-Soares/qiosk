'use client'
import { useRouter } from 'next/navigation'
import { BackArrowIcon, CartIcon } from './QioskIcons'
import QioskLogo from './QioskLogo'
import { useCartStore, useQioskStore } from '../../../store'
import { K } from '../theme'

interface Props {
  showBack?: boolean
  showCart?: boolean
  onBack?:   () => void
}

export default function KioskHeader({ showBack = true, showCart = true, onBack }: Props) {
  const router     = useRouter()
  const totalItems = useCartStore((s) => s.totalItems())
  const storeName  = useQioskStore((s) => s.settings.name)

  const handleBack = () => {
    if (onBack) { onBack(); return }
    router.back()
  }

  return (
    <header style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: 60,
      background: K.surface,
      borderBottom: `1px solid ${K.border}`,
      boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
    }}>
      {/* Voltar */}
      <div style={{ width: 44 }}>
        {showBack && (
          <button
            onClick={handleBack}
            className="touch-press"
            style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: K.bg,
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <BackArrowIcon size={20} color={K.text} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Nome da loja */}
      {storeName ? (
        <span style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: 16, fontWeight: 700, color: K.text,
          letterSpacing: '-0.01em',
        }}>
          {storeName}
        </span>
      ) : (
        <QioskLogo fontSize={16} />
      )}

      {/* Carrinho */}
      <div style={{ width: 44 }}>
        {showCart && (
          <button
            onClick={() => router.push('/kiosk/cart')}
            className="touch-press"
            style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: totalItems > 0 ? K.brandLight : K.bg,
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <CartIcon size={20} color={totalItems > 0 ? K.brand : K.sub} strokeWidth={1.75} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: 6, right: 6,
                width: 16, height: 16,
                borderRadius: 8,
                background: K.brand,
                fontSize: 9,
                fontWeight: 700,
                color: '#FFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
