import { useState } from 'react'
import { Minus, Plus, CheckCircle2 } from 'lucide-react'
import { useQioskStore } from '../../../store'
import type { BusinessHours, DaySchedule, PaymentMethod } from '../../../types'

const C = {
  surface: '#FFFFFF', border: 'rgba(0,0,0,0.07)',
  text: '#1C1C1E', sub: '#6B6B6B', muted: '#A0A0A0',
  brand: '#FF6B2B', success: '#22C55E',
  inputBg: '#F4F3F0',
}

const inputStyle: React.CSSProperties = {
  background: C.inputBg, border: `1px solid ${C.border}`,
  borderRadius: 10, padding: '10px 14px',
  fontSize: 14, color: C.text, fontFamily: "'Inter', sans-serif",
  outline: 'none', width: '100%',
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; desc: string }[] = [
  { method: 'pix',  label: 'PIX',      desc: 'QR Code gerado na tela'   },
  { method: 'card', label: 'Cartão',   desc: 'Crédito e débito'          },
  { method: 'cash', label: 'Dinheiro', desc: 'Pagamento no balcão'       },
]

export default function SettingsScreen() {
  const settings        = useQioskStore((s) => s.settings)
  const updateSettings  = useQioskStore((s) => s.updateSettings)
  const setEstimated    = useQioskStore((s) => s.setEstimatedMinutes)

  const [storeName, setStoreName] = useState(settings.name)
  const [saved, setSaved]         = useState(false)

  const updateDay = (idx: number, patch: Partial<DaySchedule>) => {
    const next = [...settings.businessHours] as BusinessHours
    next[idx] = { ...next[idx], ...patch }
    updateSettings({ businessHours: next })
  }

  const togglePayment = (method: PaymentMethod) => {
    const current = settings.paymentMethods
    const next = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method]
    if (next.length === 0) return // precisa de ao menos 1
    updateSettings({ paymentMethods: next })
  }

  const handleSaveName = () => {
    if (!storeName.trim()) return
    updateSettings({ name: storeName.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: C.text }}>
        Configurações
      </h1>

      {/* Estabelecimento */}
      <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>
          Estabelecimento
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: C.sub }}>Nome do estabelecimento</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Ex: Burguer do Zé"
              style={inputStyle}
            />
            <button onClick={handleSaveName} className="touch-press"
              style={{
                padding: '10px 20px', borderRadius: 10, flexShrink: 0,
                background: saved ? C.success : C.brand, border: 'none', cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: '#FFF',
                display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s ease',
              }}
            >
              {saved && <CheckCircle2 size={15} color="#FFF" />}
              {saved ? 'Salvo!' : 'Salvar'}
            </button>
          </div>
        </div>

        {/* Aceitar pedidos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: C.inputBg, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Aceitar pedidos</p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>O kiosk fica ativo para os clientes</p>
          </div>
          <button
            onClick={() => updateSettings({ acceptingOrders: !settings.acceptingOrders })}
            className="touch-press"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ width: 48, height: 28, borderRadius: 14, background: settings.acceptingOrders ? C.brand : '#E5E4E0', position: 'relative', transition: 'background 0.2s ease' }}>
              <div style={{ position: 'absolute', top: 4, left: settings.acceptingOrders ? 24 : 4, width: 20, height: 20, borderRadius: 10, background: '#FFF', transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </button>
        </div>
      </div>

      {/* Tempo estimado */}
      <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>
            Tempo estimado de preparo
          </p>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Exibido para o cliente após confirmar o pedido. Também configurável diretamente na tela da cozinha.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setEstimated(Math.max(1, settings.estimatedMinutes - 1))}
            className="touch-press"
            style={{ width: 44, height: 44, borderRadius: 10, background: C.inputBg, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Minus size={18} color={C.sub} />
          </button>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: C.brand, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {settings.estimatedMinutes}
            </p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>minutos</p>
          </div>
          <button
            onClick={() => setEstimated(settings.estimatedMinutes + 1)}
            className="touch-press"
            style={{ width: 44, height: 44, borderRadius: 10, background: C.inputBg, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={18} color={C.sub} />
          </button>
          <p style={{ fontSize: 13, color: C.muted }}>
            O cliente verá: <strong style={{ color: C.text }}>~{settings.estimatedMinutes} min</strong>
          </p>
        </div>
      </div>

      {/* Horário de funcionamento */}
      <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>
            Horário de funcionamento
          </p>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Fora do horário o kiosk mostra a tela de loja fechada automaticamente.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DAYS.map((day, idx) => {
            const schedule = settings.businessHours[idx]
            return (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                background: schedule.enabled ? 'rgba(255,107,43,0.04)' : C.inputBg,
                border: `1.5px solid ${schedule.enabled ? C.brand : C.border}`,
                transition: 'all 0.15s ease',
              }}>
                {/* Toggle */}
                <button
                  onClick={() => updateDay(idx, { enabled: !schedule.enabled })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                >
                  <div style={{ width: 40, height: 24, borderRadius: 12, background: schedule.enabled ? C.brand : '#E5E4E0', position: 'relative', transition: 'background 0.2s ease' }}>
                    <div style={{ position: 'absolute', top: 3, left: schedule.enabled ? 19 : 3, width: 18, height: 18, borderRadius: 9, background: '#FFF', transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                </button>

                {/* Nome do dia */}
                <span style={{ fontSize: 13, fontWeight: 600, color: schedule.enabled ? C.text : C.muted, width: 64, flexShrink: 0 }}>
                  {day}
                </span>

                {/* Horários */}
                {schedule.enabled ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <input
                      type="time"
                      value={schedule.open}
                      onChange={(e) => updateDay(idx, { open: e.target.value })}
                      style={{ padding: '4px 8px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text, background: '#FFF', outline: 'none', fontFamily: "'Inter', sans-serif" }}
                    />
                    <span style={{ fontSize: 12, color: C.muted }}>até</span>
                    <input
                      type="time"
                      value={schedule.close}
                      onChange={(e) => updateDay(idx, { close: e.target.value })}
                      style={{ padding: '4px 8px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.text, background: '#FFF', outline: 'none', fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: C.muted, fontStyle: 'italic' }}>Fechado</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Formas de pagamento */}
      <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>
            Formas de pagamento aceitas
          </p>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Aparecem como opção para o cliente na tela de pagamento.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PAYMENT_OPTIONS.map(({ method, label, desc }) => {
            const active = settings.paymentMethods.includes(method)
            return (
              <button
                key={method}
                onClick={() => togglePayment(method)}
                className="touch-press"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 10,
                  background: active ? 'rgba(255,107,43,0.05)' : C.inputBg,
                  border: `1.5px solid ${active ? C.brand : C.border}`,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</p>
                  <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{desc}</p>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: 10,
                  background: active ? C.brand : 'transparent',
                  border: `2px solid ${active ? C.brand : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease', flexShrink: 0,
                }}>
                  {active && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#FFF' }} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
