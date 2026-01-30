export interface Point {
  x: number;
  y: number;
  timestamp: number;
}

export interface Stroke {
  points: Point[];
  duration: number;
  distance: number;
}

export interface SignatureData {
  strokes: Stroke[];
  totalDuration: number;
  totalDistance: number;
  strokeCount: number;
}

export interface SignatureFeatures {
  strokeSpeed: number;
  strokePressure: number;
  strokeOrder: number;
  signDuration: number;
}

export interface VerifyResult {
  success: boolean;
  matchScore: number;
  threshold: number;
  mode: string;
  timestamp: Date;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export type VerifyMode = 'dynamic' | 'static' | 'hybrid';
