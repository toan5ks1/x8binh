import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AppContext } from '../../../renderer/providers/app';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { handleMessage } from '../lib/utils';

export function useSetupBot(bot: LoginParams) {
  const { state, setState } = useContext<any>(AppContext);
  const [socketUrl, setSocketUrl] = useState('');

  const [user, setUser] = useState<LoginResponseDto | undefined>(undefined);
  const [shouldPingMaubinh, setShouldPingMaubinh] = useState(false);
  const [wasLogin, setWasLogin] = useState(false);

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

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data);
      const newMsg = handleMessage({ message, setState });

      setMessageHistory((msgs) => [...msgs, newMsg]);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (wasLogin) {
      const pingPongMessage = () => ` ["7", "Simms", "1",${iTimeRef.current}]`;

      const intervalId = setInterval(() => {
        sendMessage(pingPongMessage());
        setITime((prevITime) => prevITime + 1);
      }, 4000);

      return () => clearInterval(intervalId);
    }
  }, [sendMessage]);

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
      setWasLogin(true);
    }
  };

  const handleConnectMauBinh = (): void => {
    setShouldPingMaubinh(true);
    sendMessage('[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]');
  };

  const handleCreateRoom = (): void => {
    sendMessage(
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
    );

    // setShouldPingMaubinh(false);
  };

  const handleJoinRoom = useCallback(() => {
    sendMessage(`[3,"Simms",${state.firstRoomId},"",true]`);
  }, [state]);
  const handleHostJoinRoom = useCallback(() => {
    sendMessage(`[3,"Simms",${state.firstRoomId},""]`);
  }, [state]);

  const hanleReadyGuess = useCallback(() => {
    sendMessage(`[5,"Simms",${state.firstRoomId},{"cmd":5}]`);
  }, [state]);

  const hanleReadyHost = useCallback(() => {
    sendMessage(`[5,"Simms",${state.firstRoomId},{"cmd":698}]`);
  }, [state]);

  const handleLeaveRoom = useCallback(() => {
    return sendMessage(`[4,"Simms",${state.firstRoomId}]`);
  }, [state]);

  return {
    user,
    handleCreateRoom,
    messageHistory,
    handleJoinRoom,
    handleHostJoinRoom,
    handleLeaveRoom,
    connectionStatus,
    handleLoginClick,
    connectMainGame,
    handleConnectMauBinh,
    hanleReadyGuess,
    hanleReadyHost,
  };
}
