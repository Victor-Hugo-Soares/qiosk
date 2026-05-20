'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useQioskStore } from '../../../store'
import { useToast } from '../../../hooks/useToast'

const C = {
  surface: '#FFFFFF', border: 'rgba(0,0,0,0.07)', altRow: '#FAFAF8',
  text: '#1C1C1E', sub: '#6B6B6B', muted: '#A0A0A0',
  brand: '#FF6B2B', success: '#22C55E', danger: '#EF4444',
}

export default function MenuScreen() {
  const router = useRouter()
  const { toast } = useToast()
  const categories          = useQioskStore((s) => s.categories)
  const products            = useQioskStore((s) => s.products)
  const toggleAvailability  = useQioskStore((s) => s.toggleProductAvailability)
  const deleteProduct       = useQioskStore((s) => s.deleteProduct)

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      const name = products.find((p) => p.id === id)?.name ?? 'Produto'
      deleteProduct(id)
      setConfirmDelete(null)
      toast(`"${name}" removido`, 'info')
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleToggle = (id: string) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    toggleAvailability(id)
    toast(
      product.available ? `"${product.name}" desativado` : `"${product.name}" ativado`,
      product.available ? 'info' : 'success',
    )
  }

  const sorted = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: C.text }}>
            Cardápio
          </h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>
            {products.length} produtos · {products.filter((p) => p.available).length} disponíveis
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/menu/new')}
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
          Novo produto
        </button>
      </div>

      {/* Por categoria */}
      {sorted.map((cat) => {
        const catProducts = products.filter((p) => p.categoryId === cat.id)
        if (catProducts.length === 0) return null

        return (
          <div key={cat.id} style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {/* Cabeçalho da categoria */}
            <div style={{
              padding: '14px 24px', background: '#FAFAF8',
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>
                {cat.name}
              </p>
              <span style={{ fontSize: 12, color: C.muted }}>
                {catProducts.filter((p) => p.available).length}/{catProducts.length} disponíveis
              </span>
            </div>

            {/* Produtos */}
            {catProducts.map((product, i) => (
              <div
                key={product.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr 80px 90px 110px',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 24px',
                  borderBottom: i < catProducts.length - 1 ? `1px solid ${C.border}` : 'none',
                  background: i % 2 === 0 ? C.surface : '#FAFAF8',
                }}
              >
                {/* Cor placeholder */}
                <div style={{ width: 40, height: 40, borderRadius: 10, background: product.imageColor, opacity: product.available ? 1 : 0.4, flexShrink: 0 }} />

                {/* Nome + descrição */}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: product.available ? C.text : C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: 12, color: C.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.description}
                  </p>
                </div>

                {/* Preço */}
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: C.text, fontVariantNumeric: 'tabular-nums' }}>
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>

                {/* Toggle disponível */}
                <button
                  onClick={() => handleToggle(product.id)}
                  className="touch-press"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  {product.available
                    ? <ToggleRight size={26} color={C.success} />
                    : <ToggleLeft  size={26} color={C.muted}   />
                  }
                  <span style={{ fontSize: 12, color: product.available ? C.success : C.muted, fontWeight: 500 }}>
                    {product.available ? 'Ativo' : 'Inativo'}
                  </span>
                </button>

                {/* Ações */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => router.push(`/admin/menu/edit/${product.id}`)}
                    className="touch-press"
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: 'rgba(26,26,46,0.06)', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    title="Editar"
                  >
                    <Pencil size={15} color={C.sub} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="touch-press"
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: confirmDelete === product.id ? 'rgba(231,76,60,0.12)' : 'rgba(26,26,46,0.06)',
                      border: confirmDelete === product.id ? `1px solid rgba(231,76,60,0.3)` : 'none',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                    title={confirmDelete === product.id ? 'Clique novamente para confirmar' : 'Deletar'}
                  >
                    <Trash2 size={15} color={confirmDelete === product.id ? C.danger : C.sub} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
