import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export enum ServerMessageType {
  JoinGame = 'joinGame',
  StartActionTimer = 'startActionTimer',
  PlayerJoin = 'playerJoin',
  UpdateGameSession = 'updateGameSession',
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleJoinGame(message: any) {
  const gameData = message.M?.[0]?.A?.[0];
  console.log('Handling join game with data', gameData);
}

export function handleStartActionTimer(message: any) {
  const timerData = message.M?.[0]?.A;
  console.log('Handling start action timer with data', timerData);
}

export function handleMessage(message: any) {
  const messageType = message.M?.[0]?.M;
  switch (messageType) {
    case ServerMessageType.JoinGame:
      handleJoinGame(message);
      break;
    case ServerMessageType.StartActionTimer:
      handleStartActionTimer(message);
      break;
    default:
      console.log('Unknown message type', messageType);
  }
}
