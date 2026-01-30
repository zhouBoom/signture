import React from 'react';
import { VerificationRecord } from '@/types';
import { formatTimestamp } from '@/utils/verification';

interface VerificationRecordsProps {
  records: VerificationRecord[];
}

const VerificationRecords: React.FC<VerificationRecordsProps> = ({
  records,
}) => {
  return (
    <div className="records space-y-3.5">
      {records.length === 0 ? (
        <div className="text-center text-slate-400 py-4">
          暂无验证记录
        </div>
      ) : (
        records.map((record) => (
          <div key={record.id} className="record-item">
            <span className="record-time">
              {formatTimestamp(record.timestamp)}
            </span>
            <span className={`record-result ${record.result}`}>
              {record.result === 'success' ? '通过' : '未通过'}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default VerificationRecords;