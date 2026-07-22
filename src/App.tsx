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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Calendar } from "@/components/ui/calendar"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Kbd } from "@/components/ui/kbd"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import type { VariantProps } from "class-variance-authority"
import { ArrowRight, Download, Bold, Italic, Underline, Inbox, User } from "lucide-react"

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

      <Separator className="my-8" />

      <h2 className="text-lg font-semibold">Batch 4 — menus, controls, data</h2>
      <div className="mt-4 flex flex-wrap items-start gap-6">
        <div className="flex flex-col gap-4">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive">Delete item</Button>} />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Popover>
            <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
            <PopoverContent>Popover content goes here.</PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => toast("Event created", { description: "Sunday, July 26th at 2pm" })}>
            Show toast
          </Button>
        </div>

        <div className="flex flex-col gap-4 w-64">
          <Progress value={60} />
          <Slider defaultValue={[40]} />
          <div className="flex gap-2">
            <Toggle aria-label="Bold"><Bold /></Toggle>
            <Toggle aria-label="Italic"><Italic /></Toggle>
          </div>
          <ToggleGroup variant="outline">
            <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Accordion className="w-72">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes, built on Base UI primitives.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>Yes, with Tabygen brand tokens.</AccordionContent>
          </AccordionItem>
        </Accordion>

        <Table className="w-80">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ada Lovelace</TableCell>
              <TableCell><Badge variant="secondary">Active</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Grace Hopper</TableCell>
              <TableCell><Badge>Active</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Toaster />

      <Separator className="my-8" />

      <h2 className="text-lg font-semibold">Batch 5 — navigation, dates, search, states</h2>
      <div className="mt-4 flex flex-wrap items-start gap-6">
        <div className="flex flex-col gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Projects</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Tabygen UI</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="#">Design System</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="flex items-center gap-3">
            <Spinner />
            <Sheet>
              <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet title</SheetTitle>
                  <SheetDescription>Sheet description text.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <Calendar mode="single" className="rounded-xl border" />

        <div className="flex flex-col gap-4 w-64">
          <Command className="rounded-xl border">
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem>Button</CommandItem>
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Card</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>

          <Combobox items={["Ada Lovelace", "Grace Hopper", "Alan Turing"]}>
            <ComboboxInput placeholder="Select a person" />
            <ComboboxContent>
              <ComboboxEmpty>No results found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <Empty className="w-72">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
            <EmptyTitle>No messages</EmptyTitle>
            <EmptyDescription>You're all caught up.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>

      <Separator className="my-8" />

      <h2 className="text-lg font-semibold">Batch 6 — layout, menus, forms, lists</h2>
      <div className="mt-4 flex flex-wrap items-start gap-6">
        <div className="flex flex-col gap-4">
          <Drawer>
            <DrawerTrigger render={<Button variant="outline">Open drawer</Button>} />
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer title</DrawerTitle>
                <DrawerDescription>Drawer description text.</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>

          <Collapsible className="w-64">
            <CollapsibleTrigger render={<Button variant="ghost">Toggle section</Button>} />
            <CollapsibleContent className="px-2 py-2 text-sm text-muted-foreground">
              Collapsible content revealed here.
            </CollapsibleContent>
          </Collapsible>

          <ContextMenu>
            <ContextMenuTrigger className="flex h-16 w-64 items-center justify-center rounded-lg border text-sm text-muted-foreground">
              Right-click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Edit</ContextMenuItem>
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <HoverCard>
            <HoverCardTrigger render={<Button variant="link">Hover me</Button>} />
            <HoverCardContent>Preview content shown on hover.</HoverCardContent>
          </HoverCard>

          <div className="flex items-center gap-2">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </div>
        </div>

        <ScrollArea className="h-40 w-48 rounded-lg border">
          <div className="p-3 flex flex-col gap-2 text-sm">
            {Array.from({ length: 12 }, (_, i) => <div key={i}>Row {i + 1}</div>)}
          </div>
        </ScrollArea>

        <Field className="w-64">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" placeholder="you@tabygen.com" />
          <FieldDescription>We'll never share your email.</FieldDescription>
        </Field>

        <div className="flex flex-col gap-3 w-72">
          <Item variant="outline">
            <ItemMedia variant="icon"><User /></ItemMedia>
            <ItemContent>
              <ItemTitle>Ada Lovelace</ItemTitle>
              <ItemDescription>ada@tabygen.com</ItemDescription>
            </ItemContent>
          </Item>

          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">Middle</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </div>
      </div>
    </main>
  )
}

export default App
