import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { gameList, roomTypes } from '../../lib/config';
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
  antiRoom?: number;
}

export interface GameStatus {
  isCrawing?: boolean;
  isPaused?: boolean;
}

export interface GameProps {
  name: string;
  loginToken: string;
  loginUrl: string;
  connectURL: string;
  web: string;
  info: string;
  load: string;
  loginUI: {
    loginBtnDir: string;
    usernameDir: string;
    passwordDir: string;
    confirmBtnDir: string;
  };
  usePw?: boolean;
  needJoinID?: boolean;
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
  game: GameProps;
  setGame: Dispatch<SetStateAction<GameProps>>;
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
  game: gameList[0],
  gameStatus: {},
  initialRoom: defaultRoom,
  crawingRoom: defaultRoom,
  recreateTime: 0,
  setState: () => {},
  setGame: () => {},
  setGameStatus: () => {},
  setInitialRoom: () => {},
  setCrawingRoom: () => {},
  tobeRecreateRoom: () => {},
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState(defaultState);
  const [game, setGame] = useState(gameList[0]);
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
        game,
        setGame,
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
