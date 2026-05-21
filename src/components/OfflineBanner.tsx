import { useState, useEffect } from 'react'

export default function OfflineBanner() {
  const [online,  setOnline]  = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [visible, setVisible] = useState(() => typeof navigator !== 'undefined' ? !navigator.onLine : false)

  useEffect(() => {
    const onOnline  = () => { setOnline(true);  setTimeout(() => setVisible(false), 2000) }
    const onOffline = () => { setOnline(false); setVisible(true) }

    window.addEventListener('online',  onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online',  onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 99999,
      padding: '10px 20px',
      background: online ? '#22C55E' : '#1C1C1E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transition: 'background 0.3s ease',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: 4,
        background: online ? '#FFF' : '#EF4444',
        flexShrink: 0,
      }} />
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 13, fontWeight: 600, color: '#FFF',
      }}>
        {online ? 'Conexão restaurada' : 'Sem conexão — verifique a internet'}
      </span>
    </div>
  )
}
