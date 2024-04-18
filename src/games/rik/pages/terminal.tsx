import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Chrome, PlusCircle, TrashIcon, Unplug } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { AppContext } from '../../../renderer/providers/app';

export const TerminalPage: React.FC = () => {
  const [data, setData] = useState<unknown[]>([]);
  const [command, setCommand] = useState('');
  const [roomId, setRoomId] = useState('');
  const { state } = useContext<any>(AppContext);

  const parseData = (dataString: string) => {
    try {
      const parsedData = JSON.parse(dataString);
      return parsedData;
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };

  const sendMessage = () => {
    window.backend.sendMessage('send-message', [
      '[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":""}]  ',
    ]);
  };
  const createRoom = () => {
    console.log('create ROom');
    window.backend.sendMessage('execute-script', [
      `__require('GamePlayManager').default.getInstance().requestcreateRoom(4,100,4,)`,
    ]);
  };
  // const executeCommand = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter') {
  //     console.log('Executing command:', command);
  //     window.electron.ipcRenderer.executeScript('execute-script', [command]);
  //     setCommand('');
  //   }
  // };

  function openPuppeteer(): void {
    window.backend.sendMessage('start-puppeteer');
  }

  function joinRoom(): any {
    if (state.initialRoom.id) {
      window.backend.sendMessage('execute-script', [
        `__require('GamePlayManager').default.getInstance().joinRoom(${state.initialRoom.id},0,'',true);`,
      ]);
    }
  }

  const highlightSyntax = (jsonString: string) => {
    let escapedHtml = jsonString.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    escapedHtml = escapedHtml.replaceAll(' ', '');
    escapedHtml = escapedHtml.replace(
      /("[^"\\]*(?:\\.[^"\\]*)*")/g,
      `<span class='string-terminal'>$1</span>`
    );
    escapedHtml = escapedHtml.replace(/"/g, '&quot;');
    escapedHtml = escapedHtml.replaceAll('[', '<span class="bracket">[</span>');
    escapedHtml = escapedHtml.replaceAll(']', '<span class="bracket">]</span>');
    escapedHtml = escapedHtml.replaceAll(
      ',',
      '<span class="comma-terminal">,</span>'
    );
    escapedHtml = escapedHtml.replaceAll(
      '{',
      '<span class="angle-brackets">{</span>'
    );
    escapedHtml = escapedHtml.replaceAll(
      '}',
      '<span class="angle-brackets">}</span>'
    );
    escapedHtml = escapedHtml.replace(
      /\b\d+\b/g,
      '<span class="number">$&</span>'
    );
    return escapedHtml;
  };

  useEffect(() => {
    const handleData = (newData: any) => {
      const parsedData = parseData(newData);
      setData((currentData) => [...currentData, parsedData]);
    };

    window.backend.on('websocket-data', handleData);

    return () => {
      window.backend.removeListener('websocket-data', handleData);
    };
  }, []);

  const clearData = () => {
    setData([]);
  };

  return (
    <Card className="text-center h-full">
      <div className="flex flex-col">
        <div className="w-full">
          <div className="flex flex-col terminal relative">
            <div className="flex flex-row justify-end bg-[#1e1e1e] gap-[10px]">
              <Button
                onClick={createRoom}
                style={{ fontFamily: 'monospace' }}
                className="rounded-[5px] py-[0px] flex items-center hover:bg-slate-400 cursor-pointer gap-[2px] px-[10px]"
              >
                <PlusCircle />
                <span>Create Room</span>
              </Button>

              <Button
                onClick={joinRoom}
                style={{ fontFamily: 'monospace' }}
                className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px]"
              >
                <Unplug />
                <span>Join Room</span>
              </Button>

              <Button
                onClick={openPuppeteer}
                style={{ fontFamily: 'monospace' }}
                className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 cursor-pointer"
              >
                <Chrome />
                <span>Open Pupperteer</span>
              </Button>
              <Button
                onClick={clearData}
                className="  hover:bg-slate-400 rounded-[5px] p-0 border-[2px] flex justify-center items-center cursor-pointer  gap-[2px] px-[10px]"
              >
                <TrashIcon className="h-auto w-auto" />
              </Button>
            </div>

            <ScrollArea
              id="messageContainer"
              className="flex flex-col grow h-full max-w-screen mb-[30px]"
            >
              {data.map((item, index) => (
                <div
                  key={index}
                  className="font-bold text-left command-input"
                  style={{ fontFamily: 'monospace' }}
                  dangerouslySetInnerHTML={{
                    __html: highlightSyntax(JSON.stringify(item, null, 2)),
                  }}
                />
              ))}
            </ScrollArea>
            <div className="sticky bottom-0">
              <Card className="flex flex-row justify-between p-[5px]">
                <Input
                  type="text"
                  className="!h-auto"
                  style={{ fontFamily: 'monospace' }}
                  placeholder="Type messsage..."
                  onChange={(e) => setCommand(e.target.value)}
                />
                <Button
                  style={{ fontFamily: 'monospace' }}
                  onClick={sendMessage}
                  className="rounded-[5px] px-[25px] flex justify-center gap-[3px] items-center border-[2px] hover:bg-slate-400"
                >
                  <PaperPlaneIcon />
                  <p>Send</p>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
