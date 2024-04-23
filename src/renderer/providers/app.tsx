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
  [key: string]: number[];
}

export interface Room {
  id?: number;
  owner?: string;
  players: string[];
  cardDesk: GameCard[];
  shouldOutVote: number;
  isFinish?: boolean;
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
  foundBy?: string;
  shouldRecreateRoom: boolean;
}

interface AppContextProps {
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
}

export const AppContext = createContext<AppContextProps>({
  state: {
    initialRoom: {
      players: [],
      cardDesk: [],
      shouldOutVote: 0,
    },
    mainBots: {},
    crawingRoom: {},
    crawingBots: {},
    waiterBots: {},
    shouldRecreateRoom: false,
  },
  setState: () => {},
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState({
    initialRoom: {
      players: [] as string[],
      cardDesk: [] as GameCard[],
      shouldOutVote: 0,
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
