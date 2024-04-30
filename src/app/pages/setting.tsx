import React from 'react';
import { AccountSection } from '../../components/account/accountSection';

export const SettingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <header className="flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>
      <main className="grid grid-cols-2 gap-4 overflow-auto p-4 ">
        <AccountSection accountType="BOT" />
        <AccountSection accountType="SUB" />
      </main>
    </div>
  );
};
