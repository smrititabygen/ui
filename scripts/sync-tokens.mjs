/**
 * Syncs design tokens from the Figma design system file into tokens/figma-tokens.json,
 * then generates all token outputs directly from that JSON.
 *
 * Usage:
 *   npm run sync                  # pull from Figma + rebuild
 *   npm run build:tokens          # rebuild from existing figma-tokens.json only
 *
 * Requires:
 *   FIGMA_ACCESS_TOKEN env var — generate at figma.com → Account Settings → Personal access tokens
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TOKENS_PATH = resolve(ROOT, 'tokens/figma-tokens.json')
const OUT = resolve(ROOT, 'tokens/generated')
const FIGMA_FILE_KEY = 'G5CXMiT17Rt3Z6U1StnLrd'

const skipFigma = process.argv.includes('--skip-figma')

// ─── Color utilities ──────────────────────────────────────────────────────────

function rgbaToHex(r, g, b, a = 1) {
  const ch = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
  const hex = `#${ch(r)}${ch(g)}${ch(b)}`
  return a < 1 ? `${hex}${ch(a)}` : hex
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

// ─── Figma → figma-tokens.json ────────────────────────────────────────────────

function setNested(obj, path, value) {
  const parts = path.map((p) => p.toLowerCase().replace(/\s+/g, '-'))
  let cursor = obj
  for (let i = 0; i < parts.length - 1; i++) {
    cursor[parts[i]] = cursor[parts[i]] ?? {}
    cursor = cursor[parts[i]]
  }
  cursor[parts[parts.length - 1]] = value
}

async function fetchFigmaVariables(token) {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`
  const res = await fetch(url, { headers: { 'X-Figma-Token': token } })

  if (res.status === 403) throw new Error('Invalid FIGMA_ACCESS_TOKEN — check it at figma.com → Account Settings → Personal access tokens')
  if (res.status === 404) throw new Error(`Figma file not found: ${FIGMA_FILE_KEY}`)
  if (!res.ok) throw new Error(`Figma API error ${res.status}: ${await res.text()}`)

  return res.json()
}

async function pullFromFigma() {
  const token = process.env.FIGMA_ACCESS_TOKEN
  if (!token) {
    throw new Error(
      'FIGMA_ACCESS_TOKEN is not set.\n' +
      'Generate one at figma.com → Account Settings → Personal access tokens\n' +
      'Then: export FIGMA_ACCESS_TOKEN=your_token'
    )
  }

  console.log('Fetching variables from Figma...')
  const data = await fetchFigmaVariables(token)

  const { variables, variableCollections } = data.meta
  const tokens = {}
  let count = 0

  for (const collection of Object.values(variableCollections)) {
    const defaultModeId = collection.defaultModeId
    for (const variableId of collection.variableIds) {
      const variable = variables[variableId]
      if (!variable) continue
      const modeValue = variable.resolvedValuesByMode?.[defaultModeId]
      if (!modeValue?.resolvedValue) continue
      const parts = variable.name.split('/')
      const rv = modeValue.resolvedValue
      let entry
      if (variable.resolvedType === 'COLOR') {
        entry = { $value: rgbaToHex(rv.r, rv.g, rv.b, rv.a), $type: 'color' }
      } else if (variable.resolvedType === 'FLOAT') {
        entry = { $value: rv, $type: 'number' }
      } else if (variable.resolvedType === 'STRING') {
        entry = { $value: rv, $type: 'string' }
      } else {
        continue
      }
      setNested(tokens, parts, entry)
      count++
    }
  }

  if (count === 0) {
    console.warn(
      'Warning: No Figma variables found in this file.\n' +
      'Make sure you have defined variables in Figma (not just color styles).\n' +
      'Keeping existing tokens/figma-tokens.json unchanged.'
    )
    return false
  }

  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2) + '\n')
  console.log(`✓ Wrote ${count} tokens to tokens/figma-tokens.json`)
  return true
}

// ─── figma-tokens.json → generated files ─────────────────────────────────────

function readColors() {
  const tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
  const colors = {}
  for (const [group, shades] of Object.entries(tokens.color ?? {})) {
    colors[group] = {}
    for (const [shade, token] of Object.entries(shades)) {
      colors[group][shade] = token.$value
    }
  }
  return colors
}

function buildCss(colors) {
  const labels = {
    grey:   'Grey',
    slate:  'Slate',
    blue:   'Blue',
    red:    'Red',
    yellow: 'Yellow',
    green:  'Green',
    violet: 'Violet — primary brand',
  }

  let css = '/** Auto-generated — run npm run sync to update */\n\n:root {\n'
  for (const [group, shades] of Object.entries(colors)) {
    css += `  /* ── ${(labels[group] ?? group).padEnd(28)} */\n`
    for (const [shade, hex] of Object.entries(shades)) {
      css += `  --tg-color-${group}-${shade}: ${hex};\n`
    }
    css += '\n'
  }
  css = css.trimEnd() + '\n}\n'

  const p = (group, shade) => colors[group]?.[shade] ?? '#000000'
  const primary     = p('violet', '500')
  const fg          = p('slate',  '900')
  const secondaryBg = p('slate',  '100')
  const mutedFg     = p('slate',  '500')
  const accentBg    = p('violet', '100')
  const accentFg    = p('violet', '700')
  const destructive = p('red',    '500')
  const border      = p('slate',  '200')

  css += `
/*
 * Shadcn/ui compatibility — raw HSL channel values, auto-computed from brand tokens.
 * Shadcn's Tailwind config wraps these in hsl(), e.g. hsl(var(--primary)).
 * Do not edit manually — regenerated by npm run sync.
 */
:root {
  --background:             0 0% 100%;
  --foreground:             ${hexToHsl(fg)};
  --card:                   0 0% 100%;
  --card-foreground:        ${hexToHsl(fg)};
  --popover:                0 0% 100%;
  --popover-foreground:     ${hexToHsl(fg)};
  --primary:                ${hexToHsl(primary)};
  --primary-foreground:     0 0% 100%;
  --secondary:              ${hexToHsl(secondaryBg)};
  --secondary-foreground:   ${hexToHsl(fg)};
  --muted:                  ${hexToHsl(secondaryBg)};
  --muted-foreground:       ${hexToHsl(mutedFg)};
  --accent:                 ${hexToHsl(accentBg)};
  --accent-foreground:      ${hexToHsl(accentFg)};
  --destructive:            ${hexToHsl(destructive)};
  --destructive-foreground: 0 0% 100%;
  --border:                 ${hexToHsl(border)};
  --input:                  ${hexToHsl(border)};
  --ring:                   ${hexToHsl(primary)};
  --radius:                 0.5rem;
}
`
  return css
}

