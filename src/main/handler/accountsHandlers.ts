const { ipcMain } = require('electron');
const os = require('os');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
import path from 'path';

interface WebSocketCreatedData {
  requestId: string;
  url: string;
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
        args: ['about:blank'],
        userDataDir: userProfilePath,
      });
      const pages = await browser.pages();

      const page = pages[0];
      await page.evaluateOnNewDocument(() => {
        const coresOptions = [1, 2, 4, 8, 16, 32];
        const randomIndex = Math.floor(Math.random() * coresOptions.length);
        const randomCores = coresOptions[randomIndex];

        Object.defineProperty(navigator, 'hardwareConcurrency', {
          get: () => randomCores,
        });
      });

      const client = await page.target().createCDPSession();
      await client.send('Network.enable');
      await client.send('Page.enable');
      await client.send('Emulation.setPageScaleFactor', { pageScaleFactor: 0 });

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
            specificWebSocketRequestId = requestId;
          }
        }
      );

      client.on(
        'Network.webSocketFrameReceived',
        ({ requestId, response }: WebSocketFrameReceivedData) => {
          if (requestId === specificWebSocketRequestId) {
            mainWindow.webContents.send('websocket-data', {
              data: response.payloadData,
              username: account.username,
            });
          }
        }
      );

      client.on(
        'Network.webSocketFrameSent',
        ({ requestId, response }: WebSocketFrameReceivedData) => {
          if (requestId === specificWebSocketRequestId) {
            mainWindow.webContents.send('websocket-data-sent', {
              data: response.payloadData,
              username: account.username,
            });
          }
        }
      );

      await page.goto('https://play.rik.vip/', { waitUntil: 'networkidle2' });

      await page.evaluate(() => {
        const videos = document.querySelectorAll('video') as any;
        const audios = document.querySelectorAll('audio') as any;
        [...videos, ...audios].forEach((media) => (media.muted = true));
      });

      const url = 'https://bordergw.api-inovated.com/user/login.aspx';
      const payload = {
        username: 'emblak1830',
        password: 'zxcv123123',
        app_id: 'rik.vip',
        os: 'Windows',
        device: 'Computer',
        browser: 'chrome',
        fg: 'c08ac2590159e23dea3ae34023150ff2',
        time: 1714200407,
        sign: '979b1e64b64cd10352d72187a259eef0',
        aff_id: 'hit',
        r_token:
          'HFYWR1ch1TcC4pdGtAT05RTg93NjAxVAI6ZgR3ZBE0FBMIAyg4HU4APR9IZD5VIGI_KiVcBRcGSFFPIXIhJFMHKxQEYxdAf0dDAEFoYgRqWHoZAFJmHzJkK0kjORdiFnoMGiVgcyBbUC4wVzFzXEJZfF9HImEeOgY-HXM',
      };

      const response = await page.evaluate(
        async (url, payload) => {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          return response.json(); // Giả định server trả về JSON
        },
        url,
        payload
      );

      console.log(response);

      const url2 = 'https://api.wsmt8g.cc/v2/auth/token/login';
      const token = '29-374acab3b38e74ef83e82c21e9e40e5f';
      const device = {
        os: 'Windows',
        osVersion: '',
        platform: 101,
        browser: 'chrome',
        browserVersion: '123.0.0.0',
        language: 'en',
        ssid: '96760accfab5427a8bcd4c43e4d34da9',
      };

      const response2 = await page.evaluate(
        (url2, token, device) => {
          return fetch(url2, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=${encodeURIComponent(
              token
            )}&device=${encodeURIComponent(JSON.stringify(device))}`,
          })
            .then((response) => response.json()) // giả định rằng server trả về JSON
            .catch((error) => console.error('Error:', error));
        },
        url2,
        token,
        device
      );

      console.log('response Login', response2);

      // Refresh trang
      // await page.reload();

      return { browser, page };
    } catch (error) {}
  }

  ipcMain.on('open-accounts', async (event, account) => {
    await startPuppeteerForAccount(account);

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

  ipcMain.on('execute-script', async (event, { username }, script) => {
    console.log('username', username);
    console.log('script', script);
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
        await page.evaluate(`window.f12_gm = __require('GamePlayManager').default.getInstance();
        window.f12_JoinRoom = __require('GamePlayManager').default.getInstance();
        window.f12_Joinlobby = __require('LobbyViewController');
        window.f12_GameController = __require('GameController').default.prototype;
        window.sapBaiMinh = async function () {
          try {
            gg = cc
              .find("Canvas")
              .getChildByName("MainUI")
              .getChildByName("MauBinhController")._components[0]
              .cardGameTableController.gameController;
            let tempBet = gg.bet;
            gg.bet = 100;
            gg.onClickTuSapBai();
            gg.bet = tempBet;
            window.delay(Math.floor(Math.random() * 5000 + 35000)).then(function () {
              if (autoPlayMode) {
                window.xepBaiXong();
              }
            });
          } catch (e) {
            console.log("Sap bai ERROR: ", e.toString());
          }
        };
        var myDiv = document.createElement("div")`);
        await page.evaluate(script);
        event.reply(
          'execute-script-reply',
          `Failed to execute script for account ${username}.`
        );
      }
    } else {
      event.reply('execute-script-reply', `Account ${username} not found.`);
    }
  });
  ipcMain.on('check-room', async (event, { username }, script) => {
    console.log('username', username);
    console.log('script', script);
    const instance = puppeteerInstances.find(
      (instance) => instance.username === username
    );
    if (instance) {
      const { page } = instance;
      try {
        await page.evaluate(script);
        const result = await instance.page.evaluate(script);
        event.reply('check-room', {
          data: result,
          username: username,
        });
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
