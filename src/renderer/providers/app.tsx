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

interface AppContextProps {
  state: Object;
  setState: Dispatch<SetStateAction<Object>>;
}

export const AppContext = createContext<AppContextProps>({
  state: {},
  setState: () => {},
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState({});

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
