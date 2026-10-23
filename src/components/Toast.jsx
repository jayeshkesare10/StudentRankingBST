import React, { useEffect } from 'react';
import { 
  CheckCircleIcon, 
  AlertCircleIcon, 
  InfoIcon, 
  CloseIcon 
} from './Icons';

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration || 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const type = toast.type || 'info'; // 'success', 'error', 'info', 'warning'

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon size={20} className="text-success" />;
      case 'error':
        return <AlertCircleIcon size={20} className="text-danger" />;
      case 'warning':
        return <AlertCircleIcon size={20} className="text-warning" />;
      default:
        return <InfoIcon size={20} className="text-cyan" />;
    }
  };

  return (
    <div className={`toast-notification toast-${type} glass-panel animate-fade-in`}>
      <div className="toast-icon-wrap">{getIcon()}</div>
      <div className="toast-content">
        <p className="toast-message">{toast.message}</p>
      </div>
      <button 
        type="button" 
        className="toast-close-btn" 
        onClick={onDismiss}
        title="Dismiss"
      >
        <CloseIcon size={14} />
      </button>
      <div 
        className="toast-progress-bar"
        style={{ animationDuration: `${toast.duration || 4500}ms` }}
      ></div>
    </div>
  );
}
