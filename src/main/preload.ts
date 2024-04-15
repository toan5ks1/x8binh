// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

type Channels = 'ipc-example' | 'websocket-data';
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    executeScript(args: unknown[]) {
      ipcRenderer.send('execute-script', args);
    },
    openPuppeteer() {
      ipcRenderer.send('start-puppeteer');
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (
        _event: Electron.IpcRendererEvent,
        ...args: unknown[]
      ) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(
        channel,
        (_event: Electron.IpcRendererEvent, ...args: unknown[]) => func(...args)
      );
    },
  },
  onWebSocketData: (func: (data: unknown) => void) => {
    ipcRenderer.on(
      'websocket-data',
      (_event: Electron.IpcRendererEvent, data: unknown) => func(data)
    );
  },
  removeWebSocketData: (channel: Channels) => {
    ipcRenderer.removeAllListeners(channel);
  },
  sendMessage: (channel: string, args: any) => ipcRenderer.send(channel, args),
});
