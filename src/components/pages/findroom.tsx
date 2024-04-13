import { useSetupBot } from '../../hooks/useSetupBot';
import { bots } from '../../lib/config';
import { MainNav } from '../layout/main-nav';

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
  } = useSetupBot(bots[0]);

  const onLogin = () => {
    loginBot1();
    loginBot2();
  };

  const onConnectGame = () => {
    handleConnectMauBinhBot1();
    handleConnectMauBinhBot2();
  };

  const onJoinRoom = () => {
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

      <div className="flex flex-col justify-center items-center bg-gray-800 space-y-4 py-8 flex-1">
        <div className="flex">
          <span className="font-bold text-white px-[10px]">Bot 1: </span>
          {userId1 ? (
            <>
              <p className="w-[200px] truncate">Username: {userId1}</p>
              <h1 className="bg-red-500 font-bold px-[10px]">
                {connectionStatusBot1}
              </h1>
              <span>The WebSocket is currently {connectionStatusBot1}</span>
              <div className="flex flex-col gap-[10px] max-h-[300px] max-w-[600px] overflow-x-scroll overflow-y-scroll">
                {messageHistoryBot1.map((message, idx) => (
                  <span className="bg-white text-black font-bold" key={idx}>
                    {message ? message.data : null}
                  </span>
                ))}
              </div>
            </>
          ) : (
            'Chưa đăng nhập'
          )}
        </div>

        <div className="flex">
          <span className="font-bold text-white px-[10px]">Bot 2: </span>
          {userId2 ? (
            <>
              <p className="w-[200px] truncate">Username: {userId2}</p>
              <h1 className="bg-red-500 font-bold px-[10px]">
                {connectionStatusBot2}
              </h1>
              <span>The WebSocket is currently {connectionStatusBot2}</span>
              <div className="flex flex-col gap-[10px] max-h-[300px] max-w-[600px] overflow-x-scroll overflow-y-scroll">
                {messageHistoryBot2.map((message, idx) => (
                  <span className="bg-white text-black font-bold" key={idx}>
                    {message ? message.data : null}
                  </span>
                ))}
              </div>
            </>
          ) : (
            'Chưa đăng nhập'
          )}
        </div>

        <div className="grid grid-cols-4 gap-[20px]">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 py-[10px] rounded-[7px] px-[5px]"
            onClick={onLogin}
          >
            Login
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 py-[10px] rounded-[7px] px-[5px]"
            onClick={onConnectGame}
          >
            Connect Mậu Binh
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 py-[10px] rounded-[7px] px-[5px]"
            onClick={onJoinRoom}
          >
            Join Room
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 py-[10px] rounded-[7px] px-[5px]"
            onClick={onLeaveRoom}
          >
            Rời phòng
          </button>
        </div>
      </div>
    </div>
  );
};
