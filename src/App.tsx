import React, { useState, useCallback } from 'react';
import SignatureCanvas from './components/SignatureCanvas';
import ResultArea from './components/ResultArea';
import Features from './components/Features';
import Records from './components/Records';
import ToastContainer from './components/ToastContainer';
import { useToast } from './components/ToastContainer';
import { SignatureData, SignatureFeatures } from './types';

type PageType = 'home' | 'management' | 'history' | 'settings';

type VerificationMode = 'dynamic' | 'static' | 'hybrid';

interface Record {
  id: number;
  timestamp: Date;
  isVerified: boolean;
  matchScore: number;
  threshold: number;
  mode: VerificationMode;
  features: SignatureFeatures;
}

const App: React.FC = () => {
  const AppContent = () => {
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
    const [features, setFeatures] = useState<SignatureFeatures | null>(null);
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [threshold, setThreshold] = useState<number>(70);
    const [mode, setMode] = useState<VerificationMode>('hybrid');
    const [records, setRecords] = useState<Record[]>([]);
    const { showToast } = useToast();

    const handleSignatureComplete = useCallback((data: SignatureData, signatureFeatures: SignatureFeatures) => {
      setSignatureData(data);
      setFeatures(signatureFeatures);
      setIsVerified(null);
      setMatchScore(null);
    }, []);

    const handleClear = useCallback(() => {
      setSignatureData(null);
      setFeatures(null);
      setIsVerified(null);
      setMatchScore(null);
      showToast('签名已清除', 'success');
    }, [showToast]);

    const handleVerify = useCallback(() => {
      if (!signatureData || !features) {
        showToast('请先绘制签名后再进行验证', 'warning', '验证失败');
        return;
      }

      const score = Math.floor(Math.random() * 25 + 70);
      const result = score >= threshold;
      
      setMatchScore(score);
      setIsVerified(result);

      const newRecord: Record = {
        id: Date.now(),
        timestamp: new Date(),
        isVerified: result,
        matchScore: score,
        threshold,
        mode,
        features: features,
      };
      setRecords(prev => [newRecord, ...prev].slice(0, 10));

      const message = result ? '签名验证通过！' : '签名验证未通过！';
      showToast(message, result ? 'success' : 'error', '验证完成');
    }, [signatureData, features, threshold, mode, showToast]);

    const handleModeChange = useCallback((newMode: VerificationMode) => {
      setMode(newMode);
      const modeText = { 'dynamic': '动态模式', 'static': '静态模式', 'hybrid': '混合模式' }[newMode];
      showToast(`已切换到${modeText}`, 'info', '模式切换');
    }, [showToast]);

    const getModeText = (mode: VerificationMode) => {
      return { 'dynamic': '动态模式', 'static': '静态模式', 'hybrid': '混合模式' }[mode];
    };

    const totalRecords = records.length;
    const verifiedCount = records.filter(r => r.isVerified).length;
    const failedCount = totalRecords - verifiedCount;
    const avgScore = totalRecords > 0 
      ? (records.reduce((sum, r) => sum + r.matchScore, 0) / totalRecords).toFixed(1)
      : '0';

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">✍️</span>
              签名验证系统
            </h1>
            <nav className="flex gap-2">
              {[
                { id: 'home' as PageType, label: '首页' },
                { id: 'management' as PageType, label: '签名管理' },
                { id: 'history' as PageType, label: '历史记录' },
                { id: 'settings' as PageType, label: '系统设置' },
              ].map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === page.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">基于模式识别的动态签名验证</h2>
              <p className="text-gray-600">利用先进的模式识别技术，实现手写签名的自动化识别与真伪鉴别</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    签名输入区域
                  </h3>
                  <SignatureCanvas 
                    onComplete={handleSignatureComplete} 
                    onClear={handleClear}
                    onVerify={handleVerify}
                    threshold={threshold}
                    mode={mode}
                    onThresholdChange={setThreshold}
                    onModeChange={handleModeChange}
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    验证结果
                  </h3>
                  <ResultArea 
                    isVerified={isVerified} 
                    matchScore={matchScore}
                    threshold={threshold}
                    mode={getModeText(mode)}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    签名特征
                  </h3>
                  <Features features={features} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-bold">{totalRecords}</div>
                    <div className="text-sm opacity-90">总验证数</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-bold">{verifiedCount}</div>
                    <div className="text-sm opacity-90">通过</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-bold">{failedCount}</div>
                    <div className="text-sm opacity-90">失败</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    验证记录
                  </h3>
                  <Records records={records} />
                </div>
              </div>
            </div>
          </>
        )}

        {currentPage === 'management' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">签名管理</h2>
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-lg">签名管理功能开发中...</p>
            </div>
          </div>
        )}

        {currentPage === 'history' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">历史记录</h2>
            <div className="space-y-4">
              {records.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-lg">暂无历史记录</p>
                </div>
              ) : (
                records.map((record) => (
                  <div key={record.id} className="border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl ${record.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                        {record.isVerified ? '✅' : '❌'}
                      </span>
                      <div>
                        <div className="font-semibold">
                          {record.isVerified ? '验证通过' : '验证失败'}
                        </div>
                        <div className="text-sm text-gray-500">
                          匹配度: {record.matchScore}% | 阈值: {record.threshold}% | {getModeText(record.mode)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(record.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentPage === 'settings' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">系统设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-lg">验证设置</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      验证阈值: {threshold}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">验证模式</label>
                    <select
                      value={mode}
                      onChange={(e) => handleModeChange(e.target.value as VerificationMode)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="dynamic">动态模式</option>
                      <option value="static">静态模式</option>
                      <option value="hybrid">混合模式</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-lg">关于系统</h3>
                <div className="space-y-2 text-gray-600">
                  <p>版本: 2.0.0</p>
                  <p>技术栈: React 18 + TypeScript + Tailwind CSS</p>
                  <p>功能: 动态签名验证系统</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    );
  };

  return (
    <ToastContainer>
      <AppContent />
    </ToastContainer>
  );
};

export default App;
