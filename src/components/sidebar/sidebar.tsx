import { Home, LogOut, SearchCheck, Settings, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface SideBarProps {}

export const SideBar = ({}: SideBarProps) => {
  const navigate = useNavigate();
  const onLogOut = () => {
    localStorage.removeItem('license-key');
    navigate('/');
  };
  return (
    <div className="flex flex-col items-center gap-4 px-2 sm:py-5">
      <TabsList className="flex flex-col bg-transparent grow justify-start h-full">
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
                <span className="sr-only">Terminal</span>
              </a>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Terminal</TooltipContent>
        </Tooltip>
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
        <div className="absolute bottom-[20px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => onLogOut()}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </div>
      </TabsList>
    </div>
  );
};
