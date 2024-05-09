import { Dispatch, SetStateAction } from 'react';
import { BotStatus, StateProps } from '../../renderer/providers/app';
import { LoginResponseDto } from '../login';
import { amIPlaying } from '../utils';

interface HandleMessageWaiterProps {
  message: any;
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  user: LoginResponseDto;
  setUser: Dispatch<React.SetStateAction<LoginResponseDto>>;
}

export function handleMessageWaiter({
  message,
  state,
  setState,
  user,
  setUser,
}: HandleMessageWaiterProps) {
  const { username: caller, fullname } = user;
  let returnMsg;

  switch (message[0]) {
    case 1:
      if (message[1] === true) {
        setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        setState((pre) => ({ ...pre, isLoggedIn: true }));
        returnMsg = 'Join Maubinh sucessfully!';
      }
      break;
    case 5:
      if (message[1].rs && user?.status === BotStatus.Initialized) {
        // setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        // setState((pre) => ({ ...pre, isLoggedIn: true }));
        // returnMsg = 'Join Maubinh sucessfully!';
        setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        setState((pre) => ({ ...pre, isLoggedIn: true }));
        returnMsg = 'Đã vào lobby!';
      } else if (
        message[1]?.c === 100 ||
        (message[1]?.cmd === 5 && message[1]?.dn === fullname)
      ) {
        setUser((pre) => ({ ...pre, status: BotStatus.Ready }));
      } else if (message[1]?.cs?.length > 0 && state.foundBy) {
        setUser((pre) => ({
          ...pre,
          status: BotStatus.Received,
          currentCard: message[1].cs,
        }));

        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setUser((pre) => ({ ...pre, status: BotStatus.PreFinished }));
      } else if (
        message[1]?.cmd === 204 &&
        user.status === BotStatus.PreFinished
      ) {
        setUser((pre) => ({ ...pre, status: BotStatus.Finished }));
        returnMsg = 'Game finished!';
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2 &&
        message[1].cmd === 602
      ) {
        const isPlaying = amIPlaying(message[1].ps, user.fullname);
        setUser((pre) => ({
          ...pre,
          status: isPlaying ? BotStatus.Submitted : pre.status,
        }));
        returnMsg = 'Cards saved!';
      } else if (message[1].cmd === 603 && message[1].iar === true) {
        setUser((pre) => ({
          ...pre,
          status: BotStatus.Submitted,
        }));
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Join room response
        if (state.foundBy) {
          setUser((pre) => ({ ...pre, status: BotStatus.Joined }));
          returnMsg = `Joined room ${message[3]}`;
        }
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setUser((pre) => ({ ...pre, status: BotStatus.Left }));
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
