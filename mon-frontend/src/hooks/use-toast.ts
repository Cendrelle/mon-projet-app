
import { useState } from 'react';

export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactElement;
}

let toastQueue: Toast[] = [];
let setToastsGlobal: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Store the setter globally so the toast function can use it
  if (!setToastsGlobal) {
    setToastsGlobal = setToasts;
  }

  const toast = ({ title, description, variant = 'default', action }: Toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant, action };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return { toast, toasts };
};

// Export a standalone toast function that can be used outside components
export const toast = ({ title, description, variant = 'default', action }: Toast) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = { id, title, description, variant, action };
  
  toastQueue.push(newToast);
  
  if (setToastsGlobal) {
    setToastsGlobal(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToastsGlobal!(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }
};
