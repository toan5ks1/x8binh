import { Dispatch, SetStateAction } from 'react';
import { SendMessage } from 'react-use-websocket';
import { Room } from '../../renderer/providers/app';
import { defaultRoom, getCardsArray } from '../utils';

interface HandleCRMessageProps {
  message: any;
  crawingRoom: Room;
  initialRoom: Room;
  setCrawingRoom: Dispatch<SetStateAction<Room>>;
  sendMessage: SendMessage;
}

export function handleMessageCrawHost({
  message,
  crawingRoom,
  initialRoom,
  setCrawingRoom,
  sendMessage,
}: HandleCRMessageProps) {
  let returnMsg;

  switch (message[0]) {
    case 1:
      if (message[1] === true) {
        returnMsg = 'Đã vào lobby!';
      }
      break;
    case 5:
      if (message[1].ri && message[1].cmd === 308) {
        // Create room response
        const roomId = message[1]?.ri?.rid;

        setCrawingRoom({
          ...defaultRoom,
          id: roomId as number,
        });
        returnMsg = `Created room ${roomId}`;

        // Host join
        sendMessage(`[3,"Simms",${roomId},""]`);
      } else if (message[1]?.cs?.length > 0) {
        // Submit cards
        sendMessage(
          `[5,"Simms",${crawingRoom.id},{"cmd":603,"cs":[${message[1].cs}]}]`
        );
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setCrawingRoom((pre) => ({ ...pre, isPrefinish: true }));
      } else if (message[1]?.cmd === 204 && crawingRoom.isPrefinish) {
        setCrawingRoom((pre) => ({ ...pre, isFinish: true }));
        returnMsg = 'Game finished!';
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2 &&
        message[1].cmd === 602
      ) {
        const newCards = getCardsArray(message[1].ps);
        setCrawingRoom((pre) => {
          return {
            ...pre,
            cardGame: [...crawingRoom.cardGame, newCards],
          };
        });

        returnMsg = 'Cards saved!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        setCrawingRoom((pre) => ({
          ...pre,
          shouldGuessJoin: true,
        }));

        returnMsg = `Joined room ${message[3]}`;
      } else if (message[1] === false) {
        returnMsg = `${message[4]}`;
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setCrawingRoom((pre) => ({
          ...pre,
          isHostOut: true,
        }));

        returnMsg = 'Left room successfully!';
      } else {
        returnMsg = message[5] || 'Left room failed!';
      }
      break;
    default:
      break;
  }

  return returnMsg;
}
