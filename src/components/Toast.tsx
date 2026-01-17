import React from 'react';
import { ToastMessage } from '../types';
interface ToastProps {
 messages: ToastMessage[];
 onClose: (id: string) => void;
}
const Toast: React.FC<ToastProps> = ({ messages, onClose }) => {
 if (messages.length === 0)
 return null;
 const getBorderColor = (type: ToastMessage['type']) => {
 switch (type) {
 case 'info': return 'border-l-blue-500';
 case 'success': return 'border-l-emerald-500';
 case 'warning': return 'border-l-amber-500';
 case 'error': return 'border-l-red-500';
 default: return 'border-l-gray-500';
 }
 };
 const getIcon = (type: ToastMessage['type']) => {
 switch (type) {
 case 'info': return 'ℹ️';
 case 'success': return '✅';
 case 'warning': return '⚠️';
 case 'error': return '❌';
 default: return 'ℹ️';
 }
 };
 return (<div className="fixed top-5 right-5 z-50 space-y-3">
 {messages.map((message) => (<div key={message.id} className={`bg-white p-4 pr-6 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px] animate-slide-in border-l-4 ${getBorderColor(message.type)}`}>
 <span className="text-2xl flex-shrink-0">{getIcon(message.type)}</span>
 <div className="flex-1">
 <div className="font-semibold text-sm text-slate-800">{message.title}</div>
 <div className="text-sm text-slate-500">{message.message}</div>
 </div>
 <button onClick={() => onClose(message.id)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center transition-colors">
 ×
 </button>
 </div>))}
 </div>);
};
export default Toast;
