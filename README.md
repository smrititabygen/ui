# @tabygen/ui

Tabygen's global design system — brand tokens today, with components and a shadcn-compatible registry planned, built once here and reused across every Tabygen product. See Status below for what's actually done, and [ARCHITECTURE.md](ARCHITECTURE.md) for the exact token flow end to end.

## Status

🟡 In progress. Tokens (light + dark) and the shadcn/Vite app shell are live; components have not been customized yet.

| Piece | Status | Where |
|---|---|---|
| Design tokens (colors, light + dark) synced from Figma | ✅ Done | [`tokens/`](tokens/), [`scripts/sync-tokens.mjs`](scripts/sync-tokens.mjs) |
| shadcn/ui installed in this repo (Vite + React + Base UI) | ✅ Done | [`components.json`](components.json), [`src/`](src/) |
| Tokens wired into Tailwind v4 / shadcn CSS vars | ✅ Done | [`src/index.css`](src/index.css) |
| Components customized to match Figma | ⬜ Not started | `src/components/ui/` (created by `npx shadcn add`) |
| `registry.json` (makes this pullable by other projects) | ⬜ Not started | — |
| `SKILL.md` documenting the system for consumers | ⬜ Not started | — |
| Test-pulled into a second project to confirm the loop works | ⬜ Not started | — |

## What's here today

A **token pipeline** plus a bare shadcn/Vite app shell — not yet a customized component library. Tokens (currently colors, both Light and Dark; spacing/typography can be added the same way) come from the [Tabygen Figma file](https://www.figma.com/design/G5CXMiT17Rt3Z6U1StnLrd/) and generate three consumable outputs in `tokens/generated/`:

- **`variables.css`** — raw `--tg-color-{group}-{shade}` CSS variables, plus Shadcn/ui-compatible semantic variables (`--primary`, `--background`, `--border`, etc.) resolved from Figma's Light/Dark semantic mapping, in both a `:root` (light) and `.dark` block
- **`tailwind-preset.js`** — a Tailwind theme preset wiring the palette and Shadcn semantic colors into `theme.extend.colors`
- **`tokens.js`** — the same colors as plain JS objects (`colors`, `semantic`) for non-Tailwind consumption

This repo's own `src/index.css` imports `variables.css` directly, so the Vite app dogfoods the same integration a consuming project would use.

### Using the tokens in a product repo

```bash
npm install @tabygen/ui
```

```js
// tailwind.config.js
import tgPreset from '@tabygen/ui/tailwind-preset'
export default {
  presets: [tgPreset],
  // ...
}
```

```css
/* globals.css */
@import '@tabygen/ui/variables.css';
```

### Updating tokens from Figma

Figma's Variables REST API requires an Enterprise plan (Tabygen is on Professional), so tokens are pulled manually via a plugin instead of an automated API fetch:

1. In Figma, open the Tabygen design system file.
2. Open the **Tokens Studio for Figma** plugin (Resources → Plugins) and pull in the local Figma Variables.
3. Export/download as JSON, and replace [`tokens/figma-export.json`](tokens/figma-export.json) with it.
4. Run:
   ```bash
   npm run sync         # resolve figma-export.json + regenerate outputs
   git diff tokens/      # review what changed
   npm version patch     # bump before publishing
   ```

`tokens/figma-export.json` is the raw plugin export (4 variable collections: `Brand` → raw hex palette, `Alias` → references into `Brand`, `Mapped` → Light/Dark semantic roles referencing `Alias`, `Responsive` → typography scale, not yet consumed). `scripts/sync-tokens.mjs` resolves that alias chain into `tokens/figma-tokens.json`, then generates the outputs below.

To just regenerate outputs from the existing `tokens/figma-tokens.json` without re-resolving `figma-export.json`:

```bash
npm run build:tokens
```

Publishing happens automatically via [`.github/workflows/publish.yml`](.github/workflows/publish.yml) whenever a `v*` tag is pushed, to GitHub Packages (`@tabygen` scope — see [`.npmrc`](.npmrc)).

## Roadmap — what's left

**Why shadcn/ui, briefly:** shadcn isn't an npm-installed component library. Its CLI *copies* component source (Button, Input, Card, …) into whichever repo you run it in. You then own and edit that code. That's why the components live here, in this repo, styled with the tokens above — and why a **registry** (not a package export) is how other projects will pull them.

1. ~~Install shadcn/ui in this repo~~ ✅ Done — Vite + React + Base UI, component source lands in `src/components/ui/` via `npx shadcn add <component>`.
2. ~~Wire Figma tokens into shadcn's CSS variables~~ ✅ Done — `src/index.css` imports `tokens/generated/variables.css`, light + dark both resolved from Figma.
3. **Customize each component to match Figma** — for each component, run `npx shadcn add <name>`, then edit the generated source in `src/components/ui/` so it matches the Tabygen Figma component exactly.
4. **Set up `registry.json`** — turns this repo into a private shadcn registry so other projects can run `npx shadcn add <url>/button` and get *Tabygen's* button, not the generic shadcn one.
5. **Write `SKILL.md`** — documents the system (what components exist, how to install, how tokens map to classes) for both humans and AI agents working in consuming projects.
6. **Test-pull into a second project** (or `jindal-dtms`) — confirms the full loop (tokens → components → registry → consuming app) actually works end to end.

Recommendation: take **one** component through the entire loop (install → customize → registry → pull into a second project) before customizing the rest, so a broken link in the chain surfaces after 1 component instead of 15.
