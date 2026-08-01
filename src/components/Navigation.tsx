// @ts-ignore

import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../constants";
import { useTheme } from "../ThemeContext";
import { haptic } from "../haptics";

export const SideItem = memo(
  ({
    glyph: Icon,
    text,
    isSelected,
    onSelect,
    isMini,
    isFirst,
    isLast,
    isFloating,
    isShort,
    layoutId,
    highHz,
  }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    // squishy spring, better settle
    const squishySpring = {
      type: "spring" as const,
      stiffness: highHz ? 400 : 350,
      damping: highHz ? 28 : 25,
      mass: 0.8,
    };

    const sideItemSpring = {
      type: "spring" as const,
      stiffness: highHz ? 800 : 700,
      damping: highHz ? 40 : 35,
      mass: 0.2,
    };

    const settingsSpring = {
      type: "spring" as const,
      stiffness: highHz ? 400 : 300,
      damping: highHz ? 35 : 30,
      mass: 1.2,
      restDelta: 0.001,
    };

    const rd =
      isFirst && isLast
        ? "rounded-[28px]"
        : isFirst
          ? "rounded-t-[28px] rounded-b-[15px]"
          : isLast
            ? "rounded-t-[15px] rounded-b-[28px]"
            : "rounded-[15px]";

    if (isMini) {
      return (
        <motion.button
          layout="position"
          initial={false}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            opacity: { duration: 0.2 },
            layout: settingsSpring,
            default: squishySpring,
            scale: { type: "spring", stiffness: 400, damping: 28 },
            rotate: { type: "spring", stiffness: 400, damping: 24 },
          }}
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.92, rotate: -4 }}
          onClick={(e) => {
            haptic.light();
            onSelect(e);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative group outline-none cursor-pointer font-black motion-gpu isolate flex flex-col justify-center items-center w-full shadow-none bg-transparent gap-0 sidebar-item",
            isShort ? "h-12" : "h-16",
            isSelected && "active",
          )}
        >
          {/* icon container */}
          <div className="relative z-10 shrink-0 flex items-center justify-center transition-all duration-300 h-8 w-14">
            {/* m3 active indicator pill (mini version) */}
            {isSelected && (
              <div
                className="absolute inset-0 bg-[var(--primary-container)] rounded-full z-0 sidebar-pill active-pill-animate"
              />
            )}

            {/* mini hover pill */}
            {isHovered && !isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.8, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-[var(--surface-variant)] rounded-full -z-10"
              />
            )}

            <motion.div
              layoutId={text === "Settings" ? layoutId : undefined}
              animate={{
                scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                rotate:
                  isSelected ? -5 : isHovered ? (text === "Settings" ? 45 : -2) : 0,
              }}
              transition={text === "Settings" ? settingsSpring : {
                type: "spring" as const,
                stiffness: 400,
                damping: 25,
              }}
              style={{
                color: isSelected
                  ? "var(--on-primary-container)"
                  : isHovered
                    ? "var(--primary)"
                    : "var(--on-surface-variant)",
              }}
              className="relative z-10"
            >
              <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} fill="none" />
            </motion.div>
          </div>

          <span className="text-[11px] font-expressive font-black uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity relative z-10 italic">
            {text}
          </span>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full ml-6 px-3 py-1.5 bg-[var(--on-surface)] text-[var(--surface)] text-xs font-bold rounded-xl z-50 whitespace-nowrap shadow-xl pointer-events-none"
              >
                {text}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      );
    }

    return (
      <motion.button
        layout="position"
        initial={false}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
        }}
        transition={{
          opacity: { duration: 0.2 },
          layout: settingsSpring,
          default: squishySpring,
          scale: { type: "spring", stiffness: 400, damping: 30 },
          x: { type: "spring", stiffness: 400, damping: 30 },
        }}
        whileHover={{ scale: 1.02, x: 6 }}
        whileTap={{ scale: 0.97, x: -2 }}
        onClick={(e) => {
          haptic.light();
          onSelect(e);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative group outline-none cursor-pointer font-black motion-gpu isolate flex items-center w-full px-4 justify-center gap-4 ring-6 ring-[var(--outline-variant)]/30 sidebar-item",
          isFloating ? "py-2.5" : isShort ? "py-3" : "py-4",
          rd,
        )}
      >
        {/* hov background layer */}
        <motion.div
          className={cn("absolute inset-0 -z-20", rd)}
          initial={false}
          animate={{
            backgroundColor: "var(--surface-variant)",
            opacity: isSelected ? 0 : isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.1 }}
        />

        {/* expanded active indicator bg */}
        {isSelected && (
          <div
            className={cn("absolute inset-0 bg-[var(--primary-container)] active-pill-animate", rd)}
          />
        )}

        <div className="relative z-10 shrink-0 flex items-center justify-center transition-all duration-300 w-6 h-6">
          <motion.div
            layoutId={text === "Settings" ? layoutId : undefined}
            animate={{
              scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
              rotate:
                isSelected ? -5 : isHovered ? (text === "Settings" ? 45 : -2) : 0,
            }}
            transition={text === "Settings" ? settingsSpring : {
              type: "spring" as const,
              stiffness: 400,
              damping: 25,
            }}
            style={{
              color: isSelected
                ? "var(--on-primary-container)"
                : isHovered
                  ? "var(--primary)"
                  : "var(--on-surface-variant)",
            }}
          >
            <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} fill="none" />
          </motion.div>
        </div>

        <motion.span
          animate={{
            x: isSelected ? 4 : 0,
            opacity: 1,
          }}
          style={{
            color: isSelected ? "var(--on-primary-container)" : "inherit",
          }}
          transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
          className="font-display italic tracking-tight text-xl uppercase relative z-10 transition-colors duration-200"
        >
          {text}
        </motion.span>
      </motion.button>
    );
  },
);

