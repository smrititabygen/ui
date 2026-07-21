/**
 * Syncs design tokens from the Figma design system file into tokens/figma-tokens.json,
 * then runs Style Dictionary to regenerate all token outputs.
 *
 * Usage:
 *   npm run sync                  # pull from Figma + rebuild
 *   npm run build:tokens          # rebuild from existing figma-tokens.json only
 *
 * Requires:
 *   FIGMA_ACCESS_TOKEN env var — generate at figma.com → Account Settings → Personal access tokens
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import StyleDictionary from 'style-dictionary'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TOKENS_PATH = resolve(ROOT, 'tokens/figma-tokens.json')
const FIGMA_FILE_KEY = 'G5CXMiT17Rt3Z6U1StnLrd'

const skipFigma = process.argv.includes('--skip-figma')

// ─── Figma → W3C design tokens ───────────────────────────────────────────────

function rgbaToHex(r, g, b, a = 1) {
  const ch = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
  const hex = `#${ch(r)}${ch(g)}${ch(b)}`
  return a < 1 ? `${hex}${ch(a)}` : hex
}

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

// ─── Style Dictionary build ───────────────────────────────────────────────────

async function buildTokens() {
  const { default: config } = await import('../style-dictionary.config.mjs')
  const sd = new StyleDictionary(config)
  await sd.buildAllPlatforms()
  console.log('✓ Generated tokens/generated/ (tailwind-preset.js, variables.css, tokens.js)')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!skipFigma) {
    await pullFromFigma()
  } else {
    console.log('Skipping Figma fetch (--skip-figma), rebuilding from existing tokens...')
  }
  await buildTokens()
  console.log('\nDone. Next steps:')
  console.log('  git diff tokens/         — review what changed')
  console.log('  npm run dev              — check Storybook visually')
  console.log('  npm version patch        — bump version before publishing')
}

main().catch((err) => {
  console.error('\nError:', err.message)
  process.exit(1)
})
