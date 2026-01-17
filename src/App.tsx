import React, { useState } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { Toast as ToastType } from './types';

const App: React.FC = () => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', title?: string) => {
    const toastIcons: Record<string, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    const toastTitles: Record<string, string> = {
      info: '提示',
      success: '成功',
      warning: '警告',
      error: '错误'
    };

    const newToast: ToastType = {
      id: Date.now().toString(),
      message,
      type,
      icon: toastIcons[type],
      title: title || toastTitles[type]
    };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showToast={showToast} />
      <MainContent showToast={showToast} />
      <Footer />
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default App;
