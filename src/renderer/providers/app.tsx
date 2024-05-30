import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { roomTypes } from '../../lib/config';
import { defaultRoom } from '../../lib/utils';

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
  Saved = 'SAVED',
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
  cardDesk: GameCard[];
  isFinish?: boolean;
  isPrefinish?: boolean;
  isSubJoin?: boolean;
  targetCard?: number[];
  isNotFound?: boolean;
  isHostOut?: boolean;
  isGuessOut?: boolean;
  isHostReady?: boolean;
  isGuessJoin?: boolean;
  isHostJoin?: boolean;
  shouldGuessJoin?: boolean;
  shouldHostReady?: boolean;
  shouldOut?: boolean;
}

export interface StateProps {
  foundAt?: number;
  targetAt?: number;
  recreateTime: number;
  currentGame: GameState;
  isLoggedIn?: boolean;
  isQuited?: boolean;
  activeMain?: string;
  shouldStopCrawing?: boolean;
  shouldDisconnect?: boolean;
  shouldRefresh?: boolean;
  roomType: number;
}

export const defaultState = {
  currentGame: { number: 0, sheet: {} },
  recreateTime: 0,
  roomType: roomTypes[0],
};

interface AppContextProps {
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  initialRoom: Room;
  setInitialRoom: Dispatch<SetStateAction<Room>>;
  crawingRoom: Room;
  setCrawingRoom: Dispatch<SetStateAction<Room>>;
  waiterRoom: Room;
  setWaiterRoom: Dispatch<SetStateAction<Room>>;
  recreateTime: number;
  tobeRecreateRoom: () => void;
}

export const AppContext = createContext<AppContextProps>({
  state: defaultState,
  initialRoom: defaultRoom,
  crawingRoom: defaultRoom,
  waiterRoom: defaultRoom,
  recreateTime: 0,
  setState: () => {},
  setInitialRoom: () => {},
  setCrawingRoom: () => {},
  setWaiterRoom: () => {},
  tobeRecreateRoom: () => {},
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState(defaultState);

  const [initialRoom, setInitialRoom] = useState(defaultRoom);
  const [crawingRoom, setCrawingRoom] = useState(defaultRoom);
  const [waiterRoom, setWaiterRoom] = useState(defaultRoom);
  const [recreateTime, setRecreateTime] = useState(0);
  const tobeRecreateRoom = () => setRecreateTime((pre) => pre + 1);

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        initialRoom,
        setInitialRoom,
        crawingRoom,
        setCrawingRoom,
        waiterRoom,
        setWaiterRoom,
        recreateTime,
        tobeRecreateRoom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
