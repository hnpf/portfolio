import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu } from "./MaterialIcon";

export const DebugConfirmDialog = ({ showDebugConfirm, setShowDebugConfirm, updateSettings }: any) => {
  return (
    <AnimatePresence>
      {showDebugConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDebugConfirm(false)}
            className="absolute inset-0 backdrop-blur-[10px]"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[var(--surface)] border-6 border-[var(--primary)] p-8 rounded-[2.5rem] shadow-2xl space-y-8"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 bg-[var(--primary-container)]/60 border border-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] shadow-sm">
                <Cpu size={26} />
              </div>
              <h3 className="text-3xl font-display font-black tracking-tight leading-tight">
                enable developer tools?
              </h3>
              <p className="text-xl opacity-70 font-medium leading-relaxed">
                this activates the real-time developer HUD. you can inspect elements,
                track console telemetry logs, view storage, slow down animations, and toggle layout grids.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  updateSettings({ debugMode: true });
                  setShowDebugConfirm(false);
                }}
                className="m3-button-filled w-full h-16 !rounded-2xl text-[16px] font-black"
              >
                yes, i want to turn it on!
              </button>
              <button
                onClick={() => setShowDebugConfirm(false)}
                className="m3-button-tonal w-full h-16 !rounded-2xl text-[15px] font-bold opacity-60 hover:opacity-100"
              >
                nevermind, I'm scared.
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
