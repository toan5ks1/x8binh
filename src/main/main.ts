import { BrowserWindow, app, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { loadExtensions } from './extension/installer';
import { setupAccountHandlers } from './handler/accountsHandlers';
import { setupFileHandlers } from './handler/fileHandlers';
import { setupPuppeteerHandlers } from './handler/puppeteerHandlers';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 1280,
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

  setupFileHandlers();
  setupPuppeteerHandlers(mainWindow);
  setupAccountHandlers(mainWindow);

  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const extensions = [
  {
    id: 'lmhkpmbekcpmknklioeibfkpmmfibljd', // React DevTools ID
    version: '3.1.6_0',
  },
  {
    id: 'npbfdllefekhdplbkdigpncggmojpefi',
    version: '1.3.1_0',
  },
];

app
  .whenReady()
  .then(async () => {
    await loadExtensions(extensions);
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
