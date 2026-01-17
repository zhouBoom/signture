import { useState, useCallback, useRef, useEffect } from 'react';
import type { SignatureData, Point } from '../types';

interface UseSignatureReplayOptions {
  onDrawPoint?: (point: Point) => void;
  onStrokeStart?: () => void;
  onStrokeEnd?: () => void;
  onReplayComplete?: () => void;
}

export interface UseSignatureReplayReturn {
  isPlaying: boolean;
  playbackSpeed: number;
  currentTime: number;
  totalDuration: number;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setSignatureData: (data: SignatureData | null) => void;
}

export const useSignatureReplay = (
  options: UseSignatureReplayOptions = {}
): UseSignatureReplayReturn => {
  const { onDrawPoint, onStrokeStart, onStrokeEnd, onReplayComplete } = options;

  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const currentStrokeIndexRef = useRef<number>(0);
  const currentPointIndexRef = useRef<number>(0);

  useEffect(() => {
    if (signatureData) {
      setTotalDuration(signatureData.endTime - signatureData.startTime);
    } else {
      setTotalDuration(0);
    }
  }, [signatureData]);

  const resetState = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    elapsedTimeRef.current = 0;
    currentStrokeIndexRef.current = 0;
    currentPointIndexRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    resetState();
  }, [resetState]);

  const play = useCallback(() => {
    if (!signatureData || signatureData.strokes.length === 0) return;

    startTimeRef.current = performance.now() - elapsedTimeRef.current;
    setIsPlaying(true);
  }, [signatureData]);

  const pause = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPlaying(false);
    elapsedTimeRef.current = currentTime;
  }, [currentTime]);

  const replayLoop = useCallback(() => {
    if (!signatureData || !isPlaying) return;

    const currentTimeValue = (performance.now() - startTimeRef.current) * playbackSpeed;
    setCurrentTime(currentTimeValue);

    const totalTime = signatureData.endTime - signatureData.startTime;
    
    if (currentTimeValue >= totalTime) {
      setCurrentTime(totalTime);
      setIsPlaying(false);
      onReplayComplete?.();
      return;
    }

    let strokeIndex = currentStrokeIndexRef.current;
    let pointIndex = currentPointIndexRef.current;

    while (strokeIndex < signatureData.strokes.length) {
      const stroke = signatureData.strokes[strokeIndex];
      const strokeStartTime = stroke.startTime - signatureData.startTime;
      const strokeEndTime = stroke.endTime - signatureData.startTime;

      if (currentTimeValue < strokeStartTime) {
        break;
      }

      if (currentTimeValue <= strokeEndTime) {
        if (pointIndex === 0) {
          onStrokeStart?.();
        }

        while (pointIndex < stroke.points.length) {
          const pointTime = stroke.points[pointIndex].timestamp - signatureData.startTime;
          if (pointTime > currentTimeValue) {
            break;
          }
          onDrawPoint?.(stroke.points[pointIndex]);
          pointIndex++;
        }

        if (pointIndex >= stroke.points.length) {
          onStrokeEnd?.();
          strokeIndex++;
          pointIndex = 0;
        }
        break;
      } else {
        onStrokeEnd?.();
        strokeIndex++;
        pointIndex = 0;
      }
    }

    currentStrokeIndexRef.current = strokeIndex;
    currentPointIndexRef.current = pointIndex;

    animationFrameRef.current = requestAnimationFrame(replayLoop);
  }, [signatureData, isPlaying, playbackSpeed, onDrawPoint, onStrokeStart, onStrokeEnd, onReplayComplete]);

  useEffect(() => {
    if (isPlaying && signatureData) {
      const loop = () => {
        if (!isPlaying || !signatureData) return;
        replayLoop();
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, signatureData]);

  return {
    isPlaying,
    playbackSpeed,
    currentTime,
    totalDuration,
    play,
    pause,
    reset,
    setPlaybackSpeed,
    setSignatureData,
  };
};
