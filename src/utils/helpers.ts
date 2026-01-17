import { VerificationMode } from '../types';

export const getModeLabel = (mode: VerificationMode): string => {
  const modes: Record<VerificationMode, string> = {
    dynamic: '动态模式',
    static: '静态模式',
    hybrid: '混合模式',
  };
  return modes[mode] || mode;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const getDevicePixelRatio = (): number => {
  return window.devicePixelRatio || 1;
};
