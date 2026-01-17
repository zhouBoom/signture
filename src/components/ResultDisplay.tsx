import React from 'react';
import { VerificationResult } from '../types';
interface ResultDisplayProps {
 result: VerificationResult | null;
 isVerifying: boolean;
}
const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isVerifying }) => {
 if (isVerifying) {
 return (<div className="result-area">
 <span className="result-placeholder">正在验证中...</span>
 </div>);
 }
 if (!result) {
 return (<div className="result-area">
 <span className="result-placeholder">等待验证...</span>
 </div>);
 }
 return (<div className={`result ${result.success ? 'success' : 'failed'}`}>
 <span className="result-icon">{result.success ? '✅' : '❌'}</span>
 <p className="result-text">
 {result.message}
 </p>
 <p className="result-score">
 匹配度: {result.matchScore}% (阈值: {result.threshold}%)
 </p>
 <p className="result-score">
 验证模式: {result.mode === 'dynamic' ? '动态模式' : result.mode === 'static' ? '静态模式' : '混合模式'}
 </p>
 </div>);
};
export default ResultDisplay;
