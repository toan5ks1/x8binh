import { Button } from '../../../components/ui/button';
import { useSetupBot } from '../../twith/hooks/useSetupBot';
import { BotStatus } from '../components/bots/bot';
import { MainNav } from '../components/layout/main-nav';
import { bots } from '../config';

export const FindRoom = () => {
  const {
    userId: userId1,
    messageHistory: messageHistoryBot1,
    handleJoinRoom: handleJoinRoomBot1,
    handleLeaveRoom: handleLeaveRoomBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleConnectMauBinh: handleConnectMauBinhBot1,
  } = useSetupBot(bots[0]);

  const {
    userId: userId2,
    messageHistory: messageHistoryBot2,
    handleJoinRoom: handleJoinRoomBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    handleConnectMauBinh: handleConnectMauBinhBot2,
  } = useSetupBot(bots[1]);

  const onLogin = () => {
    loginBot1();
    loginBot2();
  };

  const onJoinRoom = () => {
    handleConnectMauBinhBot1();
    handleConnectMauBinhBot2();

    handleJoinRoomBot1();
    handleJoinRoomBot2();
  };

  const onLeaveRoom = () => {
    handleLeaveRoomBot1();
    handleLeaveRoomBot2();
  };

  return (
    <div className="flex flex-col h-screen">
      <MainNav />

      <div className="flex flex-col justify-center items-center bg-gray-800 text-white space-y-4 py-8 flex-1">
        <div className="space-y-4">
          <BotStatus
            name={'Bot 2'}
            userId={userId1}
            connectionStatus={connectionStatusBot1}
            messageHistory={messageHistoryBot1}
          />

          <BotStatus
            name={'Bot 2'}
            userId={userId2}
            connectionStatus={connectionStatusBot2}
            messageHistory={messageHistoryBot2}
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={onLogin}>Đăng nhập</Button>
          <Button onClick={onJoinRoom}>Tìm phòng</Button>
          <Button onClick={onLeaveRoom}>Rời phòng</Button>
          <Button variant="destructive" onClick={onLeaveRoom}>
            Ngắt kết nối
          </Button>
        </div>
      </div>
    </div>
  );
};
