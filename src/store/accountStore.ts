import create from 'zustand';
import { devtools } from 'zustand/middleware';

const useAccountStore = create<any>(
  devtools(
    (set) => ({
      accounts: { MAIN: [], SUB: [], BOT: [] },
      addAccount: (type: string | number, account: any) =>
        set((state: { accounts: { [x: string]: any } }) => ({
          accounts: {
            ...state.accounts,
            [type]: state.accounts[type]
              ? [...state.accounts[type], account]
              : [account],
          },
        })),
      clearAccounts: () =>
        set(() => ({
          accounts: {},
        })),
      updateAccount: (type: string | number, username: any, updates: any) =>
        set((state: { accounts: { [x: string]: any[] } }) => ({
          accounts: {
            ...state.accounts,
            [type]: state.accounts[type].map((acc) =>
              acc.username === username ? { ...acc, ...updates } : acc
            ),
          },
        })),
      removeAccount: (type: string | number, username: any) =>
        set((state: { accounts: { [x: string]: any[] } }) => ({
          accounts: {
            ...state.accounts,
            [type]: state.accounts[type].filter(
              (account) => account.username !== username
            ),
          },
        })),
    }),
    {
      name: 'account-store',
    }
  )
);

export default useAccountStore;
