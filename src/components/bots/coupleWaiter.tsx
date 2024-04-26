import { useEffect } from 'react';
import { useWaiting } from '../../hooks/useCrawing';
import { LoginParams } from '../../lib/login';
import { BotCmp } from './botCmp';
// import { BotCmp } from './botCmp';

export interface BotStatusProps {
  craw1: LoginParams;
  craw2: LoginParams;
  index: number;
  shouldLogin: boolean;
  shouldJoinMB: boolean;
  shouldCreatRoom: boolean;
  shouldLeave: boolean;
  shouldDisconnect: boolean;
}

export const CoupleWaiterStatus = ({
  craw1,
  craw2,
  // index,
  shouldLogin,
  shouldJoinMB,
  shouldLeave,
  shouldDisconnect,
}: // shouldCreatRoom,
BotStatusProps) => {
  const {
    host,
    guess,
    connectMbHost,
    connectMbGuess,
    loginHost,
    loginGuess,
    msgHost,
    msgGuess,
    setMsgHost,
    setMsgGuess,
    connectionStatusHost,
    connectionStatusGuess,
    // hostCreateRoom,
    hostLeaveRoom,
    guessLeaveRoom,
    hostDisconnect,
    guessDisconnect,
  } = useWaiting(craw1, craw2);

  useEffect(() => {
    if (shouldLogin) {
      loginHost();
      loginGuess();
    }
  }, [shouldLogin]);

  useEffect(() => {
    if (shouldJoinMB) {
      connectMbHost();
      connectMbGuess();
    }
  }, [shouldJoinMB]);

  // useEffect(() => {
  //   if (shouldCreatRoom) {
  //     hostCreateRoom();
  //   }
  // }, [shouldCreatRoom]);

  useEffect(() => {
    if (shouldLeave) {
      hostLeaveRoom();
      guessLeaveRoom();
    }
  }, [shouldLeave]);

  useEffect(() => {
    if (shouldDisconnect) {
      hostDisconnect();
      guessDisconnect();
    }
  }, [shouldDisconnect]);

  return (
    <div className="hidden space-x-4 w-full">
      <BotCmp
        name={`Waiter 1`}
        userId={host?.username}
        connectionStatus={connectionStatusHost}
        messageHistory={msgHost}
        setMessageHistory={setMsgHost}
      />
      <BotCmp
        name={`waiter 2`}
        userId={guess?.username}
        connectionStatus={connectionStatusGuess}
        messageHistory={msgGuess}
        setMessageHistory={setMsgGuess}
      />
    </div>
  );
};
