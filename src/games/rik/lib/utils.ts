import { Dispatch, SetStateAction } from 'react';
import {
  BotStatus,
  GameCard,
  StateProps,
} from '../../../renderer/providers/app';
import { LoginResponseDto } from './login';

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
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  user: LoginResponseDto;
}

export function handleMessage({
  message,
  state,
  setState,
  user,
}: HandleCRMessageProps) {
  let returnMsg;
  const { username: caller, fullname } = user;

  switch (message[0]) {
    case 5:
      const botStatus = state.mainBots[caller]?.status;
      if (message[1].rs && !botStatus) {
        setState((pre) => {
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.Connected,
              },
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
        setState((pre) => ({
          ...pre,
          mainBots: {
            ...pre.mainBots,
            [caller]: { status: BotStatus.Ready },
          },
        }));
      } else if (message[1]?.cs?.length > 0) {
        setState((pre) => {
          return {
            ...pre,
            initialRoom: {
              ...pre.initialRoom,
              cardDesk: insertReceivedCards(
                pre.initialRoom.cardDesk,
                caller,
                message[1].cs
              ),
              isFinish: false,
            },
            mainBots: {
              ...pre.mainBots,
              [caller]: { status: BotStatus.Received },
            },
          };
        });
        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setState((pre) => {
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.Finished,
              },
            },
            initialRoom: {
              ...pre.initialRoom,
              isFinish: true,
            },
          };
        });
        returnMsg = 'Game finished!';
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2
      ) {
        setState((pre) => {
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.Submitted,
              },
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
          currentPlayers = [...pre.initialRoom.players, caller];
          returnMsg = `Joined room ${message[3]} (room now has ${currentPlayers.length} players)`;
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: { status: BotStatus.Joined },
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
          return {
            ...pre,
            mainBots: {
              ...pre.mainBots,
              [caller]: {
                status: BotStatus.Left,
              },
            },
            shouldRecreateRoom: true,
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
  players: [],
  cardDesk: [],
  shouldOutVote: 0,
};

interface HandleCRMessageCrawingProps {
  message: any;
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  user: LoginResponseDto;
  coupleId: string;
}

export function handleMessageCrawing({
  message,
  state,
  setState,
  user,
  coupleId,
}: HandleCRMessageCrawingProps) {
  const { username: caller, fullname } = user;
  let returnMsg;

  switch (message[0]) {
    case 5:
      const botStatus = state.crawingBots[caller]?.status;
      if (message[1].rs && !botStatus) {
        setState((pre) => {
          // const curStatus = pre.crawingBots[caller]?.status;
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.Connected,
              },
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
      } else if (
        message[1]?.c === 100 ||
        (message[1]?.cmd === 5 && message[1]?.dn === fullname)
      ) {
        setState((pre) => ({
          ...pre,
          crawingBots: {
            ...pre.crawingBots,
            [caller]: { status: BotStatus.Ready },
          },
        }));
      } else if (message[1]?.cs?.length > 0) {
        setState((pre) => {
          const currentRoom = pre.crawingRoom[coupleId];
          return {
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: {
                ...currentRoom,
                cardDesk: insertReceivedCards(
                  currentRoom.cardDesk,
                  caller,
                  message[1].cs
                ),
                isFinish: false,
              },
            },
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.Received,
              },
            },
          };
        });

        returnMsg = `Card received: ${message[1].cs}`;
      } else if (message[1]?.ps?.length >= 2 && message[1]?.cmd === 205) {
        setState((pre) => {
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.PreFinished,
              },
            },
            // crawingRoom: {
            //   ...pre.crawingRoom,
            //   [coupleId]: {
            //     ...pre.crawingRoom[coupleId],
            //     isFinish: true,
            //   },
            // },
          };
        });
        returnMsg = 'Game pre finished!';
      } else if (
        message[1]?.cmd === 204 &&
        state.crawingBots[caller]?.status === BotStatus.PreFinished
      ) {
        setState((pre) => {
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.Finished,
              },
            },
            crawingRoom: {
              ...pre.crawingRoom,
              [coupleId]: {
                ...pre.crawingRoom[coupleId],
                isFinish: true,
              },
            },
          };
        });
        returnMsg = 'Game finished!';
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2
      ) {
        setState((pre) => {
          return {
            ...pre,
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.Submitted,
              },
            },
          };
        });
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
              crawingBots: {
                ...pre.crawingBots,
                [caller]: { status: BotStatus.Joined },
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
            crawingBots: {
              ...pre.crawingBots,
              [caller]: {
                status: BotStatus.Left,
              },
            },
            initialRoom: {
              ...initRoom,
              shouldOutVote: outVote,
            },
            shouldRecreateRoom: false,
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

interface HandleMessageWaiterProps {
  message: any;
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  user: LoginResponseDto;
  setUser: Dispatch<React.SetStateAction<LoginResponseDto>>;
}

export function handleMessageWaiter({
  message,
  state,
  setState,
  user,
  setUser,
}: HandleMessageWaiterProps) {
  const { username: caller, fullname } = user;
  let returnMsg;

  switch (message[0]) {
    case 5:
      if (message[1].rs && !user.status) {
        // setUser((pre) => ({ ...pre, status: BotStatus.Connected }));
        returnMsg = 'Join Maubinh sucessfully!';
      } else if (
        message[1]?.c === 100 ||
        (message[1]?.cmd === 5 && message[1]?.dn === fullname)
      ) {
        setUser((pre) => ({ ...pre, status: BotStatus.Ready }));
      } else if (message[1]?.cs?.length > 0 && state.foundBy) {
        setState((pre) => {
          const currentRoom = pre.crawingRoom[pre.foundBy!];
          return {
            ...pre,
            crawingRoom: {
              ...pre.crawingRoom,
              [pre.foundBy!]: {
                ...currentRoom,
                cardDesk: insertReceivedCards(
                  currentRoom.cardDesk,
                  caller,
                  message[1].cs
                ),
              },
            },
          };
        });
        setUser((pre) => ({ ...pre, status: BotStatus.Received }));

        returnMsg = `Card received: ${message[1].cs}`;
      } else if (
        (message[1].hsl === false || message[1].hsl === true) &&
        message[1].ps?.length >= 2
      ) {
        const isPlaying = amIPlaying(message[1].ps, user.fullname);
        setUser((pre) => ({
          ...pre,
          status: isPlaying ? BotStatus.Submitted : pre.status,
        }));
        returnMsg = 'Cards submitted!';
      }
      break;
    case 3:
      if (message[1] === true) {
        // Join room response
        if (state.foundBy) {
          const currentRoom = state.crawingRoom[state.foundBy];
          const currentPlayers = [...currentRoom.players, caller];

          setState((pre) => {
            return {
              ...pre,
              crawingRoom: {
                ...pre.crawingRoom,
                [state.foundBy!]: {
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
          return {
            ...pre,
            waiterBots: {
              ...pre.waiterBots,
              [caller]: {
                status: BotStatus.Left,
              },
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

const insertReceivedCards = (
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

const amIPlaying = (ps: any[], username: string) => {
  const isPlaying = ps.find((obj) => obj.dn === username);
  return isPlaying;
};

// [5,{"ps":[{"uid":"29_24608219","m":43974},{"uid":"29_24437435","m":30449}],"cmd":205}]
// [5,{"uid":"29_24608219","dn":"Abalaha","cmd":5}]
