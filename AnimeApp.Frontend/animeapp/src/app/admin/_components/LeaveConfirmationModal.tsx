'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useLeavePageBlocker } from '@/hooks/useLeavePageBlocker'; // импортируем твой хук

interface BlockerProps {
  isDirty: boolean;
}

export function LeaveConfirmationModal({ isDirty }: BlockerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  useLeavePageBlocker(isDirty);
  useEffect(() => {
    if (!isDirty) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      
      if (target && target.href) {
        const targetUrlObj = new URL(target.href);
        const currentUrlObj = new URL(window.location.href);

        if (targetUrlObj.origin === currentUrlObj.origin && targetUrlObj.pathname !== currentUrlObj.pathname) {
          e.preventDefault();
          setTargetUrl(target.href);
          setIsOpen(true);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, true);
    return () => document.removeEventListener('click', handleAnchorClick, true);
  }, [isDirty]);

  const handleConfirm = () => {
    setIsOpen(false);
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 flex items-start justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-md p-6 bg-[#1e1e24] border-2 border-purple-800/80 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white tracking-wide">Незбережені зміни</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ви впевнені, що хочете залишити сторінку? Усі внесені зміни будуть безповоротно втрачені.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-slate text-sm font-medium rounded-lg "
              >
                Залишитися
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn-purple text-sm font-medium rounded-lg"
              >
                Залишити сторінку
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}