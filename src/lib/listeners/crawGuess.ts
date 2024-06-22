import { Dispatch, SetStateAction } from 'react';
import { SendMessage } from 'react-use-websocket';
import { Room, StateProps } from '../../renderer/providers/app';
import { binhlung } from '../binhlung';
import { LoginResponseDto } from '../login';
import { findPosition, updateCardGame } from '../utils';

interface HandleCRMessageProps {
  message: any;
  crawingRoom: Room;
  setCrawingRoom: Dispatch<SetStateAction<Room>>;
  sendMessage: SendMessage;
  user: LoginResponseDto;
  setUser: Dispatch<SetStateAction<LoginResponseDto | undefined>>;
  state: StateProps;
}

export function handleMessageCrawGuess({
  message,
  crawingRoom,
  setCrawingRoom,
  sendMessage,
  state,
  user,
  setUser,
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
      if (message[1]?.cmd === 100 && message[1].uid) {
        setUser((pre) => ({ ...pre, uid: message[1].uid }));
      } else if (message[1]?.cmd === 5 && message[1]?.dn === fullname) {
        setCrawingRoom((pre) => ({
          ...pre,
          isGuessJoin: false,
          isGuessReady: true,
          shouldHostReady: true,
        }));
      } else if (message[1]?.cs?.length > 0) {
        const idxToAdd = findPosition(message[1].lpi, user.uid);

        setCrawingRoom((pre) => ({
          ...pre,
          cardGame: updateCardGame(
            pre.cardGame,
            {
              cs: message[1].cs,
              dn: 'guess',
            },
            idxToAdd
          ),
        }));
        // Submit cards
        sendMessage(
          `[5,"Simms",${
            state?.foundAt ?? crawingRoom.id
          },{"cmd":603,"cs":[${binhlung(message[1].cs)}]}]`
        );

        returnMsg =
          idxToAdd >= 0
            ? `Card received: ${message[1].cs}`
            : 'Error when save card';
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
