import { Point } from '../types'

export function getCoordinates(
  event: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
): Point {
  const rect = canvas.getBoundingClientRect()

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
    timestamp: Date.now()
  }
}

export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function calculateSpeed(
  point1: Point,
  point2: Point
): number {
  const distance = calculateDistance(point1, point2)
  const timeDiff = point2.timestamp - point1.timestamp
  return timeDiff > 0 ? distance / timeDiff : 0
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
