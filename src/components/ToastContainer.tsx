import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHospital();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map(toast => {
          let bg = 'bg-slate-900 text-white';
          let Icon = Info;
          let iconColor = 'text-sky-400';

          if (toast.type === 'success') {
            bg = 'bg-emerald-900 border border-emerald-700 text-emerald-50';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            bg = 'bg-rose-900 border border-rose-700 text-rose-50';
            Icon = AlertCircle;
            iconColor = 'text-rose-400';
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-900 border border-amber-700 text-amber-50';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`${bg} pointer-events-auto p-4 rounded-xl shadow-xl flex items-start gap-3 backdrop-blur-md`}
            >
              <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
              <div className="flex-1 text-sm leading-snug font-medium">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
