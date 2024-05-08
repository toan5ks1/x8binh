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
        // setState((pre) => ({
        //   ...pre,
        //   mainBots: {
        //     ...pre.mainBots,
        //     [caller]: { status: BotStatus.Connected },
        //   },
        //   isLoggedIn: true,
        // }));
        returnMsg = 'Join Maubinh sucessfully!';
      }
      break;
    case 5:
      if (message[1].rs && user?.status === BotStatus.Initialized) {
        // setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        // setState((pre) => ({ ...pre, isLoggedIn: true }));
        // returnMsg = 'Join Maubinh sucessfully!';
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
        setUser((pre) => ({ ...pre, status: BotStatus.Ready }));
        caller !== state.initialRoom.owner &&
          setState((pre) => ({
            ...pre,
            // initialRoom: { ...pre.initialRoom, isHostReady: true },
            readyHost: pre.readyHost + 1,
          }));
      } else if (message[1]?.cs?.length > 0) {
        setUser((pre) => ({
          ...pre,
          status: BotStatus.Received,
          currentCard: message[1].cs,
        }));

        // setState((pre) => {
        //   const room = pre.initialRoom;
        //   const card = JSON.stringify(message[1].cs)
        //   const isFound = room.targetCard.includes(card)
        //   return !isFound ? {
        //     ...pre,
        //     initialRoom: {
        //       ...room,
        //       targetCard: [...room.targetCard, card],
        //     },
        //   } : {
        //     ...pre,
        //     targetAt: room.id,

        //   };
        // });

        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...pre.initialRoom,
            cardDesk: [...pre.initialRoom.cardDesk, message[1].cs],
          },
        }));
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        // setUser((pre) => ({ ...pre, status: BotStatus.PreFinished }));
      } else if (
        message[1]?.cmd === 204 &&
        user?.status === BotStatus.PreFinished
      ) {
        // setState((pre) => {
        //   return {
        //     ...pre,
        //     initialRoom: {
        //       ...pre.initialRoom,
        //       isFinish: true,
        //     },
        //   };
        // });
        // setUser((pre) => ({ ...pre, status: BotStatus.Finished }));
        // returnMsg = 'Game finished!';
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2 &&
        message[1].cmd === 602
      ) {
        //[5,{"uid":"29_23559922","cmd":603,"iar":true}]
        setUser((pre) => ({
          ...pre,
          status: BotStatus.Submitted,
          // uid: message[1].uid,
        }));
        returnMsg = 'Cards submitted!';
        // } else if (
        //   (message[1].hsl === false || message[1].hsl === true) &&
        //   message[1].ps?.length >= 2 &&
        //   message[1].cmd === 602
        // ) {
        // caller === state.initialRoom.owner &&
        //   setState((pre) => {
        //     return {
        //       ...pre,
        //       initialRoom: {
        //         ...pre.initialRoom,
        //         cardGame: [
        //           ...pre.initialRoom.cardGame,
        //           getCardsArray(message[1].ps),
        //         ],
        //       },
        //     };
        //   });
        // setUser((pre) => ({ ...pre, status: BotStatus.Submitted }));
        // returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        setUser((pre) => ({ ...pre, status: BotStatus.Joined }));
        !state.initialRoom.owner &&
          setState((pre) => ({
            ...pre,
            initialRoom: {
              ...pre.initialRoom,
              owner: caller,
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
        // setUser((pre) => ({ ...pre, status: BotStatus.Left }));
        // setState((pre) => ({
        //   ...pre,
        //   initialRoom: {
        //     ...pre.initialRoom,
        //     id: undefined,
        //     players: [...pre.initialRoom.players].slice(0, -1),
        //   },
        //   shouldRecreateRoom:
        //     !state.foundAt &&
        //     caller === pre.initialRoom.owner &&
        //     isAllCrawLeft(state.crawingRoom)
        //       ? true
        //       : false,
        // }));
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
