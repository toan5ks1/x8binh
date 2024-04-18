import background from '../../../../assets/bg/bg-poker.png';
import { Button } from '../../../components/ui/button';
import { BotStatusMessage } from '../components/bots/bot';
import { MainNav } from '../components/layout/main-nav';
import { bots, crawingBot } from '../config';
import { useCrawing } from '../hooks/useCrawing';
import { useSetupBot } from '../hooks/useSetupBot';

export const FindRoom = () => {
  const {
    user: user1,
    messageHistory: messageHistoryBot1,
    handleLeaveRoom: handleLeaveRoomBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleCreateRoom: handleCreateRoomBot1,
    handleConnectMauBinh: connectMbBot1,
  } = useSetupBot(bots[0]);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    handleConnectMauBinh: connectMbBot2,
  } = useSetupBot(bots[1]);

  const {
    host: craw1,
    guess: craw2,
    connectMbHost: cnMbCraw1,
    connectMbGuess: cnMbCraw2,
    loginHost: loginCraw1,
    loginGuess: loginCraw2,
    msgHost: msgCraw1,
    msgGuess: msgCraw2,
    connectionStatusHost: cnStatusCraw1,
    connectionStatusGuess: cnStatusCraw2,
    hostCreateRoom: host12CreateRoom,
  } = useCrawing(crawingBot[0], crawingBot[1]);

  const {
    host: craw3,
    guess: craw4,
    connectMbHost: cnMbCraw3,
    connectMbGuess: cnMbCraw4,
    loginHost: loginCraw3,
    loginGuess: loginCraw4,
    msgHost: msgCraw3,
    msgGuess: msgCraw4,
    connectionStatusHost: cnStatusCraw3,
    connectionStatusGuess: cnStatusCraw4,
    hostCreateRoom: host34CreateRoom,
  } = useCrawing(crawingBot[2], crawingBot[3]);

  const {
    host: craw5,
    guess: craw6,
    connectMbHost: cnMbCraw5,
    connectMbGuess: cnMbCraw6,
    loginHost: loginCraw5,
    loginGuess: loginCraw6,
    msgHost: msgCraw5,
    msgGuess: msgCraw6,
    connectionStatusHost: cnStatusCraw5,
    connectionStatusGuess: cnStatusCraw6,
    hostCreateRoom: host56CreateRoom,
  } = useCrawing(crawingBot[4], crawingBot[5]);

  const onLogin = async () => {
    loginBot1();
    loginBot2();

    loginCraw1();
    loginCraw2();

    loginCraw3();
    loginCraw4();

    loginCraw5();
    loginCraw6();
  };

  const onJoinMauBinh = () => {
    connectMbBot1();
    connectMbBot2();

    cnMbCraw1();
    cnMbCraw2();

    cnMbCraw3();
    cnMbCraw4();

    cnMbCraw5();
    cnMbCraw6();
  };

  const onCreatRoom = () => {
    handleCreateRoomBot1();
    host12CreateRoom();
    host34CreateRoom();
    host56CreateRoom();
  };

  const onLeaveRoom = () => {
    handleLeaveRoomBot1();
    handleLeaveRoomBot2();
  };

  return (
    <div className="flex flex-col h-screen">
      <MainNav />

      <div
        className="flex flex-col justify-center items-center  text-white space-y-4 py-8 flex-1"
        style={{
          backgroundImage: `url('${background}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      >
        <div className="flex space-x-4">
          <BotStatusMessage
            name={'Bot 1'}
            userId={user1?.username}
            connectionStatus={connectionStatusBot1}
            messageHistory={messageHistoryBot1}
          />

          <BotStatusMessage
            name={'Bot 2'}
            userId={user2?.username}
            connectionStatus={connectionStatusBot2}
            messageHistory={messageHistoryBot2}
          />
        </div>

        <div className="flex space-x-4">
          <BotStatusMessage
            name={'Craw 1'}
            userId={craw1?.username}
            connectionStatus={cnStatusCraw1}
            messageHistory={msgCraw1}
          />

          <BotStatusMessage
            name={'Craw 2'}
            userId={craw2?.username}
            connectionStatus={cnStatusCraw2}
            messageHistory={msgCraw2}
          />
        </div>

        <div className="flex space-x-4">
          <BotStatusMessage
            name={'Craw 3'}
            userId={craw3?.username}
            connectionStatus={cnStatusCraw3}
            messageHistory={msgCraw3}
          />

          <BotStatusMessage
            name={'Craw 4'}
            userId={craw4?.username}
            connectionStatus={cnStatusCraw4}
            messageHistory={msgCraw4}
          />
        </div>

        <div className="flex space-x-4">
          <BotStatusMessage
            name={'Craw 5'}
            userId={craw5?.username}
            connectionStatus={cnStatusCraw5}
            messageHistory={msgCraw5}
          />

          <BotStatusMessage
            name={'Craw 6'}
            userId={craw6?.username}
            connectionStatus={cnStatusCraw6}
            messageHistory={msgCraw6}
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={onLogin}>Đăng nhập</Button>
          <Button onClick={onJoinMauBinh}>Vào mậu binh</Button>
          <Button onClick={onCreatRoom}>Lấy bài</Button>
          <Button onClick={onLeaveRoom}>Rời phòng</Button>
          <Button variant="destructive" onClick={onLeaveRoom}>
            Ngắt kết nối
          </Button>
        </div>
        {/* <BoardCard /> */}
      </div>
    </div>
  );
};
