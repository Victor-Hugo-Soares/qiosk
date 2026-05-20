/**
 * QIOSK — Custom SVG Icon Set
 * Todos os ícones desenhados do zero para a identidade visual do QIOSK.
 * Estilo: stroke-based, 24×24 viewBox, warm & friendly.
 */

import type { CSSProperties } from 'react'

export interface IconProps {
  size?:        number
  color?:       string
  strokeWidth?: number
  style?:       CSSProperties
  className?:   string
}

// ─── Categorias ───────────────────────────────────────────────────────────────

/** Ícone de lanche / hamburguer */
export function BurgerIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* cúpula do pão */}
      <path d="M5 11C5 7.4 8.1 5 12 5C15.9 5 19 7.4 19 11"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      {/* gergelim */}
      <circle cx="9.5" cy="8.2" r="0.9" fill={color}/>
      <circle cx="13.8" cy="7.2" r="0.9" fill={color}/>
      {/* base do pão */}
      <path d="M4.5 11H19.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* alface (onda) */}
      <path d="M3.5 13.8Q6 12.3 8.5 13.8Q11 15.3 13.5 13.8Q16 12.3 18.5 13.8Q19.8 14.4 21 13.8"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      {/* blend */}
      <rect x="4" y="15" width="16" height="2.4" rx="1.2" stroke={color} strokeWidth={strokeWidth}/>
      {/* pão de baixo */}
      <path d="M5 17.4H19C19 17.4 21 17.4 21 19C21 20.6 17.8 21 12 21C6.2 21 3 20.6 3 19C3 17.4 5 17.4 5 17.4Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    </svg>
  )
}

/** Ícone de bebida / copo com canudo */
export function DrinkIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* corpo do copo (afunilado) */}
      <path d="M7.5 8L6 19C6 20.1 7 21 8.2 21H15.8C17 21 18 20.1 18 19L16.5 8Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {/* tampa */}
      <path d="M7 8C7 6.9 9.2 6 12 6C14.8 6 17 6.9 17 8"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* canudo */}
      <path d="M15.5 3L13.5 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* gelo */}
      <rect x="8" y="13" width="3" height="3" rx="0.7"
        stroke={color} strokeWidth={1.4}/>
    </svg>
  )
}

/** Ícone de porções / batata frita */
export function FriesIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* caixinha */}
      <path d="M8 12H16L14.5 21H9.5L8 12Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {/* dobra da caixa */}
      <path d="M7.2 13.8H16.8" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity="0.45"/>
      {/* batatas — 3 palitos */}
      <rect x="8.5" y="4.5" width="2" height="7.5" rx="1"
        stroke={color} strokeWidth={strokeWidth}/>
      <rect x="11" y="3.5" width="2" height="8.5" rx="1"
        stroke={color} strokeWidth={strokeWidth}/>
      <rect x="13.5" y="4.5" width="2" height="7.5" rx="1"
        stroke={color} strokeWidth={strokeWidth}/>
    </svg>
  )
}

/** Ícone de sobremesa / sorvete */
export function IceCreamIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* casquinha (triângulo arredondado) */}
      <path d="M9.5 15L12 22L14.5 15"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round"/>
      {/* linha cone encontra bola */}
      <path d="M9.5 15H14.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* risca da casquinha */}
      <path d="M11.2 17.5L12 22" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity="0.35"/>
      {/* bola de sorvete */}
      <circle cx="12" cy="11.5" r="3.8" stroke={color} strokeWidth={strokeWidth}/>
      {/* espiral */}
      <path d="M10.5 11.5Q12 9.5 13.5 11.5" stroke={color} strokeWidth={1.25} strokeLinecap="round"/>
      {/* cereja */}
      <circle cx="12" cy="7.2" r="1.3" stroke={color} strokeWidth={1.4}/>
      {/* cabinho cereja */}
      <path d="M12 5.9C12 4.8 13.5 4.3 13.8 5.2"
        stroke={color} strokeWidth={1.4} strokeLinecap="round"/>
    </svg>
  )
}

// ─── Header / Navegação ───────────────────────────────────────────────────────

/** Seta para voltar */
export function BackArrowIcon({ size = 24, color = 'currentColor', strokeWidth = 2, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M19 12H5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M10 7L5 12L10 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/** Sacola / carrinho */
export function CartIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* corpo da sacola */}
      <path d="M5.5 8H18.5L17.2 19.8C17.1 20.5 16.5 21 15.8 21H8.2C7.5 21 6.9 20.5 6.8 19.8Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {/* alças */}
      <path d="M9.5 8C9.5 5.5 10.5 4 12 4C13.5 4 14.5 5.5 14.5 8"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* detalhe interno */}
      <path d="M10 14H14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  )
}

