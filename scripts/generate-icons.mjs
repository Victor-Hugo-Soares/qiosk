/**
 * Gera ícones PNG para o PWA a partir do favicon.svg.
 * Roda automaticamente antes do build via `prebuild`.
 *
 * Saída:
 *   public/icons/icon-192.png   → Android / Chrome PWA
 *   public/icons/icon-512.png   → Android splash screen
 *   public/icons/icon-180.png   → iOS apple-touch-icon
 *   public/icons/maskable-512.png → ícone maskable (com safe-zone)
 */

import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = resolve(__dirname, '..')
const svgPath   = resolve(root, 'public', 'favicon.svg')
const outDir    = resolve(root, 'public', 'icons')

mkdirSync(outDir, { recursive: true })

const svg = readFileSync(svgPath, 'utf-8')

// ─── Ícone normal ─────────────────────────────────────────────────────────────

function renderPng(svgString, size) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: size },
  })
  return resvg.render().asPng()
}

// ─── Ícone maskable — fundo laranja preenchendo até as bordas ─────────────────
// Maskable icons precisam de padding (~10%) para a safe-zone de cada plataforma.
// Envolvemos o SVG original num quadrado laranja com 18% de padding.

function maskableSvg(size) {
  const bg    = '#FF6B2B'
  const pad   = Math.round(size * 0.18)
  const inner = size - pad * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <image href="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"
    x="${pad}" y="${pad}" width="${inner}" height="${inner}"/>
</svg>`
}

const ICONS = [
  { file: 'icon-192.png',      size: 192, type: 'normal'    },
  { file: 'icon-512.png',      size: 512, type: 'normal'    },
  { file: 'icon-180.png',      size: 180, type: 'normal'    },
  { file: 'maskable-512.png',  size: 512, type: 'maskable'  },
]

for (const { file, size, type } of ICONS) {
  const source = type === 'maskable' ? maskableSvg(size) : svg
  const png    = renderPng(source, size)
  const dest   = resolve(outDir, file)
  writeFileSync(dest, png)
  console.log(`✓  public/icons/${file}  (${size}×${size})`)
}

console.log('\nPWA icons gerados com sucesso.')
