const { ipcMain } = require('electron');
const os = require('os');
const puppeteer = require('puppeteer');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());
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

  async function startPuppeteerForAccount(account: {
    username: string;
    password: string;
    proxy: string;
    port: string;
    userProxy: string;
    passProxy: string;
  }) {
    try {
      let userProfilePath;
      const usernamePc = os.userInfo().username;
      if (os.platform() === 'win32') {
        userProfilePath = path.join(
          'C:/Users',
          usernamePc,
          'puppeteerProfile',
          account.username
        );
      } else if (os.platform() === 'darwin') {
        userProfilePath = path.join(
          '/Users',
          usernamePc,
          'puppeteerProfile',
          account.username
        );
      } else {
        userProfilePath = path.join(
          '/home',
          usernamePc,
          'puppeteerProfile',
          account.username
        );
      }
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: userProfilePath,
        ignoreHTTPSErrors: true,
        acceptInsecureCerts: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certifcate-errors',
          '--ignore-certifcate-errors-spki-list',
          '--remote-debugging-port=42796',
          // '--proxy-server=socks5://hndc35.proxyno1.com:42796',
          `${
            account.proxy &&
            account.proxy != 'undefined' &&
            `--proxy-server=${account.proxy.trim()}:${account.port.trim()}`
          }`,
          // `--host-resolver-rules=${hostResolverRules}`,
        ],
      });
      const pages = await browser.pages();

      const page = pages[0];
      if (account.userProxy) {
        console.log('userProxy', account.userProxy.trim());
        console.log('passProxy', account.passProxy.trim());
        await page.authenticate({
          username: account.userProxy.trim(),
          password: account.passProxy.trim(),
        });
      }
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

      await page.evaluate(`
      let node2 = cc.find("Canvas/MainUIParent/NewLobby/Footder/bottmBar@3x/Public/Layout/dnButtonSmartObjectGroup1@3x").getComponent(cc.Button);
      if (node2) {
          let touchStart = new cc.Touch(0, 0);
          let touchEnd = new cc.Touch(0, 0);
          let touchEventStart = new cc.Event.EventTouch([touchStart], false);
          touchEventStart.type = cc.Node.EventType.TOUCH_START;
          node2.node.dispatchEvent(touchEventStart);

          let touchEventEnd = new cc.Event.EventTouch([touchEnd], false);
          touchEventEnd.type = cc.Node.EventType.TOUCH_END;
          node2.node.dispatchEvent(touchEventEnd);
      }


      setTimeout(() => {
          let pathUserName = "CommonPrefabs/PopupDangNhap/popup/TenDangNhap/Username";
          let editBoxNodeUserName = cc.find(pathUserName);
          let editBoxUserName = editBoxNodeUserName.getComponent(cc.EditBox);
          if (editBoxUserName) {
              editBoxUserName.string = "${account.username}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node");
          }

          let pathPass = "CommonPrefabs/PopupDangNhap/popup/Matkhau/Password";
          let editBoxNodePass = cc.find(pathPass);
          let editBoxPass = editBoxNodePass.getComponent(cc.EditBox);
          if (editBoxPass) {
              editBoxPass.string = "${account.password}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node");
          }
          let nodeXacNhan = cc.find("CommonPrefabs/PopupDangNhap/popup/BtnOk").getComponent(cc.Button);
          if (nodeXacNhan) {
              let touchStart = new cc.Touch(0, 0);
              let touchEnd = new cc.Touch(0, 0);
              let touchEventStart = new cc.Event.EventTouch([touchStart], false);
              touchEventStart.type = cc.Node.EventType.TOUCH_START;
              nodeXacNhan.node.dispatchEvent(touchEventStart);

              let touchEventEnd = new cc.Event.EventTouch([touchEnd], false);
              touchEventEnd.type = cc.Node.EventType.TOUCH_END;
              nodeXacNhan.node.dispatchEvent(touchEventEnd);
          }
      }, 500);
      setTimeout(() => {
        __require('LobbyViewController').default.Instance.onClickIConGame(null,"vgcg_4");
      }, 3500);
      `);

      return { browser, page };
    } catch (error) {
    } finally {
      return true;
    }
  }
  // const accountArrange = {
  //   username: 'giuchansapbai',
  //   password: 'zxcv123123',
  //   proxy: '',
  //   port: '',
  // };
  // startPuppeteerForAccount(accountArrange);

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
  ipcMain.on('check-position', async (event, { username }, script) => {
    const instance = puppeteerInstances.find(
      (instance) => instance.username === username
    );
    if (instance) {
      const { page } = instance;
      try {
        await page.evaluate(script);
        const result = await instance.page.evaluate(script);
        event.reply('check-position', {
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
