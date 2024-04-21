import { session } from 'electron';
import path from 'path';
const fs = require('fs');
const os = require('os');

export async function checkAndLoadExtension(extensionPath: string) {
  if (fs.existsSync(extensionPath)) {
    console.log('Extension found. Loading:', extensionPath);
    try {
      await session.defaultSession.loadExtension(extensionPath, {
        allowFileAccess: true,
      });
      console.log('Extension loaded successfully');
    } catch (err) {
      console.error('Error loading extension:', err);
    }
  } else {
    console.error('Extension not found at path:', extensionPath);
  }
}

export function getExtensionPath(
  extensionId: string,
  extensionVersion: string
) {
  switch (os.platform()) {
    case 'darwin': // macOS
      return path.join(
        os.homedir(),
        `/Library/Application Support/Google/Chrome/Default/Extensions/${extensionId}/${extensionVersion}`
      );
    case 'win32': // Windows
      return path.join(
        os.homedir(),
        `/AppData/Local/Google/Chrome/User Data/Default/Extensions/${extensionId}/${extensionVersion}`
      );
    case 'linux': // Linux
      return path.join(
        os.homedir(),
        `/.config/google-chrome/Default/Extensions/${extensionId}/${extensionVersion}`
      );
    default:
      throw new Error('Unsupported platform');
  }
}

export async function loadExtensions(extensions: any) {
  for (const extension of extensions) {
    const extensionPath = getExtensionPath(extension.id, extension.version);
    await checkAndLoadExtension(extensionPath);
  }
}
