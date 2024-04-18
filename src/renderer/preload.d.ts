// preload.d.ts
declare global {
  interface Window {
    backend: {
      sendMessage(channel: string, ...args: unknown[]): void;
      on(channel: string, func: (...args: unknown[]) => void): () => void;
      once(channel: string, func: (...args: unknown[]) => void): void;
      removeListener(channel: string, func: (...args: unknown[]) => void): void;
    };
  }
}

export {};
