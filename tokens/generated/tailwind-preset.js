/**
 * Auto-generated — run `npm run sync` to update from Figma.
 *
 * Usage in any project's tailwind.config.js:
 *   import tgPreset from '@tabygen/ui/tailwind-preset'
 *   export default { presets: [tgPreset], content: [...] }
 *
 * Also import variables.css so the CSS custom properties are defined:
 *   import '@tabygen/ui/variables.css'  // in main.jsx
 */
export default {
  theme: {
    extend: {
      /*
       * Brand color palette — all 100–900 shades for each palette.
       * Values resolve at runtime via CSS custom properties defined in variables.css.
       * Usage: bg-violet-600, text-slate-900, border-slate-200, etc.
       */
      colors: {
        grey: {
          100: "var(--tg-color-grey-100)",
          200: "var(--tg-color-grey-200)",
          300: "var(--tg-color-grey-300)",
          400: "var(--tg-color-grey-400)",
          500: "var(--tg-color-grey-500)",
          600: "var(--tg-color-grey-600)",
          700: "var(--tg-color-grey-700)",
          800: "var(--tg-color-grey-800)",
          900: "var(--tg-color-grey-900)"
        },
        slate: {
          100: "var(--tg-color-slate-100)",
          200: "var(--tg-color-slate-200)",
          300: "var(--tg-color-slate-300)",
          400: "var(--tg-color-slate-400)",
          500: "var(--tg-color-slate-500)",
          600: "var(--tg-color-slate-600)",
          700: "var(--tg-color-slate-700)",
          800: "var(--tg-color-slate-800)",
          900: "var(--tg-color-slate-900)"
        },
        red: {
          100: "var(--tg-color-red-100)",
          200: "var(--tg-color-red-200)",
          300: "var(--tg-color-red-300)",
          400: "var(--tg-color-red-400)",
          500: "var(--tg-color-red-500)",
          600: "var(--tg-color-red-600)",
          700: "var(--tg-color-red-700)",
          800: "var(--tg-color-red-800)",
          900: "var(--tg-color-red-900)"
        },
        blue: {
          100: "var(--tg-color-blue-100)",
          200: "var(--tg-color-blue-200)",
          300: "var(--tg-color-blue-300)",
          400: "var(--tg-color-blue-400)",
          500: "var(--tg-color-blue-500)",
          600: "var(--tg-color-blue-600)",
          700: "var(--tg-color-blue-700)",
          800: "var(--tg-color-blue-800)",
          900: "var(--tg-color-blue-900)"
        },
        violet: {
          100: "var(--tg-color-violet-100)",
          200: "var(--tg-color-violet-200)",
          300: "var(--tg-color-violet-300)",
          400: "var(--tg-color-violet-400)",
          500: "var(--tg-color-violet-500)",
          600: "var(--tg-color-violet-600)",
          700: "var(--tg-color-violet-700)",
          800: "var(--tg-color-violet-800)",
          900: "var(--tg-color-violet-900)"
        },
        yellow: {
          100: "var(--tg-color-yellow-100)",
          200: "var(--tg-color-yellow-200)",
          300: "var(--tg-color-yellow-300)",
          400: "var(--tg-color-yellow-400)",
          500: "var(--tg-color-yellow-500)",
          600: "var(--tg-color-yellow-600)",
          700: "var(--tg-color-yellow-700)",
          800: "var(--tg-color-yellow-800)",
          900: "var(--tg-color-yellow-900)"
        },
        green: {
          100: "var(--tg-color-green-100)",
          200: "var(--tg-color-green-200)",
          300: "var(--tg-color-green-300)",
          400: "var(--tg-color-green-400)",
          500: "var(--tg-color-green-500)",
          600: "var(--tg-color-green-600)",
          700: "var(--tg-color-green-700)",
          800: "var(--tg-color-green-800)",
          900: "var(--tg-color-green-900)"
        },
        /*
         * Shadcn semantic colors — use these in components to stay theme-aware.
         * These map to the Shadcn CSS variables set in variables.css.
         * Usage: bg-background, text-foreground, bg-primary, text-muted-foreground, etc.
         */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))"
      },
      /*
       * Border radius — all derived from --radius (0.5rem default).
       * Change --radius in variables.css to scale all component roundness.
       */
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "calc(var(--radius) - 2px)",
        md: "var(--radius)",
        lg: "calc(var(--radius) + 2px)",
        xl: "calc(var(--radius) + 8px)",
        "2xl": "calc(var(--radius) + 16px)"
      }
    }
  }
}
