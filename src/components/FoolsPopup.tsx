// @ts-nocheck
import React from "react";
import { motion } from "motion/react";

const IS_APR = (() => {
  const now = new Date();
  return now.getMonth() === 3 && now.getDate() === 1;
})();

export const FoolsPopup = ({
  content,
  onResolve,
}: {
  content: string;
  onResolve: () => void;
}) => {
  if (!IS_APR) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--surface)]/80 backdrop-blur-3xl overflow-hidden motion-gpu">
      <div className="fsh-tiled-bg !opacity-40" />

      <div className="bg-[var(--primary-container)] border-4 border-[var(--primary)] p-8 md:p-12 max-w-2xl w-full rounded-[3rem] shadow-2xl relative z-10 animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-display font-black text-[var(--on-primary-container)] tracking-tight">
            be advisory!11!
          </h2>
        </div>
        <p className="text-2xl font-medium text-[var(--on-surface)] mb-10 leading-relaxed italic">
          "{content}"
        </p>
        <button
          onClick={onResolve}
          className="m3-button-filled w-full h-20 !rounded-2xl text-2xl font-black tracking-widest"
        >
          Just fih.
        </button>
      </div>
    </div>
  );
};