/** Grid 2×2 — "ver tudo" */
export function AllMenuIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <rect x="3"  y="3"  width="8" height="8" rx="2.5" stroke={color} strokeWidth={strokeWidth}/>
      <rect x="13" y="3"  width="8" height="8" rx="2.5" stroke={color} strokeWidth={strokeWidth}/>
      <rect x="3"  y="13" width="8" height="8" rx="2.5" stroke={color} strokeWidth={strokeWidth}/>
      <rect x="13" y="13" width="8" height="8" rx="2.5" stroke={color} strokeWidth={strokeWidth}/>
    </svg>
  )
}

/** Chevron direita */
export function ChevronRightIcon({ size = 24, color = 'currentColor', strokeWidth = 2, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M9 6L15 12L9 18"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── Detalhe do Produto ───────────────────────────────────────────────────────

/** Carne / ponto da carne — bife com grelha (filled para legibilidade) */
export function SteakIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* corpo do bife preenchido */}
      <path d="M3 13C3 9 6 7 10 7C12 7 13.5 8.5 15.5 8.5C17.5 8.5 19 7.5 21 9.5C22 11 21.5 14.5 19.5 16C17.5 17.5 14.5 18 10 18C5.5 18 3 17 3 13Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {/* grelha — 3 linhas diagonais bem espaçadas */}
      <path d="M7.5 11L9.5 14.5"  stroke={color} strokeWidth={2}   strokeLinecap="round"/>
      <path d="M11  10L13  13.5"  stroke={color} strokeWidth={2}   strokeLinecap="round"/>
      <path d="M14.5 9.5L16 13"  stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
    </svg>
  )
}

/**
 * Corte transversal de carne — ícone de ponto da carne.
 * crustColor = cor da crosta externa
 * innerColor = cor do interior (varia conforme o ponto)
 */
export function MeatSliceIcon({
  size = 24,
  crustColor = '#A0522D',
  innerColor = '#DC143C',
  style,
  className,
}: Omit<IconProps, 'color' | 'strokeWidth'> & { crustColor?: string; innerColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className}>
      {/* crosta externa (bife grelhado) */}
      <ellipse cx="12" cy="12.5" rx="9.5" ry="8.5" fill={crustColor}/>
      {/* interior do bife — cor do ponto */}
      <ellipse cx="12" cy="12.5" rx="6.5" ry="5.8" fill={innerColor}/>
      {/* marmoreio (gordura) — linhas brancas suaves */}
      <path d="M9 10.5Q11 11 10.5 13"   stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      <path d="M13 11Q15 11.5 14.5 13.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1"   strokeLinecap="round" fill="none"/>
    </svg>
  )
}

/** Estrela / adicionais */
export function SparkleIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* estrela de 4 pontas */}
      <path d="M12 2.5L13.6 9.4L20.5 12L13.6 14.6L12 21.5L10.4 14.6L3.5 12L10.4 9.4Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {/* faíscas pequenas */}
      <path d="M20 3L20.6 5.4L23 6L20.6 6.6L20 9L19.4 6.6L17 6L19.4 5.4Z"
        stroke={color} strokeWidth={1.2} strokeLinejoin="round"/>
    </svg>
  )
}

/** Lápis / observações */
export function PencilIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* corpo do lápis */}
      <path d="M3 21L4.5 15.5L16.5 3.5C17.3 2.7 18.5 2.7 19.3 3.5L20.5 4.7C21.3 5.5 21.3 6.7 20.5 7.5L8.5 19.5Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {/* linha diagonal (grafite) */}
      <path d="M15 5L19 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* borracha */}
      <path d="M3 21L6.5 19.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  )
}

/** Cadeado — loja fechada */
export function LockIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* corpo */}
      <rect x="5" y="11" width="14" height="11" rx="3"
        stroke={color} strokeWidth={strokeWidth}/>
      {/* arco */}
      <path d="M8 11V7.5C8 5.6 9.8 4 12 4C14.2 4 16 5.6 16 7.5V11"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* buraco da fechadura */}
      <circle cx="12" cy="16.5" r="1.5" stroke={color} strokeWidth={strokeWidth}/>
      <path d="M12 18V20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  )
}

