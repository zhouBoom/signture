import { useRef, useEffect, useCallback } from 'react'
import { getCoordinates, calculateDistance } from '../utils/canvas'
import { Point, SignatureData } from '../types'

interface SignatureCanvasProps {
  width: number
  height: number
  onSignatureChange: (data: SignatureData) => void
  onClear: () => void
}

export default function SignatureCanvas({
  width,
  height,
  onSignatureChange,
  onClear
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawingRef = useRef(false)
  const pointsRef = useRef<Point[]>([])
  const strokeCountRef = useRef(0)
  const totalDistanceRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const lastPointRef = useRef<Point | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const pendingDrawRef = useRef<{ from: Point; to: Point } | null>(null)

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 3
    ctx.strokeStyle = '#1a202c'

    ctxRef.current = ctx
  }, [width, height])

  const performDraw = useCallback(() => {
    const ctx = ctxRef.current
    const pending = pendingDrawRef.current

    if (ctx && pending) {
      ctx.beginPath()
      ctx.moveTo(pending.from.x, pending.from.y)
      ctx.lineTo(pending.to.x, pending.to.y)
      ctx.stroke()
      pendingDrawRef.current = null
    }

    animationFrameRef.current = null
  }, [])

  const scheduleDraw = useCallback((from: Point, to: Point) => {
    pendingDrawRef.current = { from, to }

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(performDraw)
    }
  }, [performDraw])

  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    event.preventDefault()

    const point = getCoordinates(event, canvas)
    isDrawingRef.current = true
    pointsRef.current.push(point)

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }

    strokeCountRef.current++
    lastPointRef.current = point

    const ctx = ctxRef.current
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
    }

    updateSignatureData()
  }, [])

  const draw = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDrawingRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    event.preventDefault()

    const point = getCoordinates(event, canvas)
    const lastPoint = lastPointRef.current

    if (lastPoint) {
      const distance = calculateDistance(lastPoint, point)
      totalDistanceRef.current += distance
      scheduleDraw(lastPoint, point)
    }

    pointsRef.current.push(point)
    lastPointRef.current = point

    updateSignatureData()
  }, [scheduleDraw])

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return

    isDrawingRef.current = false
    lastPointRef.current = null

    const ctx = ctxRef.current
    if (ctx) {
      ctx.closePath()
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
      performDraw()
    }

    updateSignatureData()
  }, [performDraw])

  const updateSignatureData = useCallback(() => {
    const duration = startTimeRef.current
      ? (Date.now() - startTimeRef.current) / 1000
      : 0

    const data: SignatureData = {
      points: [...pointsRef.current],
      strokeCount: strokeCountRef.current,
      totalDistance: totalDistanceRef.current,
      duration,
      startTime: startTimeRef.current
    }

    onSignatureChange(data)
  }, [onSignatureChange])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current

    if (canvas && ctx) {
      const dpr = window.devicePixelRatio || 1
      ctx.clearRect(0, 0, width * dpr, height * dpr)
      pointsRef.current = []
      strokeCountRef.current = 0
      totalDistanceRef.current = 0
      startTimeRef.current = null
      lastPointRef.current = null

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      pendingDrawRef.current = null

      onClear()
      updateSignatureData()
    }
  }, [width, height, onClear, updateSignatureData])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    setupCanvas()

    const handleMouseDown = (e: MouseEvent) => startDrawing(e)
    const handleMouseMove = (e: MouseEvent) => draw(e)
    const handleMouseUp = () => stopDrawing()
    const handleMouseLeave = () => stopDrawing()

    const handleTouchStart = (e: TouchEvent) => startDrawing(e)
    const handleTouchMove = (e: TouchEvent) => draw(e)
    const handleTouchEnd = () => stopDrawing()

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseLeave)

      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [setupCanvas, startDrawing, draw, stopDrawing])

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        id="signatureCanvas"
        width={width}
        height={height}
      />
      {pointsRef.current.length === 0 && (
        <div className="canvas-placeholder">
          请在上方绘制您的签名
        </div>
      )}
    </div>
  )
}
