import React, { useState, memo } from "react";
import { cn } from "../constants";
import { useTheme } from "../ThemeContext";
import { TiltContainer } from "./TiltContainer";

export const Card = memo(({ children, className, innerClassName, delay = 0, onClick, whileHover, whileTap, noDefaultStyles = false }: any) => {
  const { settings } = useTheme();
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <TiltContainer
      settings={settings}
      onClick={onClick}
      className={className}
      innerClassName={cn(
        !noDefaultStyles && "m3-card readme-card overflow-hidden cursor-default relative border border-[var(--outline-variant)]",
        onClick && "cursor-pointer",
        innerClassName,
      )}
      initial={settings.disableAnimations ? false : {
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: hasEntered || settings.disableAnimations ? 0 : delay,
          type: settings.disableAnimations ? "tween" : "spring",
          duration: settings.disableAnimations ? 0 : undefined,
          stiffness: settings.highHz ? 800 : 700,
          damping: settings.highHz ? 30 : 28,
          mass: 0.8,
        }
      }}
      onAnimationComplete={() => setHasEntered(true)}
      transition={settings.disableAnimations ? { duration: 0 } : {
        type: "spring",
        stiffness: settings.highHz ? 800 : 700,
        damping: settings.highHz ? 30 : 28,
      }}
      whileHover={whileHover || {
        y: settings.bentoTilt ? -6 : -12,
        scale: settings.bentoTilt ? 1.02 : 1.01,
        rotate: settings.bentoTilt ? 0 : 0.01, // tiny rotation hack to try and force clean antialiased edges
        transition: { type: "spring", stiffness: 400, damping: 15 }
      }}
      whileTap={whileTap || { scale: 0.98 }}
    >
      {children}
    </TiltContainer>
  );
});
