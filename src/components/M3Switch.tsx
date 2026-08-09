// @ts-nocheck

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "motion/react";
import { Check, X } from "./MaterialIcon";
import { haptic } from "../haptics";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  icons?: "checked" | "both" | "none";
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
  className?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  icons = "both",
  checkedIcon,
  uncheckedIcon,
  className,
}: SwitchProps) {
  const startX = useRef<number | undefined>(undefined);
  const _isActive = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showHover, setShowHover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (val: boolean) => {
    if (val !== checked) {
      haptic.light();
      onChange(val);
    }
  };

  const hasUncheckedIcon = icons === "both" || !!uncheckedIcon;
  const restingScale = checked || hasUncheckedIcon ? 1.4 : 1;
  const restingX = checked ? 26.8 : 8.0;

  const springX = useSpring(restingX, {
    stiffness: 620,
    damping: 42,
    mass: 0.7,
  });
  const springScale = useSpring(restingScale, {
    stiffness: 620,
    damping: 42,
    mass: 0.7,
  });

  useEffect(() => {
    if (!_isActive.current) {
      springX.set(restingX);
      springScale.set(restingScale);
    }
  }, [checked, restingX, restingScale, springX, springScale]);

  const _handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    startX.current = e.clientX;
    _isActive.current = true;
    springScale.set(1.75);
    setShowHover(true);
  };

  useEffect(() => {
    const _onPointerUp = (e: PointerEvent) => {
      if (!_isActive.current) return;
      _isActive.current = false;

      if (startX.current !== undefined) {
        const dist = e.clientX - startX.current;
        if (dist > 16 && !checked) handleChange(true);
        else if (dist < -16 && checked) handleChange(false);
        startX.current = undefined;
      }

      springScale.set(restingScale);
      containerRef.current?.blur();
      (document.activeElement as HTMLElement)?.blur();
      setShowHover(false);
    };
    window.addEventListener("pointerup", _onPointerUp);
    return () => window.removeEventListener("pointerup", _onPointerUp);
  }, [checked, onChange, springScale, restingScale]);

  return (
    <div
      className={[
        "m3-switch",
        checked ? "m3-switch--checked" : "",
        disabled ? "m3-switch--disabled" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerDown={_handlePointerDown}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onDragStart={(e) => e.preventDefault()}
    >
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => handleChange(e.currentTarget.checked)}
        onKeyDown={(e) => {
          if (e.code === "Enter") handleChange(!checked);
          if (e.code === "ArrowLeft") handleChange(false);
          if (e.code === "ArrowRight") handleChange(true);
        }}
      />

      <motion.div
        className="m3-switch__handle"
        style={{ left: 0, x: springX, y: 0, scale: springScale }}
      >
        {icons !== "none" && (
          <div className="m3-switch__icon-container">
            <motion.span
              className="m3-switch__icon m3-switch__icon--check m3-switch__icon--checked"
              animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0 }}
            >
              {checkedIcon ?? <Check size={10} strokeWidth={4} />}
            </motion.span>

            {(icons === "both" || uncheckedIcon) && (
              <motion.span
                className="m3-switch__icon m3-switch__icon--close m3-switch__icon--unchecked"
                animate={{ opacity: checked ? 0 : 1, scale: checked ? 0 : 1 }}
              >
                {uncheckedIcon ?? <X size={10} strokeWidth={4} />}
              </motion.span>
            )}
          </div>
        )}
      </motion.div>

      {(showHover || isHovered) && <div className="m3-switch__hover" />}
    </div>
  );
}