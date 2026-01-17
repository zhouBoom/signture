import { useState, useCallback } from 'react';
import { ToastMessage } from '../types';
import { generateId } from '../utils/helpers';
interface UseToastReturn {
 messages: ToastMessage[];
 showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
 removeToast: (id: string) => void;
}
const useToast = (): UseToastReturn => {
 const [messages, setMessages] = useState<ToastMessage[]>([]);
 const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info', title: string = '') => {
 const id = generateId();
 const defaultTitles: Record<ToastMessage['type'], string> = {
 info: '提示',
 success: '成功',
 warning: '警告',
 error: '错误'
 };
 const newMessage: ToastMessage = {
 id,
 message,
 type,
 title: title || defaultTitles[type]
 };
 setMessages(prev => [...prev, newMessage]);
 setTimeout(() => {
 setMessages(prev => prev.filter(m => m.id !== id));
 }, 3000);
 }, []);
 const removeToast = useCallback((id: string) => {
 setMessages(prev => prev.filter(m => m.id !== id));
 }, []);
 return {
 messages,
 showToast,
 removeToast
 };
};
export default useToast;
