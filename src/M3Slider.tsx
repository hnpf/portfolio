import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { motion, useSpring, useTransform, animate } from "motion/react";

type SliderSize = "xs" | "s" | "m" | "l" | "xl";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | "any";
  disabled?: boolean;
  showValue?: boolean;
  size?: SliderSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  stops?: boolean;
  endStops?: boolean;
  vertical?: boolean;
  format?: (n: number) => string;
  className?: string;
}

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = "any",
  disabled = false,
  showValue = true,
  size = "xs",
  leadingIcon,
  trailingIcon,
  stops = false,
  endStops = true,
  vertical = false,
  format = (n) => n.toFixed(0),
  className,
}: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetWidth, setOffsetWidth] = useState(600);
  const [offsetHeight, setOffsetHeight] = useState(600);
  const inlineSize = vertical ? offsetHeight : offsetWidth;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setOffsetWidth(el.offsetWidth);
      setOffsetHeight(el.offsetHeight);
    });
    ro.observe(el);
    setOffsetWidth(el.offsetWidth);
    setOffsetHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const springValue = useSpring(value, { stiffness: 170, damping: 26 });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const range = max - min;
  const _getHandle = (v: number) => (v - min) / range;

  const handlePos = useTransform(springValue, (v) => _getHandle(v) - 0.5);

  const _buildStopList = useCallback(() => {
    const output: number[] = [];
    const add = (stop: number) => {
      if (leadingIcon && stop === 0) return;
      if (trailingIcon && stop === 1) return;
      output.push(stop);
    };

    if (stops && typeof step === "number") {
      for (let i = 0; i <= range; i += step) add(i / range);
    }
    if (endStops && !output.includes(1)) {
      add(1);
    }

    return output;
  }, [stops, step, range, endStops, leadingIcon, trailingIcon]);

  const stopList = _buildStopList();

  const iconSize = { xs: 0, s: 16, m: 24, l: 24, xl: 32 }[size];
  const iconThreshold = size === "xl" ? 48 : 40;

  return (
    <motion.div
      ref={containerRef}
      className={`m3-slider m3-slider--${size}${vertical ? " m3-slider--vertical" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          "--handle": handlePos,
        } as any
      }
    >
      <input
        type="range"
        onInput={(e) => onChange(Number(e.currentTarget.value))}
        value={value}
        min={min}
        max={max}
        step={step === "any" ? undefined : step}
        disabled={disabled}
        onChange={() => {}}
      />

      {/* track-1 (filled) */}
      <div className="m3-slider__track-1">
        {stopList.map((stop, i) => (
          <div key={i} className="m3-slider__stop" style={{ "--x": stop - 0.5 } as React.CSSProperties} />
        ))}
      </div>

      {/* track-2 (empty) */}
      <div className="m3-slider__track-2">
        {stopList.map((stop, i) => (
          <div key={i} className="m3-slider__stop" style={{ "--x": stop - 0.5 } as React.CSSProperties} />
        ))}
      </div>

      {leadingIcon && (
        <span
          className="m3-slider__icon m3-slider__icon--leading transition-colors duration-200"
          style={{
            width: iconSize,
            height: iconSize,
            color: inlineSize * _getHandle(value) < iconThreshold
              ? "var(--primary)"
              : "var(--primary-container)",
          }}
        >
          {leadingIcon}
        </span>
      )}

      {trailingIcon && (
        <span
          className="m3-slider__icon m3-slider__icon--trailing transition-colors duration-200"
          style={{
            width: iconSize,
            height: iconSize,
            color: inlineSize * (1 - _getHandle(value)) < iconThreshold
              ? "var(--primary-container)"
              : "var(--primary)",
          }}
        >
          {trailingIcon}
        </span>
      )}

      <div className="m3-slider__handle" />

      {showValue && (
        <div className="m3-slider__value">{format(value)}</div>
      )}
    </motion.div>
  );
}
