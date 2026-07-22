# Tabygen UI — Design Token Rulebook

This document defines, property by property, what comes from Figma (`tabygen-ui`'s
source of truth) and what stays as a shadcn default, for every component built or
edited in this repo. Claude Code must check this file before editing any component
in `components/ui/`.

**Core principle:** never guess. If a property isn't listed below as "Figma-sourced,"
it stays exactly as shadcn's default — do not invent a value, do not eyeball one from
a screenshot, do not carry one over from a different community library. If a property
isn't covered by this document at all, stop and ask before touching it.

---

## 1. Figma-sourced — always use these, never shadcn's default

These have a real value defined in `tokens/figma-tokens.json` / `variables.css`, and
components must reference the corresponding CSS variable, never a hardcoded value.

| Property | Figma source | CSS variable(s) |
|---|---|---|
| All semantic colors (light + dark) | `semantic.light` / `semantic.dark` | `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring` (19 keys total — not all are literal `DEFAULT`/`foreground` pairs) |
| Raw brand palette | `color` (grey/slate/blue/red/yellow/green/violet, 9 shades each) | used only as the source that semantic tokens alias — components should reference semantic tokens, not raw palette shades, directly |

**Rule:** any time a component's color changes, it must be because a CSS variable's
*value* changed upstream (via a Figma re-sync), never because someone edited a
component file directly with a new color.

**Known deliberate remap — light-mode `--border`/`--input`:** Figma's own
`Border.neutral.default` token resolves to `Neutral.300` (`#9ba3ac`), a solid
mid-grey — too heavy for the "clean, minimal, subtle like shadcn" look the design
system is meant to have. Per explicit user decision, `scripts/sync-tokens.mjs`'s
`buildSemantic()` overrides this **in light mode only** to reuse `Neutral.100`
(`#dee0e3`, the same tier `Surface.page.secondary`/`muted` already uses) instead of
following `Border.neutral.default` directly. Dark mode is untouched (still follows
`Border.neutral.default` → `Neutral.800`). This value is still a real, existing Figma
token (Neutral.100) — not invented — just not the one the `Border.neutral.default`
path itself points to. See Section 5 for the full decision record.

**Known gap — muted/secondary backgrounds (`--muted`, `--secondary`):** these use
`Neutral.100` (`#dee0e3`), which is already the *lightest* tier Figma's Slate scale
defines (100–900, no lighter step exists). It reads slightly more saturated than
shadcn's own typical near-white muted background. Per explicit user decision, this is
being left as-is rather than synthesizing an unofficial lighter value — flag to the
Figma design system owner if an even lighter neutral tier is wanted later; do not
invent one locally without a new decision recorded here.

**Membership test for this section:** a property only belongs here if it is actually
present in `tokens/figma-tokens.json` and/or `tokens/generated/variables.css` —
i.e. `scripts/sync-tokens.mjs` reads and emits it. If a value merely *matches* what
Figma says but was typed in by hand somewhere else in the codebase, it belongs in
Section 2, not here (see Font family below).

---

## 2. Defined in Figma, not yet wired in — do not use yet, flag if relevant

These exist as real values in `tokens/figma-export.json` but the sync script doesn't
currently read them. They are **pending, not abandoned** — don't treat them as
permanent shadcn territory, and don't wire them in unilaterally either.

| Property | Figma source | Current status |
|---|---|---|
| Font family | Brand → Font Style (`"Inter"`) | **Manually hand-matched, not pipeline-synced.** `scripts/sync-tokens.mjs`'s `buildColorPalette()` only processes `$type: "color"` tokens — `Font Style` (`$type: "string"`) never reaches `tokens/figma-tokens.json` or `variables.css`. `src/index.css`'s `--font-sans: 'Inter Variable'` was typed in by hand to agree with Figma's value. Unlike the rows below, this one is *already applied* — but there is no automated sync keeping it correct if Figma's font token ever changes. Confirm this has actually been committed before treating it as settled (see repo `git log`). |
| Font weight scale | Brand → Font Weight | unused — components use shadcn's default weights |
| Spacing scale | Brand → Scale (21-step) | unused — components use shadcn's default spacing/padding |
| Border radius scale | Brand → Border Radius | unused — components use shadcn's default radius (**but see the `--radius` anomaly in Section 3 — the current value isn't actually shadcn's default either**) |
| Border width scale | Brand → Border Width | unused — components use shadcn's default border widths |
| Responsive type scale | Responsive collection (Desktop/Mobile, h1–h6, body) | unused — no typography sync exists yet |

