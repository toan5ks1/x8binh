import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function handleStartGame(message: any) {
  const gameData = message.M?.[0]?.A?.[0];
  let myID = gameData.OwnerID;
  console.log('Data', gameData);

  for (const [key, value] of Object.entries(gameData.Players)) {
    if (value['BaiRac'][0].OrdinalValue !== -1) {
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

export function handleMessage(message: any) {
  const messageType = message.M?.[0]?.M;
  let returnMsg;

  switch (messageType) {
    case ServerMessageType.JoinGame:
      returnMsg = handleJoinGame(message);
      break;

    case ServerMessageType.StartGame:
      returnMsg = handleStartGame(message);
      break;

    case ServerMessageType.PlayerLeave:
      returnMsg = handleLeaveGame(message);
      break;

    case ServerMessageType.StartActionTimer:
      returnMsg = handleStartActionTimer(message);
      break;
    default:
      break;
    // console.log('Unknown message type', messageType);
  }

  if (message === ServerMessageType.RegisterLeaveRoom) {
    returnMsg = 'Bot register leave room';
  }

  return returnMsg;
}
