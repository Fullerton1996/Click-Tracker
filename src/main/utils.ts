export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
};

export const isWindows = (): boolean => {
  return process.platform === 'win32';
};

export const isMacOS = (): boolean => {
  return process.platform === 'darwin';
};

export const isLinux = (): boolean => {
  return process.platform === 'linux';
};