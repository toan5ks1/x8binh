// preload.d.ts
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: string, args: unknown[]): void;
        executeScript(channel: string, args: unknown[]): void;
        openPuppeteer(): void;
        on(channel: string, func: (...args: unknown[]) => void): () => void;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      onWebSocketData(func: (data: unknown) => void): void;
      removeWebSocketData(channel: string): void;
    };
  }
}

export {};
