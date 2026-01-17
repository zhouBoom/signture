import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import SignatureCanvas from './components/SignatureCanvas';
import ResultDisplay from './components/ResultDisplay';
import SignatureFeatures from './components/SignatureFeatures';
import VerificationRecords from './components/VerificationRecords';
import Toast from './components/Toast';
import useSignatureVerification from './hooks/useSignatureVerification';
import useToast from './hooks/useToast';
import { SignatureData, VerificationMode, VerificationRecord } from './types';
import { generateId } from './utils/helpers';
function App() {
 const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
 const [threshold, setThreshold] = useState(85);
 const [mode, setMode] = useState<VerificationMode>('dynamic');
 const [features, setFeatures] = useState({
 strokeSpeed: '-',
 strokePressure: '-',
 strokeOrder: '-',
 signDuration: '-'
 });
 const [records, setRecords] = useState<VerificationRecord[]>([
 { id: generateId(), timestamp: '2026-01-23 14:30', result: 'success' },
 { id: generateId(), timestamp: '2026-01-23 14:25', result: 'failed' },
 { id: generateId(), timestamp: '2026-01-23 14:20', result: 'success' }
 ]);
 const { result, isVerifying, verifySignature, resetResult } = useSignatureVerification();
 const { messages, showToast, removeToast } = useToast();
 const handleSignatureChange = useCallback((data: SignatureData) => {
 setSignatureData(data);
 const duration = data.endTime && data.startTime
 ? ((data.endTime - data.startTime) / 1000).toFixed(2)
 : '0';
 const speed = parseFloat(duration) > 0
 ? (data.totalDistance / parseFloat(duration)).toFixed(1)
 : '0';
 const pressure = (Math.random() * 30 + 70).toFixed(1);
 setFeatures({
 strokeSpeed: `${speed} px/s`,
 strokePressure: `${pressure}%`,
 strokeOrder: data.strokeCount.toString(),
 signDuration: `${duration}s`
 });
 }, []);
 const handleClear = useCallback(() => {
 setSignatureData(null);
 setFeatures({
 strokeSpeed: '-',
 strokePressure: '-',
 strokeOrder: '-',
 signDuration: '-'
 });
 resetResult();
 showToast('签名已清除', 'success');
 }, [resetResult, showToast]);
 const handleVerify = useCallback(async () => {
 if (!signatureData || signatureData.strokes.length === 0) {
 showToast('请先绘制签名后再进行验证', 'warning', '验证失败');
 return;
 }
 await verifySignature(signatureData, threshold, mode);
 if (result) {
 const newRecord: VerificationRecord = {
 id: generateId(),
 timestamp: new Date().toLocaleString('zh-CN', {
 year: 'numeric',
 month: '2-digit',
 day: '2-digit',
 hour: '2-digit',
 minute: '2-digit'
 }).replace(/\//g, '-'),
 result: result.success ? 'success' : 'failed'
 };
 setRecords(prev => [newRecord, ...prev].slice(0, 5));
 showToast(result.message, result.success ? 'success' : 'error', '验证完成');
 }
 }, [signatureData, threshold, mode, verifySignature, result, showToast]);
 const handleNavigate = useCallback((page: string) => {
 const pageNames: Record<string, string> = {
 management: '签名管理',
 settings: '系统设置'
 };
 if (page !== 'home' && pageNames[page]) {
 showToast(`"${pageNames[page]}"功能正在开发中，敬请期待！`, 'info', '功能提示');
 }
 }, [showToast]);
 const handleModeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
 const newMode = e.target.value as VerificationMode;
 setMode(newMode);
 const modeLabels: Record<VerificationMode, string> = {
 dynamic: '动态模式',
 static: '静态模式',
 hybrid: '混合模式'
 };
 showToast(`已切换到${modeLabels[newMode]}`, 'info', '模式切换');
 }, [showToast]);
 useEffect(() => {
 showToast('欢迎使用动态签名验证系统！', 'success', '欢迎');
 }, [showToast]);
 return (<div className="min-h-screen">
 <Toast messages={messages} onClose={removeToast}/>
 <Header onNavigate={handleNavigate}/>
 <div className="container">
 <main className="main">
 <section className="section">
 <h2 className="section-title">
 基于模式识别的动态签名验证
 </h2>
 <p className="section-desc">
 利用先进的模式识别技术，实现手写签名的自动化识别与真伪鉴别
 </p>
 </section>
 <div className="content-grid">
 <div className="left-panel">
 <Card title="签名输入区域" icon="📝">
 <SignatureCanvas onSignatureChange={handleSignatureChange} onClear={handleClear} signatureData={signatureData} />
 </Card>
 <Card title="验证参数" icon="⚙️">
 <div className="form-group">
 <label>
 匹配阈值:
 </label>
 <div className="flex items-center gap-4">
 <input type="range" id="threshold" min="0" max="100" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))}/>
 <span className="range-value">
 {threshold}%
 </span>
 </div>
 </div>
 <div className="form-group">
 <label>
 验证模式:
 </label>
 <select id="mode" value={mode} onChange={handleModeChange}>
 <option value="dynamic">动态模式</option>
 <option value="static">静态模式</option>
 <option value="hybrid">混合模式</option>
 </select>
 </div>
 <div className="button-group">
 <button onClick={handleVerify} disabled={isVerifying} className="btn btn-primary">
 {isVerifying ? '验证中...' : '验证签名'}
 </button>
 </div>
 </Card>
 </div>
 <div className="right-panel">
 <Card title="验证结果" icon="📊">
 <ResultDisplay result={result} isVerifying={isVerifying}/>
 </Card>
 <Card title="识别特征" icon="🔍">
 <SignatureFeatures features={features}/>
 </Card>
 <Card title="最近验证记录" icon="📋">
 <VerificationRecords records={records}/>
 </Card>
 </div>
 </div>
 </main>
 </div>
 <Footer/>
 </div>);
}
export default App;
