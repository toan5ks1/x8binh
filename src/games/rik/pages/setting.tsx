import React from 'react';
import { AccountSection } from '../../../components/account/accountSection';

export const SettingPageNew: React.FC = () => {
  return (
    <div className="flex flex-col">
      <header className="flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>
      <main className="grid flex-1 gap-4 overflow-auto p-4 grid-cols-3">
        <AccountSection accountType="MAIN" placeholder="Main account here..." />
        <AccountSection accountType="SUB" placeholder="Sub account here..." />
        <AccountSection accountType="BOT" placeholder="Bot account here..." />
      </main>
    </div>
  );
};
