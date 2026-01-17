import React from 'react';
interface SignatureFeaturesProps {
 features: {
 strokeSpeed: string;
 strokePressure: string;
 strokeOrder: string;
 signDuration: string;
 };
}
const SignatureFeatures: React.FC<SignatureFeaturesProps> = ({ features }) => {
 const featureList = [
 { label: '笔画速度', value: features.strokeSpeed },
 { label: '笔画压力', value: features.strokePressure },
 { label: '笔画顺序', value: features.strokeOrder },
 { label: '签名时长', value: features.signDuration },
 ];
 return (<div className="features">
 {featureList.map((feature, index) => (<div key={index} className="feature-item">
 <span className="feature-label">{feature.label}:</span>
 <span className="feature-value">{feature.value}</span>
 </div>))}
 </div>);
};
export default SignatureFeatures;
