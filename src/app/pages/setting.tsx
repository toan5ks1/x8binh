import React from 'react';
import { AccountSection } from '../../components/account/accountSection';

export const SettingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <header className="flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>
      <main className=" overflow-auto p-4 ">
        <div className="grid grid-cols-2 gap-4 ">
          <AccountSection
            accountType="MAIN"
            placeholder="Main account here..."
          />
          <AccountSection accountType="SUB" placeholder="Sub account here..." />
        </div>
        <AccountSection accountType="BOT" placeholder="Bot account here..." />
      </main>
    </div>
  );
};
