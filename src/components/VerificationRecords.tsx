import React from 'react';
import { VerificationRecord } from '../types';
interface VerificationRecordsProps {
 records: VerificationRecord[];
}
const VerificationRecords: React.FC<VerificationRecordsProps> = ({ records }) => {
 return (<div className="flex flex-col gap-3.5">
 {records.map((record) => (<div key={record.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
 <span className="text-slate-500 font-medium text-sm">{record.timestamp}</span>
 <span className={`px-4 py-2 rounded-full font-bold text-xs tracking-wider ${record.result === 'success'
 ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700'
 : 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'}`}>
 {record.result === 'success' ? '通过' : '未通过'}
 </span>
 </div>))}
 </div>);
};
export default VerificationRecords;
