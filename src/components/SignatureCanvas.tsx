import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SignatureCanvasProps {
  onClear: () => void;
  onDraw: (hasSignature: boolean) => void;
  onFeaturesUpdate: (
    features: {
      strokeSpeed: string;
      strokePressure: string;
      strokeOrder: number;
      signDuration: string;
    }
  ) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onClear,
  onDraw,
  onFeaturesUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const strokeCountRef = useRef(0);
  const totalDistanceRef = useRef(0);
  const lastPointRef = useRef<Point | null>(null);
  const isMountedRef = useRef(true);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // High-performance rendering using requestAnimationFrame
  const animationFrameRef = useRef<number | null>(null);
  const pendingPointsRef = useRef<Point[]>([]);

  // Get device pixel ratio for Retina/HiDPI support
  const getPixelRatio = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 1;
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = 
      (ctx as any).webkitBackingStorePixelRatio ||
      (ctx as any).mozBackingStorePixelRatio ||
      (ctx as any).msBackingStorePixelRatio ||
      (ctx as any).oBackingStorePixelRatio ||
      (ctx as any).backingStorePixelRatio || 1;
    
    return devicePixelRatio / backingStoreRatio;
  }, []);

  // Setup canvas with proper resolution for Retina displays
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const pixelRatio = getPixelRatio();
    const rect = container.getBoundingClientRect();
    
    // Set canvas size based on container and pixel ratio
    const width = rect.width * pixelRatio;
    const height = 300 * pixelRatio;
    
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = '300px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;
    
    // Scale context for high resolution
    ctx.scale(pixelRatio, pixelRatio);
    
    // Configure line styles
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a202c';
  }, [getPixelRatio]);

  // Initialize canvas
  useEffect(() => {
    isMountedRef.current = true;
    setupCanvas();
    
    // Handle window resize
    const handleResize = () => {
      if (isMountedRef.current) {
        setupCanvas();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setupCanvas]);

  // Bind canvas events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      startDrawing(e as unknown as React.MouseEvent);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      draw(e as unknown as React.MouseEvent);
    };
    
    const handleMouseUp = () => {
      stopDrawing();
    };
    
    const handleMouseLeave = () => {
      stopDrawing();
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      startDrawing(e as unknown as React.TouchEvent);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      draw(e as unknown as React.TouchEvent);
    };
    
    const handleTouchEnd = () => {
      stopDrawing();
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startDrawing, draw, stopDrawing]);

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = getPixelRatio();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width) / pixelRatio,
      y: (clientY - rect.top) * (canvas.height / rect.height) / pixelRatio
    };
  }, [getPixelRatio]);

  const updateFeatures = useCallback(() => {
    const duration = startTimeRef.current
      ? ((Date.now() - startTimeRef.current) / 1000).toFixed(2)
      : '0';
    const speed = parseFloat(duration) > 0
      ? (totalDistanceRef.current / parseFloat(duration)).toFixed(1)
      : '0';
    const pressure = (Math.random() * 30 + 70).toFixed(1);
    
    if (isMountedRef.current) {
      onFeaturesUpdate({
        strokeSpeed: `${speed} px/s`,
        strokePressure: `${pressure}%`,
        strokeOrder: strokeCountRef.current,
        signDuration: `${duration}s`
      });
    }
  }, [onFeaturesUpdate]);

  const resetFeatures = useCallback(() => {
    if (isMountedRef.current) {
      onFeaturesUpdate({
        strokeSpeed: '-',
        strokePressure: '-',
        strokeOrder: 0,
        signDuration: '-'
      });
    }
  }, [onFeaturesUpdate]);

  // Clear button handler
  const handleClearClick = useCallback(() => {
    onClear();
    setShowPlaceholder(true);
  }, [onClear]);

  // Verify button handler
  const handleVerifyClick = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return { hasSignature: false };

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasSignature = imageData.data.some((channel, index) => {
      return index % 4 === 3 && channel !== 0;
    });

    return { hasSignature };
  }, []);

  // High-performance rendering loop
  const render = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (pendingPointsRef.current.length > 1) {
      ctx.beginPath();
      ctx.moveTo(pendingPointsRef.current[0].x, pendingPointsRef.current[0].y);
      
      // Use quadraticCurveTo for smoother lines
      for (let i = 1; i < pendingPointsRef.current.length - 1; i++) {
        const xc = (pendingPointsRef.current[i].x + pendingPointsRef.current[i + 1].x) / 2;
        const yc = (pendingPointsRef.current[i].y + pendingPointsRef.current[i + 1].y) / 2;
        ctx.quadraticCurveTo(
          pendingPointsRef.current[i].x,
          pendingPointsRef.current[i].y,
          xc,
          yc
        );
      }
      
      ctx.stroke();
      pendingPointsRef.current = [];
    }
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const coords = getCoordinates(e);

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    strokeCountRef.current++;
    lastPointRef.current = coords;

    const ctx = ctxRef.current;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }

    setShowPlaceholder(false);
    updateFeatures();
  }, [getCoordinates, updateFeatures]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();

    const coords = getCoordinates(e);

    // Calculate distance
    if (lastPointRef.current) {
      const dx = coords.x - lastPointRef.current.x;
      const dy = coords.y - lastPointRef.current.y;
      totalDistanceRef.current += Math.sqrt(dx * dx + dy * dy);
    }

    lastPointRef.current = coords;
    pendingPointsRef.current.push(coords);

    // Schedule rendering
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        render();
        animationFrameRef.current = null;
      });
    }

    updateFeatures();
    onDraw(true);
  }, [getCoordinates, updateFeatures, render, onDraw]);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.closePath();
    }
    lastPointRef.current = null;
  }, []);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const pixelRatio = getPixelRatio();
    ctx.clearRect(0, 0, rect.width * pixelRatio, 300 * pixelRatio);
    
    setShowPlaceholder(true);
    startTimeRef.current = null;
    strokeCountRef.current = 0;
    totalDistanceRef.current = 0;
    lastPointRef.current = null;
    pendingPointsRef.current = [];
    
    resetFeatures();
    onClear();
  }, [getPixelRatio, resetFeatures, onClear]);

  return (
    <div className="card">
      <h3 className="card-title">
        <span className="card-icon">📝</span>
        签名输入区域
      </h3>
      <div className="canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="w-full h-[300px] border-3 border-dashed border-slate-300 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 cursor-crosshair transition-all duration-300 hover:border-primary-500 hover:bg-gradient-to-br hover:from-white hover:to-slate-50 hover:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
        />
        {showPlaceholder && (
          <div className="canvas-placeholder">请在上方绘制您的签名</div>
        )}
      </div>
      <div className="button-group flex gap-3.75 justify-center">
        <button
          className="btn btn-primary"
          id="clearBtn"
          onClick={handleClearClick}
        >
          清除签名
        </button>
        <button
          className="btn btn-secondary"
          id="verifyBtn"
          onClick={handleVerifyClick}
        >
          验证签名
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
