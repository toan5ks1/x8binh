import { useEffect } from 'react';
import { useSetupAntiBot } from '../../hooks/useSetupAntiBot';
import { LoginParams } from '../../lib/login';
import { BotCmp } from './botCmp';

export interface AntiBotStatusProps {
  craw1: LoginParams;
  shouldLogin: boolean;
  shouldCreatRoom: boolean;
  shouldDisconnect: boolean;
}

export const AntiBotStatus = ({
  craw1,
  shouldLogin,
  shouldCreatRoom,
  shouldDisconnect,
}: AntiBotStatusProps) => {
  const {
    user: user1,
    messageHistory: messageHistoryBot1,
    setMessageHistory: setMessageHistoryBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleCreateRoom: handleCreateRoomBot1,
    disconnectGame: disconnectBot1,
  } = useSetupAntiBot(craw1);

  useEffect(() => {
    if (shouldLogin) {
      loginBot1();
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
    }
  }, [shouldDisconnect]);

  return (
    <div className="space-y-4 w-full">
      <BotCmp
        name={`Anti-bot`}
        userId={user1?.username}
        connectionStatus={connectionStatusBot1}
        messageHistory={messageHistoryBot1}
        setMessageHistory={setMessageHistoryBot1}
      />
    </div>
  );
};
