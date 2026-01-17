export interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export interface Stroke {
  points: Point[];
  startTime: number;
  endTime: number;
}

export interface SignatureData {
  strokes: Stroke[];
  startTime: number;
  endTime: number;
  totalDistance: number;
  strokeCount: number;
}

export interface SignatureFeatures {
  strokeSpeed: string;
  strokePressure: string;
  strokeOrder: string;
  signDuration: string;
}

export interface VerificationResult {
  success: boolean;
  matchScore: number;
  threshold: number;
  mode: VerificationMode;
  message: string;
}

export type VerificationMode = 'dynamic' | 'static' | 'hybrid';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
}

export interface VerificationRecord {
  id: string;
  timestamp: string;
  result: 'success' | 'failed';
}

export interface ModeConfig {
  value: VerificationMode;
  label: string;
}
