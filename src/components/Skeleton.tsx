import { K } from '../apps/kiosk/theme'

/** Bloco skeleton base */
function Box({ w = '100%', h = 20, r = 10, style }: { w?: string | number; h?: number; r?: number; style?: React.CSSProperties }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
    />
  )
}

/** Skeleton da tela de categorias */
export function CategoriesSkeleton() {
  return (
    <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Título */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Box w="55%" h={24} />
        <Box w="40%" h={14} />
      </div>

      {/* Grid 2×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            background: K.surface, borderRadius: 20,
            padding: '18px 16px', boxShadow: K.shadow,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <Box w={52} h={52} r={16} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Box w="70%" h={16} />
              <Box w="40%" h={12} />
            </div>
          </div>
        ))}
      </div>

      {/* Ver tudo */}
      <div style={{
        background: K.surface, borderRadius: 16,
        padding: '16px 20px', boxShadow: K.shadow,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Box w={44} h={44} r={12} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box w="35%" h={16} />
          <Box w="50%" h={12} />
        </div>
      </div>
    </div>
  )
}

/** Skeleton da tela de produtos */
export function ProductsSkeleton() {
  return (
    <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Título */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Box w="45%" h={22} />
        <Box w="30%" h={13} />
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            background: K.surface, borderRadius: 18,
            padding: '14px', boxShadow: K.shadow,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <Box w={84} h={84} r={14} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Box w="70%" h={16} />
              <Box w="85%" h={12} />
              <Box w="30%" h={18} style={{ marginTop: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
