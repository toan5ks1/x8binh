import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MainNav } from '../components/layout/main-nav';
import { getConnectToken, login } from '../lib/login';
import './App.css';
import AppProvider from './providers/app';

enum ServerMessageType {
  JoinGame = 'joinGame',
  StartActionTimer = 'startActionTimer',
  PlayerJoin = 'playerJoin',
  UpdateGameSession = 'updateGameSession',
}

const Hello = () => {
  let hostWSS: string = 'wss://maubinh.twith.club';

  const [socketUrl, setSocketUrl] = useState('');
  const [token, setToken] = useState('');
  const [iTime, setITime] = useState(1);
  const [currentUser, setCurrentUser] = useState('Unknow');
  const [connectionToken, setConnectionToken] = useState(null);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const [shouldConnect, setShouldConnect] = useState(false);

  const iTimeRef = useRef(iTime);

  function handleJoinGame(message: any) {
    const gameData = message.M?.[0]?.A?.[0];
    console.log('Handling join game with data', gameData);
  }

  function handleStartActionTimer(message: any) {
    const timerData = message.M?.[0]?.A;
    console.log('Handling start action timer with data', timerData);
  }

  function handleMessage(message: any) {
    const messageType = message.M?.[0]?.M;
    switch (messageType) {
      case ServerMessageType.JoinGame:
        handleJoinGame(message);
        break;
      case ServerMessageType.StartActionTimer:
        handleStartActionTimer(message);
        break;
      default:
        console.log('Unknown message type', messageType);
    }
  }

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: (closeEvent) => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
      onOpen: () => console.log('Connected'),
    },
    shouldConnect
  );

  useEffect(() => {
    iTimeRef.current = iTime;
  }, [iTime]);

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data);
      handleMessage(message);
    }
  }, [lastMessage]);

  const handleEnterLobby = useCallback(
    () =>
      sendMessage(
        `{"M":"EnterLobby","A":[1,1],"H":"maubinhHub","I":${iTimeRef.current}}`
      ),
    []
  );
  const handleClickSendMessage = useCallback(() => {
    sendMessage(
      `{"M":"PlayNow","A":[1000,1,0,0],"H":"maubinhHub","I":${iTimeRef.current}}`
    );
    sendMessage(
      `{"M":"UnregisterLeaveRoom","H":"maubinhHub","I":${iTimeRef.current}}`
    );
  }, []);
  const handleLeaveRoom = useCallback(
    () =>
      sendMessage(
        `{"M":"RegisterLeaveRoom","H":"maubinhHub","I":${iTimeRef.current}}`
      ),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Đang kết nối',
    [ReadyState.OPEN]: 'Sẵn sàng',
    [ReadyState.CLOSING]: 'Ngắt kết nối',
    [ReadyState.CLOSED]: 'Đã đóng',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    const pingPongMessage = () =>
      `{"M":"PingPong","H":"maubinhHub","I":${iTimeRef.current}}`;
    const intervalId = setInterval(() => {
      sendMessage(pingPongMessage());
      setITime((prevITime) => prevITime + 1);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [sendMessage]);

  const handleLoginClick = (): void => {
    const username: string = 'dungdung';
    const password: string = '123123a';

    login(username, password)
      .then((data: any) => {
        const token = (data as any).Token;
        setToken(token);
        getConnectToken(token)
          .then((data: any) => {
            setConnectionToken(data.ConnectionToken);
            setCurrentUser(username);
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

  return (
    <div className="flex-auto h-screen">
      <div className=" flex flex-col justify-center items-center h-full bg-gray-800 space-y-4">
        <div className="flex">
          <span className="font-bold text-white px-[10px]">Bot 1:</span>
          <h1 className="bg-red-500 font-bold px-[10px]">
            {' '}
            {connectionStatus}
          </h1>
        </div>

        <p className="w-[200px] truncate">
          Token: {token && connectionToken ? token : 'Chưa đăng nhập'}
        </p>
        <p className="w-[200px] truncate">
          User: {currentUser ? currentUser : 'Chưa đăng nhập'}
        </p>
        <span>The WebSocket is currently {connectionStatus}</span>
        <div className="flex flex-col gap-[10px] max-h-[300px] max-w-[600px] overflow-x-scroll overflow-y-scroll">
          {messageHistory.map((message, idx) => (
            <span className="bg-white text-black font-bold" key={idx}>
              {message ? message.data : null}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-[20px]">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 py-[10px] rounded-[7px] px-[5px]"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 py-[10px] rounded-[7px] px-[5px]"
            onClick={handleConnectMauBinh}
          >
            Connect Mậu Binh
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 py-[10px] rounded-[7px] px-[5px]"
            onClick={handleClickSendMessage}
          >
            Join Room
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 py-[10px] rounded-[7px] px-[5px]"
            onClick={handleLeaveRoom}
          >
            Rời phòng
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNav />
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
