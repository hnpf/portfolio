// @ts-nocheck
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "./MaterialIcon";
import { cn } from "../constants";

export const BounceButton = ({
  icon: Icon,
  label,
  url,
  onClick,
  className = "",
}: {
  icon?: any;
  label: string;
  url?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}) => {
  const [loading, set_loading] = useState(false);

  const _on_click = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
      return;
    }
    if (!url) return;
    set_loading(true);
    setTimeout(() => {
      window.open(url, "_blank");
      set_loading(false);
    }, 600);
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -2,
        borderRadius: "40px",
      }}
      whileTap={{ scale: 1.02, rotate: -0.5 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 1,
      }}
      onClick={_on_click}
      disabled={loading}
      className={cn(
        "relative overflow-hidden",
        loading && "cursor-wait opacity-80",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Loader2 size={18} className="animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 w-full justify-center"
          >
            {Icon && <Icon size={18} />}
            <span className="font-bold">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export const TechChip = ({ label, key }: { label: string; key?: any }) => { // yes this is a required key prop, don't ask :(
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, set_pos] = useState({ x: 50, y: 50 });
  const [hovered, set_hovered] = useState(false);

  const _on_move = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    set_pos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <span
      ref={ref}
      onMouseMove={_on_move}
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
      style={{
        background: hovered
          ? `radial-gradient(ellipse 80% 80% at ${pos.x}% ${pos.y}%, color-mix(in srgb, var(--primary) 20%, transparent), var(--primary-container) 0%) , color-mix(in srgb, var(--primary-container) 30%, transparent)`
          : undefined,
      }}
      className="px-2 py-1 md:px-4 md:py-2 bg-[var(--primary-container)]/30 text-[var(--on-surface)] rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold border-6 border-[var(--outline-variant)] active:scale-95 hover:border-[var(--primary)]/40 transition-all duration-150 ease-out cursor-default select-none will-change-transform"
    >
      {label}
    </span>
  );
};
