import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AppContext, BotStatus } from '../../../renderer/providers/app';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { handleMessage } from '../lib/utils';

export function useSetupBot(bot: LoginParams) {
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
      const newMsg = handleMessage({
        message,
        setState,
        caller: bot.username,
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

  // Bot join initial room
  useEffect(() => {
    if (
      state.initialRoom.id &&
      Object.keys(state.initialRoom.cardDesk).length === 0 // Make sure cards isn't received
    ) {
      const room = state.initialRoom;

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
  }, [state.initialRoom]);

  // Submit
  useEffect(() => {
    const room = state.initialRoom;
    const me = state.mainBots[bot.username];
    // const numOfCrawer = Object.keys(state.crawingBots).length;

    if (me?.status === BotStatus.Received && room?.shouldOutVote > 0) {
      // // Submit cards
      sendMessage(
        `[5,"Simms",${room.id},{"cmd":603,"cs":[${
          room.cardDesk[bot.username]
        }]}]`
      );
      console.log(room.shouldOutVote);
    }
  }, [state.initialRoom]);

  // Leave room
  useEffect(() => {
    const room = state.initialRoom;
    const me = state.mainBots[bot.username];

    if (me?.status === BotStatus.Submitted) {
      sendMessage(`[4,"Simms",${room.id}]`);
    }
  }, [state.mainBots[bot.username]]);

  const handleLeaveRoom = useCallback(() => {
    return sendMessage(`[4,"Simms",${state.initialRoom.id}]`);
  }, [state.initialRoom.id]);

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
