import { LoginParams } from '../lib/login';
import { useSetupCraw } from './useSetupCraw';

export function useCrawing(bot1: LoginParams, bot2: LoginParams) {
  const coupleId = bot1.username + bot2.username;

  const {
    user: user1,
    handleLoginClick: loginHost,
    handleConnectMauBinh: connectMbHost,
    messageHistory: messageHistoryBot1,
    connectionStatus: connectionStatusBot1,
    handleCreateRoom: hostCreateRoom,
  } = useSetupCraw(bot1, coupleId, true);

  const {
    user: user2,
    handleLoginClick: loginGuess,
    handleConnectMauBinh: connectMbGuess,
    messageHistory: messageHistoryBot2,
    connectionStatus: connectionStatusBot2,
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
  };
}
