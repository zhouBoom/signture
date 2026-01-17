import React from 'react';
import { VerificationResult } from '../types';
interface ResultDisplayProps {
 result: VerificationResult | null;
 isVerifying: boolean;
}
const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isVerifying }) => {
 if (isVerifying) {
 return (<div className="min-h-[180px] flex items-center justify-center border-3 border-dashed border-cbd5e1 rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-slate-100">
 <span className="text-slate-400 text-lg font-medium">正在验证中...</span>
 </div>);
 }
 if (!result) {
 return (<div className="min-h-[180px] flex items-center justify-center border-3 border-dashed border-cbd5e1 rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-slate-100">
 <span className="text-slate-400 text-lg font-medium">等待验证...</span>
 </div>);
 }
 return (<div className={`min-h-[180px] flex flex-col items-center justify-center border-3 rounded-2xl p-8 animate-fade-in-scale ${result.success
 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-500 shadow-[0_8px_24px_rgba(16,185,129,0.2)]'
 : 'bg-gradient-to-br from-red-50 to-red-100 border-red-500 shadow-[0_8px_24px_rgba(239,68,68,0.2)]'}`}>
 <span className="text-5xl mb-4 animate-bounce">{result.success ? '✅' : '❌'}</span>
 <p className={`text-2xl font-bold mb-3 ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
 {result.message}
 </p>
 <p className="text-lg font-semibold text-slate-600">
 匹配度: {result.matchScore}% (阈值: {result.threshold}%)
 </p>
 <p className="text-lg font-semibold text-slate-600 mt-1">
 验证模式: {result.mode === 'dynamic' ? '动态模式' : result.mode === 'static' ? '静态模式' : '混合模式'}
 </p>
 </div>);
};
export default ResultDisplay;
