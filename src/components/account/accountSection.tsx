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
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  accountType,
}) => {
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
                accountType == 'MAIN' ? '' : 'h-[250px]'
              } border-t`}
            >
              <AccountTable accountType={accountType} />
            </ScrollArea>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
