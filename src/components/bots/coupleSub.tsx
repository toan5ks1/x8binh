import { useEffect } from 'react';
import { useSetupSubGuess } from '../../hooks/useSetupSubGuess';
import { useSetupSubHost } from '../../hooks/useSetupSubHost';
import { BotCmp } from './botCmp';
import { BotStatusProps } from './coupleCraw';

export const CoupleSubStatus = ({
  craw1,
  craw2,
  shouldLogin,
  shouldCreatRoom,
  shouldDisconnect,
}: BotStatusProps) => {
  const {
    user: user1,
    messageHistory: messageHistoryBot1,
    setMessageHistory: setMessageHistoryBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleCreateRoom: handleCreateRoomBot1,
    disconnectGame: disconnectBot1,
  } = useSetupSubHost(craw1);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    setMessageHistory: setMessageHistoryBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    disconnectGame: disconnectBot2,
  } = useSetupSubGuess(craw2);

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
    if (shouldDisconnect) {
      disconnectBot1();
      disconnectBot2();
    }
  }, [shouldDisconnect]);

  return (
    <div className="space-y-4 w-full">
      <BotCmp
        name={`Sub 1`}
        userId={user1?.username}
        connectionStatus={connectionStatusBot1}
        messageHistory={messageHistoryBot1}
        setMessageHistory={setMessageHistoryBot1}
      />
      <BotCmp
        name={`Sub 2`}
        userId={user2?.username}
        connectionStatus={connectionStatusBot2}
        messageHistory={messageHistoryBot2}
        setMessageHistory={setMessageHistoryBot2}
      />
    </div>
  );
};
