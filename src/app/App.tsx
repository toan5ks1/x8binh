import {
  Hand,
  Loader,
  LogIn,
  LogOut,
  PlusCircle,
  ScreenShareOff,
  Settings,
  Unplug,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountSection } from '../components/account/accountSection';
import { CoupleCrawStatus } from '../components/bots/coupleCraw';
import { CoupleWaiterStatus } from '../components/bots/coupleWaiter';
import { MainPlayerStatus } from '../components/bots/mainPlayer';
import MainSetting from '../components/menu/mainSetting';
import { SideBar } from '../components/sidebar/sidebar';
import { useToast } from '../components/toast/use-toast';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio';
import { Tabs, TabsContent } from '../components/ui/tabs';
import { useAccounts } from '../context/AccountContext';
import { bots, crawingBot } from '../lib/config';
import { validateLicense } from '../lib/supabase';
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
  const [loading, setLoading] = useState(false);
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const navigate = useNavigate();

  const [shouldLogin, setShouldLogin] = useState(false);
  const [shouldJoinMB, setShouldJoinMB] = useState(false);
  const [shouldCreatRoom, setShouldCreateRoom] = useState(false);
  const [shouldLeave, setShouldLeave] = useState(false);
  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  const onLogin = () => {
    setShouldLogin(true);
    setShouldDisconnect(false);
  };

  const onJoinMauBinh = () => {
    setShouldJoinMB(true);
  };

  const onCreatRoom = () => {
    setShouldCreateRoom(true);
  };

  const onLeaveRoom = () => {
    setShouldLeave(true);
    setShouldCreateRoom(false);
  };

  const onDisconnect = () => {
    setShouldDisconnect(true);

    setShouldLogin(false);
    setShouldJoinMB(false);
    setShouldCreateRoom(false);
    setShouldLeave(false);
  };

  useEffect(() => {
    if (
      process.env.NODE_ENV != 'development' &&
      localStorage.getItem('license-key')
    ) {
      validateLicense(setLoading, toast, navigate);
    }
  }, []);

  return (
    <div>
      <MainSetting setIsOpen={setIsOpenSheet} isOpen={isOpenSheet}>
        <AccountSection accountType="MAIN" placeholder="Main account here..." />
      </MainSetting>
      <Tabs value={tab} onValueChange={setActiveTab} defaultValue="all">
        <div className="flex w-full flex-col bg-muted/40">
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <SideBar />
          </aside>
          {loading ? (
            <div className="h-screen w-full flex justify-center items-center">
              <Loader className="w-6.5 h-6.5 animate-spin"></Loader>
            </div>
          ) : (
            <div className="flex flex-col sm:gap-4 sm:pl-14">
              <main className="grid flex-1 items-start gap-4 bg-background sm:px-6 sm:py-0 md:gap-8">
                <div className="flex items-center sticky top-0 py-[15px] bg-background border-b z-[9] px-[10px]">
                  <div className="ml-auto flex flex-row items-center gap-2">
                    <div className="h-8 gap-1 flex flex-row justify-center items-center">
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {state.initialRoom.id &&
                          `Room: ${state.initialRoom.id}`}
                      </span>
                    </div>
                    <RadioGroup
                      defaultValue={cardDeck}
                      onValueChange={(value) => {
                        setCardDeck(value);
                      }}
                      className="flex flex-row border py-[4px] px-[7px] rounded-[5px]"
                    >
                      <Hand className="" />
                      <div className="flex items-center space-x-2">
                        <div className="border p-0 px-[4px] rounded-full">
                          <RadioGroupItem
                            value="2"
                            id="option-two"
                            className=" border-white"
                          />
                        </div>
                        <Label>2</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="border p-0 px-[4px] rounded-full">
                          <RadioGroupItem value="3" id="option-three" />
                        </div>
                        <Label>3</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="border p-0 px-[4px] rounded-full">
                          <RadioGroupItem value="4" id="option-four" />
                        </div>
                        <Label>4</Label>
                      </div>
                    </RadioGroup>
                    <Button onClick={onLogin} size="sm" className="h-8 gap-1">
                      <LogIn className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Login
                      </span>
                    </Button>
                    <Button
                      onClick={onJoinMauBinh}
                      size="sm"
                      className="h-8 gap-1"
                    >
                      <Unplug className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Connect
                      </span>
                    </Button>
                    <Button
                      onClick={onCreatRoom}
                      size="sm"
                      className="h-8 gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Create/Join
                      </span>
                    </Button>
                    <Button
                      onClick={onLeaveRoom}
                      size="sm"
                      className="h-8 gap-1"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Quit
                      </span>
                    </Button>
                    <Button
                      onClick={onDisconnect}
                      size="sm"
                      className="h-8 gap-1"
                    >
                      <ScreenShareOff className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Disconnect
                      </span>
                    </Button>
                    <Button
                      onClick={() => setIsOpenSheet(true)}
                      size="sm"
                      className="h-8 gap-1"
                    >
                      <Settings />
                    </Button>
                  </div>
                </div>

                <TabsContent
                  forceMount={true}
                  value="all"
                  hidden={'all' !== tab}
                >
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
                  <div className="flex flex-col h-screen w-full">
                    <div className="flex flex-col  text-white space-y-4 flex-1 w-full">
                      {/* <div className="grid grid-cols-2 gap-[20px] w-full"> */}
                      {bots.map(
                        (bot, index) =>
                          index % 2 === 0 &&
                          index < bots.length - 1 && (
                            <MainPlayerStatus
                              key={index}
                              index={index}
                              craw1={bot}
                              craw2={bots[index + 1]}
                              shouldLogin={shouldLogin}
                              shouldJoinMB={shouldJoinMB}
                              shouldCreatRoom={shouldCreatRoom}
                              shouldLeave={shouldLeave}
                              shouldDisconnect={shouldDisconnect}
                            />
                          )
                      )}

                      {crawingBot.map((bot, index) => {
                        if (index % 2 === 0 && index < crawingBot.length - 1) {
                          if (index < crawingBot.length - 3) {
                            return (
                              <CoupleCrawStatus
                                key={index}
                                index={index}
                                craw1={bot}
                                craw2={crawingBot[index + 1]}
                                shouldLogin={shouldLogin}
                                shouldJoinMB={shouldJoinMB}
                                shouldCreatRoom={shouldCreatRoom}
                                shouldLeave={shouldLeave}
                                shouldDisconnect={shouldDisconnect}
                              />
                            );
                          } else {
                            return (
                              <CoupleWaiterStatus
                                key={index}
                                index={index}
                                craw1={bot}
                                craw2={crawingBot[index + 1]}
                                shouldLogin={shouldLogin}
                                shouldJoinMB={shouldJoinMB}
                                shouldCreatRoom={shouldCreatRoom}
                                shouldLeave={shouldLeave}
                                shouldDisconnect={shouldDisconnect}
                              />
                            );
                          }
                        }
                      })}
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
          )}
        </div>
      </Tabs>
    </div>
  );
}
