const { ipcMain } = require('electron');
const si = require('systeminformation');
const axios = require('axios');

export const setupReadHardwareHandlers = () => {
  ipcMain.handle('get-hardware-info', async (event) => {
    try {
      try {
        const cpuInfo = await si.cpu();
        const diskInfo = await si.diskLayout();
        const networkInterfaces = await si.networkInterfaces();
        const systemInfo = await si.system();
        const osInfo = await si.osInfo();

        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const publicIp = ipResponse.data.ip;

        const locationResponse = await axios.get(
          `https://ipinfo.io/${publicIp}/geo`
        );
        const locationData = locationResponse.data;

        console.log('cpu', cpuInfo);
        console.log('diskInfo', diskInfo);
        console.log('networkInterfaces', networkInterfaces);
        console.log('systemInfo', systemInfo);
        console.log('OS Info:', osInfo);

        return {
          cpu: cpuInfo,
          disks: diskInfo,
          network: networkInterfaces,
          system: systemInfo,
          hostname: osInfo.hostname,
          ip: publicIp,
          location: locationData,
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
