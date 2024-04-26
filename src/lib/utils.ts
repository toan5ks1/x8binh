import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { BotStatus, GameCard, StateProps } from '../renderer/providers/app';

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
  shouldOutVote: 0,
};

export const insertReceivedCards = (
  cardDesk: GameCard[],
  botId: string,
  cardToInsert: number[]
) => {
  const cardDeskClone = [...cardDesk];
  const lastGameIndex = cardDeskClone.length - 1; // Get the index of the last element
  let lastGame = cardDeskClone[lastGameIndex];

  if (lastGameIndex < 0 || Object.keys(lastGame)?.length === 4) {
    cardDeskClone.push({ [botId]: cardToInsert });
  } else if (
    Object.keys(cardDeskClone[0]).length === 2 &&
    lastGameIndex === 0
  ) {
    // Skip first game
    cardDeskClone.push({ [botId]: cardToInsert });
  } else {
    lastGame[botId] = cardToInsert;
  }

  return cardDeskClone;
};

export const isFoundCards = (cardPlayer1: GameCard, cardPlayer2: GameCard) => {
  if (
    Object.keys(cardPlayer1).length < 2 ||
    Object.keys(cardPlayer2).length < 2
  ) {
    return false;
  }

  const cardArray1 = Object.values(cardPlayer1);
  const cardArray2 = Object.values(cardPlayer2);

  const isFound1 =
    JSON.stringify(cardArray1[0]) === JSON.stringify(cardArray2[0]) ||
    JSON.stringify(cardArray1[0]) === JSON.stringify(cardArray2[1]);
  const isFound2 =
    JSON.stringify(cardArray1[1]) === JSON.stringify(cardArray2[0]) ||
    JSON.stringify(cardArray1[1]) === JSON.stringify(cardArray2[1]);

  return isFound1 && isFound2;
};

export const isAllHostReady = (state: StateProps) => {
  let isMainHostReady = true;
  let isCrawingHostReady = true;
  const allCrawingHost = Object.values(state.crawingRoom).map(
    (room) => room.owner
  );

  Object.entries(state.mainBots).forEach(([botId, bot]) => {
    if (botId === state.initialRoom.owner && bot.status !== BotStatus.Ready) {
      isMainHostReady = false;
    }
  });
  Object.entries(state.crawingBots).forEach(([botId, bot]) => {
    if (allCrawingHost.includes(botId) && bot.status !== BotStatus.Ready) {
      isCrawingHostReady = false;
    }
  });

  return isMainHostReady && isCrawingHostReady;
};

export const amIPlaying = (ps: any[], username: string) => {
  const isPlaying = ps.find((obj) => obj.dn === username);
  return isPlaying;
};

// [5,{"ps":[{"uid":"29_24608219","m":43974},{"uid":"29_24437435","m":30449}],"cmd":205}]
// [5,{"uid":"29_24608219","dn":"Abalaha","cmd":5}]