**Rule:** if a task would naturally touch one of these (e.g. "make this button's
corners rounder"), Claude Code should say so explicitly — *"this maps to an
already-defined-but-unsynced Figma token (Border Radius) — want me to wire in the
sync for this now, or just adjust this one component's default for now?"* — rather
than quietly doing either.

---

## 3. No Figma equivalent exists — shadcn defaults, permanent until designed otherwise

These have no corresponding Figma token at all right now. Leave them exactly as
shadcn ships them. This is not a gap to fix silently — it's open design space that
needs an actual design decision first.

- Shadow / elevation values
- Animation / transition timing and easing
- Focus ring behavior details (beyond the `--ring` color itself)
- Chart colors (`--chart-1` through `--chart-5`)
- Sidebar colors (`--sidebar-*`)
- Icon library (Lucide) — a shadcn preset choice; no Figma icon-library token exists to compare against
- Per-component geometry: button height per size, internal icon/text gap, exact
  padding values — none of this has a Figma spec; it is shadcn's default until a
  real design decision is made and recorded here

**⚠ Known anomaly — `--radius` is not actually in this category either:**
`--radius: 0.5rem` is hardcoded directly inside `buildCss()` in
`scripts/sync-tokens.mjs`. It is **not** Figma-sourced (no Border Radius sync exists
yet — see Section 2) and it is **not** shadcn's real default either — shadcn's own
scaffold default was `0.625rem`. This value is a leftover placeholder from an earlier
version of the token pipeline, silently overriding what shadcn would otherwise ship.
It doesn't belong in Section 2 (nothing "unwired" — it's actively emitted) or Section
3 (not actually a shadcn default) as currently defined. Do not "fix" this by picking
a new number without a decision — either (a) restore shadcn's real default
(`0.625rem`) as an explicit interim choice until Figma's Border Radius token is
synced, or (b) treat the current `0.5rem` as a deliberate interim decision and record
it in Section 5. Right now it is neither — just an artifact. Flag before touching it,
and record whichever resolution is chosen in Section 5.

---

## 4. Process rules (apply regardless of which section a property falls under)

1. **Never hardcode** a color, spacing, radius, or font value directly in a
   component file. If it's Figma-sourced, reference the CSS variable. If it isn't,
   use shadcn's existing default class/value — don't type a new one in either case.
2. **One component (or a small batch, max ~5) at a time.** Full loop per component:
   build/edit → confirm token bindings are correct → visual check → done — before
   moving to the next.
3. **If unsure which section a property falls into, stop and ask.** Do not default
   to "Figma probably has this" or "shadcn's default is probably fine" without
   checking this document first.
4. **This document is a living record.** Any time scope expands — e.g. spacing or
   radius sync gets built — Section 2's entry moves up to Section 1, and this file
   gets updated in the same change. An out-of-date rulebook is worse than none.
5. **Default policy for every component: keep shadcn's geometry as-is; only
   color and font get checked against Figma.** This applies to all components
   (Button, Input, Card, …), not case-by-case, unless a specific component gets an
   explicit exception recorded in Section 5. In practice this usually means *no
   geometry edits at all* — most components' color/font already flow through
   Tailwind utility classes tied to the CSS variables in Section 1, so there's
   nothing to change beyond confirming that's true.

---

## 5. Component-specific decisions log

