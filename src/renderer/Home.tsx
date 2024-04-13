export const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
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
  );
};
