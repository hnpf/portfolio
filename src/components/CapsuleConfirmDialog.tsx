import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, X } from "./MaterialIcon";

interface CapsuleConfirmDialogProps {
  pendingCapsule: any;
  setPendingCapsule: (capsule: any) => void;
  updateSettings: (settings: any) => void;
  setToast: (msg: string | null) => void;
}

export const CapsuleConfirmDialog = ({ 
  pendingCapsule, 
  setPendingCapsule, 
  updateSettings,
  setToast
}: CapsuleConfirmDialogProps) => {
  return (
    <AnimatePresence>
      {pendingCapsule && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPendingCapsule(null)}
            className="absolute inset-0 backdrop-blur-[10px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="capsule-confirm-title"
            aria-describedby="capsule-confirm-description"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[var(--surface)] border-6 border-[var(--primary)] p-8 rounded-[2.5rem] shadow-2xl space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-[var(--primary-container)]/60 border border-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] shadow-sm">
                  <Palette size={26} />
                </div>
                <button 
                  onClick={() => setPendingCapsule(null)}
                  aria-label="Close theme share dialog"
                  className="group w-10 h-10 rounded-full bg-[var(--surface-variant)]/60 hover:bg-[var(--surface-variant)] border border-[var(--outline-variant)]/50 flex items-center justify-center transition-all cursor-pointer text-[var(--on-surface)] active:scale-95 shrink-0 shadow-sm"
                >
                  <X size={20} className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180 group-hover:scale-110" />
                </button>
              </div>
              <h3 id="capsule-confirm-title" className="text-3xl font-display font-black tracking-tight leading-tight uppercase italic">
                Hold on!
              </h3>
              <p id="capsule-confirm-description" className="text-xl opacity-70 font-medium leading-relaxed">
                someone shared a theme link with you. do you want to apply these 
                settings to your current session?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  updateSettings(pendingCapsule);
                  setPendingCapsule(null);
                  setToast("Theme has been applied from sharing link!");
                }}
                className="m3-button-filled w-full h-16 !rounded-2xl text-[16px] font-black"
              >
                Sure, sounds ok!!
              </button>
              <button
                onClick={() => setPendingCapsule(null)}
                className="m3-button-tonal w-full h-16 !rounded-2xl text-[15px] font-bold opacity-60 hover:opacity-100"
              >
                No, I like my current settings.
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
