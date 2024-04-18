import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AppContext, BotStatus } from '../../../renderer/providers/app';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { handleMessageCrawing, isFoundCards } from '../lib/utils';

export function useSetupCraw(
  bot: LoginParams,
  coupleId: string,
  isHost: boolean
) {
  const { state, setState } = useContext(AppContext);
  const [socketUrl, setSocketUrl] = useState('');

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
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data);
      const newMsg = handleMessageCrawing({
        message,
        setState,
        caller: bot.username,
        coupleId,
      });

      newMsg && setMessageHistory((msgs) => [...msgs, newMsg]);
    }
  }, [lastMessage]);

  // Ping pong
  useEffect(() => {
    const pingPongMessage = () => ` ["7", "Simms", "1",${iTimeRef.current}]`;

    const intervalId = setInterval(() => {
      sendMessage(pingPongMessage());
      setITime((prevITime) => prevITime + 1);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [sendMessage]);

  // Ping maubinh
  useEffect(() => {
    if (shouldPingMaubinh) {
      const maubinhPingMessage = () =>
        `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`;

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
      setShouldConnect(true);
      sendMessage(
        `[1,"Simms","","",{"agentId":"1","accessToken":"${user.token}","reconnect":false}]`
      );
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

  // useEffect(() => {
  //   if (
  //     Object.keys(state.initialRoom.cardDesk).length &&
  //     isHost &&
  //     state.crawingBots[bot.username]?.status === BotStatus.Connected
  //   ) {
  //     handleCreateRoom();
  //     setState((pre) => {
  //       const newStatus = {
  //         status: BotStatus.Finding,
  //       };
  //       return {
  //         ...pre,
  //         crawingBots: {
  //           ...pre.crawingBots,
  //           [bot.username]: newStatus,
  //         },
  //       };
  //     });
  //   }
  // }, [state.crawingBots]);

  // Bot join initial room
  useEffect(() => {
    const room = state.crawingRoom[coupleId];
    if (
      room &&
      room.id &&
      Object.keys(room.cardDesk).length === 0 // Make sure cards isn't received
    ) {
      // Host and guess join after created room
      if (room.players < 2) {
        if (bot.username === room.owner && room.players === 0) {
          // Host
          sendMessage(`[3,"Simms",${room.id},""]`);
        } else if (bot.username !== room.owner && room.players === 1) {
          // Guess
          sendMessage(`[3,"Simms",${room.id},"",true]`);
        }
      }

      // Host and guess ready
      if (room.players === 2) {
        if (bot.username === room.owner) {
          // Host
          sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
        } else {
          // Guess
          sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
        }
      }
    }
  }, [state.crawingRoom[coupleId]]);

  // Check cards
  useEffect(() => {
    if (!state.foundAt) {
      const initRoom = state.initialRoom;
      const room = state.crawingRoom[coupleId];
      if (
        room &&
        Object.keys(room.cardDesk).length === 2 &&
        initRoom &&
        Object.keys(initRoom.cardDesk).length === 2
      ) {
        if (isFoundCards(room.cardDesk, initRoom.cardDesk)) {
          setState((pre) => ({ ...pre, foundAt: room.id }));
        } else {
          console.log('Not match!');

          // Submit cards
          sendMessage(
            `[5,"Simms",${room.id},{"cmd":603,"cs":[${
              room.cardDesk[bot.username]
            }]}]`
          );
        }
      }
    } else {
      console.log('Found: ', state.foundAt);
    }
  }, [state.crawingRoom[coupleId], state.initialRoom]);

  useEffect(() => {
    const room = state.crawingRoom[coupleId];
    const me = state.crawingBots[bot.username];
    // Leave room
    if (me?.status === BotStatus.Submitted) {
      sendMessage(`[4,"Simms",${room.id}]`);
    }
  }, [state.crawingBots[bot.username]]);

  return {
    user,
    handleLoginClick,
    handleConnectMauBinh,
    handleCreateRoom,
    messageHistory,
    connectionStatus,
  };
}
