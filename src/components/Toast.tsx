import React, { useEffect, useRef } from 'react';
import { Toast as ToastType } from '../types';

interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = toastRef.current;
    if (element) {
      const handleAnimationEnd = () => {
        element.remove();
      };
      element.addEventListener('animationend', handleAnimationEnd);
      return () => {
        element.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const element = toastRef.current;
    if (element) {
      element.classList.add('hiding');
    }
  };

  return (
    <div ref={toastRef} className={`toast ${toast.type}`}>
      <span className="toast-icon">{toast.icon}</span>
      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        <div className="toast-message">{toast.message}</div>
      </div>
      <button className="toast-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;
