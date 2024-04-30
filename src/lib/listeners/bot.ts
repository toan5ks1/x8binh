import { Dispatch, SetStateAction } from 'react';
import { BotStatus, StateProps } from '../../renderer/providers/app';
import { LoginResponseDto } from '../login';
import { defaultRoom, getCardsArray } from '../utils';

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
        setUser((pre) => ({ ...pre, status: BotStatus.Initialized }));
      }
      break;
    case 5:
      if (message[1].rs && user?.status === BotStatus.Initialized) {
        setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        returnMsg = 'Join Maubinh sucessfully!';
      } else if (message[1].ri && message[1].cmd === 308) {
        // Create room response
        const roomId = message[1]?.ri?.rid;

        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...defaultRoom,
            id: roomId as number,
            owner: caller,
          },
        }));
        returnMsg = `Created room ${roomId}`;
      } else if (
        message[1]?.c === 100 ||
        (message[1]?.cmd === 5 && message[1]?.dn === fullname)
      ) {
        caller === state.initialRoom.owner &&
          setState((pre) => {
            return {
              ...pre,
              initialRoom: {
                ...pre.initialRoom,
                isHostReady: true,
              },
            };
          });
        setUser((pre) => ({ ...pre, status: BotStatus.Ready }));
      } else if (message[1]?.cs?.length > 0) {
        setUser((pre) => ({
          ...pre,
          status: BotStatus.Received,
          currentCard: message[1].cs,
        }));
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setUser((pre) => ({ ...pre, status: BotStatus.PreFinished }));
        // returnMsg = 'Game pre finished!';
      } else if (
        message[1]?.cmd === 204 &&
        user?.status === BotStatus.PreFinished
      ) {
        setState((pre) => {
          return {
            ...pre,
            initialRoom: {
              ...pre.initialRoom,
              isFinish: true,
            },
          };
        });
        setUser((pre) => ({ ...pre, status: BotStatus.Finished }));
        returnMsg = 'Game finished!';
      } else if (
        message[1].hsl === false &&
        message[1].ps?.length >= 2 &&
        message[1].cmd === 602
      ) {
        caller === state.initialRoom.owner &&
          setState((pre) => {
            return {
              ...pre,
              initialRoom: {
                ...pre.initialRoom,
                cardGame: [
                  ...pre.initialRoom.cardGame,
                  getCardsArray(message[1].ps),
                ],
              },
            };
          });
        setUser((pre) => ({ ...pre, status: BotStatus.Submitted }));
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        const currentPlayers = [...state.initialRoom.players, caller];
        setState((pre) => {
          return {
            ...pre,
            initialRoom: {
              ...pre.initialRoom,
              players: currentPlayers,
            },
          };
        });
        setUser((pre) => ({ ...pre, status: BotStatus.Joined }));

        returnMsg = `Joined room ${message[3]} (room now has ${currentPlayers.length} players)`;
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setUser((pre) => ({ ...pre, status: BotStatus.Left }));
        setState((pre) => ({
          ...pre,
          initialRoom: { ...pre.initialRoom, players: [] },
          shouldRecreateRoom: state.foundAt ? false : true,
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
