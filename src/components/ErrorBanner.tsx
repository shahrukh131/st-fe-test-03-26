import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import type { ErrorBannerProps } from '../types/product';

export function ErrorBanner({
  error,
  hasStaleData,
  isRetrying,
  onRetry,
}: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (error) {
      setDismissed(false);
    }
  }, [error]);

  useEffect(() => {
    if (error && hasStaleData) {
      const timer = setTimeout(() => setDismissed(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [error, hasStaleData]);

  if (!error || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 bg-red-50/95 backdrop-blur-xl border border-red-200 rounded-xl shadow-[0_8px_32px_rgba(239,68,68,0.1),0_4px_30px_rgba(0,0,0,0.05)] max-w-[calc(100vw-2rem)] w-auto"
        role="alert"
        aria-live="assertive"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center text-red-500 shrink-0">
          <AlertTriangle size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[0.85rem] font-medium text-red-900 leading-snug">
            {hasStaleData
              ? 'Connection issue — showing cached results.'
              : 'Failed to load products. Please try again.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500 text-white text-[0.8rem] font-medium whitespace-nowrap hover:bg-red-600 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={onRetry}
            disabled={isRetrying}
            aria-label="Retry loading products"
          >
            <RefreshCw
              size={16}
              className={isRetrying ? 'animate-spin' : ''}
            />
            {isRetrying ? 'Retrying…' : 'Retry'}
          </button>

          <button
            className="flex items-center justify-center w-7 h-7 rounded-md text-red-900 hover:bg-red-500/10"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss error message"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
