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
| [Accordion](src/components/ui/accordion.tsx) | Base UI (`@base-ui/react/accordion`) | No edits needed — same as Button | [`public/r/accordion.json`](public/r/accordion.json) |
| [Alert Dialog](src/components/ui/alert-dialog.tsx) | Base UI (`@base-ui/react/alert-dialog`) | No edits needed — same as Button. Pulls in `button` as a `registryDependency` automatically | [`public/r/alert-dialog.json`](public/r/alert-dialog.json) |
| [Popover](src/components/ui/popover.tsx) | Base UI (`@base-ui/react/popover`) | No edits needed — same as Button | [`public/r/popover.json`](public/r/popover.json) |
| [Dropdown Menu](src/components/ui/dropdown-menu.tsx) | Base UI (`@base-ui/react/menu`) | No edits needed — same as Button | [`public/r/dropdown-menu.json`](public/r/dropdown-menu.json) |
| [Progress](src/components/ui/progress.tsx) | Base UI (`@base-ui/react/progress`) | No edits needed — same as Button | [`public/r/progress.json`](public/r/progress.json) |
| [Slider](src/components/ui/slider.tsx) | Base UI (`@base-ui/react/slider`) | **One color fix:** thumb was hardcoded `bg-white` in shadcn's shipped source — changed to `bg-background` so it follows Tabygen's semantic tokens and adapts in dark mode. See `TOKEN_RULEBOOK.md` Section 5 | [`public/r/slider.json`](public/r/slider.json) |
| [Toggle](src/components/ui/toggle.tsx) | Base UI (`@base-ui/react/toggle`) | No edits needed — same as Button | [`public/r/toggle.json`](public/r/toggle.json) |
| [Toggle Group](src/components/ui/toggle-group.tsx) | Base UI (`@base-ui/react/toggle-group`) | No edits needed — same as Button. Pulls in `toggle` as a `registryDependency` automatically | [`public/r/toggle-group.json`](public/r/toggle-group.json) |
| [Sonner (Toaster)](src/components/ui/sonner.tsx) | `sonner` + `next-themes` (not Base UI) | No edits needed — colors passed through as CSS variables (`--normal-bg: var(--popover)`, etc.), already Figma-sourced. **Integration note:** render `<Toaster />` once at the app root (see below) | [`public/r/sonner.json`](public/r/sonner.json) |
| [Table](src/components/ui/table.tsx) | Plain HTML elements, no primitive | No edits needed — same as Button | [`public/r/table.json`](public/r/table.json) |
| [Input Group](src/components/ui/input-group.tsx) | Plain HTML elements + Tabygen Button/Input/Textarea | No edits needed. Pulled in automatically by Command/Combobox, also usable standalone | [`public/r/input-group.json`](public/r/input-group.json) |
| [Command](src/components/ui/command.tsx) | `cmdk` + Tabygen Dialog/Input Group | No edits needed | [`public/r/command.json`](public/r/command.json) |
| [Combobox](src/components/ui/combobox.tsx) | Base UI (`@base-ui/react`) + Tabygen Button/Input Group | No edits needed | [`public/r/combobox.json`](public/r/combobox.json) |
| [Breadcrumb](src/components/ui/breadcrumb.tsx) | Base UI (`@base-ui/react` render/merge-props) | No edits needed | [`public/r/breadcrumb.json`](public/r/breadcrumb.json) |
| [Navigation Menu](src/components/ui/navigation-menu.tsx) | Base UI (`@base-ui/react/navigation-menu`) | No edits needed | [`public/r/navigation-menu.json`](public/r/navigation-menu.json) |
| [Calendar](src/components/ui/calendar.tsx) | `react-day-picker` + Tabygen Button | No edits needed. shadcn's `date-picker` is a composed pattern (Calendar + Popover), not a standalone registry item — compose it yourself from these two | [`public/r/calendar.json`](public/r/calendar.json) |
| [Sheet](src/components/ui/sheet.tsx) | Base UI (`@base-ui/react/dialog`) + Tabygen Button | No edits needed | [`public/r/sheet.json`](public/r/sheet.json) |
| [Pagination](src/components/ui/pagination.tsx) | Plain HTML + Tabygen Button | No edits needed | [`public/r/pagination.json`](public/r/pagination.json) |
| [Empty](src/components/ui/empty.tsx) | Plain HTML elements, no primitive | No edits needed | [`public/r/empty.json`](public/r/empty.json) |
| [Spinner](src/components/ui/spinner.tsx) | Lucide `Loader2Icon`, no primitive | No edits needed — uses `currentColor`, no separate color token | [`public/r/spinner.json`](public/r/spinner.json) |
| [Drawer](src/components/ui/drawer.tsx) | Base UI (`@base-ui/react/drawer`) | No edits needed | [`public/r/drawer.json`](public/r/drawer.json) |
| [Collapsible](src/components/ui/collapsible.tsx) | Base UI (`@base-ui/react/collapsible`) | No edits needed | [`public/r/collapsible.json`](public/r/collapsible.json) |
| [Scroll Area](src/components/ui/scroll-area.tsx) | Base UI (`@base-ui/react/scroll-area`) | One unused-import fix (`React`, unrelated to tokens — a real bug in shadcn's own shipped source, broke `tsc --noEmit`) | [`public/r/scroll-area.json`](public/r/scroll-area.json) |
| [Context Menu](src/components/ui/context-menu.tsx) | Base UI (`@base-ui/react/context-menu`) | No edits needed | [`public/r/context-menu.json`](public/r/context-menu.json) |
| [Hover Card](src/components/ui/hover-card.tsx) | Base UI (`@base-ui/react/preview-card`) | No edits needed | [`public/r/hover-card.json`](public/r/hover-card.json) |
| [Kbd](src/components/ui/kbd.tsx) | Plain HTML element, no primitive | No edits needed | [`public/r/kbd.json`](public/r/kbd.json) |
| [Field](src/components/ui/field.tsx) | Plain HTML + Tabygen Label/Separator | No edits needed | [`public/r/field.json`](public/r/field.json) |
| [Item](src/components/ui/item.tsx) | Base UI (`@base-ui/react` render/merge-props) + Tabygen Separator | No edits needed | [`public/r/item.json`](public/r/item.json) |
| [Button Group](src/components/ui/button-group.tsx) | Base UI (`@base-ui/react` render/merge-props) + Tabygen Separator | No edits needed | [`public/r/button-group.json`](public/r/button-group.json) |
| [Aspect Ratio](src/components/ui/aspect-ratio.tsx) | Plain HTML element, no primitive | No edits needed — pure layout, no color/font surface | [`public/r/aspect-ratio.json`](public/r/aspect-ratio.json) |
| [Direction](src/components/ui/direction.tsx) | Re-exports Base UI's `DirectionProvider`/`useDirection` | No edits needed — RTL support, no color/font surface | [`public/r/direction.json`](public/r/direction.json) |
| [Input OTP](src/components/ui/input-otp.tsx) | `input-otp` library | No edits needed | [`public/r/input-otp.json`](public/r/input-otp.json) |
| [Native Select](src/components/ui/native-select.tsx) | Plain HTML `<select>` | No edits needed. Options/optgroups intentionally use CSS system colors (`Canvas`/`CanvasText`), not brand hex — browsers don't allow custom styling of native dropdown popups | [`public/r/native-select.json`](public/r/native-select.json) |
| [Resizable](src/components/ui/resizable.tsx) | `react-resizable-panels` | No edits needed. Note: current API uses an `orientation` prop (`"horizontal"`/`"vertical"`), not `direction` like older versions | [`public/r/resizable.json`](public/r/resizable.json) |
| [Carousel](src/components/ui/carousel.tsx) | `embla-carousel-react` + Tabygen Button | No edits needed | [`public/r/carousel.json`](public/r/carousel.json) |
| [Chart](src/components/ui/chart.tsx) | `recharts` | No edits needed — grid/tooltip/legend chrome uses `--border`/`--muted-foreground`/`--background`. Per-series data colors are caller-supplied via `ChartConfig` (e.g. `color: "var(--primary)"`), not Figma-sourced — no chart-color tokens exist in Figma yet | [`public/r/chart.json`](public/r/chart.json) |
| [Menubar](src/components/ui/menubar.tsx) | Base UI (`@base-ui/react/menubar`) + Tabygen Dropdown Menu | No edits needed | [`public/r/menubar.json`](public/r/menubar.json) |
| [Sidebar](src/components/ui/sidebar.tsx) | Base UI + Tabygen Button/Input/Separator/Sheet/Skeleton/Tooltip | Uses shadcn's own `--sidebar-*` variables (already defined in `src/index.css` as shadcn's greyscale defaults) — this is `TOKEN_RULEBOOK.md` Section 3's pre-existing, already-documented gap (no Figma sidebar tokens exist), not a new issue introduced here. Bundles `src/hooks/use-mobile.ts` as a second registry file | [`public/r/sidebar.json`](public/r/sidebar.json) |

This table is the source of truth for what exists. If a component isn't listed here,
it isn't in the registry yet — build it via `/design-component` in this repo first.

**Coverage:** 56 components — the full shadcn catalog except: chat-specific
components (Bubble, Message, Message Scroller, Marker, Attachment — skipped as
out of scope), Toast (superseded by Sonner, not re-added), and Typography (a
docs page of prose `className` patterns, not an actual component). Also not
present because they aren't real standalone registry items in the current
shadcn CLI — they're composed patterns documented instead of copy-pasted:
**Date Picker** (compose `Calendar` + `Popover` yourself) and **Data Table**
(compose `Table` + TanStack Table yourself).

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

**Sonner needs a mounted `<Toaster />`.** After pulling `sonner`, render it once near
your app root:
```tsx
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      {/* rest of your app */}
      <Toaster />
    </>
  )
}
```
Then trigger toasts from anywhere with `import { toast } from "sonner"` and
`toast("message")`.

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
