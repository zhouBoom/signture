import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Point, Stroke, SignatureData } from '../types';
import { getDevicePixelRatio, calculateDistance } from '../utils/helpers';

interface SignatureCanvasProps {
  onSignatureChange: (data: SignatureData) => void;
  onClear: () => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSignatureChange, onClear }) => {
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
  
  useEffect(() => {
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
    
    return () => {
      if (ctx) {
        ctx.scale(1 / dpr.current, 1 / dpr.current);
      }
    };
  }, [dpr]);
  
  useEffect(() => {
    redrawCanvas();
  }, [strokes, currentStroke]);
  
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
  
  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return { x: 0, y: 0, timestamp: Date.now() };
    
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
    <div ref={containerRef} className="relative mb-6">
      <canvas
        ref={canvasRef}
        className="w-full h-[300px] border-3 border-dashed border-cbd5e1 rounded-2xl cursor-crosshair transition-all duration-300 bg-gradient-to-br from-slate-50 to-slate-100 hover:border-blue-500 hover:from-white hover:to-slate-50 hover:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      />
      {!hasSignature && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-slate-400 text-lg font-medium">请在上方绘制您的签名</span>
        </div>
      )}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={handleClear}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          清除签名
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
