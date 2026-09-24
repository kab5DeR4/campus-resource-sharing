import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* toast stack rendered in corner */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          pointerEvents: 'none',
          maxWidth: '380px',
          width: 'calc(100% - 3rem)',
        }}
      >
        {toasts.map((toast) => {
          let bg = '#ffffff';
          let border = '#e2e8f0';
          let iconColor = '#059669';
          let IconComponent = CheckCircle2;

          if (toast.type === 'error') {
            bg = '#fff1f2';
            border = '#fecdd3';
            iconColor = '#be123c';
            IconComponent = AlertCircle;
          } else if (toast.type === 'warning') {
            bg = '#fffbeb';
            border = '#fde68a';
            iconColor = '#b45309';
            IconComponent = AlertCircle;
          } else if (toast.type === 'info') {
            bg = '#eff6ff';
            border = '#bfdbfe';
            iconColor = '#2563eb';
            IconComponent = Info;
          }

          return (
            <div
              key={toast.id}
              role="alert"
              style={{
                backgroundColor: bg,
                border: `1px solid ${border}`,
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                pointerEvents: 'auto',
                fontSize: '0.875rem',
                color: '#0f172a',
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              <IconComponent size={18} style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1, wordBreak: 'break-word', fontWeight: 500 }}>{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
