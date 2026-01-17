import { useState, useCallback, useRef, useEffect } from 'react';
import { SignatureData, Stroke, Point } from '../types';

interface UseSignatureReplayReturn {
  isPlaying: boolean;
  isPaused: boolean;
  currentSpeed: number;
  progress: number;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

const useSignatureReplay = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  signatureData: SignatureData | null,
  onReplayComplete?: () => void
): UseSignatureReplayReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const currentStrokeIndexRef = useRef<number>(0);
  const currentPointIndexRef = useRef<number>(0);
  const isReplayingRef = useRef<boolean>(false);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  }, [canvasRef]);

  const drawPoint = useCallback((point: Point, prevPoint: Point | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    
    if (prevPoint) {
      ctx.moveTo(prevPoint.x, prevPoint.y);
    } else {
      ctx.moveTo(point.x, point.y);
    }
    
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }, [canvasRef]);

  const drawStroke = useCallback((stroke: Stroke, maxPointIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (stroke.points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i <= Math.min(maxPointIndex, stroke.points.length - 1); i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    
    ctx.stroke();
  }, [canvasRef]);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a202c';
  }, [canvasRef]);

  const calculateProgress = useCallback((strokes: Stroke[], currentStrokeIdx: number, currentPointIdx: number): number => {
    if (strokes.length === 0) return 0;
    
    let totalPoints = 0;
    let completedPoints = 0;
    
    for (let i = 0; i < strokes.length; i++) {
      const pointCount = strokes[i].points.length;
      totalPoints += pointCount;
      
      if (i < currentStrokeIdx) {
        completedPoints += pointCount;
      } else if (i === currentStrokeIdx) {
        completedPoints += currentPointIdx + 1;
      }
    }
    
    return totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;
  }, []);

  const replayFrame = useCallback((timestamp: number) => {
    if (!signatureData || !isReplayingRef.current) return;
    
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current - pausedTimeRef.current;
    const adjustedElapsed = elapsed * currentSpeed;
    
    const strokes = signatureData.strokes;
    let currentStrokeIndex = currentStrokeIndexRef.current;
    let currentPointIndex = currentPointIndexRef.current;
    
    const baseTime = signatureData.startTime;
    
    while (currentStrokeIndex < strokes.length) {
      const stroke = strokes[currentStrokeIndex];
      
      if (currentPointIndex < stroke.points.length) {
        const point = stroke.points[currentPointIndex];
        const pointTime = point.timestamp - baseTime;
        
        if (adjustedElapsed >= pointTime) {
          const prevPoint = currentPointIndex > 0 ? stroke.points[currentPointIndex - 1] : null;
          
          if (currentPointIndex === 0) {
            drawStroke(stroke, currentPointIndex);
          } else {
            drawPoint(point, prevPoint);
          }
          
          currentPointIndex++;
        } else {
          break;
        }
      } else {
        currentStrokeIndex++;
        currentPointIndex = 0;
      }
    }
    
    currentStrokeIndexRef.current = currentStrokeIndex;
    currentPointIndexRef.current = currentPointIndex;
    
    const newProgress = calculateProgress(strokes, currentStrokeIndex, currentPointIndex);
    setProgress(newProgress);
    
    if (currentStrokeIndex >= strokes.length) {
      isReplayingRef.current = false;
      setIsPlaying(false);
      setIsPaused(false);
      if (onReplayComplete) {
        onReplayComplete();
      }
      return;
    }
    
    if (isReplayingRef.current) {
      animationFrameRef.current = requestAnimationFrame(replayFrame);
    }
  }, [signatureData, currentSpeed, drawPoint, drawStroke, calculateProgress, onReplayComplete]);

  const play = useCallback(() => {
    if (!signatureData || signatureData.strokes.length === 0) return;
    
    if (isPlaying && !isPaused) return;
    
    if (!isReplayingRef.current) {
      clearCanvas();
      initializeCanvas();
      
      currentStrokeIndexRef.current = 0;
      currentPointIndexRef.current = 0;
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      lastFrameTimeRef.current = null;
      isReplayingRef.current = true;
      setProgress(0);
    } else {
      lastFrameTimeRef.current = null;
    }
    
    setIsPlaying(true);
    setIsPaused(false);
    
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      if (lastFrameTimeRef.current) {
        pausedTimeRef.current += timestamp - lastFrameTimeRef.current;
      }
      replayFrame(timestamp);
    });
  }, [signatureData, isPlaying, isPaused, clearCanvas, initializeCanvas, replayFrame]);

  const pause = useCallback(() => {
    if (!isPlaying || isPaused) return;
    
    setIsPaused(true);
    isReplayingRef.current = false;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    lastFrameTimeRef.current = performance.now();
  }, [isPlaying, isPaused]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    
    isReplayingRef.current = false;
    currentStrokeIndexRef.current = 0;
    currentPointIndexRef.current = 0;
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    lastFrameTimeRef.current = null;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    clearCanvas();
  }, [clearCanvas]);

  const setSpeed = useCallback((speed: number) => {
    setCurrentSpeed(speed);
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    currentSpeed,
    progress,
    play,
    pause,
    reset,
    setSpeed
  };
};

export default useSignatureReplay;
