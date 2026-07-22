# Architecture

How a color in Figma becomes a CSS variable a shadcn component renders with. This is the exact
mechanism, not a simplification — file names and function names below match the real code.

## Token flow, end to end

```
Figma variables (Brand / Alias / Mapped collections, Light + Dark modes)
        │  manual export — see "Why manual" below
        ▼
tokens/figma-export.json          ← raw Tokens Studio for Figma plugin export
        │  scripts/sync-tokens.mjs : importFigmaExport()
        ▼
tokens/figma-tokens.json          ← resolved: alias chains flattened to literal hex values
        │  scripts/sync-tokens.mjs : buildTokens()
        ▼
tokens/generated/variables.css    ← CSS custom properties (--tg-color-*, --background, --primary, ...)
tokens/generated/tailwind-preset.js
tokens/generated/tokens.js
        │  src/index.css : @import "../tokens/generated/variables.css"
        ▼
shadcn components (src/components/ui/*.tsx) — read the CSS variables via Tailwind
utility classes like bg-primary, text-foreground, border-border
```

### Step 1 — Figma → `tokens/figma-export.json`

Figma's Variables REST API requires an Enterprise plan; Tabygen is on Professional, so this step
is manual, not an API call:

1. In Figma, open the Tokens Studio for Figma plugin and pull in the local Figma Variables.
2. Export as JSON and replace `tokens/figma-export.json` with it.

That file has 4 variable collections, each an alias layer on the next:

- **`Brand`** (mode `"Value"`) — the only collection with literal values. Raw hex palette (7
  groups × 9 shades: grey, slate, blue, red, yellow, green, violet), plus `Foundations`
  (white/black), `Font Style`, `Font Weight`, `Scale`, `Border Width`, `Border Radius`.
- **`Alias`** (mode `"Mode 1"`) — references into `Brand`, e.g. `Primary.default → {Violet.500}`.
- **`Mapped`** (modes `"Light"` / `"Dark"`) — semantic roles (`Surface`, `Text`, `Icon`, `Border`)
  referencing `Alias` (occasionally `Brand` directly). This is where light vs. dark actually
  diverges — same role name, different resolved value per mode.
- **`Responsive`** (modes `"Desktop"` / `"Mobile"`) — typography scale. Not consumed yet (see
  Scope below).

### Step 2 — `tokens/figma-export.json` → `tokens/figma-tokens.json`

Run via `npm run sync`. `scripts/sync-tokens.mjs`'s `importFigmaExport()` resolves the alias
chain — each token's `$value` is either a literal or a `{Path.To.Token}` reference tagged with
`$collectionName`, telling the resolver which collection to look the reference up in. Resolution
order: `Brand` first (no refs) → `Alias` (refs into `Brand`) → `Mapped` (refs into `Alias`,
producing separate `Light` and `Dark` resolved trees).

The output, `tokens/figma-tokens.json`, has two top-level sections:
- `color` — the raw `Brand` palette, unchanged shape: `color.{group}.{shade}.$value`.
- `semantic` — `semantic.light.*` and `semantic.dark.*`, ~19 keys each (`background`,
  `foreground`, `primary`, `primary-foreground`, `secondary`, ... `border`, `input`, `ring`),
  built by `buildSemantic()` mapping specific `Mapped` paths onto shadcn's variable names — e.g.
  `background` ← `Surface.page.default`, `primary` ← `Surface.action.default`,
  `muted-foreground` ← `Text.default.placeholder`. See that function for the full mapping.

### Step 3 — `tokens/figma-tokens.json` → `tokens/generated/*`

Also part of `npm run sync` (or `npm run build:tokens` to skip re-resolving the Figma export and
just regenerate from the existing `figma-tokens.json`). `buildTokens()` calls three generators,
all reading the *same* resolved `color`/`semantic` data — no separate hardcoded logic anywhere
in this step:

- **`buildCss()`** → `variables.css` — `--tg-color-{group}-{shade}` for the raw palette, then a
  `:root { }` block (light semantic vars) and a `.dark { }` block (dark semantic vars), each
  holding full hex values directly (shadcn's Tailwind v4 convention — no `hsl()` wrapping).
- **`buildTailwindPreset()`** → `tailwind-preset.js` — a Tailwind theme preset, for projects using
  a JS-based Tailwind config instead of importing `variables.css` directly.
- **`buildJsTokens()`** → `tokens.js` — `colors` and `semantic: { light, dark }` as plain JS
  objects, for non-Tailwind consumption.

### Step 4 — `tokens/generated/variables.css` → shadcn components

`src/index.css` imports `variables.css` directly (`@import "../tokens/generated/variables.css"`),
so this repo's own app consumes tokens the same way an external product project would. shadcn
components (`src/components/ui/*.tsx`) never reference hex values — they use Tailwind utility
classes (`bg-primary`, `text-primary-foreground`, `border-border`, …) that resolve to these CSS
variables via the `@theme inline` mapping shadcn generated in `src/index.css`.

## What's Figma-sourced vs. still shadcn-default

**From Figma** (flows through the pipeline above):
- `--tg-color-{grey,slate,blue,red,yellow,green,violet}-{100...900}` — 63 raw palette variables
- `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`,
  `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`,
  `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`,
  `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring` — each in both
  light (`:root`) and dark (`.dark`) form
- Font family (`--font-sans` / `--font-heading` = `'Inter Variable'`) — matches Figma's
  `Font Style: Inter` token, but this is currently a **manual match**, not piped through the sync
  script. `sync-tokens.mjs` doesn't read `Font Style` at all yet (see Scope below) — someone
  edited `src/index.css` by hand to agree with what Figma says. If Figma's font token changes,
  this won't update automatically.

**Still shadcn's own defaults** (no Figma token exists for these yet):
- `--radius` — hardcoded `0.5rem` in `buildCss()`, not derived from Figma's `Border Radius` scale
  (which exists in `figma-export.json` but isn't read by the sync script)
- `--radius-sm/md/lg/xl/2xl/3xl/4xl` — all computed from `--radius` above, so also not Figma-derived
- `--chart-1` through `--chart-5` (light + dark) — shadcn's placeholder `oklch(...)` values
- `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`,
  `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`
  (light + dark) — shadcn's placeholder `oklch(...)` values
- **Every component's geometry** — padding, height per size, gap spacing, border-radius per size,
  font-weight, icon sizing (see e.g. `src/components/ui/button.tsx`) — 100% shadcn Base UI
  "Nova" preset defaults
- Icon library (Lucide) — a shadcn preset choice; Figma has no icon-library token to compare
  against

## Scope boundary — read before "fixing" anything here

**Only color tokens are synced from Figma right now.** Component geometry — padding, radius,
spacing, font-weight — is intentionally left as shadcn's defaults until deliberate design
decisions get made on them.

This is a **deliberate boundary, not a gap**. Don't "fix" this by wiring up `Scale`, `Border
Width`, `Border Radius`, `Font Weight`, or the `Responsive` typography collection without an
explicit decision to expand scope — all of that data already exists in `tokens/figma-export.json`
(it was included in the plugin export) and could be synced the same way colors are, but doing so
without a design decision first would silently overwrite whatever spacing/radius values get
chosen later.
