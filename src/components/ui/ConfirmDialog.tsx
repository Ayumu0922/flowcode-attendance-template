import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    options: ConfirmOptions;
    resolve: (v: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => setState({ options, resolve }));
  }, []);

  const handle = (result: boolean) => {
    state?.resolve(result);
    setState(null);
  };

  const variantStyles: Record<string, string> = {
    danger: 'bg-red-600 hover:bg-red-500',
    warning: 'bg-amber-600 hover:bg-amber-500',
    info: 'bg-blue-600 hover:bg-blue-500',
  };

  const iconBg: Record<string, string> = {
    danger: 'bg-red-500/10 text-red-400',
    warning: 'bg-amber-500/10 text-amber-400',
    info: 'bg-blue-500/10 text-blue-400',
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            data-fc-id="ConfirmDialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => handle(false)}
          >
            <motion.div
              data-fc-id="ConfirmDialog-panel"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div data-fc-id="ConfirmDialog-header" className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg[state.options.variant || 'danger']}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{state.options.title}</h3>
              </div>
              <p data-fc-id="ConfirmDialog-message" className="text-sm text-zinc-400 mb-6 leading-relaxed">
                {state.options.message}
              </p>
              <div data-fc-id="ConfirmDialog-actions" className="flex gap-3 justify-end">
                <button
                  data-fc-id="ConfirmDialog-cancel"
                  onClick={() => handle(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-foreground bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  {state.options.cancelLabel || 'キャンセル'}
                </button>
                <button
                  data-fc-id="ConfirmDialog-confirm"
                  onClick={() => handle(true)}
                  className={`px-4 py-2 text-sm font-medium text-on-accent rounded-lg transition-colors ${variantStyles[state.options.variant || 'danger']}`}
                >
                  {state.options.confirmLabel || '確認'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
