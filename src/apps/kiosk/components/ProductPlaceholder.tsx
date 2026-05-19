interface Props {
  color: string
  size?: number
  className?: string
}

// Gera um placeholder visual duotone baseado na cor do produto
export default function ProductPlaceholder({ color, size = 80, className = '' }: Props) {
  const id = `grad-${color.replace('#', '')}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id={id} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {/* Base blob */}
      <ellipse cx="40" cy="46" rx="30" ry="22" fill={`url(#${id})`} opacity="0.5" />
      {/* Top bun */}
      <ellipse cx="40" cy="30" rx="24" ry="14" fill={`url(#${id})`} />
      {/* Patty */}
      <rect x="16" y="40" width="48" height="8" rx="4" fill={color} opacity="0.8" />
      {/* Bottom bun */}
      <ellipse cx="40" cy="52" rx="24" ry="10" fill={`url(#${id})`} opacity="0.7" />
      {/* Sesame seeds */}
      <circle cx="34" cy="27" r="2" fill="white" opacity="0.4" />
      <circle cx="42" cy="24" r="1.5" fill="white" opacity="0.4" />
      <circle cx="48" cy="28" r="2" fill="white" opacity="0.4" />
    </svg>
  )
}
