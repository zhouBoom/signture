import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import Toast from './Toast';
import { ToastMessage } from '../types';

interface ToastContextType {
 showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
 const context = useContext(ToastContext);
 if (!context) {
 throw new Error('useToast must be used within a ToastContainer');
 }
 return context;
};

interface ToastContainerProps {
 children: React.ReactNode;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
 const [toasts, setToasts] = useState<ToastMessage[]>([]);
 const toastIdRef = useRef(0);

 const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info', title?: string) => {
 const newToast: ToastMessage = {
 id: `toast-${++toastIdRef.current}-${Date.now()}`,
 message,
 type,
 title,
 };

 setToasts(prev => [...prev.slice(-4), newToast]);

 setTimeout(() => {
 setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
 }, 3000);
 }, []);

 const closeToast = useCallback((id: string) => {
 setToasts(prev => prev.filter(toast => toast.id !== id));
 }, []);

 return (
 <ToastContext.Provider value={{ showToast }}>
 {children}
 <div className="fixed top-4 right-4 z-50 space-y-2">
 {toasts.map(toast => (
 <Toast key={toast.id} message={toast} onClose={closeToast} />
 ))}
 </div>
 </ToastContext.Provider>
 );
};

export default ToastContainer;
