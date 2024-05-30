import { useContext, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from '../components/toast/use-toast';
import { roomTypes } from '../lib/config';
import { handleMessageWaiterHost } from '../lib/listeners/waiterHost';
import {
  LoginParams,
  LoginResponse,
  LoginResponseDto,
  login,
} from '../lib/login';
import { isFoundCards } from '../lib/utils';
import { AppContext } from '../renderer/providers/app';

export function useSetupWaiterHost(bot: LoginParams) {
  const [socketUrl, setSocketUrl] = useState('');
  const {
    state,
    setState,
    waiterRoom,
    setWaiterRoom,
    initialRoom,
    crawingRoom,
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
      const newMsg = handleMessageWaiterHost({
        message,
        waiterRoom,
        setWaiterRoom,
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
      if (
        waiterRoom.shouldHostReady &&
        initialRoom.shouldHostReady &&
        crawingRoom.shouldHostReady
      ) {
        sendMessage(`[5,"Simms",${waiterRoom.id},{"cmd":698}]`);
      }
    }
  }, [
    waiterRoom.shouldHostReady,
    initialRoom.shouldHostReady,
    crawingRoom.shouldHostReady,
  ]);

  // Check cards
  useEffect(() => {
    if (
      !state.foundAt &&
      initialRoom.cardGame[0]?.length === 2 &&
      waiterRoom.cardGame[0]?.length === 2
    ) {
      if (isFoundCards(initialRoom.cardGame[0], waiterRoom.cardGame[0])) {
        setState((pre) => ({
          ...pre,
          foundAt: waiterRoom.id,
          targetAt: initialRoom.id,
        }));

        toast({
          title: 'Successfully',
          description: `Found: ${waiterRoom.id}`,
        });
        console.log('Waiter found at: ', waiterRoom.id);
      } else {
        toast({
          title: 'Not match',
          description: `Finding again...`,
        });
        setWaiterRoom((pre) => ({
          ...pre,
          isNotFound: true,
        }));
      }
    }
  }, [initialRoom.cardGame, waiterRoom.cardGame]);

  useEffect(() => {
    if (waiterRoom.isFinish) {
      handleLeaveRoom();
    }
  }, [waiterRoom.isFinish]);

  const handleLeaveRoom = () => {
    if (waiterRoom?.id) {
      return sendMessage(`[4,"Simms",${waiterRoom.id}]`);
    }
  };

  // Join found room
  useEffect(() => {
    if (
      state.foundAt &&
      state.foundAt !== waiterRoom.id &&
      waiterRoom.isHostOut
    ) {
      sendMessage(`[3,"Simms",${state.foundAt},"",true]`);
    }
  }, [state.foundAt, waiterRoom.isHostOut]);

  // Ready to crawing (Craw found)
  useEffect(() => {
    if (
      state.foundAt &&
      state.foundAt !== waiterRoom.id &&
      crawingRoom.isFinish &&
      waiterRoom.isHostOut &&
      waiterRoom.isHostJoin
    ) {
      sendMessage(`[5,"Simms",${state.foundAt},{"cmd":5}]`);
    }
  }, [crawingRoom.isFinish, waiterRoom.isHostJoin]);

  // // Ready to crawing (Waiter found)
  // useEffect(() => {
  //   if (
  //     state.foundAt &&
  //     state.foundAt === waiterRoom.id &&
  //     waiterRoom.isFinish
  //   ) {
  //     console.log('waiter host call ready');
  //     sendMessage(`[5,"Simms",${state.foundAt},{"cmd":5}]`);
  //   }
  // }, [waiterRoom.isFinish]);

  useEffect(() => {
    if (
      state.foundAt &&
      state.foundAt === waiterRoom.id &&
      waiterRoom.isFinish &&
      waiterRoom.shouldHostReady &&
      crawingRoom.shouldHostReady &&
      crawingRoom.isHostReady
    ) {
      // console.log(waiterRoom.cardGame);
      sendMessage(`[5,"Simms",${state.foundAt},{"cmd":698}]`);
    }
  }, [
    waiterRoom.isFinish,
    waiterRoom.shouldHostReady,
    crawingRoom.shouldHostReady,
    crawingRoom.isHostReady,
  ]);

  // Host ready found room
  // useEffect(() => {
  //   if (state.foundAt) {
  //     if (crawingRoom.isFinish && waiterRoom.isHostJoin) {
  //       // Host is joined
  //       sendMessage(`[5,"Simms",${state.foundAt},{"cmd":5}]`);
  //     }
  //   }
  // }, [crawingRoom.isFinish, waiterRoom.isHostJoin]);

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
