import { Home, SearchCheck, Settings, Terminal } from 'lucide-react';
import { TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface SideBarProps {}

export const SideBar = ({}: SideBarProps) => {
  return (
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
            <TabsTrigger value="find-room">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <SearchCheck className="h-5 w-5" />
                <span className="sr-only">Find Room</span>
              </a>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Find Room</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="terminal">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Terminal className="h-5 w-5" />
                <span className="sr-only">Terminal</span>
              </a>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Terminal</TooltipContent>
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
  );
};
