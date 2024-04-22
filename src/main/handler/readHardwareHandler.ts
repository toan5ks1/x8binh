const { ipcMain } = require('electron');
const si = require('systeminformation');

export const setupReadHardwareHandlers = () => {
  ipcMain.handle('get-hardware-info', async (event) => {
    try {
      try {
        const cpuInfo = await si.cpu();
        const diskInfo = await si.diskLayout();
        const systemInfo = await si.system();
        const osInfo = await si.osInfo();

        return {
          cpu: cpuInfo,
          disks: diskInfo,
          system: systemInfo,
          hostname: osInfo.hostname,
        };
      } catch (error) {
        console.error('Error getting hardware info:', error);
        return {};
      }
    } catch (error) {
      console.error('Error getting hardware info:', error);
      return {};
    }
  });
};
