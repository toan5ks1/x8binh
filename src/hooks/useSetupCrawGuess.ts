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
  const [socketUrl, setSocketUrl] = useState('');
  const { state, crawingRoom, setCrawingRoom } = useContext(AppContext);

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
      const newMsg = handleMessageCrawGuess({
        message,
        crawingRoom,
        setCrawingRoom,
        sendMessage,
        user,
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
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":${state.roomType},"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
    );
  };

  // Guess join initial room
  useEffect(() => {
    if (!state.foundAt) {
      if (crawingRoom.shouldGuessJoin) {
        sendMessage(`[3,"Simms",${crawingRoom.id},"",true]`);
      }
    }
  }, [crawingRoom]);

  // useEffect(() => {
  //   if (!state.foundAt && room?.id) {
  //     if (
  //       bot.username === room.owner &&
  //       state.readyHost === Object.keys(state.crawingRoom).length + 1
  //     ) {
  //       sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
  //     }
  //   }
  // }, [state.readyHost]);

  // Submit
  // useEffect(() => {
  //   // Submit
  //   if (user?.status === BotStatus.Received) {
  //     sendMessage(
  //       `[5,"Simms",${room.id},{"cmd":603,"cs":[${user!.currentCard}]}]`
  //     );
  //   } else if (!state.foundAt && user?.status === BotStatus.Submitted) {
  //     sendMessage(`[4,"Simms",${room.id}]`);
  //   } else if (
  //     user?.status === BotStatus.Connected &&
  //     user.isReconnected &&
  //     isHost
  //   ) {
  //     handleCreateRoom();
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (state.shouldDisconnect) {
  //     disconnectGame();
  //   }
  // }, [state.shouldDisconnect]);

  // useEffect(() => {
  //   if (crawingRoom.isPrefinish) {
  //     handleLeaveRoom();
  //   }
  // }, [crawingRoom.isPrefinish]);

  useEffect(() => {
    if (state.isNotFound) {
      handleLeaveRoom();
    }
  }, [state.isNotFound]);

  const handleLeaveRoom = () => {
    if (crawingRoom?.id) {
      return sendMessage(`[4,"Simms",${crawingRoom.id}]`);
    }
  };

  // // Call sub join
  // useEffect(() => {
  //   if (state.targetAt && subMain && isHost) {
  //     subJoin();
  //   }
  // }, [state.targetAt]);

  // sub leave
  // useEffect(() => {
  //   if (user?.status === BotStatus.Finished && room.isSubJoin) {
  //     sendMessage(`[4,"Simms",${room.id}]`);
  //   }
  // }, [room]);

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
