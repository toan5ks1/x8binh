import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from '../components/toast/use-toast';
import { binhlung } from '../lib/binhlung';
import { roomTypes } from '../lib/config';
import { handleMessageCrawHost } from '../lib/listeners/crawHost';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { isAbleToCheck, isFoundCards } from '../lib/utils';
import { AppContext } from '../renderer/providers/app';

export function useSetupCrawHost(bot: LoginParams) {
  const {
    state,
    setState,
    game,
    gameStatus,
    setGameStatus,
    crawingRoom,
    setCrawingRoom,
    initialRoom,
    tobeRecreateRoom,
  } = useContext(AppContext);

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
      const newMsg = handleMessageCrawHost({
        message,
        crawingRoom,
        initialRoom,
        setCrawingRoom,
        sendMessage,
        user,
        setUser,
        state,
        gameStatus,
        game,
      });

      newMsg && setMessageHistory((msgs) => [...msgs, newMsg]);
    }
  }, [lastMessage]);

  // Ping maubinh
  useEffect(() => {
    if (shouldPingMaubinh) {
      const maubinhPingMessage = `[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]`;
      const pingPongMessage = `["7", "Simms", "1",${iTimeRef.current}]`;
      setState((pre) => ({ ...pre, isLoggedIn: true }));

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
          setState((pre) => ({ ...pre, isLoggedIn: false }));
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
        roomTypes[0]
      },"Mu":4,"iJ":true,"inc":false,"pwd":"${game.usePw ? 'hitplay' : ''}"}]`
    );
  };

  // Host ready initial room
  useEffect(() => {
    if (!state.foundAt && crawingRoom.shouldHostReady) {
      sendMessage(`[5,"Simms",${crawingRoom.id},{"cmd":698}]`);
    }
  }, [crawingRoom.shouldHostReady]);

  // Check cards
  useEffect(() => {
    if (
      !state.foundAt &&
      isAbleToCheck(initialRoom.cardGame[0]) &&
      isAbleToCheck(crawingRoom.cardGame[0])
    ) {
      if (isFoundCards(initialRoom.cardGame[0], crawingRoom.cardGame[0])) {
        setState((pre) => ({
          ...pre,
          foundAt: crawingRoom.id,
          targetAt: initialRoom.id,
          isCheckDone: true,
        }));

        toast({
          title: 'Successfully',
          description: `Found: ${crawingRoom.id}`,
        });
        console.log('Craw found at: ', crawingRoom.id);
      } else {
        const card = crawingRoom?.cardGame[0].find(
          (item) => item.dn === 'host'
        );
        toast({
          title: 'Not match',
          description: `Finding again...`,
        });
        card?.cs.length &&
          sendMessage(
            `[5,"Simms",${crawingRoom.id},{"cmd":603,"cs":[${binhlung(
              card.cs
            )}]}]`
          );

        setState((pre) => ({
          ...pre,
          isCheckDone: true,
        }));
      }
    }
  }, [initialRoom.cardGame, crawingRoom.cardGame]);

  useEffect(() => {
    if (crawingRoom.isPrefinish && !state.foundAt && state.isCheckDone) {
      tobeRecreateRoom();
      handleLeaveRoom(crawingRoom?.id);
    }
  }, [crawingRoom.isPrefinish, state.isCheckDone]);

  const handleLeaveRoom = (roomId?: number) => {
    if (roomId) {
      return sendMessage(`[4,"Simms",${roomId}]`);
    }
  };

  useEffect(() => {
    if (state.foundAt && initialRoom.isGuessJoin && initialRoom.isHostJoin) {
      const card = crawingRoom?.cardGame[0].find((item) => item.dn === 'host');
      if (card?.cs.length) {
        sendMessage(
          `[5,"Simms",${state.foundAt},{"cmd":603,"cs":[${binhlung(card.cs)}]}]`
        );
        setGameStatus((pre) => ({ ...pre, isCrawing: true }));
        setCrawingRoom((pre) => ({ ...pre, cardGame: [] }));
      }
    }
  }, [initialRoom.isGuessJoin, initialRoom.isHostJoin]);

  useEffect(() => {
    if (
      state.foundAt &&
      gameStatus.isCrawing &&
      crawingRoom.isFinish &&
      crawingRoom.isGuessReady &&
      initialRoom.isGuessReady &&
      initialRoom.isHostReady
    ) {
      sendMessage(`[5,"Simms",${state.foundAt},{"cmd":698}]`);
    }
  }, [
    crawingRoom.isFinish,
    crawingRoom.isGuessReady,
    initialRoom.isGuessReady,
    initialRoom.isHostReady,
  ]);

  // Pause/Continue crawing
  useEffect(() => {
    if (
      gameStatus.isPaused === false &&
      crawingRoom.isHostOut &&
      state.foundAt
    ) {
      sendMessage(
        `[3,"Simms",${state.foundAt},"${game.usePw ? 'hitplay' : ''}",true]`
      );
    }
  }, [gameStatus.isPaused]);

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
