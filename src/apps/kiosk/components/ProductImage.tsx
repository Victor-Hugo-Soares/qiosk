import { useState } from 'react'
import ProductPlaceholder from './ProductPlaceholder'
import type { Product } from '../../../types'

interface Props {
  product: Product
  size: number
  borderRadius?: number
}

/**
 * Mostra a imagem real do produto se disponível,
 * com fallback para o placeholder SVG colorido.
 */
export default function ProductImage({ product, size, borderRadius = 14 }: Props) {
  const [error, setError] = useState(false)

  if (product.imageUrl && !error) {
    return (
      <img
        src={`${product.imageUrl}?auto=format&fit=crop&w=${size * 2}&q=80`}
        alt={product.name}
        onError={() => setError(true)}
        style={{
          width: size, height: size,
          objectFit: 'cover',
          borderRadius,
          display: 'block',
        }}
      />
    )
  }

  return <ProductPlaceholder color={product.imageColor} size={size} />
}
