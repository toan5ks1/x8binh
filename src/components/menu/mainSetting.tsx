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
      <div className="h-full max-w-[900px] bg-background p-4 ">
        <Button
          onClick={() => setIsOpen(false)}
          className="hover:bg-transparent cursor-pointer p-0 absolute top-0 right-4"
          variant="ghost"
        >
          <X />
        </Button>
        <ScrollArea className="h-screen ">
          <div className="mt-4 flex flex-col gap-4 mb-[200px]">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MainSetting;
