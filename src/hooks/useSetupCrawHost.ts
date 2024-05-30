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
import { isFoundCards } from '../lib/utils';
import { AppContext } from '../renderer/providers/app';

export function useSetupCrawHost(bot: LoginParams) {
  const [socketUrl, setSocketUrl] = useState('');
  const {
    state,
    setState,
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
    socketUrl,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
      onOpen: () => {
        pingGame(user!);
        setShouldPingMaubinh(true);
      },
      // onClose: () => {
      //   setShouldConnect(true);
      // },
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
      }, 4000);

      const intervalId2 = setInterval(() => {
        sendMessage(maubinhPingMessage);
        setITime((prevITime) => prevITime + 1);
      }, 6000);

      return () => {
        clearInterval(intervalId1);
        clearInterval(intervalId2);
      };
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
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":${roomTypes[0]},"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
    );
  };

  // Host ready initial room
  useEffect(() => {
    if (!state.foundAt) {
      if (crawingRoom.shouldHostReady && initialRoom.shouldHostReady) {
        sendMessage(`[5,"Simms",${crawingRoom.id},{"cmd":698}]`);
      }
    }
  }, [crawingRoom.shouldHostReady, initialRoom.shouldHostReady]);

  // Check cards
  useEffect(() => {
    if (
      !state.foundAt &&
      initialRoom.cardDesk.length === 2 &&
      crawingRoom.cardDesk.length === 2
    ) {
      if (isFoundCards(initialRoom.cardDesk, crawingRoom.cardDesk)) {
        setState((pre) => ({
          ...pre,
          foundAt: crawingRoom.id,
          targetAt: initialRoom.id,
        }));

        toast({
          title: 'Successfully',
          description: `Found: ${crawingRoom.id}`,
        });
        console.log('Craw found at: ', crawingRoom.id);
      } else {
        const card = crawingRoom?.cardDesk.find((item) => item.dn === 'host');
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
      }
    }
  }, [initialRoom.cardDesk, crawingRoom.cardDesk]);

  useEffect(() => {
    if (crawingRoom.isFinish && !state.foundAt) {
      tobeRecreateRoom();
      handleLeaveRoom();
    }
  }, [crawingRoom.isFinish]);

  const handleLeaveRoom = () => {
    if (crawingRoom?.id) {
      return sendMessage(`[4,"Simms",${crawingRoom.id}]`);
    }
  };

  useEffect(() => {
    const card = crawingRoom?.cardDesk.find((item) => item.dn === 'host');
    if (
      state.foundAt &&
      initialRoom.isGuessJoin &&
      initialRoom.isHostJoin &&
      card?.cs.length
    ) {
      sendMessage(
        `[5,"Simms",${state.foundAt},{"cmd":603,"cs":[${binhlung(card.cs)}]}]`
      );
    }
  }, [initialRoom.isGuessJoin, initialRoom.isHostJoin]);

  useEffect(() => {
    if (
      state.foundAt &&
      crawingRoom.isFinish &&
      crawingRoom.shouldHostReady &&
      initialRoom.shouldHostReady &&
      initialRoom.isHostReady
    ) {
      sendMessage(`[5,"Simms",${state.foundAt},{"cmd":698}]`);
    }
  }, [crawingRoom.isFinish, crawingRoom.shouldHostReady]);

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
