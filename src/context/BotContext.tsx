import React, { ReactNode, createContext, useContext, useReducer } from 'react';

export const loginUrl = 'https://bordergw.api-inovated.com/user/login.aspx';
export const hostWSS = 'wss://cardskgw.ryksockesg.net/websocket';

export type Bot = {
  username: string;
  password: string;
  app_id: string;
  os: string;
  device: string;
  browser: string;
  fg: string;
  time: number;
  aff_id: string;
};

type Action = { type: 'UPDATE_BOTS'; payload: Bot[] };

type BotState = Bot[];
type BotDispatch = (action: Action) => void;

export const BotContext = createContext<
  { state: BotState; dispatch: BotDispatch } | any
>(undefined);

function botReducer(state: BotState, action: Action): BotState {
  switch (action.type) {
    case 'UPDATE_BOTS':
      return action.payload;
    default:
      return state;
  }
}

type BotProviderProps = {
  children: ReactNode;
};

export const BotProvider: React.FC<BotProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(botReducer, []);

  return (
    <BotContext.Provider value={{ state, dispatch }}>
      {children}
    </BotContext.Provider>
  );
};

export function useBots() {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error('useBots must be used within a BotProvider');
  }
  return context;
}
