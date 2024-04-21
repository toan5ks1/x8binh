// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

const validChannels: string[] = [
  'ipc-example',
  'websocket-data',
  'execute-script',
  'open-accounts',
  'start-puppeteer',
  'read-file',
  'update-file',
  'send-message',
  'file-updated',
  'get-hardware-info',
];

contextBridge.exposeInMainWorld('backend', {
  sendMessage: (channel: string, ...args: unknown[]) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  on: (channel: string, func: (...args: unknown[]) => void) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
  once: (channel: string, func: (...args: unknown[]) => void) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    }
  },
  removeListener: (channel: string, func: (...args: unknown[]) => void) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, func);
    }
  },
  getHardwareInfo: () => ipcRenderer.invoke('get-hardware-info'),
});
