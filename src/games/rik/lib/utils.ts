import { Dispatch, SetStateAction } from 'react';
import { BotStatus, StateProps } from '../../../renderer/providers/app';

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
        setState((pre) => {
          const curStatus = pre.mainBots[caller]?.status;
          const newStatus = {
            status: !curStatus ? BotStatus.Connected : curStatus,
          };
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: newStatus,
            },
          };
        });
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
        setState((pre) => {
          const newStatus = { status: BotStatus.Received };
          return {
            ...pre,
            initialRoom: {
              ...pre.initialRoom,
              cardDesk: {
                ...(pre.initialRoom?.cardDesk ?? {}),
                [caller]: message[1].cs,
              },
            },
            mainBots: {
              ...pre.mainBots,
              [caller]: newStatus,
            },
          };
        });
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1].cmd === 603 && message[1].iar === true) {
        setState((pre) => {
          const newStatus = {
            status: BotStatus.Submitted,
          };
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: newStatus,
            },
          };
        });
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        let currentPlayers;
        const newStatus = { status: BotStatus.Joined };
        setState((pre) => {
          currentPlayers = pre.initialRoom.players + 1;
          returnMsg = `Joined room ${message[3]} (room now has ${currentPlayers} players)`;
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: newStatus,
            },
            initialRoom: {
              ...pre.initialRoom,
              players: currentPlayers,
            },
          };
        });
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setState((pre) => {
          const newStatus = {
            status: BotStatus.Left,
          };
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: newStatus,
            },
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

const defaultRoom = {
  hostStatus: BotStatus.Connected,
  guessStatus: BotStatus.Connected,
  players: 0,
  cardDesk: {},
  shouldOutVote: 0,
};

interface HandleCRMessageCrawingProps {
  message: any;
  setState: Dispatch<SetStateAction<StateProps>>;
  caller: string;
  coupleId: string;
}

export function handleMessageCrawing({
  message,
  setState,
  caller,
  coupleId,
}: HandleCRMessageCrawingProps) {
  let returnMsg;

  switch (message[0]) {
    case 5:
      if (message[1].rs) {
        setState((pre) => {
          const curStatus = pre.crawingBots[caller]?.status;
          const newStatus = {
            status: !curStatus ? BotStatus.Connected : curStatus,
          };
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: newStatus,
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
      } else if (message[1]?.cs?.length > 0) {
        setState((pre) => {
          const currentRoom = pre.crawingRoom[coupleId];
          const newStatus = {
            status: BotStatus.Received,
          };
          return {
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: {
                ...currentRoom,
                cardDesk: {
                  ...(currentRoom.cardDesk ?? {}),
                  [caller]: message[1].cs,
                },
              },
            },
            crawingBots: {
              ...pre.crawingBots,
              [caller]: newStatus,
            },
          };
        });

        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1].cmd === 603 && message[1].iar === true) {
        //[5,{"uid":"29_24437429","cmd":603,"iar":true}]
        setState((pre) => {
          const newStatus = {
            status: BotStatus.Submitted,
          };
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: newStatus,
            },
          };
        });
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Host join room response
        let currentPlayers;
        setState((pre) => {
          const newStatus = { status: BotStatus.Joined };
          const currentRoom = pre.crawingRoom[coupleId];
          currentPlayers = currentRoom.players + 1;
          returnMsg = `Joined room ${message[3]} (room now has ${currentPlayers} players)`;
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: newStatus,
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
      }
      break;
    case 4:
      // Left room response
      if (message[1] === true) {
        setState((pre) => {
          const newStatus = {
            status: BotStatus.Left,
          };
          const initRoom = pre.initialRoom;
          const outVote = initRoom.shouldOutVote + 1;
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: newStatus,
            },
            initialRoom: {
              ...initRoom,
              shouldOutVote: outVote,
            },
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

export const isFoundCards = (
  desk1: { [key: string]: number[] },
  desk2: { [key: string]: number[] }
) => {
  const cardDesk1 = Object.values(desk1);
  const cardDesk2 = Object.values(desk2);
  if (cardDesk1.length < 2 || cardDesk2.length < 2) {
    return false;
  }

  const isFound1 =
    JSON.stringify(cardDesk1[0]) === JSON.stringify(cardDesk2[0]) ||
    JSON.stringify(cardDesk1[0]) === JSON.stringify(cardDesk2[1]);
  const isFound2 =
    JSON.stringify(cardDesk1[1]) === JSON.stringify(cardDesk2[0]) ||
    JSON.stringify(cardDesk1[1]) === JSON.stringify(cardDesk2[1]);
  return isFound1 && isFound2;
};
