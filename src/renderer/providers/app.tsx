import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

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
  cardDesk: any;
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
  currentGame?: number;
}

export const defaultState = {
  initialRoom: {
    players: [],
    cardGame: [],
    shouldOutVote: 0,
    isFinish: false,
    isHostReady: false,
  },
  mainBots: {},
  crawingRoom: {},
  crawingBots: {},
  waiterBots: {},
  shouldRecreateRoom: false,
};

interface AppContextProps {
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
}

export const AppContext = createContext<any>({
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
    },
    mainBots: {},
    crawingRoom: {},
    crawingBots: {},
    waiterBots: {},
    shouldRecreateRoom: false,
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
