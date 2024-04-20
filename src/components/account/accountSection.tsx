import { debounce, now } from 'lodash';
import { Paperclip, Share } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccountDetails, useAccounts } from '../../context/AccountContext';
import { LoginParams, accountLogin } from '../../lib/login';
import { AccountTable } from '../account/accountTable';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

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
  const { dispatch, state: accounts } = useAccounts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const hasLoggedInRef = useRef(false);

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

  const updateAccount = useCallback(
    debounce((text) => {
      window.backend.sendMessage(
        'update-file',
        text,
        [`account/${accountType.toLowerCase()}Account.txt`],
        accountType
      );
    }, 1500),
    []
  );

  const handleTextAreaChange = (e: { target: { value: any } }) => {
    const text = e.target.value;
    setTextareaValue(text);
    updateAccount(text);
  };

  const handleSelectionChange = (updatedAccounts: any[]) => {
    if (!isEditing) {
      const newTextareaValue = updatedAccounts
        .map((account: { username: any; password: any; isSelected: any }) => {
          return `${account.username}|${account.password}|${account.isSelected}`;
        })
        .join('\n');

      setTextareaValue(newTextareaValue);
    }
  };

  useEffect(() => {
    const handleFileData = (data: any, accountTypeReceived: any) => {
      const newAccounts = readValidAccount(data);
      const selectedAccounts = newAccounts.filter(
        (account) => account.isSelected
      );

      selectedAccounts.map(async (account: LoginParams) => {
        try {
          const data = (await accountLogin(account)) as any;
          const cash = Array.isArray(data?.data)
            ? data?.data[0].main_balance
            : 0;
          dispatch({
            type: 'UPDATE_ACCOUNT_INFO',
            accountType: accountType,
            username: data?.data[0].username,
            main_balance: cash,
          });
        } catch (err) {
          console.error('Setup bot failed:', err);
          return account;
        }
      });
      if (accountTypeReceived == accountType) {
        if (JSON.stringify(accountType) !== JSON.stringify(newAccounts)) {
          setTextareaValue(data);
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
    const text = textareaValue;
    if (text) {
      updateAccount(text);
      dispatch({
        type: 'UPDATE_ACCOUNTS',
        accountType: accountType,
        payload: readValidAccount(text),
      });
    }
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
            <AccountTable
              accountsProps={accounts}
              isEditing={isEditing}
              accountType={accountType}
              onSelectionChange={(updatedAccounts: any[]) =>
                handleSelectionChange(updatedAccounts)
              }
              updateAccounts={updateAccount}
            />
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
