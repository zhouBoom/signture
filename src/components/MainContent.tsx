import React, { useState, useEffect, useRef } from 'react';
import { FeatureData, VerifyResult } from '../types';

interface MainContentProps {
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error', title?: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ showToast }) => {
  const [threshold, setThreshold] = useState<number>(85);
  const [mode, setMode] = useState<string>('dynamic');
  const [features] = useState<FeatureData>({
    strokeSpeed: '-',
    strokePressure: '-',
    strokeOrder: 0,
    signDuration: '-'
  });
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClear = () => {
    setHasSignature(false);
    setResult(null);
    showToast('签名已清除', 'success');
  };

  const handleDraw = (signatureExists: boolean) => {
    setHasSignature(signatureExists);
  };



  const handleVerify = () => {
    const canvas = canvasRef.current;
    if (!canvas) return { hasSignature: false };

    const ctx = canvas.getContext('2d');
    if (!ctx) return { hasSignature: false };

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasSignature = imageData.data.some((channel, index) => {
      return index % 4 === 3 && channel !== 0;
    });

    return { hasSignature };
  };

  const verifySignature = () => {
    const { hasSignature } = handleVerify();

    if (!hasSignature) {
      showToast('请先绘制签名后再进行验证', 'warning', '验证失败');
      return;
    }

    setIsVerifying(true);
    setResult(null);

    setTimeout(() => {
      const matchScore = Math.floor(Math.random() * 25 + 70);
      const success = matchScore >= threshold;
      const message = success ? '签名验证通过！' : '签名验证未通过！';

      setResult({
        success,
        score: matchScore,
        mode,
        threshold
      });

      setIsVerifying(false);
      showToast(message, success ? 'success' : 'error', '验证完成');
    }, 1000);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value;
    setMode(newMode);
    const modeText = getModeText(newMode);
    showToast(`已切换到${modeText}`, 'info', '模式切换');
  };

  const getModeText = (modeValue: string): string => {
    const modes: Record<string, string> = {
      'dynamic': '动态模式',
      'static': '静态模式',
      'hybrid': '混合模式'
    };
    return modes[modeValue] || modeValue;
  };

  useEffect(() => {
    showToast('欢迎使用动态签名验证系统！', 'success', '欢迎');
  }, [showToast]);

