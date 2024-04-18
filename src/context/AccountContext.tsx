import React, { createContext, useContext, useReducer } from 'react';

export const AccountType = {
  MAIN: 'MAIN',
  SUB: 'SUB',
  BOT: 'BOT',
};

export type AccountDetails = {
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

type Action = {
  type: 'UPDATE_ACCOUNTS';
  accountType: keyof typeof AccountType;
  payload: AccountDetails[];
};

type State = {
  [K in keyof typeof AccountType]?: AccountDetails[];
};

type Dispatch = (action: Action) => void;

const initialState: State = {
  MAIN: [],
  SUB: [],
  BOT: [],
};

const AccountContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function accountReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_ACCOUNTS':
      return {
        ...state,
        [action.accountType]: action.payload,
      };
    default:
      return state;
  }
}

type AccountProviderProps = {
  children: React.ReactNode;
};

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  return (
    <AccountContext.Provider value={{ state, dispatch }}>
      {children}
    </AccountContext.Provider>
  );
};

export function useAccounts() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
}
