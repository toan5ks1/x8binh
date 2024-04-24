import { useEffect } from 'react';
import { useSetupBot } from '../../hooks/useSetupBot';
import { BotCmp } from './botCmp';
import { BotStatusProps } from './coupleCraw';

export const MainPlayerStatus = ({
  craw1,
  craw2,
  index,
  shouldLogin,
  shouldJoinMB,
  shouldCreatRoom,
  shouldLeave,
}: BotStatusProps) => {
  const {
    user: user1,
    messageHistory: messageHistoryBot1,
    setMessageHistory: setMessageHistoryBot1,
    handleLeaveRoom: handleLeaveRoomBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleCreateRoom: handleCreateRoomBot1,
    handleConnectMauBinh: connectMbBot1,
  } = useSetupBot(craw1, true);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    setMessageHistory: setMessageHistoryBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    handleConnectMauBinh: connectMbBot2,
  } = useSetupBot(craw2, false);

  useEffect(() => {
    if (shouldLogin) {
      loginBot1();
      loginBot2();
    }
  }, [shouldLogin]);

  useEffect(() => {
    if (shouldJoinMB) {
      connectMbBot1();
      connectMbBot2();
    }
  }, [shouldJoinMB]);

  useEffect(() => {
    if (shouldCreatRoom) {
      handleCreateRoomBot1();
    }
  }, [shouldCreatRoom]);

  useEffect(() => {
    if (shouldLeave) {
      handleLeaveRoomBot1();
      handleLeaveRoomBot2();
    }
  }, [shouldLeave]);

  return (
    <div className="flex space-x-4 w-full">
      <BotCmp
        name={`Bot ${index + 1}`}
        userId={user1?.username}
        connectionStatus={connectionStatusBot1}
        messageHistory={messageHistoryBot1}
        setMessageHistory={setMessageHistoryBot1}
      />
      <BotCmp
        name={`Bot ${index + 2}`}
        userId={user2?.username}
        connectionStatus={connectionStatusBot2}
        messageHistory={messageHistoryBot2}
        setMessageHistory={setMessageHistoryBot2}
      />
    </div>
  );
};
