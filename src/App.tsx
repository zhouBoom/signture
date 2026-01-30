import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { VerificationResult, VerificationMode, VerificationRecord, SignatureFeatures } from '@/types';
import { verifySignature, calculateSignatureFeatures, generateRecordId } from '@/utils/verification';

// 导入组件
import SignatureCanvas from '@/components/SignatureCanvas';
import SignatureReplayDemo from '@/components/SignatureReplayDemo';
import VerificationParams from '@/components/VerificationParams';
import VerificationResultComponent from '@/components/VerificationResult';
import SignatureFeaturesComponent from '@/components/SignatureFeatures';
import VerificationRecords from '@/components/VerificationRecords';
import Toast from '@/components/Toast';

const App: React.FC = () => {
  // 页面状态
  const [currentPage, setCurrentPage] = useState<'home' | 'replay'>('home');
  
  // 原有的状态管理
  const [threshold, setThreshold] = useState<number>(85);
  const [mode, setMode] = useState<VerificationMode>('dynamic');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [signatureFeatures, setSignatureFeatures] = useState<SignatureFeatures | null>(null);
  const [verificationRecords, setVerificationRecords] = useState<VerificationRecord[]>([
    {
      id: '1',
      timestamp: new Date('2025-12-23T14:30:00'),
      result: 'success',
      matchScore: 92,
      threshold: 85,
      mode: 'dynamic',
    },
    {
      id: '2',
      timestamp: new Date('2025-12-23T14:25:00'),
      result: 'failed',
      matchScore: 78,
      threshold: 85,
      mode: 'dynamic',
    },
    {
      id: '3',
      timestamp: new Date('2025-12-23T14:20:00'),
      result: 'success',
      matchScore: 88,
      threshold: 85,
      mode: 'dynamic',
    },
  ]);
  
  const [hasSignature, setHasSignature] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<any>(null);
  
  // 使用 ref 来获取 SignatureCanvas 组件的引用
  const signatureCanvasRef = useRef<any>(null);
  
  // 使用自定义 Hook
  const { toasts, addToast, removeToast } = useToast();

  // 处理签名变化
  const handleSignatureChange = useCallback((hasSig: boolean, sigData?: any) => {
    setHasSignature(hasSig);
    setSignatureData(sigData);
    
    if (hasSig && sigData) {
      // 计算并更新签名特征
      const features = calculateSignatureFeatures(sigData);
      setSignatureFeatures(features);
    } else {
      setSignatureFeatures(null);
      setVerificationResult(null);
    }
  }, []);

  // 清除签名
  const handleClearSignature = useCallback(() => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clearCanvas();
    }
    setHasSignature(false);
    setSignatureData(null);
    setSignatureFeatures(null);
    setVerificationResult(null);
    addToast({
      message: '签名已清除',
      type: 'success',
    });
  }, [addToast]);

  // 验证签名
  const handleVerifySignature = useCallback(() => {
    if (!hasSignature) {
      addToast({
        message: '请先绘制签名后再进行验证',
        type: 'warning',
        title: '验证失败',
      });
      return;
    }

    setIsVerifying(true);
    
    // 模拟验证过程
    setTimeout(() => {
      const result = verifySignature(signatureData, threshold, mode);
      setVerificationResult(result);
      setIsVerifying(false);
      
      // 添加验证记录
      const newRecord: VerificationRecord = {
        id: generateRecordId(),
        timestamp: new Date(),
        result: result.isValid ? 'success' : 'failed',
        matchScore: result.matchScore,
        threshold: result.threshold,
        mode: result.mode,
      };
      
      setVerificationRecords(prev => [newRecord, ...prev.slice(0, 9)]); // 保留最近10条记录
      
      // 显示通知
      addToast({
        message: result.isValid ? '签名验证通过！' : '签名验证未通过！',
        type: result.isValid ? 'success' : 'error',
        title: '验证完成',
      });
    }, 1000);
  }, [hasSignature, signatureData, threshold, mode, addToast]);

  // 处理导航点击
  const handleNavClick = useCallback((page: string) => {
    if (page === 'replay') {
      setCurrentPage('replay');
    } else if (page === 'home') {
      setCurrentPage('home');
    } else {
      const pageNames = {
        'management': '签名管理',
        'history': '历史记录',
        'settings': '系统设置',
      };
      addToast({
        message: `"${pageNames[page as keyof typeof pageNames]}"功能正在开发中，敬请期待！`,
        type: 'info',
        title: '功能提示',
      });
    }
  }, [addToast]);

  // 处理阈值变化
  const handleThresholdChange = useCallback((newThreshold: number) => {
    setThreshold(newThreshold);
  }, []);

  // 处理模式变化
  const handleModeChange = useCallback((newMode: VerificationMode) => {
    setMode(newMode);
    const modeText = {
      'dynamic': '动态模式',
      'static': '静态模式',
      'hybrid': '混合模式',
    };
    addToast({
      message: `已切换到${modeText[newMode]}`,
      type: 'info',
      title: '模式切换',
    });
  }, [addToast]);

  // 页面加载完成提示
  React.useEffect(() => {
    const timer = setTimeout(() => {
      addToast({
        message: '欢迎使用动态签名验证系统！',
        type: 'success',
        title: '欢迎',
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [addToast]);

  // 渲染首页内容
  const renderHomePage = () => (
    <>
      {/* Introduction Section */}
      <div className="section intro text-center mb-10">
        <h2 className="section-title text-4xl font-extrabold text-white mb-4">
          基于模式识别的动态签名验证
        </h2>
        <p className="section-desc text-lg text-white/95 max-w-3xl mx-auto">
          利用先进的模式识别技术，实现手写签名的自动化识别与真伪鉴别
        </p>
      </div>

      {/* Content Grid */}
      <div className="content-grid grid grid-cols-1 lg:grid-cols-2 gap-7.5">
        {/* Left Panel */}
        <div className="left-panel flex flex-col gap-6">
          {/* Signature Input Card */}
          <div className="glass-card">
            <h3 className="card-title text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="card-icon text-3xl">📝</span>
              签名输入区域
            </h3>
            <SignatureCanvas 
              ref={signatureCanvasRef}
              onSignatureChange={handleSignatureChange} 
            />
            <div className="button-group flex gap-4 justify-center">
              <button
                className="btn-primary"
                onClick={handleClearSignature}
              >
                清除签名
              </button>
              <button
                className="btn-secondary"
                onClick={handleVerifySignature}
                disabled={isVerifying}
              >
                {isVerifying ? '验证中...' : '验证签名'}
              </button>
            </div>
          </div>

          {/* Verification Parameters Card */}
          <div className="glass-card">
            <h3 className="card-title text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="card-icon text-3xl">⚙️</span>
              验证参数
            </h3>
            <VerificationParams
              threshold={threshold}
              mode={mode}
              onThresholdChange={handleThresholdChange}
              onModeChange={handleModeChange}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel flex flex-col gap-6">
          {/* Verification Result Card */}
          <div className="glass-card">
            <h3 className="card-title text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="card-icon text-3xl">📊</span>
              验证结果
            </h3>
            <VerificationResultComponent
              result={verificationResult}
              isVerifying={isVerifying}
            />
          </div>

          {/* Signature Features Card */}
          <div className="glass-card">
            <h3 className="card-title text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="card-icon text-3xl">🔍</span>
              识别特征
            </h3>
            <SignatureFeaturesComponent features={signatureFeatures} />
          </div>

          {/* Verification Records Card */}
          <div className="glass-card">
            <h3 className="card-title text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="card-icon text-3xl">📋</span>
              最近验证记录
            </h3>
            <VerificationRecords records={verificationRecords} />
          </div>
        </div>
      </div>
    </>
  );

  // 渲染签名回放页面
  const renderReplayPage = () => (
    <SignatureReplayDemo />
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="container mx-auto px-5">
          <div className="header-content flex justify-between items-center">
            <h1 className="logo text-3xl font-bold flex items-center gap-2.5">
              <span className="logo-icon text-4xl">✍️</span>
              签名验证系统
            </h1>
            <nav className="nav flex gap-2.5">
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              >
                首页
              </a>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'replay' ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); handleNavClick('replay'); }}
              >
                签名回放
              </a>
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('management'); }}>
                签名管理
              </a>
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('settings'); }}>
                系统设置
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main py-10">
        <div className="container mx-auto px-5">
          {currentPage === 'home' ? renderHomePage() : renderReplayPage()}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer bg-white/95 backdrop-blur-md text-slate-600 py-6 text-center mt-15">
        <div className="container mx-auto px-5">
          <div className="footer-content">
            <p className="font-medium">© 2025 动态签名验证系统 | 基于模式识别技术</p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <div className="fixed top-0 right-0 z-50 p-5 space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default App;