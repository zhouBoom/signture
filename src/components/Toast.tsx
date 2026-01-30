import React from 'react';
import { ToastProps } from '@/types';

interface ToastComponentProps extends ToastProps {
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastComponentProps> = ({
  id,
  message,
  type,
  title,
  onClose,
}) => {
  const getToastIcon = () => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };
    return icons[type] || icons.info;
  };

  const getToastTitle = () => {
    if (title) return title;
    
    const titles = {
      info: '提示',
      success: '成功',
      warning: '警告',
      error: '错误',
    };
    return titles[type] || titles.info;
  };

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">{getToastIcon()}</span>
      <div className="toast-content">
        <div className="toast-title">{getToastTitle()}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={() => onClose(id)}>
        ×
      </button>
    </div>
  );
};

export default Toast;