function buildTailwindPreset(colors) {
  const palette = {}
  for (const [group, shades] of Object.entries(colors)) {
    palette[group] = {}
    for (const shade of Object.keys(shades)) {
      palette[group][shade] = `var(--tg-color-${group}-${shade})`
    }
  }

  const preset = {
    theme: {
      extend: {
        colors: {
          ...palette,
          background:  'hsl(var(--background))',
          foreground:  'hsl(var(--foreground))',
          card:        { DEFAULT: 'hsl(var(--card))',        foreground: 'hsl(var(--card-foreground))' },
          popover:     { DEFAULT: 'hsl(var(--popover))',     foreground: 'hsl(var(--popover-foreground))' },
          primary:     { DEFAULT: 'hsl(var(--primary))',     foreground: 'hsl(var(--primary-foreground))' },
          secondary:   { DEFAULT: 'hsl(var(--secondary))',   foreground: 'hsl(var(--secondary-foreground))' },
          muted:       { DEFAULT: 'hsl(var(--muted))',       foreground: 'hsl(var(--muted-foreground))' },
          accent:      { DEFAULT: 'hsl(var(--accent))',      foreground: 'hsl(var(--accent-foreground))' },
          destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
          border: 'hsl(var(--border))',
          input:  'hsl(var(--input))',
          ring:   'hsl(var(--ring))',
        },
        borderRadius: {
          DEFAULT: 'var(--radius)',
          sm:  'calc(var(--radius) - 2px)',
          md:  'var(--radius)',
          lg:  'calc(var(--radius) + 2px)',
          xl:  'calc(var(--radius) + 8px)',
          '2xl': 'calc(var(--radius) + 16px)',
        },
      },
    },
  }

  return `/** Auto-generated — run npm run sync to update */\nexport default ${JSON.stringify(preset, null, 2)}\n`
}

function buildJsTokens(colors) {
  const p = (group, shade) => colors[group]?.[shade] ?? '#000000'
  const semantic = {
    primary:        p('violet', '500'),
    primaryHover:   p('violet', '600'),
    secondary:      p('blue',   '500'),
    secondaryHover: p('blue',   '600'),
    success:        p('green',  '500'),
    error:          p('red',    '500'),
    warning:        p('yellow', '500'),
    textDefault:    p('slate',  '900'),
    textMuted:      p('slate',  '500'),
    borderDefault:  p('slate',  '200'),
  }

  return (
    `/** Auto-generated — run npm run sync to update */\n` +
    `export const colors = ${JSON.stringify(colors, null, 2)}\n\n` +
    `export const semantic = ${JSON.stringify(semantic, null, 2)}\n`
  )
}

function buildTokens() {
  const colors = readColors()
  writeFileSync(`${OUT}/variables.css`,      buildCss(colors))
  writeFileSync(`${OUT}/tailwind-preset.js`, buildTailwindPreset(colors))
  writeFileSync(`${OUT}/tokens.js`,          buildJsTokens(colors))
  console.log('✓ Generated tokens/generated/ (variables.css, tailwind-preset.js, tokens.js)')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!skipFigma) {
    await pullFromFigma()
  } else {
    console.log('Skipping Figma fetch (--skip-figma), rebuilding from existing tokens...')
  }
  buildTokens()
  console.log('\nDone. Next steps:')
  console.log('  git diff tokens/         — review what changed')
  console.log('  npm version patch        — bump version before publishing')
}

main().catch((err) => {
  console.error('\nError:', err.message)
  process.exit(1)
})
