'use client'
import { Flame } from '@phosphor-icons/react'
import { K } from '../theme'

interface Props {
  fontSize?: number
}

export default function QioskLogo({ fontSize = 16 }: Props) {
  const flameSize = Math.round(fontSize * 0.65)

  return (
    <span style={{
      fontFamily: "'Figtree', sans-serif",
      display: 'inline-flex',
      alignItems: 'flex-end',
      paddingTop: flameSize,
    }}>
      {/* Q */}
      <span style={{ fontSize, fontWeight: 900, color: K.brand, lineHeight: 1 }}>Q</span>

      {/* I — com chama acima */}
      <span style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}>
        <span style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          lineHeight: 0,
        }}>
          <Flame size={flameSize} weight="fill" color={K.brand} />
        </span>
        <span style={{ fontSize, fontWeight: 900, color: K.brand }}>I</span>
      </span>

      {/* osk — peso leve, cor neutra */}
      <span style={{ fontSize: Math.round(fontSize * 0.88), fontWeight: 500, color: K.text, lineHeight: 1 }}>osk</span>
    </span>
  )
}
