import { debounce, now } from 'lodash';
import { Paperclip, Share } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LoginParams, accountLogin } from '../../lib/login';
import useAccountStore from '../../store/accountStore';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
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
  placeholder,
}) => {
  const [textareaValue, setTextareaValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { accounts, addAccount, updateAccount } = useAccountStore();

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

  const updateFile = useCallback(
    debounce((text) => {
      console.log('update file');
      window.backend.sendMessage(
        'update-file',
        text,
        [`account/${accountType.toLowerCase()}Account.txt`],
        accountType
      );
      const accountsAfterRead = readValidAccount(text);
      accountsAfterRead.forEach(async (newAccount) => {
        const existingAccountIndex = accounts[accountType].findIndex(
          (acc: { username: string }) => acc.username === newAccount.username
        );

        if (existingAccountIndex !== -1) {
          updateAccount(accountType, newAccount.username, {
            isSelected: newAccount.isSelected,
          });
        } else {
          let additionalData = {};
          if (newAccount.isSelected) {
            const data = (await accountLogin(newAccount)) as any;
            const cash = Array.isArray(data?.data)
              ? data?.data[0].main_balance
              : 0;
            additionalData = { main_balance: cash };
          }
          addAccount(accountType, {
            ...newAccount,
            ...additionalData,
          });
        }
      });
    }, 1500),
    [accountType, accounts, addAccount, updateAccount]
  );

  const handleTextAreaChange = (e: { target: { value: any } }) => {
    const text = e.target.value;
    setTextareaValue(text);
  };

  useEffect(() => {
    if (!isEditing) {
      const newTextareaValue = accounts[accountType]
        .map((account: { username: any; password: any; isSelected: any }) => {
          return `${account.username}|${account.password}|${account.isSelected}`;
        })
        .join('\n');

      setTextareaValue(newTextareaValue);
    }
  }, [accounts]);

  useEffect(() => {
    const handleFileData = (data: any, accountTypeReceived: any) => {
      if (accountTypeReceived == accountType) {
        const newAccounts = readValidAccount(data);

        newAccounts.map(async (account: LoginParams) => {
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
            return account;
          }
        });
        if (JSON.stringify(accountType) !== JSON.stringify(newAccounts)) {
          setTextareaValue(data.trim());
        }
      }
    };
    window.backend.on('read-file', handleFileData);
    window.backend.sendMessage(
      'read-file',
      [`account/${accountType.toLowerCase()}Account.txt`],
      accountType
    );

    return () => {
      window.backend.removeListener('read-file', handleFileData);
    };
  }, []);

  useEffect(() => {
    updateFile(textareaValue);
  }, [textareaValue]);

  return (
    <div className="relative hidden flex-col items-start gap-8 md:flex h-full">
      <form className="grid w-full h-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4 h-full">
          <legend className="-ml-1 px-1 text-sm font-medium">
            {accountType} account
          </legend>
          <div className="grid gap-3">
            <Label htmlFor={`${accountType}-account`}>Accounts</Label>
            <AccountTable accountType={accountType} />
            <Textarea
              id={`${accountType}-account`}
              placeholder={placeholder}
              className="min-h-[9.5rem]"
              value={textareaValue}
              onChange={(e) => {
                setIsEditing(true);
                handleTextAreaChange(e);
              }}
              onBlur={() => setIsEditing(false)}
            />
            <div className="flex items-center p-3 pt-0">
              <input
                type="file"
                accept=".txt"
                ref={fileInputRef}
                // onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Upload file for {accountType} account
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share className="size-4" />
                    <span className="sr-only">Use Microphone</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Use Microphone</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
