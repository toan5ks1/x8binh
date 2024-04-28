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
        setUser((pre) => ({ ...pre, status: BotStatus.Initialized }));
      }
      break;
    case 5:
      if (message[1].rs && user?.status === BotStatus.Initialized) {
        setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        returnMsg = 'Join Maubinh sucessfully!';
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
      } else if (
        message[1].hsl === false &&
        message[1].ps?.length >= 2 &&
        message[1].cmd === 602
      ) {
        const isPlaying = amIPlaying(message[1].ps, user.fullname);
        setUser((pre) => ({
          ...pre,
          status: isPlaying ? BotStatus.Submitted : pre.status,
        }));
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Join room response
        if (state.foundBy) {
          const currentRoom = state.crawingRoom[state.foundBy];
          const currentPlayers = [...currentRoom.players, caller];

          setState((pre) => {
            return {
              ...pre,
              crawingRoom: {
                ...pre.crawingRoom,
                [state.foundBy!]: {
                  ...currentRoom,
                  players: currentPlayers,
                },
              },
            };
          });
          setUser((pre) => ({ ...pre, status: BotStatus.Joined }));
          returnMsg = `Joined room ${message[3]} (room now has ${currentPlayers.length} players)`;
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
