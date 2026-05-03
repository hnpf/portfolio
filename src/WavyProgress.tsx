import { useMemo } from "react";
import { linear, trackOpacity } from "./_wavy";

interface WavyProgressProps {
  width?: number;
  height?: number;
  thickness?: number;
  percent: number;
  className?: string;
}

export default function WavyProgress({
  width = 600,
  height = 10,
  thickness = 4,
  percent,
  className,
}: WavyProgressProps) {
  // unique id so multiple instances dont fight over the same filter def
  const filter_id = useMemo(
    () => `aa-${Math.random().toString(36).slice(2, 7)}`,
    [],
  );

  const left = thickness * 0.5;
  const right = width - thickness * 0.5;
  const percentX = (percent / 100) * (right - left) + left;

  const smil_data = useMemo(() => {
    let paths: string[] = [];
    for (let x = 0; x <= 1000; x += 1000 / 30) {
      paths.push(
        linear(thickness / 2, height - thickness / 2, left, percentX, x),
      );
    }
    return paths.join(";");
  }, [height, left, percentX, thickness]);

  const track_x1 = percentX + thickness + 4;
  const track_opacity = trackOpacity(right, track_x1);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="progressbar"
      className={className}
      preserveAspectRatio="none"
      shapeRendering="geometricPrecision"
      style={{ width: "100%", height: "auto", overflow: "visible" }}
    >
      <defs>
        <filter id={filter_id} x="-10%" y="-100%" width="120%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feComposite in="blur" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>

      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeLinecap="round"
        filter={`url(#${filter_id})`}
      >
        <animate
          attributeName="d"
          dur="1s"
          repeatCount="indefinite"
          values={smil_data}
        />
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
        opacity={track_opacity * 0.3}
        filter={`url(#${filter_id})`}
      />
    </svg>
  );
}
