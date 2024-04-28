import React from 'react';
import { TerminalBoard } from '../../components/terminal/terminalBoard';
import { Card } from '../../components/ui/card';
import useAccountStore from '../../store/accountStore';

export const TerminalPage: React.FC = () => {
  const { accounts } = useAccountStore();

  return (
    <div className="text-center h-full">
      <div className="flex flex-col gap-4">
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
