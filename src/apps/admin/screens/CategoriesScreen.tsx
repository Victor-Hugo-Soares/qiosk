'use client'
import { useState } from 'react'
import {
  Plus, Trash2, ChevronUp, ChevronDown,
  Sandwich, Coffee, UtensilsCrossed, IceCream2,
  Pizza, Beef, Salad, ShoppingBag, Flame, Cookie,
} from 'lucide-react'
import { useQioskStore } from '../../../store'
import type { Category } from '../../../types'

const C = {
  bg:       '#F4F3F0',
  surface:  '#FFFFFF',
  border:   'rgba(0,0,0,0.07)',
  text:     '#1C1C1E',
  sub:      '#6B6B6B',
  muted:    '#A0A0A0',
  brand:    '#FF6B2B',
  brandLight: '#FFF0E6',
  danger:   '#EF4444',
  dangerLight: '#FEF2F2',
  success:  '#22C55E',
  inputBg:  '#F4F3F0',
}

const inputStyle: React.CSSProperties = {
  background: C.inputBg,
  border: `1px solid ${C.border}`,
  borderRadius: 10, padding: '9px 13px',
  fontSize: 14, color: C.text,
  fontFamily: "'Inter', sans-serif",
  outline: 'none', width: '100%',
}

// Ícones disponíveis para categorias
const ICONS: { key: string; Icon: React.ElementType; label: string }[] = [
  { key: 'Sandwich',         Icon: Sandwich,         label: 'Lanche'     },
  { key: 'Cup',              Icon: Coffee,           label: 'Bebida'     },
  { key: 'UtensilsCrossed',  Icon: UtensilsCrossed,  label: 'Porção'     },
  { key: 'IceCream',         Icon: IceCream2,        label: 'Sobremesa'  },
  { key: 'Pizza',            Icon: Pizza,            label: 'Pizza'      },
  { key: 'Beef',             Icon: Beef,             label: 'Carne'      },
  { key: 'Salad',            Icon: Salad,            label: 'Salada'     },
  { key: 'ShoppingBag',      Icon: ShoppingBag,      label: 'Geral'      },
  { key: 'Flame',            Icon: Flame,            label: 'Grelhado'   },
  { key: 'Cookie',           Icon: Cookie,           label: 'Snack'      },
]

const iconMap: Record<string, React.ElementType> = Object.fromEntries(
  ICONS.map(({ key, Icon }) => [key, Icon])
)

interface EditState {
  name: string
  icon: string
}

