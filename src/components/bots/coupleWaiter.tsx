import { useEffect } from 'react';
import { useWaiting } from '../../hooks/useCrawing';
import { BotCmp } from './botCmp';
import { BotStatusProps } from './coupleCraw';
// import { BotCmp } from './botCmp';

export const CoupleWaiterStatus = ({
  craw1,
  craw2,
  // index,
  shouldLogin,
  // shouldJoinMB,
  shouldLeave,
  shouldDisconnect,
}: BotStatusProps) => {
  const {
    host,
    guess,
    // connectMbHost,
    // connectMbGuess,
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

  // useEffect(() => {
  //   if (shouldJoinMB) {
  //     connectMbHost();
  //     connectMbGuess();
  //   }
  // }, [shouldJoinMB]);

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
    <div className="space-y-4 w-full">
      <BotCmp
        name={`Bot đợi 1`}
        userId={host?.username}
        connectionStatus={connectionStatusHost}
        messageHistory={msgHost}
        setMessageHistory={setMsgHost}
      />
      <BotCmp
        name={`Bot đợi 2`}
        userId={guess?.username}
        connectionStatus={connectionStatusGuess}
        messageHistory={msgGuess}
        setMessageHistory={setMsgGuess}
      />
    </div>
  );
};
