import { Dispatch, SetStateAction } from 'react';
import { BotStatus, StateProps } from '../../renderer/providers/app';
import { LoginResponseDto } from '../login';
import { defaultRoom } from '../utils';

interface HandleCRMessageProps {
  message: any;
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  user: LoginResponseDto;
  setUser: Dispatch<React.SetStateAction<LoginResponseDto>>;
}

export function handleMessage({
  message,
  state,
  setState,
  user,
  setUser,
}: HandleCRMessageProps) {
  let returnMsg;
  const { username: caller, fullname } = user;

  switch (message[0]) {
    case 1:
      if (message[1] === true) {
        setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        returnMsg = 'Đã vào lobby!';
      }
      break;
    case 5:
      if (message[1].ri && message[1].cmd === 308) {
        // Create room response
        const roomId = message[1]?.ri?.rid;

        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...defaultRoom,
            id: roomId as number,
            // owner: caller,
          },
        }));
        returnMsg = `Created room ${roomId}`;
      } else if (
        message[1]?.c === 100 ||
        (message[1]?.cmd === 5 && message[1]?.dn === fullname)
      ) {
        setUser((pre) => ({ ...pre, status: BotStatus.Ready }));
        caller !== state.initialRoom.owner &&
          setState((pre) => ({
            ...pre,
            readyHost: pre.readyHost + 1,
          }));
      } else if (message[1]?.cs?.length > 0) {
        setUser((pre) => ({
          ...pre,
          status: BotStatus.Received,
          currentCard: message[1].cs,
        }));

        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...pre.initialRoom,
            cardDesk: [...pre.initialRoom.cardDesk, message[1].cs],
          },
        }));
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setUser((pre) => ({ ...pre, status: BotStatus.PreFinished }));
      } else if (
        message[1]?.cmd === 204 &&
        user?.status === BotStatus.PreFinished
      ) {
        setUser((pre) => ({ ...pre, status: BotStatus.Finished }));
        returnMsg = 'Game finished!';
      } else if (message[1].cmd === 603 && message[1].iar === true) {
        user.status !== BotStatus.Submitted &&
          setUser((pre) => ({
            ...pre,
            status: BotStatus.Submitted,
          }));
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        setUser((pre) => ({ ...pre, status: BotStatus.Joined }));
        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...pre.initialRoom,
            owner: pre.initialRoom.owner ?? caller,
          },
        }));

        returnMsg = `Joined room ${message[3]}`;
      } else if (message[1] === false) {
        returnMsg = `${message[4]}`;
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...pre.initialRoom,
            shouldOutVote: pre.initialRoom.shouldOutVote + 1,
          },
        }));
        returnMsg = 'Left room successfully!';
      } else {
        // returnMsg = message[5] || 'Left room failed!';
      }
      break;
    default:
      break;
  }

  return returnMsg;
}
