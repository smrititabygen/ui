/**
 * Builds design token outputs from tokens/figma-export.json, a raw variables export
 * from the "Tokens Studio for Figma" plugin (Figma's own Variables REST API requires
 * an Enterprise plan, which this team doesn't have — so tokens are pulled manually via
 * the plugin instead of an automated API fetch).
 *
 * Usage:
 *   1. In Figma, open the Tokens Studio plugin, pull in the local Figma Variables,
 *      and export/download as JSON.
 *   2. Replace tokens/figma-export.json with the new export.
 *   3. Run: npm run sync
 *
 * tokens/figma-export.json has 4 variable collections, each an alias layer on the next:
 *   - Brand  (mode "Value"): raw hex palette — the only collection with literal values.
 *   - Alias  (mode "Mode 1"): references into Brand (e.g. Primary.default -> {Violet.500}).
 *   - Mapped (modes "Light"/"Dark"): semantic roles (Surface/Text/Icon/Border) referencing
 *     Alias (or occasionally Brand directly) — this is where light vs. dark actually differs.
 *   - Responsive (modes "Desktop"/"Mobile"): typography scale — not consumed yet.
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const EXPORT_PATH = resolve(ROOT, 'tokens/figma-export.json')
const TOKENS_PATH = resolve(ROOT, 'tokens/figma-tokens.json')
const OUT = resolve(ROOT, 'tokens/generated')

const skipImport = process.argv.includes('--skip-figma')

// ─── figma-export.json → resolved values ──────────────────────────────────────

// Flattens a nested token tree into { "Surface.page.default": {$value, $type, $collectionName} }
function flattenTokens(node, prefix = []) {
  const out = {}
  for (const [key, val] of Object.entries(node)) {
    if (val && typeof val === 'object' && '$value' in val) {
      out[[...prefix, key].join('.')] = val
    } else if (val && typeof val === 'object') {
      Object.assign(out, flattenTokens(val, [...prefix, key]))
    }
  }
  return out
}

function resolveValue(value, ownCollectionName, resolvedByCollection) {
  if (typeof value !== 'string') return value
  const m = /^\{(.+)\}$/.exec(value)
  if (!m) return value
  const refPath = m[1]
  const table = resolvedByCollection[ownCollectionName]
  if (!table) throw new Error(`Cannot resolve "{${refPath}}" — unknown collection "${ownCollectionName}"`)
  const resolved = table[refPath]
  if (resolved === undefined) throw new Error(`Cannot resolve "{${refPath}}" in collection "${ownCollectionName}"`)
  return resolved.value
}

// Resolves one collection's mode trees into flat { "path.to.token": { value, type } }, keyed by mode name.
function resolveCollection(collectionName, modes, resolvedByCollection) {
  const byMode = {}
  for (const [modeName, tree] of Object.entries(modes)) {
    const flat = flattenTokens(tree)
    const resolved = {}
    for (const [path, token] of Object.entries(flat)) {
      const refCollection = token.$collectionName || collectionName
      const value = resolveValue(token.$value, refCollection, resolvedByCollection)
      resolved[path] = { value, type: token.$type }
    }
    byMode[modeName] = resolved
  }
  return byMode
}

function loadFigmaExport() {
  const raw = JSON.parse(readFileSync(EXPORT_PATH, 'utf-8'))
  const collections = {}
  for (const entry of raw) {
    const [name] = Object.keys(entry)
    collections[name] = entry[name].modes
  }

  const resolvedByCollection = {}
  // Brand has no refs — resolve first so Alias/Mapped can look it up.
  resolvedByCollection.Brand = resolveCollection('Brand', collections.Brand, resolvedByCollection)['Value']
  // Alias refs into Brand.
  resolvedByCollection.Alias = resolveCollection('Alias', collections.Alias, resolvedByCollection)['Mode 1']
  // Mapped refs into Alias (mostly) or Brand directly — has Light/Dark modes.
  const mapped = resolveCollection('Mapped', collections.Mapped, resolvedByCollection)

  return { brand: resolvedByCollection.Brand, mapped }
}

const COLOR_GROUPS = ['grey', 'slate', 'blue', 'red', 'yellow', 'green', 'violet']

function buildColorPalette(brand) {
  const colors = {}
  for (const [path, token] of Object.entries(brand)) {
    if (token.type !== 'color') continue
    const [group, shade] = path.split('.')
    const groupSlug = group.toLowerCase()
    if (!COLOR_GROUPS.includes(groupSlug)) continue
    colors[groupSlug] = colors[groupSlug] ?? {}
    colors[groupSlug][shade] = { $value: token.value, $type: 'color' }
  }
  return colors
}

// Maps Figma's "Mapped" semantic roles onto shadcn's Tailwind v4 CSS variable names.
function buildSemantic(mappedMode, modeName) {
  const get = (path) => mappedMode[path]?.value ?? '#000000'
  // Light mode: Border.neutral.default resolves to Neutral.300 (#9ba3ac), a solid
  // mid-grey that reads as heavy rather than subtle. Overridden to Neutral.100 (the
  // same tier Surface.page.secondary already uses) per explicit design decision —
  // see TOKEN_RULEBOOK.md Section 5. Dark mode's Border.neutral.default (Neutral.800)
  // is left untouched; it's already one step off the near-black background, which is
  // the standard subtle-border pattern for dark UIs.
  const border = modeName === 'Light' ? get('Surface.page.secondary') : get('Border.neutral.default')
  const entries = {
    background:             get('Surface.page.default'),
    foreground:              get('Text.default.Body'),
    card:                    get('Surface.page.base'),
    'card-foreground':       get('Text.default.Body'),
    popover:                 get('Surface.page.default'),
    'popover-foreground':    get('Text.default.Body'),
    primary:                 get('Surface.action.default'),
    'primary-foreground':    get('Text.action.on-color'),
    secondary:               get('Surface.page.secondary'),
    'secondary-foreground':  get('Text.default.Body'),
    muted:                   get('Surface.page.secondary'),
    'muted-foreground':      get('Text.default.placeholder'),
    accent:                  get('Surface.action.default-subtle'),
    'accent-foreground':     get('Text.action.default'),
    destructive:             get('Surface.error.default'),
    'destructive-foreground':get('Text.error.on-color'),
    border,
    input: border,
    ring:                    get('Surface.action.default'),
  }
  const result = {}
  for (const [key, value] of Object.entries(entries)) {
    result[key] = { $value: value, $type: 'color' }
  }
  return result
}

function importFigmaExport() {
  console.log('Reading tokens/figma-export.json...')
  const { brand, mapped } = loadFigmaExport()

  const tokens = {
    color: buildColorPalette(brand),
    semantic: {},
  }

  for (const [modeName, mappedMode] of Object.entries(mapped)) {
    tokens.semantic[modeName.toLowerCase()] = buildSemantic(mappedMode, modeName)
  }

  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2) + '\n')
  const modeNames = Object.keys(mapped)
  console.log(`✓ Wrote tokens/figma-tokens.json — colors: ${Object.keys(tokens.color).length} groups, semantic modes: ${modeNames.join(', ')}`)
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

function readSemantic(modeName) {
  const tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
  const source = tokens.semantic?.[modeName]
  if (!source) return null
  const semantic = {}
  for (const [key, token] of Object.entries(source)) {
    semantic[key] = token.$value
  }
  return semantic
}

function buildCss(colors, lightSemantic, darkSemantic) {
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

  const emitSemanticBlock = (selector, semantic) => {
    let block = `\n${selector} {\n`
    for (const [key, value] of Object.entries(semantic)) {
      block += `  --${key}: ${value};\n`
    }
    block += `  --radius: 0.5rem;\n}\n`
    return block
  }

  css += `
/*
 * Shadcn/ui compatibility — full color values resolved from Figma's Light/Dark
 * semantic mapping (Mapped collection). Matches shadcn's Tailwind v4 convention
 * (values used directly, e.g. var(--primary)). Do not edit manually — regenerated
 * by npm run sync.
 */`
  css += emitSemanticBlock(':root', lightSemantic)
  if (darkSemantic) {
    css += emitSemanticBlock('.dark', darkSemantic)
  }

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
          background:  'var(--background)',
          foreground:  'var(--foreground)',
          card:        { DEFAULT: 'var(--card)',        foreground: 'var(--card-foreground)' },
          popover:     { DEFAULT: 'var(--popover)',     foreground: 'var(--popover-foreground)' },
          primary:     { DEFAULT: 'var(--primary)',     foreground: 'var(--primary-foreground)' },
          secondary:   { DEFAULT: 'var(--secondary)',   foreground: 'var(--secondary-foreground)' },
          muted:       { DEFAULT: 'var(--muted)',       foreground: 'var(--muted-foreground)' },
          accent:      { DEFAULT: 'var(--accent)',      foreground: 'var(--accent-foreground)' },
          destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
          border: 'var(--border)',
          input:  'var(--input)',
          ring:   'var(--ring)',
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

// semantic here is exactly the same resolved { light, dark } data buildCss() uses for
// variables.css — no separate derivation, so this can never drift out of sync with the CSS.
function buildJsTokens(colors, lightSemantic, darkSemantic) {
  return (
    `/** Auto-generated — run npm run sync to update */\n` +
    `export const colors = ${JSON.stringify(colors, null, 2)}\n\n` +
    `export const semantic = ${JSON.stringify({ light: lightSemantic, dark: darkSemantic }, null, 2)}\n`
  )
}

function buildTokens() {
  const colors = readColors()
  const lightSemantic = readSemantic('light')
  const darkSemantic = readSemantic('dark')

  if (!lightSemantic) {
    throw new Error('tokens/figma-tokens.json has no "light" semantic mode — run npm run sync (without --skip-figma) first.')
  }

  writeFileSync(`${OUT}/variables.css`,      buildCss(colors, lightSemantic, darkSemantic))
  writeFileSync(`${OUT}/tailwind-preset.js`, buildTailwindPreset(colors))
  writeFileSync(`${OUT}/tokens.js`,          buildJsTokens(colors, lightSemantic, darkSemantic))
  console.log('✓ Generated tokens/generated/ (variables.css, tailwind-preset.js, tokens.js)')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  if (!skipImport) {
    importFigmaExport()
  } else {
    console.log('Skipping figma-export.json import (--skip-figma), rebuilding from existing tokens...')
  }
  buildTokens()
  console.log('\nDone. Next steps:')
  console.log('  git diff tokens/         — review what changed')
  console.log('  npm version patch        — bump version before publishing')
}

try {
  main()
} catch (err) {
  console.error('\nError:', err.message)
  process.exit(1)
}
