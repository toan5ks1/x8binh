import { useContext } from 'react';
import background from '../../../../assets/bg/bg-poker.png';
import { AppContext } from '../../../../src/renderer/providers/app';
import BoardCard from '../../../components/card/boardCard';
import { Button } from '../../../components/ui/button';
import { BotStatus } from '../components/bots/bot';
import { MainNav } from '../components/layout/main-nav';
import { bots } from '../config';
import { useSetupBot } from '../hooks/useSetupBot';

export const FindRoom = () => {
  const { state } = useContext<any>(AppContext);
  const {
    user: user1,
    messageHistory: messageHistoryBot1,
    handleLeaveRoom: handleLeaveRoomBot1,
    connectionStatus: connectionStatusBot1,
    handleLoginClick: loginBot1,
    handleCreateRoom: handleCreateRoomBot1,
    handleConnectMauBinh: handleConnectMauBinhBot1,
    handleHostJoinRoom: handleHostJoinRoom,
    hanleReadyHost,
  } = useSetupBot(bots[0]);

  const {
    user: user2,
    messageHistory: messageHistoryBot2,
    handleJoinRoom: handleJoinRoomBot2,
    handleLeaveRoom: handleLeaveRoomBot2,
    connectionStatus: connectionStatusBot2,
    handleLoginClick: loginBot2,
    handleConnectMauBinh: handleConnectMauBinhBot2,
    hanleReadyGuess,
  } = useSetupBot(bots[1]);

  const onLogin = async () => {
    loginBot1();
    loginBot2();
  };

  const onJoinMauBinh = async () => {
    handleConnectMauBinhBot1();
    handleConnectMauBinhBot2();
  };

  const onCreatRoom = () => {
    handleCreateRoomBot1();
  };

  const onHostJoinRoom = () => {
    handleHostJoinRoom();
  };
  const onJoinRoom = () => {
    handleJoinRoomBot2();
  };

  const onReady = () => {
    hanleReadyHost();
    hanleReadyGuess();
  };

  const onLeaveRoom = () => {
    handleLeaveRoomBot1();
    handleLeaveRoomBot2();
  };

  const onMainJoin = () => {
    window.electron.ipcRenderer.executeScript([
      `__require('GamePlayManager').default.getInstance().joinRoom(${state.firstRoomId},0,'',true);`,
    ]);
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
          <BotStatus
            name={'Bot 1'}
            userId={user1?.username}
            connectionStatus={connectionStatusBot1}
            messageHistory={messageHistoryBot1}
          />

          <BotStatus
            name={'Bot 2'}
            userId={user2?.username}
            connectionStatus={connectionStatusBot2}
            messageHistory={messageHistoryBot2}
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={onLogin}>Đăng nhập</Button>
          <Button onClick={onJoinMauBinh}>Vào mậu binh</Button>
          <Button onClick={onCreatRoom}>Tạo phòng</Button>
          <Button onClick={onHostJoinRoom}>Host Vào phòng</Button>
          <Button onClick={onMainJoin}>Main Join</Button>
          <Button onClick={onJoinRoom}> Bot Vào phòng</Button>
          <Button onClick={onReady}>San sang</Button>
          <Button onClick={onLeaveRoom}>Rời phòng</Button>
          <Button variant="destructive" onClick={onLeaveRoom}>
            Ngắt kết nối
          </Button>
        </div>
        <BoardCard />
      </div>
    </div>
  );
};
