import { Toast } from '../types'
import { generateId } from '../utils/canvas'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const toastIcons = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌'
}

const toastStyles = {
  info: 'border-l-blue-500',
  success: 'border-l-green-500',
  warning: 'border-l-yellow-500',
  error: 'border-l-red-500'
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-5 right-5 z-[1000] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-white p-4 pr-6 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px] border-l-4 ${toastStyles[toast.type]} animate-slide-in`}
        >
          <span className="text-2xl flex-shrink-0">{toastIcons[toast.type]}</span>
          <div className="flex-1">
            <div className="font-semibold text-sm text-gray-900">{toast.title}</div>
            <div className="text-xs text-gray-600">{toast.message}</div>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded w-6 h-6 flex items-center justify-center transition-all"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
