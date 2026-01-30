import { useRef, useEffect, useCallback, useState } from 'react';
import { useSignatureReplay } from '@/hooks/useSignatureReplay';
import { SignatureData } from '@/types';

interface SignatureReplayProps {
  signatureData: SignatureData | null;
}

const SignatureReplay = ({ signatureData }: SignatureReplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    isPlaying,
    progress,
    currentTime,
    totalDuration,
    speed,
    play,
    pause,
    reset,
    seek,
    changeSpeed,
    loadSignatureData,
  } = useSignatureReplay(canvasRef);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadSignatureData(signatureData);
  }, [signatureData, loadSignatureData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  const handleSpeedChange = useCallback((delta: number) => {
    const newSpeed = Math.max(0.1, Math.min(4, speed + delta));
    changeSpeed(Math.round(newSpeed * 10) / 10);
  }, [speed, changeSpeed]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const hasData = signatureData && signatureData.strokes.length > 0;

  return (
    <div className={`signature-replay ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="replay-header flex items-center justify-between mb-4">
        <h3 className="card-title text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="card-icon text-2xl">▶️</span>
          笔迹回放
        </h3>
        {hasData && (
          <button
            className="fullscreen-btn text-sm px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? '退出全屏' : '全屏播放'}
          </button>
        )}
      </div>

      <div className="replay-canvas-container relative bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="replay-canvas w-full h-48"
          style={{ touchAction: 'none' }}
        />
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-white/90">
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <p>请先绘制签名后再进行回放</p>
            </div>
          </div>
        )}
      </div>

      {hasData && (
        <>
          <div className="progress-section mt-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-slate-500 w-16">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-sm text-slate-500 w-16 text-right">
                {formatTime(totalDuration)}
              </span>
            </div>
            <div className="text-center text-xs text-slate-400">
              进度: {progress.toFixed(1)}%
            </div>
          </div>

          <div className="controls-section mt-4 flex flex-col gap-4">
            <div className="main-controls flex items-center justify-center gap-3">
              <button
                className="control-btn reset-btn w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all hover:scale-105"
                onClick={reset}
                title="重置"
              >
                <span className="text-xl">↺</span>
              </button>

              <button
                className="control-btn play-btn w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={isPlaying ? pause : play}
                title={isPlaying ? '暂停' : '播放'}
              >
                <span className="text-2xl">{isPlaying ? '⏸' : '▶'}</span>
              </button>

              <div className="speed-control flex items-center gap-1 bg-slate-100 rounded-full px-1">
                <button
                  className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                  onClick={() => handleSpeedChange(-0.1)}
                  disabled={speed <= 0.1}
                >
                  <span className="text-sm">−</span>
                </button>
                <span className="w-12 text-center text-sm font-medium text-slate-700">
                  {speed.toFixed(1)}x
                </span>
                <button
                  className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                  onClick={() => handleSpeedChange(0.1)}
                  disabled={speed >= 4}
                >
                  <span className="text-sm">+</span>
                </button>
              </div>
            </div>

            <div className="speed-presets flex justify-center gap-2">
              {[0.5, 1, 2, 3].map((preset) => (
                <button
                  key={preset}
                  className={`speed-preset px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    speed === preset
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  onClick={() => changeSpeed(preset)}
                >
                  {preset}x
                </button>
              ))}
            </div>
          </div>

          <div className="info-section mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">总笔画数：</span>
                <span className="font-medium text-slate-700">{signatureData?.strokeCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">总时长：</span>
                <span className="font-medium text-slate-700">{formatTime(totalDuration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">总距离：</span>
                <span className="font-medium text-slate-700">{(signatureData?.totalDistance || 0).toFixed(0)}px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">平均速度：</span>
                <span className="font-medium text-slate-700">{(signatureData?.averageSpeed || 0).toFixed(1)}px/s</span>
              </div>
            </div>
          </div>
        </>
      )}

      {isFullscreen && hasData && (
        <style>{`
          .signature-replay.fullscreen {
            position: fixed;
            inset: 0;
            z-index: 100;
            background: white;
            padding: 2rem;
            display: flex;
            flex-direction: column;
          }
          .signature-replay.fullscreen .replay-canvas-container {
            flex: 1;
            min-height: 60vh;
          }
          .signature-replay.fullscreen .replay-canvas {
            height: 100%;
          }
        `}</style>
      )}
    </div>
  );
};

export default SignatureReplay;
