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
  const left = thickness * 0.5;
  const right = width - thickness * 0.5;
  const percentX = (percent / 100) * (right - left) + left;

  const smil_data = useMemo(() => {
    let paths: string[] = [];
    // 20 fps for 1 second = 20 frames (enough for smooth waves now)
    for (let x = 0; x <= 1000; x += 1000 / 20) {
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
      style={{ width: "100%", height: "auto", overflow: "visible" }}
      shapeRendering="geometricPrecision"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
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
        opacity={track_opacity * 0.3} // dimmed track
      />
    </svg>
  );
}
