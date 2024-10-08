import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { handleMessageCrawGuess } from '../lib/listeners/crawGuess';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { AppContext } from '../renderer/providers/app';

export function useSetupCrawGuess(bot: LoginParams) {
  const { state, game, gameStatus, crawingRoom, setCrawingRoom } =
    useContext(AppContext);

  const [user, setUser] = useState<LoginResponseDto | undefined>(undefined);
  const [shouldPingMaubinh, setShouldPingMaubinh] = useState(false);

  const [iTime, setITime] = useState(1);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [shouldConnect, setShouldConnect] = useState(false);

  const iTimeRef = useRef(iTime);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    game.connectURL,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
      onOpen: () => {
        pingGame(user!);
        setShouldPingMaubinh(true);
      },
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
      const newMsg = handleMessageCrawGuess({
        message,
        crawingRoom,
        setCrawingRoom,
        sendMessage,
        user,
        setUser,
        state,
      });

      newMsg && setMessageHistory((msgs) => [...msgs, newMsg]);
    }
  }, [lastMessage]);

  // Ping maubinh
  useEffect(() => {
    if (shouldPingMaubinh) {
      const maubinhPingMessage = `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`;
      const pingPongMessage = `["7", "Simms", "1",${iTimeRef.current}]`;

      const intervalId1 = setInterval(() => {
        sendMessage(pingPongMessage);
        setITime((prevITime) => prevITime + 1);
      }, 5000);

      const intervalId2 = setInterval(() => {
        sendMessage(maubinhPingMessage);
        setITime((prevITime) => prevITime + 1);
      }, 5000);

      return () => {
        clearInterval(intervalId1);
        clearInterval(intervalId2);
      };
    }
  }, [shouldPingMaubinh]);

  const handleLoginClick = async () => {
    login(bot, game.loginToken)
      .then((data: LoginResponse | null) => {
        if (data?.code === 200 && data?.data[0]) {
          const user = data?.data[0];
          setUser(user);
          connectMainGame(user);
        } else if (data?.code === 404 || data?.code === 152) {
          setMessageHistory((msgs) => [
            ...msgs,
            data?.message ?? 'Login failed',
          ]);
        }
      })
      .catch((err: Error) =>
        console.error('Error when calling login function:', err)
      );
  };

  const connectMainGame = (user: LoginResponseDto) => {
    if (user?.token) {
      setShouldConnect(true);
    }
  };

  const pingGame = (user: LoginResponseDto) => {
    sendMessage(
      `[1,"Simms","","",{"agentId":"1","accessToken":"${user.token}","reconnect":false}]`
    );
  };

  const disconnectGame = () => {
    setShouldPingMaubinh(false);
    setShouldConnect(false);
  };

  const handleConnectMauBinh = () => {
    setShouldPingMaubinh(true);
  };

  const handleCreateRoom = () => {
    sendMessage(
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":${
        state.roomType
      },"Mu":4,"iJ":true,"inc":false,"pwd":"${game.usePw ? 'hitplay' : ''}"}]`
    );
  };

  // Guess join initial room
  useEffect(() => {
    if (!state.foundAt && crawingRoom.shouldGuessJoin && !gameStatus.isPaused) {
      sendMessage(
        `[3,"Simms",${crawingRoom.id},"${game.usePw ? 'hitplay' : ''}",true]`
      );
    }
  }, [crawingRoom.shouldGuessJoin]);

  useEffect(() => {
    if (crawingRoom.isPrefinish && !state.foundAt && state.isCheckDone) {
      handleLeaveRoom(crawingRoom?.id);
    }
  }, [crawingRoom.isPrefinish, state.isCheckDone]);

  const handleLeaveRoom = (roomId?: number) => {
    if (roomId) {
      return sendMessage(`[4,"Simms",${roomId}]`);
    }
  };

  // Ready to crawing (Craw found)
  useEffect(() => {
    if (gameStatus.isCrawing && state.foundAt && crawingRoom.isFinish) {
      sendMessage(`[5,"Simms",${state.foundAt},{"cmd":5}]`);
    }
  }, [crawingRoom.isFinish, crawingRoom.isGuessJoin]);

  // Pause/Continue crawing
  useEffect(() => {
    if (
      gameStatus.isPaused === false &&
      crawingRoom.isGuessOut &&
      state.foundAt
    ) {
      sendMessage(
        `[3,"Simms",${state.foundAt},"${game.usePw ? 'hitplay' : ''}",true]`
      );
    }
    if (state.foundAt && gameStatus.isPaused && crawingRoom.isFinish) {
      handleLeaveRoom(state.foundAt);
    }
  }, [gameStatus.isPaused, crawingRoom.isFinish]);

  return {
    user,
    handleCreateRoom,
    messageHistory,
    setMessageHistory,
    handleLeaveRoom,
    connectionStatus,
    handleLoginClick,
    connectMainGame,
    handleConnectMauBinh,
    disconnectGame,
  };
}
