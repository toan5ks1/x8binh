import { Dispatch, SetStateAction } from 'react';
import { SendMessage } from 'react-use-websocket';
import { Room, StateProps } from '../../renderer/providers/app';
import { binhlung } from '../binhlung';
import { LoginResponseDto } from '../login';
import { defaultRoom, findPosition, updateCardGame } from '../utils';

interface HandleCRMessageProps {
  message: any;
  initialRoom: Room;
  crawingRoom: Room;
  setInitialRoom: Dispatch<SetStateAction<Room>>;
  setCrawingRoom: Dispatch<SetStateAction<Room>>;
  sendMessage: SendMessage;
  user: LoginResponseDto;
  setUser: Dispatch<React.SetStateAction<LoginResponseDto | undefined>>;
  state: StateProps;
}

export function handleMessageSubHost({
  message,
  initialRoom,
  setInitialRoom,
  setCrawingRoom,
  sendMessage,
  state,
  user,
  setUser,
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
      if (message[1]?.cmd === 100 && message[1].uid) {
        setUser((pre) => ({ ...pre, uid: message[1].uid }));
      } else if (message[1]?.cmd === 5 && message[1]?.dn === fullname) {
        setInitialRoom((pre) => ({
          ...pre,
          isHostJoin: false,
          isHostReady: true,
        }));
      } else if (message[1].cmd === 308) {
        // Create room response
        if (message[1].ri) {
          const roomId = message[1]?.ri?.rid;

          setInitialRoom({
            ...defaultRoom,
            id: roomId as number,
          });
          // Host join
          sendMessage(`[3,"Simms",${roomId},""]`);

          returnMsg = `Created room ${roomId}`;
        } else if (message[1].mgs) {
          returnMsg = message[1].mgs;
        }
      } else if (message[1]?.cs?.length > 0 && message[1]?.lpi?.length > 0) {
        const idxToAdd = findPosition(message[1].lpi, user.uid);
        !state.foundAt
          ? setInitialRoom((pre) => ({
              ...pre,
              isFinish: false,
              cardGame: updateCardGame(
                pre.cardGame,
                {
                  cs: message[1].cs,
                  dn: 'host',
                },
                idxToAdd
              ),
            }))
          : setCrawingRoom((pre) => ({
              ...pre,
              cardGame: updateCardGame(
                pre.cardGame,
                {
                  cs: message[1].cs,
                  dn: 'guess',
                },
                idxToAdd
              ),
            }));
        // Submit cards
        sendMessage(
          `[5,"Simms",${
            state?.foundAt ?? initialRoom.id
          },{"cmd":603,"cs":[${binhlung(message[1].cs)}]}]`
        );

        returnMsg =
          idxToAdd >= 0
            ? `Card received: ${message[1].cs}`
            : 'Error when save card';
        // } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
      } else if (message[1]?.cmd === 603 && message[1]?.iar === true) {
        setInitialRoom((pre) => ({ ...pre, isPrefinish: true }));
      } else if (message[1]?.cmd === 204 && initialRoom.isPrefinish) {
        setInitialRoom((pre) => ({
          ...pre,
          isPrefinish: false,
          isFinish: true,
        }));
        returnMsg = 'Game finished!';
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2 &&
        message[1].cmd === 602
      ) {
        setInitialRoom((pre) => {
          return {
            ...pre,
            isSubmitCard: true,
            isGuessReady: false,
            isHostReady: false,
          };
        });

        returnMsg = 'Cards saved!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        setInitialRoom((pre) => ({
          ...pre,
          shouldGuessJoin: true,
          isHostOut: false,
          isHostJoin: true,
        }));

        returnMsg = `Joined room ${message[3]}`;
      } else if (message[1] === false) {
        returnMsg = `${message[4]}`;
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setInitialRoom((pre) => ({
          ...pre,
          isHostOut: true,
        }));

        returnMsg = message[5] || 'Left room successfully!';
      } else {
        returnMsg = message[5] || 'Left room failed!';
      }
      break;
    default:
      break;
  }

  return returnMsg;
}
