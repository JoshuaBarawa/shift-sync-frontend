import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

let toastId = 0;

export const toastManager = {
  toasts: [],
  listeners: [],

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },

  notify(message, type = 'info', duration = 3000) {
    const id = toastId++;
    const toast = { id, message, type, duration };
    this.toasts = [toast, ...this.toasts];
    this.listeners.forEach((listener) => listener(this.toasts));

    if (duration > 0) {
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.listeners.forEach((listener) => listener(this.toasts));
      }, duration);
    }

    return id;
  },

  remove(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.listeners.forEach((listener) => listener(this.toasts));
  },

  success(message, duration = 3000) {
    return this.notify(message, 'success', duration);
  },

  error(message, duration = 5000) {
    return this.notify(message, 'error', duration);
  },

  info(message, duration = 3000) {
    return this.notify(message, 'info', duration);
  },

  warning(message, duration = 4000) {
    return this.notify(message, 'warning', duration);
  },
};

const ToastItem = ({ toast, onClose }) => {
  const getIconAndColor = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle size={20} />,
          bgColor: '#ecfdf5',
          borderColor: '#10b981',
          textColor: '#047857',
          iconColor: '#10b981',
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} />,
          bgColor: '#fef2f2',
          borderColor: '#ef4444',
          textColor: '#b91c1c',
          iconColor: '#ef4444',
        };
      case 'warning':
        return {
          icon: <AlertCircle size={20} />,
          bgColor: '#fffbeb',
          borderColor: '#f59e0b',
          textColor: '#92400e',
          iconColor: '#f59e0b',
        };
      default:
        return {
          icon: <Info size={20} />,
          bgColor: '#eff6ff',
          borderColor: '#3b82f6',
          textColor: '#1e40af',
          iconColor: '#3b82f6',
        };
    }
  };

  const { icon, bgColor, borderColor, textColor, iconColor } = getIconAndColor();

  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        color: textColor,
      }}
      className="mb-3 rounded-lg p-4 flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex items-center gap-3">
        <span style={{ color: iconColor }}>{icon}</span>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={(id) => toastManager.remove(id)}
        />
      ))}
    </div>
  );
};
