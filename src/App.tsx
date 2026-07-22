import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
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

      <Separator className="my-8" />

      <h2 className="text-lg font-semibold">Batch 2 — form + content primitives</h2>
      <div className="mt-4 flex flex-wrap items-start gap-6">
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description text goes here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Ada Lovelace" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell us about yourself" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="agree" />
              <Label htmlFor="agree">I agree to the terms</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="notify" />
              <Label htmlFor="notify">Enable notifications</Label>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="outline">Cancel</Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge>default</Badge>
            <Badge variant="secondary">secondary</Badge>
            <Badge variant="outline">outline</Badge>
            <Badge variant="destructive">destructive</Badge>
            <Badge variant="ghost">ghost</Badge>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <h2 className="text-lg font-semibold">Batch 3 — overlays, navigation, feedback</h2>
      <TooltipProvider>
        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-3">
            <Dialog>
              <DialogTrigger render={<Button>Open dialog</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog title</DialogTitle>
                  <DialogDescription>Dialog description text goes here.</DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton />
              </DialogContent>
            </Dialog>

            <Select defaultValue="one">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">Option one</SelectItem>
                <SelectItem value="two">Option two</SelectItem>
                <SelectItem value="three">Option three</SelectItem>
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>TG</AvatarFallback>
              </Avatar>
              <Skeleton className="h-8 w-32" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Tabs defaultValue="tab1" className="w-64">
              <TabsList>
                <TabsTrigger value="tab1">Tab one</TabsTrigger>
                <TabsTrigger value="tab2">Tab two</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Content for tab one.</TabsContent>
              <TabsContent value="tab2">Content for tab two.</TabsContent>
            </Tabs>

            <RadioGroup defaultValue="a" className="gap-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="a" id="a" />
                <Label htmlFor="a">Option A</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="b" id="b" />
                <Label htmlFor="b">Option B</Label>
              </div>
            </RadioGroup>

            <Alert>
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>This is a default alert.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>This is a destructive alert.</AlertDescription>
            </Alert>
          </div>
        </div>
      </TooltipProvider>
    </main>
  )
}

export default App
