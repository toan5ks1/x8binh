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
  Left = 'LEFT',
}

interface Room {
  id?: number;
  owner?: string;
  players: number;
  cardDesk: {
    [key: string]: number[];
  };
  shouldOutVote: number;
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
  foundAt?: number;
  shouldRecreateRoom: boolean;
}

interface AppContextProps {
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
}

export const AppContext = createContext<AppContextProps>({
  state: {
    initialRoom: {
      players: 0,
      cardDesk: {},
      shouldOutVote: 0,
    },
    mainBots: {},
    crawingRoom: {},
    crawingBots: {},
    shouldRecreateRoom: false,
  },
  setState: () => {},
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState({
    initialRoom: {
      players: 0,
      cardDesk: {},
      shouldOutVote: 0,
    },
    mainBots: {},
    crawingRoom: {},
    crawingBots: {},
    shouldRecreateRoom: false,
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
