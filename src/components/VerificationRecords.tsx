import React from 'react';
import { VerificationRecord } from '../types';
interface VerificationRecordsProps {
 records: VerificationRecord[];
}
const VerificationRecords: React.FC<VerificationRecordsProps> = ({ records }) => {
 return (<div className="records">
 {records.map((record) => (<div key={record.id} className="record-item">
 <span className="record-time">{record.timestamp}</span>
 <span className={`record-result ${record.result === 'success'
 ? 'success'
 : 'failed'}`}>
 {record.result === 'success' ? '通过' : '未通过'}
 </span>
 </div>))}
 </div>);
};
export default VerificationRecords;
