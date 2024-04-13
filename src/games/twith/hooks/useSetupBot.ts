import { useCallback, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { hostWSS } from '../config';
import { LoginParams, getConnectToken, login } from '../lib/login';
import { handleMessage } from '../lib/utils';

export function useSetupBot(bot: LoginParams) {
  const [socketUrl, setSocketUrl] = useState('');

  const [token, setToken] = useState('');
  const [connectionToken, setConnectionToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roomId, setRoomId] = useState(null);

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

  const handleEnterLobby = useCallback(
    () =>
      sendMessage(
        `{"M":"EnterLobby","A":[1,1],"H":"maubinhHub","I":${iTimeRef.current}}`
      ),
    []
  );
  const handleJoinRoom = useCallback(() => {
    sendMessage(
      `{"M":"PlayNow","A":[1000,1,0,0],"H":"maubinhHub","I":${iTimeRef.current}}`
    );
    sendMessage(
      `{"M":"UnregisterLeaveRoom","H":"maubinhHub","I":${iTimeRef.current}}`
    );
  }, []);
  const handleLeaveRoom = useCallback(() => {
    handleMessage('RegisterLeaveRoom');
    return sendMessage(
      `{"M":"RegisterLeaveRoom","H":"maubinhHub","I":${iTimeRef.current}}`
    );
  }, []);

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
      const newMsg = handleMessage(message);

      setMessageHistory((msgs) => [...msgs, newMsg]);
    }
  }, [lastMessage]);

  useEffect(() => {
    const pingPongMessage = () =>
      `{"M":"PingPong","H":"maubinhHub","I":${iTimeRef.current}}`;
    const intervalId = setInterval(() => {
      sendMessage(pingPongMessage());
      setITime((prevITime) => prevITime + 1);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [sendMessage]);

  const handleLoginClick = async () => {
    login(bot)
      .then((data: any) => {
        const token = (data as any).Token;
        setToken(token);
        setUserId(data?.AccountInfo?.AccountID);
        getConnectToken(token)
          .then((data: any) => {
            setConnectionToken(data.ConnectionToken);
          })
          .catch((err: Error) =>
            console.error('Error when calling getConnectToken function:', err)
          );
      })
      .catch((err: Error) =>
        console.error('Error when calling login function:', err)
      );
  };

  const handleConnectMauBinh = (): void => {
    if (connectionToken) {
      const encodedConnectionToken = encodeURIComponent(connectionToken);
      const encodedConnectionData = encodeURIComponent(
        JSON.stringify([{ name: 'maubinhHub' }])
      );
      const encodedAccessToken = encodeURIComponent(token);

      const connectURL = `${hostWSS}/signalr/connect?transport=webSockets&connectionToken=${encodedConnectionToken}&connectionData=${encodedConnectionData}&tid=${7}&access_token=${encodedAccessToken}`;

      setSocketUrl(connectURL);
      setShouldConnect(true);
      handleEnterLobby();
    }
  };

  return {
    userId,
    messageHistory,
    handleJoinRoom,
    handleLeaveRoom,
    connectionStatus,
    handleLoginClick,
    handleConnectMauBinh,
  };
}