export const SideAction = memo(({ children, onClick, isMini, tooltip, className }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex items-center justify-center p-4 rounded-xl group relative outline-none overflow-hidden cursor-pointer motion-gpu sidebar-item",
        !className?.includes("bg-") &&
        "bg-[var(--surface-variant)] text-[var(--on-surface-variant)]",
        isMini ? "w-14 h-14 mx-auto" : "flex-1",
        className,
      )}
      style={{ transform: "translateZ(0)" }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-[var(--primary-container)] rounded-xl -z-10"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        style={{
          color: isHovered ? "var(--on-primary-container)" : "inherit",
        }}
        transition={{ duration: 0.2 }}
        className="relative z-10 transition-colors duration-200"
      >
        {children}
      </motion.div>

      {tooltip && (
        <div
          className={cn(
            "absolute px-3 py-1.5 bg-[var(--on-surface)] text-[var(--surface)] text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-50 whitespace-nowrap shadow-xl",
            isMini ? "left-full ml-6" : "bottom-full mb-4",
          )}
        >
          {tooltip}
        </div>
      )}
    </motion.button>
  );
});

export const BotNav = memo(({
  glyph: Icon,
  text,
  isSelected,
  onSelect,
  imgSrc,
  wiggle,
  layoutId,
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = useTheme();

  const settingsSpring = {
    type: "spring" as const,
    stiffness: settings.highHz ? 450 : 350,
    damping: settings.highHz ? 35 : 30,
    mass: 1,
    restDelta: 0.001,
  };

  return (
    <motion.button
      initial={false}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        opacity: { duration: 0.2 },
        default: {
          type: "spring",
          stiffness: 450,
          damping: 28,
          mass: 0.8,
        },
      }}
      whileTap={{ scale: 0.9, y: 5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        haptic.light();
        onSelect?.();
      }}
      className={cn(
        "flex flex-col items-center gap-1 flex-1 pt-3 pb-2 transition-colors duration-200 relative z-10 bottom-nav-item outline-none",
        isSelected
          ? "text-[var(--on-surface)]"
          : "text-[var(--on-surface-variant)]",
      )}
    >
      <div className="relative flex items-center justify-center w-16 h-8 mb-1">
        {isSelected && (
          <div
            className="absolute inset-0 bg-[var(--primary-container)] rounded-full -z-10 motion-gpu active-pill-animate"
          />
        )}
        <motion.div
          layoutId={text === "More" ? layoutId : undefined}
          animate={
            wiggle
              ? {
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
              }
              : {
                rotate: isHovered && text === "More" ? 45 : 0,
                scale: isHovered ? 1.1 : 1,
              }
          }
          transition={
            wiggle
              ? {
                duration: 1.2,
                repeat: 1,
                repeatDelay: 0.1,
                ease: "easeInOut",
              }
              : text === "More" ? settingsSpring : {
                type: "spring",
                stiffness: settings.highHz ? 600 : 500,
                damping: settings.highHz ? 45 : 40,
                mass: 1,
              }
          }
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={text}
              className={cn(
                "w-6 h-6 rounded-full transition-transform duration-200 object-cover",
                isSelected
                  ? "scale-110 ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-black/20"
                  : "scale-100 grayscale opacity-60",
              )}
            />
          ) : (
            <Icon
              size={24}
              className={cn(
                "transition-transform duration-200",
                isSelected ? "scale-110" : "scale-100",
              )}
              strokeWidth={isSelected ? 2.5 : 2}
            />
          )}
        </motion.div>
      </div>
      <motion.span
        className={cn(
          "text-[11px] italic font-expressive font-black tracking-[0.1em] transition-all duration-200 uppercase",
          isSelected ? "opacity-100" : "opacity-70",
        )}
      >
        {text}
      </motion.span>
    </motion.button>
  );
});
