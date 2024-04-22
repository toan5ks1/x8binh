import { LoginParams } from '../lib/login';
import { useSetupCraw } from './useSetupCraw';
import { useSetupWaiter } from './useSetupWaiter';

export function useCrawing(
  bot1: LoginParams,
  bot2: LoginParams,
  isWaiter?: boolean
) {
  const coupleId = bot1.username + bot2.username;

  const {
    user: user1,
    handleLoginClick: loginHost,
    handleConnectMauBinh: connectMbHost,
    messageHistory: messageHistoryBot1,
    connectionStatus: connectionStatusBot1,
    handleCreateRoom: hostCreateRoom,
    handleLeaveRoom: hostLeaveRoom,
  } = useSetupCraw(bot1, coupleId, true);

  const {
    user: user2,
    handleLoginClick: loginGuess,
    handleConnectMauBinh: connectMbGuess,
    messageHistory: messageHistoryBot2,
    connectionStatus: connectionStatusBot2,
    handleLeaveRoom: guessLeaveRoom,
  } = useSetupCraw(bot2, coupleId, false);

  return {
    coupleId,
    host: user1,
    guess: user2,
    loginHost,
    connectMbHost,
    loginGuess,
    connectMbGuess,
    msgHost: messageHistoryBot1,
    msgGuess: messageHistoryBot2,
    connectionStatusHost: connectionStatusBot1,
    connectionStatusGuess: connectionStatusBot2,
    hostCreateRoom,
    hostLeaveRoom,
    guessLeaveRoom,
  };
}

export function useWaiting(bot1: LoginParams, bot2: LoginParams) {
  const coupleId = bot1.username + bot2.username;

  const {
    user: user1,
    handleLoginClick: loginHost,
    handleConnectMauBinh: connectMbHost,
    messageHistory: messageHistoryBot1,
    connectionStatus: connectionStatusBot1,
    handleLeaveRoom: hostLeaveRoom,
  } = useSetupWaiter(bot1);

  const {
    user: user2,
    handleLoginClick: loginGuess,
    handleConnectMauBinh: connectMbGuess,
    messageHistory: messageHistoryBot2,
    connectionStatus: connectionStatusBot2,
    handleLeaveRoom: guessLeaveRoom,
  } = useSetupWaiter(bot2);

  return {
    coupleId,
    host: user1,
    guess: user2,
    loginHost,
    connectMbHost,
    loginGuess,
    connectMbGuess,
    msgHost: messageHistoryBot1,
    msgGuess: messageHistoryBot2,
    connectionStatusHost: connectionStatusBot1,
    connectionStatusGuess: connectionStatusBot2,
    hostLeaveRoom,
    guessLeaveRoom,
  };
}
