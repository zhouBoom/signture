import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSignatureReplay } from '@/hooks/useSignatureReplay';
import { SignatureData } from '@/types';

interface SignatureReplayProps {
  signatureData: SignatureData;
  onReplayComplete?: () => void;
  onReplayProgress?: (progress: number) => void;
  className?: string;
}

const SignatureReplay = forwardRef<any, SignatureReplayProps>(({
  signatureData,
  onReplayComplete,
  onReplayProgress,
  className = '',
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    isPlaying,
    playbackSpeed,
    replayProgress,
    startReplay,
    pauseReplay,
    resetReplay,
    setSpeed,
  } = useSignatureReplay({
    canvasRef,
    signatureData,
    onReplayComplete,
    onReplayProgress,
  });

  // 设置 Canvas
  useEffect(() => {
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

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    startReplay,
    pauseReplay,
    resetReplay,
    setSpeed,
    isPlaying,
    replayProgress,
  }));

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(parseFloat(e.target.value));
  };

  return (
    <div className={`signature-replay ${className}`}>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          style={{ touchAction: 'none' }}
        />
      </div>
      
      <div className="replay-controls">
        <div className="playback-controls">
          {!isPlaying ? (
            <button onClick={startReplay} className="play-button">
              <svg className="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
              </svg>
              播放
            </button>
          ) : (
            <button onClick={pauseReplay} className="pause-button">
              <svg className="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
              </svg>
              暂停
            </button>
          )}
          
          <button onClick={resetReplay} className="reset-button">
            <svg className="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18C8.69 18 6 15.31 6 12H4C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="currentColor"/>
            </svg>
            重置
          </button>
        </div>
        
        <div className="speed-control">
          <label htmlFor="speed-select">
            <svg className="control-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
            </svg>
            播放速度:
          </label>
          <select
            id="speed-select"
            value={playbackSpeed}
            onChange={handleSpeedChange}
          >
            <option value="0.5">0.5x 慢速</option>
            <option value="1">1x 正常</option>
            <option value="1.5">1.5x 快速</option>
            <option value="2">2x 倍速</option>
            <option value="3">3x 超快</option>
          </select>
        </div>
        
        <div className="progress-bar">
          <div className="progress-info">
            <span className="progress-label">
              <svg className="progress-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13H8V21H3V13Z" fill="currentColor"/>
                <path d="M10 8H15V21H10V8Z" fill="currentColor"/>
                <path d="M17 3H22V21H17V3Z" fill="currentColor"/>
              </svg>
              回放进度:
            </span>
          </div>
          <div className="progress-track-wrapper">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${replayProgress}%` }}
              />
            </div>
            <span className="progress-text">{Math.round(replayProgress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SignatureReplay.displayName = 'SignatureReplay';

export default SignatureReplay;