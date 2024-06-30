import {
  Bot,
  ChevronDown,
  DollarSign,
  Gamepad,
  Hand,
  Loader2,
  LogIn,
  LogOut,
  RefreshCcw,
  SearchCheck,
  Settings,
  SquareMousePointer,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AccountSection } from '../components/account/accountSection';
import BotSetting from '../components/menu/botSheet';
import MainSetting from '../components/menu/mainSetting';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { gameList, roomTypes } from '../lib/config';

import { AntiBotStatus } from '../components/bots/antiBot';
import { formatCurrency } from '../lib/utils';
import { AppContext, GameProps, defaultState } from '../renderer/providers/app';
import useAccountStore from '../store/accountStore';
import { HomePage } from './pages/home';

export function App() {
  const {
    state,
    setState,
    game,
    setGame,
    initialRoom,
    crawingRoom,
    recreateTime,
    gameStatus,
    setGameStatus,
  } = useContext(AppContext);
  const { accounts, clearAccounts } = useAccountStore();

  const bots = accounts['SUB'].filter((item: any) => item.isSelected === true);
  const craws = accounts['BOT'].filter((item: any) => item.isSelected === true);

  const [cardDeck, setCardDeck] = useState('4');
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const [isOpenBotSheet, setIsOpenBotSheet] = useState(false);
  const [shouldLogin, setShouldLogin] = useState(false);
  const [shouldCreatRoom, setShouldCreateRoom] = useState(false);
  const [shouldDisconnect, setShouldDisconnect] = useState(false);
  const [isLoging, setIsLoging] = useState(false);
  const [isFinding, setIsFinding] = useState(false);

  const [refreshTime, setRefreshTime] = useState(0);

  const onLogin = () => {
    setShouldLogin(true);
    setIsLoging(true);
  };

  const onScrollToBoardCard = () => {
    const boardCardId = `boardCard-${state.currentGame.number}`;
    const boardCardElement = document.getElementById(boardCardId);

    if (boardCardElement) {
      const yOffset = -190;
      const y =
        boardCardElement.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const onCreateRoom = () => {
    setShouldCreateRoom(true);
    setIsFinding(true);
  };

  const onToggleCrawing = () => {
    setGameStatus((pre) => ({ ...pre, isPaused: !pre.isPaused }));
  };

  const onRefreshBot = () => {
    setRefreshTime((pre) => pre + 1);
    setShouldDisconnect(true);
    setShouldLogin(false);
    setIsFinding(false);
    setIsLoging(false);
    setState((pre) => ({
      ...defaultState,
      roomType: pre.roomType,
    }));
  };

  useEffect(() => {
    if (
      initialRoom.isGuessOut &&
      initialRoom.isHostOut &&
      crawingRoom.isHostOut &&
      crawingRoom.isGuessOut
    ) {
      setShouldCreateRoom(true);
    }
  }, [
    initialRoom.isGuessOut,
    initialRoom.isHostOut,
    crawingRoom.isHostOut,
    crawingRoom.isGuessOut,
  ]);

  useEffect(() => {
    if (recreateTime) {
      setShouldCreateRoom(false);
      setState((pre) => ({
        ...defaultState,
        foundAt: pre.foundAt,
        roomType: pre.roomType,
        isLoggedIn: pre.isLoggedIn,
      }));
    }
  }, [recreateTime]);

  useEffect(() => {
    if (state.isLoggedIn === false) {
      setIsLoging(false);
    }
  }, [state.isLoggedIn]);

  const handleRoomTypeChange = (money: number) => {
    setState((pre) => ({
      ...pre,
      roomType: money,
    }));
  };

  const handleGameChange = (game: GameProps) => {
    setGame(game);
    clearAccounts();
    onRefreshBot();
  };

  return (
    <div className="h-screen">
      <MainSetting setIsOpen={setIsOpenSheet} isOpen={isOpenSheet}>
        <AccountSection accountType="MAIN" />
        <AccountSection accountType="BOT" />
        <AccountSection accountType="SUB" />
      </MainSetting>
      <div className="flex w-full flex-col">
        <div className="flex flex-col sm:gap-4">
          <main className="grid flex-1 items-start gap-4 bg-background sm:px-6 sm:py-0 md:gap-8 ">
            <div className="flex items-center fixed top-0 left-0 right-0  py-[15px] bg-background border-b z-[21] px-[10px]">
              <div className="ml-auto w-full flex items-center gap-2 justify-between">
                <Button
                  onClick={() => setIsOpenBotSheet(true)}
                  size="sm"
                  className="h-8 gap-1"
                >
                  <Bot />
                </Button>
                <div>
                  <BotSetting
                    isOpen={isOpenBotSheet}
                    setIsOpen={setIsOpenBotSheet}
                  >
                    <ScrollArea className="h-full rounded-md flex flex-col">
                      <div className="flex flex-col  text-white space-y-4 flex-1 w-full">
                        {/* <CoupleSubStatus
                          craw1={bots[0]}
                          craw2={bots[1]}
                          shouldLogin={shouldLogin}
                          shouldCreatRoom={shouldCreatRoom}
                          shouldDisconnect={shouldDisconnect}
                        />
                        <CoupleCrawStatus
                          craw1={craws[0]}
                          craw2={craws[1]}
                          shouldLogin={shouldLogin}
                          shouldCreatRoom={shouldCreatRoom}
                          shouldDisconnect={shouldDisconnect}
                        /> */}
                        <AntiBotStatus
                          craw1={bots[0]}
                          shouldLogin={shouldLogin}
                          shouldCreatRoom={shouldCreatRoom}
                          shouldDisconnect={shouldDisconnect}
                        />
                      </div>
                    </ScrollArea>
                  </BotSetting>
                </div>

                <div className="flex gap-2 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 !border-[#fff]"
                      >
                        <Gamepad className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          {game.name}
                        </span>
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Game</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {gameList.map((g) => (
                        <DropdownMenuCheckboxItem
                          key={g.name}
                          checked={game.name === g.name}
                          onSelect={() => handleGameChange(g)}
                        >
                          {g.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                        className="h-8 gap-1 !border-[#fff]"
                      >
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          {formatCurrency(state.roomType)}
                        </span>
                        <DollarSign className="h-3.5 w-3.5" />
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Room Type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {roomTypes.map((rType) => (
                        <DropdownMenuCheckboxItem
                          key={rType}
                          checked={state.roomType === rType}
                          onSelect={() => handleRoomTypeChange(rType)}
                        >
                          {formatCurrency(rType)}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex gap-2 items-center">
                  {!state.isLoggedIn ? (
                    <Button
                      onClick={onLogin}
                      size="sm"
                      className="h-8 gap-1 cursor-pointer hover:opacity-70"
                      disabled={isLoging}
                    >
                      {isLoging ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <LogIn className="h-3.5 w-3.5" />
                      )}
                      Login
                    </Button>
                  ) : (
                    <Badge>Logged</Badge>
                  )}
                  {!state.targetAt ? (
                    <Button
                      onClick={onCreateRoom}
                      size="sm"
                      className="h-8 gap-1"
                      disabled={isFinding}
                    >
                      {isFinding ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin cursor-pointer hover:opacity-70" />
                      ) : (
                        <SearchCheck className="h-3.5 w-3.5" />
                      )}
                      Find room
                    </Button>
                  ) : (
                    <Badge>Room: {state.targetAt}</Badge>
                  )}
                  <Button
                    onClick={onToggleCrawing}
                    size="sm"
                    className="h-8 gap-1 bg-yellow-500 cursor-pointer hover:opacity-70"
                    disabled={!Boolean(state.foundAt)}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {!gameStatus.isPaused ? 'Stop craw' : 'Continue craw'}
                  </Button>

                  <Button
                    onClick={onRefreshBot}
                    size="sm"
                    className="h-8 gap-1 cursor-pointer hover:opacity-70"
                    variant="destructive"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Refresh
                    </span>
                  </Button>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        onClick={() => onScrollToBoardCard()}
                        className="h-8 gap-1 bg-white flex justify-center items-center px-[10px] rounded-sm cursor-pointer hover:opacity-70"
                      >
                        <SquareMousePointer className="text-black" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Scroll to current game</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        onClick={() => setIsOpenSheet(true)}
                        className="h-8 gap-1 bg-white flex justify-center items-center px-[10px] rounded-sm cursor-pointer hover:opacity-70"
                      >
                        <Settings className="text-black" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Setting</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <HomePage cardDeck={cardDeck} refreshTime={refreshTime} />
          </main>
        </div>
      </div>
    </div>
  );
}
