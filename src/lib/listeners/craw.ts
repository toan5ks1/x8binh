import { Dispatch, SetStateAction } from 'react';
import { BotStatus, StateProps } from '../../renderer/providers/app';
import { LoginResponseDto } from '../login';
import { defaultRoom, getCardsArray } from '../utils';

interface HandleCRMessageCrawingProps {
  message: any;
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  user: LoginResponseDto;
  setUser: Dispatch<React.SetStateAction<LoginResponseDto>>;
  coupleId: string;
}

export function handleMessageCrawing({
  message,
  state,
  setState,
  user,
  setUser,
  coupleId,
}: HandleCRMessageCrawingProps) {
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
        const room = state.crawingRoom[coupleId];
        caller === room.owner &&
          setState((pre) => {
            return {
              ...pre,
              crawingRoom: {
                ...pre.crawingRoom,
                [coupleId]: { ...room, isHostReady: true },
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
        user.status === BotStatus.PreFinished
      ) {
        setState((pre) => {
          return {
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: {
                ...pre.crawingRoom[coupleId],
                isFinish: true,
              },
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
        const room = state.crawingRoom[coupleId];
        caller === room.owner &&
          setState((pre) => {
            return {
              ...pre,
              crawingRoom: {
                ...pre.crawingRoom,
                [coupleId]: {
                  ...room,
                  cardGame: [...room.cardGame, getCardsArray(message[1].ps)],
                },
              },
              shouldRecreateRoom: false,
            };
          });
        setUser((pre) => ({ ...pre, status: BotStatus.Submitted }));
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
              crawingRoom: {
                ...pre.crawingRoom,
                [coupleId]: {
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
        setState((pre) => {
          const initRoom = pre.initialRoom;
          const outVote = initRoom.shouldOutVote + 1;
          return {
            ...pre,
            initialRoom: {
              ...initRoom,
              shouldOutVote: outVote,
            },
          };
        });
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
