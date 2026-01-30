import React from 'react';
import { VerificationMode } from '@/types';

interface VerificationParamsProps {
  threshold: number;
  mode: VerificationMode;
  onThresholdChange: (threshold: number) => void;
  onModeChange: (mode: VerificationMode) => void;
}

const VerificationParams: React.FC<VerificationParamsProps> = ({
  threshold,
  mode,
  onThresholdChange,
  onModeChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="form-group">
        <label htmlFor="threshold" className="form-label">
          匹配阈值:
        </label>
        <div className="flex items-center">
          <input
            type="range"
            id="threshold"
            min="0"
            max="100"
            value={threshold}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
            className="range-slider flex-1"
          />
          <span className="range-value">{threshold}%</span>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="mode" className="form-label">
          验证模式:
        </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => onModeChange(e.target.value as VerificationMode)}
          className="form-select"
        >
          <option value="dynamic">动态模式</option>
          <option value="static">静态模式</option>
          <option value="hybrid">混合模式</option>
        </select>
      </div>
    </div>
  );
};

export default VerificationParams;