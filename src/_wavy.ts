/**
 * wavy logic helpers for SMIL animations
 * ported from a16 comp wavy progress impl
 */

export function linear(
  y_min: number, 
  y_max: number, 
  x_start: number, 
  x_end: number, 
  time: number, 
  x_curr?: number
) {
  const x_target = x_curr ?? x_end;
  const wavelength = 20;
  const amplitude = (y_max - y_min) / 2;
  const y_mid = (y_max + y_min) / 2;
  const phase = (time / 1000) * 2 * Math.PI;

  let path = `M ${x_start} ${y_mid}`;
  const segments = Math.ceil((x_target - x_start) / 2);
  
  for (let i = 0; i <= segments; i++) {
    const x = x_start + (i / segments) * (x_target - x_start);
    
    // dampen wave at start and end for "expressive" look
    const dist_from_start = x - x_start;
    const dist_from_end = x_target - x;
    const dampen = Math.min(1, dist_from_start / 20) * Math.min(1, dist_from_end / 20);
    
    const y = y_mid + Math.sin((x / wavelength) * 2 * Math.PI - phase) * amplitude * dampen;
    path += ` L ${x} ${y}`;
  }
  
  return path;
}

export function trackOpacity(right: number, x: number) {
  // fade out track as it approaches the end
  const fade_dist = 12;
  const dist = right - x;
  return Math.min(1, Math.max(0, dist / fade_dist));
}
