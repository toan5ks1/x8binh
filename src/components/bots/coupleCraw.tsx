import { useEffect } from 'react';
import { useSetupCrawGuess } from '../../hooks/useSetupCrawGuess';
import { useSetupCrawHost } from '../../hooks/useSetupCrawHost';
import { LoginParams } from '../../lib/login';
import { BotCmp } from './botCmp';

export interface BotStatusProps {
  craw1: LoginParams;
  craw2: LoginParams;
  shouldLogin: boolean;
  shouldCreatRoom: boolean;
  shouldDisconnect: boolean;
}

export const CoupleCrawStatus = ({
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
  } = useSetupCrawHost(craw1);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    setMessageHistory: setMessageHistoryBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    disconnectGame: disconnectBot2,
  } = useSetupCrawGuess(craw2);

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
        name={`Bot 1`}
        userId={user1?.username}
        connectionStatus={connectionStatusBot1}
        messageHistory={messageHistoryBot1}
        setMessageHistory={setMessageHistoryBot1}
      />
      <BotCmp
        name={`Bot 2`}
        userId={user2?.username}
        connectionStatus={connectionStatusBot2}
        messageHistory={messageHistoryBot2}
        setMessageHistory={setMessageHistoryBot2}
      />
    </div>
  );
};
