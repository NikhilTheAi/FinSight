import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
};

type ToastContextValue = {
  showToast: (type: ToastType, title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, type, title, description }]);
    window.setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {items.map((item) => (
          <div key={item.id} className={`toast toast-${item.type}`} role="status">
            <div className="toast-icon-wrap">
              {item.type === 'success' && <CheckCircle2 size={18} />}
              {item.type === 'error' && <XCircle size={18} />}
              {item.type === 'info' && <Info size={18} />}
            </div>

            <div className="toast-content">
              <strong>{item.title}</strong>
              {item.description ? <span>{item.description}</span> : null}
            </div>

            <button type="button" className="toast-close" onClick={() => removeToast(item.id)} aria-label="Dismiss notification">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
