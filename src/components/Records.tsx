import React from 'react';
import { VerifyResult } from '../types';

interface RecordsProps {
 records: VerifyResult[];
}

const Records: React.FC<RecordsProps> = ({ records }) => {
 const formatDate = (date: Date) => {
 return new Date(date).toLocaleString('zh-CN', {
 year: 'numeric',
 month: '2-digit',
 day: '2-digit',
 hour: '2-digit',
 minute: '2-digit',
 });
 };

 return (<div className="flex flex-col gap-3">
 {records.map((record, index) => (<div key={index} className="flex justify-between items-center p-4
 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-gray-200
 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
 <span className="text-gray-500 font-medium text-sm">
 {formatDate(record.timestamp)}
 </span>
 <span className={`px-4 py-2 rounded-full font-bold text-xs tracking-wider
 ${record.success
 ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700'
 : 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'}`}>
 {record.success ? '通过' : '未通过'}
 </span>
 </div>))}
 </div>);
};

export default Records;
