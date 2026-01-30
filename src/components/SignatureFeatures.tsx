import React from 'react';
import { SignatureFeatures } from '@/types';

interface SignatureFeaturesProps {
  features: SignatureFeatures | null;
}

const SignatureFeaturesComponent: React.FC<SignatureFeaturesProps> = ({
  features,
}) => {
  return (
    <div className="features space-y-4">
      <div className="feature-item">
        <span className="feature-label">笔画速度:</span>
        <span className="feature-value">
          {features ? features.strokeSpeed : '-'}
        </span>
      </div>
      <div className="feature-item">
        <span className="feature-label">笔画压力:</span>
        <span className="feature-value">
          {features ? features.strokePressure : '-'}
        </span>
      </div>
      <div className="feature-item">
        <span className="feature-label">笔画顺序:</span>
        <span className="feature-value">
          {features ? features.strokeOrder : '-'}
        </span>
      </div>
      <div className="feature-item">
        <span className="feature-label">签名时长:</span>
        <span className="feature-value">
          {features ? features.signDuration : '-'}
        </span>
      </div>
    </div>
  );
};

export default SignatureFeaturesComponent;