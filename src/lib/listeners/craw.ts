import { Dispatch, SetStateAction } from 'react';
import { BotStatus, StateProps } from '../../renderer/providers/app';
import { LoginResponseDto } from '../login';
import { defaultRoom, insertReceivedCards } from '../utils';

interface HandleCRMessageCrawingProps {
  message: any;
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  user: LoginResponseDto;
  coupleId: string;
}

export function handleMessageCrawing({
  message,
  state,
  setState,
  user,
  coupleId,
}: HandleCRMessageCrawingProps) {
  const { username: caller, fullname } = user;
  let returnMsg;

  switch (message[0]) {
    case 5:
      const botStatus = state.crawingBots[caller]?.status;
      if (message[1].rs && !botStatus) {
        setState((pre) => {
          // const curStatus = pre.crawingBots[caller]?.status;
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
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

        setState((pre) => {
          const newRoom = {
            id: roomId as number,
            owner: caller,
            ...defaultRoom,
          };
          return {
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: newRoom,
            },
          };
        });
        returnMsg = `Created room ${roomId}`;
      } else if (
        message[1]?.c === 100 ||
        (message[1]?.cmd === 5 && message[1]?.dn === fullname)
      ) {
        setState((pre) => ({
          ...pre,
          crawingBots: {
            ...pre.crawingBots,
            [caller]: { status: BotStatus.Ready },
          },
        }));
      } else if (message[1]?.cs?.length > 0) {
        setState((pre) => {
          const currentRoom = pre.crawingRoom[coupleId];
          return {
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: {
                ...currentRoom,
                cardDesk: insertReceivedCards(
                  currentRoom.cardDesk,
                  caller,
                  message[1].cs
                ),
                isFinish: false,
              },
            },
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.Received,
              },
            },
          };
        });

        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setState((pre) => {
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.PreFinished,
              },
            },
            // crawingRoom: {
            //   ...pre.crawingRoom,
            //   [coupleId]: {
            //     ...pre.crawingRoom[coupleId],
            //     isFinish: true,
            //   },
            // },
          };
        });
        returnMsg = 'Game pre finished!';
      } else if (
        message[1]?.cmd === 204 &&
        state.crawingBots[caller]?.status === BotStatus.PreFinished
      ) {
        setState((pre) => {
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.Finished,
              },
            },
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: {
                ...pre.crawingRoom[coupleId],
                isFinish: true,
              },
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
            crawingBots: {
              ...pre.crawingBots,
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
        // Join room response
        if (coupleId) {
          const currentRoom = state.crawingRoom[coupleId];
          const currentPlayers = [...currentRoom.players, caller];

          setState((pre) => {
            return {
              ...pre,
              crawingBots: {
                ...pre.crawingBots,
                [caller]: { status: BotStatus.Joined },
              },
              crawingRoom: {
                ...pre.crawingRoom,
                [coupleId]: {
                  ...currentRoom,
                  players: currentPlayers,
                },
              },
            };
          });

          returnMsg = `Joined room ${message[3]} (room now has ${currentPlayers.length} players)`;
        }
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setState((pre) => {
          const initRoom = pre.initialRoom;
          const outVote = initRoom.shouldOutVote + 1;
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.Left,
              },
            },
            initialRoom: {
              ...initRoom,
              shouldOutVote: outVote,
            },
            shouldRecreateRoom: false,
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
