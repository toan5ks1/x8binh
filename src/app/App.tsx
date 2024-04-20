import {
  Hand,
  LogIn,
  LogOut,
  PlusCircle,
  ScreenShareOff,
  Unplug,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { BotStatus } from '../components/account/botStatus';
import { SideBar } from '../components/sidebar/sidebar';
import { useToast } from '../components/toast/use-toast';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Tabs, TabsContent } from '../components/ui/tabs';
import { useAccounts } from '../context/AccountContext';
import { useSetupBot } from '../hooks/useSetupBot';
import { AppContext } from '../renderer/providers/app';
import { HomePage } from './pages/home';
import { SettingPage } from './pages/setting';
import { TerminalPage } from './pages/terminal';

export function App() {
  const [tab, setActiveTab] = useState('all');
  const { state } = useContext<any>(AppContext);
  const { state: accounts } = useAccounts();
  const { toast } = useToast();
  const bot1Account = accounts['BOT']?.[0] ?? {};
  const bot2Account = accounts['BOT']?.[1] ?? {};
  const [cardDeck, setCardDeck] = useState('4');
  const {
    user: user1,
    messageHistory: messageHistoryBot1,
    handleLeaveRoom: handleLeaveRoomBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleCreateRoom: handleCreateRoomBot1,
    handleConnectMauBinh: handleConnectMauBinhBot1,
    setMessageHistory: setMessageHistoryBot1,
  } = useSetupBot(bot1Account);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    handleConnectMauBinh: handleConnectMauBinhBot2,
    setMessageHistory: setMessageHistoryBot2,
  } = useSetupBot(bot2Account);

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
    window.backend.sendMessage('execute-script', [
      `__require('GamePlayManager').default.getInstance().joinRoom(${state.firstRoomId},0,'',true);`,
    ]);
  };
  useEffect(() => {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    toast({
      title: 'Welcome to MauBinh App',
      description: `Today is ${dateString}`,
    });
  }, []);

  const handleCardDeckChange = (deckValue: string) => {
    setCardDeck(deckValue);
  };

  return (
    <Tabs value={tab} onValueChange={setActiveTab} defaultValue="all">
      <div className="flex w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <SideBar />
        </aside>
        <div className="flex flex-col sm:gap-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 bg-background sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center sticky top-0 py-[15px] bg-background border-b z-[9]">
              <div className="ml-auto grid grid-cols-7 items-center gap-2">
                <div className="h-8 gap-1 flex flex-row justify-center items-center">
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {state.initialRoom.id && `Room: ${state.initialRoom.id}`}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Hand className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Deck
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Card deck</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={cardDeck === '1'}
                      onSelect={() => handleCardDeckChange('1')}
                    >
                      1
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={cardDeck === '2'}
                      onSelect={() => handleCardDeckChange('2')}
                    >
                      2
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={cardDeck === '3'}
                      onSelect={() => handleCardDeckChange('3')}
                    >
                      3
                    </DropdownMenuCheckboxItem>
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
                    Connect
                  </span>
                </Button>
                <Button onClick={onCreatRoom} size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Create/Join
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
              <HomePage cardDeck={cardDeck} />
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
