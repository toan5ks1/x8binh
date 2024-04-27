import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { handleMessage } from '../lib/listeners/bot';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { isAllHostReady } from '../lib/utils';
import { AppContext, BotStatus } from '../renderer/providers/app';

export function useSetupBot(bot: LoginParams, isHost: boolean) {
  const [socketUrl, setSocketUrl] = useState('');
  const { state, setState } = useContext(AppContext);
  const room = state.initialRoom;

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
      const newMsg = handleMessage({
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
    const pingPongMessage = () => ` ["7", "Simms", "1",${iTimeRef.current}]`;

    const intervalId = setInterval(() => {
      shouldConnect && sendMessage(pingPongMessage());
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

  const handleConnectMauBinh = () => {
    setShouldPingMaubinh(true);
  };

  const handleCreateRoom = () => {
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
      !state.foundAt &&
      room.id &&
      Object.keys(room.cardGame).length === 0 // Make sure cards isn't received
    ) {
      // Host and guess join after created room
      if (room.players.length < 2) {
        if (bot.username === room.owner && room.players.length === 0) {
          // Host
          sendMessage(`[3,"Simms",${room.id},""]`);
        } else if (bot.username !== room.owner && room.players.length === 1) {
          // Guess
          sendMessage(`[3,"Simms",${room.id},"",true]`);
        }
      }

      if (room.players.length === 2 && user?.status === BotStatus.Joined) {
        if (bot.username === room.owner) {
          // Host ready
          sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
        }
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
      !room.isFinish
    ) {
      sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
    }
  }, [room, state.crawingRoom]);

  // Submit
  useEffect(() => {
    if (user?.status === BotStatus.Received) {
      // Submit cards
      sendMessage(
        `[5,"Simms",${room.id},{"cmd":603,"cs":[${user.currentCard}]}]`
      );
    }
  }, [user]);

  useEffect(() => {
    const numOfCrawer = Object.keys(state.crawingBots).length;
    // Leave room
    if (
      room?.isFinish &&
      !state.foundBy &&
      user?.status === BotStatus.Finished &&
      room.shouldOutVote === numOfCrawer
    ) {
      console.log(bot.username, 'call leave');
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
      state.shouldRecreateRoom &&
      isHost &&
      room?.isFinish &&
      user &&
      user?.status === BotStatus.Left &&
      !state.foundAt
    ) {
      handleCreateRoom();
      setUser({ ...user, status: BotStatus.Finding });
    }
  }, [state.shouldRecreateRoom, user]);

  // Auto ready for new game
  // useEffect(() => {
  //   if (state.foundAt) {
  //     if (room?.isFinish) {
  //       sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
  //     }

  //     if (room?.isFinish && isHost && user?.status === BotStatus.Ready) {
  //       sendMessage(`[5,"Simms",${room.id},{"cmd":698}]`);
  //     }
  //   }
  // }, [state.foundAt, room]);

  // Sub re-join room
  // useEffect(() => {
  //   if (state.targetAt) {
  //     // Left
  //     if (user?.status === BotStatus.Finished) {
  //       return sendMessage(`[4,"Simms",${room.id}]`);
  //     }
  //     // re-join
  //     if (user?.status === BotStatus.Left) {
  //       console.log(user?.status, room.id);
  //       isHost
  //         ? sendMessage(`[3,"Simms",${room.id},""]`)
  //         : sendMessage(`[3,"Simms",${room.id},"",true]`);
  //     }
  //   }
  // }, [state.targetAt, user]);

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
