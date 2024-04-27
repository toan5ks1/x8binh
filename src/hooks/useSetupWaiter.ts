import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { handleMessageWaiter } from '../lib/listeners/waiter';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { AppContext, BotStatus } from '../renderer/providers/app';

export function useSetupWaiter(bot: LoginParams) {
  const [socketUrl, setSocketUrl] = useState('');
  const { state, setState } = useContext(AppContext);
  const room = state.crawingRoom[state.foundBy ?? ''];

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
      const newMsg = handleMessageWaiter({
        message,
        state,
        setState,
        user,
        setUser: setUser as React.Dispatch<
          React.SetStateAction<LoginResponseDto>
        >,
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
      const maubinhPingMessage = `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`;

      sendMessage(maubinhPingMessage);

      const intervalId = setInterval(() => {
        sendMessage(maubinhPingMessage);
        setITime((prevITime) => prevITime + 1);
      }, 6000);

      return () => clearInterval(intervalId);
    }
  }, [shouldPingMaubinh]);

  const handleLoginClick = async () => {
    login(bot)
      .then((data: LoginResponse | null) => {
        const user = data?.data[0];
        if (user) {
          setUser(user);
          connectMainGame(user);
        }
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

  const disconnectGame = () => {
    setShouldPingMaubinh(false);
    setShouldConnect(false);
  };

  const handleConnectMauBinh = (): void => {
    setShouldPingMaubinh(true);
  };

  // Auto connect maubinh
  useEffect(() => {
    if (!shouldPingMaubinh && user?.status === BotStatus.Initialized) {
      setTimeout(handleConnectMauBinh, 500);
    }
  }, [user]);

  // Join found room
  useEffect(() => {
    if (state.foundAt && state.foundBy && user && room) {
      if (!room.players.includes(bot.username)) {
        sendMessage(`[3,"Simms",${state.foundAt},"",true]`);
      }
    }
  }, [state.foundBy, state.foundAt]);

  // Waiter ready
  useEffect(() => {
    if (
      (user?.status === BotStatus.Joined ||
        user?.status === BotStatus.Submitted) &&
      room?.isFinish
    ) {
      sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
    }
  }, [user, room]);

  // Crawing
  useEffect(() => {
    if (user) {
      const { status, currentCard: myCards } = user;
      if (status === BotStatus.Received && myCards) {
        // Submit cards
        sendMessage(
          `[5,"Simms",${state.foundAt},{"cmd":603,"cs":[${myCards}]}]`
        );
      }
    }
  }, [user]);

  const handleLeaveRoom = () => {
    if (state.foundAt) {
      return sendMessage(`[4,"Simms",${state.foundAt}]`);
    }
  };

  return {
    user,
    handleLoginClick,
    handleConnectMauBinh,
    messageHistory,
    setMessageHistory,
    connectionStatus,
    handleLeaveRoom,
    disconnectGame,
  };
}
