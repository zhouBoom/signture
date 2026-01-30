import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSignatureCanvas } from '@/hooks/useSignatureCanvas';

interface SignatureCanvasProps {
  onSignatureChange?: (hasSignature: boolean, signatureData?: any) => void;
}

const SignatureCanvas = forwardRef<any, SignatureCanvasProps>(({ onSignatureChange }, ref) => {
  const {
    canvasRef,
    hasSignature,
    signatureData,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  } = useSignatureCanvas();

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    clearCanvas,
    getSignatureData: () => signatureData,
  }));

  // 通知父组件签名状态变化
  useEffect(() => {
    if (onSignatureChange) {
      onSignatureChange(hasSignature, signatureData);
    }
  }, [hasSignature, signatureData, onSignatureChange]);

  // 设置 Canvas 事件监听
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 鼠标事件
    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDrawing();
    const handleMouseOut = () => stopDrawing();

    // 触摸事件
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      startDrawing(e);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      draw(e);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      stopDrawing();
    };

    // 添加事件监听
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // 清理函数
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseOut);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startDrawing, draw, stopDrawing]);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="signature-canvas"
        style={{ touchAction: 'none' }}
      />
      {!hasSignature && (
        <div className="canvas-placeholder">请在上方绘制您的签名</div>
      )}
    </div>
  );
});

SignatureCanvas.displayName = 'SignatureCanvas';

export default SignatureCanvas;