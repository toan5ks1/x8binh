import { Dispatch, SetStateAction } from 'react';
import { SendMessage } from 'react-use-websocket';
import { Room } from '../../renderer/providers/app';
import { LoginResponseDto } from '../login';

interface HandleCRMessageProps {
  message: any;
  crawingRoom: Room;
  setCrawingRoom: Dispatch<SetStateAction<Room>>;
  sendMessage: SendMessage;
  user: LoginResponseDto;
}

export function handleMessageCrawGuess({
  message,
  crawingRoom,
  setCrawingRoom,
  sendMessage,
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
      if (
        message[1]?.c === 100 ||
        (message[1]?.cmd === 5 && message[1]?.dn === fullname)
      ) {
        setCrawingRoom((pre) => ({
          ...pre,
          shouldHostReady: true,
        }));
      } else if (message[1]?.cs?.length > 0) {
        // Submit cards
        sendMessage(
          `[5,"Simms",${crawingRoom.id},{"cmd":603,"cs":[${message[1].cs}]}]`
        );

        returnMsg = `Card received: ${message[1].cs}`;
        //   } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        //     setUser((pre) => ({ ...pre, status: BotStatus.PreFinished }));
        //   } else if (
        //     message[1]?.cmd === 204 &&
        //     user?.status === BotStatus.PreFinished
        //   ) {
        //     setUser((pre) => ({ ...pre, status: BotStatus.Finished }));
        //     returnMsg = 'Game finished!';
        //   } else if (message[1].cmd === 603 && message[1].iar === true) {
        //     user.status !== BotStatus.Submitted &&
        //       setUser((pre) => ({
        //         ...pre,
        //         status: BotStatus.Submitted,
        //       }));
        //     returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Guess join room response
        setCrawingRoom((pre) => ({
          ...pre,
          shouldGuessJoin: false,
        }));

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
