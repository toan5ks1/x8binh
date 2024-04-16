import { Home, SearchCheck, Settings, Terminal } from 'lucide-react';
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
import { MainNav } from './components/layout/main-nav';
import { bots } from './config';
import { useSetupBot } from './hooks/useSetupBot';
import { FindRoom } from './pages/findroom';
import { HomePage } from './pages/home';
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
  } = useSetupBot(bots[0]);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    handleConnectMauBinh: handleConnectMauBinhBot2,
  } = useSetupBot(bots[1]);

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
            <MainNav
              handleLeaveRoomBot1={handleLeaveRoomBot1}
              handleCreateRoomBot1={handleCreateRoomBot1}
              loginBot1={loginBot1}
              handleConnectMauBinhBot1={handleConnectMauBinhBot1}
              handleLeaveRoomBot2={handleLeaveRoomBot2}
              loginBot2={loginBot2}
              handleConnectMauBinhBot2={handleConnectMauBinhBot2}
            />
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
              <FindRoom
                user1={user1}
                messageHistoryBot1={messageHistoryBot1}
                connectionStatusBot1={connectionStatusBot1}
                user2={user2}
                messageHistoryBot2={messageHistoryBot2}
                connectionStatusBot2={connectionStatusBot2}
              />
            </TabsContent>
          </main>
        </div>
      </div>
    </Tabs>
  );
}
