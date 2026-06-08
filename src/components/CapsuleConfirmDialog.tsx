import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, X } from "lucide-react";

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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[var(--surface)] border-6 border-[var(--primary)] p-8 rounded-[2.5rem] shadow-2xl space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-[var(--primary-container)] rounded-2xl flex items-center justify-center">
                  <Palette size={32} className="text-[var(--primary)]" />
                </div>
                <button 
                  onClick={() => setPendingCapsule(null)}
                  className="p-3 hover:bg-[var(--surface-variant)] rounded-full transition-colors opacity-50 hover:opacity-100"
                >
                  <X size={24} />
                </button>
              </div>
              <h3 className="text-3xl font-display font-black tracking-tight leading-tight uppercase italic">
                Hold on!
              </h3>
              <p className="text-xl opacity-70 font-medium leading-relaxed">
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
