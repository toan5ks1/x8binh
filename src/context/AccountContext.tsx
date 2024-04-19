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
  isSelected: boolean;
  info?: any;
  main_balance?: any;
};

type Action =
  | {
      type: 'UPDATE_ACCOUNTS';
      accountType: keyof typeof AccountType;
      payload: AccountDetails[];
    }
  | {
      type: 'UPDATE_ACCOUNT_INFO';
      accountType: keyof typeof AccountType;
      username: string;
      main_balance?: number;
    }
  | {
      type: 'DELETE_ACCOUNT';
      accountType: keyof typeof AccountType;
      index: number;
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
  { state: any; dispatch: Dispatch } | undefined
>(undefined);

function accountReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_ACCOUNTS':
      return {
        ...state,
        [action.accountType]: action.payload,
      };
    case 'UPDATE_ACCOUNT_INFO':
      const updatedAccountsInfo = state[action.accountType]?.map((account) =>
        account.username === action.username
          ? { ...account, main_balance: action?.main_balance }
          : account
      );
      return {
        ...state,
        [action.accountType]: updatedAccountsInfo,
      };
    case 'DELETE_ACCOUNT':
      const remainingAccounts = state[action.accountType]?.filter(
        (_, index) => index !== action.index
      );
      return {
        ...state,
        [action.accountType]: remainingAccounts,
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
