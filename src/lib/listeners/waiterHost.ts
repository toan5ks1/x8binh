import { Dispatch, SetStateAction } from 'react';
import { SendMessage } from 'react-use-websocket';
import { Room, StateProps } from '../../renderer/providers/app';
import { binhlung } from '../binhlung';
import { LoginResponseDto } from '../login';
import { defaultRoom, getCardsArray } from '../utils';

interface HandleCRMessageProps {
  message: any;
  waiterRoom: Room;
  setWaiterRoom: Dispatch<SetStateAction<Room>>;
  sendMessage: SendMessage;
  user: LoginResponseDto;
  state: StateProps;
}

export function handleMessageWaiterHost({
  message,
  waiterRoom,
  setWaiterRoom,
  sendMessage,
  user,
  state,
}: HandleCRMessageProps) {
  let returnMsg;
  const { fullname } = user;

  switch (message[0]) {
    case 1:
      if (message[1] === true) {
        returnMsg = 'Đã vào lobby!';
      }
      break;
    case 5:
      if (
        message[1]?.c === 100 ||
        (message[1]?.cmd === 5 && message[1]?.dn === fullname)
      ) {
        setWaiterRoom((pre) => ({
          ...pre,
          isHostReady: true,
        }));
      } else if (message[1].ri && message[1].cmd === 308) {
        // Create room response
        const roomId = message[1]?.ri?.rid;

        setWaiterRoom({
          ...defaultRoom,
          id: roomId as number,
        });
        returnMsg = `Created room ${roomId}`;

        // Host join
        sendMessage(`[3,"Simms",${roomId},""]`);
      } else if (message[1]?.cs?.length > 0) {
        setWaiterRoom((pre) => ({ ...pre, isFinish: false }));
        // Submit cards
        sendMessage(
          `[5,"Simms",${
            state?.foundAt ?? waiterRoom.id
          },{"cmd":603,"cs":[${binhlung(message[1].cs)}]}]`
        );
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setWaiterRoom((pre) => ({ ...pre, isPrefinish: true }));
      } else if (message[1]?.cmd === 204 && waiterRoom.isPrefinish) {
        setWaiterRoom((pre) => ({
          ...pre,
          isFinish: true,
          isHostReady: false,
          shouldHostReady: false,
        }));
        returnMsg = 'Game finished!';
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2 &&
        message[1].cmd === 602
      ) {
        const newCards = getCardsArray(message[1].ps);
        setWaiterRoom((pre) => {
          return {
            ...pre,
            cardGame: [...waiterRoom.cardGame, newCards],
          };
        });

        returnMsg = 'Cards saved!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        setWaiterRoom((pre) => ({
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
        setWaiterRoom((pre) => ({
          ...pre,
          isHostOut: true,
          isHostJoin: false,
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
