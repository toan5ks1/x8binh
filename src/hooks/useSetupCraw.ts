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
import { isAllHostReady, isFoundCards } from '../lib/utils';
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
      room &&
      room.id &&
      Object.keys(room.cardGame).length === 0 // Make sure cards isn't received
    ) {
      // Host and guess join after created room
      if (bot.username === room.owner && room.players.length === 0) {
        // Host
        sendMessage(`[3,"Simms",${room.id},""]`);
      } else if (bot.username !== room.owner && room.players.length === 1) {
        // Guess
        sendMessage(`[3,"Simms",${room.id},"",true]`);
      }

      if (
        room.players.length >= 2 &&
        user?.status === BotStatus.Joined &&
        bot.username === room.owner
      ) {
        // Host ready
        sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
      }
    }
  }, [room]);

  // Guess ready
  useEffect(() => {
    if (
      room &&
      bot.username !== room.owner &&
      user?.status === BotStatus.Joined &&
      isAllHostReady(state) &&
      // !room.isFinish &&
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
      if (room?.cardGame.length && initRoom.cardGame.length) {
        if (isFoundCards(room.cardGame[0], initRoom.cardGame[0])) {
          // if (true) {
          toast({
            title: 'Successfully',
            description: `Found: ${room.id}`,
          });
          setState((pre) => ({
            ...pre,
            foundAt: room.id,
            foundBy: coupleId,
            targetAt: initRoom.id,
          }));
          console.log(`Found: ${room.id}`);
        } else {
          toast({
            title: 'Not match',
            description: `Finding again...`,
          });
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
      room?.isFinish &&
      state.shouldRecreateRoom &&
      isHost &&
      user &&
      user?.status !== BotStatus.Finding
    ) {
      setUser({ ...user, status: BotStatus.Finding });
      handleCreateRoom();
    }
  }, [state.shouldRecreateRoom]);

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
        console.log('card', room.cardGame);
      }
    }
  }, [room, user]);

  // Found room ready
  useEffect(() => {
    if (coupleId === state.foundBy) {
      if (user?.status === BotStatus.Finished) {
        sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
        // ready for new game
      }

      if (isHost && user?.status === BotStatus.Ready) {
        sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
      }
    }
  }, [user]);

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
// Bot join initial room
// useEffect(() => {
//   if (
//     room &&
//     room.id &&
//     Object.keys(room.cardGame).length === 0 // Make sure cards isn't received
//   ) {
//     // Host and guess join after created room
//     // if (room.players.length < 2) {
//     if (
//       user?.status === BotStatus.Left ||
//       user?.status === BotStatus.Connected
//     ) {
//       if (bot.username === room.owner) {
//         //&& room.players.length === 0
//         // Host
//         sendMessage(`[3,"Simms",${room.id},""]`);
//       } else if (bot.username !== room.owner) {
//         //&& room.players.length === 1
//         // Guess
//         sendMessage(`[3,"Simms",${room.id},"",true]`);
//       }
//     }

//     if (
//       room.players.length >= 2 &&
//       user?.status === BotStatus.Joined &&
//       bot.username === room.owner
//     ) {
//       // Host ready
//       sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
//     }
//   }
// }, [room]);
