import {
  ArrowLeft,
  ArrowRight,
  Chrome,
  Home,
  MapPin,
  PlusCircle,
  RefreshCcw,
  SortAsc,
  TrashIcon,
  UserPlus,
} from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { ScrollArea } from '../../components/ui/scroll-area';
import { highlightSyntax } from '../../lib/terminal';
import { AppContext } from '../../renderer/providers/app';
import { HandCard } from '../card/handcard';
import { useToast } from '../toast/use-toast';
import { Toggle } from '../ui/toggle';
import {
  arrangeCardCommand,
  checkPositionCommand,
  getAddNameTagCommand,
  inviteCommand,
} from './commandTerminal';

export const TerminalBoard: React.FC<any> = ({ main, index }) => {
  const { toast } = useToast();
  const [data, setData] = useState<unknown[]>([]);
  const { state, setState } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(false);
  const [isInLobby, setIsInLobby] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [currentSit, setCurrentSit] = useState('');
  const [currentCards, setCurrentCards] = useState<any>();
  const [autoInvite, setAutoInvite] = useState(false);

  // const findCurrent = useCallback((crCard: number[]) => {
  //   let target;
  //   const crawledCards = state.crawingRoom[state.foundBy ?? '']?.cardGame ?? [];
  //   if (crawledCards.length) {
  //     crawledCards.forEach((game) => {
  //       target = Object.values(game).find((card) =>
  //         areArraysEqual(card.cs, crCard)
  //       );
  //     });
  //   }
  //   return target ?? 0;
  // }, []);

  useEffect(() => {
    setState((pre) => ({
      ...pre,
      currentGame: {
        ...pre.currentGame,
        sheet: { [currentSit]: main.username },
      },
    }));
  }, [currentSit]);

  const parseData = (dataString: string) => {
    try {
      const parsedData = JSON.parse(dataString);
      return parsedData;
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };
  const createRoom = (account: any): void => {
    window.backend.sendMessage(
      'execute-script',
      account,
      `__require('GamePlayManager').default.getInstance().requestcreateRoom(4,100,4,)`
    );
  };
  const outRoom = (account: any): void => {
    window.backend.sendMessage(
      'execute-script',
      account,
      `__require('GameController').default.prototype.sendLeaveRoom();`
    );
  };
  function joinRoom(account: any): void {
    window.backend.sendMessage(
      'execute-script',
      account,
      `__require('GamePlayManager').default.getInstance().joinRoom(${state.initialRoom.id},0,'',true);`
    );
    // }
  }

  function checkPosition(account: any): void {
    window.backend.sendMessage('check-position', account, checkPositionCommand);
  }
  async function outInRoom(account: any): Promise<void> {
    if (currentRoom) {
      await outRoom(account);
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.backend.sendMessage(
        'execute-script',
        account,
        `__require('GamePlayManager').default.getInstance().joinRoom(${currentRoom},0,'',true);`
      );
    }
  }
  const joinLobby = (account: any): void => {
    window.backend.sendMessage(
      'execute-script',
      account,
      `__require('LobbyViewController').default.Instance.onClickIConGame(null,"vgcg_4");`
    );
  };

  async function invitePlayer(account: any): Promise<void> {
    await window.backend.sendMessage('execute-script', account, inviteCommand);
  }
  async function openAccounts(account: any) {
    await window.backend.sendMessage('open-accounts', account);
  }
  async function arrangeCards(account: any) {
    await window.backend.sendMessage(
      'execute-script',
      account,
      arrangeCardCommand
    );
  }

  const handleData = ({ data, username }: any) => {
    if (username === main.username) {
      setIsLogin(true);
      if (!data.includes('[6,1') && !data.includes('["7","Simms",')) {
        const parsedData = parseData(data);
        if (parsedData[1]?.ri?.rid) {
          setCurrentRoom(parsedData[1].ri.rid.toString());
        }
        if (parsedData[0] == 3) {
          setCurrentRoom(parsedData[3].toString());
        }
        if (parsedData[0] == 4 && parsedData[1] == true) {
          setCurrentRoom('');
          setCurrentSit('');
        }
        if (parsedData[0] == 5 && parsedData[1].cmd === 317) {
          window.backend.sendMessage(
            'check-room',
            main,
            `__require('GamePlayManager').default.getInstance().getRoomId()`
          );
        }
        if (parsedData[0] == 5 && parsedData[1].cmd === 300) {
          setCurrentRoom('');
          setCurrentSit('');
        }
        if (parsedData[0] == 5) {
          checkPosition(main);
          if (parsedData[2] === currentRoom) {
            console.log('Đang trong ván');
          }
          if (parsedData[1].p) {
            if (parsedData[1].p.uid) {
              toast({
                title: parsedData[1].p.dn,
                description: 'Đã ra khỏi phòng.',
              });
            } else {
              toast({
                title: parsedData[1].p.dn,
                description: 'Đã vào phòng.',
              });
              setState((pre) => ({
                ...pre,
                initialRoom: {
                  ...pre.initialRoom,
                  isSubJoin: true,
                },
              }));
            }
          }
          if (
            parsedData[1].cmd === 602 &&
            (parsedData[1].hsl == false || parsedData[1].hsl == true)
          ) {
            toast({
              title: 'Thông báo',
              description: 'Đã kết thúc ván bài.',
            });
            index === 0 &&
              setState((pre) => ({
                ...pre,
                currentGame: {
                  ...pre.currentGame,
                  number: pre.currentGame.number + 1,
                },
              }));
          }
          if (parsedData[1].cs && parsedData[1].cmd === 600) {
            const currentCards = parsedData[1].cs
              .toString()
              .split(',')
              .map(Number);
            toast({
              title: 'Đã phát bài',
              description: parsedData[1].cs.toString(),
            });

            setData((currentData) => [
              ...currentData,
              parsedData[1].cs.toString().split(',').map(Number),
            ]);
            setState((pre) => ({
              ...pre,
              currentGame: {
                ...pre.currentGame,
                number: !pre.currentGame.number ? 1 : pre.currentGame.number,
              },
            }));
            setCurrentCards(currentCards);
            arrangeCards(main);
          }
        }
        if (parsedData[0] !== '7' && parsedData[0] != 5) {
          setData((currentData) => [...currentData, parsedData]);
        }
      }
    }
  };
  const handleDataSent = ({ data, username }: any) => {
    if (username === main.username) {
      if (data == `[ 1, true, 0, "rik_${main.username}", "Simms", null ]`) {
        console.log('Đã login man');
      }
      if (
        !data.includes('[6,1') &&
        !data.includes(
          '[5,{"rs":[{"mM":1000000,"b' && !data.includes('["7","Simms",')
        )
      ) {
        const parsedData = parseData(data);

        if (parsedData[0] == 6 && parsedData[3].cmd === 301) {
          setIsInLobby(false);
        }
        if (parsedData[0] == 6 && parsedData[3].cmd === 300) {
          setIsInLobby(true);
        }
        if (parsedData[0] == 3 && parsedData[2] === 19) {
          window.backend.sendMessage(
            'check-room',
            main,
            `__require('GamePlayManager').default.getInstance().getRoomId()`
          );
        }
      }
    }
  };
  const handleCheckRoom = ({ data, username }: any) => {
    if (username === main.username) {
      setCurrentRoom(data);
    }
  };
  const handleCheckPosition = ({ data, username }: any) => {
    if (username === main.username) {
      setCurrentSit(parseInt(data + 1).toString());
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoInvite) {
      interval = setInterval(() => {
        invitePlayer(main);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoInvite, main]);

  useEffect(() => {
    window.backend.on('websocket-data', handleData);
    window.backend.on('websocket-data-sent', handleDataSent);
    window.backend.on('check-room', handleCheckRoom);
    window.backend.on('check-position', handleCheckPosition);

    return () => {
      window.backend.removeListener('websocket-data', handleData);
      window.backend.removeListener('websocket-data-sent', handleDataSent);
      window.backend.removeListener('check-room', handleCheckRoom);
      window.backend.removeListener('check-position', handleCheckPosition);
    };
  }, []);

  useEffect(() => {
    window.backend.sendMessage(
      'execute-script',
      main,
      getAddNameTagCommand(main)
    );
  }, [isLogin]);

  const clearData = () => {
    setData([]);
  };

  return (
    <fieldset className=" rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">
        {main.username}
      </legend>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-[10px]">
          <div className="flex justify-end gap-2">
            <Label
              style={{ fontFamily: 'monospace' }}
              className="flex items-center bg-background border p-[5px]  flex-grow justify-start font-bold rounded-sm"
            >
              Room:
              {currentRoom == '19'
                ? 'Chống vây'
                : currentRoom
                ? currentRoom
                : 'Undefined'}
            </Label>

            <div>
              <Label
                style={{ fontFamily: 'monospace' }}
                className="flex items-center bg-background border p-[5px] w-[40px] h-[30px] flex-grow justify-center font-bold rounded-full flex-row gap-[3px]"
              >
                <MapPin className="w-3.5 h-3.5" />
                {currentSit}
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-8 gap-2">
            <Button
              onClick={() => openAccounts(main)}
              style={{ fontFamily: 'monospace' }}
              className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 cursor-pointer h-[30px]"
            >
              <Chrome className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => joinLobby(main)}
              style={{ fontFamily: 'monospace' }}
              className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
            >
              <Home className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => createRoom(main)}
              style={{ fontFamily: 'monospace' }}
              className="rounded-[5px] py-[0px] flex items-center hover:bg-slate-400 cursor-pointer gap-[2px] px-[5px] h-[30px]"
            >
              <PlusCircle className="h-3.5 w-3.5" />
            </Button>

            <Button
              onClick={() => arrangeCards(main)}
              style={{ fontFamily: 'monospace' }}
              className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
            >
              <SortAsc className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => joinRoom(main)}
              style={{ fontFamily: 'monospace' }}
              className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => outRoom(main)}
              style={{ fontFamily: 'monospace' }}
              className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => outInRoom(main)}
              style={{ fontFamily: 'monospace' }}
              className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </Button>
            <div className="h-full w-full rounded-[5px] flex justify-center items-center border">
              <Toggle pressed={autoInvite} onPressedChange={setAutoInvite}>
                <UserPlus className="h-3.5 w-3.5" />
              </Toggle>
            </div>
          </div>
        </div>
        <div className="flex flex-col terminal relative rounded-md border ">
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={clearData}
              className="  hover:bg-slate-400 rounded-[5px] p-0 border-[2px] flex justify-center items-center cursor-pointer  gap-[2px] px-[7px] h-[30px]"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
          <ScrollArea
            id="messageContainer"
            className="flex flex-col grow h-full max-w-screen"
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="font-bold text-left command-input"
                style={{ fontFamily: 'monospace' }}
                dangerouslySetInnerHTML={{
                  __html: highlightSyntax(JSON.stringify(item, null, 2)),
                }}
              />
            ))}
          </ScrollArea>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="w-[50%]">
          {currentCards && (
            <HandCard
              cardProp={currentCards}
              key={0}
              isShowPlayer={false}
              player={main.username}
            />
          )}
        </div>
      </div>
    </fieldset>
  );
};
