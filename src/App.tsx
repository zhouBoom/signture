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
 }, []);
 return (<div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-blue-400 bg-fixed">
 <Toast messages={messages} onClose={removeToast}/>
 <Header onNavigate={handleNavigate}/>
 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
 <section className="text-center mb-10">
 <h2 className="text-4xl font-extrabold text-white mb-4 text-shadow">
 基于模式识别的动态签名验证
 </h2>
 <p className="text-xl text-white/95 max-w-3xl mx-auto">
 利用先进的模式识别技术，实现手写签名的自动化识别与真伪鉴别
 </p>
 </section>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="flex flex-col gap-6">
 <Card title="签名输入区域" icon="📝">
 <SignatureCanvas onSignatureChange={handleSignatureChange} onClear={handleClear}/>
 </Card>
 <Card title="验证参数" icon="⚙️">
 <div className="space-y-6">
 <div>
 <label className="block font-semibold text-slate-800 mb-3">
 匹配阈值:
 </label>
 <div className="flex items-center gap-4">
 <input type="range" min="0" max="100" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="flex-1 h-2 rounded-md bg-gradient-to-r from-slate-200 to-slate-300 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-blue-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-blue-500 [&::-moz-range-thumb]:to-blue-700 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:transition-transform"/>
 <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent text-lg">
 {threshold}%
 </span>
 </div>
 </div>
 <div>
 <label className="block font-semibold text-slate-800 mb-3">
 验证模式:
 </label>
 <select value={mode} onChange={handleModeChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 bg-white cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium">
 <option value="dynamic">动态模式</option>
 <option value="static">静态模式</option>
 <option value="hybrid">混合模式</option>
 </select>
 </div>
 <button onClick={handleVerify} disabled={isVerifying} className="w-full px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
 {isVerifying ? '验证中...' : '验证签名'}
 </button>
 </div>
 </Card>
 </div>
 <div className="flex flex-col gap-6">
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
 <Footer/>
 </div>);
}
export default App;
