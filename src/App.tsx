import { Button } from "@/components/ui/button"

// Dev smoke test, not a real component-showcase page — renders one instance of each
// component to eyeball that Tabygen tokens (not shadcn defaults) are actually applied.
function App() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">@tabygen/ui</h1>
      <p className="text-muted-foreground">Component preview shell — components added via shadcn will render here.</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
    </main>
  )
}

export default App
