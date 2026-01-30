import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
 message: ToastMessage;
 onClose: (id: string) => void;
}

const TOAST_TIMEOUT = 3000;

const toastConfig = {
 info: {
 icon: 'ℹ️',
 title: '提示',
 borderColor: 'border-l-blue-500',
 },
 success: {
 icon: '✅',
 title: '成功',
 borderColor: 'border-l-green-500',
 },
 warning: {
 icon: '⚠️',
 title: '警告',
 borderColor: 'border-l-yellow-500',
 },
 error: {
 icon: '❌',
 title: '错误',
 borderColor: 'border-l-red-500',
 },
};

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
 const [isHiding, setIsHiding] = useState(false);

 useEffect(() => {
 const timer = setTimeout(() => {
 setIsHiding(true);
 setTimeout(() => onClose(message.id), 300);
 }, TOAST_TIMEOUT);

 return () => clearTimeout(timer);
 }, [message.id, onClose]);

 const config = toastConfig[message.type];

 return (<div className={`fixed top-5 right-5 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 z-50
 border-l-4 transition-all duration-300 min-w-[300px] max-w-[400px]
 ${config.borderColor}
 ${isHiding ? 'animate-slide-out' : 'animate-slide-in'}`}>
 <span className="text-2xl flex-shrink-0">{config.icon}</span>
 <div className="flex-1">
 <div className="font-semibold text-sm text-gray-800 mb-1">
 {message.title || config.title}
 </div>
 <div className="text-sm text-gray-500">{message.message}</div>
 </div>
 <button onClick={() => {
 setIsHiding(true);
 setTimeout(() => onClose(message.id), 300);
 }} className="bg-transparent border-none text-2xl cursor-pointer text-gray-400
 p-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100
 hover:text-gray-600 transition-colors">
 ×
 </button>
 </div>);
};

export default Toast;
