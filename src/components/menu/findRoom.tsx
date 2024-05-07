import { CoupleCrawStatus } from '../bots/coupleCraw';
import { MainPlayerStatus } from '../bots/mainPlayer';
import { ScrollArea } from '../ui/scroll-area';
import BotSetting from './botSheet';

interface FindRoomSheetProps {
  bots: any;
  craws: any;
  shouldLogin: boolean;
  shouldCreatRoom: boolean;
  shouldLeave: boolean;
  shouldDisconnect: boolean;
  isOpen: boolean;
  setIsOpen: any;
}

export function FindRoomSheet({
  bots,
  craws,
  shouldLogin,
  shouldCreatRoom,
  shouldLeave,
  shouldDisconnect,
  isOpen,
  setIsOpen,
}: FindRoomSheetProps) {
  return (
    <BotSetting isOpen={isOpen} setIsOpen={setIsOpen}>
      <ScrollArea className="h-full rounded-md flex flex-col">
        <div className="flex flex-col  text-white space-y-4 flex-1 w-full">
          {bots.map(
            (bot: any, index: any) =>
              index % 2 === 0 &&
              index < bots.length - 1 && (
                <MainPlayerStatus
                  key={index}
                  index={index}
                  craw1={bot}
                  craw2={bots[index + 1]}
                  shouldLogin={shouldLogin}
                  shouldCreatRoom={shouldCreatRoom}
                  shouldLeave={shouldLeave}
                  shouldDisconnect={shouldDisconnect}
                />
              )
          )}

          {craws.map((bot: any, index: any) => {
            if (index % 2 === 0 && index < craws.length - 1) {
              if (index < craws.length - 3) {
                return (
                  <CoupleCrawStatus
                    key={index}
                    index={index}
                    craw1={bot}
                    craw2={craws[index + 1]}
                    shouldLogin={shouldLogin}
                    shouldCreatRoom={shouldCreatRoom}
                    shouldLeave={shouldLeave}
                    shouldDisconnect={shouldDisconnect}
                  />
                );
              } else {
                return (
                  // <CoupleWaiterStatus
                  //   key={index}
                  //   index={index}
                  //   craw1={bot}
                  //   craw2={craws[index + 1]}
                  //   shouldLogin={shouldLogin}
                  //   shouldCreatRoom={shouldCreatRoom}
                  //   shouldLeave={shouldLeave}
                  //   shouldDisconnect={shouldDisconnect}
                  // />
                  <></>
                );
              }
            }
          })}
        </div>
      </ScrollArea>
    </BotSetting>
  );
}
