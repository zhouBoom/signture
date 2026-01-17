import React from 'react';
import { ToastMessage } from '../types';
interface ToastProps {
 messages: ToastMessage[];
 onClose: (id: string) => void;
}
const Toast: React.FC<ToastProps> = ({ messages, onClose }) => {
 if (messages.length === 0)
 return null;
 const getIcon = (type: ToastMessage['type']) => {
 switch (type) {
 case 'info': return 'ℹ️';
 case 'success': return '✅';
 case 'warning': return '⚠️';
 case 'error': return '❌';
 default: return 'ℹ️';
 }
 };
 return (<div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '12px' }}>
 {messages.map((message, index) => (<div key={message.id} className={`toast ${message.type}`} style={{ top: `${20 + index * 80}px`, animationDelay: `${index * 0.1}s` }}>
 <span className="toast-icon">{getIcon(message.type)}</span>
 <div className="toast-content">
 <div className="toast-title">{message.title}</div>
 <div className="toast-message">{message.message}</div>
 </div>
 <button onClick={() => onClose(message.id)} className="toast-close">
 ×
 </button>
 </div>))}
 </div>);
};
export default Toast;
