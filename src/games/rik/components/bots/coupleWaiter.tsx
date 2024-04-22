import { useEffect } from 'react';
import { useWaiting } from '../../hooks/useCrawing';
import { LoginParams } from '../../lib/login';
// import { BotCmp } from './botCmp';

export interface BotStatusProps {
  craw1: LoginParams;
  craw2: LoginParams;
  index: number;
  shouldLogin: boolean;
  shouldJoinMB: boolean;
  shouldCreatRoom: boolean;
  shouldLeave: boolean;
}

export const CoupleWaiterStatus = ({
  craw1,
  craw2,
  // index,
  shouldLogin,
  shouldJoinMB,
}: // shouldCreatRoom,
// shouldLeave,
BotStatusProps) => {
  const {
    // host,
    // guess,
    connectMbHost,
    connectMbGuess,
    loginHost,
    loginGuess,
    // msgHost,
    // msgGuess,
    // connectionStatusHost,
    // connectionStatusGuess,
    // hostCreateRoom,
    // hostLeaveRoom,
    // guessLeaveRoom,
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

  // useEffect(() => {
  //   if (shouldLeave) {
  //     hostLeaveRoom();
  //     guessLeaveRoom();
  //   }
  // }, [shouldLeave]);

  return (
    <div className="hidden">
      {/* <BotCmp
        name={`Craw ${index + 1}`}
        userId={host?.username}
        connectionStatus={connectionStatusHost}
        messageHistory={msgHost}
      />
      <BotCmp
        name={`Craw ${index + 2}`}
        userId={guess?.username}
        connectionStatus={connectionStatusGuess}
        messageHistory={msgGuess}
      /> */}
    </div>
  );
};
