import { useContext } from 'react';
import { Card } from '../../../../src/components/ui/card';
import { AppContext } from '../../../../src/renderer/providers/app';
import { BotStatus } from '../components/bots/bot';

export const FindRoom = (
  user1: any,
  messageHistoryBot1: any,
  connectionStatusBot1: any,
  user2: any,
  messageHistoryBot2: any,
  connectionStatusBot2: any
) => {
  const { state } = useContext<any>(AppContext);

  return (
    <div className="flex flex-col h-screen">
      <div
        className="flex flex-col justify-center items-center  text-white space-y-4 py-8 flex-1"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      >
        <div className="flex space-x-4">
          <Card>
            <BotStatus
              name={'Bot 1'}
              userId={user1?.username}
              connectionStatus={connectionStatusBot1}
              messageHistory={messageHistoryBot1}
            />
          </Card>

          <Card>
            <BotStatus
              name={'Bot 2'}
              userId={user2?.username}
              connectionStatus={connectionStatusBot2}
              messageHistory={messageHistoryBot2}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
