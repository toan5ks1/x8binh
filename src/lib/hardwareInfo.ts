export const fetchHardwareInfo = async (): Promise<any> => {
  try {
    const hardwareInfo = (await window.backend.getHardwareInfo()) as any;
    return hardwareInfo;
  } catch (error) {
    console.error('Failed to fetch hardware info:', error);
    return null;
  }
};
