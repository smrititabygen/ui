import { Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { ArrowRight, Download } from "lucide-react"

// Dev smoke test, not a real component-showcase page — renders the full variant x size
// matrix to confirm they're independent props (any variant combines with any size),
// and that Tabygen tokens (not shadcn defaults) are actually applied throughout.
const variants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const sizes = ["xs", "sm", "default", "lg"] as const

function App() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">@tabygen/ui</h1>
      <p className="text-muted-foreground">Component preview shell — components added via shadcn will render here.</p>
      <table className="mt-6 border-separate border-spacing-3">
        <thead>
          <tr>
            <th></th>
            {sizes.map((size) => (
              <th key={size} className="text-left text-xs text-muted-foreground font-normal">{size}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant}>
              <th className="text-left text-xs text-muted-foreground font-normal pr-2">{variant}</th>
              {sizes.map((size) => (
                <td key={size}>
                  <Button
                    variant={variant as VariantProps<typeof buttonVariants>["variant"]}
                    size={size as VariantProps<typeof buttonVariants>["size"]}
                  >
                    {variant}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button>
          <Download data-icon="inline-start" />
          Icon left
        </Button>
        <Button>
          Icon right
          <ArrowRight data-icon="inline-end" />
        </Button>
        <Button size="icon" aria-label="Download">
          <Download />
        </Button>
      </div>
    </main>
  )
}

export default App
