import {
  File,
  Home,
  ListFilter,
  PlusCircle,
  Settings,
  Terminal,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { HomePage } from './home';

export function App() {
  const [tab, setActiveTab] = useState('all');
  return (
    <Tabs value={tab} onValueChange={setActiveTab} defaultValue="all">
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <div className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <TabsList className="flex flex-col bg-transparent grow justify-start h-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="all">
                    <a
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Home className="h-5 w-5" />
                      <span className="sr-only">Dashboard</span>
                    </a>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="terminal">
                    <a
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Terminal className="h-5 w-5" />
                      <span className="sr-only">Dashboard</span>
                    </a>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
              </Tooltip>
              <div className="flex grow"></div>
              <TabsTrigger value="setting" className="mt-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Settings</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              </TabsTrigger>
            </TabsList>
          </div>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent forceMount={true} value="all" hidden={'all' !== tab}>
              <HomePage />
            </TabsContent>
            <TabsContent
              forceMount={true}
              value="terminal"
              hidden={'terminal' !== tab}
            >
              <div>
                asljhdasjkldhnlasjkdhasjkldhasjkldhajklsdhasjkldhasljkdhasjkld
              </div>
            </TabsContent>
          </main>
        </div>
      </div>
    </Tabs>
  );
}
