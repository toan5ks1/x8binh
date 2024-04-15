import {
  Hand,
  Home,
  LogIn,
  LogOut,
  PlusCircle,
  ScreenShareOff,
  Settings,
  Terminal,
  Unplug,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { AppContext } from '../../../../src/renderer/providers/app';
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
import { bots } from '../config';
import { useSetupBot } from '../hooks/useSetupBot';
import { FindRoom } from './findroom';
import { HomePage } from './home';

export function App() {
  const [tab, setActiveTab] = useState('all');
  const { state } = useContext<any>(AppContext);
  const {
    user: user1,
    messageHistory: messageHistoryBot1,
    handleLeaveRoom: handleLeaveRoomBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleCreateRoom: handleCreateRoomBot1,
    handleConnectMauBinh: handleConnectMauBinhBot1,
  } = useSetupBot(bots[0]);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    handleConnectMauBinh: handleConnectMauBinhBot2,
  } = useSetupBot(bots[1]);

  const onLogin = async () => {
    loginBot1();
    loginBot2();
  };

  const onJoinMauBinh = async () => {
    handleConnectMauBinhBot1();
    handleConnectMauBinhBot2();
  };

  const onCreatRoom = () => {
    handleCreateRoomBot1();
  };

  const onLeaveRoom = () => {
    handleLeaveRoomBot1();
    handleLeaveRoomBot2();
  };

  const onMainJoin = () => {
    window.electron.ipcRenderer.executeScript([
      `__require('GamePlayManager').default.getInstance().joinRoom(${state.firstRoomId},0,'',true);`,
    ]);
  };
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
                      <Hand className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Card deck
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Card deck</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      1
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>2</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>3</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={onLogin} size="sm" className="h-8 gap-1">
                  <LogIn className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Login
                  </span>
                </Button>
                <Button onClick={onJoinMauBinh} size="sm" className="h-8 gap-1">
                  <Unplug className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Connect ChinesePK
                  </span>
                </Button>
                <Button onClick={onCreatRoom} size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Create And Join
                  </span>
                </Button>
                <Button onClick={onLeaveRoom} size="sm" className="h-8 gap-1">
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Quit
                  </span>
                </Button>
                <Button size="sm" className="h-8 gap-1">
                  <ScreenShareOff className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Disconnect
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
                <FindRoom
                  user1={user1}
                  messageHistoryBot1={messageHistoryBot1}
                  connectionStatusBot1={connectionStatusBot1}
                  user2={user2}
                  messageHistoryBot2={messageHistoryBot2}
                  connectionStatusBot2={connectionStatusBot2}
                />
              </div>
            </TabsContent>
          </main>
        </div>
      </div>
    </Tabs>
  );
}
