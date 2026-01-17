export interface Point {
  x: number
  y: number
  timestamp: number
  pressure?: number
}

export interface SignatureData {
  points: Point[]
  strokeCount: number
  totalDistance: number
  duration: number
  startTime: number | null
}

export interface VerificationResult {
  success: boolean
  matchScore: number
  threshold: number
  mode: string
}

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message: string
}
