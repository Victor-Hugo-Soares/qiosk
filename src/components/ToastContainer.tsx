import { useToast } from '../hooks/useToast'

const TYPE_CONFIG = {
  success: { bg: '#22C55E', icon: '✓' },
  error:   { bg: '#EF4444', icon: '✕' },
  info:    { bg: '#FF6B2B', icon: 'i' },
}

export default function ToastContainer() {
  const { toasts, remove, markLeaving } = useToast()

  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => {
        const cfg = TYPE_CONFIG[t.type]
        return (
          <div
            key={t.id}
            className={t.leaving ? 'toast-out' : 'toast-in'}
            onClick={() => {
              markLeaving(t.id)
              setTimeout(() => remove(t.id), 280)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 20px',
              borderRadius: 14,
              background: '#1C1C1E',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              userSelect: 'none',
              minWidth: 200,
              maxWidth: 360,
            }}
          >
            {/* Bolinha colorida do tipo */}
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              background: cfg.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              fontSize: 12, fontWeight: 700, color: '#FFF',
            }}>
              {cfg.icon}
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14, fontWeight: 600,
              color: '#FFF',
              lineHeight: 1.3,
            }}>
              {t.message}
            </span>
          </div>
        )
      })}
    </div>
  )
}
