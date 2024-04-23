import { useState } from 'react';
import background from '../../../../assets/bg/bg-poker.png';
import BoardCard from '../../../components/card/boardCard';
import { Button } from '../../../components/ui/button';
import { CoupleCrawStatus } from '../components/bots/coupleCraw';
import { CoupleWaiterStatus } from '../components/bots/coupleWaiter';
import { MainPlayerStatus } from '../components/bots/mainPlayer';
import { MainNav } from '../components/layout/main-nav';
import { bots, crawingBot } from '../config';

export const FindRoom = () => {
  const [shouldLogin, setShouldLogin] = useState(false);
  const [shouldJoinMB, setShouldJoinMB] = useState(false);
  const [shouldCreatRoom, setShouldCreateRoom] = useState(false);
  const [shouldLeave, setShouldLeave] = useState(false);

  const onLogin = () => {
    setShouldLogin(true);
  };

  const onJoinMauBinh = () => {
    setShouldJoinMB(true);
  };

  const onCreatRoom = () => {
    setShouldCreateRoom(true);
  };

  const onLeaveRoom = () => {
    setShouldLeave(true);
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
        <>
          {bots.map(
            (bot, index) =>
              index % 2 === 0 &&
              index < bots.length - 1 && (
                <MainPlayerStatus
                  key={index}
                  index={index}
                  craw1={bot}
                  craw2={bots[index + 1]}
                  shouldLogin={shouldLogin}
                  shouldJoinMB={shouldJoinMB}
                  shouldCreatRoom={shouldCreatRoom}
                  shouldLeave={shouldLeave}
                />
              )
          )}

          {crawingBot.map((bot, index) => {
            if (index % 2 === 0 && index < crawingBot.length - 1) {
              if (index < crawingBot.length - 3) {
                return (
                  <CoupleCrawStatus
                    key={index}
                    index={index}
                    craw1={bot}
                    craw2={crawingBot[index + 1]}
                    shouldLogin={shouldLogin}
                    shouldJoinMB={shouldJoinMB}
                    shouldCreatRoom={shouldCreatRoom}
                    shouldLeave={shouldLeave}
                  />
                );
              } else {
                return (
                  <CoupleWaiterStatus
                    key={index}
                    index={index}
                    craw1={bot}
                    craw2={crawingBot[index + 1]}
                    shouldLogin={shouldLogin}
                    shouldJoinMB={shouldJoinMB}
                    shouldCreatRoom={shouldCreatRoom}
                    shouldLeave={shouldLeave}
                  />
                );
              }
            }
          })}
        </>

        <div className="flex space-x-2">
          <Button onClick={onLogin}>Đăng nhập</Button>
          <Button onClick={onJoinMauBinh}>Vào mậu binh</Button>
          <Button onClick={onCreatRoom}>Lấy bài</Button>
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
