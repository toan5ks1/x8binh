import {
  ArrowLeft,
  ArrowRight,
  Check,
  Chrome,
  PlusCircle,
  RefreshCcw,
  RockingChair,
  SortAsc,
  TrashIcon,
  Unplug,
  UserPlus,
} from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { ScrollArea } from '../../components/ui/scroll-area';
import { AppContext } from '../../renderer/providers/app';
import { HandCard } from '../card/handcard';
import { useToast } from '../toast/use-toast';

export const TerminalBoard: React.FC<any> = ({ main }) => {
  const { toast } = useToast();
  const [data, setData] = useState<unknown[]>([]);
  const { state } = useContext<any>(AppContext);
  const [isLogin, setIsLogin] = useState(false);
  const [isInLobby, setIsInLobby] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [currentSit, setCurrentSit] = useState('');
  const [roomToJoin, setRoomToJoin] = useState('');
  const [currentCards, setCurrentCards] = useState<any>();

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
    console.log('đã out room');
    setCurrentRoom('');
    setCurrentSit('');
  };
  function joinRoom(account: any): void {
    // if (state.initialRoom.id) {
    window.backend.sendMessage(
      'execute-script',
      account,
      // `__require('GamePlayManager').default.getInstance().joinRoom(${state.initialRoom.id},0,'',true);`
      `__require('GamePlayManager').default.getInstance().joinRoom(${roomToJoin},0,'',true);`
    );
    // }
  }
  function checkPosition(account: any): void {
    window.backend.sendMessage(
      'check-position',
      account,
      // `
      //   var uuid = __require('GamePlayManager').default.Instance.loginDict.uid;
      //   var players = cc.find("Canvas/MainUI/MauBinhController")._components[0].cardGameTableController.gameController.AllPlayers;
      //   var uids = Object.keys(players);
      //   uids.indexOf(uuid.toString());
      //   `
      `cc.find("Canvas/MainUI/MauBinhController")._components[0].cardGameTableController.gameController.state`
    );
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
    await window.backend.sendMessage(
      'execute-script',
      account,
      `
        try{
          var btnInvite = cc.find("Canvas/MainUI/MauBinhController/BtnInvite");
          if (btnInvite) {
              btnInvite.active = true;
          }
          if (btnInvite) {
              btnInvite.on('touchstart', function() {
                  console.log('Đã mời người khác vào.');
              });
          }
          if (btnInvite) {
              btnInvite.active = true;
              btnInvite.opacity = 255;
              btnInvite.visible = true;
          }
          let touchEventStart = new cc.Event.EventTouch([new cc.Touch(0, 0)], false);
          touchEventStart.type = cc.Node.EventType.TOUCH_START;
          btnInvite.dispatchEvent(touchEventStart);

          let touchEventEnd = new cc.Event.EventTouch([new cc.Touch(0, 0)], false);
          touchEventEnd.type = cc.Node.EventType.TOUCH_END;
          btnInvite.dispatchEvent(touchEventEnd);
        }catch{
          if (btnInvite) {
              btnInvite.active = true;
          }
          if (btnInvite) {
              btnInvite.on('touchstart', function() {
                  console.log('Đã mời người chơi khác vào');
              });
          }
          if (btnInvite) {
              btnInvite.active = true;
              btnInvite.opacity = 255;
              btnInvite.visible = true;
          }

          touchEventStart.type = cc.Node.EventType.TOUCH_START;
          btnInvite.dispatchEvent(touchEventStart);

          touchEventEnd.type = cc.Node.EventType.TOUCH_END;
          btnInvite.dispatchEvent(touchEventEnd);
        }

      `
    );
  }
  async function openAccounts(account: any) {
    await window.backend.sendMessage('open-accounts', account);
  }
  async function arrangeCards(account: any) {
    await window.backend.sendMessage(
      'execute-script',
      account,
      `
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
        } catch (e) {
          console.log("Sap bai ERROR: ", e.toString());
        }
      };
      window.sapBaiMinh()`
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
            }
          }
          if (parsedData[1].cmd === 602 && parsedData[1].hsl == false) {
            console.log('Đã kết thúc ván bài.');
            toast({
              title: 'Thông báo',
              description: 'Đã kết thúc ván bài.',
            });
          }
          if (parsedData[1].cs && parsedData[1].cmd === 600) {
            toast({
              title: 'Đã phát bài',
              description: parsedData[1].cs.toString(),
            });
            setData((currentData) => [
              ...currentData,
              parsedData[1].cs.toString().split(',').map(Number),
            ]);
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
  const handleCheckPosition = ({ data, username }: any) => {
    if (username === main.username) {
      setCurrentSit(parseInt(data + 1).toString());
    }
  };

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
    <div className="flex flex-col terminal relative rounded-md border ">
      <div className="flex flex-row justify-between bg-[#141414] gap-[10px]">
        <div className="flex flex-row">
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
            className="flex items-center bg-background border !w-[100px] truncate p-[5px] flex-grow justify-center font-bold rounded-sm"
          >
            {main.username}
          </Label>
        </div>
        <div className="flex flex-row gap-2">
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

              <Button
                onClick={() => joinLobby(main)}
                style={{ fontFamily: 'monospace' }}
                className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
              >
                <Unplug className="h-3.5 w-3.5" />
                <span>Lobby</span>
              </Button>

              {currentRoom && (
                <>
                  <Button
                    onClick={() => invitePlayer(main)}
                    style={{ fontFamily: 'monospace' }}
                    className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Invite</span>
                  </Button>
                  <Button
                    onClick={() => arrangeCards(main)}
                    style={{ fontFamily: 'monospace' }}
                    className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
                  >
                    <SortAsc className="h-3.5 w-3.5" />
                    <span>Arrange</span>
                  </Button>
                  <Button
                    onClick={() => checkPosition(main)}
                    style={{ fontFamily: 'monospace' }}
                    className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Check Pos</span>
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
          <input onChange={(e) => setRoomToJoin(e.target.value)} />
          <Button
            onClick={() => joinRoom(main)}
            style={{ fontFamily: 'monospace' }}
            className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>In</span>
          </Button>
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
      <div className="absolute bottom-0 right-0 w-[20%]">
        {currentCards && <HandCard cardProp={currentCards} key={0} />}
      </div>
    </div>
  );
};
