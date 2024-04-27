import { PaperPlaneIcon } from '@radix-ui/react-icons';
import {
  ArrowLeft,
  ArrowRight,
  Chrome,
  PlusCircle,
  RefreshCcw,
  RockingChair,
  SortAsc,
  TrashIcon,
  Unplug,
} from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ScrollArea } from '../../components/ui/scroll-area';
import { AppContext } from '../../renderer/providers/app';

export const TerminalBoard: React.FC<any> = ({ main }) => {
  const [data, setData] = useState<unknown[]>([]);
  const { state } = useContext<any>(AppContext);
  const [command, setCommand] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isInLobby, setIsInLobby] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [currentSit, setCurrentSit] = useState('');
  const parseData = (dataString: string) => {
    try {
      const parsedData = JSON.parse(dataString);
      return parsedData;
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };

  const sendMessage = () => {
    console.log('create ROom');
    window.backend.sendMessage('send-message', [
      '[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]',
    ]);
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
      `f12_GameController.sendLeaveRoom();`
    );
    console.log('đã out room');
    setCurrentRoom('');
    setCurrentSit('');
  };
  function joinRoom(account: any): void {
    if (state.initialRoom.id) {
      window.backend.sendMessage(
        'execute-script',
        account,
        `__require('GamePlayManager').default.getInstance().joinRoom(${state.initialRoom.id},0,'',true);`
      );
    }
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
      `f12_Joinlobby.default.Instance.onClickIConGame(null,"vgcg_4");`
    );
  };

  function openPuppeteer(): void {
    window.backend.sendMessage('start-puppeteer');
  }
  async function openAccounts(account: any) {
    await window.backend.sendMessage('open-accounts', account);
  }
  async function arrangeCards(account: any) {
    await window.backend.sendMessage(
      'execute-script',
      account,
      `window.sapBaiMinh()`
    );
  }

  const highlightSyntax = (jsonString: string) => {
    let escapedHtml = jsonString.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    escapedHtml = escapedHtml.replaceAll(' ', '');
    escapedHtml = escapedHtml.replace(
      /("[^"\\]*(?:\\.[^"\\]*)*")/g,
      `<span class='string-terminal'>$1</span>`
    );
    escapedHtml = escapedHtml.replace(/"/g, '&quot;');
    escapedHtml = escapedHtml.replaceAll('[', '<span class="bracket">[</span>');
    escapedHtml = escapedHtml.replaceAll(']', '<span class="bracket">]</span>');
    escapedHtml = escapedHtml.replaceAll(
      ',',
      '<span class="comma-terminal">,</span>'
    );
    escapedHtml = escapedHtml.replaceAll(
      '{',
      '<span class="angle-brackets">{</span>'
    );
    escapedHtml = escapedHtml.replaceAll(
      '}',
      '<span class="angle-brackets">}</span>'
    );
    escapedHtml = escapedHtml.replace(
      /\b\d+\b/g,
      '<span class="number">$&</span>'
    );
    return escapedHtml;
  };
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
        if (parsedData[0] == 4 && parsedData[1]) {
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

        if (parsedData[0] == 5 && parsedData[1].ps) {
          setCurrentSit(parsedData[1].ps.length);
        }
        if (parsedData[0] == 5) {
          if (parsedData[1].p) {
            if (parsedData[1].p.uid) {
              console.log('Đã có thằng vào phòng', parsedData[1].p.dn);
              // setCurrentSit((parseInt(currentSit) + 1).toString());
            } else {
              console.log('Đã có thằng rời phòng', parsedData[1].p.dn);
              // setCurrentSit((parseInt(currentSit) - 1).toString());
            }
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
        // console.log('Data senmt:', parsedData);

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

  useEffect(() => {
    window.backend.on('websocket-data', handleData);
    window.backend.on('websocket-data-sent', handleDataSent);
    window.backend.on('check-room', handleCheckRoom);

    return () => {
      window.backend.removeListener('websocket-data', handleData);
      window.backend.removeListener('websocket-data-sent', handleDataSent);
      window.backend.removeListener('check-room', handleCheckRoom);
    };
  }, []);

  useEffect(() => {
    window.backend.sendMessage(
      'execute-script',
      main,
      `window.f12_gm = __require('GamePlayManager').default.getInstance();
      window.f12_JoinRoom = __require('GamePlayManager').default.getInstance();
      window.f12_Joinlobby = __require('LobbyViewController');
      window.f12_GameController = __require('GameController').default.prototype;
      window.sapBaiMinh = async function () {
        try {
          gg = cc
            .find("Canvas")
            .getChildByName("MainUI")
            .getChildByName("MauBinhController")._components[0]
            .cardGameTableController.gameController;
          let tempBet = gg.bet;
          gg.bet = 100;
          gg.onClickTuSapBai();
          gg.bet = tempBet;
          window.delay(Math.floor(Math.random() * 5000 + 35000)).then(function () {
            if (autoPlayMode) {
              window.xepBaiXong();
            }
          });
        } catch (e) {
          console.log("Sap bai ERROR: ", e.toString());
        }
      };
      var myDiv = document.createElement("div");
      myDiv.id = 'div_id';
      myDiv.innerHTML = '<h2 style="color:#fff;position:fixed;top:0;right:0;z-index:99999;background:#020817;padding:15px;border: solid 1px #1E293B; border-radius: 15px">${main.username} </h2>';
      document.body.appendChild(myDiv);`
    );
  }, [isLogin]);

  const clearData = () => {
    setData([]);
  };

  return (
    <div className="flex flex-col terminal relative rounded-md border">
      <div className="flex flex-row justify-end bg-[#141414] gap-[10px]">
        {currentRoom && (
          <Label
            style={{ fontFamily: 'monospace' }}
            className="flex items-center bg-background border p-[5px] flex-grow justify-center font-bold rounded-sm"
          >
            {currentRoom == '19' ? 'Chống vây' : currentRoom}
          </Label>
        )}
        {currentSit && (
          <Label
            style={{ fontFamily: 'monospace' }}
            className="flex items-center bg-background border p-[5px] flex-grow justify-center font-bold rounded-full flex-row gap-[3px]"
          >
            <RockingChair className="w-3.5 h-3.5" />
            {currentSit}
          </Label>
        )}
        <Label
          style={{ fontFamily: 'monospace' }}
          className="flex items-center bg-background border p-[5px] flex-grow justify-center font-bold rounded-sm"
        >
          {main.username}
        </Label>
        {isLogin && (
          <>
            {isInLobby && (
              <Button
                onClick={() => createRoom(main)}
                style={{ fontFamily: 'monospace' }}
                className="rounded-[5px] py-[0px] flex items-center hover:bg-slate-400 cursor-pointer gap-[2px] px-[5px] h-[30px]"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create</span>
              </Button>
            )}

            {!isInLobby && (
              <Button
                onClick={() => joinLobby(main)}
                style={{ fontFamily: 'monospace' }}
                className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
              >
                <Unplug className="h-3.5 w-3.5" />
                <span>Lobby</span>
              </Button>
            )}

            {state.initialRoom.id && (
              <Button
                onClick={() => joinRoom(main)}
                style={{ fontFamily: 'monospace' }}
                className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                <span>In</span>
              </Button>
            )}
            {currentRoom && (
              <>
                <Button
                  onClick={() => arrangeCards(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
                >
                  <SortAsc className="h-3.5 w-3.5" />
                  <span>Arrange</span>
                </Button>
                <Button
                  onClick={() => outRoom(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Out</span>
                </Button>
                <Button
                  onClick={() => outInRoom(main)}
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  <span>Out-In</span>
                </Button>
              </>
            )}
          </>
        )}
        <Button
          onClick={() => openAccounts(main)}
          style={{ fontFamily: 'monospace' }}
          className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 cursor-pointer h-[30px]"
        >
          <Chrome className="h-3.5 w-3.5 ml-[3px]" />
          <span>Open</span>
        </Button>
        <Button
          onClick={clearData}
          className="  hover:bg-slate-400 rounded-[5px] p-0 border-[2px] flex justify-center items-center cursor-pointer  gap-[2px] px-[7px] h-[30px]"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea
        id="messageContainer"
        className="flex flex-col grow h-full max-w-screen mb-[30px]"
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
      <div className="sticky bottom-0">
        <Card className="flex flex-row justify-between p-[5px]">
          <Input
            type="text"
            className="!h-auto"
            style={{ fontFamily: 'monospace' }}
            placeholder="Type messsage..."
            onChange={(e) => setCommand(e.target.value)}
          />
          <Button
            style={{ fontFamily: 'monospace' }}
            onClick={sendMessage}
            className="rounded-[5px] px-[25px] flex justify-center gap-[3px] items-center border-[2px] hover:bg-slate-400"
          >
            <PaperPlaneIcon />
            <p>Send</p>
          </Button>
        </Card>
      </div>
    </div>
  );
};
