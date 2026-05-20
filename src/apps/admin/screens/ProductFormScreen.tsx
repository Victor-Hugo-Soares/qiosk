import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useQioskStore } from '../../../store'
import { useToast } from '../../../hooks/useToast'
import type { ExtraGroup, Product } from '../../../types'

const C = {
  surface: '#FFFFFF', border: 'rgba(0,0,0,0.07)',
  text: '#1C1C1E', sub: '#6B6B6B', muted: '#A0A0A0',
  brand: '#FF6B2B', danger: '#EF4444', success: '#22C55E',
  inputBg: '#F4F3F0',
}

const COLOR_PALETTE = [
  '#8B5E3C', '#6B4226', '#C8870A', '#B22222', '#E8A020',
  '#D4A017', '#8B6914', '#C4607A', '#4A7C59', '#5B7FA6',
]

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.sub }}>
        {label}{required && <span style={{ color: C.brand }}> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: C.inputBg, border: `1px solid ${C.border}`,
  borderRadius: 10, padding: '10px 14px',
  fontSize: 14, color: C.text, fontFamily: "'Inter', sans-serif",
  outline: 'none', width: '100%',
}

export default function ProductFormScreen() {
  const navigate   = useNavigate()
  const { id }     = useParams<{ id: string }>()
  const isEdit     = !!id
  const { toast }  = useToast()

  const categories    = useQioskStore((s) => s.categories)
  const products      = useQioskStore((s) => s.products)
  const addProduct    = useQioskStore((s) => s.addProduct)
  const updateProduct = useQioskStore((s) => s.updateProduct)

  const existing = isEdit ? products.find((p) => p.id === id) : undefined

  const [name,        setName]        = useState(existing?.name        ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [price,       setPrice]       = useState(existing?.price.toFixed(2) ?? '')
  const [categoryId,  setCategoryId]  = useState(existing?.categoryId  ?? categories[0]?.id ?? '')
  const [imageColor,  setImageColor]  = useState(existing?.imageColor  ?? COLOR_PALETTE[0])
  const [hasDoneness, setHasDoneness] = useState(existing?.hasDoneness ?? false)
  const [available,   setAvailable]   = useState(existing?.available   ?? true)
  const [extraGroups, setExtraGroups] = useState<ExtraGroup[]>(existing?.extraGroups ?? [])
  const [errors,      setErrors]      = useState<Record<string, string>>({})

  // ── Extra groups helpers ──────────────────────────────────
  const addGroup = () =>
    setExtraGroups((prev) => [...prev, {
      id: crypto.randomUUID(), name: '', required: false, multiple: true,
      extras: [{ id: crypto.randomUUID(), name: '', price: 0, available: true }],
    }])

  const updateGroup = (gIdx: number, patch: Partial<ExtraGroup>) =>
    setExtraGroups((prev) => prev.map((g, i) => i === gIdx ? { ...g, ...patch } : g))

  const removeGroup = (gIdx: number) =>
    setExtraGroups((prev) => prev.filter((_, i) => i !== gIdx))

  const addExtra = (gIdx: number) =>
    setExtraGroups((prev) => prev.map((g, i) =>
      i === gIdx ? { ...g, extras: [...g.extras, { id: crypto.randomUUID(), name: '', price: 0, available: true }] } : g
    ))

  const updateExtra = (gIdx: number, eIdx: number, patch: object) =>
    setExtraGroups((prev) => prev.map((g, i) =>
      i === gIdx ? { ...g, extras: g.extras.map((e, j) => j === eIdx ? { ...e, ...patch } : e) } : g
    ))

  const removeExtra = (gIdx: number, eIdx: number) =>
    setExtraGroups((prev) => prev.map((g, i) =>
      i === gIdx ? { ...g, extras: g.extras.filter((_, j) => j !== eIdx) } : g
    ))

  // ── Validação e submit ────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim())       e.name  = 'Nome obrigatório'
    if (!price.trim() || isNaN(Number(price.replace(',', '.')))) e.price = 'Preço inválido'
    if (!categoryId)        e.category = 'Selecione uma categoria'
    return e
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const data: Omit<Product, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price.replace(',', '.')),
      categoryId,
      imageColor,
      hasDoneness,
      available,
      extraGroups: extraGroups.filter((g) => g.name.trim()),
    }

    if (isEdit && id) {
      updateProduct(id, data)
      toast(`"${data.name}" atualizado`, 'success')
    } else {
      addProduct({ id: crypto.randomUUID(), ...data })
      toast(`"${data.name}" criado`, 'success')
    }
    navigate('/admin/menu')
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 680 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button onClick={() => navigate('/admin/menu')} className="touch-press"
          style={{ width: 36, height: 36, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={18} color={C.sub} />
        </button>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: C.text }}>
          {isEdit ? 'Editar produto' : 'Novo produto'}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Card principal */}
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>Informações básicas</p>

          <Field label="Nome" required>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Smash Burguer Classic" style={{ ...inputStyle, borderColor: errors.name ? C.danger : C.border }} />
            {errors.name && <p style={{ fontSize: 12, color: C.danger }}>{errors.name}</p>}
          </Field>

          <Field label="Descrição">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ingredientes, diferenciais..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Preço (R$)" required>
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="32,90" style={{ ...inputStyle, borderColor: errors.price ? C.danger : C.border }} />
              {errors.price && <p style={{ fontSize: 12, color: C.danger }}>{errors.price}</p>}
            </Field>
            <Field label="Categoria" required>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ ...inputStyle, borderColor: errors.category ? C.danger : C.border }}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>

          {/* Cor do placeholder */}
          <Field label="Cor do placeholder">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLOR_PALETTE.map((col) => (
                <button key={col} onClick={() => setImageColor(col)} className="touch-press"
                  style={{
                    width: 32, height: 32, borderRadius: 8, background: col, border: 'none', cursor: 'pointer',
                    outline: imageColor === col ? `3px solid ${C.brand}` : '3px solid transparent',
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </Field>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Tem ponto da carne', value: hasDoneness, set: setHasDoneness },
              { label: 'Disponível no cardápio', value: available, set: setAvailable },
            ].map(({ label, value, set }) => (
              <button key={label} onClick={() => set(!value)} className="touch-press"
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{
                  width: 42, height: 24, borderRadius: 12,
                  background: value ? C.brand : '#E5E4E0',
                  position: 'relative', transition: 'background 0.2s ease',
                }}>
                  <div style={{
                    position: 'absolute', top: 3, left: value ? 21 : 3,
                    width: 18, height: 18, borderRadius: 9, background: '#FFF',
                    transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                <span style={{ fontSize: 13, color: C.sub }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grupos de adicionais */}
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>
              Grupos de adicionais
            </p>
            <button onClick={addGroup} className="touch-press"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                background: 'rgba(255,107,43,0.08)', border: `1px solid rgba(255,107,43,0.2)`,
                cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13, fontWeight: 600, color: C.brand,
              }}
            >
              <Plus size={14} color={C.brand} /> Adicionar grupo
            </button>
          </div>

          {extraGroups.length === 0 && (
            <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', padding: '16px 0' }}>
              Nenhum grupo de adicionais — clique em "Adicionar grupo" para criar
            </p>
          )}

          {extraGroups.map((group, gIdx) => (
            <div key={group.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input value={group.name} onChange={(e) => updateGroup(gIdx, { name: e.target.value })}
                  placeholder="Nome do grupo (ex: Adicionais)" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => removeGroup(gIdx)} className="touch-press"
                  style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(231,76,60,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={15} color={C.danger} />
                </button>
              </div>

              {/* Extras */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.extras.map((extra, eIdx) => (
                  <div key={extra.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 34px', gap: 8, alignItems: 'center' }}>
                    <input value={extra.name} onChange={(e) => updateExtra(gIdx, eIdx, { name: e.target.value })}
                      placeholder="Ex: Bacon Crocante" style={inputStyle} />
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: C.muted }}>R$</span>
                      <input
                        type="number" min="0" step="0.5"
                        value={extra.price}
                        onChange={(e) => updateExtra(gIdx, eIdx, { price: Number(e.target.value) })}
                        style={{ ...inputStyle, paddingLeft: 32, fontVariantNumeric: 'tabular-nums' }}
                      />
                    </div>
                    <button onClick={() => removeExtra(gIdx, eIdx)} className="touch-press"
                      style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(231,76,60,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={13} color={C.muted} />
                    </button>
                  </div>
                ))}
                <button onClick={() => addExtra(gIdx)} className="touch-press"
                  style={{ padding: '7px 12px', borderRadius: 8, background: 'transparent', border: `1px dashed ${C.border}`, cursor: 'pointer', fontSize: 13, color: C.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={13} color={C.muted} /> Adicionar item
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/admin/menu')} className="touch-press"
            style={{ padding: '11px 24px', borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: C.sub, fontFamily: "'Space Grotesk', sans-serif" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} className="touch-press"
            style={{ padding: '11px 28px', borderRadius: 10, background: C.brand, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}>
            {isEdit ? 'Salvar alterações' : 'Criar produto'}
          </button>
        </div>
      </div>
    </div>
  )
}
