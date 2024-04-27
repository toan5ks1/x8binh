import React from 'react';
import { AccountSection } from '../../components/account/accountSection';
import { TerminalBoard } from '../../components/terminal/terminalBoard';
import { Card } from '../../components/ui/card';
import useAccountStore from '../../store/accountStore';

export const TerminalPage: React.FC = () => {
  const { accounts } = useAccountStore();

  return (
    <div className="text-center h-full">
      <div className="grid grid-rows-2 laptop:grid-cols-2 gap-4">
        <div className="">
          <AccountSection
            accountType="MAIN"
            placeholder="Main account here..."
          />
        </div>
        <Card className="w-full flex flex-col gap-4">
          {accounts['MAIN'].map(
            (main: any, index: any) =>
              main.isSelected && <TerminalBoard key={index} main={main} />
          )}
        </Card>
      </div>
    </div>
  );
};