export default function CategoriesScreen() {
  const categories        = useQioskStore((s) => s.categories)
  const products          = useQioskStore((s) => s.products)
  const addCategory       = useQioskStore((s) => s.addCategory)
  const updateCategory    = useQioskStore((s) => s.updateCategory)
  const deleteCategory    = useQioskStore((s) => s.deleteCategory)
  const moveCategoryUp    = useQioskStore((s) => s.moveCategoryUp)
  const moveCategoryDown  = useQioskStore((s) => s.moveCategoryDown)

  const [editing, setEditing]       = useState<Record<string, EditState>>({})
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [creating, setCreating]     = useState(false)
  const [newName, setNewName]       = useState('')
  const [newIcon, setNewIcon]       = useState('Sandwich')

  const sorted = [...categories].sort((a, b) => a.order - b.order)

  const productCount = (catId: string) =>
    products.filter((p) => p.categoryId === catId).length

  // ── Edição inline ──────────────────────────────────────────
  const startEdit = (cat: Category) => {
    setEditing((prev) => ({ ...prev, [cat.id]: { name: cat.name, icon: cat.icon } }))
  }

  const cancelEdit = (id: string) => {
    setEditing((prev) => { const n = { ...prev }; delete n[id]; return n })
  }

  const saveEdit = (id: string) => {
    const e = editing[id]
    if (!e?.name.trim()) return
    updateCategory(id, { name: e.name.trim(), icon: e.icon })
    cancelEdit(id)
  }

  // ── Criar nova ─────────────────────────────────────────────
  const handleCreate = () => {
    if (!newName.trim()) return
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.order), 0)
    addCategory({
      id: crypto.randomUUID(),
      name: newName.trim(),
      icon: newIcon,
      order: maxOrder + 1,
    })
    setNewName('')
    setNewIcon('Sandwich')
    setCreating(false)
  }

  // ── Deletar ────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteCategory(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>
            Categorias
          </h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>
            {sorted.length} categorias · arraste para reordenar
          </p>
        </div>
        <button
          onClick={() => { setCreating(true); setNewName(''); setNewIcon('Sandwich') }}
          className="touch-press"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10,
            background: C.brand, border: 'none', cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14, fontWeight: 600, color: '#FFF',
          }}
        >
          <Plus size={16} color="#FFF" strokeWidth={2.5} />
          Nova categoria
        </button>
      </div>

      {/* Lista de categorias */}
      <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        {sorted.length === 0 && !creating && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: C.muted }}>Nenhuma categoria ainda</p>
          </div>
        )}

        {sorted.map((cat, idx) => {
          const isEditing = !!editing[cat.id]
          const edit      = editing[cat.id]
          const count     = productCount(cat.id)
          const Icon      = iconMap[isEditing ? edit.icon : cat.icon] ?? Sandwich
          const isFirst   = idx === 0
          const isLast    = idx === sorted.length - 1
          const isDanger  = confirmDelete === cat.id

          return (
            <div
              key={cat.id}
              style={{
                borderBottom: idx < sorted.length - 1 || creating ? `1px solid ${C.border}` : 'none',
                background: isEditing ? '#FAFAF8' : C.surface,
                transition: 'background 0.15s ease',
              }}
            >
              {isEditing ? (
                /* ── Modo edição ── */
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.sub, display: 'block', marginBottom: 6 }}>
                        Nome
                      </label>
                      <input
                        value={edit.name}
                        onChange={(e) => setEditing((p) => ({ ...p, [cat.id]: { ...p[cat.id], name: e.target.value } }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(cat.id); if (e.key === 'Escape') cancelEdit(cat.id) }}
                        style={inputStyle}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Picker de ícone */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.sub, display: 'block', marginBottom: 8 }}>
                      Ícone
                    </label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {ICONS.map(({ key, Icon: I, label }) => {
                        const active = edit.icon === key
                        return (
                          <button
                            key={key}
                            onClick={() => setEditing((p) => ({ ...p, [cat.id]: { ...p[cat.id], icon: key } }))}
                            title={label}
                            className="touch-press"
                            style={{
                              width: 44, height: 44, borderRadius: 12,
                              background: active ? C.brandLight : C.bg,
                              border: `2px solid ${active ? C.brand : C.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', transition: 'all 0.12s ease',
                            }}
                          >
                            <I size={20} color={active ? C.brand : C.muted} strokeWidth={1.75} />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => cancelEdit(cat.id)}
                      className="touch-press"
                      style={{ padding: '8px 18px', borderRadius: 9, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.sub, fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => saveEdit(cat.id)}
                      className="touch-press"
                      style={{ padding: '8px 18px', borderRadius: 9, background: C.brand, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Modo visualização ── */
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px',
                }}>
                  {/* Reordenar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button
                      onClick={() => moveCategoryUp(cat.id)}
                      disabled={isFirst}
                      className="touch-press"
                      style={{ width: 24, height: 22, borderRadius: 6, background: isFirst ? 'transparent' : C.bg, border: `1px solid ${isFirst ? 'transparent' : C.border}`, cursor: isFirst ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isFirst ? 0.25 : 1 }}
                    >
                      <ChevronUp size={13} color={C.sub} />
                    </button>
                    <button
                      onClick={() => moveCategoryDown(cat.id)}
                      disabled={isLast}
                      className="touch-press"
                      style={{ width: 24, height: 22, borderRadius: 6, background: isLast ? 'transparent' : C.bg, border: `1px solid ${isLast ? 'transparent' : C.border}`, cursor: isLast ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isLast ? 0.25 : 1 }}
                    >
                      <ChevronDown size={13} color={C.sub} />
                    </button>
                  </div>

                  {/* Ícone */}
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color={C.brand} strokeWidth={1.75} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: C.text, margin: 0 }}>
                      {cat.name}
                    </p>
                    <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      {count} {count === 1 ? 'produto' : 'produtos'}
                    </p>
                  </div>

                  {/* Ações */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => startEdit(cat)}
                      className="touch-press"
                      style={{ height: 34, padding: '0 14px', borderRadius: 9, background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.sub, fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={count > 0}
                      title={count > 0 ? 'Remova os produtos desta categoria antes de deletar' : isDanger ? 'Clique para confirmar' : 'Deletar'}
                      className="touch-press"
                      style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: isDanger ? C.dangerLight : count > 0 ? 'transparent' : C.bg,
                        border: `1px solid ${isDanger ? C.danger : count > 0 ? 'transparent' : C.border}`,
                        cursor: count > 0 ? 'not-allowed' : 'pointer',
                        opacity: count > 0 ? 0.35 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Trash2 size={15} color={isDanger ? C.danger : C.sub} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* ── Formulário de nova categoria ── */}
        {creating && (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14, background: '#FAFAF8' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>
              Nova categoria
            </p>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.sub, display: 'block', marginBottom: 6 }}>Nome</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
                placeholder="Ex: Combos"
                style={inputStyle}
                autoFocus
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.sub, display: 'block', marginBottom: 8 }}>Ícone</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ICONS.map(({ key, Icon: I, label }) => {
                  const active = newIcon === key
                  return (
                    <button
                      key={key}
                      onClick={() => setNewIcon(key)}
                      title={label}
                      className="touch-press"
                      style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: active ? C.brandLight : C.bg,
                        border: `2px solid ${active ? C.brand : C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.12s ease',
                      }}
                    >
                      <I size={20} color={active ? C.brand : C.muted} strokeWidth={1.75} />
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCreating(false)}
                className="touch-press"
                style={{ padding: '8px 18px', borderRadius: 9, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.sub, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="touch-press"
                style={{ padding: '8px 18px', borderRadius: 9, background: newName.trim() ? C.brand : C.muted, border: 'none', cursor: newName.trim() ? 'pointer' : 'default', fontSize: 13, fontWeight: 600, color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Criar categoria
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Aviso deletar */}
      {confirmDelete && (
        <p style={{ fontSize: 12, color: C.danger, textAlign: 'center' }}>
          Clique em deletar novamente para confirmar a exclusão
        </p>
      )}
    </div>
  )
}
