import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { roomTypes } from '../../lib/config';

interface AppProviderProps {
  children: ReactNode;
}

export enum BotStatus {
  Initialized = 'INITIALIZED',
  Connected = 'CONNECTED',
  Finding = 'Finding',
  Joined = 'JOINED',
  Ready = 'READY',
  Received = 'RECEIVED',
  Submitted = 'SUBMITTED',
  PreFinished = 'PREFINISHED',
  Finished = 'FINISHED',
  Left = 'LEFT',
  Reconnect = 'RECONNECT',
}

export interface GameState {
  number: number;
  sheet: {
    [key: string]: string;
  };
}

export interface GameCard {
  cs: number[];
  dn: string;
}

export interface Room {
  id?: number;
  owner?: string;
  players: string[];
  cardGame: GameCard[][];
  cardDesk: number[][];
  shouldOutVote: number;
  isFinish: boolean;
  isHostReady: boolean;
  isSubJoin?: boolean;
  roomType: number;
  targetCard?: number[];
  isChecked?: boolean;
}

export interface StateProps {
  initialRoom: Room;
  crawingRoom: {
    [key: string]: Room;
  };
  crawingBots: {
    [key: string]: {
      status: BotStatus;
    };
  };
  mainBots: {
    [key: string]: {
      status: BotStatus;
    };
  };
  waiterBots: {
    [key: string]: {
      status: BotStatus;
    };
  };
  foundAt?: number;
  targetAt?: number;
  foundBy?: string;
  shouldRecreateRoom: boolean;
  currentGame: GameState;
  isLoggedIn?: boolean;
  isQuited?: boolean;
  activeMain?: string;
  shouldDisconnect?: boolean;
  shouldReconnect?: boolean;
  isNotFound?: boolean;
  readyHost: number;
}

export const defaultState = {
  initialRoom: {
    players: [],
    cardGame: [],
    cardDesk: [],
    shouldOutVote: 0,
    isFinish: false,
    isHostReady: false,
    roomType: roomTypes[0],
  },
  mainBots: {},
  crawingRoom: {},
  crawingBots: {},
  waiterBots: {},
  currentGame: { number: 0, sheet: {} },
  shouldRecreateRoom: false,
  readyHost: 0,
};

interface AppContextProps {
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
}

export const AppContext = createContext<AppContextProps>({
  state: defaultState,
  setState: () => {},
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState({
    initialRoom: {
      players: [] as string[],
      cardGame: [] as GameCard[][],
      cardDesk: [] as number[][],
      shouldOutVote: 0,
      isFinish: false,
      isHostReady: false,
      roomType: roomTypes[0],
    },
    mainBots: {},
    crawingRoom: {},
    crawingBots: {},
    waiterBots: {},
    currentGame: { number: 0, sheet: {} },
    shouldRecreateRoom: false,
    readyHost: 0,
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
