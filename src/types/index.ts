export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon: string;
  title: string;
}

export interface FeatureData {
  strokeSpeed: string;
  strokePressure: string;
  strokeOrder: number;
  signDuration: string;
}

export interface VerifyResult {
  success: boolean;
  score: number;
  mode: string;
  threshold: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Record {
  id: string;
  time: string;
  result: 'success' | 'failed';
}
