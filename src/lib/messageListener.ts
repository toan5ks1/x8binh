import { Dispatch, SetStateAction } from 'react';
import { StateProps } from '../renderer/providers/app';

export enum ServerMessageType {
  JoinGame = 'joinGame',
  StartActionTimer = 'startActionTimer',
  PlayerJoin = 'playerJoin',
  UpdateGameSession = 'updateGameSession',
  PlayerLeave = 'playerLeave',
  StartGame = 'startGame',
  ShowResult = 'showResult',
  RegisterLeaveRoom = 'RegisterLeaveRoom',
}

export function handleJoinGame(message: any) {
  const gameData = message.M?.[0]?.A?.[0];
  console.log('Handling join game with data', gameData);

  const targetRoom = localStorage.getItem(gameData.SessionID);

  localStorage.setItem(
    gameData.SessionID,
    targetRoom + `${gameData.SessionID};`
  );

  return `Bot join room ${gameData.SessionID}`;
}

export function handleLeaveGame(message: any) {
  const gameData = message.M?.[0]?.A?.[0];
  console.log('Handling join game with data', gameData);

  return 'Bot left room';
}

interface Player {
  BaiRac: { OrdinalValue: number }[];
  // Other properties
}

interface Players {
  [key: string]: Player;
}

export function handleStartGame(message: any) {
  const gameData = message.M?.[0]?.A?.[0];
  let myID = gameData.OwnerID;
  console.log('Data', gameData);

  for (const [key, value] of Object.entries<Players>(gameData.Players)) {
    if (
      Array.isArray(value['BaiRac']) &&
      value['BaiRac'].length > 0 &&
      value['BaiRac'][0].OrdinalValue !== -1
    ) {
      myID = key;
    }
  }

  const baiRac = gameData.Players[myID]['BaiRac'];
  const cards = baiRac.map((item: any) => item.OrdinalValue);

  return 'Tra bai: ' + cards.toString();
}

export function handleStartActionTimer(message: any) {
  const timerData = message.M?.[0]?.A;
  console.log('Handling start action timer with data', timerData);
  return timerData;
}

interface HandleCRMessageProps {
  message: any;
  setState: Dispatch<SetStateAction<StateProps>>;
  caller: string;
}

export function handleMessage({
  message,
  setState,
  caller,
}: HandleCRMessageProps) {
  let returnMsg;

  switch (message[0]) {
    case 5:
      if (message[1].rs) {
        returnMsg = 'Join Maubinh sucessfully!';
      } else if (message[1].ri) {
        // Create room response
        const roomId = message[1]?.ri?.rid;

        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...pre.initialRoom,
            id: roomId as number,
            owner: caller,
          },
        }));
        returnMsg = `Created room ${roomId}`;
      } else if (message[1]?.cs?.length > 0) {
        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...pre.initialRoom,
            cardDesk: {
              ...(pre.initialRoom?.cardDesk ?? {}),
              [caller]: message[1].cs,
            },
          },
        }));
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1].cmd === 603 && message[1].iar === true) {
        //[5,{"uid":"29_24437429","cmd":603,"iar":true}]
        setState((pre) => ({
          ...pre,
          initialRoom: {
            ...pre.initialRoom,
            cardDesk: {
              ...(pre.initialRoom?.cardDesk ?? {}),
              [caller]: message[1].cs,
            },
          },
        }));
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        let currentPlayers;
        setState((pre) => {
          currentPlayers = pre.initialRoom.players + 1;
          return {
            ...pre,
            initialRoom: {
              ...pre.initialRoom,
              players: currentPlayers,
            },
          };
        });
        returnMsg = `Joined room ${message[3]} (room now has ${currentPlayers} players)`;
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
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
