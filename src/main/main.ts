import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import os from 'os';
import path from 'path';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
const puppeteer = require('puppeteer');

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

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

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

  client.on('Network.webSocketClosed', ({ requestId }: WebSocketClosedData) => {
    if (requestId === specificWebSocketRequestId) {
      console.log(`WebSocket Closed: ${requestId}`);
      specificWebSocketRequestId = null;
    }
  });

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

  ipcMain.on('send-message', async (_event, [messageContent]) => {
    console.log('Sendmessage');
    try {
      await client.send('Network.sendMessageToWebSocket', {
        requestId: specificWebSocketRequestId,
        message: JSON.stringify({ data: 'Hello from Puppeteer!' }),
      });
    } catch (error) {
      console.error('Error sending message to WebSocket:', error);
    }
  });

  ipcMain.on('execute-script', async (_event, script) => {
    console.log('Received IPC message to execute script.');
    try {
      await page.evaluate(new Function(script));
    } catch (error) {
      console.error('Error executing script in the page:', error);
    }
  });
}

ipcMain.on('start-puppeteer', async () => {
  await startPuppeteer();
});

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 900,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      contextIsolation: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
