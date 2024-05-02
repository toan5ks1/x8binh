import { X } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

const BotSetting: React.FC<any> = ({ children, setIsOpen, isOpen }) => {
  return (
    <div
      className={`fixed top-0 w-screen h-screen bg-black bg-opacity-60 z-[101] flex flex-row left-0 ${
        !isOpen && 'hidden'
      }`}
    >
      <div className="h-full bg-background p-4 w-1/3">
        <div className="flex justify-between items-center top-4 w-full">
          <h1 className="text-xl font-semibold">Bot status</h1>
          <Button
            onClick={() => setIsOpen(false)}
            className="hover:bg-transparent cursor-pointer"
            variant="ghost"
          >
            <X />
          </Button>
        </div>
        <ScrollArea className="h-screen pr-4">
          <div className="mt-4 mb-16 flex flex-col gap-4">{children}</div>
        </ScrollArea>
      </div>
      <div
        className="flex flex-grow cursor-pointer"
        onClick={() => setIsOpen(false)}
      ></div>
    </div>
  );
};

export default BotSetting;