  return (
    <main className="main py-10">
      <div className="container mx-auto px-5">
        <div className="section intro text-center mb-10">
          <h2 className="section-title text-4xl font-extrabold text-white mb-3.75 drop-shadow-lg drop-shadow-black/10">
            基于模式识别的动态签名验证
          </h2>
          <p className="section-desc text-1.25xl text-white/95 max-w-2xl mx-auto drop-shadow-md drop-shadow-black/10">
            利用先进的模式识别技术，实现手写签名的自动化识别与真伪鉴别
          </p>
        </div>

        <div className="content-grid grid grid-cols-1 lg:grid-cols-2 gap-7.5">
          <div className="left-panel flex flex-col gap-6.25">
            <div className="card">
              <h3 className="card-title">
                <span className="card-icon">📝</span>
                签名输入区域
              </h3>
              <div className="canvas-container relative mb-6">
                <canvas
                  id="signatureCanvas"
                  ref={canvasRef}
                  className="w-full h-[300px] border-3 border-dashed border-slate-300 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 cursor-crosshair transition-all duration-300 hover:border-primary-500 hover:bg-gradient-to-br hover:from-white hover:to-slate-50 hover:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                  onMouseDown={() => {
                    handleDraw(true);
                    setHasSignature(true);
                  }}
                  onTouchStart={() => {
                    handleDraw(true);
                    setHasSignature(true);
                  }}
                />
                {!hasSignature && (
                  <div className="canvas-placeholder absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 text-1.125xl pointer-events-none font-medium">
                    请在上方绘制您的签名
                  </div>
                )}
              </div>
              <div className="button-group flex gap-3.75 justify-center">
                <button
                  className="btn btn-primary"
                  id="clearBtn"
                  onClick={handleClear}
                >
                  清除签名
                </button>
                <button
                  className="btn btn-secondary"
                  id="verifyBtn"
                  onClick={verifySignature}
                >
                  验证签名
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">
                <span className="card-icon">⚙️</span>
                验证参数
              </h3>
              <div className="form-group mb-6.25">
                <label
                  htmlFor="threshold"
                  className="block font-semibold text-slate-900 mb-3 text-sm"
                >
                  匹配阈值:
                </label>
                <input
                  type="range"
                  id="threshold"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-gradient-to-r from-slate-200 to-slate-300 outline-none appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #1d4ed8 ${threshold}%, #e2e8f0 ${threshold}%, #cbd5e1 100%)`
                  }}
                />
                <span className="range-value ml-3.75 font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent text-1.125xl">
                  {threshold}%
                </span>
              </div>
              <div className="form-group">
                <label
                  htmlFor="mode"
                  className="block font-semibold text-slate-900 mb-3 text-sm"
                >
                  验证模式:
                </label>
                <select
                  id="mode"
                  value={mode}
                  onChange={handleModeChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-base text-slate-900 bg-white cursor-pointer transition-all duration-300 font-medium hover:border-primary-500 focus:outline-none focus:border-primary-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                >
                  <option value="dynamic">动态模式</option>
                  <option value="static">静态模式</option>
                  <option value="hybrid">混合模式</option>
                </select>
              </div>
            </div>
          </div>

          <div className="right-panel flex flex-col gap-6.25">
            <div className="card">
              <h3 className="card-title">
                <span className="card-icon">📊</span>
                验证结果
              </h3>
              <div className="result-area min-h-[180px] flex justify-center items-center border-3 border-dashed border-slate-300 rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-slate-100">
                {isVerifying ? (
                  <div className="result-placeholder text-slate-400 text-1.125xl font-medium">
                    正在验证中...
                  </div>
                ) : result ? (
                  <div className={`result ${result.success ? 'success' : 'failed'}`}>
                    <div className="result-icon">{result.success ? '✅' : '❌'}</div>
                    <div className="result-text">
                      {result.success ? '签名验证通过！' : '签名验证未通过！'}
                    </div>
                    <div className="result-score">
                      匹配度: {result.score}% (阈值: {result.threshold}%)
                    </div>
                    <div className="result-score">
                      验证模式: {getModeText(result.mode)}
                    </div>
                  </div>
                ) : (
                  <div className="result-placeholder text-slate-400 text-1.125xl font-medium">
                    等待验证...
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">
                <span className="card-icon">🔍</span>
                识别特征
              </h3>
              <div className="features flex flex-col gap-4">
                <div className="feature-item flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-l-5 border-primary-500 transition-all duration-300 hover:translate-x-2 hover:shadow-md hover:shadow-slate-200">
                  <span className="feature-label font-semibold text-slate-900 text-sm">笔画速度:</span>
                  <span className="feature-value text-slate-500 font-semibold text-sm" id="strokeSpeed">
                    {features.strokeSpeed}
                  </span>
                </div>
                <div className="feature-item flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-l-5 border-primary-500 transition-all duration-300 hover:translate-x-2 hover:shadow-md hover:shadow-slate-200">
                  <span className="feature-label font-semibold text-slate-900 text-sm">笔画压力:</span>
                  <span className="feature-value text-slate-500 font-semibold text-sm" id="strokePressure">
                    {features.strokePressure}
                  </span>
                </div>
                <div className="feature-item flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-l-5 border-primary-500 transition-all duration-300 hover:translate-x-2 hover:shadow-md hover:shadow-slate-200">
                  <span className="feature-label font-semibold text-slate-900 text-sm">笔画顺序:</span>
                  <span className="feature-value text-slate-500 font-semibold text-sm" id="strokeOrder">
                    {features.strokeOrder}
                  </span>
                </div>
                <div className="feature-item flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-l-5 border-primary-500 transition-all duration-300 hover:translate-x-2 hover:shadow-md hover:shadow-slate-200">
                  <span className="feature-label font-semibold text-slate-900 text-sm">签名时长:</span>
                  <span className="feature-value text-slate-500 font-semibold text-sm" id="signDuration">
                    {features.signDuration}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">
                <span className="card-icon">📋</span>
                最近验证记录
              </h3>
              <div className="records flex flex-col gap-3.5">
                <div className="record-item flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl transition-all duration-300 border border-slate-200 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200">
                  <span className="record-time text-slate-500 font-medium text-sm">2025-12-23 14:30</span>
                  <span className="record-result success px-4 py-2 rounded-full font-bold text-xs tracking-wider bg-gradient-to-br from-green-100 to-green-200 text-green-800">通过</span>
                </div>
                <div className="record-item flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl transition-all duration-300 border border-slate-200 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200">
                  <span className="record-time text-slate-500 font-medium text-sm">2025-12-23 14:25</span>
                  <span className="record-result failed px-4 py-2 rounded-full font-bold text-xs tracking-wider bg-gradient-to-br from-red-100 to-red-200 text-red-800">未通过</span>
                </div>
                <div className="record-item flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl transition-all duration-300 border border-slate-200 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200">
                  <span className="record-time text-slate-500 font-medium text-sm">2025-12-23 14:20</span>
                  <span className="record-result success px-4 py-2 rounded-full font-bold text-xs tracking-wider bg-gradient-to-br from-green-100 to-green-200 text-green-800">通过</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
