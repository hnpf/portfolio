import { useMemo, useState, useEffect } from "react";
import { linear, trackOpacity } from "../_wavy";
import { useTheme } from "../ThemeContext";

interface WavyProgressProps {
  width?: number;
  height?: number;
  thickness?: number;
  percent: number;
  className?: string;
  pride?: boolean;
}

const PRIDE_PALETTES: Record<string, string[]> = {
  rainbow: ["#E40303", "#FF8C00", "#FFED00", "#008026", "#24408E", "#732982"],
  trans: ["#5BCEFA", "#F5A9B8", "#FFFFFF", "#F5A9B8", "#5BCEFA"],
  bi: ["#D60270", "#9B4F96", "#0038A8"],
  pan: ["#FF218C", "#FFD800", "#21B1FF"],
  nonbinary: ["#FCF434", "#FFFFFF", "#9C59D1", "#2C2C2C"],
  lesbian: ["#D52D00", "#EF7627", "#FF9A56", "#FFFFFF", "#D462A6", "#B55690", "#A30262"],
};

const IS_JUNE = new Date().getMonth() === 5;

export default function WavyProgress({
  width = 600,
  height = 10,
  thickness = 4,
  percent,
  className,
  pride = false,
}: WavyProgressProps) {
  const { settings } = useTheme();
  const [paletteIndex, setPaletteIndex] = useState(0);
  const isPrideActive = pride || IS_JUNE;

  const palettes = useMemo(() => Object.values(PRIDE_PALETTES), []);
  const currentPalette = palettes[paletteIndex];

  useEffect(() => {
    if (!isPrideActive) return;
    const interval = setInterval(() => {
      setPaletteIndex((prev) => (prev + 1) % palettes.length);
    }, 4000); // cycle every 4 seconds
    return () => clearInterval(interval);
  }, [isPrideActive, palettes.length]);

  const left = thickness * 0.5;
  const right = width - thickness * 0.5;
  const percentX = (percent / 100) * (right - left) + left;

  const smil_data = useMemo(() => {
    let paths: string[] = [];
    for (let x = 0; x <= 1000; x += 1000 / 20) {
      paths.push(
        linear(thickness / 2, height - thickness / 2, left, percentX, x),
      );
    }
    return paths.join(";");
  }, [height, left, percentX, thickness]);

  const track_x1 = percentX + thickness + 4;
  const track_opacity = trackOpacity(right, track_x1);

  const gradientId = useMemo(() => `pride-grad-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="progressbar"
      className={className}
      preserveAspectRatio="none"
      style={{ width: "100%", height: "auto", overflow: "visible" }}
      shapeRendering="geometricPrecision"
    >
      {isPrideActive && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {currentPalette.map((color, i) => (
              <stop
                key={`${paletteIndex}-${i}`}
                offset={`${(i / (currentPalette.length - 1)) * 100}%`}
                stopColor={color}
              >
                {!settings.disableAnimations && (
                  <animate
                    attributeName="stop-color"
                    values={color}
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </stop>
            ))}
          </linearGradient>
        </defs>
      )}
      <path
        fill="none"
        stroke={isPrideActive ? `url(#${gradientId})` : "currentColor"}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        d={settings.disableAnimations ? smil_data.split(";")[0] : undefined}
      >
        {!settings.disableAnimations && (
          <animate
            attributeName="d"
            dur="1s"
            repeatCount="indefinite"
            values={smil_data}
          />
        )}
      </path>
      <line
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeLinecap="round"
        x1={track_x1}
        y1={height / 2}
        x2={right}
        y2={height / 2}
        opacity={track_opacity * (isPrideActive ? 0.15 : 0.3)} // even more dimmed for pride mode to let gradient shine
      />
    </svg>
  );
}
