import { useState, useCallback, useRef, useEffect } from 'react';
import { SignatureData } from '../types';

interface ReplayState {
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  progress: number;
  currentStrokeIndex: number;
  currentPointIndex: number;
}

interface ReplayOptions {
  onDraw?: (point: { x: number; y: number }) => void;
  onClear?: () => void;
  onComplete?: () => void;
}

export interface UseSignatureReplayReturn {
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  progress: number;
  speed: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export const useSignatureReplay = (
  signatureData: SignatureData | null,
  options: ReplayOptions = {}
): UseSignatureReplayReturn => {
  const [speed, setSpeed] = useState(1);
  const [state, setState] = useState<ReplayState>({
    isPlaying: false,
    isPaused: false,
    isCompleted: false,
    progress: 0,
    currentStrokeIndex: 0,
    currentPointIndex: 0,
  });

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const totalElapsedTimeRef = useRef(0);
  const allPointsRef = useRef<{ x: number; y: number; timestamp: number }[]>([]);
  const timeOffsetsRef = useRef<number[]>([]);

  const collectPoints = useCallback((data: SignatureData) => {
    const points: { x: number; y: number; timestamp: number }[] = [];
    const timeOffsets: number[] = [];
    
    if (data.strokes.length === 0) {
      allPointsRef.current = points;
      timeOffsetsRef.current = timeOffsets;
      return;
    }

    const firstPointTime = data.strokes[0].points[0]?.timestamp || data.startTime;

    data.strokes.forEach((stroke, _strokeIndex) => {
      stroke.points.forEach((point, _pointIndex) => {
        const offset = point.timestamp - firstPointTime;
        points.push({
          x: point.x,
          y: point.y,
          timestamp: point.timestamp,
        });
        timeOffsets.push(offset);
      });
    });

    allPointsRef.current = points;
    timeOffsetsRef.current = timeOffsets;
  }, []);

  const drawPoint = useCallback((point: { x: number; y: number }) => {
    options.onDraw?.(point);
  }, [options.onDraw]);

  const clearCanvas = useCallback(() => {
    options.onClear?.();
  }, [options.onClear]);

  const replayLoop = useCallback((timestamp: number) => {
    if (!signatureData || allPointsRef.current.length === 0) {
      setState(prev => ({ ...prev, isPlaying: false, isCompleted: true }));
      options.onComplete?.();
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const elapsed = (timestamp - startTimeRef.current) * speed + totalElapsedTimeRef.current;
    const timeOffsets = timeOffsetsRef.current;
    const points = allPointsRef.current;

    let targetIndex = 0;
    for (let i = 0; i < timeOffsets.length; i++) {
      if (timeOffsets[i] <= elapsed) {
        targetIndex = i + 1;
      } else {
        break;
      }
    }

    if (targetIndex > state.currentPointIndex) {
      for (let i = state.currentPointIndex; i < targetIndex && i < points.length; i++) {
        drawPoint(points[i]);
      }

      const newProgress = (targetIndex / points.length) * 100;
      setState(prev => ({
        ...prev,
        progress: Math.min(newProgress, 100),
        currentPointIndex: targetIndex,
      }));
    }

    if (targetIndex >= points.length) {
      setState(prev => ({ ...prev, isPlaying: false, isCompleted: true }));
      options.onComplete?.();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(replayLoop);
  }, [signatureData, speed, state.currentPointIndex, options.onComplete, drawPoint]);

  const start = useCallback(() => {
    if (!signatureData || signatureData.strokes.length === 0) {
      return;
    }

    clearCanvas();
    collectPoints(signatureData);

    startTimeRef.current = null;
    pausedTimeRef.current = null;
    totalElapsedTimeRef.current = 0;

    setState({
      isPlaying: true,
      isPaused: false,
      isCompleted: false,
      progress: 0,
      currentStrokeIndex: 0,
      currentPointIndex: 0,
    });

    animationFrameRef.current = requestAnimationFrame(replayLoop);
  }, [signatureData, clearCanvas, collectPoints, replayLoop]);

  const pause = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (startTimeRef.current !== null) {
      pausedTimeRef.current = performance.now();
      totalElapsedTimeRef.current += (pausedTimeRef.current - startTimeRef.current) * speed;
    }

    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  }, [speed]);

  const resume = useCallback(() => {
    startTimeRef.current = performance.now();
    
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    animationFrameRef.current = requestAnimationFrame(replayLoop);
  }, [replayLoop]);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    startTimeRef.current = null;
    pausedTimeRef.current = null;
    totalElapsedTimeRef.current = 0;

    setState({
      isPlaying: false,
      isPaused: false,
      isCompleted: false,
      progress: 0,
      currentStrokeIndex: 0,
      currentPointIndex: 0,
    });

    clearCanvas();
  }, [clearCanvas]);

  useEffect(() => {
    if (!state.isPlaying && !state.isPaused && !state.isCompleted) {
      reset();
    }
  }, [signatureData]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isPlaying: state.isPlaying,
    isPaused: state.isPaused,
    isCompleted: state.isCompleted,
    progress: state.progress,
    speed,
    start,
    pause,
    resume,
    reset,
    setSpeed,
  };
};

export default useSignatureReplay;
