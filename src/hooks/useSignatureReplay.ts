import { useRef, useState, useCallback, useEffect } from 'react';
import { Point, SignatureData } from '@/types';

interface ReplayState {
  isPlaying: boolean;
  currentTime: number;
  currentStrokeIndex: number;
  currentPointIndex: number;
  progress: number;
}

export const useSignatureReplay = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const [replayState, setReplayState] = useState<ReplayState>({
    isPlaying: false,
    currentTime: 0,
    currentStrokeIndex: 0,
    currentPointIndex: 0,
    progress: 0,
  });
  const [speed, setSpeed] = useState(1);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);

  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const replayStartTimeRef = useRef<number>(0);

  const totalDuration = signatureData
    ? signatureData.strokes.reduce((acc, stroke) => {
        return acc + (stroke.endTime - stroke.startTime);
      }, 0)
    : 0;



  const drawPoint = useCallback((ctx: CanvasRenderingContext2D, point: Point, prevPoint?: Point) => {
    const pressure = point.pressure ?? 0.5;
    const lineWidth = 1 + pressure * 4;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a202c';

    if (prevPoint) {
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  }, [canvasRef]);

  const drawUpToTime = useCallback((targetTime: number) => {
    if (!signatureData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();

    let cumulativeTime = 0;
    let lastDrawnPoint: Point | null = null;

    for (const stroke of signatureData.strokes) {
      const strokeDuration = stroke.endTime - stroke.startTime;

      if (cumulativeTime >= targetTime) break;

      for (let i = 0; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        const pointTime = strokeDuration > 0
          ? ((point.time || stroke.startTime) - stroke.startTime) / strokeDuration * strokeDuration
          : 0;
        const absolutePointTime = cumulativeTime + pointTime;

        if (absolutePointTime > targetTime) {
          const prevPoint = stroke.points[i - 1];
          if (prevPoint) {
            const prevPointTime = strokeDuration > 0
              ? ((prevPoint.time || stroke.startTime) - stroke.startTime) / strokeDuration * strokeDuration
              : 0;
            const prevAbsoluteTime = cumulativeTime + prevPointTime;
            
            const ratio = (targetTime - prevAbsoluteTime) / (absolutePointTime - prevAbsoluteTime);
            const interpolatedPoint: Point = {
              x: prevPoint.x + (point.x - prevPoint.x) * ratio,
              y: prevPoint.y + (point.y - prevPoint.y) * ratio,
              pressure: (prevPoint.pressure || 0.5) + ((point.pressure || 0.5) - (prevPoint.pressure || 0.5)) * ratio,
            };
            drawPoint(ctx, interpolatedPoint, lastDrawnPoint || undefined);
          }
          break;
        }



        drawPoint(ctx, point, lastDrawnPoint || undefined);
        lastDrawnPoint = point;
      }

      cumulativeTime += strokeDuration;
    }
  }, [signatureData, canvasRef, clearCanvas, drawPoint]);

  const animate = useCallback((timestamp: number) => {
    if (!signatureData) return;

    if (lastTimestampRef.current === 0) {
      lastTimestampRef.current = timestamp;
      replayStartTimeRef.current = timestamp;
    }

    const elapsed = (timestamp - replayStartTimeRef.current) * speed;

    if (elapsed >= totalDuration) {
      drawUpToTime(totalDuration);
      setReplayState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: totalDuration,
        progress: 100,
      }));
      animationRef.current = null;
      return;
    }

    drawUpToTime(elapsed);

    setReplayState(prev => ({
      ...prev,
      currentTime: elapsed,
      progress: (elapsed / totalDuration) * 100,
    }));

    animationRef.current = requestAnimationFrame(animate);
  }, [signatureData, speed, totalDuration, drawUpToTime]);

  const play = useCallback(() => {
    if (!signatureData || signatureData.strokes.length === 0) return;

    if (replayState.currentTime >= totalDuration) {
      reset();
    }

    setReplayState(prev => ({ ...prev, isPlaying: true }));
    lastTimestampRef.current = 0;
    replayStartTimeRef.current = performance.now() - (replayState.currentTime / speed);
    animationRef.current = requestAnimationFrame(animate);
  }, [signatureData, replayState.currentTime, replayState.progress, totalDuration, speed, animate]);

  const pause = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setReplayState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    lastTimestampRef.current = 0;
    replayStartTimeRef.current = 0;
    clearCanvas();
    setReplayState({
      isPlaying: false,
      currentTime: 0,
      currentStrokeIndex: 0,
      currentPointIndex: 0,
      progress: 0,
    });
  }, [clearCanvas]);

  const seek = useCallback((progress: number) => {
    if (!signatureData) return;

    const targetTime = (progress / 100) * totalDuration;
    drawUpToTime(targetTime);

    setReplayState(prev => ({
      ...prev,
      currentTime: targetTime,
      progress,
    }));
  }, [signatureData, totalDuration, drawUpToTime]);

  const changeSpeed = useCallback((newSpeed: number) => {
    setSpeed(Math.max(0.1, Math.min(4, newSpeed)));
  }, []);

  const loadSignatureData = useCallback((data: SignatureData | null) => {
    reset();
    setSignatureData(data);
  }, [reset]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!replayState.isPlaying && signatureData && replayState.currentTime > 0) {
      drawUpToTime(replayState.currentTime);
    }
  }, [replayState.isPlaying]);

  return {
    isPlaying: replayState.isPlaying,
    progress: replayState.progress,
    currentTime: replayState.currentTime,
    totalDuration,
    speed,
    play,
    pause,
    reset,
    seek,
    changeSpeed,
    loadSignatureData,
  };
};
