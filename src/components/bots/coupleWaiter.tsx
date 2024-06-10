import { useEffect } from 'react';
import { useSetupWaiterGuess } from '../../hooks/useSetupWaiterGuess';
import { useSetupWaiterHost } from '../../hooks/useSetupWaiterHost';
import { BotCmp } from './botCmp';
import { BotStatusProps } from './coupleCraw';
// import { BotCmp } from './botCmp';

export const CoupleWaiterStatus = ({
  craw1,
  craw2,
  index,
  shouldLogin,
  shouldCreatRoom,
  shouldLeave,
  shouldDisconnect,
}: BotStatusProps) => {
  const {
    user: user1,
    messageHistory: messageHistoryBot1,
    setMessageHistory: setMessageHistoryBot1,
    handleLeaveRoom: handleLeaveRoomBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleCreateRoom: handleCreateRoomBot1,
    disconnectGame: disconnectBot1,
  } = useSetupWaiterHost(craw1);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    setMessageHistory: setMessageHistoryBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    disconnectGame: disconnectBot2,
  } = useSetupWaiterGuess(craw2);

  useEffect(() => {
    if (shouldLogin) {
      loginBot1();
      loginBot2();
    }
  }, [shouldLogin]);

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

  useEffect(() => {
    if (shouldDisconnect) {
      disconnectBot1();
      disconnectBot2();
    }
  }, [shouldDisconnect]);

  return (
    <div className="space-y-4 w-full">
      <BotCmp
        name={`Bot ${index + 3}`}
        userId={user1?.username}
        connectionStatus={connectionStatusBot1}
        messageHistory={messageHistoryBot1}
        setMessageHistory={setMessageHistoryBot1}
      />
      <BotCmp
        name={`Bot ${index + 4}`}
        userId={user2?.username}
        connectionStatus={connectionStatusBot2}
        messageHistory={messageHistoryBot2}
        setMessageHistory={setMessageHistoryBot2}
      />
    </div>
  );
};
