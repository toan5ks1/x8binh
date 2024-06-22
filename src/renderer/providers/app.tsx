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
  cardGame: GameCard[][];
  isFinish?: boolean;
  isPrefinish?: boolean;
  isSubJoin?: boolean;
  targetCard?: number[];
  isNotFound?: boolean;
  isHostOut?: boolean;
  isGuessOut?: boolean;
  isHostReady?: boolean;
  isGuessReady?: boolean;
  isGuessJoin?: boolean;
  isHostJoin?: boolean;
  shouldGuessJoin?: boolean;
  shouldHostReady?: boolean;
  isSubmitCard?: boolean;
  findRoomDone?: boolean;
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
  shouldReconnect?: boolean;
  shouldRefresh?: boolean;
  roomType: number;
  loggedAccount: string[];
  isCheckDone?: boolean;
}

export interface GameStatus {
  isCrawing?: boolean;
  isPaused?: boolean;
}

export const defaultState = {
  currentGame: { number: 0, sheet: {} },
  recreateTime: 0,
  roomType: roomTypes[0],
  loggedAccount: [] as string[],
};

interface AppContextProps {
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
  gameStatus: GameStatus;
  setGameStatus: Dispatch<SetStateAction<GameStatus>>;
  initialRoom: Room;
  setInitialRoom: Dispatch<SetStateAction<Room>>;
  crawingRoom: Room;
  setCrawingRoom: Dispatch<SetStateAction<Room>>;
  recreateTime: number;
  tobeRecreateRoom: () => void;
}

export const AppContext = createContext<AppContextProps>({
  state: defaultState,
  gameStatus: {},
  initialRoom: defaultRoom,
  crawingRoom: defaultRoom,
  recreateTime: 0,
  setState: () => {},
  setGameStatus: () => {},
  setInitialRoom: () => {},
  setCrawingRoom: () => {},
  tobeRecreateRoom: () => {},
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState(defaultState);
  const [gameStatus, setGameStatus] = useState({});
  const [initialRoom, setInitialRoom] = useState(defaultRoom);
  const [crawingRoom, setCrawingRoom] = useState(defaultRoom);
  const [recreateTime, setRecreateTime] = useState(0);
  const tobeRecreateRoom = () => setRecreateTime((pre) => pre + 1);

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        gameStatus,
        setGameStatus,
        initialRoom,
        setInitialRoom,
        crawingRoom,
        setCrawingRoom,
        recreateTime,
        tobeRecreateRoom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
