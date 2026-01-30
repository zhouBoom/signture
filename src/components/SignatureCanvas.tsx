import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, Stroke, SignatureData, SignatureFeatures } from '../types';

type VerificationMode = 'dynamic' | 'static' | 'hybrid';

interface SignatureCanvasProps {
  onComplete: (data: SignatureData, features: SignatureFeatures) => void;
  onClear: () => void;
  onVerify: () => void;
  threshold: number;
  mode: VerificationMode;
  onThresholdChange: (threshold: number) => void;
  onModeChange: (mode: VerificationMode) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onComplete,
  onClear,
  onVerify,
  threshold,
  mode,
  onThresholdChange,
  onModeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const canvasWidth = 500;
  const canvasHeight = 300;

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentStrokeRef = useRef<Point[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const lastPointRef = useRef<Point | null>(null);
  const totalDistanceRef = useRef<number>(0);
  const strokeCountRef = useRef<number>(0);
  const allStrokesRef = useRef<Stroke[]>([]);

  const getPixelRatio = useCallback(() => {
    if (typeof window !== 'undefined') {
      const canvas = canvasRef.current;
      if (!canvas) return 1;

      const ctx = canvas.getContext('2d');
      if (!ctx) return 1;

      const devicePixelRatio = window.devicePixelRatio || 1;
      const backingStoreRatio =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;

      return devicePixelRatio / backingStoreRatio;
    }
    return 1;
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = getPixelRatio();

    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(ratio, ratio);

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a202c';

    ctxRef.current = ctx;
  }, [getPixelRatio]);

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, timestamp: Date.now() };

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
      timestamp: Date.now(),
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (!ctxRef.current) return;

    const coords = getCoordinates(e);

    setIsDrawing(true);
    setHasSignature(true);

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    strokeCountRef.current++;
    currentStrokeRef.current = [coords];
    lastPointRef.current = coords;

    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  }, [getCoordinates]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (!isDrawing || !ctxRef.current) return;

    const coords = getCoordinates(e);
    currentStrokeRef.current.push(coords);

    if (lastPointRef.current) {
      const dx = coords.x - lastPointRef.current.x;
      const dy = coords.y - lastPointRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      totalDistanceRef.current += distance;
    }

    const ctx = ctxRef.current;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPointRef.current = coords;
  }, [isDrawing, getCoordinates]);

  const [currentFeatures, setCurrentFeatures] = useState<SignatureFeatures>({
    strokeSpeed: 0,
    strokePressure: 0,
    strokeOrder: 0,
    signDuration: 0,
  });

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (currentStrokeRef.current.length > 0) {
      const stroke: Stroke = {
        points: [...currentStrokeRef.current],
        duration: currentStrokeRef.current.length > 1
          ? currentStrokeRef.current[currentStrokeRef.current.length - 1].timestamp - currentStrokeRef.current[0].timestamp
          : 0,
        distance: 0,
      };
      allStrokesRef.current.push(stroke);
      currentStrokeRef.current = [];
    }

    lastPointRef.current = null;

    const signatureData: SignatureData = {
      strokes: [...allStrokesRef.current],
      totalDuration: startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000
        : 0,
      totalDistance: totalDistanceRef.current,
      strokeCount: strokeCountRef.current,
    };

    const features: SignatureFeatures = {
      strokeSpeed: totalDistanceRef.current / (signatureData.totalDuration || 1),
      strokePressure: Math.random() * 30 + 70,
      strokeOrder: strokeCountRef.current,
      signDuration: signatureData.totalDuration,
    };

    setCurrentFeatures(features);
    onComplete(signatureData, features);
  }, [isDrawing, onComplete]);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);

    startTimeRef.current = null;
    strokeCountRef.current = 0;
    totalDistanceRef.current = 0;
    lastPointRef.current = null;
    currentStrokeRef.current = [];
    allStrokesRef.current = [];

    setCurrentFeatures({
      strokeSpeed: 0,
      strokePressure: 0,
      strokeOrder: 0,
      signDuration: 0,
    });

    onClear();
  }, [onClear]);

  const getImageData = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    initCanvas();
    
    const handleResize = () => {
      const hasContent = hasSignature;
      if (hasContent) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            initCanvas();
            if (ctxRef.current) {
              ctxRef.current.putImageData(imageData, 0, 0);
            }
          }
        }
      } else {
        initCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, hasSignature]);

  return (
    <div>
      <div ref={containerRef} className="relative mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-[300px] border-3 border-dashed border-gray-300 rounded-xl cursor-crosshair
            bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300
            hover:border-blue-500 hover:from-white hover:to-slate-50 hover:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            text-gray-400 text-lg font-medium pointer-events-none">
            请在上方绘制您的签名
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg
              transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            清除签名
          </button>
          <button
            onClick={onVerify}
            disabled={!hasSignature}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
              text-white font-medium py-2 px-4 rounded-lg transition-all duration-200
              flex items-center justify-center gap-2"
          >
            <span>✅</span>
            验证签名
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              验证阈值: {threshold}%
            </label>
            <input
              type="range"
              min="50"
              max="95"
              value={threshold}
              onChange={(e) => onThresholdChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>宽松 (50%)</span>
              <span>严格 (95%)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              验证模式
            </label>
            <div className="flex gap-2">
              {[
                { value: 'dynamic' as VerificationMode, label: '动态模式' },
                { value: 'static' as VerificationMode, label: '静态模式' },
                { value: 'hybrid' as VerificationMode, label: '混合模式' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onModeChange(option.value)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${mode === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureCanvas;
