import { useContext } from 'react';
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
      <div className="flex flex-col  text-white space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-[20px] w-full">
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
      </div>
    </div>
  );
};
