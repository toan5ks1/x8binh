import { X } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

const MainSetting: React.FC<any> = ({ children, setIsOpen, isOpen }) => {
  return (
    <div
      className={`fixed top-0 w-screen h-screen bg-black bg-opacity-60 z-[101] flex flex-row ${
        !isOpen && 'hidden'
      }`}
    >
      <div
        className="flex flex-grow cursor-pointer"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="h-full bg-background p-4 w-full max-w-[800px]">
        <div className="flex justify-between items-center top-4 w-full">
          <h1 className="text-xl font-semibold">Settings</h1>
          <Button
            onClick={() => setIsOpen(false)}
            className="hover:bg-transparent cursor-pointer"
            variant="ghost"
          >
            <X />
          </Button>
        </div>
        <ScrollArea className="h-screen pr-4">
          <div className="mt-4 flex flex-col gap-4 mb-[200px]">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MainSetting;
