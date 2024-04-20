const { ipcMain } = require('electron');
const fs = require('fs');

export const setupFileHandlers = () => {
  ipcMain.on('read-file', (event, filePath, accountType) => {
    fs.readFile(
      filePath[0],
      { encoding: 'utf-8' },
      (err: { message: any }, data: any) => {
        if (err) {
          console.log('Error reading file:', err);
          event.reply('file-read-error', err.message);
          return;
        }
        event.reply('read-file', data, accountType);
        console.log('Readed File:', data);
        // console.log('accountType-path', accountType);
      }
    );
  });

  ipcMain.on('update-file', (event, data, filePath, accountType) => {
    if (filePath && typeof filePath[0] === 'string') {
      fs.writeFile(filePath[0], data, (err: { message: any }) => {
        if (err) {
          console.log('Error writing file:', err);
          event.reply('file-write-error', err.message);
          return;
        }
        event.reply('file-updated', data, accountType);
      });
    }
  });
};
