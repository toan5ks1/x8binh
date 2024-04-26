import { Dispatch, SetStateAction } from 'react';
import { BotStatus, StateProps } from '../../renderer/providers/app';
import { LoginResponseDto } from '../login';
import { defaultRoom, insertReceivedCards } from '../utils';

interface HandleCRMessageProps {
  message: any;
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  user: LoginResponseDto;
}

export function handleMessage({
  message,
  state,
  setState,
  user,
}: HandleCRMessageProps) {
  let returnMsg;
  const { username: caller, fullname } = user;

  switch (message[0]) {
    case 5:
      const botStatus = state.mainBots[caller]?.status;
      if (message[1].rs && !botStatus) {
        setState((pre) => {
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.Connected,
              },
            },
          };
        });
        returnMsg = 'Join Maubinh sucessfully!';
      } else if (message[1].ri) {
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
        setState((pre) => ({
          ...pre,
          mainBots: {
            ...pre.mainBots,
            [caller]: { status: BotStatus.Ready },
          },
        }));
      } else if (message[1]?.cs?.length > 0) {
        setState((pre) => {
          return {
            ...pre,
            initialRoom: {
              ...pre.initialRoom,
              cardDesk: insertReceivedCards(
                pre.initialRoom.cardDesk,
                caller,
                message[1].cs
              ),
              isFinish: false,
            },
            mainBots: {
              ...pre.mainBots,
              [caller]: { status: BotStatus.Received },
            },
          };
        });
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setState((pre) => {
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.PreFinished,
              },
            },
            // initialRoom: {
            //   ...pre.initialRoom,
            //   isFinish: true,
            // },
          };
        });
        returnMsg = 'Game pre finished!';
      } else if (
        message[1]?.cmd === 204 &&
        state.mainBots[caller]?.status === BotStatus.PreFinished
      ) {
        setState((pre) => {
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.Finished,
              },
            },
            initialRoom: {
              ...pre.initialRoom,
              isFinish: true,
            },
          };
        });
        returnMsg = 'Game finished!';
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2
      ) {
        setState((pre) => {
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.Submitted,
              },
            },
          };
        });
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        let currentPlayers;
        setState((pre) => {
          currentPlayers = [...pre.initialRoom.players, caller];
          returnMsg = `Joined room ${message[3]} (room now has ${currentPlayers.length} players)`;
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: { status: BotStatus.Joined },
            },
            initialRoom: {
              ...pre.initialRoom,
              players: currentPlayers,
            },
          };
        });
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setState((pre) => {
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.Left,
              },
            },
            shouldRecreateRoom: true,
          };
        });
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
