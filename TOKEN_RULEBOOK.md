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
