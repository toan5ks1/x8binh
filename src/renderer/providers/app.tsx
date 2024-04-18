import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { AccountProvider } from '../../context/AccountContext';
interface AppProviderProps {
  children: ReactNode;
}

export interface StateProps {
  initialRoom: {
    id?: number;
    owner?: string;
    players: number;
    cardDesk: {
      [key: string]: number[];
    };
  };
}

interface AppContextProps {
  state: StateProps;
  setState: Dispatch<SetStateAction<StateProps>>;
}

export const AppContext = createContext<AppContextProps>({
  state: { initialRoom: { players: 0, cardDesk: {} } },
  setState: () => {},
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState({
    initialRoom: { players: 0, cardDesk: {} },
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      <AccountProvider>{children}</AccountProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;
