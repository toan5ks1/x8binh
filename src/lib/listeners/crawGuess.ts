import { Dispatch, SetStateAction } from 'react';
import { SendMessage } from 'react-use-websocket';
import { Room, StateProps } from '../../renderer/providers/app';
import { binhlung } from '../binhlung';
import { LoginResponseDto } from '../login';

interface HandleCRMessageProps {
  message: any;
  crawingRoom: Room;
  setCrawingRoom: Dispatch<SetStateAction<Room>>;
  sendMessage: SendMessage;
  user: LoginResponseDto;
  state: StateProps;
}

export function handleMessageCrawGuess({
  message,
  crawingRoom,
  setCrawingRoom,
  sendMessage,
  state,
  user,
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
      if (message[1]?.cmd === 5 && message[1]?.dn === fullname) {
        setCrawingRoom((pre) => ({
          ...pre,
          isGuessJoin: false,
          isGuessReady: true,
          shouldHostReady: true,
        }));
      } else if (message[1]?.cs?.length > 0) {
        setCrawingRoom((pre) => ({
          ...pre,
          cardDesk: [...pre.cardDesk, { cs: message[1].cs, dn: 'guess' }],
        }));
        // Submit cards
        sendMessage(
          `[5,"Simms",${
            state?.foundAt ?? crawingRoom.id
          },{"cmd":603,"cs":[${binhlung(message[1].cs)}]}]`
        );

        returnMsg = `Card received: ${message[1].cs}`;
      }
      break;
    case 3:
      if (message[1] === true) {
        // Guess join room response
        setCrawingRoom((pre) => ({
          ...pre,
          isGuessOut: false,
          isGuessJoin: true,
        }));

        !state.foundAt &&
          sendMessage(`[5,"Simms",${crawingRoom.id},{"cmd":5}]`);

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
          isGuessOut: true,
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
