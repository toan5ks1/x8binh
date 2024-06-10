import { Dispatch, SetStateAction } from 'react';
import { SendMessage } from 'react-use-websocket';
import { Room, StateProps } from '../../renderer/providers/app';
import { binhlung } from '../binhlung';
import { LoginResponseDto } from '../login';

interface HandleCRMessageProps {
  message: any;
  waiterRoom: Room;
  setWaiterRoom: Dispatch<SetStateAction<Room>>;
  sendMessage: SendMessage;
  user: LoginResponseDto;
  state: StateProps;
}

export function handleMessageWaiterGuess({
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
          shouldHostReady: true,
        }));
      } else if (message[1]?.cs?.length > 0) {
        // Submit cards
        sendMessage(
          `[5,"Simms",${
            state?.foundAt ?? waiterRoom.id
          },{"cmd":603,"cs":[${binhlung(message[1].cs)}]}]`
        );

        returnMsg = `Card received: ${message[1].cs}`;
      }
      break;
    case 3:
      if (message[1] === true) {
        // Guess join room response
        setWaiterRoom((pre) => ({
          ...pre,
          isGuessJoin: true,
        }));

        !state.foundAt && sendMessage(`[5,"Simms",${waiterRoom.id},{"cmd":5}]`);

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
          isGuessOut: true,
          isGuessJoin: false,
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
