import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { connectURLB52 } from '../lib/config';
import { handleMessageSubHost } from '../lib/listeners/subHost';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  joinRoom,
  login,
} from '../lib/login';
import { AppContext } from '../renderer/providers/app';
import useAccountStore from '../store/accountStore';

export function useSetupSubHost(bot: LoginParams) {
  const { state, initialRoom, setInitialRoom, crawingRoom } =
    useContext(AppContext);
  const { accounts } = useAccountStore();
  const subMain = accounts['MAIN'].filter((item: any) => item.isSelected)[0];

  const subJoin = () => {
    joinRoom(subMain, initialRoom.id);
  };

  const [user, setUser] = useState<LoginResponseDto | undefined>(undefined);
  const [shouldPingMaubinh, setShouldPingMaubinh] = useState(false);

  const [iTime, setITime] = useState(1);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [shouldConnect, setShouldConnect] = useState(false);

  const iTimeRef = useRef(iTime);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    connectURLB52,
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
      const newMsg = handleMessageSubHost({
        message,
        initialRoom,
        setInitialRoom,
        sendMessage,
        crawingRoom,
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
    if (subMain) {
      // openAccounts(subMain);
    }
  }, [subMain]);

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
      `[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":${state.roomType},"Mu":4,"iJ":true,"inc":false,"pwd":""}]`
    );
  };

  // Host ready initial room
  useEffect(() => {
    if (!state.foundAt && initialRoom.shouldHostReady) {
      sendMessage(`[5,"Simms",${initialRoom.id},{"cmd":698}]`);
    }
  }, [initialRoom.shouldHostReady]);

  useEffect(() => {
    if (initialRoom.isPrefinish && !initialRoom.findRoomDone) {
      handleLeaveRoom();
    }
  }, [initialRoom.isPrefinish]);

  const handleLeaveRoom = () => {
    if (initialRoom?.id) {
      return sendMessage(`[4,"Simms",${initialRoom.id}]`);
    }
  };

  // Join found room
  useEffect(() => {
    if (state.foundAt && initialRoom.isHostOut) {
      sendMessage(`[3,"Simms",${state.foundAt},"",true]`);
      setInitialRoom((pre) => ({ ...pre, findRoomDone: true }));
    }
  }, [state.foundAt, initialRoom.isHostOut]);

  // Ready to crawing (Craw found)
  useEffect(() => {
    if (
      state.foundAt &&
      crawingRoom.isFinish &&
      initialRoom.isHostOut &&
      initialRoom.isHostJoin
    ) {
      sendMessage(`[5,"Simms",${state.foundAt},{"cmd":5}]`);
    }
  }, [crawingRoom.isFinish, initialRoom.isHostJoin]);

  // // Recreate room
  // useEffect(() => {
  //   if (!state.foundAt && initialRoom.isHostOut && initialRoom.isGuessOut) {
  //     handleCreateRoom();
  //   }
  // }, [initialRoom.isGuessOut, initialRoom.isHostOut]);

  // // Call sub join
  // useEffect(() => {
  //   if (state.targetAt && subMain && isHost) {
  //     subJoin();
  //   }
  // }, [state.targetAt]);

  // // sub leave
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
