import React from 'react';
import { VerificationResult } from '@/types';
import { getVerificationModeText } from '@/utils/verification';

interface VerificationResultProps {
  result: VerificationResult | null;
  isVerifying: boolean;
}

const VerificationResultComponent: React.FC<VerificationResultProps> = ({
  result,
  isVerifying,
}) => {
  if (isVerifying) {
    return (
      <div className="result-area">
        <div className="result-placeholder">正在验证中...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-area">
        <div className="result-placeholder">等待验证...</div>
      </div>
    );
  }

  return (
    <div className="result-area">
      <div className={`result ${result.isValid ? 'success' : 'failed'}`}>
        <div className="result-icon">
          {result.isValid ? '✅' : '❌'}
        </div>
        <div className="result-text">
          {result.isValid ? '签名验证通过！' : '签名验证未通过！'}
        </div>
        <div className="result-score">
          匹配度: {result.matchScore}% (阈值: {result.threshold}%)
        </div>
        <div className="result-score">
          验证模式: {getVerificationModeText(result.mode)}
        </div>
      </div>
    </div>
  );
};

export default VerificationResultComponent;