const { ipcMain } = require('electron');
const si = require('systeminformation');

export const setupReadHardwareHandlers = () => {
  ipcMain.handle('get-hardware-info', async (event) => {
    try {
      try {
        const [cpuInfo, diskInfo, systemInfo, osInfo] = await Promise.all([
          si.cpu(),
          si.diskLayout(),
          si.system(),
          si.osInfo(),
        ]);

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
