import { useState, useRef } from 'react';
import SignatureCanvas from '@/components/SignatureCanvas';
import SignatureReplay from '@/components/SignatureReplay';
import { SignatureData } from '@/types';

const SignatureReplayDemo = () => {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    strokes: [],
    totalDuration: 0,
    totalDistance: 0,
    averageSpeed: 0,
    strokeCount: 0,
  });
  const [hasSignature, setHasSignature] = useState(false);
  const [activeTab, setActiveTab] = useState<'draw' | 'replay'>('draw');
  const replayRef = useRef<any>(null);

  const handleSignatureChange = (hasSig: boolean, sigData?: SignatureData) => {
    setHasSignature(hasSig);
    if (sigData) {
      setSignatureData(sigData);
    }
  };

  const handleReplayComplete = () => {
    console.log('回放完成');
  };

  const handleReplayProgress = (progress: number) => {
    console.log(`回放进度: ${progress.toFixed(2)}%`);
  };

  const switchToReplay = () => {
    if (hasSignature) {
      setActiveTab('replay');
    }
  };

  return (
    <div className="signature-replay-demo">
      <div className="demo-header">
        <div className="demo-title">
          <span className="demo-icon">✍️</span>
          <h1>签名回放演示</h1>
        </div>
        <p className="demo-description">
          绘制您的签名，然后以不同速度回放签名过程，体验流畅的笔迹回放效果
        </p>
      </div>

      <div className="demo-content">
        <div className="demo-main">
          <div className="demo-card">
            <div className="demo-tabs">
              <button
                className={`demo-tab ${activeTab === 'draw' ? 'active' : ''}`}
                onClick={() => setActiveTab('draw')}
              >
                <span className="tab-icon">✏️</span>
                <span>绘制签名</span>
              </button>
              <button
                className={`demo-tab ${activeTab === 'replay' ? 'active' : ''}`}
                onClick={switchToReplay}
                disabled={!hasSignature}
              >
                <span className="tab-icon">▶️</span>
                <span>回放签名</span>
              </button>
            </div>

            <div className="demo-content-area">
              {activeTab === 'draw' ? (
                <div className="draw-content">
                  <div className="canvas-wrapper">
                    <SignatureCanvas onSignatureChange={handleSignatureChange} />
                  </div>
                  
                  <div className="action-buttons">
                    <button
                      className={`action-button ${hasSignature ? 'primary' : 'disabled'}`}
                      onClick={switchToReplay}
                      disabled={!hasSignature}
                    >
                      <span className="button-icon">▶️</span>
                      查看回放
                    </button>
                  </div>
                </div>
              ) : (
                <div className="replay-content">
                  <SignatureReplay
                    ref={replayRef}
                    signatureData={signatureData}
                    onReplayComplete={handleReplayComplete}
                    onReplayProgress={handleReplayProgress}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="demo-sidebar">
          <div className="info-card">
            <div className="info-header">
              <span className="info-icon">📊</span>
              <h3>签名信息</h3>
            </div>
            
            <div className="info-content">
              <div className="info-item">
                <div className="info-label">
                  <span className="label-icon">✏️</span>
                  笔画数量
                </div>
                <div className="info-value">{signatureData.strokeCount}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <span className="label-icon">⏱️</span>
                  总时长
                </div>
                <div className="info-value">{(signatureData.totalDuration / 1000).toFixed(2)} 秒</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <span className="label-icon">📏</span>
                  总距离
                </div>
                <div className="info-value">{signatureData.totalDistance.toFixed(2)} 像素</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <span className="label-icon">🚀</span>
                  平均速度
                </div>
                <div className="info-value">{signatureData.averageSpeed.toFixed(2)} 像素/秒</div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-header">
              <span className="info-icon">💡</span>
              <h3>使用说明</h3>
            </div>
            
            <div className="info-content">
              <div className="instruction-list">
                <div className="instruction-item">
                  <span className="step-number">1</span>
                  <span>在左侧画布上绘制您的签名</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">2</span>
                  <span>点击"查看回放"切换到回放模式</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">3</span>
                  <span>使用播放控制按钮控制回放</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">4</span>
                  <span>调整播放速度以不同速率查看回放</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">5</span>
                  <span>进度条显示当前回放进度</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 添加一些额外的样式
const style = document.createElement('style');
style.textContent = `
  .signature-replay-demo {
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .demo-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .demo-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .demo-icon {
    font-size: 2.5rem;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
  
  .demo-title h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
  
  .demo-description {
    font-size: 1.1rem;
    color: #64748b;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  .demo-content {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 30px;
  }
  
  .demo-main {
    display: flex;
    flex-direction: column;
  }
  
  .demo-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    border: 1px solid #f1f5f9;
    transition: all 0.3s ease;
  }
  
  .demo-card:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  
  .demo-tabs {
    display: flex;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .demo-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 20px;
    background: transparent;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .demo-tab:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
  
  .demo-tab.active {
    color: #3b82f6;
    background: white;
  }
  
  .demo-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6 0%, #7c3aed 100%);
  }
  
  .demo-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .tab-icon {
    font-size: 1.2rem;
  }
  
  .demo-content-area {
    padding: 30px;
  }
  
  .draw-content {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
  
  .canvas-wrapper {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .action-button.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  .action-button.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }
  
  .action-button.disabled {
    background: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
  }
  
  .button-icon {
    font-size: 1.1rem;
  }
  
  .replay-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .demo-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .info-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    border: 1px solid #f1f5f9;
  }
  
  .info-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
  }
  
  .info-icon {
    font-size: 1.5rem;
  }
  
  .info-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .info-content {
    padding: 20px;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .info-item:last-child {
    border-bottom: none;
  }
  
  .info-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    color: #64748b;
  }
  
  .label-icon {
    font-size: 1.1rem;
  }
  
  .info-value {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .instruction-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .instruction-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .instruction-item span:last-child {
    font-size: 0.95rem;
    color: #475569;
    line-height: 1.5;
    padding-top: 2px;
  }
  
  @media (max-width: 1024px) {
    .demo-content {
      grid-template-columns: 1fr;
    }
    
    .demo-sidebar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  }
  
  @media (max-width: 640px) {
    .signature-replay-demo {
      padding: 15px;
    }
    
    .demo-title h1 {
      font-size: 2rem;
    }
    
    .demo-description {
      font-size: 1rem;
    }
    
    .demo-sidebar {
      grid-template-columns: 1fr;
    }
    
    .demo-content-area {
      padding: 20px;
    }
  }
`;
document.head.appendChild(style);

export default SignatureReplayDemo;