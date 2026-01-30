import { useRef, useEffect, useCallback, useState } from 'react';
import { Point, Stroke, SignatureData } from '@/types';

export const useSignatureCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureData>({
    strokes: [],
    totalDuration: 0,
    totalDistance: 0,
    averageSpeed: 0,
    strokeCount: 0,
  });
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  // 设置 Canvas 高 DPI 支持，解决高分屏模糊问题
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取设备像素比
    const dpr = window.devicePixelRatio || 1;
    
    // 获取 CSS 尺寸
    const rect = canvas.getBoundingClientRect();
    
    // 设置实际尺寸，考虑设备像素比
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // 缩放上下文以匹配设备像素比
    ctx.scale(dpr, dpr);
    
    // 设置 CSS 尺寸
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // 设置绘制样式
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a202c';
  }, []);

  // 初始化 Canvas
  useEffect(() => {
    setupCanvas();
    
    // 监听窗口大小变化
    const handleResize = () => {
      setupCanvas();
      // 重绘签名
      redrawSignature();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  // 重绘签名
  const redrawSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // 重绘所有笔画
    signatureData.strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      
      ctx.stroke();
    });
  }, [signatureData.strokes]);

  // 获取坐标
  const getCoordinates = useCallback((event: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      time: Date.now(),
    };
  }, []);

  // 计算两点之间的距离
  const calculateDistance = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // 开始绘制
  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    
    const point = getCoordinates(event);
    const newStroke: Stroke = {
      points: [point],
      startTime: Date.now(),
      endTime: Date.now(),
    };
    
    setCurrentStroke(newStroke);
    setIsDrawing(true);
    setHasSignature(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }, [getCoordinates]);

  // 绘制
  const draw = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDrawing || !currentStroke) return;
    
    event.preventDefault();
    
    const point = getCoordinates(event);
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point],
      endTime: Date.now(),
    };
    
    setCurrentStroke(updatedStroke);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }, [isDrawing, currentStroke, getCoordinates]);

  // 停止绘制
  const stopDrawing = useCallback(() => {
    if (!isDrawing || !currentStroke) return;
    
    // 计算笔画距离
    let strokeDistance = 0;
    for (let i = 1; i < currentStroke.points.length; i++) {
      strokeDistance += calculateDistance(
        currentStroke.points[i - 1],
        currentStroke.points[i]
      );
    }
    
    // 更新签名数据
    setSignatureData(prevData => {
      const newStrokes = [...prevData.strokes, currentStroke];
      const totalDistance = prevData.totalDistance + strokeDistance;
      const totalDuration = currentStroke.endTime - currentStroke.startTime;
      const averageSpeed = totalDuration > 0 ? totalDistance / (totalDuration / 1000) : 0;
      
      return {
        strokes: newStrokes,
        totalDuration: prevData.totalDuration + totalDuration,
        totalDistance,
        averageSpeed,
        strokeCount: newStrokes.length,
      };
    });
    
    setCurrentStroke(null);
    setIsDrawing(false);
  }, [isDrawing, currentStroke, calculateDistance]);

  // 清除画布
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    setSignatureData({
      strokes: [],
      totalDuration: 0,
      totalDistance: 0,
      averageSpeed: 0,
      strokeCount: 0,
    });
    setHasSignature(false);
  }, []);

  // 获取签名图像数据
  const getImageData = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    return canvas.toDataURL();
  }, []);

  return {
    canvasRef,
    isDrawing,
    signatureData,
    hasSignature,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    getImageData,
    setupCanvas,
  };
};