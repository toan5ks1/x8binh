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
        setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        returnMsg = 'Đã vào lobby';
      }
      break;
    case 5:
      if (message[1].ri && message[1].cmd === 308) {
        // Create room response
        const roomId = message[1]?.ri?.rid;

        setState((pre) => {
          const newRoom = {
            ...defaultRoom,
            id: roomId as number,
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
        setUser((pre) => ({ ...pre, status: BotStatus.Ready }));
        caller !== state.crawingRoom[coupleId].owner &&
          setState((pre) => ({
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              // [coupleId]: { ...pre.crawingRoom[coupleId], isHostReady: true },
            },
            readyHost: pre.readyHost + 1,
          }));
      } else if (message[1]?.cs?.length > 0) {
        setUser((pre) => ({
          ...pre,
          status: BotStatus.Received,
          currentCard: message[1].cs,
        }));

        setState((pre) => {
          const room = pre.crawingRoom[coupleId];
          return {
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: {
                ...room,
                cardDesk: [...room.cardDesk, message[1].cs],
              },
            },
          };
        });

        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setUser((pre) => ({ ...pre, status: BotStatus.PreFinished }));
      } else if (
        message[1]?.cmd === 204 &&
        user.status === BotStatus.PreFinished
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
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
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
            };
          });
        setUser((pre) => ({ ...pre, status: BotStatus.Saved }));
        returnMsg = 'Cards saved!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Join room response
        if (coupleId) {
          setUser((pre) => ({ ...pre, status: BotStatus.Joined }));
          setState((pre) => ({
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: {
                ...pre.crawingRoom[coupleId],
                owner: state.crawingRoom[coupleId].owner ?? caller,
              },
            },
          }));

          returnMsg = `Joined room ${message[3]}`;
        }
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
