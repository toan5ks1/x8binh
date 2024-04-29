import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useToast } from '../components/toast/use-toast';
import { handleMessageCrawing } from '../lib/listeners/craw';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { isAllHostReady } from '../lib/utils';
import { AppContext, BotStatus } from '../renderer/providers/app';

export function useSetupCraw(
  bot: LoginParams,
  coupleId: string,
  isHost: boolean
) {
  const [socketUrl, setSocketUrl] = useState('');
  const { state, setState } = useContext(AppContext);
  const initRoom = state.initialRoom;
  const room = state.crawingRoom[coupleId];

  // const me = state.crawingBots[bot.username];

  const [user, setUser] = useState<LoginResponseDto | undefined>(undefined);
  const [shouldPingMaubinh, setShouldPingMaubinh] = useState(false);

  const [iTime, setITime] = useState(1);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [shouldConnect, setShouldConnect] = useState(false);
  const { toast } = useToast();

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
      const newMsg = handleMessageCrawing({
        message,
        state,
        setState,
        user,
        coupleId,
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

  const handleCreateRoom = (): void => {
    sendMessage(
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
    );
  };

  // Auto connect maubinh
  // useEffect(() => {
  //   if (!shouldPingMaubinh && user?.status === BotStatus.Initialized) {
  //     setTimeout(handleConnectMauBinh, 500);
  //   }
  // }, [user]);

  // Bot join initial room
  useEffect(() => {
    if (
      state.isStart &&
      room &&
      room.id &&
      Object.keys(room.cardGame).length === 0 // Make sure cards isn't received
    ) {
      // Host and guess join after created room
      console.log('craw create first room');
      if (room.players.length < 2) {
        if (bot.username === room.owner && room.players.length === 0) {
          // Host
          sendMessage(`[3,"Simms",${room.id},""]`);
        } else if (bot.username !== room.owner && room.players.length === 1) {
          // Guess
          sendMessage(`[3,"Simms",${room.id},"",true]`);
        }
      }

      if (
        room.players.length === 2 &&
        user?.status === BotStatus.Joined &&
        bot.username === room.owner
      ) {
        // Host ready
        sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
      }
    }
  }, [room, state.isStart]);

  // Guess ready
  useEffect(() => {
    if (
      room &&
      bot.username !== room.owner &&
      user?.status === BotStatus.Joined &&
      isAllHostReady(state) &&
      !room.isFinish &&
      !state.foundAt
    ) {
      sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
    }
  }, [state.initialRoom, state.crawingRoom]);

  // Submit
  useEffect(() => {
    if (user?.status === BotStatus.Received && !state.foundAt) {
      // Submit cards
      sendMessage(
        `[5,"Simms",${room.id},{"cmd":603,"cs":[${user.currentCard}]}]`
      );
    }
  }, [user]);

  // Check cards
  useEffect(() => {
    if (!state.foundAt && user) {
      if (room?.cardGame[0] && initRoom.cardGame[0]) {
        // if (isFoundCards(room.cardGame[0], initRoom.cardGame[0])) {
        if (true) {
          setState((pre) => ({
            ...pre,
            foundAt: room.id,
            foundBy: coupleId,
            targetAt: initRoom.id,
          }));
          toast({
            title: 'Successfully',
            description: `Found: ${room.id}`,
          });
          console.log(`Found: ${room.id}`);
        } else {
        }
      }
    }
  }, [room, state.initialRoom]);

  useEffect(() => {
    // Leave room
    if (
      room?.isFinish &&
      coupleId !== state.foundBy &&
      user?.status === BotStatus.Finished
    ) {
      sendMessage(`[4,"Simms",${room.id}]`);
    }
  }, [room, user]);

  const handleLeaveRoom = () => {
    if (room?.id) {
      return sendMessage(`[4,"Simms",${room.id}]`);
    }
  };

  // Recreate room
  useEffect(() => {
    if (
      state.isStart &&
      state.shouldRecreateRoom &&
      isHost &&
      room?.isFinish &&
      user &&
      user?.status !== BotStatus.Finding
    ) {
      console.log('craw re-create room');
      handleCreateRoom();
      setUser({ ...user, status: BotStatus.Finding });
    }
  }, [state.isStart, state.shouldRecreateRoom, user]);

  // Found room submit cards
  useEffect(() => {
    if (coupleId === state.foundBy && user) {
      const { status, currentCard: myCards } = user;
      if (
        status === BotStatus.Received &&
        room.players.length === 4 &&
        myCards
      ) {
        // Submit cards
        sendMessage(`[5,"Simms",${room.id},{"cmd":603,"cs":[${myCards}]}]`);
      }

      if (room.isFinish) {
        sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
        // ready for new game
      }

      if (room.isFinish && isHost && status === BotStatus.Ready) {
        sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
      }
    }
  }, [state.foundBy, room, user]);

  return {
    user,
    handleLoginClick,
    handleConnectMauBinh,
    handleCreateRoom,
    messageHistory,
    setMessageHistory,
    connectionStatus,
    handleLeaveRoom,
    disconnectGame,
  };
}
