import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { GameCard, StateProps } from '../renderer/providers/app';
import { roomTypes } from './config';

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

export const defaultRoom = {
  players: [],
  cardDesk: [],
  cardGame: [],
  shouldOutVote: 0,
  isFinish: false,
  isHostReady: false,
  roomType: roomTypes[0],
};

export const isAllCrawLeft = (rooms: StateProps['crawingRoom']) => {
  const isNotLeft = Object.values(rooms).find(
    (room) => room.players.length > 0
  );
  return !isNotLeft;
};

export const getCardsArray = (ps: any) => {
  return ps.map((item: any) => ({ cs: item.cs, dn: item.dn }));
};

export const isFoundCards = (
  cardPlayer1: GameCard[],
  cardPlayer2: GameCard[]
) => {
  if (cardPlayer1.length < 2 || cardPlayer2.length < 2) {
    return false;
  }

  const isFound1 =
    JSON.stringify(cardPlayer1[0].cs) === JSON.stringify(cardPlayer2[0].cs) ||
    JSON.stringify(cardPlayer1[0].cs) === JSON.stringify(cardPlayer2[1].cs);
  const isFound2 =
    JSON.stringify(cardPlayer1[1].cs) === JSON.stringify(cardPlayer2[0].cs) ||
    JSON.stringify(cardPlayer1[1].cs) === JSON.stringify(cardPlayer2[1].cs);

  return isFound1 && isFound2;
};

export const isAllHostReady = (state: StateProps) => {
  let isAllHostReady = state.initialRoom.isHostReady;
  Object.values(state.crawingRoom).forEach((room) => {
    if (!room.isHostReady) {
      isAllHostReady = false;
    }
  });

  return isAllHostReady;
};

export const amIPlaying = (ps: any[], username: string) => {
  const isPlaying = ps.find((obj) => obj.dn === username);
  return isPlaying;
};

export function areArraysEqual(arr1: number[], arr2: number[]) {
  // Check if the lengths of the arrays are equal
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort both arrays
  const arr1Sorted = arr1.slice().sort();
  const arr2Sorted = arr2.slice().sort();

  // Compare sorted arrays element-wise
  for (let i = 0; i < arr1.length; i++) {
    if (arr1Sorted[i] !== arr2Sorted[i]) {
      return false;
    }
  }

  return true;
}
