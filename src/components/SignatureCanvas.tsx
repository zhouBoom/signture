import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Point, Stroke, SignatureData } from '../types';
import { getDevicePixelRatio, calculateDistance } from '../utils/helpers';
import useSignatureReplay from '../hooks/useSignatureReplay';

interface SignatureCanvasProps {
  onSignatureChange: (data: SignatureData) => void;
  onClear: () => void;
  signatureData: SignatureData | null;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSignatureChange, onClear, signatureData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const dpr = useRef(getDevicePixelRatio());
  
  const {
    isPlaying,
    isPaused,
    currentSpeed,
    progress,
    play,
    pause,
    reset,
    setSpeed
  } = useSignatureReplay(canvasRef, signatureData);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 300;
    
    const currentDpr = dpr.current;
    canvas.width = width * currentDpr;
    canvas.height = height * currentDpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(currentDpr, currentDpr);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1a202c';
    }
    
    return () => {
      if (ctx) {
        ctx.scale(1 / currentDpr, 1 / currentDpr);
      }
    };
  }, [dpr]);
  
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 300;
    
    ctx.clearRect(0, 0, width, height);
    
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      
      ctx.stroke();
    });
    
    if (currentStroke.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      
      ctx.stroke();
    }
  }, [strokes, currentStroke]);
  
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);
  
  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return { x: 0, y: 0, pressure: 0, timestamp: Date.now() };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      pressure: 0.5,
      timestamp: Date.now()
    };
  }, []);
  
  const draw = useCallback((point: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    
    if (lastPoint) {
      ctx.moveTo(lastPoint.x, lastPoint.y);
    } else {
      ctx.moveTo(point.x - 0.5, point.y - 0.5);
    }
    
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    
    if (lastPoint) {
      const distance = calculateDistance(lastPoint.x, lastPoint.y, point.x, point.y);
      setTotalDistance(prev => prev + distance);
    }
    
    setLastPoint(point);
    setCurrentStroke(prev => [...prev, point]);
  }, [lastPoint]);
  
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCoordinates(e);
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setIsDrawing(true);
    setHasSignature(true);
    setLastPoint(point);
    setCurrentStroke([point]);
    
    draw(point);
  }, [getCoordinates, startTime, draw]);
  
  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const point = getCoordinates(e);
    draw(point);
  }, [isDrawing, getCoordinates, draw]);
  
  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentStroke.length > 0) {
      const now = Date.now();
      const newStroke: Stroke = {
        points: [...currentStroke],
        startTime: currentStroke[0]?.timestamp || now,
        endTime: now
      };
      
      setStrokes(prev => [...prev, newStroke]);
      setCurrentStroke([]);
      setLastPoint(null);
      
      const endTime = now;
      const signatureStartTime = startTime || currentStroke[0]?.timestamp || now;
      
      const signatureData: SignatureData = {
        strokes: [...strokes, newStroke],
        startTime: signatureStartTime,
        endTime,
        totalDistance,
        strokeCount: strokes.length + 1
      };
      
      onSignatureChange(signatureData);
    }
  }, [isDrawing, currentStroke, startTime, strokes, totalDistance, onSignatureChange]);
  
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 300;
    
    ctx.clearRect(0, 0, width, height);
    
    setStrokes([]);
    setCurrentStroke([]);
    setLastPoint(null);
    setStartTime(null);
    setTotalDistance(0);
    setHasSignature(false);
    setIsDrawing(false);
    
    onClear();
  }, [onClear]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleTouchStart = (e: TouchEvent) => handleStart(e as unknown as React.TouchEvent);
    const handleTouchMove = (e: TouchEvent) => handleMove(e as unknown as React.TouchEvent);
    const handleTouchEnd = () => handleEnd();
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);
  
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = 300;
      
      canvas.width = width * dpr.current;
      canvas.height = height * dpr.current;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr.current, dpr.current);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#1a202c';
      }
      
      redrawCanvas();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [redrawCanvas]);
  
  return (
    <div ref={containerRef} className="canvas-container">
      <canvas
        ref={canvasRef}
        id="signatureCanvas"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      />
      {!hasSignature && !isPlaying && (
        <div className="canvas-placeholder">
          请在上方绘制您的签名
        </div>
      )}
      {isPlaying && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">回放中</span>
            <span className="text-sm text-slate-500">{progress.toFixed(1)}%</span>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 mt-6">
        <div className="button-group">
          <button
            onClick={handleClear}
            disabled={isPlaying}
            className="btn btn-secondary"
          >
            清除签名
          </button>
        </div>
        {signatureData && signatureData.strokes.length > 0 && (
          <div className="flex flex-col gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="button-group">
              <button
                onClick={play}
                disabled={isPlaying && !isPaused}
                className="btn btn-primary"
              >
                {isPaused ? '继续' : '播放'}
              </button>
              <button
                onClick={pause}
                disabled={!isPlaying || isPaused}
                className="btn btn-secondary"
              >
                暂停
              </button>
              <button
                onClick={reset}
                disabled={!isPlaying && !isPaused}
                className="btn btn-secondary"
              >
                重置
              </button>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <span className="text-sm font-medium text-slate-700">回放速度:</span>
              <select
                value={currentSpeed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={!isPlaying && !isPaused}
                className="px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-800 bg-white cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
                <option value="3">3x</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureCanvas;