// ─── Controles (Carrinho) ─────────────────────────────────────────────────────

/** Plus */
export function PlusIcon({ size = 24, color = 'currentColor', strokeWidth = 2.5, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M12 5V19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  )
}

/** Minus */
export function MinusIcon({ size = 24, color = 'currentColor', strokeWidth = 2.5, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  )
}

/** Lixeira */
export function TrashIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* barra superior */}
      <path d="M4 7H20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* alça */}
      <path d="M10 4H14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* corpo */}
      <path d="M6 7L7 20H17L18 7" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {/* riscos internos */}
      <path d="M10 11L10.5 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M14 11L13.5 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  )
}

// ─── Pagamento ────────────────────────────────────────────────────────────────

/**
 * PIX — símbolo real: 4 formas arredondadas giradas 45°.
 * Usa fill (não stroke) para fidelidade ao logo.
 */
export function PixIcon({ size = 24, color = 'currentColor', style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className}>
      <g transform="rotate(45 12 12)">
        {/* pétala de cima */}
        <rect x="10.5" y="2.5"  width="3" height="7.5" rx="1.5" fill={color}/>
        {/* pétala de baixo */}
        <rect x="10.5" y="14"   width="3" height="7.5" rx="1.5" fill={color}/>
        {/* pétala esquerda */}
        <rect x="2.5"  y="10.5" width="7.5" height="3" rx="1.5" fill={color}/>
        {/* pétala direita */}
        <rect x="14"   y="10.5" width="7.5" height="3" rx="1.5" fill={color}/>
      </g>
    </svg>
  )
}

/** Cartão de crédito/débito com chip */
export function CardPayIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* corpo do cartão */}
      <rect x="2" y="5" width="20" height="14" rx="2.5"
        stroke={color} strokeWidth={strokeWidth}/>
      {/* tarja magnética */}
      <path d="M2 9.5H22" stroke={color} strokeWidth={strokeWidth}/>
      {/* chip EMV */}
      <rect x="4.5" y="13" width="5" height="3.5" rx="1"
        stroke={color} strokeWidth={1.4}/>
      <path d="M7 13V16.5" stroke={color} strokeWidth={1.25} strokeLinecap="round"/>
      <path d="M4.5 14.75H9.5" stroke={color} strokeWidth={1.25} strokeLinecap="round"/>
      {/* pontinhos do número */}
      <circle cx="14"   cy="15" r="0.9" fill={color}/>
      <circle cx="16.5" cy="15" r="0.9" fill={color}/>
      <circle cx="19"   cy="15" r="0.9" fill={color}/>
    </svg>
  )
}

/** Cédula / dinheiro em espécie */
export function CashIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* cédula */}
      <rect x="2" y="6" width="20" height="12" rx="2"
        stroke={color} strokeWidth={strokeWidth}/>
      {/* círculo do valor */}
      <circle cx="12" cy="12" r="3.5"
        stroke={color} strokeWidth={strokeWidth}/>
      {/* símbolo $ */}
      <path d="M12 9.5V14.5" stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
      <path d="M10.5 10.8H12.8C13.5 10.8 14 11.3 14 12C14 12.7 13.5 13.2 12.8 13.2H10.5"
        stroke={color} strokeWidth={1.35} strokeLinecap="round"/>
      {/* detalhes dos cantos */}
      <path d="M2 9.5H5"   stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity="0.45"/>
      <path d="M19 9.5H22" stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity="0.45"/>
      <path d="M2 14.5H5"  stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity="0.45"/>
      <path d="M19 14.5H22" stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity="0.45"/>
    </svg>
  )
}

/** Ícone de sacola vazia (carrinho vazio) */
export function EmptyBagIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      {/* corpo */}
      <path d="M4.5 7H19.5L18 20.5C17.9 21.3 17.2 22 16.4 22H7.6C6.8 22 6.1 21.3 6 20.5Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
      {/* alças */}
      <path d="M9 7C9 4.2 10.2 3 12 3C13.8 3 15 4.2 15 7"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* X no meio */}
      <path d="M10 13L14 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M14 13L10 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  )
}

/** X / fechar */
export function CloseIcon({ size = 24, color = 'currentColor', strokeWidth = 2, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M6 6L18 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M18 6L6 18"  stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  )
}

/** Check / confirmado */
export function CheckIcon({ size = 24, color = 'currentColor', strokeWidth = 2.5, style, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path d="M5 13L9.5 17.5L19 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
