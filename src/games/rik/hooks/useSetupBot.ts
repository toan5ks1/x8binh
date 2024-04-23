import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AppContext, BotStatus } from '../../../renderer/providers/app';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { handleMessage, isAllHostReady } from '../lib/utils';

export function useSetupBot(bot: LoginParams, isHost: boolean) {
  const [socketUrl, setSocketUrl] = useState('');
  const { state, setState } = useContext(AppContext);
  const room = state.initialRoom;
  const me = state.mainBots[bot.username];

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
      const newMsg = handleMessage({
        message,
        state,
        setState,
        user,
      });

      newMsg && setMessageHistory((msgs) => [...msgs, newMsg]);
    }
  }, [lastMessage]);

  // Ping pong
  useEffect(() => {
    const pingPongMessage = () => ` ["7", "Simms", "1",${iTimeRef.current}]`;

    const intervalId = setInterval(() => {
      shouldConnect && sendMessage(pingPongMessage());
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

  const handleConnectMauBinh = () => {
    setShouldPingMaubinh(true);
  };

  const handleCreateRoom = () => {
    sendMessage(
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
    );
  };

  // Bot join initial room
  useEffect(() => {
    if (
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

      // Host ready
      if (room.players.length === 2) {
        if (bot.username === room.owner) {
          sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
        }
      }
    }
  }, [state.initialRoom]);

  // Guess ready
  useEffect(() => {
    if (
      room &&
      bot.username !== room.owner &&
      me?.status === BotStatus.Joined &&
      isAllHostReady(state)
    ) {
      sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
    }
  }, [state.mainBots, state.crawingBots]);

  // Submit
  useEffect(() => {
    const numOfCrawer = Object.keys(state.crawingBots).length;

    if (
      me?.status === BotStatus.Received &&
      room?.shouldOutVote === numOfCrawer &&
      !state.foundAt
    ) {
      // // Submit cards
      sendMessage(
        `[5,"Simms",${room.id},{"cmd":603,"cs":[${
          room.cardDesk[0][bot.username]
        }]}]`
      );
    }
  }, [state.initialRoom, state.foundAt]);

  // Leave room
  useEffect(() => {
    if (room.isFinish) {
      sendMessage(`[4,"Simms",${state.initialRoom.id}]`);
    }
  }, [state.mainBots[bot.username]]);

  const handleLeaveRoom = () => {
    return sendMessage(`[4,"Simms",${state.initialRoom.id}]`);
  };

  // Recreate room
  useEffect(() => {
    if (state.shouldRecreateRoom && isHost && me.status !== BotStatus.Finding) {
      handleCreateRoom();
      setState((pre) => ({
        ...pre,
        mainBots: {
          ...pre.mainBots,
          [bot.username]: { ...me, status: BotStatus.Finding },
        },
      }));
    }
  }, [state.shouldRecreateRoom]);

  return {
    user,
    handleCreateRoom,
    messageHistory,
    handleLeaveRoom,
    connectionStatus,
    handleLoginClick,
    connectMainGame,
    handleConnectMauBinh,
  };
}
