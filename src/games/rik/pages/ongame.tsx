import { PaperPlaneIcon, TrashIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { MainNav } from '../components/layout/main-nav';

export const OnGame: React.FC = () => {
  const [data, setData] = useState<unknown[]>([]);
  const [command, setCommand] = useState('');
  const [roomId, setRoomId] = useState('');

  const parseData = (dataString: string) => {
    try {
      const parsedData = JSON.parse(dataString);
      return parsedData;
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };

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

    window.electron.onWebSocketData(handleData);

    return () => {
      window.electron.removeWebSocketData('websocket-data');
    };
  }, []);

  const sendMessage = () => {
    window.electron.ipcRenderer.sendMessage('send-message', [
      '[6,"Simms","channelPlugin",{"cmd":308,"aid":1,"gid":4,"b":100,"Mu":4,"iJ":true,"inc":false,"pwd":""}]  ',
    ]);
  };
  const createRoom = () => {
    window.electron.ipcRenderer.executeScript('execute-script', [
      `__require('GamePlayManager').default.getInstance().requestcreateRoom(4,100,4,)`,
    ]);
  };
  const executeCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('Executing command:', command);
      window.electron.ipcRenderer.executeScript('execute-script', [command]);
      setCommand('');
    }
  };

  const openPuppeteer = (): void => {
    window.electron.ipcRenderer.openPuppeteer();
  };

  const clearData = () => {
    setData([]);
  };

  function joinRoom(roomId: string): any {
    window.electron.ipcRenderer.executeScript('execute-script', [
      `__require('GamePlayManager').default.getInstance().joinRoom(${roomId},0,'',true);`,
    ]);
  }

  return (
    <div className="text-center h-full">
      <MainNav />
      <div className="flex flex-col">
        <div className="w-full overflow-y-scroll ">
          <div className="flex flex-col terminal relative">
            <div className="flex flex-row justify-end bg-[#1e1e1e] gap-[10px]">
              <div
                onClick={clearData}
                className=" border-white bg-[#1e1e1e]  hover:bg-slate-400 rounded-[5px] border-[2px] py-[5px] px-[10px] flex justify-center items-center cursor-pointer"
              >
                <TrashIcon />
              </div>

              <div
                style={{ fontFamily: 'monospace' }}
                className="border-white rounded-[5px] px-[5px] flex items-center bg-[#1e1e1e]   border-[2px] hover:bg-slate-400 cursor-pointer"
              >
                <button onClick={createRoom}>Create Room</button>
              </div>
              <div
                style={{ fontFamily: 'monospace' }}
                className="rounded-[5px] flex items-center bg-[#1e1e1e]  cursor-pointer border-[2px]  "
              >
                <input
                  type="text"
                  className="command-input "
                  style={{ fontFamily: 'monospace' }}
                  placeholder="Type messsage..."
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <div
                  style={{ fontFamily: 'monospace' }}
                  className="rounded-[5px] px-[5px] flex items-center bg-[#1e1e1e] cursor-pointer hover:bg-slate-400"
                >
                  <button onClick={joinRoom(roomId)}>Join Room</button>
                </div>
              </div>
              <div
                style={{ fontFamily: 'monospace' }}
                className="border-white rounded-[5px] px-[5px] flex items-center bg-[#1e1e1e]  border-[2px] hover:bg-slate-400 cursor-pointer"
              >
                <button onClick={openPuppeteer}>Open Pupperteer</button>
              </div>
            </div>

            <div
              id="messageContainer"
              className="flex flex-col grow h-full mb-[30px] overflow-y-scroll"
            >
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-start text-left font-bold command-input"
                  style={{ fontFamily: 'monospace' }}
                  dangerouslySetInnerHTML={{
                    __html: highlightSyntax(JSON.stringify(item, null, 2)),
                  }}
                />
              ))}
            </div>
            <div className="sticky bottom-0">
              <div className="flex flex-row justify-between border-white border-[2px] p-[5px] bg-[#1e1e1e]">
                <input
                  type="text"
                  className="bg-[#1e1e1e] w-full"
                  style={{ fontFamily: 'monospace' }}
                  placeholder="Type messsage..."
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={() => {
                    executeCommand;
                  }}
                />
                <div
                  style={{ fontFamily: 'monospace' }}
                  onClick={sendMessage}
                  className="border-white  rounded-[5px] px-[5px] flex justify-center gap-[3px] items-center border-[2px] hover:bg-slate-400"
                >
                  <PaperPlaneIcon />
                  <p>Send</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
