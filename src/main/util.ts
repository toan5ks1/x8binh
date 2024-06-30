/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
const os = require('os');

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const joinLobbyScript = `__require('LobbyViewController').default.Instance.onClickIConGame(null,"vgcg_4");`;

export const updateAccount = (account: any) => {
  const filePath = `account/${account.accountType}Account.txt`;
  const newData = `${account.username}|${account.password}|${account.token}|${account.accountType}|${account.isSelected}`;

  const usernamePc = os.userInfo().username;
  let userProfilePath;
  if (process.env.NODE_ENV != 'development') {
    if (os.platform() === 'win32') {
      userProfilePath = path.join(
        'C:/Users',
        usernamePc,
        'AppData/Local/Programs/electron-react-boilerplate/resources',
        filePath
      );
    } else if (os.platform() === 'darwin') {
      userProfilePath = path.join(
        '/Users',
        usernamePc,
        'AppData/Local/Programs/electron-react-boilerplate/resources',
        filePath
      );
    } else {
      userProfilePath = path.join(
        '/home',
        usernamePc,
        'AppData/Local/Programs/electron-react-boilerplate/resources',
        filePath
      );
    }
  } else {
    userProfilePath = filePath;
  }

  fs.readFile(userProfilePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.log('Error reading file:', err);
      return;
    }
    let lines = data.split('\n').filter((line) => line.trim() !== '');
    const newDataParts = newData.split('|');
    const index = lines.findIndex((line) => {
      const parts = line.split('|');
      return parts[0] === newDataParts[0] && parts[1] === newDataParts[1];
    });

    if (index !== -1) {
      lines[index] = newData;
    } else {
      lines.push(newData);
    }

    const updatedData = lines.join('\n');
    fs.writeFile(userProfilePath, updatedData, { encoding: 'utf-8' }, (err) => {
      if (err) {
        console.log('Error writing file:', err);
        return;
      }
      console.log('File Updated:', newData);
    });
  });
};
