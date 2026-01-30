import React from 'react';
import { VerifyResult } from '../types';

interface ResultAreaProps {
 result: VerifyResult | null;
 isVerifying: boolean;
}

const ResultArea: React.FC<ResultAreaProps> = ({ result, isVerifying }) => {
 if (isVerifying) {
 return (<div className="min-h-[180px] flex justify-center items-center border-3 border-dashed border-gray-300
 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-slate-100">
 <div className="text-gray-400 text-lg font-medium">正在验证中...</div>
 </div>);
 }

 if (!result) {
 return (<div className="min-h-[180px] flex justify-center items-center border-3 border-dashed border-gray-300
 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-slate-100">
 <div className="text-gray-400 text-lg font-medium">等待验证...</div>
 </div>);
 }

 const modeNames: Record<string, string> = {
 dynamic: '动态模式',
 static: '静态模式',
 hybrid: '混合模式',
 };

 return (<div className={`text-center p-9 rounded-xl animate-fade-in-scale w-full
 ${result.success
 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-3 border-emerald-500 shadow-[0_8px_24px_rgba(16,185,129,0.2)]'
 : 'bg-gradient-to-br from-red-50 to-red-100 border-3 border-red-500 shadow-[0_8px_24px_rgba(239,68,68,0.2)]'}`}>
 <div className="text-5xl mb-4 animate-bounce-icon">
 {result.success ? '✅' : '❌'}
 </div>
 <div className={`text-2xl font-bold mb-3
 ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
 {result.success ? '签名验证通过！' : '签名验证未通过！'}
 </div>
 <div className="text-lg text-gray-600 font-semibold">
 匹配度: {result.matchScore}% (阈值: {result.threshold}%)
 </div>
 <div className="text-lg text-gray-600 font-semibold mt-1">
 验证模式: {modeNames[result.mode] || result.mode}
 </div>
 </div>);
};

export default ResultArea;
