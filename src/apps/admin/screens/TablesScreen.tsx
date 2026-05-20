import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Printer, QrCode } from 'lucide-react'

const C = {
  bg:      '#F4F3F0',
  surface: '#FFFFFF',
  border:  'rgba(0,0,0,0.07)',
  text:    '#1C1C1E',
  sub:     '#6B6B6B',
  muted:   '#A0A0A0',
  brand:   '#FF6B2B',
}

export default function TablesScreen() {
  const [tableCount, setTableCount] = useState(10)
  const [baseUrl, setBaseUrl]       = useState(() => `${window.location.origin}/kiosk`)
  const printRef                    = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Mesas QIOSK</title>
      <style>
        body { margin: 0; font-family: 'Inter', sans-serif; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px; }
        .card { border: 2px solid #FF6B2B; border-radius: 16px; padding: 24px; text-align: center; break-inside: avoid; }
        .mesa { font-size: 22px; font-weight: 800; color: #1C1C1E; margin-bottom: 12px; }
        .sub  { font-size: 12px; color: #888; margin-top: 10px; }
        @media print { @page { margin: 16px; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>
    `)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  const tables = Array.from({ length: tableCount }, (_, i) => i + 1)

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: C.text }}>
            QR Codes das Mesas
          </h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>
            Imprime e cola em cada mesa. O cliente scannea e já está no cardápio.
          </p>
        </div>
        <button
          onClick={handlePrint}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 12,
            background: C.brand, border: 'none',
            color: '#FFF', cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(255,107,43,0.3)',
          }}
        >
          <Printer size={16} />
          Imprimir todos
        </button>
      </div>

      {/* Configurações */}
      <div style={{ background: C.surface, borderRadius: 16, padding: '20px 24px', border: `1px solid ${C.border}`, display: 'flex', gap: 24, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Número de mesas
          </label>
          <input
            type="number"
            min={1}
            max={99}
            value={tableCount}
            onChange={(e) => setTableCount(Math.max(1, Math.min(99, Number(e.target.value))))}
            style={{
              width: 80, padding: '8px 12px', borderRadius: 10,
              border: `1.5px solid ${C.border}`, fontSize: 16,
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              color: C.text, outline: 'none',
            }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            URL base do kiosk
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 10,
              border: `1.5px solid ${C.border}`, fontSize: 13,
              fontFamily: "'Inter', sans-serif", color: C.text, outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Grid QR Codes */}
      <div
        ref={printRef}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}
      >
        {tables.map((n) => (
          <div key={n} style={{
            background: C.surface,
            border: `2px solid ${C.brand}`,
            borderRadius: 16,
            padding: '20px 16px',
            textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <QrCode size={14} color={C.brand} />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 16, fontWeight: 800, color: C.text,
              }}>
                Mesa {n}
              </span>
            </div>
            <QRCodeSVG
              value={`${baseUrl}?table=${n}`}
              size={140}
              fgColor={C.text}
              bgColor="#FFFFFF"
              level="M"
            />
            <p style={{ fontSize: 10, color: C.muted, wordBreak: 'break-all', lineHeight: 1.4 }}>
              {baseUrl}?table={n}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
