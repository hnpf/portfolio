// @ts-nocheck

import { useEffect, useRef } from "react";
import { motion, useSpring } from "motion/react";
import { Check, X } from "lucide-react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  icons?: "checked" | "both" | "none";
  className?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  icons = "both",
  className,
}: SwitchProps) {
  const startX = useRef<number | undefined>(undefined);
  const _isActive = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const playNotch = () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate)
        navigator.vibrate(1);
    } catch (e) {}
  };

  const handleChange = (val: boolean) => {
    if (val !== checked) {
      playNotch();
      onChange(val);
    }
  };

  // M3 Spec: Track is 52x32px.
  // Handle is 16px base, scales to 24px (1.4x) or 28px (1.75x).
  // Scaling happens from center, so we offset x to keep gaps even.

  const hasUncheckedIcon = icons === "both";
  const restingScale = checked || hasUncheckedIcon ? 1.4 : 1;
  // Track = 52px. Handle (scaled) = 24px.
  // Center for 6px gap (Off): 6 + 12 = 18. Base center = 8. x = 10.
  // Center for 6px gap (On): 52 - 6 - 12 = 34. Base center = 8. x = 26.
  const restingX = checked ? 26.8 : 8.0;

  const springX = useSpring(restingX, {
    stiffness: 450,
    damping: 30,
    mass: 0.8,
  });
  const springScale = useSpring(restingScale, {
    stiffness: 450,
    damping: 30,
    mass: 0.8,
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
    springScale.set(1.75); // touches borders perfectly at 28px
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
          2;
          if (e.code === "ArrowRight") handleChange(true);
        }}
      />

      <motion.div
        className="m3-switch__handle"
        style={{ left: 0, x:  springX, y: 0, scale: springScale }}
      >
        {icons !== "none" && (
          <div className="m3-switch__icon-container">
            <motion.span
              className="m3-switch__icon m3-switch__icon--check"
              animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0 }}
            >
              <Check size={10} strokeWidth={4} />
            </motion.span>

            {icons === "both" && (
              <motion.span
                className="m3-switch__icon m3-switch__icon--close"
                animate={{ opacity: checked ? 0 : 1, scale: checked ? 0 : 1 }}
              >
                <X size={10} strokeWidth="4" />
              </motion.span>
            )}
          </div>
        )}
      </motion.div>

      <div className="m3-switch__hover" />
    </div>
  );
}
