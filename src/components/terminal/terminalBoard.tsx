import {
  ArrowLeft,
  ArrowRight,
  Chrome,
  Home,
  MapPin,
  PlusCircle,
  RefreshCcw,
  TrashIcon,
  UserPlus,
} from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { ScrollArea } from '../../components/ui/scroll-area';
import { fillLoginParam, openAccounts } from '../../lib/login';
import { addMoney } from '../../lib/supabase';
import { highlightSyntax } from '../../lib/terminal';
import { AppContext } from '../../renderer/providers/app';
import { useToast } from '../toast/use-toast';
import { Toggle } from '../ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  arrangeCardCommand,
  checkPositionCommand,
  inviteCommand,
} from './commandTerminal';

export const TerminalBoard: React.FC<any> = ({ main }) => {
  const { toast } = useToast();
  const [data, setData] = useState<unknown[]>([]);
  const { state, game, setState, setInitialRoom, initialRoom } =
    useContext(AppContext);
  const [isInLobby, setIsInLobby] = useState(false);
  const [currentSit, setCurrentSit] = useState('');
  const [autoInvite, setAutoInvite] = useState(false);

  useEffect(() => {
    setState((pre) => ({
      ...pre,
      currentGame: {
        ...pre.currentGame,
        sheet: {
          ...pre.currentGame.sheet,
          [currentSit]: main.username,
        },
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
  // const createRoom = (account: any): void => {
  //   window.backend.sendMessage(
  //     'execute-script',
  //     account,
  //     `__require('GamePlayManager').default.getInstance().requestcreateRoom(4,100,4,)`
  //   );
  // };
  const outRoom = (account: any): void => {
    if (initialRoom.isSubJoin) {
      window.backend.sendMessage(
        'execute-script',
        account,
        `__require('GameController').default.prototype.sendLeaveRoom();`
      );
    }
  };
  function joinRoom(account: any): void {
    if (state.targetAt) {
      window.backend.sendMessage(
        'execute-script',
        account,
        `__require('GamePlayManager').default.getInstance().joinRoom(${state.targetAt},0,'',true);`
      );
    }
  }

  function checkPosition(account: any): void {
    window.backend.sendMessage('check-position', account, checkPositionCommand);
  }
  const moneyChange = async (key: string | null, money: number) => {
    if (money && key) {
      addMoney(key, money);
    } else {
      toast({ title: 'Error', description: 'Not have money to change.' });
    }
  };
  async function outInRoom(account: any): Promise<void> {
    if (state.targetAt) {
      await outRoom(account);
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.backend.sendMessage(
        'execute-script',
        account,
        `__require('GamePlayManager').default.getInstance().joinRoom(${state.targetAt},0,'',true);`
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

  async function arrangeCards(account: any) {
    await window.backend.sendMessage(
      'execute-script',
      account,
      arrangeCardCommand
    );
  }

  const handleData = ({ data, username, displayName }: any) => {
    if (username === main.username) {
      if (!data.includes('[6,1') && !data.includes('["7","Simms",')) {
        const parsedData = parseData(data);
        // if (parsedData[1]?.ri?.rid) {
        //   setCurrentRoom(parsedData[1].ri.rid.toString());
        // }
        // if (parsedData[0] == 3) {
        //   setCurrentRoom(parsedData[3].toString());
        // }
        if (parsedData[0] == 4 && parsedData[1] == true) {
          // setCurrentRoom('');
          // setCurrentSit('');
        }
        if (parsedData[0] == 5 && parsedData[1].cmd === 317) {
          window.backend.sendMessage(
            'check-room',
            main,
            `__require('GamePlayManager').default.getInstance().getRoomId()`
          );
        }
        if (parsedData[0] == 5 && parsedData[1].cmd === 300) {
          // setCurrentRoom('');
          // setCurrentSit('');
        }
        if (parsedData[0] == 3 && parsedData[1] === true) {
          setInitialRoom((pre) => ({ ...pre, isSubJoin: true }));
        }
        if (parsedData[0] == 5) {
          checkPosition(main);
          if (parsedData[2] === state.targetAt) {
            // console.log('Đang trong ván');
          }
          if (parsedData[1].cmd === 205) {
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
            }
          }
          if (
            parsedData[1].cmd === 602 &&
            (parsedData[1].hsl == false || parsedData[1].hsl == true)
          ) {
            const user = parsedData[1].ps.find(
              (item: { dn: string }) => item.dn === displayName
            );
            if (user) {
              const licenseKey =
                process.env.NODE_ENV != 'development'
                  ? localStorage.getItem('license-key')
                  : ('local-chase' as string);
              moneyChange(licenseKey, parseInt(user.mX));
            } else {
              console.log('Username not found.');
            }

            setState((pre) => {
              return {
                ...pre,
                currentGame: {
                  ...pre.currentGame,
                  number:
                    pre.activeMain === main.username
                      ? pre.currentGame.number + 1
                      : pre.currentGame.number,
                },
              };
            });
          }
          if (parsedData[1].cs && parsedData[1].cmd === 600) {
            const currentCards = parsedData[1].cs
              .toString()
              .split(',')
              .map(Number);
            toast({
              title: 'Đã phát bài',
              description: currentCards,
            });

            setData((currentData) => [
              ...currentData,
              parsedData[1].cs.toString().split(',').map(Number),
            ]);

            // First game
            main.username &&
              setState((pre) => {
                return {
                  ...pre,
                  activeMain: main.username,
                };
              });

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

  const onLogin = () => {
    fillLoginParam(main, game.loginUI);
  };

  useEffect(() => {
    window.backend.on('websocket-data', handleData);
    window.backend.on('websocket-data-sent', handleDataSent);
    window.backend.on('check-position', handleCheckPosition);

    return () => {
      window.backend.removeListener('websocket-data', handleData);
      window.backend.removeListener('websocket-data-sent', handleDataSent);
      window.backend.removeListener('check-position', handleCheckPosition);
    };
  }, []);

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
              Room: {state.targetAt ?? ''}
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
          <div className="grid grid-cols-7 gap-2">
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => openAccounts(main, game)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <Chrome className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Profile</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={onLogin}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Login</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => joinLobby(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <Home className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Join Lobby</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => joinRoom(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Join Room</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => outRoom(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-full bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Out Room</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={() => outInRoom(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px] h-[30px] bg-white flex items-center hover:bg-slate-400 justify-center cursor-pointer hover:opacity-70"
                >
                  <RefreshCcw className="h-3.5 w-3.5 text-black" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Out-In Room</p>
              </TooltipContent>
            </Tooltip>
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
              onClick={() => setData([])}
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
      {/* <div className="flex justify-center mt-4">
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
      </div> */}
    </fieldset>
  );
};
