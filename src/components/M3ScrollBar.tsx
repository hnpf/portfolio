// @ts-nocheck
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "motion/react";

// ─────────────────────────────────────────────────────────────────────────────
// constants (mirroring QML values)
// ─────────────────────────────────────────────────────────────────────────────

const BAR_WIDTH     = 6;   // thin state (px) root.barWidth
const BAR_WIDE      = 24;  // hovered state (px) barWidth * 4
const TRACK_GAP     = 6;   // gap between track segment and thumb (px)
const PAD           = 6;   // topPadding / bottomPadding (px)
const ROUNDING_LG   = 14;  // Appearance.rounding.large (px)

// ─────────────────────────────────────────────────────────────────────────────
// M3ScrollBar
// ─────────────────────────────────────────────────────────────────────────────

interface M3ScrollBarProps {
  scrollEl?: React.RefObject<HTMLElement | null>;
  thumbColor?: string;
  alwaysVisible?: boolean;
  colorful?: boolean;
  className?: string;
}

export const M3ScrollBar = forwardRef<HTMLDivElement, M3ScrollBarProps>(
  function M3ScrollBar({ scrollEl, thumbColor, alwaysVisible = false, colorful = true, className = "" }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => hostRef.current!);

    const [thumbRatio, setThumbRatio]   = useState(0);
    const [thumbOffset, setThumbOffset] = useState(0);
    const [scrollable, setScrollable]   = useState(false);

    const [hovered,  setHovered]  = useState(false);
    const [dragging, setDragging] = useState(false);

    const targetRef = useRef<HTMLElement | null>(null);

    // ── resolve scroll target ────────────────────────────────────────
    useEffect(() => {
      if (scrollEl?.current) {
        targetRef.current = scrollEl.current;
        return;
      }
      const host = hostRef.current;
      if (!host) return;
      let el = host.parentElement;
      while (el && el !== document.body) {
        const { overflow, overflowY } = getComputedStyle(el);
        if (/auto|scroll/.test(overflow) || /auto|scroll/.test(overflowY)) {
          targetRef.current = el;
          break;
        }
        el = el.parentElement;
      }
    }, [scrollEl]);

    // ── sync scroll metricz ──────────────────────────────────────────────
    const sync = useCallback(() => {
      const el = targetRef.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const ratio  = scrollHeight > 0 ? clientHeight / scrollHeight : 1;
      const offset = scrollHeight > clientHeight
        ? scrollTop / (scrollHeight - clientHeight)
        : 0;
      setThumbRatio(Math.min(1, ratio));
      setThumbOffset(Math.max(0, Math.min(1, offset)));
      setScrollable(ratio < 0.999);
    }, []);

    useEffect(() => {
      const el = targetRef.current;
      if (!el) return;
      sync();
      el.addEventListener("scroll", sync, { passive: true });
      const ro = new ResizeObserver(sync);
      ro.observe(el);
      return () => { el.removeEventListener("scroll", sync); ro.disconnect(); };
    }, [sync]);

    // ── dragging ─────────────────────────────────────────────────────────
    const dragStartY  = useRef(0);
    const dragStartST = useRef(0);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
      dragStartY.current  = e.clientY;
      dragStartST.current = targetRef.current?.scrollTop ?? 0;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
      if (!dragging) return;
      const el = targetRef.current;
      if (!el) return;
      const trackH   = (hostRef.current?.clientHeight ?? el.clientHeight) - PAD * 2;
      const thumbH   = trackH * thumbRatio;
      const usable   = trackH - thumbH;
      const dy       = e.clientY - dragStartY.current;
      const scrollable = el.scrollHeight - el.clientHeight;
      el.scrollTop = Math.max(0, Math.min(scrollable, dragStartST.current + (dy / usable) * scrollable));
    }, [dragging, thumbRatio]);

    const onPointerUp = useCallback(() => setDragging(false), []);

    // ── colors ───────────────────────────────────────────────────────────
    const thumb = thumbColor ?? (colorful ? "var(--primary)" : "var(--on-surface-variant)");
    const track = `color-mix(in srgb, ${thumb} 25%, transparent)`;

    const active     = hovered || dragging;
    const showBar    = alwaysVisible || (scrollable && active);
    const opacity    = showBar ? 0.85 : 0;

    // geometry
    const thumbTopFrac = thumbOffset * (1 - thumbRatio);

    const topTrackH    = `max(0px, calc(${thumbTopFrac * 100}% - ${TRACK_GAP}px))`;
    const bottomTrackT = `calc(${(thumbTopFrac + thumbRatio) * 100}% + ${TRACK_GAP}px)`;

    if (!scrollable && !alwaysVisible) {
      return <div ref={hostRef} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: BAR_WIDE + 6, pointerEvents: "none" }} />;
    }

    return (
      <div
        ref={hostRef}
        className={className}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: BAR_WIDE + 6, display: "flex", justifyContent: "flex-end", alignItems: "stretch", zIndex: 10 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { if (!dragging) setHovered(false); }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div style={{ position: "relative", width: BAR_WIDE + 4, paddingTop: PAD, paddingBottom: PAD, opacity, transition: "opacity 350ms cubic-bezier(0.4,0,0.2,1)" }}>

          {/* top track */}
          <div style={{ position: "absolute", right: 0, top: PAD, height: topTrackH, width: BAR_WIDTH, borderRadius: 9999, backgroundColor: track }} />

          {/* bottom track */}
          <div style={{ position: "absolute", right: 0, top: bottomTrackT, bottom: PAD, width: BAR_WIDTH, borderRadius: 9999, backgroundColor: track }} />

          {/* thumb container, which floats at right edge */}
          <motion.div
            style={{ position: "absolute", right: 0, top: `${thumbTopFrac * 100}%`, height: `${thumbRatio * 100}%`, cursor: dragging ? "grabbing" : "grab", display: "flex", alignItems: "center", justifyContent: "center" }}
            onPointerDown={onPointerDown}
          >
            {/* growing pill/ridge, also anchored to right edge */}
            <motion.div
              animate={{
                width: active ? BAR_WIDE : BAR_WIDTH,
                borderTopLeftRadius:    active ? ROUNDING_LG : BAR_WIDTH / 2,
                borderBottomLeftRadius: active ? ROUNDING_LG : BAR_WIDTH / 2,
                borderTopRightRadius:    BAR_WIDTH / 2,
                borderBottomRightRadius: BAR_WIDTH / 2,
              }}
              transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
              style={{ position: "absolute", right: 0, top: 0, bottom: 0, backgroundColor: thumb, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
            >
              <AnimatePresence>
                {active && (
                  <motion.div
                    key="arrows"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.6, 1] }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
                  >
                    <DragHandle />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// deaghandgekfds — bidirecional vertical arrow while hovering/dragging
// ─────────────────────────────────────────────────────────────────────────────

function DragHandle() {
  const c = "var(--surface)";
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{ display: "block", flexShrink: 0 }}>
      {/* up arrowhead */}
      <path d="M5 1L9 5.5H1L5 1Z" fill={c} fillOpacity={0.9} />
      {/* Stem */}
      <rect x="4" y="5" width="2" height="6" rx="1" fill={c} fillOpacity={0.9} />
      {/* down arrowhead */}
      <path d="M5 15L9 10.5H1L5 15Z" fill={c} fillOpacity={0.9} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// any scrollable region and overlays the bar
// keep native scrollbar behaviour on mobile
// ─────────────────────────────────────────────────────────────────────────────

interface M3ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  colorful?: boolean;
  alwaysVisible?: boolean;
  innerClassName?: string;
  innerStyle?: React.CSSProperties;
}

export function M3ScrollContainer({
  children,
  className = "",
  style,
  colorful = true,
  alwaysVisible = false,
  innerClassName = "",
  innerStyle,
}: M3ScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }} className={className}>
      <div
        ref={scrollRef}
        className={`scrollbar-hide ${innerClassName}`}
        style={{ overflow: "auto", height: "100%", width: "100%", paddingRight: isTouch ? 0 : 2, boxSizing: "border-box", ...innerStyle }}
      >
        {children}
      </div>

      {!isTouch && (
        <M3ScrollBar
          scrollEl={scrollRef}
          colorful={colorful}
          alwaysVisible={alwaysVisible}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// hook based API for attaching the bar to an existing ref
// return jsx to render inside the same positioned thing as target
// ─────────────────────────────────────────────────────────────────────────────

export function useM3Scrollbar(
  scrollRef: React.RefObject<HTMLElement | null>,
  options: { colorful?: boolean; alwaysVisible?: boolean } = {}
) {
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );
  if (isTouch) return null;
  return (
    <M3ScrollBar
      scrollEl={scrollRef}
      colorful={options.colorful ?? true}
      alwaysVisible={options.alwaysVisible ?? false}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// fixed position bar for window/body-level scrolling stuff (M3WindowScrollBar)
// render this once in app on non mobile layouts
// ─────────────────────────────────────────────────────────────────────────────

interface M3WindowScrollBarProps {
  colorful?: boolean;
  /** side offset from right edge (px). default 4. */
  right?: number;
}

export function M3WindowScrollBar({ colorful = true, right = 4 }: M3WindowScrollBarProps) {
  const [thumbRatio,  setThumbRatio]  = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [scrollable,  setScrollable]  = useState(false);
  const [hovered,     setHovered]     = useState(false);
  const [dragging,    setDragging]    = useState(false);
  const [isTouch,     setIsTouch]     = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // sync metrics from window scroll
  const sync = useCallback(() => {
    const sh = document.documentElement.scrollHeight;
    const ch = window.innerHeight;
    const st = window.scrollY;
    const ratio  = sh > 0 ? ch / sh : 1;
    const offset = sh > ch ? st / (sh - ch) : 0;
    setThumbRatio(Math.min(1, ratio));
    setThumbOffset(Math.max(0, Math.min(1, offset)));
    setScrollable(ratio < 0.999);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      ro.disconnect();
    };
  }, [sync]);

  // drag to scroll
  const hostRef     = useRef<HTMLDivElement>(null);
  const dragStartY  = useRef(0);
  const dragStartST = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStartY.current  = e.clientY;
    dragStartST.current = window.scrollY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const trackH  = window.innerHeight - PAD * 2;
    const thumbH  = trackH * thumbRatio;
    const usable  = trackH - thumbH;
    const dy      = e.clientY - dragStartY.current;
    const maxST   = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Math.max(0, Math.min(maxST, dragStartST.current + (dy / usable) * maxST)) });
  }, [dragging, thumbRatio]);

  const onPointerUp = useCallback(() => setDragging(false), []);

  if (isTouch || !scrollable) return null;

  const thumb = colorful ? "var(--primary)" : "var(--on-surface-variant)";
  const track = `color-mix(in srgb, ${thumb} 25%, transparent)`;
  const active = hovered || dragging;
  const thumbTopFrac = thumbOffset * (1 - thumbRatio);
  const topTrackH    = `max(0px, calc(${thumbTopFrac * 100}% - ${TRACK_GAP}px))`;
  const bottomTrackT = `calc(${(thumbTopFrac + thumbRatio) * 100}% + ${TRACK_GAP}px)`;

  return (
    <div
      ref={hostRef}
      style={{
        position: "fixed",
        top: 0,
        right,
        bottom: 0,
        width: BAR_WIDE + 6,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "stretch",
        zIndex: 9000,
        pointerEvents: "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!dragging) setHovered(false); }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div style={{
        position: "relative",
        width: BAR_WIDE + 4,
        paddingTop: PAD,
        paddingBottom: PAD,
        opacity: active ? 0.85 : scrollable ? 0.4 : 0,
        transition: "opacity 350ms cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ position: "absolute", right: 0, top: PAD, height: topTrackH, width: BAR_WIDTH, borderRadius: 9999, backgroundColor: track }} />
        <div style={{ position: "absolute", right: 0, top: bottomTrackT, bottom: PAD, width: BAR_WIDTH, borderRadius: 9999, backgroundColor: track }} />
        <motion.div
          style={{ position: "absolute", right: 0, top: `${thumbTopFrac * 100}%`, height: `${thumbRatio * 100}%`, cursor: dragging ? "grabbing" : "grab", display: "flex", alignItems: "center" }}
          onPointerDown={onPointerDown}
        >
          <motion.div
            animate={{
              width: active ? BAR_WIDE : BAR_WIDTH,
              borderTopLeftRadius:    active ? ROUNDING_LG : BAR_WIDTH / 2,
              borderBottomLeftRadius: active ? ROUNDING_LG : BAR_WIDTH / 2,
              borderTopRightRadius:    BAR_WIDTH / 2,
              borderBottomRightRadius: BAR_WIDTH / 2,
            }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            style={{ position: "absolute", right: 0, top: 0, bottom: 0, backgroundColor: thumb, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
          >
            <AnimatePresence>
              {active && (
                <motion.div
                  key="arrows"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.6, 1] }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
                >
                  <DragHandle />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
