const { ipcMain } = require('electron');
const fs = require('fs');
const os = require('os');
const puppeteer = require('puppeteer');
import path from 'path';

interface WebSocketCreatedData {
  requestId: string;
  url: string;
}

interface WebSocketClosedData {
  requestId: string;
}

interface WebSocketFrameReceivedData {
  requestId: string;
  response: {
    payloadData: string;
  };
}

export const setupPuppeteerHandlers = (
  mainWindow: Electron.CrossProcessExports.BrowserWindow
) => {
  async function startPuppeteer() {
    let userProfilePath;

    const username = os.userInfo().username;

    if (os.platform() === 'win32') {
      userProfilePath = path.join('C:/Users', username, 'MyPuppeteerProfile');
    } else if (os.platform() === 'darwin') {
      userProfilePath = path.join('/Users', username, 'MyPuppeteerProfile');
    } else {
      userProfilePath = path.join('/home', username, 'MyPuppeteerProfile');
    }
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      userDataDir: userProfilePath,
    });
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();

    await client.send('Network.enable');

    let specificWebSocketRequestId: any = null;

    client.on(
      'Network.webSocketCreated',
      ({ requestId, url }: WebSocketCreatedData) => {
        if (url.includes('wss://cardskgw.ryksockesg.net/websocket')) {
          console.log(`WebSocket Created to specific URL: ${url}`);

          specificWebSocketRequestId = requestId;
        }
      }
    );

    client.on(
      'Network.webSocketClosed',
      ({ requestId }: WebSocketClosedData) => {
        if (requestId === specificWebSocketRequestId) {
          console.log(`WebSocket Closed: ${requestId}`);
          specificWebSocketRequestId = null;
        }
      }
    );

    client.on(
      'Network.webSocketFrameReceived',
      ({ requestId, response }: WebSocketFrameReceivedData) => {
        if (requestId === specificWebSocketRequestId) {
          var receivedMessage = response.payloadData;
          if (
            mainWindow &&
            !receivedMessage.includes('[6,1') &&
            !receivedMessage.includes('[5,{"rs":[{"mM":1000000,"b')
          ) {
            mainWindow.webContents.send('websocket-data', response.payloadData);
          }
        }
      }
    );

    await page.goto('https://play.rik.vip/', { waitUntil: 'networkidle2' });

    ipcMain.on('send-message', async (_event, messageContent) => {
      console.log('Sending message:', messageContent);
      try {
        const prototype = await page.evaluateHandle(() => WebSocket.prototype);
        const socketInstances = await page.queryObjects(prototype);
        const targetWebSocketURL = 'wss://cardskgw.ryksockesg.net/websocket';
        await page.evaluate(
          (instances: any[], message: any, targetURL: any) => {
            instances.forEach((instance) => {
              if (instance.url === targetURL) {
                instance.send(message);
              }
            });
          },
          socketInstances,
          JSON.stringify(messageContent),
          targetWebSocketURL
        );
        await prototype.dispose();
        await socketInstances.dispose();
      } catch (error) {
        console.error('Error sending message through WebSocket:', error);
      }
    });

    ipcMain.on('execute-script', async (_event, script) => {
      console.log('Received IPC message to execute script.', script);
      try {
        await page.evaluate(new Function(script));
      } catch (error) {
        console.error('Error executing script in the page:', error);
      }
    });
  }

  ipcMain.on('start-puppeteer', async (event) => {
    await startPuppeteer();
    event.reply('start-puppeteer', true);
  });
};
