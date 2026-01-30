export interface Point {
  x: number;
  y: number;
  pressure?: number;
  time?: number;
}

export interface Stroke {
  points: Point[];
  startTime: number;
  endTime: number;
}

export interface SignatureData {
  strokes: Stroke[];
  totalDuration: number;
  totalDistance: number;
  averageSpeed: number;
  strokeCount: number;
}

export interface VerificationResult {
  isValid: boolean;
  matchScore: number;
  threshold: number;
  mode: VerificationMode;
  features: SignatureFeatures;
}

export interface SignatureFeatures {
  strokeSpeed: string;
  strokePressure: string;
  strokeOrder: number;
  signDuration: string;
}

export type VerificationMode = 'dynamic' | 'static' | 'hybrid';

export interface ToastProps {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  duration?: number;
}

export interface VerificationRecord {
  id: string;
  timestamp: Date;
  result: 'success' | 'failed';
  matchScore: number;
  threshold: number;
  mode: VerificationMode;
}