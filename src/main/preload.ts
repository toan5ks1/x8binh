// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

const validChannels: string[] = [
  'ipc-example',
  'websocket-data',
  'execute-script',
  'start-puppeteer',
  'read-file',
  'update-file',
];

contextBridge.exposeInMainWorld('backend', {
  // Gửi yêu cầu IPC
  sendMessage: (channel: string, args?: unknown[]) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, args);
    }
  },
  // Lắng nghe sự kiện IPC
  on: (channel: string, func: (...args: unknown[]) => void) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
  // Lắng nghe một lần sự kiện IPC
  once: (channel: string, func: (...args: unknown[]) => void) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    }
  },
  // Gỡ bỏ listener
  removeListener: (channel: string, func: (...args: unknown[]) => void) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, func);
    }
  },
});