Once a real design decision is made for a component (e.g. "Button small = 8px/16px
padding, 6px radius"), record it here — not just in the component file. This is what
lets the *next* component (Input, Card) check for consistency instead of each one
independently reinventing padding/radius/gap choices.

| Component | Property | Decision | Date/session |
|---|---|---|---|
| *(all components)* | Geometry | **Default policy established here:** shadcn's geometry is kept as-is for every component unless a specific exception is recorded below. See process rule 5. | color-token-sync milestone |
| Button | Geometry (height/gap/padding/radius per size, font-weight, icon sizing) | Kept exactly as shadcn's default — no Figma geometry spec exists, and none was requested. First application of the default policy above. | color-token-sync milestone |
| Button | Color | No changes needed — all variants already reference semantic CSS variables (`bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-destructive/10`, etc.), which are Figma-sourced via the token pipeline. | color-token-sync milestone |
| Button | Font | No changes needed — inherits `font-sans` (Inter) from the base layer; no per-component override exists. | color-token-sync milestone |
| Input, Label, Textarea, Card, Badge, Separator, Checkbox, Switch | Geometry | Kept exactly as shadcn's default for all 8 — no Figma geometry spec exists for any of them. Second application of the default policy above. | batch-2 milestone |
| Input, Label, Textarea, Card, Badge, Separator, Checkbox, Switch | Color | No changes needed for any of the 8 — all reference semantic CSS variables (`bg-card`, `border-input`, `bg-muted`, `bg-destructive/10`, `bg-primary`, `border-border`, etc.), Figma-sourced via the token pipeline. | batch-2 milestone |
| Card | Font (`CardTitle`'s `font-heading` class) | Verified, not assumed: `--font-heading: var(--font-sans)` is aliased in `src/index.css:10`, so it resolves to Inter Variable — same as every other component, just via an extra alias hop. No edit needed, but flagged here since `font-heading` doesn't appear in any other component file. | batch-2 milestone |
| Input, Label, Textarea, Badge, Separator, Checkbox, Switch | Font | No changes needed for any of the 7 — inherit `font-sans` (Inter) from the base layer; no per-component override exists. | batch-2 milestone |
| Dialog, Select, Tabs, Avatar, Alert, Tooltip, Radio Group, Skeleton | Geometry | Kept exactly as shadcn's default for all 8 — no Figma geometry spec exists for any of them. Third application of the default policy above. | batch-3 milestone |
| Dialog, Select, Tabs, Avatar, Alert, Tooltip, Radio Group, Skeleton | Color | No changes needed for any of the 8 — all reference semantic CSS variables (`bg-popover`, `bg-accent`, `bg-muted`, `bg-primary`, `bg-foreground`/`text-background` for Tooltip's inverted popup, `bg-card` for Alert, etc.), Figma-sourced via the token pipeline. | batch-3 milestone |
| Dialog, Select, Tabs, Avatar, Alert, Tooltip, Radio Group, Skeleton | Font | No changes needed for any of the 8 — inherit `font-sans`/`font-heading` (both resolve to Inter) from the base layer; no per-component override exists. | batch-3 milestone |
| Dialog | Structure (not geometry/color/font) | Dialog imports Tabygen's own `Button` component internally for its close/footer actions. Registered with `registryDependencies: ["button"]` in `registry.json` so pulling Dialog auto-installs Button too — this is a registry wiring decision, not a token decision, but recorded here since it affects how the component is consumed. | batch-3 milestone |
| Accordion, Alert Dialog, Popover, Dropdown Menu, Progress, Slider, Toggle, Toggle Group, Sonner, Table | Geometry | Kept exactly as shadcn's default for all 10 — no Figma geometry spec exists for any of them. Fourth application of the default policy above. | batch-4 milestone |
| Accordion, Alert Dialog, Popover, Dropdown Menu, Progress, Toggle, Toggle Group, Sonner, Table | Color | No changes needed for 9 of the 10 — all reference semantic CSS variables, Figma-sourced via the token pipeline. | batch-4 milestone |
| **Slider** | Color — **exception, edit made** | shadcn's shipped source hardcoded the thumb as `bg-white`, not a semantic CSS variable — this fails the membership test in Section 1 (not Figma-sourced) and violates process rule 1 (never hardcode a color). Fixed by changing `bg-white` → `bg-background` in `src/components/ui/slider.tsx`, matching how Switch's thumb is already styled elsewhere in this repo. This is the first actual code edit made to a pulled shadcn component (every prior component needed zero edits) — recorded here per process rule 2/5. | batch-4 milestone |
| Alert Dialog | Structure (not geometry/color/font) | Same pattern as Dialog: imports Tabygen's own `Button` internally, registered with `registryDependencies: ["button"]`. | batch-4 milestone |
| Toggle Group | Structure (not geometry/color/font) | Imports `toggleVariants` from the Toggle component file directly (not just a registry link) — registered with `registryDependencies: ["toggle"]` so the source file is guaranteed present, not just the variants export. | batch-4 milestone |
| Dialog, Alert Dialog, Accordion | Font (`font-heading` on Title components) | No changes needed — same `--font-heading: var(--font-sans)` alias already verified for Card in batch 2. | batch-4 milestone |
| Input, Label, Textarea, Card, Badge, Separator, Checkbox, Switch, Dialog, Select, Tabs, Avatar, Alert, Tooltip, Radio Group, Skeleton, Accordion, Popover, Dropdown Menu, Progress, Toggle, Toggle Group, Table | Font | No changes needed — all inherit `font-sans` (Inter) from the base layer. | batch-4 milestone |
| Sonner | Font/Color (special case) | Doesn't use Tailwind utility classes at all — passes Figma-sourced CSS variables directly into the `sonner` library's `style` prop (`--normal-bg: var(--popover)`, `--normal-text: var(--popover-foreground)`, `--normal-border: var(--border)`, `--border-radius: var(--radius)`). Confirmed this is still "Figma-sourced," just via a different mechanism than every other component — flagged since it doesn't fit the usual "check for hardcoded Tailwind classes" pattern. | batch-4 milestone |
| *(all components, retroactive)* | Color — `--border`/`--input` (light mode only) | User feedback after reviewing batches 1–4: greys (borders, dividers) looked too heavy, not "clean and subtle like shadcn." Traced to `Border.neutral.default` resolving to Neutral.300 (`#9ba3ac`). Remapped in `scripts/sync-tokens.mjs` to Neutral.100 (`#dee0e3`) for light mode only — see Section 1 note above. This is a token-pipeline fix, applies automatically to every component (past and future) that references `--border`/`--input`; no component files were touched. Dark mode intentionally left alone. | greys-subtlety milestone |
| *(all components)* | Color — `--muted`/`--secondary` background | Same review: flagged as still slightly more saturated than shadcn's own convention, but confirmed this is genuinely the lightest tier Figma's Slate scale defines (no lighter step exists). Decision: keep `#dee0e3` as-is rather than inventing an unofficial lighter value — see Section 1 gap note above. | greys-subtlety milestone |
| Input Group, Command, Combobox, Breadcrumb, Navigation Menu, Calendar, Sheet, Pagination, Empty, Spinner | Geometry/Color/Font | Kept exactly as shadcn's default for all 10 — no changes needed, same pattern as every batch before. Fifth application of the default policy above. | batch-5 milestone |
| Calendar, Sheet, Pagination | Structure (not geometry/color/font) | All three import Tabygen's own `Button` internally, registered with `registryDependencies: ["button"]`. Command and Combobox similarly depend on `input-group` (itself depending on `button`, `input`, `textarea`) — first multi-level registryDependencies chain in the registry. | batch-5 milestone |
| *(shadcn's `date-picker`)* | Not a component | `npx shadcn add date-picker` failed — it isn't a real registry item in the current shadcn CLI, just a documentation pattern composing Calendar + Popover. Not added; documented in `SKILL.md` so this isn't rediscovered as a bug later. | batch-5 milestone |

**Rule:** before setting a geometry value on any new component, check this table
first for a related decision already made on a prior component (e.g. Input's radius
should match Button's radius, unless there's a specific reason it shouldn't). Add a
row here the same session a decision is made — don't defer it.

---
*Last updated: reflects state as of the color-token-sync milestone. Geometry,
spacing, radius, and typography sync are not yet built — see Section 2. The
`--radius` anomaly (Section 3) and Font family's manual-match status (Section 2)
are open items, not resolved ones — check `git log` and the actual repo state before
assuming either has been finalized.*
