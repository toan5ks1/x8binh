import { now } from 'lodash';
import { useEffect, useRef } from 'react';
import { accountLogin } from '../../lib/login';
import useAccountStore from '../../store/accountStore';
import { useToast } from '../toast/use-toast';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { AccountTable } from './accountTable';

export type AccountDetails = {
  username: string;
  password: string;
  app_id?: string;
  os?: string;
  device?: string;
  browser?: string;
  fg?: string;
  time?: number;
  aff_id?: string;
  isSelected: boolean;
  info?: any;
  main_balance?: any;
};

type State = {
  MAIN: AccountDetails[];
  SUB: AccountDetails[];
  BOT: AccountDetails[];
};

type AccountType = keyof State;

interface AccountSectionProps {
  accountType: AccountType;
  placeholder: string;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  accountType,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accounts, addAccount } = useAccountStore();
  const { toast } = useToast();

  const readValidAccount = (input: string): AccountDetails[] => {
    return input
      .split('\n')
      .map((line) => {
        const [username, password, IsSelected] = line.split('|');
        return {
          username,
          password: password || '',
          app_id: 'rik.vip',
          os: 'Windows',
          device: 'Computer',
          browser: 'chrome',
          fg: 'fea47ac6e0fd72cd768e977d51f3dc45',
          time: now(),
          aff_id: 'hit',
          isSelected: IsSelected === 'true',
        };
      })
      .filter((account) => account.username);
  };

  const accountExists = (newAccount: any) => {
    return accounts[accountType].some(
      (account: { username: any }) => account.username === newAccount.username
    );
  };

  const addUniqueAccounts = (newAccounts: any) => {
    newAccounts.forEach((account: { username: any }) => {
      if (!accountExists(account)) {
        addAccount(accountType, account);
      } else {
        toast({
          title: 'Warning',
          description: `Duplicate found: ${account.username} not added`,
        });
      }
    });
    toast({
      title: 'Task done',
      description: `All account was added`,
    });
  };

  const updateFile = async () => {
    const accountsUpdate = accounts[accountType];

    const accountsText = accountsUpdate
      .map(
        (account: { isSelected: any; username: any; password: any }) =>
          `${account.username}|${account.password}|${account.isSelected}`
      )
      .join('\n');

    window.backend.sendMessage(
      'update-file',
      accountsText,
      [`account/${accountType.toLowerCase()}Account.txt`],
      accountType
    );

    toast({
      title: 'Updated account',
      description: `All tasks done for ${accountType.toLowerCase()} account`,
    });
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      const newAccounts = readValidAccount(text);
      addUniqueAccounts(newAccounts);
    };
    reader.onerror = () => {
      toast({
        title: 'Error',
        description: `Failed to read file`,
      });
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const handleReadFile = (data: any, accountTypeReceived: any) => {
      if (accountTypeReceived == accountType) {
        const newAccounts = readValidAccount(data);

        newAccounts.map(async (account: any) => {
          try {
            var cash = 0;
            if (account.isSelected) {
              const data = (await accountLogin(account)) as any;
              cash = Array.isArray(data?.data) ? data?.data[0].main_balance : 0;
            }

            addAccount(accountType, {
              username: account.username,
              password: account.password,
              isSelected: account.isSelected,
              app_id: 'rik.vip',
              os: 'Windows',
              device: 'Computer',
              browser: 'chrome',
              fg: 'fea47ac6e0fd72cd768e977d51f3dc45',
              time: now(),
              aff_id: 'hit',
              main_balance: cash,
            });
          } catch (err) {
            console.error('Setup bot failed:', err);
          }
        });
      }
    };
    window.backend.on('read-file', handleReadFile);

    return () => {
      window.backend.removeListener('read-file', handleReadFile);
    };
  }, []);

  useEffect(() => {
    window.backend.sendMessage(
      'read-file',
      [
        // `C:/Users/PC/AppData/Local/Programs/electron-react-boilerplate/resources/account/${accountType.toLowerCase()}Account.txt`,
        `account/${accountType.toLowerCase()}Account.txt`,
      ],
      accountType
    );
  }, []);

  return (
    <div className="relative hidden flex-col items-start gap-8 md:flex h-full">
      <form className="grid w-full h-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4 h-full">
          <legend className="-ml-1 px-1 text-sm font-medium">
            {accountType} ACCOUNT
          </legend>
          <div className="flex flex-col gap-3">
            <Label htmlFor={`${accountType}-account`}>Accounts</Label>
            <ScrollArea
              className={` ${
                accountType == 'MAIN' ? '' : 'h-[450px]'
              } border-t`}
            >
              <AccountTable
                accountType={accountType}
                updateFile={updateFile}
                fileInputRef={fileInputRef}
              />
            </ScrollArea>
            <div className="flex items-center p-3 pt-0">
              <input
                type="file"
                accept=".txt"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
