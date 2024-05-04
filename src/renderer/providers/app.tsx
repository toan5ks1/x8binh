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
  shouldOutVote: number;
  isFinish: boolean;
  isHostReady: boolean;
  isSubJoin?: boolean;
  roomType: number;
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
}

export const defaultState = {
  initialRoom: {
    players: [],
    cardGame: [],
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
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
