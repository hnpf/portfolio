import React, { useState, useEffect, memo } from "react";
import { cn } from "../constants";
import { useTheme } from "../ThemeContext";
import { TiltContainer } from "./TiltContainer";

export const Card = memo(({ children, className, innerClassName, delay = 0, onClick, whileHover, whileTap, noDefaultStyles = false }: any) => {
  const { settings } = useTheme();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (settings.disableAnimations || delay === 0) {
      setShouldAnimate(true);
      return;
    }
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [delay, settings.disableAnimations]);

  const initialValues = settings.disableAnimations ? false : {
    opacity: 0,
    y: 20,
    scale: 0.95,
  };

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
      initial={initialValues}
      animate={
        shouldAnimate || settings.disableAnimations
          ? { opacity: 1, y: 0, scale: 1 }
          : initialValues
      }
      transition={settings.disableAnimations ? { duration: 0 } : {
        type: "spring",
        stiffness: settings.highHz ? 800 : 700,
        damping: settings.highHz ? 30 : 28,
        mass: 0.8,
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

