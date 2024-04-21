import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from '../components/toast/use-toast';

const useAccountStore = create<any>(
  devtools(
    (set) => ({
      accounts: { MAIN: [], SUB: [], BOT: [] },
      addAccount: (type: string, account: any) =>
        set((state: { accounts: { [x: string]: any[] } }) => {
          const existingAccountIndex = state.accounts[type].findIndex(
            (acc) => acc.username === account.username
          );

          if (existingAccountIndex !== -1) {
            toast({
              title: 'Account already exited',
              description: `Username ${account.username} already exists.`,
            });
            return {};
          } else {
            return {
              accounts: {
                ...state.accounts,
                [type]: [...state.accounts[type], account],
              },
            };
          }
        }),
      clearAccounts: () =>
        set(() => ({
          accounts: { MAIN: [], SUB: [], BOT: [] },
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
