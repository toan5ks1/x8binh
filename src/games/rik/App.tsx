import {
  Hand,
  Home,
  LogIn,
  LogOut,
  PlusCircle,
  ScreenShareOff,
  SearchCheck,
  Settings,
  Terminal,
  Unplug,
} from 'lucide-react';
import { useContext, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { AppContext } from '../../renderer/providers/app';
// import { MainNav } from './components/layout/main-nav';
import { BotStatus } from '../../components/bots/botStatus';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { bots } from './config';
import { useSetupBot } from './hooks/useSetupBot';
import { HomePage } from './pages/home';
import { SettingPage } from './pages/setting';
import { TerminalPage } from './pages/terminal';

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
    setMessageHistory: setMessageHistoryBot1,
  } = useSetupBot(bots[0]);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    handleConnectMauBinh: handleConnectMauBinhBot2,
    setMessageHistory: setMessageHistoryBot2,
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
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <div className="h-8 gap-1 flex flex-row justify-center items-center">
                  {/* <Gamepad className="h-3.5 w-3.5" /> */}
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {state.initialRoom.id && `Room: ${state.initialRoom.id}`}
                  </span>
                </div>
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
              <TerminalPage />
            </TabsContent>
            <TabsContent
              forceMount={true}
              value="find-room"
              hidden={'find-room' !== tab}
            >
              <div className="flex flex-col h-screen">
                <div className="flex flex-col  text-white space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-[20px] w-full">
                    <BotStatus
                      name={'Bot 1'}
                      userId={user1?.username}
                      connectionStatus={connectionStatusBot1}
                      messageHistory={messageHistoryBot1}
                      setMessageHistory={setMessageHistoryBot1}
                    />

                    <BotStatus
                      name={'Bot 2'}
                      userId={user2?.username}
                      connectionStatus={connectionStatusBot2}
                      messageHistory={messageHistoryBot2}
                      setMessageHistory={setMessageHistoryBot2}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              forceMount={true}
              value="setting"
              hidden={'setting' !== tab}
            >
              <SettingPage />
            </TabsContent>
          </main>
        </div>
      </div>
    </Tabs>
  );
}
