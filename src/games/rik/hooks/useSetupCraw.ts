import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AppContext, BotStatus } from '../../../renderer/providers/app';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { handleMessageCrawing, isAllHostReady } from '../lib/utils';

export function useSetupCraw(
  bot: LoginParams,
  coupleId: string,
  isHost: boolean
) {
  const [socketUrl, setSocketUrl] = useState('');
  const { state, setState } = useContext(AppContext);
  const initRoom = state.initialRoom;
  const room = state.crawingRoom[coupleId];
  const me = state.crawingBots[bot.username];

  const [user, setUser] = useState<LoginResponseDto | undefined>(undefined);
  const [shouldPingMaubinh, setShouldPingMaubinh] = useState(false);

  const [iTime, setITime] = useState(1);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [shouldConnect, setShouldConnect] = useState(false);

  const iTimeRef = useRef(iTime);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
      onOpen: () => console.log('Connected'),
    },
    shouldConnect
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Đang kết nối',
    [ReadyState.OPEN]: 'Sẵn sàng',
    [ReadyState.CLOSING]: 'Ngắt kết nối',
    [ReadyState.CLOSED]: 'Đã đóng',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    iTimeRef.current = iTime;
  }, [iTime]);

  // Handle message from server
  useEffect(() => {
    if (lastMessage !== null && user) {
      const message = JSON.parse(lastMessage.data);
      const newMsg = handleMessageCrawing({
        message,
        state,
        setState,
        user,
        coupleId,
      });

      newMsg && setMessageHistory((msgs) => [...msgs, newMsg]);
    }
  }, [lastMessage]);

  // Ping pong
  useEffect(() => {
    const pingPongMessage = `["7", "Simms", "1",${iTimeRef.current}]`;

    const intervalId = setInterval(() => {
      shouldConnect && sendMessage(pingPongMessage);
      setITime((prevITime) => prevITime + 1);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [sendMessage, shouldConnect]);

  // Ping maubinh
  useEffect(() => {
    if (shouldPingMaubinh) {
      const maubinhPingMessage = () =>
        `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`;

      sendMessage(maubinhPingMessage());

      const intervalId = setInterval(() => {
        sendMessage(maubinhPingMessage());
        setITime((prevITime) => prevITime + 1);
      }, 6000);

      return () => clearInterval(intervalId);
    }
  }, [shouldPingMaubinh]);

  const handleLoginClick = async () => {
    login(bot)
      .then((data: LoginResponse | null) => {
        const user = data?.data[0];
        setUser(user);
        user && connectMainGame(user);
      })
      .catch((err: Error) =>
        console.error('Error when calling login function:', err)
      );
  };

  const connectMainGame = (user: LoginResponseDto) => {
    if (user?.token) {
      const connectURL = 'wss://cardskgw.ryksockesg.net/websocket';
      setSocketUrl(connectURL);
      sendMessage(
        `[1,"Simms","","",{"agentId":"1","accessToken":"${user.token}","reconnect":false}]`
      );
      setShouldConnect(true);
    }
  };

  const handleConnectMauBinh = (): void => {
    setShouldPingMaubinh(true);
  };

  const handleCreateRoom = (): void => {
    sendMessage(
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
    );
  };

  // Bot join initial room
  useEffect(() => {
    if (
      room &&
      room.id &&
      Object.keys(room.cardDesk).length === 0 // Make sure cards isn't received
    ) {
      // Host and guess join after created room
      if (room.players.length < 2) {
        if (bot.username === room.owner && room.players.length === 0) {
          // Host
          sendMessage(`[3,"Simms",${room.id},""]`);
        } else if (bot.username !== room.owner && room.players.length === 1) {
          // Guess
          sendMessage(`[3,"Simms",${room.id},"",true]`);
        }
      }

      if (room.players.length === 2 && me.status === BotStatus.Joined) {
        if (bot.username === room.owner) {
          // Host ready
          sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
        }
      }
    }
  }, [state.crawingRoom[coupleId]]);

  // Guess ready
  useEffect(() => {
    if (
      room &&
      bot.username !== room.owner &&
      me?.status === BotStatus.Joined &&
      isAllHostReady(state) &&
      !room.isFinish
    ) {
      sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
    }
  }, [state.mainBots, state.crawingBots]);

  // Check cards
  useEffect(() => {
    if (!state.foundAt) {
      if (
        room?.cardDesk[0] &&
        Object.keys(room.cardDesk[0]).length === 2
        // initRoom.cardDesk[0] &&
        // Object.keys(initRoom.cardDesk[0]).length === 2
      ) {
        // if (isFoundCards(room.cardDesk[0], initRoom.cardDesk[0])) {
        if (coupleId === 'nbmhkghjh456mnnbktyu453') {
          setState((pre) => ({
            ...pre,
            foundAt: state.crawingRoom['nbmhkghjh456mnnbktyu453'].id,
            foundBy: 'nbmhkghjh456mnnbktyu453',
          }));
        } else {
          console.log('Not match!');

          // Submit cards
          sendMessage(
            `[5,"Simms",${room.id},{"cmd":603,"cs":[${
              room.cardDesk[0][bot.username]
            }]}]`
          );
        }
      }
    } else {
      console.log('Found: ', state.foundAt);
    }
  }, [room, state.initialRoom]);

  useEffect(() => {
    // Leave room
    if (room?.isFinish && coupleId !== state.foundBy) {
      sendMessage(`[4,"Simms",${room.id}]`);
    }
  }, [me, state.foundBy, room]);

  const handleLeaveRoom = () => {
    return sendMessage(`[4,"Simms",${room.id}]`);
  };

  // Recreate room
  useEffect(() => {
    if (
      state.shouldRecreateRoom &&
      isHost &&
      me?.status !== BotStatus.Finding
    ) {
      handleCreateRoom();
      setState((pre) => ({
        ...pre,
        crawingBots: {
          ...pre.crawingBots,
          [bot.username]: { ...me, status: BotStatus.Finding },
        },
      }));
    }
  }, [state.shouldRecreateRoom]);

  // Found room submit cards
  useEffect(() => {
    // state.foundBy && console.log('froom', state.crawingRoom[state.foundBy]);

    if (coupleId === state.foundBy) {
      const cardDesk = room.cardDesk[room.cardDesk.length - 1];
      const myCards = cardDesk ? cardDesk[bot.username] : null;
      if (
        // myCards &&
        me.status === BotStatus.Received &&
        // room.isFinish &&
        room.players.length === 4 &&
        myCards
      ) {
        // Submit cards
        sendMessage(`[5,"Simms",${room.id},{"cmd":603,"cs":[${myCards}]}]`);

        console.log('desk', room.cardDesk);
      }

      if (room.isFinish) {
        setTimeout(() => {
          console.log('craw call ready new game');
          sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
        }, 2100);
        // ready for new game
      }

      if (room.isFinish && isHost && me.status === BotStatus.Ready) {
        sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
      }
    }
  }, [state.foundBy, room, me]);

  // Crawing
  // useEffect(() => {
  //   if (
  //     state.foundBy &&
  //     state.crawingBots[bot.username]?.status === BotStatus.Received
  //   ) {
  //     const crawingRoom = state.crawingRoom[state.foundBy];
  //     const myCards = crawingRoom.cardDesk[crawingRoom.cardDesk.length - 1]
  //       ? crawingRoom.cardDesk[crawingRoom.cardDesk.length - 1][bot.username]
  //       : null;
  //     if (myCards) {
  //       // Submit cards
  //       sendMessage(
  //         `[5,"Simms",${state.foundAt},{"cmd":603,"cs":[${myCards}]}]`
  //       );
  //     }
  //   }
  // }, [state.crawingRoom]);

  return {
    user,
    handleLoginClick,
    handleConnectMauBinh,
    handleCreateRoom,
    messageHistory,
    connectionStatus,
    handleLeaveRoom,
  };
}
