import {
  DollarSign,
  Hand,
  Loader,
  LogIn,
  LogOut,
  PlusCircle,
  ScreenShareOff,
  Settings,
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
// import { bots, craws } from '../lib/config';
import { HashLoader } from 'react-spinners';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { validateLicense } from '../lib/supabase';
import { AppContext } from '../renderer/providers/app';
import useAccountStore from '../store/accountStore';
import { HomePage } from './pages/home';

export function App() {
  const [tab, setActiveTab] = useState('all');
  const { state, setState } = useContext(AppContext);
  const { accounts } = useAccountStore();
  const { toast } = useToast();
  const bots = accounts['SUB'];
  const craws = accounts['BOT'].filter((item: any) => item.isSelected === true);
  const [cardDeck, setCardDeck] = useState('4');
  const [roomType, setRoomType] = useState('100');
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
  };

  const onJoinMauBinh = () => {
    setShouldJoinMB(true);
  };

  const onCreatRoom = () => {
    setShouldCreateRoom(true);
  };

  const onLeaveRoom = () => {
    setShouldLeave(true);
  };

  const onDisconnect = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (
      process.env.NODE_ENV != 'development' &&
      localStorage.getItem('license-key')
    ) {
      validateLicense(setLoading, toast, navigate);
    }
  }, []);

  const handleRoomTypeChange = (money: string) => {
    setRoomType(money);
  };

  function formatCurrency(value: string) {
    return parseInt(value).toLocaleString('vi-VN');
  }

  return (
    <div className="h-screen">
      <MainSetting setIsOpen={setIsOpenSheet} isOpen={isOpenSheet}>
        <h1 className="text-xl font-semibold">Settings</h1>
        <AccountSection accountType="MAIN" />
        <AccountSection accountType="BOT" />
        <AccountSection accountType="SUB" />
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
                        {state.targetAt && `Room: ${state.targetAt}`}
                      </span>
                    </div>
                    <RadioGroup
                      defaultValue={cardDeck}
                      onValueChange={(value) => {
                        setCardDeck(value);
                      }}
                      className="flex flex-row border py-[4px] px-[7px] rounded-[5px] items-center"
                    >
                      <Hand className="w-3.5 h-3.5" />
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Type: {formatCurrency(roomType)}
                          </span>
                          <DollarSign className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Select room type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={roomType === '100'}
                          onSelect={() => handleRoomTypeChange('100')}
                        >
                          {formatCurrency('100')}
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={roomType === '500'}
                          onSelect={() => handleRoomTypeChange('500')}
                        >
                          {formatCurrency('500')}
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={roomType === '1000'}
                          onSelect={() => handleRoomTypeChange('1000')}
                        >
                          {formatCurrency('1000')} (1k)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={roomType === '2000'}
                          onSelect={() => handleRoomTypeChange('2000')}
                        >
                          {formatCurrency('2000')} (2k)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={roomType === '5000'}
                          onSelect={() => handleRoomTypeChange('5000')}
                        >
                          {formatCurrency('5000')} (5k)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={roomType === '10000'}
                          onSelect={() => handleRoomTypeChange('10000')}
                        >
                          {formatCurrency('10000')} (10k)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={roomType === '20000'}
                          onSelect={() => handleRoomTypeChange('20000')}
                        >
                          {formatCurrency('20000')} (20k)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={roomType === '50000'}
                          onSelect={() => handleRoomTypeChange('50000')}
                        >
                          {formatCurrency('50000')} (50k)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={roomType === '100000'}
                          onSelect={() => handleRoomTypeChange('100000')}
                        >
                          {formatCurrency('100000')} (100k)
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={onLogin} size="sm" className="h-8 gap-1">
                      <LogIn className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Login
                      </span>
                    </Button>
                    {/* <Button
                      onClick={onJoinMauBinh}
                      size="sm"
                      className="h-8 gap-1"
                    >
                      <Unplug className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Connect
                      </span>
                    </Button> */}
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
                  value="find-room"
                  hidden={'find-room' !== tab}
                >
                  <div className="flex flex-col h-screen w-full">
                    {/* <Toolbox /> */}
                    <div className="flex flex-col  text-white space-y-4 flex-1 w-full">
                      {/* <div className="grid grid-cols-2 gap-[20px] w-full"> */}
                      {bots.map(
                        (bot: any, index: any) =>
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

                      {craws.map((bot: any, index: any) => {
                        if (index % 2 === 0 && index < craws.length - 1) {
                          if (index < craws.length - 3) {
                            return (
                              <CoupleCrawStatus
                                key={index}
                                index={index}
                                craw1={bot}
                                craw2={craws[index + 1]}
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
                                craw2={craws[index + 1]}
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
              </main>
            </div>
          )}
        </div>
      </Tabs>
      <HashLoader color="#36d7b7" loading={loading} size={150} />
    </div>
  );
}
