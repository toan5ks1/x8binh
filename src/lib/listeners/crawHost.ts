import { Dispatch, SetStateAction } from 'react';
import { SendMessage } from 'react-use-websocket';
import { Room, StateProps } from '../../renderer/providers/app';
import { binhlung } from '../binhlung';
import { LoginResponseDto } from '../login';
import { defaultRoom, getCardsArray } from '../utils';

interface HandleCRMessageProps {
  message: any;
  crawingRoom: Room;
  initialRoom: Room;
  setCrawingRoom: Dispatch<SetStateAction<Room>>;
  sendMessage: SendMessage;
  user: LoginResponseDto;
  state: StateProps;
}

export function handleMessageCrawHost({
  message,
  crawingRoom,
  setCrawingRoom,
  sendMessage,
  state,
}: HandleCRMessageProps) {
  let returnMsg;
  switch (message[0]) {
    case 1:
      if (message[1] === true) {
        returnMsg = 'Đã vào lobby!';
      }
      break;
    case 5:
      if (message[1]?.b === 100 && message[1]?.re === false) {
        setCrawingRoom((pre) => ({
          ...pre,
          isHostReady: true,
        }));
      } else if (message[1].ri && message[1].cmd === 308) {
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
        setCrawingRoom((pre) => ({
          ...pre,
          isFinish: false,
          cardDesk: [...pre.cardDesk, { cs: message[1].cs, dn: 'host' }],
        }));

        // Submit cards
        state.foundAt &&
          sendMessage(
            `[5,"Simms",${
              state?.foundAt ?? crawingRoom.id
            },{"cmd":603,"cs":[${binhlung(message[1].cs)}]}]`
          );

        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setCrawingRoom((pre) => ({ ...pre, isPrefinish: true }));
      } else if (message[1]?.cmd === 204 && crawingRoom.isPrefinish) {
        setCrawingRoom((pre) => ({
          ...pre,
          isPrefinish: false,
          isFinish: true,
        }));
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
            isSubmitCard: true,
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
          isHostJoin: true,
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
          isHostJoin: false,
        }));

        returnMsg = message[5] || 'Left room successfully!';
      } else {
        returnMsg = message[5] || 'Left room failed!';
      }
      break;
    default:
      break;
  }

  return returnMsg;
}
