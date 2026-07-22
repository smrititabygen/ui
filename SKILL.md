# @tabygen/ui — how this system works

For anyone (human or AI agent) working in a project that consumes `@tabygen/ui`.
For how this repo itself is built, see [ARCHITECTURE.md](ARCHITECTURE.md) (token
pipeline) and [TOKEN_RULEBOOK.md](TOKEN_RULEBOOK.md) (what's Figma-sourced vs.
shadcn-default, per property).

## Two things this repo ships, pulled two different ways

1. **Design tokens** — an npm package (`@tabygen/ui`), published to GitHub Packages.
   `npm install @tabygen/ui`, then import `@tabygen/ui/variables.css` and/or
   `@tabygen/ui/tailwind-preset`. Updating: `/design-sync` in the product project.
2. **Components** — pulled individually from this repo's shadcn registry, **not**
   npm-installed and **not** generic `npx shadcn@latest add <component>` (that
   would get unbranded upstream shadcn source instead of the version checked
   against Figma here). Updating: re-run the same pull command to overwrite with
   the latest registered version.

## Component inventory

| Component | shadcn base | Customization | Registry file |
|---|---|---|---|
| [Button](src/components/ui/button.tsx) | Base UI (`@base-ui/react/button`) | Geometry kept as shadcn default (no Figma geometry spec); color and font already flow through Tabygen's CSS variables with no edits needed — see `TOKEN_RULEBOOK.md` Section 5 | [`public/r/button.json`](public/r/button.json) |
| [Input](src/components/ui/input.tsx) | Base UI (`@base-ui/react/input`) | No edits needed — same as Button | [`public/r/input.json`](public/r/input.json) |
| [Label](src/components/ui/label.tsx) | Plain HTML element, no primitive | No edits needed — same as Button | [`public/r/label.json`](public/r/label.json) |
| [Textarea](src/components/ui/textarea.tsx) | Plain HTML element, no primitive | No edits needed — same as Button | [`public/r/textarea.json`](public/r/textarea.json) |
| [Card](src/components/ui/card.tsx) | Plain HTML elements, no primitive | No edits needed — `font-heading` resolves via `--font-heading: var(--font-sans)` in `src/index.css`, confirmed Inter | [`public/r/card.json`](public/r/card.json) |
| [Badge](src/components/ui/badge.tsx) | Base UI (`@base-ui/react` render/merge-props) | No edits needed — same as Button | [`public/r/badge.json`](public/r/badge.json) |
| [Separator](src/components/ui/separator.tsx) | Base UI (`@base-ui/react/separator`) | No edits needed — same as Button | [`public/r/separator.json`](public/r/separator.json) |
| [Checkbox](src/components/ui/checkbox.tsx) | Base UI (`@base-ui/react/checkbox`) | No edits needed — same as Button | [`public/r/checkbox.json`](public/r/checkbox.json) |
| [Switch](src/components/ui/switch.tsx) | Base UI (`@base-ui/react/switch`) | No edits needed — same as Button | [`public/r/switch.json`](public/r/switch.json) |
| [Dialog](src/components/ui/dialog.tsx) | Base UI (`@base-ui/react/dialog`) | No edits needed — same as Button. Pulls in `button` as a `registryDependency` automatically (Dialog uses Tabygen's Button internally for its close/footer buttons) | [`public/r/dialog.json`](public/r/dialog.json) |
| [Select](src/components/ui/select.tsx) | Base UI (`@base-ui/react/select`) | No edits needed — same as Button | [`public/r/select.json`](public/r/select.json) |
| [Tabs](src/components/ui/tabs.tsx) | Base UI (`@base-ui/react/tabs`) | No edits needed — same as Button | [`public/r/tabs.json`](public/r/tabs.json) |
| [Avatar](src/components/ui/avatar.tsx) | Base UI (`@base-ui/react/avatar`) | No edits needed — same as Button | [`public/r/avatar.json`](public/r/avatar.json) |
| [Alert](src/components/ui/alert.tsx) | Plain HTML elements, no primitive | No edits needed — same as Button | [`public/r/alert.json`](public/r/alert.json) |
| [Tooltip](src/components/ui/tooltip.tsx) | Base UI (`@base-ui/react/tooltip`) | No edits needed — same as Button. **Integration note:** exports `TooltipProvider`, which must wrap the consuming app's root (or at least the tree using tooltips) — see the pulling section below | [`public/r/tooltip.json`](public/r/tooltip.json) |
| [Radio Group](src/components/ui/radio-group.tsx) | Base UI (`@base-ui/react/radio-group`, `@base-ui/react/radio`) | No edits needed — same as Button | [`public/r/radio-group.json`](public/r/radio-group.json) |
| [Skeleton](src/components/ui/skeleton.tsx) | Plain HTML element, no primitive | No edits needed — same as Button | [`public/r/skeleton.json`](public/r/skeleton.json) |

This table is the source of truth for what exists. If a component isn't listed here,
it isn't in the registry yet — build it via `/design-component` in this repo first.

## Pulling a component into a product project

Prerequisite: the product project's `shadcn init` must use **Base UI** (not Radix,
not React Aria) — every component in this registry is built on it, per the table
above.

```bash
npx shadcn@latest init   # base library = Base UI
npx shadcn@latest add https://raw.githubusercontent.com/smrititabygen/ui/main/public/r/button.json
```

This repo is public (verified: the URL above resolves without auth), so no token or
registry auth config is needed to pull from it.

This copies the file into `src/components/ui/button.tsx` in the product project and
auto-installs whatever npm packages the registry entry declares as dependencies
(check `registry.json` here for the current list per component).

Some components declare `registryDependencies` — other Tabygen components they use
internally. E.g. pulling `dialog` also pulls `button`, since Dialog renders a
Tabygen Button for its close/footer actions. The `shadcn` CLI resolves this
automatically; you don't need to pull the dependency yourself.

**Tooltip needs a provider.** After pulling `tooltip`, wrap the part of your app
that uses tooltips (usually the whole app root) with `TooltipProvider`:
```tsx
import { TooltipProvider } from "@/components/ui/tooltip"

function App() {
  return <TooltipProvider>{/* rest of your app */}</TooltipProvider>
}
```
Without this, `Tooltip`/`TooltipTrigger`/`TooltipContent` will throw at runtime.

## How tokens map to what you write

Once `@tabygen/ui/variables.css` is imported, every component pulled from this
registry already uses the right classes — you don't need to think about hex values.
For your *own* custom UI in a product project (not a pulled component), use:

- Semantic classes for theme-aware UI: `bg-primary`, `text-foreground`,
  `bg-muted`, `border-border`, `bg-destructive`, etc. — these follow light/dark
  mode automatically.
- Raw palette classes when you need a specific brand shade outside the semantic
  set: `bg-violet-500`, `text-slate-700`, etc. (7 palettes × 9 shades: grey,
  slate, blue, red, yellow, green, violet).
- Never a hardcoded hex value.

## Where to look for more detail

- **How the token pipeline actually works, file by file** → `ARCHITECTURE.md`
- **What's Figma-sourced vs. shadcn-default, property by property, and why** →
  `TOKEN_RULEBOOK.md`
- **Build/customize a component** → `/design-component` skill
- **Update tokens after a Figma change** → `/design-tokens` skill
- **Update a product project's token package version** → `/design-sync` skill
