import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { handleMessage } from '../lib/listeners/bot';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  joinRoom,
  login,
  openAccounts,
} from '../lib/login';
import { AppContext, BotStatus } from '../renderer/providers/app';
import useAccountStore from '../store/accountStore';

export function useSetupBot(bot: LoginParams, isHost: boolean) {
  const [socketUrl, setSocketUrl] = useState('');
  const { state, setState } = useContext(AppContext);
  const room = state.initialRoom;
  const me = state.mainBots[bot.username];
  const { accounts } = useAccountStore();
  const subMain = accounts['MAIN'].filter((item: any) => item.isSelected)[0];

  const subJoin = () => {
    joinRoom(subMain, room.id);
  };

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
      onClose: () => {
        setShouldConnect(true);
        setUser((pre) => ({ ...pre!, status: undefined, isReconnected: true }));
        setState((pre) => ({ ...pre, shouldDisconnect: false }));
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
          loginSubMain();
        }
      })
      .catch((err: Error) =>
        console.error('Error when calling login function:', err)
      );
  };

  const loginSubMain = useCallback(async () => {
    if (subMain && isHost) {
      openAccounts(subMain);
    }
  }, [subMain]);

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
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":${room.roomType},"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
    );
  };

  // Bot join initial room
  useEffect(() => {
    if (!state.foundAt && room?.id) {
      // Host and guess join after created room
      if (user?.status === BotStatus.Connected) {
        // Join room
        bot.username === room.owner
          ? sendMessage(`[3,"Simms",${room.id},""]`)
          : sendMessage(`[3,"Simms",${room.id},"",true]`);
      }

      if (user?.status === BotStatus.Joined) {
        // Ready
        if (bot.username !== room.owner) {
          sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
        }
      }
    }
  }, [room, user]);

  useEffect(() => {
    console.log(state.readyHost);
    if (!state.foundAt && room?.id) {
      if (
        bot.username === room.owner &&
        state.readyHost === Object.keys(state.crawingRoom).length + 1
      ) {
        sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
      }
    }
  }, [state.readyHost]);
  // // Bot join initial room
  // useEffect(() => {
  //   if (!state.foundAt && room.id) {
  //     if (me?.status === BotStatus.Connected) {
  //       // Join room
  //       bot.username === room.owner
  //         ? sendMessage(`[3,"Simms",${room.id},""]`)
  //         : sendMessage(`[3,"Simms",${room.id},"",true]`);
  //     }
  //   }
  // }, [room.id]);
  // useEffect(() => {
  //   if (!state.foundAt) {
  //     // Host and guess join after created room
  //     if (!isHost && me?.status === BotStatus.Joined) {
  //       // Ready
  //       sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
  //     }
  //     if (isHost && me?.status === BotStatus.Joined && room.isHostReady) {
  //       sendMessage(`[5,"Simms",${room.id},{"cmd":5}]`);
  //     }
  //   }
  // }, [state.mainBots]);

  // Submit
  useEffect(() => {
    // Submit
    if (user?.status === BotStatus.Received) {
      sendMessage(
        `[5,"Simms",${room.id},{"cmd":603,"cs":[${user!.currentCard}]}]`
      );
    } else if (user?.status === BotStatus.Submitted) {
      sendMessage(`[4,"Simms",${room.id}]`);
    } else if (
      user?.status === BotStatus.Connected &&
      user.isReconnected &&
      isHost
    ) {
      handleCreateRoom();
    }
  }, [user]);

  // useEffect(() => {
  //   if (user?.status === BotStatus.Submitted) {
  //     setShouldConnect(false);
  //   }
  // }, [user]);

  useEffect(() => {
    if (state.shouldDisconnect) {
      disconnectGame();
    }
  }, [state.shouldDisconnect]);

  // useEffect(() => {
  //   if (user?.status === BotStatus.Connected && user.isReconnected && isHost) {
  //     handleCreateRoom();
  //   }
  // }, [user]);

  // useEffect(() => {
  //   // Leave room
  //   if (
  //     room.id &&
  //     !state.foundBy &&
  //     user?.status === BotStatus.Finished &&
  //     isAllCrawLeft(state.crawingRoom)
  //   ) {
  //     sendMessage(`[4,"Simms",${room.id}]`);
  //   }
  // }, [user, state.crawingRoom]);

  // fix lung sub out truoc
  // useEffect(() => {
  //   if (
  //     user?.status === BotStatus.Left &&
  //     isHost &&
  //     state.shouldRecreateRoom === false &&
  //     isAllCrawLeft(state.crawingRoom)
  //   ) {
  //     setState((pre) => ({ ...pre, shouldRecreateRoom: true }));
  //   }
  // }, [state.crawingRoom]);

  const handleLeaveRoom = () => {
    if (room?.id) {
      return sendMessage(`[4,"Simms",${room.id}]`);
    }
  };

  // Recreate room
  // useEffect(() => {
  //   if (
  //     state.shouldRecreateRoom &&
  //     isHost &&
  //     room?.isFinish &&
  //     user &&
  //     user?.status !== BotStatus.Finding
  //   ) {
  //     handleCreateRoom();
  //     setUser({ ...user, status: BotStatus.Finding });
  //   }
  // }, [state.shouldRecreateRoom]);

  // Call sub join
  useEffect(() => {
    if (state.targetAt && subMain && isHost) {
      subJoin();
    }
  }, [state.targetAt]);

  // sub leave
  useEffect(() => {
    if (user?.status === BotStatus.Finished && room.isSubJoin) {
      sendMessage(`[4,"Simms",${room.id}]`);
    }
  }, [room]);

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
