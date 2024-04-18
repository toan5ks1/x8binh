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

export const setupAccountHandlers = (
  mainWindow: Electron.CrossProcessExports.BrowserWindow
) => {
  let puppeteerInstances: any[] = [];

  async function startPuppeteerForAccount(account: { username: any }) {
    try {
      let userProfilePath;
      const usernamePc = os.userInfo().username;
      if (os.platform() === 'win32') {
        userProfilePath = path.join('C:/Users', usernamePc, account.username);
      } else if (os.platform() === 'darwin') {
        userProfilePath = path.join('/Users', usernamePc, account.username);
      } else {
        userProfilePath = path.join('/home', usernamePc, account.username);
      }
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: userProfilePath,
      });
      const page = await browser.newPage();

      const client = await page.target().createCDPSession();
      await client.send('Network.enable');
      client.on('Network.webSocketFrameReceived', ({ response }: any) => {
        console.log(
          `Data received from WebSocket for account ${account.username}:`,
          response.payloadData
        );
      });

      puppeteerInstances.push({
        username: account.username,
        browser: browser,
        page: page,
        client: client,
      });

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
        'Network.webSocketFrameReceived',
        ({ requestId, response }: WebSocketFrameReceivedData) => {
          if (requestId === specificWebSocketRequestId) {
            var receivedMessage = response.payloadData;
            if (
              mainWindow &&
              !receivedMessage.includes('[6,1') &&
              !receivedMessage.includes('[5,{"rs":[{"mM":1000000,"b')
            ) {
              mainWindow.webContents.send(
                'websocket-data',
                response.payloadData
              );
            }
          }
        }
      );

      await page.goto('https://play.rik.vip/', { waitUntil: 'networkidle2' });

      return { browser, page };
    } catch (error) {}
  }

  ipcMain.on('open-accounts', async (event, accounts) => {
    console.log('open-accounts', accounts);
    for (let account of accounts) {
      await startPuppeteerForAccount(account);
    }
    event.reply('open-accounts-reply', 'All accounts have been opened.');
  });

  ipcMain.on('close-account', async (event, username) => {
    const index = puppeteerInstances.findIndex(
      (instance) => instance.username === username
    );
    if (index !== -1) {
      const { browser } = puppeteerInstances[index];
      await browser.close();
      puppeteerInstances.splice(index, 1);
      event.reply(
        'close-account-reply',
        `Account ${username} has been closed.`
      );
    } else {
      event.reply('close-account-reply', `Account ${username} not found.`);
    }
  });

  ipcMain.on('execute-script', async (event, { username, script }) => {
    const instance = puppeteerInstances.find(
      (instance) => instance.username === username
    );
    if (instance) {
      const { page } = instance;
      try {
        await page.evaluate(script);
        event.reply(
          'execute-script-reply',
          `Script executed for account ${username}.`
        );
      } catch (error) {
        console.error(`Error executing script for account ${username}:`, error);
        event.reply(
          'execute-script-reply',
          `Failed to execute script for account ${username}.`
        );
      }
    } else {
      event.reply('execute-script-reply', `Account ${username} not found.`);
    }
  });
};
