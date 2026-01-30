import { useRef, useEffect, useCallback, useState } from 'react';
import { SignatureData, Stroke, Point } from '@/types';

interface UseSignatureReplayProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  signatureData: SignatureData;
  onReplayComplete?: () => void;
  onReplayProgress?: (progress: number) => void;
}

export const useSignatureReplay = ({
  canvasRef,
  signatureData,
  onReplayComplete,
  onReplayProgress,
}: UseSignatureReplayProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [replayProgress, setReplayProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const currentStrokeIndexRef = useRef<number>(0);
  const currentPointIndexRef = useRef<number>(0);

  // 清除画布
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取设备像素比
    const dpr = window.devicePixelRatio || 1;
    
    // 获取 CSS 尺寸
    const rect = canvas.getBoundingClientRect();
    
    // 清除整个画布（考虑设备像素比）
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  // 绘制点
  const drawPoint = useCallback((ctx: CanvasRenderingContext2D, point: Point) => {
    // 获取设备像素比
    const dpr = window.devicePixelRatio || 1;
    
    ctx.lineTo(point.x * dpr, point.y * dpr);
    ctx.stroke();
  }, []);

  // 开始新的笔画
  const beginStroke = useCallback((ctx: CanvasRenderingContext2D, point: Point) => {
    // 获取设备像素比
    const dpr = window.devicePixelRatio || 1;
    
    ctx.beginPath();
    ctx.moveTo(point.x * dpr, point.y * dpr);
    ctx.lineWidth = 3 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a202c';
  }, []);

  // 回放动画
  const animate = useCallback(() => {
    if (!signatureData.strokes.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取设备像素比
    const dpr = window.devicePixelRatio || 1;

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTimeRef.current + pausedTimeRef.current) * playbackSpeed;
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 找到当前应该绘制的笔画和点
    let totalElapsedTime = 0;
    
    for (let strokeIndex = 0; strokeIndex < signatureData.strokes.length; strokeIndex++) {
      const stroke = signatureData.strokes[strokeIndex];
      const strokeDuration = stroke.endTime - stroke.startTime;
      
      if (totalElapsedTime + strokeDuration <= elapsedTime) {
        // 整个笔画已经完成，绘制整个笔画
        if (stroke.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x * dpr, stroke.points[0].y * dpr);
          
          for (let pointIndex = 1; pointIndex < stroke.points.length; pointIndex++) {
            ctx.lineTo(stroke.points[pointIndex].x * dpr, stroke.points[pointIndex].y * dpr);
          }
          
          ctx.lineWidth = 3 * dpr;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#1a202c';
          ctx.stroke();
        }
      } else if (totalElapsedTime < elapsedTime) {
        // 当前正在绘制的笔画
        const strokeProgress = (elapsedTime - totalElapsedTime) / strokeDuration;
        const pointsToDraw = Math.floor(stroke.points.length * strokeProgress);
        
        if (pointsToDraw > 0 && stroke.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x * dpr, stroke.points[0].y * dpr);
          
          for (let i = 1; i < pointsToDraw; i++) {
            ctx.lineTo(stroke.points[i].x * dpr, stroke.points[i].y * dpr);
          }
          
          ctx.lineWidth = 3 * dpr;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#1a202c';
          ctx.stroke();
        }
        
        currentStrokeIndexRef.current = strokeIndex;
        currentPointIndexRef.current = pointsToDraw;
      } else {
        // 还未到达的笔画
        break;
      }
      
      totalElapsedTime += strokeDuration;
    }
    
    // 计算总进度
    const totalDuration = signatureData.totalDuration || totalElapsedTime;
    const progress = Math.min((elapsedTime / totalDuration) * 100, 100);
    setReplayProgress(progress);
    
    if (onReplayProgress) {
      onReplayProgress(progress);
    }
    
    // 检查是否完成
    if (progress >= 100) {
      setIsPlaying(false);
      if (onReplayComplete) {
        onReplayComplete();
      }
      return;
    }
    
    // 继续动画
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [signatureData, canvasRef, playbackSpeed, onReplayComplete, onReplayProgress]);

  // 开始回放
  const startReplay = useCallback(() => {
    if (!signatureData.strokes.length) return;
    
    // 清除画布
    clearCanvas();
    
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    currentStrokeIndexRef.current = 0;
    currentPointIndexRef.current = 0;
    setReplayProgress(0);
    setIsPlaying(true);
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [signatureData.strokes.length, clearCanvas, animate]);

  // 暂停回放
  const pauseReplay = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (isPlaying) {
      pausedTimeRef.current += (Date.now() - startTimeRef.current) * playbackSpeed;
    }
    
    setIsPlaying(false);
  }, [isPlaying, playbackSpeed]);

  // 重置回放
  const resetReplay = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    clearCanvas();
    setIsPlaying(false);
    setReplayProgress(0);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    currentStrokeIndexRef.current = 0;
    currentPointIndexRef.current = 0;
  }, [clearCanvas]);

  // 设置播放速度
  const setSpeed = useCallback((speed: number) => {
    if (isPlaying) {
      pausedTimeRef.current += (Date.now() - startTimeRef.current) * playbackSpeed;
      startTimeRef.current = Date.now();
    }
    setPlaybackSpeed(speed);
  }, [isPlaying, playbackSpeed]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    playbackSpeed,
    replayProgress,
    startReplay,
    pauseReplay,
    resetReplay,
    setSpeed,
  };
};