import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Chrome, PlusCircle, TrashIcon, Unplug } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { AccountSection } from '../../components/account/accountSection';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ScrollArea } from '../../components/ui/scroll-area';
import { AppContext } from '../../renderer/providers/app';
import useAccountStore from '../../store/accountStore';

export const TerminalPage: React.FC = () => {
  const [data, setData] = useState<unknown[]>([]);
  const [command, setCommand] = useState('');
  const [roomId, setRoomId] = useState('');
  const { state } = useContext<any>(AppContext);
  const { accounts } = useAccountStore();

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
    console.log('create ROom');
    window.backend.sendMessage('send-message', [
      '[6,"Simms","channelPlugin",{"cmd":300,"aid":"1","gid":4}]',
    ]);
  };
  const createRoom = () => {
    console.log('create ROom');
    window.backend.sendMessage('execute-script', [
      `__require('GamePlayManager').default.getInstance().requestcreateRoom(4,100,4,)`,
    ]);
  };

  function openPuppeteer(): void {
    window.backend.sendMessage('start-puppeteer');
  }
  function openAccounts(account: any): void {
    window.backend.sendMessage('open-accounts', account);
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
  useEffect(() => {
    console.log('account main:', accounts['MAIN']);
  }, [accounts]);

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
              main.isSelected && (
                <div
                  key={index}
                  className="flex flex-col terminal relative rounded-md border"
                >
                  <div className="flex flex-row justify-end bg-[#141414] gap-[10px]">
                    <Label className="flex items-center">{main.username}</Label>
                    <Button
                      onClick={createRoom}
                      style={{ fontFamily: 'monospace' }}
                      className="rounded-[5px] py-[0px] flex items-center hover:bg-slate-400 cursor-pointer gap-[2px] px-[5px] h-[30px]"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Create</span>
                    </Button>

                    <Button
                      onClick={joinRoom}
                      style={{ fontFamily: 'monospace' }}
                      className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 gap-[2px] h-[30px]"
                    >
                      <Unplug className="h-3.5 w-3.5" />
                      <span>Join</span>
                    </Button>
                    <Button
                      onClick={() => openAccounts(main)}
                      style={{ fontFamily: 'monospace' }}
                      className="rounded-[5px] px-[5px] py-[0px]  flex items-center hover:bg-slate-400 cursor-pointer h-[30px]"
                    >
                      <Chrome className="h-3.5 w-3.5 ml-[3px]" />
                      <span>Open</span>
                    </Button>
                    <Button
                      onClick={clearData}
                      className="  hover:bg-slate-400 rounded-[5px] p-0 border-[2px] flex justify-center items-center cursor-pointer  gap-[2px] px-[7px] h-[30px]"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
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
                          __html: highlightSyntax(
                            JSON.stringify(item, null, 2)
                          ),
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
              )
          )}
        </Card>
      </div>
    </div>
  );
};
