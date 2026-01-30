import React from 'react';
import { SignatureFeatures } from '../types';

interface FeaturesProps {
 features: SignatureFeatures | null;
}

const Features: React.FC<FeaturesProps> = ({ features }) => {
 const hasData = features !== null && features.strokeOrder > 0;

 return (<div className="flex flex-col gap-4">
 <div className="flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100
 rounded-xl border-l-5 border-blue-500 transition-all duration-300 hover:translate-x-1
 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
 <span className="font-semibold text-gray-800 text-sm">笔画速度:</span>
 <span className="font-semibold text-gray-500 text-sm">
 {hasData ? `${features?.strokeSpeed.toFixed(1)} px/s` : '-'}
 </span>
 </div>

 <div className="flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100
 rounded-xl border-l-5 border-blue-500 transition-all duration-300 hover:translate-x-1
 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
 <span className="font-semibold text-gray-800 text-sm">笔画压力:</span>
 <span className="font-semibold text-gray-500 text-sm">
 {hasData ? `${features?.strokePressure.toFixed(1)}%` : '-'}
 </span>
 </div>

 <div className="flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100
 rounded-xl border-l-5 border-blue-500 transition-all duration-300 hover:translate-x-1
 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
 <span className="font-semibold text-gray-800 text-sm">笔画顺序:</span>
 <span className="font-semibold text-gray-500 text-sm">
 {hasData ? features?.strokeOrder : '-'}
 </span>
 </div>

 <div className="flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100
 rounded-xl border-l-5 border-blue-500 transition-all duration-300 hover:translate-x-1
 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
 <span className="font-semibold text-gray-800 text-sm">签名时长:</span>
 <span className="font-semibold text-gray-500 text-sm">
 {hasData ? `${features?.signDuration.toFixed(2)}s` : '-'}
 </span>
 </div>
 </div>);
};

export default Features;
