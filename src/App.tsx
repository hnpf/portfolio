import React, { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from "motion/react";
import {
  Home,
  Info,
  BookText,
  Camera,
  Activity,
  Fingerprint,
  Settings as SettingsIcon,
  Cpu,
  Github,
  Mail,
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Layers,
  Palette,
  Check,
  X,
  ExternalLink,
  Copy,
  Terminal,
  SquareTerminal,
  MapPin,
  Download,
  BookOpen,
  Pipette,
  EyeOff,
  Maximize,
  Maximize2,
  Image,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  History,
  Target,
  Archive,
  Code2,
} from "lucide-react";
import NotFound from "./NotFound";
import DashPage from "./Dash";
import NoPage from "./No";
import { useTheme } from "./ThemeContext";
import {
  cn,
  PROJECTS,
  BLOG_POSTS,
  CHANGELOGS,
  TRACKER_ITEMS,
  //HARDWARE_SPECS,
  TECH_STACK,
  type ChangelogEntry,
} from "./constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyLinkCapsule from "./CopyLinkCapsule";
import Slider from "./M3Slider";
import Switch from "./M3Switch";
import WavyProgress from "./WavyProgress";
import "./navigation/navigation-rail.css";

// --- building blocks ---

const TiltContainer = memo(({ children, className, innerClassName, onClick, settings, ...props }: any) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // use springs for much smoother tracking than manual animate calls
  const springConfig = { stiffness: 150, damping: 25, mass: 0.5 };
  const rx = useSpring(0, springConfig);
  const ry = useSpring(0, springConfig);

  useEffect(() => {
    if (!settings?.bentoTilt) {
      rx.set(0);
      ry.set(0);
    }
  }, [settings?.bentoTilt, rx, ry]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (settings?.disableAnimations || !settings?.bentoTilt || window.innerWidth < 768) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // sink: tilt away from the cursor
    const targetX = -((py - centerY) / centerY) * 15;
    const targetY = ((px - centerX) / centerX) * 15;
    
    rx.set(targetX);
    ry.set(targetY);
    
    const glareX = (px / rect.width) * 100;
    const glareY = (py / rect.height) * 100;
    const card = cardRef.current;
    if (card) {
      card.style.setProperty("--glare-x", `${glareX}%`);
      card.style.setProperty("--glare-y", `${glareY}%`);
      card.style.setProperty("--glare-opacity", "0.15");
    }
  };
  
  const handleMouseLeave = () => {
    rx.set(0);
    ry.set(0);
    const card = cardRef.current;
    if (card) card.style.setProperty("--glare-opacity", "0");
  };
  
  return (
    <div 
      ref={wrapperRef}
      className={cn("h-full", className)} // wrapper fills grid/flex area
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        perspective: settings?.bentoTilt ? "1000px" : "none", 
        transformStyle: settings?.bentoTilt ? "preserve-3d" : "flat" 
      }}
    >
      <motion.div
        ref={cardRef}
        onClick={onClick}
        whileHover={settings?.disableAnimations ? undefined : props.whileHover}
        whileTap={settings?.disableAnimations ? undefined : props.whileTap}
        {...props}
        className={cn("w-full h-full outline-none", innerClassName)}
        style={{
          ...props.style,
          position: "relative",
          transformStyle: settings?.bentoTilt ? "preserve-3d" : "flat",
          rotateX: settings?.bentoTilt ? rx : 0,
          rotateY: settings?.bentoTilt ? ry : 0,
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* glare layer, only pulled forward slightly */}
        {settings?.bentoTilt && (
          <div
            className="pointer-events-none absolute inset-[-1px] transition-opacity duration-300 rounded-[inherit]"
            style={{
              background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.2) 0%, transparent 60%)`,
              opacity: "var(--glare-opacity, 0)",
              mixBlendMode: "overlay",
              transform: "translateZ(1px)", 
              zIndex: 1,
            }}
          />
        )}
        {/* simplified content layer so native hit detection works */}
        <div className="relative w-full h-full rounded-[inherit] z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
});

const BounceButton = ({
  icon: Icon,
  label,
  url,
  className = "",
}: {
  icon: any;
  label: string;
  url: string;
  className?: string;
}) => {
  const [loading, set_loading] = useState(false);

  const _on_click = (e: React.MouseEvent) => {
    e.preventDefault();
    set_loading(true);
    setTimeout(() => {
      window.open(url, "_blank");
      set_loading(false);
    }, 600);
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.08,
        y: -5,
        borderRadius: "40px",
      }}
      whileTap={{ scale: 0.9, rotate: -2 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 1
      }}
      onClick={_on_click}
      disabled={loading}
      className={cn(
        "relative overflow-hidden transition-colors duration-300",
        loading && "cursor-wait opacity-80",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Loader2 size={18} className="animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2"
          >
            <Icon size={18} />
            <span className="font-bold">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const TechChip = ({ label, key }: { label: string; key?: any }) => { // yes this is a required key prop, don't ask :(
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, set_pos] = useState({ x: 50, y: 50 });
  const [hovered, set_hovered] = useState(false);

  const _on_move = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    set_pos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <span
      ref={ref}
      onMouseMove={_on_move}
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
      style={{
        background: hovered
          ? `radial-gradient(ellipse 80% 80% at ${pos.x}% ${pos.y}%, color-mix(in srgb, var(--primary) 20%, transparent), var(--primary-container) 0%) , color-mix(in srgb, var(--primary-container) 30%, transparent)`
          : undefined,
      }}
      className="px-2 py-1 md:px-4 md:py-2 bg-[var(--primary-container)]/30 text-[var(--on-surface)] rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold border-6 border-[var(--outline-variant)] hover:scale-110 active:scale-95 hover:border-[var(--primary)]/60 transition-all duration-150 ease-out cursor-default select-none will-change-transform"
    >
      {label}
    </span>
  );
};

const IS_APR = (() => {
  const now = new Date();
  return now.getMonth() === 3 && now.getDate() === 1;
})();

const FshBtn = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState(0);
  const active = IS_APR;

  const run_away = (e: React.MouseEvent) => {
    if (!active || clicks > 5) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;
    const dx = e.clientX - bx;
    const dy = e.clientY - by;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) {
      setPos((p) => ({
        x: p.x + (dx > 0 ? -50 : 50),
        y: p.y + (dy > 0 ? -50 : 50),
      }));
    }
  };

  if (!active) return null;

  return (
    <motion.button
      animate={{ x: pos.x, y: pos.y }}
      onMouseMove={run_away}
      onClick={() => setClicks((c) => c + 1)}
      className="m3-button-filled mt-8 w-fit"
    >
      LOGIN RIGHT NOW!!!!!
    </motion.button>
  );
};

const AdCard = () => {
  const ads = [
    {
      t: "HOT SPIDERS WANT TO CHAT (NO VIRUS)",
      img: "/photography/PXL_20260108_040856251.webp",
    },
    { t: "DOWNLOAD 128GB RAM (FREE)", img: "/fsh-spin.gif" },
    { t: "THIS FISH SPINS. SEE HOW HE DOES IT.", img: "/fsh-spin.gif" },
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const itv = setInterval(() => setIdx((i) => (i + 1) % ads.length), 2000);
    return () => clearInterval(itv);
  }, [ads.length]);

  if (!IS_APR) return null;

  return (
    <Card className="" innerClassName="fsh-ad flex flex-col items-center justify-center p-4 !bg-yellow-400">
      <div className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-2 mb-2">
        PROMOTED
      </div>
      <h3 className="text-xl font-bold text-center mb-4">{ads[idx].t}</h3>
      <img
        src={ads[idx].img}
        className="w-32 h-32 object-cover border-4 border-black"
      />
      <button
        onClick={() => (window.location.href = "/fsh-spin.gif")}
        className="mt-4 bg-blue-600 text-white font-black px-6 py-2 uppercase italic text-sm hover:scale-110 transition-transform"
      >
        CLICK HERE NOW!!!
      </button>
    </Card>
  );
};

const CursedPopup = ({
  content,
  onResolve,
}: {
  content: string;
  onResolve: () => void;
}) => {
  if (!IS_APR) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--surface)]/80 backdrop-blur-3xl overflow-hidden motion-gpu">
      <div className="fsh-tiled-bg !opacity-40" />

      <div className="bg-[var(--primary-container)] border-4 border-[var(--primary)] p-8 md:p-12 max-w-2xl w-full rounded-[3rem] shadow-2xl relative z-10 animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-display font-black text-[var(--on-primary-container)] tracking-tight">
            be advisory!11!
          </h2>
        </div>
        <p className="text-2xl font-medium text-[var(--on-surface)] mb-10 leading-relaxed italic">
          "{content}"
        </p>
        <button
          onClick={onResolve}
          className="m3-button-filled w-full h-20 !rounded-2xl text-2xl font-black tracking-widest"
        >
          Just fih.
        </button>
      </div>
    </div>
  );
};

const HelloVirex = () => {
  const words = [
    "virex",
    "вирекс",
    "βίρεξ",
    "վիրեքս",
    "וירקס",
    "ვირექს",
    "비렉스",
    "维雷克斯",
    "ڤيركس",
  ];
  const [widx, setWidx] = useState(0);
  const { settings } = useTheme();

  useEffect(() => {
    const ticker = setTimeout(() => {
      setWidx((prev) => (prev + 1) % words.length);
    }, 4000);
    return () => clearTimeout(ticker);
  }, [widx, words.length]);

  return (
    <div className="h-[8rem] md:h-[10rem] flex items-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[widx]}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.8,
          }}
          transition={{
            type: settings.disableAnimations ? "tween" : "spring",
            duration: settings.disableAnimations ? 0 : undefined,
            stiffness: settings.highHz ? 600 : 400,
            damping: settings.highHz ? 22 : 20,
            mass: 0.8,
          }}
          className="text-8xl md:text-[10rem] font-display font-black tracking-tighter leading-[0.8] text-balance flex items-baseline"
        >
          {words[widx]}
          <motion.span className="text-[var(--primary)] select-none relative z-[60] inline-block">
            .
          </motion.span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};
const SideItem = memo(
  ({
    glyph: Icon,
    text,
    isSelected,
    onSelect,
    isMini,
    isFirst,
    isLast,
    isFloating,
    isShort,
    layoutId,
    highHz,
  }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    // squishy spring, better settle
    const squishySpring = {
      type: "spring" as const,
      stiffness: highHz ? 400 : 350,
      damping: highHz ? 28 : 25,
      mass: 0.8,
    };

    const sideItemSpring = {
      type: "spring" as const,
      stiffness: highHz ? 800 : 700,
      damping: highHz ? 40 : 35,
      mass: 0.2,
    };

    const settingsSpring = {
      type: "spring" as const,
      stiffness: highHz ? 400 : 300,
      damping: highHz ? 35 : 30,
      mass: 1.2,
      restDelta: 0.001,
    };

    const rd =
      isFirst && isLast
        ? "rounded-[28px]"
        : isFirst
          ? "rounded-t-[28px] rounded-b-[15px]"
          : isLast
            ? "rounded-t-[15px] rounded-b-[28px]"
            : "rounded-[15px]";

    if (isMini) {
      return (
        <motion.button
          layout="position"
          initial={false}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            opacity: { duration: 0.2 },
            layout: settingsSpring,
            default: squishySpring,
            scale: { type: "spring", stiffness: 400, damping: 28 },
            rotate: { type: "spring", stiffness: 400, damping: 24 },
          }}
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.92, rotate: -4 }}
          onClick={onSelect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative group outline-none cursor-pointer font-black motion-gpu isolate flex flex-col justify-center items-center w-full shadow-none bg-transparent gap-0",
            isShort ? "h-12" : "h-16",
            isSelected && "active",
          )}
        >
          {/* icon container */}
          <div className="relative z-10 shrink-0 flex items-center justify-center transition-all duration-300 h-8 w-14">
            {/* m3 active indicator pill (mini version) */}
            {isSelected && (
              <motion.div
                layoutId="sidebar-mini-pill"
                className="absolute inset-0 bg-[var(--primary-container)] rounded-full z-0"
                transition={sideItemSpring}
              />
            )}

            {/* mini hover pill */}
            {isHovered && !isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.8, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-[var(--surface-variant)] rounded-full -z-10"
              />
            )}

            <motion.div
              layoutId={text === "Settings" ? layoutId : undefined}
              animate={{
                scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                rotate:
                  isSelected ? -5 : isHovered ? (text === "Settings" ? 45 : -2) : 0,
              }}
              transition={text === "Settings" ? settingsSpring : {
                type: "spring" as const,
                stiffness: 400,
                damping: 25,
              }}
              style={{
                color: isSelected
                  ? "var(--on-primary-container)"
                  : isHovered
                    ? "var(--primary)"
                    : "var(--on-surface-variant)",
              }}
              className="relative z-10"
            >
              <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} fill="none" />
            </motion.div>
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity relative z-10">
            {text}
          </span>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full ml-6 px-3 py-1.5 bg-[var(--on-surface)] text-[var(--surface)] text-xs font-bold rounded-xl z-50 whitespace-nowrap shadow-xl pointer-events-none"
              >
                {text}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      );
    }

    return (
      <motion.button
        layout="position"
        initial={false}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
        }}
        transition={{
          opacity: { duration: 0.2 },
          layout: settingsSpring,
          default: squishySpring,
          scale: { type: "spring", stiffness: 400, damping: 30 },
          x: { type: "spring", stiffness: 400, damping: 30 },
        }}
        whileHover={{ scale: 1.02, x: 6 }}
        whileTap={{ scale: 0.97, x: -2 }}
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative group outline-none cursor-pointer font-black motion-gpu isolate flex items-center w-full px-4 justify-center gap-4 ring-6 ring-[var(--outline-variant)]/30",
          isFloating ? "py-2.5" : isShort ? "py-3" : "py-4",
          rd,
        )}
      >
        {/* hov background layer */}
        <motion.div
          className={cn("absolute inset-0 -z-20", rd)}
          initial={false}
          animate={{
            backgroundColor: "var(--surface-variant)",
            opacity: isSelected ? 0 : isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.1 }}
        />

        {/* expanded active indicator bg */}
        {isSelected && (
          <motion.div
            layoutId="sidebar-expanded-bg"
            className={cn("absolute inset-0 bg-[var(--primary-container)]", rd)}
            animate={{
              borderRadius:
                isFirst && isLast
                  ? "28px"
                  : isFirst
                    ? "28px 28px 15px 15px"
                    : isLast
                      ? "15px 15px 28px 28px"
                      : "15px",
            }}
            transition={sideItemSpring}
          />
        )}

        <div className="relative z-10 shrink-0 flex items-center justify-center transition-all duration-300 w-6 h-6">
          <motion.div
            layoutId={text === "Settings" ? layoutId : undefined}
            animate={{
              scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
              rotate:
                isSelected ? -5 : isHovered ? (text === "Settings" ? 45 : -2) : 0,
            }}
            transition={text === "Settings" ? settingsSpring : {
              type: "spring" as const,
              stiffness: 400,
              damping: 25,
            }}
            style={{
              color: isSelected
                ? "var(--on-primary-container)"
                : isHovered
                  ? "var(--primary)"
                  : "var(--on-surface-variant)",
            }}
          >
            <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} fill="none" />
          </motion.div>
        </div>

        <motion.span
          animate={{
            x: isSelected ? 2 : 0,
            opacity: 1,
          }}
          style={{
            color: isSelected ? "var(--on-primary-container)" : "inherit",
          }}
          transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
          className="font-display font-black tracking-tighter text-lg relative z-10 transition-colors duration-200"
        >
          {text}
        </motion.span>
      </motion.button>
    );
  },
);

const SideAction = memo(({ children, onClick, isMini, tooltip, className }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex items-center justify-center p-4 rounded-xl group relative outline-none overflow-hidden cursor-pointer motion-gpu",
        !className?.includes("bg-") &&
        "bg-[var(--surface-variant)] text-[var(--on-surface-variant)]",
        isMini ? "w-14 h-14 mx-auto" : "flex-1",
        className,
      )}
      style={{ transform: "translateZ(0)" }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-[var(--primary-container)] rounded-xl -z-10"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        style={{
          color: isHovered ? "var(--on-primary-container)" : "inherit",
        }}
        transition={{ duration: 0.2 }}
        className="relative z-10 transition-colors duration-200"
      >
        {children}
      </motion.div>

      {tooltip && (
        <div
          className={cn(
            "absolute px-3 py-1.5 bg-[var(--on-surface)] text-[var(--surface)] text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-50 whitespace-nowrap shadow-xl",
            isMini ? "left-full ml-6" : "bottom-full mb-4",
          )}
        >
          {tooltip}
        </div>
      )}
    </motion.button>
  );
});

const BotNav = memo(({
  glyph: Icon,
  text,
  isSelected,
  onSelect,
  imgSrc,
  wiggle,
  layoutId,
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = useTheme();

  const settingsSpring = {
    type: "spring" as const,
    stiffness: settings.highHz ? 450 : 350,
    damping: settings.highHz ? 35 : 30,
    mass: 1,
    restDelta: 0.001,
  };

  return (
    <motion.button
      initial={false}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        opacity: { duration: 0.2 },
        default: {
          type: "spring",
          stiffness: 450,
          damping: 28,
          mass: 0.8,
        },
      }}
      whileTap={{ scale: 0.9, y: 5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center gap-1 flex-1 pt-3 pb-2 transition-colors duration-200 relative z-10 bottom-nav-item outline-none",
        isSelected
          ? "text-[var(--on-surface)]"
          : "text-[var(--on-surface-variant)]",
      )}
    >
      <div className="relative flex items-center justify-center w-16 h-8 mb-1">
        <AnimatePresence mode="popLayout">
          {isSelected && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-[var(--primary-container)] rounded-full -z-10 motion-gpu"
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
                mass: 1,
                restDelta: 0.001,
              }}
            />
          )}
        </AnimatePresence>
        <motion.div
          layoutId={text === "More" ? layoutId : undefined}
          animate={
            wiggle
              ? {
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
              }
              : {
                rotate: isHovered && text === "More" ? 45 : 0,
                scale: isHovered ? 1.1 : 1,
              }
          }
          transition={
            wiggle
              ? {
                duration: 1.2,
                repeat: 1,
                repeatDelay: 0.1,
                ease: "easeInOut",
              }
              : text === "More" ? settingsSpring : {
                type: "spring",
                stiffness: settings.highHz ? 600 : 500,
                damping: settings.highHz ? 45 : 40,
                mass: 1,
              }
          }
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={text}
              className={cn(
                "w-6 h-6 rounded-full transition-transform duration-200 object-cover",
                isSelected
                  ? "scale-110 ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-black/20"
                  : "scale-100 grayscale opacity-60",
              )}
            />
          ) : (
            <Icon
              size={24}
              className={cn(
                "transition-transform duration-200",
                isSelected ? "scale-110" : "scale-100",
              )}
              strokeWidth={isSelected ? 2.5 : 2}
            />
          )}
        </motion.div>
      </div>
      <motion.span
        className={cn(
          "text-[11px] font-bold tracking-tight transition-all duration-200",
          isSelected ? "opacity-100" : "opacity-70",
        )}
      >
        {text}
      </motion.span>
    </motion.button>
  );
});

const Card = memo(({ children, className, innerClassName, delay = 0, onClick, whileHover, whileTap, noDefaultStyles = false }: any) => {
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
      whileHover={whileHover || {
        y: settings.bentoTilt ? -6 : -12,
        scale: settings.bentoTilt ? 1.02 : 1.01,
        rotate: settings.bentoTilt ? 0 : 0.01, // tiny rotation hack to try and force clean antialiased edges
        transition: { type: "spring", stiffness: 400, damping: 15 }
      }}
      whileTap={whileTap || { scale: 0.98 }}
    >
      <motion.div
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
        className="w-full h-full rounded-[inherit]"
      >
        {children}
      </motion.div>
    </TiltContainer>
  );
});

const Code = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);

  // a quick hack to pull text from react nodes
  const get_code = (nodes: any): string => {
    if (typeof nodes === "string") return nodes;
    if (Array.isArray(nodes)) return nodes.map(get_code).join("");
    if (nodes?.props?.children) return get_code(nodes.props.children);
    return "";
  };

  const code = get_code(children).replace(/\n$/, "");
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code">
      <button
        onClick={copy}
        className="absolute right-3 top-3 p-2 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] text-[var(--on-surface-variant)] hover:text-[var(--on-primary-container)] rounded-xl transition-all duration-150 opacity-0 group-hover/code:opacity-100 z-10 backdrop-blur-md border border-[var(--outline-variant)] active:scale-90"
      >
        {copied ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <Copy size={14} />
        )}
      </button>
      <pre
        className={cn(
          "bg-black/10 dark:bg-white/5 p-6 rounded-l-3xl rounded-r-xl overflow-x-auto font-mono text-sm my-6 border border-[var(--outline-variant)] custom-scrollbar",
          className,
        )}
      >
        {children}
      </pre>
    </div>
  );
};

// --- pages ---

/*const LoomDocs = ({ onBack }: { onBack: () => void }) => {
  const [article, setArticle] = useState('tutorial.md');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cache, setCache] = useState<Record<string, string>>({});

  const docs = [
    { id: 'tutorial.md', label: 'Tutorial' },
    { id: 'benchmarks.md', label: 'Benchmarks' },
    { id: 'stdlib.md', label: 'Standard Library' },
    { id: 'concurrency.md', label: 'Concurrency' },
    { id: 'shell_scripting.md', label: 'Shell' },
    { id: 'expressive_comments.md', label: 'Comments' },
  ];

  // prefetch all on mount for search
  useEffect(() => {
    docs.forEach(doc => {
      fetch(`/loom/docs/markdown/${doc.id}`)
        .then(res => res.text())
        .then(t => setCache(prev => ({ ...prev, [doc.id]: t })))
        .catch(err => console.error("failed to fetch doc:", doc.id, err));
    });
  }, []);

  const filtered = docs.filter(doc => {
    const query = q.toLowerCase();
    const label_match = doc.label.toLowerCase().includes(query);
    const content_match = cache[doc.id]?.toLowerCase().includes(query);
    return label_match || content_match;
  });

  useEffect(() => {
    setLoading(true);
    if (cache[article]) {
      setText(cache[article]);
      setLoading(false);
    } else {
      fetch(`/loom/docs/markdown/${article}`)
        .then(res => res.text())
        .then(md => {
          setText(md);
          setLoading(false);
        })
        .catch(err => {
          console.error("oh shit, failed to load doc:", article, err);
          setText('# Error\nCould not load the requested documentation.');
          setLoading(false);
        });
    }
  }, [article, cache]);

  const cur = docs.find(d => d.id === article);
  return (
    <div className="max-w-4xl mx-auto space-y-12 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <button
          onClick={onBack}
          className="m3-button-tonal hover:scale-105 transition-transform shrink-0 w-full md:w-auto"
        >
          <ChevronLeft size={20} /> Go Back
        </button>
        <div className="flex-1 w-full relative">
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full bg-[var(--surface-variant)] text-[var(--on-surface-variant)] px-12 py-3 rounded-2xl border-2 border-transparent focus:border-[var(--primary)] outline-none transition-all font-bold"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Terminal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
        </div>
      </div>
      <div className="flex overflow-x-auto scrollbar-hide py-2 gap-3 px-2">
        {filtered.map(doc => {
          const in_content = q && !doc.label.toLowerCase().includes(q.toLowerCase()) && cache[doc.id]?.toLowerCase().includes(q.toLowerCase());
          return (
            <button
              key={doc.id}
              onClick={() => setArticle(doc.id)}
              className={cn(
                "px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 border-2 flex items-center gap-2",
                article === doc.id
                  ? "bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] shadow-lg"
                  : "bg-[var(--surface-variant)] text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--outline)]"
              )}
            >
              {doc.label}
              {in_content && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" title="Match found in content" />}
            </button>
          );
        })}
      </div>
      <header className="mb-16 space-y-8 pt-6">
        <div className="flex items-center gap-4">
          <span className="px-4 py-1.5 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-full text-xs font-black uppercase tracking-widest">
            loom documentation
          </span>
        </div>
        <h1 className="page-title !text-6xl !md:text-8xl leading-[0.9]">{cur?.label}</h1>
      </header>
      <motion.div
        key={article}
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="markdown-body pt-8 border-t border-[var(--outline-variant)] motion-gpu"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ node, ...props }) => <Code {...props} />
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </motion.div>
    </div>
  );
};

const LoomPage = () => {
  const [copied, setCopied] = useState(false);
  const [docs, setDocs] = useState(false);
  const install_cmd = 'curl -s https://virex.lol/loom/install.sh | bash';

  const copy_cmd = () => {
    navigator.clipboard.writeText(install_cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (docs) {
    return <LoomDocs onBack={() => setDocs(false)} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-16 px-4 md:px-0 pb-20">
      <header className="page-header space-y-8">
        <h1 className="page-title !text-8xl !md:text-[10rem] leading-[0.8] text-balance">
          loom
        </h1>
        <p className="text-2xl md:text-4xl font-display font-light text-[var(--on-surface-variant)] leading-tight max-w-4xl">
          a lightweight, expressive, and efficient programming language built for speed and simplicity.
        </p>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8 pt-8 border-t border-[var(--outline-variant)]">
        <Card delay={0.4} className="md:col-span-2 lg:col-span-1 xl:col-span-2" innerClassName="bg-[var(--primary)] text-[var(--on-primary)] border-none p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
          <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] tracking-tight">"latency is a bug."</h2>
          <div>
            <br></br>
            <p className="text-xl md:text-2xl opacity-90 font-medium max-w-2xl mb-10 leading-snug">
              loom combines low-level performance with a high-level, expressive syntax.
              designed for developers who want both efficiency and readability.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setDocs(true)}
                className="m3-button-filled bg-white text-black text-xl h-16 px-10 rounded-2xl hover:scale-105"
              >
                read the docs <BookOpen size={24} />
              </button>
              <a
                href="https://github.com/hnpf/LOOM_PROGRAMMING_LANGUAGE"
                target="_blank"
                className="m3-button-tonal h-16 px-10 text-xl rounded-2xl border-white/20 border flex items-center gap-2"
              >
                github <Github size={24} />
              </a>
            </div>
          </div>
        </Card>
        <Card delay={0.5} className="" innerClassName="p-10 space-y-6">
          <h3 className="text-3xl font-display font-bold flex items-center gap-3">
            <Download className="text-[var(--primary)]" /> get loom!
          </h3>
          <p className="text-xl opacity-70 leading-relaxed">
            ready to start? get the latest version of loom with a single command.
          </p>
          <Code className="language-bash !my-0 whitespace-nowrap">
            {install_cmd}
          </Code>
        </Card>
        <Card delay={0.6} className="" innerClassName="p-10 space-y-6 bg-[var(--primary-container)] text-[var(--on-primary-container)]">
          <h3 className="text-3xl font-display font-bold flex items-center gap-3">
            <Terminal /> hello, to you too!
          </h3>
          <Code className="language-loom !bg-black/5 !my-0">
{`// this is your first loom program.
act main() {
    print("hello, world!")
}
main()`}
          </Code>
        </Card>
      </section>
    </div>
  );
};
*/
const YearProg = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const ticker = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const year = now.getFullYear();
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year + 1, 0, 1).getTime();
  const pct = ((now.getTime() - start) / (end - start)) * 100;

  const ms_left = end - now.getTime();
  const days_left = Math.floor(ms_left / (1000 * 60 * 60 * 24));

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="w-full font-sans selection:bg-primary/30">
      <div className="flex items-end justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-7xl font-display font-black tracking-tight leading-[0.8] text-[var(--on-primary-container)]">
            {year}
          </h2>
          <span className="text-sm font-black opacity-60 text-[var(--on-primary-container)] mt-1">
            current year
          </span>
        </div>
        <div className="text-right flex flex-col items-end mb-4">
          <div className="text-4xl font-display font-black tracking-tight tabular-nums text-[var(--on-primary-container)]">
            {pct.toFixed(2)}
            <span className="text-2xl ml-0.5 opacity-60">%</span>
          </div>
          <span className="text-sm font-black opacity-60 text-[var(--on-primary-container)]">
            {days_left} days left
          </span>
        </div>
      </div>

      <div className="py-6">
        <WavyProgress
          percent={pct}
          className="text-[var(--on-primary-container)]"
          thickness={isMobile ? 8 : 6}
          height={isMobile ? 24 : 20}
        />
      </div>

      <div className="mt-2 flex justify-between text-md font-black opacity-40 tracking-tight italic">
        <span className="font-black text-[17px]">
          {now.toLocaleTimeString().toLowerCase()}
        </span>
        <span>system time</span>
      </div>
    </div>
  );
};

const HomePage = memo(({ setPage, settings }: any) => (
  <div className="space-y-16 max-w-6xl mx-auto px-4 md:px-0 relative">
    <header className="page-header space-y-8">
      {settings.helloAnimation ? (
        <HelloVirex />
      ) : (
        <motion.h1
          initial={settings.disableAnimations ? false : {
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: settings.disableAnimations ? 0 : 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="page-title !text-8xl !md:text-[10rem] leading-[0.8] text-balance flex items-baseline"
        >
          virex
          <motion.span className="text-[var(--primary)] select-none relative z-[60] inline-block">
            .
          </motion.span>
        </motion.h1>
      )}
      <motion.p
        initial={settings.disableAnimations ? false : {
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: settings.disableAnimations ? 0 : 0.2,
          duration: settings.disableAnimations ? 0 : 0.6,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="text-2xl md:text-4xl font-display font-black text-[var(--on-surface-variant)] leading-tight max-w-4xl"
      >
        <br></br>I am an independent software dev, linux lover, and problem
        solver.
      </motion.p>
      {/* phase 2 button */}
      <FshBtn />
    </header>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
      <Card
        delay={0.4}
        className="md:col-span-2 lg:col-span-1 xl:col-span-2"
        innerClassName="bg-[var(--primary)] text-[var(--on-primary)] border-none p-12 md:p-16 flex flex-col justify-between min-h-[400px]"
      >
        <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] tracking-tight">
          "software should be readable, and reliable!
        </h2>
        <div>
          <p className="text-xl md:text-3xl opacity-90 font-medium max-w-2xl mb-2 ">
            <br></br>I make things that work the way its supposed to.
          </p>
          <p className="text-xl md:text-2xl opacity-90 font-medium mb-10 ">
            just do it the efficient and right way.
          </p>
          <motion.button
            whileHover={{
              scale: 1.02,
              x: 4,
              backgroundColor: "var(--primary-container)",
              color: "var(--on-primary-container)",
              borderRadius: "40px",
              boxShadow: "0 20px 40px -10px var(--primary)",
            }}
            whileTap={{
              scale: 0.98,
            }}
            transition={{
              type: "spring",
              stiffness: 800,
              damping: 20,
              mass: 0.5,
            }}
            onClick={() => setPage("readme")}
            className="m3-button-filled ring-6 ring-[var(--on-primary-container)] !transition-none bg-white text-black text-[20px] font-display font-black tracking-tight h-18 px-12 rounded-[24px] flex items-center gap-3 group"
          >
            explore more!
            <motion.span
              variants={{
                hover: { x: 5 },
              }}
              transition={{ type: "spring", stiffness: 1000, damping: 15 }}
            >
              <ChevronRight
                size={28}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.span>
          </motion.button>
        </div>
      </Card>
      <Card
        delay={0.0}
        className=""
        innerClassName="flex flex-col border-6 border-[var(--outline-variant)] justify-between hover:border-[var(--primary)] transition-colors p-10 space-y-6"
      >
        <div className="space-y-6">
          <div className="w-16 h-16 bg-[var(--primary-container)] rounded-3xl flex items-center justify-center">
            <Activity size={32} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-3xl font-display font-bold">
            I don't ship things that I wouldn't use.
          </h3>
          <p className="text-xl opacity-70 leading-relaxed">
            done right, or not done at all.
          </p>
        </div>
      </Card>
      <Card
        delay={0.6}
        className=""
        innerClassName="bg-[var(--primary-container)] text-[var(--on-primary-container)] flex flex-col justify-center p-10 min-h-[300px]"
      >
        <YearProg />
      </Card>
      <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 mt-8 mb-4 flex items-center gap-6 px-4">
        <div className="h-[1px] flex-1 bg-[var(--outline-variant)] opacity-30" />
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-[16px] font-black tracking-[0.3em] opacity-40 whitespace-nowrap">
            projects and research
          </h3>
          <div className="text-2xl font-black tracking-[0.1em] font-black tracking-tighter">
            built or contributed to:
          </div>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--outline-variant)] opacity-30" />
      </div>
      <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
        <AdCard />
        {PROJECTS.map((project, i) => (
          <Card
            key={project.id}
            delay={0.7 + i * 0.1}
            className=""
            innerClassName="flex border-6 border-[var(--outline-variant)]/40 flex-col justify-between p-10 min-h-[350px] hover:border-[var(--primary)] transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-3xl font-display font-bold leading-tight">
                  {project.title}
                </h4>
                <div className="flex flex-wrap gap-2 justify-end">
                  {project.tags.map((tag) => (
                    <span key={tag} className="m3-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="opacity-70 mb-8 text-xl leading-snug">
                {project.description}
              </p>
            </div>
            {project.link.startsWith("/") ? (
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(project.link.replace("/", ""))}
                className="inline-flex items-center gap-2 text-[var(--primary)] font-black tracking-widest text-[16px] w-fit group"
              >
                View project{" "}
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <ChevronRight size={14} />
                </motion.span>
              </motion.button>
            ) : (
              <motion.a
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                href={project.link}
                target="_blank"
                className="inline-flex items-center gap-2 text-[var(--primary)] font-black tracking-widest text-[17px] group"
              >
                View project{" "}
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <ExternalLink size={17} />
                </motion.span>
              </motion.a>
            )}
          </Card>
        ))}
      </div>
    </section>
  </div>
));

const BlogPage = memo(({ targetId, navigateTo }: any) => {
  const [active_cat, setActiveCat] = useState<string | null>(null);
  const [read, setRead] = useState<string[]>(() => {
    const saved = localStorage.getItem("virex-read-posts");
    return saved ? JSON.parse(saved) : [];
  });
  const post = BLOG_POSTS.find((p) => p.id === targetId || p.link === targetId);

  useEffect(() => {
    if (!targetId || !post) {
      return;
    }

    const on_scroll = () => {
      const scrolled = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const pct = (scrolled / height) * 100;
      if (pct > 95 && !read.includes(post.id)) {
        setRead((prev) => {
          const next = [...prev, post.id];
          localStorage.setItem("virex-read-posts", JSON.stringify(next));
          return next;
        });
      }
    };
    window.addEventListener("scroll", on_scroll);
    return () => window.removeEventListener("scroll", on_scroll);
  }, [targetId, read, post]);

  if (post) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="max-w-4xl mx-auto space-y-12 px-4 md:px-0 motion-gpu relative"
      >
        <div className="flex justify-between items-center sticky top-0 py-4 bg-[var(--surface)]/80 backdrop-blur-md z-40">
          <button
            onClick={() => window.history.back()}
            className="m3-button-tonal w-fit group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to feed</span>
          </button>
          <div className="hidden md:flex items-center gap-3 opacity-50 text-xs font-black uppercase tracking-[0.2em]">
            {read.includes(post.id) && (
              <CheckCircle2 size={14} className="text-green-500" />
            )}
            <span>{post.readTime}</span>
          </div>
        </div>
        <header className="mb-16 space-y-8 pt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="px-5 py-2 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-2xl text-md font-black tracking-widest shadow-sm">
                {post.category}
              </span>
              <div className="flex items-center gap-2 opacity-50 text-sm font-bold">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              {read.includes(post.id) && (
                <div className="flex items-center gap-2 text-green-500 text-xs font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <CheckCircle2 size={12} /> Read
                </div>
              )}
            </div>
            <h1 className="page-title !text-6xl !md:text-8xl leading-[0.9] text-balance">
              {post.title}
            </h1>
          </div>
          <div className="p-8 bg-[var(--surface-variant)] rounded-[2.5rem] border border-[var(--outline-variant)]/30 italic opacity-80 text-xl leading-relaxed">
            {post.snippet}
          </div>
        </header>
        <div className="markdown-body py-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ node, ...props }: any) => <Code {...props} />,
              h1: ({ children }: any) => (
                <h1 className="text-5xl font-display font-black tracking-tight mb-8 text-[var(--primary)]">
                  {children}
                </h1>
              ),
              h2: ({ children }: any) => (
                <h2 className="text-3xl font-display font-black tracking-tight mt-12 mb-6">
                  {children}
                </h2>
              ),
              h3: ({ children }: any) => (
                <h3 className="text-xl font-black uppercase tracking-[0.2em] opacity-40 mt-8 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }: any) => {
                // handle the custom spacer tag
                const text = Array.isArray(children) ? children[0] : children;
                if (
                  typeof text === "string" &&
                  text.startsWith("SPACER_H_")
                ) {
                  const height = text.replace("SPACER_H_", "");
                  return (
                    <div
                      style={{ height: height || "2rem" }}
                      aria-hidden="true"
                    />
                  );
                }
                return (
                  <p className="text-xl leading-relaxed opacity-80 mb-6 text-pretty">
                    {children}
                  </p>
                );
              },
              ul: ({ children }: any) => (
                <ul className="space-y-4 mb-8 list-none">
                  {children}
                </ul>
              ),
              li: ({ children }: any) => (
                <li className="flex gap-4 text-xl opacity-80 leading-relaxed">
                  <span className="text-[var(--primary)] font-black select-none mt-1">//</span>
                  <span>{children}</span>
                </li>
              ),
              code: ({ node, inline, className, children, ...props }: any) => {
                if (inline) {
                  return (
                    <code className="bg-[var(--primary-container)]/30 text-[var(--primary)] px-1.5 py-0.5 rounded-md font-mono text-sm font-bold">
                      {children}
                    </code>
                  );
                }
                return <code className={className} {...props}>{children}</code>;
              }
            } as any}
          >
            {post.content.replace(
              /<spacer\s+height="([^"]+)"\s*\/>/g,
              "SPACER_H_$1",
            )}
          </ReactMarkdown>
        </div>

        <footer className="pt-16 pb-24 border-t border-[var(--outline-variant)] flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h4 className="text-3xl font-display font-black">
              enjoyed the deep dive?
            </h4>
            <p className="opacity-60 font-medium">
              share this post with your friends!
            </p>
          </div>
          <CopyLinkCapsule />
        </footer>
      </motion.div>
    );
  }

  const featured = BLOG_POSTS[0];
  const cats = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];
  const filtered_posts = BLOG_POSTS.filter(
    (p) => !active_cat || p.category === active_cat,
  );

  const show_featured = !active_cat || featured.category === active_cat;
  const filtered_rest = filtered_posts.filter((p) => p.id !== featured.id);

  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4 md:px-0 pb-32">
      <header className="page-header space-y-8">
        <h2 className="page-title">Blog</h2>
      </header>

      <div className="flex flex-wrap gap-4 mb-12">
        {cats.map((cat) => {
          const is_active = cat === "All" ? !active_cat : active_cat === cat;
          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05, y: -2, rotate: 1 }}
              whileTap={{ scale: 0.95, rotate: -1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.5,
              }}
              onClick={() => setActiveCat(cat === "All" ? null : cat)}
              className={cn(
                "px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] border-4 shadow-sm",
                is_active
                  ? "bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]/30 rounded-full shadow-lg"
                  : "bg-[var(--surface-variant)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 rounded-[1.5rem] opacity-60 hover:opacity-100",
              )}
            >
              {cat}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {show_featured && (
          <motion.section
            key="featured"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="relative rounded-[3.5rem] overflow-hidden bg-[var(--primary-container)] text-[var(--on-primary-container)] border-6 border-[var(--outline-variant)] shadow-2xl group cursor-pointer hover:border-[var(--primary)] transition-colors"
              onClick={() => navigateTo("blog", featured.link)}
            >
              <div className="p-8 md:p-16 space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-[var(--primary)] text-[var(--on-primary)] rounded-full text-[12px] font-black tracking-widest shadow-lg">
                    Featured post!
                  </span>
                  <span className="text-sm font-bold opacity-60 flex items-center gap-2">
                    <Calendar size={14} /> {featured.date}
                  </span>
                  {read.includes(featured.id) && (
                    <CheckCircle2
                      size={20}
                      className="text-green-500 shadow-xl"
                    />
                  )}
                </div>
                <div className="space-y-4 max-w-4xl">
                  <h3 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-[0.95] group-hover:translate-x-2 transition-transform duration-500">
                    {featured.title}
                  </h3>
                  <p className="text-lg md:text-2xl opacity-80 leading-relaxed font-medium text-pretty">
                    {featured.snippet}
                  </p>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      x: 4,
                      backgroundColor: "var(--primary)",
                      color: "var(--on-primary)",
                      borderRadius: "40px",
                      boxShadow: "0 20px  -10px var(--primary)",
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 800,
                      damping: 20,
                      mass: 0.5,
                    }}
                    className="m3-button-filled ring-6 ring-[var(--on-primary-container)] !transition-none bg-white text-md md:text-2xl h-14 md:h-18 px-8 md:px-14 rounded-[24px] flex items-center gap-3 group/btn whitespace-nowrap"
                  >
                    read entry
                    <motion.span
                      variants={{
                        hover: { x: 5 },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 1000,
                        damping: 15,
                      }}
                    >
                      <ArrowUpRight
                        size={28}
                        className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:translate-x-1 transition-transform"
                      />
                    </motion.span>
                  </motion.div>
                  <span className="text-xs md:text-sm font-black uppercase tracking-widest opacity-40 italic">
                    {featured.readTime}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <AnimatePresence>
          {filtered_rest.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                delay={i * 0.05}
                className="h-full"
                innerClassName="cursor-pointer group h-full relative overflow-hidden bg-[var(--surface-variant)]/30 hover:bg-[var(--primary-container)]/20 border-6 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] transition-colors p-10"
                onClick={() => navigateTo("blog", p.link)}
              >
                <div className="space-y-6 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] px-2 py-1 bg-[var(--primary-container)]/30 rounded-md border border-[var(--primary)]/20">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                          {p.date}
                        </span>
                        {read.includes(p.id) && (
                          <CheckCircle2 size={16} className="text-green-500" />
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-[var(--surface)] border border-[var(--outline-variant)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-[var(--on-primary)] transition-all duration-500">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl md:text-3xl font-display font-black leading-tight group-hover:translate-x-1 transition-transform">
                        {p.title}
                      </h4>
                      <p className="text-lg opacity-60 leading-relaxed line-clamp-2 text-pretty">
                        {p.snippet}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-[var(--outline-variant)] opacity-40 text-[10px] font-black uppercase tracking-widest">
                    <span>
                      Post No. {BLOG_POSTS.length - BLOG_POSTS.indexOf(p)}
                    </span>
                    <span>{p.readTime}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

const ChangelogPage = memo(() => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 px-4 md:px-0 mb-32">
      <header className="page-header space-y-4">
        <h2 className="page-title">Changelog</h2>
        <p className="text-2xl opacity-60 font-medium">
          Tracking virex changes.
        </p>
      </header>

      <div className="space-y-24">
        {CHANGELOGS.map((entry, i) => (
          <motion.section
            key={entry.id}
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-12 border-l-2 border-[var(--outline-variant)]  r"
          >
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-full text-xs font-black tracking-widest uppercase">
                    v{entry.version}
                  </span>
                  <span className="text-sm font-bold opacity-40 uppercase tracking-widest">
                    {entry.date}
                  </span>
                </div>
                <h3 className="text-4xl font-display font-black tracking-tight">
                  {entry.title}
                </h3>
              </div>

              <div className="columns-1 md:columns-2 gap-8 space-y-8 md:space-y-0">
                {entry.changes.map((group) => (
                  <div key={group.category} className="break-inside-avoid space-y-4 mb-8">
                    <h4 className="text-[13px] font-black tracking-[0.2em] opacity-40 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                      {group.category}
                    </h4>
                    <ul className="space-y-3">
                      {group.items.map((item, index) => (
                        <li
                          key={index}
                          className="text-lg opacity-80 leading-relaxed flex gap-3"
                        >
                          <span className="text-[var(--primary)] font-bold mt-1">
                            /
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
});

const LENS_PHOTOS = [
  {
    id: "1",
    url: "/photography/20250524_125754_optimized_optimized_optimized.webp",
    description: "light at the end of the brick tunnel",
    orientation: "landscape",
  },
  {
    id: "2",
    url: "/photography/20250526_104032_optimized_optimized_optimized.webp",
    description: "aerial smoke trails in formation",
    orientation: "landscape",
  },
  {
    id: "3",
    url: "/photography/20250628_124853_optimized_optimized.webp",
    description: "solitary boat with shallow depth of field",
    orientation: "landscape",
  },
  {
    id: "4",
    url: "/photography/20250704_194559_optimized.webp",
    description: "sunset framed by summer leaves",
    orientation: "landscape",
  },
  {
    id: "5",
    url: "/photography/20250704_203117_optimized.webp",
    description: "fourth of july sparks",
    orientation: "landscape",
  },
  {
    id: "6",
    url: "/photography/20250705_091012_optimized.webp",
    description: "ducks drifting on the water",
    orientation: "landscape",
  },
  {
    id: "7",
    url: "/photography/20251106_151437.webp",
    description: "random street sign in the lake",
    orientation: "landscape",
  },
  {
    id: "8",
    url: "/photography/20251221_035746.webp",
    description: "a. seemanni face-to-face",
    orientation: "landscape",
  },
  {
    id: "9",
    url: "/photography/IMG_20251101_1654442.webp",
    description: "palm tree against the vibrant sun",
    orientation: "landscape",
  },
  {
    id: "10",
    url: "/photography/PXL_20251225_142558068~2.webp",
    description: "dewy webs on the rocks",
    orientation: "landscape",
  },
  {
    id: "11",
    url: "/photography/PXL_20251230_074304887.PORTRAIT.webp",
    description: "the workstation aesthetic",
    orientation: "portrait",
  },
  {
    id: "12",
    url: "/photography/PXL_20251231_013358426.PORTRAIT~2.webp",
    description: "feline toes",
    orientation: "portrait",
  },
  {
    id: "13",
    url: "/photography/PXL_20251231_235312192.webp",
    description: "fiery red sky behind the treeline",
    orientation: "landscape",
  },
  {
    id: "14",
    url: "/photography/PXL_20260108_040856251.webp",
    description: "p. audax carrying a droplet",
    orientation: "landscape",
  },
  {
    id: "15",
    url: "/photography/PXL_20260108_042253119.webp",
    description: "tarantula being a menace",
    orientation: "landscape",
  },
  {
    id: "16",
    url: "/photography/PXL_20260115_062158733.PORTRAIT.webp",
    description: "tarantula at the watering hole",
    orientation: "portrait",
  },
  {
    id: "17",
    url: "/photography/PXL_20260129_045632703.PORTRAIT~2.webp",
    description: "silly silly / pure chaos..",
    orientation: "portrait",
  },
  {
    id: "18",
    url: "/photography/PXL_20260131_233605673.BURST-01.webp",
    description: "the moon in broad daylight",
    orientation: "landscape",
  },
  {
    id: "19",
    url: "/photography/SGCAM_20251127_134227019.webp",
    description: "cat on patrol",
    orientation: "landscape",
  },
  {
    id: "20",
    url: "/photography/SGCAM_20251127_134233696.webp",
    description: "morning stretches on the hood",
    orientation: "landscape",
  },
  {
    id: "21",
    url: "/photography/PXL_20260301_211813696.webp",
    description: "A cute wild Tan jumping spider!",
    orientation: "landscape",
  },
];

const PhotoItem = memo(({ photo, i, onClick, settings }: any) => {
  const portrait = photo.orientation === "portrait";
  const large = i % 8 === 0 && !portrait;
  const wide = i % 5 === 2 && !portrait && !large;

  return (
    <TiltContainer
      settings={settings}
      onClick={onClick}
      whileHover={{ y: -12, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={cn(
        large
          ? "md:col-span-2 md:row-span-2"
          : wide
            ? "md:col-span-2"
            : portrait
              ? "md:row-span-2"
              : "",
      )}
      innerClassName="rounded-[2.5rem] cursor-pointer relative group lens-item bg-[var(--surface-variant)]/20 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ margin: "100px", once: true }}
        transition={{
          duration: 0.5,
          delay: i < 6 ? i * 0.05 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ willChange: "transform, opacity" }}
        className="w-full h-full rounded-[inherit] relative overflow-hidden"
      >
        <img
          src={photo.url}
          alt={photo.description}
          loading={i < 4 ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "w-full h-full object-cover transition-transform group-hover:scale-105 rounded-[inherit]",
            settings.highHz ? "duration-500" : "duration-700",
          )}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8 z-20">
          <p className="text-white text-lg font-bold leading-tight drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {photo.description}
          </p>
        </div>
      </motion.div>
    </TiltContainer>
  );
});

const LensPage = memo(({ viewport }: { viewport: any }) => {
  const [idx, setIdx] = useState<number | null>(null);
  const { settings } = useTheme();

  const next = (e?: any) => {
    e?.stopPropagation();
    if (idx !== null) setIdx((idx + 1) % LENS_PHOTOS.length);
  };
  const prev = (e?: any) => {
    e?.stopPropagation();
    if (idx !== null)
      setIdx((idx - 1 + LENS_PHOTOS.length) % LENS_PHOTOS.length);
  };

  useEffect(() => {
    if (idx !== null) {
      console.log("opened photo", idx, "-", LENS_PHOTOS[idx].description);
    } else {
      console.log("closed expanded photo back to grid, finally");
    }

    const on_key = (e: KeyboardEvent) => {
      if (idx === null) return;
      if (e.key === "ArrowRight") {
        console.log("arrow right, cycling next");
        next();
      }
      if (e.key === "ArrowLeft") {
        console.log("arrow left, cycling prev");
        prev();
      }
      if (e.key === "Escape") {
        console.log("esc key, closing expanded view");
        setIdx(null);
      }
    };
    window.addEventListener("keydown", on_key);

    if (idx !== null) {
      document.body.style.overflow = "hidden"; // lol bye loser
      // preload next and prev images
      const next_idx = (idx + 1) % LENS_PHOTOS.length;
      const prev_idx = (idx - 1 + LENS_PHOTOS.length) % LENS_PHOTOS.length;
      [next_idx, prev_idx].forEach(i => {
        const img = new window.Image();
        img.src = LENS_PHOTOS[i].url;
        console.log("preloading adjacent photo:", i, "-", LENS_PHOTOS[i].description);
      });
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", on_key);
      document.body.style.overflow = "";
    };
  }, [idx]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      <header className="page-header flex flex-row items-end gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <h2 className="page-title">Lens</h2>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-[280px] md:auto-rows-[380px] px-4 md:px-0">
        {LENS_PHOTOS.map((photo, i) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            i={i}
            settings={settings}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
      <AnimatePresence>
        {idx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-[var(--surface)]/95 backdrop-blur-3xl overflow-hidden"
            onClick={() => setIdx(null)}
          >
            {/* top islands - ungrouped capsule + circle */}
            <div className="z-[230] p-6 md:p-8 flex justify-center items-center gap-3 md:gap-4 pointer-events-none">
              <div className="bg-[var(--surface-variant)]/60 backdrop-blur-xl px-6 py-3 md:px-8 md:py-4 rounded-[2.5rem] md:rounded-[2.5rem] border-6 border-[var(--outline-variant)]/40 flex flex-col shadow-2xl pointer-events-auto min-w-0 max-w-[240px] md:max-w-lg">
                <div className="text-[9px] md:text-[18px] font-black tracking-[0.2em] text-[var(--primary)] mb-0.5 md:mb-1">
                  description
                </div>
                <div className="text-[var(--on-surface)] font-display font-black text-lg md:text-2xl tracking-tight leading-tight truncate">
                  {LENS_PHOTOS[idx].description}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9, rotate: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 800,
                  damping: 15,
                  mass: 0.5
                }}
                onClick={() => setIdx(null)}
                className="w-14 h-14 md:w-18 md:h-18 bg-[var(--primary)] text-[var(--on-primary)] rounded-full flex items-center justify-center border-6 border-[var(--outline-variant)]/40 shadow-2xl pointer-events-auto cursor-pointer"
              >
                <X size={viewport.w < 768 ? 28 : 36} />
              </motion.button>
            </div>

            {/* central content area - image and side arrows */}
            <div className="flex-1 relative w-full flex items-center justify-center px-4 md:px-32 lg:px-48 min-h-0 overflow-hidden">
              {/* desktop side arrows */}
              <div className="hidden md:flex absolute left-8 inset-y-0 items-center z-[220] pointer-events-none">
                <button
                  onClick={prev}
                  className="w-20 h-20 bg-[var(--surface-variant)]/40 hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface)] rounded-full flex items-center justify-center transition-all border-6 border-[var(--outline-variant)]/40 backdrop-blur-xl pointer-events-auto active:scale-90 shadow-2xl"
                >
                  <ChevronLeft size={44} />
                </button>
              </div>

              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: 40,
                  scaleY: 1.1,
                  scaleX: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  scaleY: 1,
                  scaleX: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  x: -40,
                  scaleY: 1.1,
                  scaleX: 0.9,
                }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 150,
                  mass: 1,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 50) prev();
                  else if (info.offset.x < -50) next();
                }}
                className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing z-[205]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={LENS_PHOTOS[idx].url}
                  className="max-w-full max-h-full object-contain rounded-[40px] md:rounded-[60px] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.6)] border-[12px] border-white/10 pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>

              <div className="hidden md:flex absolute right-8 inset-y-0 items-center z-[220] pointer-events-none">
                <button
                  onClick={next}
                  className="w-20 h-20 bg-[var(--surface-variant)]/40 hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface)] rounded-full flex items-center justify-center transition-all border-6 border-[var(--outline-variant)]/40 backdrop-blur-xl pointer-events-auto active:scale-90 shadow-2xl"
                >
                  <ChevronRight size={44} />
                </button>
              </div>
            </div>

            {/* bottom island - unified navigation, raw, and position */}
            <div className="z-[230] p-6 md:p-12 flex flex-col items-center gap-6 pointer-events-none">
              <div className="flex items-center gap-1 md:gap-2 bg-[var(--surface-variant)]/60 backdrop-blur-xl p-2 md:p-3 rounded-full border-6 border-[var(--outline-variant)]/40 shadow-2xl pointer-events-auto">
                {/* mobile navigation buttons integrated into island */}
                <div className="flex md:hidden items-center gap-1 pr-2 border-r-2 border-[var(--outline-variant)]/20">
                  <button
                    className="w-11 h-11 bg-transparent hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface)] rounded-full flex items-center justify-center transition-all active:scale-90"
                    onClick={prev}
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    className="w-11 h-11 bg-transparent hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface)] rounded-full flex items-center justify-center transition-all active:scale-90"
                    onClick={next}
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>

                <div className="px-4 md:px-8 py-1 md:py-2 flex flex-col items-center">
                  <span className="text-[11px] md:text-[16px] font-black text-[var(--on-surface-variant)] opacity-60">
                    image position:
                  </span>
                  <div className="flex items-center gap-1 md:gap-2 text-[var(--on-surface)] font-mono font-bold text-xs md:text-base">
                    <span className="text-[var(--primary)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="opacity-20">/</span>
                    <span className="opacity-60">
                      {String(LENS_PHOTOS.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="w-[2px] h-8 md:h-10 bg-[var(--outline-variant)]/30 rounded-full mx-1 md:mx-2" />

                <button
                  onClick={() => window.open(LENS_PHOTOS[idx].url, "_blank")}
                  className="w-11 h-11 md:w-14 md:h-14 bg-[var(--primary-container)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-primary-container)] rounded-full flex items-center justify-center transition-all border-4 md:border-6 border-[var(--outline-variant)]/20 active:scale-90 group relative"
                >
                  <ExternalLink size={viewport.w < 768 ? 20 : 28} />
                  <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[var(--surface-variant)] text-[var(--on-surface)] text-[10px] font-black px-4 py-2 rounded-xl border-4 border-[var(--outline-variant)] opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-xl">
                    Open Raw
                  </span>
                </button>
              </div>

              <div className="hidden md:flex items-center gap-3 bg-black/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/5 shadow-xl">
                <span className="text-[13px] font-black  tracking-widest text-white/40 tracking-[0.2em]">
                  Keyboard: arrows to cycle & esc to close
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const TrackerPage = memo(() => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="page-header flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="page-title">Tracker</h2>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {TRACKER_ITEMS.map((item, i) => (
          <Card
            key={item.id}
            delay={i * 0.1}
            className=""
            innerClassName="relative overflow-hidden group border-6 border-[var(--outline-variant)] bg-[var(--surface)] hover:border-[var(--primary)] transition-colors p-10"
          >
            <div className="relative z-10 space-y-6 p-2">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--primary)] text-[var(--on-primary)]">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-4xl font-display font-black tracking-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--outline-variant)]">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                    <BookOpen size={14} /> Advice
                  </h4>
                  <ul className="space-y-2 text-[15px] font-medium leading-tight opacity-90">
                    {item.tips.map((tip, tidx) => (
                      <li key={tidx} className="flex gap-2">
                        <span className="text-[var(--primary)] font-bold">
                          ›
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                    <Pipette size={14} /> Current Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 rounded-lg bg-[var(--surface-variant)] text-[var(--on-surface)] text-xs font-bold border border-[var(--outline-variant)]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});



const BullshitMatrix = ({ onBack, setPage }: { onBack: () => void; setPage: (p: string) => void }) => {
  const letters = "virex".split("");
  const [flickering, setFlick] = useState<number[]>([]);
  const [swoopDone, setSwoopDone] = useState(false);
  const { settings } = useTheme();

  // spring for everything in this thng tbh, just to keep it consistent. why do i do this shit when im having bad days this clearly isnt healthy ;-;
  // especially since most of these animations are pretty much unnoticeable 
  // ...so its not like they need to be super optimized or whatever. 
  // no one's gonna be looking at the spring config in the devtools anyways being like "oh this is a 700 stiffness spring, very nice, shows that da virex cares about the ux and whatever"
  // cool.

  const coolSpringy = {
    type: "spring",
    stiffness: settings.highHz ? 800 : 700,
    damping: 25,
    mass: 0.5
  };

  useEffect(() => {
    if (!swoopDone) return;
    const itv = setInterval(() => {
      if (Math.random() > 0.7) return;
      const count = Math.floor(Math.random() * 2) + 1;
      const indices = Array.from({ length: count }, () => Math.floor(Math.random() * letters.length));
      setFlick(indices);
      setTimeout(() => setFlick([]), 60 + Math.random() * 120);
    }, 800 + Math.random() * 1000);
    return () => clearInterval(itv);
  }, [swoopDone, letters.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col bg-[var(--surface)] overflow-y-auto custom-scrollbar overflow-x-hidden selection:bg-[var(--primary)] selection:text-[var(--on-primary)]"
    >
      {/* bg effecting stuff*/}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg className="hidden">
          <defs>
            <filter id="gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              { /* love gaussian blur!~ */}
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        <div className="vx-frosted absolute inset-0">
          {/* bigg star */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.2, 0.15]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[85px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          {/* solar dots????? hehee */}
          {[
            { x: 15, y: 15, size: 250 },
            { x: 30, y: 30, size: 180 },
            { x: 70, y: 70, size: 200 },
            { x: 85, y: 85, size: 300 },
          ].map((p, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i
              }}
              className="absolute bg-[var(--primary)] rounded-full blur-[50px]"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--surface)_90%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* hreo */}
        <div className="flex flex-col items-center mb-32 w-full">
          <div className="flex gap-1 flex-gap-100 md:gap-6 mb-8 flex-wrap justify-center">
            {letters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: -150, opacity: 0, scale: 0.8, filter: "blur(12px)" }}
                animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                onAnimationComplete={() => {
                  if (i === letters.length - 1) setSwoopDone(true);
                }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: settings.highHz ? 180 : 150,
                  damping: settings.highHz ? 25 : 22,
                  mass: 0.8
                }}
                className={cn(
                  "text-7xl md:text-[13rem] font-sans font-bold tracking-tighter transition-all duration-150 select-none",
                  flickering.includes(i) ? "text-[var(--primary)] scale-105" : "text-[var(--on-surface)]"
                )}
              >
                {flickering.includes(i) ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : char}
              </motion.span>
            ))}
          </div>

          <motion.div
            // yea these are almost just useless animations but they add to the taste so who cares
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            // how the hell do i add a fucking gap between these items and the hero text without breaking the animation or making it look weird on mobile... flex gap is not working for some reason :(

            className="flex flex-wrap justify-center gap-4 mt-12 md:mt-4"
          >
            <span className="px-6 py-3 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 border-4 border-[var(--primary)]/20 shadow-lg">
              <Activity size={16} /> Researching
            </span>
            <span className="px-6 py-3 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 border-4 border-[var(--outline-variant)]/40">
              <MapPin size={16} /> Nederland
            </span>
            <span className="px-6 py-3 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 border-4 border-[var(--outline-variant)]/40">
              He / They
            </span>
          </motion.div>
        </div>

        {/* thus, a bio is born!! */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full mb-32 text-center space-y-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[var(--primary)] opacity-30" />
            <span className="text-2xl font-black tracking-[0.4em] text-[var(--primary)]">Bio</span>
            <div className="-ml-2 h-px w-12 bg-[var(--primary)] opacity-30" />
          </div>
          <h2 className="text-4xl md:text-7xl font-sans font-bold tracking-tighter leading-[1.05] max-w-4xl mx-auto ">
            <br /> Semi <span className="text-[var(--primary)]">full-stack developer</span> and <span className="text-[var(--primary)]">Cybersecurity nerd</span> building things at virex.lol. <br /> <br /> Obsessed with minimal software bases, archival, clean user experiences, and aesthetics.
          </h2>
          <p className="text-xl md:text-3xl opacity-60 font-medium max-w-4xl mx-auto leading-relaxed">
            Running on arch, lightweight WMs, and way too much caffeine!! <br className="hidden md:block" />
            <span className="relative inline-block mt-4 md:mt-0">
              <span className="text-[var(--primary)] font-bold relative z-10">
                breaking things locally,
              </span>
              <span className="absolute bottom-1 left-0 w-full h-1.5 bg-[var(--primary)]/20 -rotate-1" />
            </span>{" "}
            <span className="relative inline-block">
              <span className="text-[var(--primary)] font-bold relative z-10">
                to fix them in production
              </span>
              <span className="absolute bottom-1 left-0 w-full h-1.5 bg-[var(--primary)]/20 rotate-1" />
            </span>{" "}
            :3
          </p>
        </motion.section>

        {/* bento or some bullshit grid new styling thing */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 w-full mb-32">
          {/* lore */}
          <Card noDefaultStyles
            delay={1.1}
            whileHover={{ y: -12, scale: 1.01 }}
            className="col-span-2 md:col-span-8"
            innerClassName="px-6 py-8 md:p-12 bg-[var(--surface-variant)]/40 backdrop-blur-xl rounded-[3.5rem] border-6 border-[var(--outline-variant)]/50 relative overflow-hidden group hover:border-[var(--primary)] transition-colors duration-200"
          >
            <h3 className="text-2xl md:text-4xl font-sans font-bold mb-8 md:mb-10 tracking-tight transition-colors group-hover:text-[var(--primary)] flex items-center gap-3">
              <History className="text-[var(--primary)] w-6 h-6 md:w-8 md:h-8" /> Virex.lol Lore...
            </h3>
            <div className="space-y-6 text-xl md:text-2xl opacity-80 leading-relaxed font-medium">
              <p>
                I had started my <span className="text-[var(--primary)] font-black">software researching</span> around 2021, focusing on simple scripting and tools.
              </p>
              <p>
                what started as a curiosity for how software worked, quickly turned into a pretty huge interest for <span className="text-[var(--primary)] font-black">programming</span> and hardware.
              </p>
              <p>
                since then, I became a developer with a maintained interest in cybersec and programming. by the end of 2023, my focus shifted toward linux and programming languages.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-700">
              <Activity size={240} />
            </div>
          </Card>

          {/* mission */}
          <Card noDefaultStyles
            delay={1.2}
            whileHover={{ y: -12, scale: 1.02 }}
            className="col-span-2 md:col-span-4"
            innerClassName="px-5 py-8 md:p-10 bg-[var(--primary-container)]/80 backdrop-blur-xl text-[var(--on-primary-container)] rounded-[3.5rem] border-6 border-[var(--primary)]/20 flex flex-col justify-between gap-6 group hover:border-[var(--primary)] transition-colors duration-200"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="text-[var(--primary)] w-6 h-6 md:w-8 md:h-8" />
                <span className="text-xl font-black tracking-widest opacity-60">A Mission...</span>
              </div>
              <p className="text-lg md:text-3xl font-sans font-bold leading-tight tracking-tight italic">
                "good code can be used as a form of protest."
              </p>
            </div>
            <p className="text-xs md:text-lg opacity-80 font-medium leading-snug">
              the internet is proprietary, and we can fight back! using code as a form of expression and resistance, to create a more open and free digital world.
            </p>
          </Card>

          {/* terminal specs card idk */}
          <Card noDefaultStyles
            delay={1.3}
            whileHover={{ y: -12, scale: 1.01 }}
            className="col-span-2 md:col-span-12 lg:col-span-6"
            innerClassName="bg-[#0a0a0a] text-white/90 px-5 py-8 md:p-10 rounded-[3.5rem] border-6 border-white/5 font-mono relative group overflow-hidden hover:border-[var(--primary)] transition-colors duration-200 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 transition-opacity group-hover:opacity-100">
              <SquareTerminal className="text-[var(--primary)] w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-md font-bold tracking-widest">virex@virex</span>
            </div>
            <div className="space-y-3">
              {[
                { k: "OS", v: "Arch Linux" },
                { k: "Shell", v: "fish 4.7.1" },
                { k: "Kernel", v: "Linux 7.0.9" },
                { k: "CPU", v: "i5-14600K" },
                { k: "GPU", v: "RX 6800 XT" },
              ].map(s => (
                <div key={s.k} className="flex gap-4 text-xs md:text-sm">
                  <span className="text-[var(--primary)] font-bold min-w-[60px] md:min-w-[80px]">{s.k}</span>
                  <span className="opacity-60 group-hover:opacity-100 transition-opacity truncate">{s.v}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.06] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%] transition-opacity" />
          </Card>

          {/* tech stack */}
          <Card noDefaultStyles
            delay={1.4}
            whileHover={{ y: -12, scale: 1.01 }}
            className="col-span-2 md:col-span-12 lg:col-span-6"
            innerClassName="px-6 py-8 md:p-12 bg-[var(--surface-variant)]/40 backdrop-blur-xl rounded-[3.5rem] border-6 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] transition-colors duration-200 group flex flex-col gap-8"
          >
            <div className="flex items-center gap-3">
              <Code2 className="text-[var(--primary)] w-5 h-5 md:w-6 md:h-6" />
              <h4 className="text-xl md:text-2xl font-sans font-bold transition-colors group-hover:text-[var(--primary)]">The stack..</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-4">
                <div className="text-[13px] font-black tracking-[0.2em] opacity-40">Web Stack</div>
                <div className="flex flex-wrap gap-2.5">
                  {TECH_STACK.web.sort().map(t => (
                    <TechChip key={t} label={t} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[13px] font-black tracking-[0.2em] opacity-40">Technical Stack</div>
                <div className="flex flex-wrap gap-2.5">
                  {TECH_STACK.technical.sort().map(t => (
                    <TechChip key={t} label={t} />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* archive shit. */}
          <Card noDefaultStyles
            delay={1.5}
            whileHover={{ y: -12, scale: 1.01 }}
            className="col-span-2 md:col-span-12"
            innerClassName="px-6 py-8 md:p-12 bg-[var(--surface-variant)]/60 backdrop-blur-xl rounded-[3.5rem] border-6 border-[var(--outline-variant)]/50 border-dashed flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-[var(--primary)]/50 transition-colors duration-200"
          >
            <div className="space-y-4 text-center md:text-left">
              <h4 className="text-2xl md:text-3xl font-sans font-bold tracking-tight flex items-center justify-center md:justify-start gap-3 transition-colors group-hover:text-[var(--primary)]">
                <Archive className="text-[var(--primary)] w-6 h-6 md:w-8 md:h-8" /> Archival
              </h4>
              <p className="text-xl opacity-70 font-medium max-w-2xl group-hover:opacity-100 transition-opacity">
                just my instinct. I love collecting legacy software, old documentation, and keeping backups of everything of interest that I find.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
              <div className="text-[13px] font-black tracking-[0.2em] opacity-40 mb-2">Fingerprint!</div>
              <div className="text-[11px] md:text-sm font-mono opacity-100 select-all p-4 bg-[var(--surface-variant)] rounded-2xl border-2 border-[var(--outline-variant)]/50 leading-relaxed text-center md:text-right group-hover:border-[var(--primary)]/30 transition-all">
                1D4D 0BDB 03DA F87B 2151 <br />
                6AE8 A109 C97B 2AD5 C2E6
              </div>
            </div>
          </Card>
        </div>

        {/* foooootters */}
        <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
          <div className="h-1 w-20 bg-[var(--primary)] rounded-full opacity-20" />
          <div className="flex flex-wrap justify-center gap-10">
            <BounceButton
              icon={Github}
              label="GitHub"
              url="https://github.com/hnpf"
              className="m3-button-tonal ring-8 ring-[var(--outline-variant)]/30 w-64 h-16 rounded-3xl font-black tracking-widest text-sm transition-colors active:scale-95"
            />
            <BounceButton
              icon={MessageSquare}
              label="Discord"
              url="https://conspiracy.rip/discord"
              className="m3-button-tonal ring-8 ring-[var(--outline-variant)]/30 w-64 h-16 rounded-3xl font-black tracking-widest text-sm transition-colors active:scale-95"
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.08,
              y: -5,
              borderRadius: "48px",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              mass: 1
            }}
            onClick={onBack}
            className="m3-button-filled ring-12 ring-[var(--primary)]/10 !bg-[var(--on-surface)] !text-[var(--surface)] h-20 px-16 rounded-[32px] text-2xl font-black flex items-center gap-4 transition-colors"
          >
            <Home size={32} />
            Go home
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ReadmePage = memo(({ setPage }: { setPage: (page: string) => void }) => {
  return (
    <BullshitMatrix
      onBack={() => setPage("home")}
      setPage={setPage}
    />
  );
});

// --- main app shell ---

export default function App() {
  const { settings, updateSettings, actualTheme, cycleTheme } = useTheme();
  
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // parse sharing capsule from URL search params on startup!
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const capsule = params.get("theme") || params.get("capsule");
    if (capsule) {
      try {
        const decoded = JSON.parse(atob(capsule));
        const validatedSettings: Partial<typeof settings> = {};
        
        // validate settings structure to make sure we don't inject any random shit
        const keys: (keyof typeof settings)[] = [
          "mode", "accent", "hue", "saturation", "sidebarFlipped",
          "sidebarCollapsed", "profileContainer", "brutalistMode",
          "developerFont", "focusMode", "floatingSidebar", "debugMode",
          "helloAnimation", "disableAnimations", "highHz", "amoledMode",
          "bentoTilt"
        ];
        
        for (const k of keys) {
          if (decoded[k] !== undefined) {
            (validatedSettings as any)[k] = decoded[k];
          }
        }
        
        updateSettings(validatedSettings);
        setToast("Theme loaded from Sharing Capsule! ✨");
        
        // clean up search params in browser URL bar immediately
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {
        console.error("oh shit, capsule decoding failed! probably corrupted.", e);
      }
    }
  }, [updateSettings]);

  // transition settings for sidebar and components
  const springConfig = {
    type: "spring" as const,
    stiffness: settings.highHz ? 600 : 500,
    damping: settings.highHz ? 30 : 28,
    mass: 0.8,
  };

  const squishySpring = {
    type: "spring" as const,
    stiffness: settings.highHz ? 400 : 350,
    damping: settings.highHz ? 28 : 25,
    mass: 0.8,
  };

  const sideItemSpring = {
    type: "spring" as const,
    stiffness: settings.highHz ? 800 : 700,
    damping: settings.highHz ? 40 : 35,
    mass: 0.2,
  };

  const settingsSpring = {
    type: "spring" as const,
    stiffness: settings.highHz ? 400 : 300,
    damping: settings.highHz ? 35 : 30,
    mass: 1.2,
    restDelta: 0.001,
  };

  const [page, setPage] = useState(() => {
    const loc = window.location.pathname;
    if (loc === "/" || loc === "") return "home";
    if (loc.startsWith("/blog/")) return "blog";
    const path = loc.replace("/", "").toLowerCase();
    const ALLOWED_SECTIONS = [
      "home",
      "blog",
      "lens",
      "tracker",
      "readme",
      "changelog",
      "dash",
      "no",
    ];
    return ALLOWED_SECTIONS.includes(path) ? path : "404";
  });
  const [do_wiggle, setDoWiggle] = useState(false);
  const [fihMode, setFihMode] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);

  useEffect(() => {
    if (!IS_APR) return;
    // i actually think i hate april fools now.. 
    // this traumatized me into doing way too much work and tons of checks resulting in tons of unknown ass bugs and issues i hate it!

    // phase 4: the gamble
    const msgs = [
      "fih has blocked u.",
      "accept fih as your lord and savior to continue!!",
      "fih was found. please install fish-shield (free).",
      "download more fih today!",
      "issue found! not enough fih.",
    ];

    const gamble = () => {
      const r = Math.random();
      if (r < 0.2) {
        window.location.href = "/no";
      } else if (r < 0.5) {
        setFihMode(true);
        setTimeout(() => setFihMode(false), 15000);
      } else {
        setPopup(msgs[Math.floor(Math.random() * msgs.length)]);
      }
    };
    const gamble_itv = setInterval(gamble, 15000);

    // phase 1: blue underlined hell
    document.body.classList.add("fsh-mode");

    // hijack clicks to the fish
    const hijack = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // if it looks like a link/button, let it work so they can actually use the site
      // but otherwise, send them to the fish
      if (!target.closest("a, button, .sidebar-item, .bottom-nav-item")) {
        window.location.href = "/fsh-spin.gif";
      }
    };
    window.addEventListener("click", hijack);

    // phase 3: random flips
    const flip_it = () => {
      const els = document.querySelectorAll("div, p, h1, h2, h3, img, span");
      const target = els[Math.floor(Math.random() * els.length)];
      // don't flip the sidebar, that's too mean
      if (target && !target.closest(".sidebar-item")) {
        target.classList.toggle("fsh-flip");
      }
    };
    const interval = setInterval(flip_it, 3000);

    // phase 5: tab & favicon chaos
    const titles = [
      "did i get u?",
      "fih.",
      "LOOK BEHIND YOU!!111!",
      "virex (but cooler)",
      "fih | /DEV/NULL/VIREX.",
      "404 fih aint found",
    ];
    const meta_gamble = () => {
      document.title = titles[Math.floor(Math.random() * titles.length)];
      const fsh_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐟</text></svg>`;
      const fav = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (fav)
        fav.href = `data:image/svg+xml;utf8,${encodeURIComponent(fsh_svg)}`;
    };
    const meta_itv = setInterval(meta_gamble, 5000);

    return () => {
      document.body.classList.remove("fsh-mode");
      window.removeEventListener("click", hijack);
      clearInterval(interval);
      clearInterval(gamble_itv);
      clearInterval(meta_itv);
    };
  }, []);

  useEffect(() => {
    if (!fihMode) return;

    const fih_it = (node: Node) => {
      if (node.nodeType === 3) {
        const val = node.nodeValue || "";
        if (val.trim().length > 0 && !val.includes("fih")) {
          node.nodeValue = val.replace(/\w+/g, "fih");
        }
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          fih_it(node.childNodes[i]);
        }
      }
    };

    let frame: number;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fih_it(document.body));
    });

    observer.observe(document.body, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    fih_it(document.body);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [fihMode]);

  useEffect(() => {
    // wait a bit after load then wiggle once
    const timer = setTimeout(() => setDoWiggle(true), 1200);
    // turn it off after it finishes its cycles (forced short duration tho)
    const stop = setTimeout(() => setDoWiggle(false), 2200);
    return () => {
      clearTimeout(timer);
      clearTimeout(stop);
    };
  }, []);

  useEffect(() => {
    const on_key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && settings.focusMode) {
        updateSettings({ focusMode: false });
      }
    };
    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, [settings.focusMode, updateSettings]);

  const [blogPostId, setBlogPostId] = useState<string | null>(() => {
    const loc = window.location.pathname;
    if (loc.startsWith("/blog/")) return loc.split("/")[2];
    return null;
  });
  const [hwOpen, setHwOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [showDebugConfirm, setShowDebugConfirm] = useState(false);
  const [viewport, set_viewport] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [navHoverSide, setNavHoverSide] = useState<"top" | "bottom" | null>(
    null,
  );

  useEffect(() => {
    const nav = document.getElementById("sidebar-nav");
    if (!nav) return;

    const check = () => {
      setCanScrollUp(nav.scrollTop > 5);
      setCanScrollDown(
        nav.scrollHeight - nav.scrollTop - nav.clientHeight > 5,
      );
    };

    check();
    
    // browser layout/paint ticks delay to capture final scrollHeight on refresh
    const tick = requestAnimationFrame(check);
    const timeout = setTimeout(check, 100);

    nav.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(tick);
      clearTimeout(timeout);
      nav.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [viewport.h, page, settings.sidebarCollapsed]);

  useEffect(() => {
    if (settingsOpen || hwOpen || showDebugConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [settingsOpen, hwOpen, showDebugConfirm]);

  const is_short = viewport.h < 720;
  const is_tiny = viewport.h < 550;
  const is_mobile = viewport.w < 768 && !settings.forceDesktop;

  const show_pfp_container = settings.profileContainer && viewport.h > 720;

  useEffect(() => {
    const on_resize = () =>
      set_viewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on_resize);
    return () => window.removeEventListener("resize", on_resize);
  }, []);

  // keeping the address bar in sync with state so the back button actually fucking works
  useEffect(() => {
    const sync_url = () => {
      const loc = window.location.pathname;
      if (loc === "/" || loc === "") {
        setPage("home");
        setBlogPostId(null);
      } else if (loc.startsWith("/blog/")) {
        const id = loc.split("/")[2];
        setPage("blog");
        setBlogPostId(id);
      } else {
        const path = loc.replace("/", "").toLowerCase();
        const ALLOWED_SECTIONS = [
          "home",
          "blog",
          "lens",
          "tracker",
          "readme",
          "changelog",
          "dash",
          "no",
        ];
        setPage(ALLOWED_SECTIONS.includes(path) ? path : "404");
        setBlogPostId(null);
      }
    };

    sync_url();
    window.addEventListener("popstate", sync_url);
    return () => window.removeEventListener("popstate", sync_url);
  }, []);

  // updating the title so people know where they are lol
  // console.log('page:', page, blogPostId)
  useEffect(() => {
    if (IS_APR) return;
    const name =
      page === "readme" ? "Info" : page.charAt(0).toUpperCase() + page.slice(1);
    const title =
      page === "blog" && blogPostId
        ? `Virex | ${BLOG_POSTS.find((p) => p.id === blogPostId || p.link === blogPostId)?.title || "Post"}`
        : page === "home"
          ? "Virex"
          : `Virex | ${name}`;
    document.title = title;

    // gotta also update the social tags for the seo ppl
    let desc =
      "i am virex. a software researcher and problem solver, i explore systems and programming, UI/UX, and security research.";
    let og_title = title;
    let og_img = "https://virex.lol/photography/pfp/main.png";
    if (page === "blog" && blogPostId) {
      const p = BLOG_POSTS.find(
        (p) => p.id === blogPostId || p.link === blogPostId,
      );
      if (p) {
        desc = p.snippet;
        og_title = `Virex Blog | ${p.title}`;
      }
    } else if (page === "readme") {
      desc =
        "README: my personal biography, a quick summary about my mission, and identity.";
    } else if (page === "lens") {
      desc = "lens: my photography collection, all done with a literal phone.";
    }

    const set_meta = (key: string, val: string, is_prop = false) => {
      let el = document.querySelector(
        is_prop ? `meta[property="${key}"]` : `meta[name="${key}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        if (is_prop) el.setAttribute("property", key);
        else el.setAttribute("name", key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };
    set_meta("description", desc);
    set_meta("og:title", og_title, true);
    set_meta("og:description", desc, true);
    set_meta("og:image", og_img, true);
    set_meta("twitter:title", og_title);
    set_meta("twitter:description", desc);

    // --- JSON-LD structured stuff ---
    const old_ld = document.getElementById("json-ld-structured-data");
    if (old_ld) old_ld.remove();

    const ld: any = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Virex",
      url: "https://virex.lol",
      author: {
        "@type": "Person",
        name: "virex",
      },
    };
    // ok

    if (page === "blog" && blogPostId) {
      const p = BLOG_POSTS.find(
        (p) => p.id === blogPostId || p.link === blogPostId,
      );
      if (p) {
        ld["@type"] = "BlogPosting";
        ld["headline"] = p.title;
        ld["description"] = p.snippet;
        ld["datePublished"] = new Date(p.date).toISOString();
        ld["author"] = { "@type": "Person", name: "Virex" };
      }
    }

    const script = document.createElement("script");
    script.id = "json-ld-structured-data";
    script.type = "application/ld+json";
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
  }, [page, blogPostId, settings.accent, settings.mode]);

  const goto = React.useCallback((newPage: string, postId: string | null = null) => {
    console.log("heading to page:", newPage, postId ? `with post ${postId}` : "lmao");
    setSettingsOpen(false);
    const url =
      newPage === "home" ? "/" : postId ? `/blog/${postId}` : `/${newPage}`;
    window.history.pushState({}, "", url);
    React.startTransition(() => {
      setPage(newPage);
      setBlogPostId(postId);
    });
    window.scrollTo(0, 0);
  }, []);
  const [show_top, setShowTop] = useState(false);
  const [scrolled, set_scrolled] = useState(false);

  useEffect(() => {
    const on_scroll = () => {
      setShowTop(window.scrollY > 400);
      set_scrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", on_scroll);
    return () => window.removeEventListener("scroll", on_scroll);
  }, []);

  // local state for debug view toggles
  const [show_grid, set_show_grid] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "debug-grid-active",
      settings.debugMode && show_grid,
    );
  }, [settings.debugMode, show_grid]);

  // back to top
  return (
    <div
      className={cn(
        "min-h-screen flex font-sans relative",
        settings.forceDesktop ? "flex-row" : "flex-col md:flex-row",
        settings.sidebarFlipped && (settings.forceDesktop ? "flex-row-reverse" : "md:flex-row-reverse"),
        settings.debugMode && "debug-mode",
      )}
    >
      {IS_APR && <div className="fsh-tiled-bg" />}
      {popup && (
        <CursedPopup content={popup} onResolve={() => setPopup(null)} />
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
            className="fixed bottom-6 left-1/2 z-[10000] bg-[var(--primary-container)] text-[var(--on-primary-container)] px-6 py-3 rounded-full font-black text-sm tracking-wider shadow-2xl border border-[var(--primary)]/20 flex items-center gap-3 backdrop-blur-md"
          >
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {settings.debugMode && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-white/10 dark:bg-black/20 text-[var(--on-surface)] font-mono text-[10px] p-6 rounded-[2.5rem] border-6 border-[var(--outline-variant)] ring-6 ring-[var(--outline-variant)]/30 backdrop-blur-2xl shadow-2xl flex flex-col gap-4 min-w-[240px]">
          <div className="flex items-center gap-2 border-b border-[var(--outline-variant)]/20 pb-2">
            <Terminal size={14} className="text-[var(--primary)]" />
            <span className="font-black tracking-[0.2em] text-[10px] opacity-60">
              Virex debug view
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="opacity-40 font-bold">PAGE:</span>
              <span className="text-[var(--primary)] font-black">
                {page.toUpperCase()}
                {blogPostId ? `:${blogPostId}` : ""}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="opacity-40 font-bold">VIEWPORT:</span>
              <span className="font-black">
                {viewport.w}x{viewport.h}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="opacity-40 font-bold">THEME:</span>
              <span className="font-black">{actualTheme.toUpperCase()}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2 border-t border-[var(--outline-variant)]/20">
            <button
              onClick={() => set_show_grid(!show_grid)}
              className={cn(
                "flex items-center justify-between p-2 rounded-xl transition-all font-black uppercase text-[9px] tracking-widest",
                show_grid
                  ? "bg-[var(--primary)] text-[var(--on-primary)]"
                  : "bg-[var(--surface-variant)] text-[var(--on-surface-variant)]",
              )}
            >
              <span>Layout Grid</span>
              {show_grid ? (
                <Check size={10} strokeWidth={4} />
              ) : (
                <X size={10} strokeWidth={4} />
              )}
            </button>
            <button
              onClick={() => cycleTheme()}
              className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--primary-container)] transition-all font-black uppercase text-[9px] tracking-widest"
            >
              <span>Cycle Theme</span>
              <Palette size={10} />
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-1 border-t border-[var(--outline-variant)]/20">
            <div className="flex items-center gap-2 opacity-30 italic">
              <Cpu size={10} />
              <span>v2.3.6-stable (v2026.05.25)</span>            </div>          </div>
        </div>
      )}

      <AnimatePresence>
        {show_top && (
          <motion.button
            key={settings.sidebarFlipped ? "flipped" : "normal"}
            layout
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={cn(
              "fixed bottom-24 lg:bottom-12 z-50 p-4 bg-[var(--primary)] text-[var(--on-primary)] rounded-full shadow-2xl border-6 border-[var(--outline-variant)]  backdrop-blur-md",
              settings.sidebarFlipped
                ? "right-6 lg:right-auto lg:left-12"
                : "right-6 lg:right-12",
            )}
          >
            <ArrowUpRight size={24} className="-rotate-45" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* some immersive focus mode overlays*/}
      <AnimatePresence>
        {settings.focusMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 right-0 h-32 z-[100] pointer-events-none backdrop-blur-md"
              style={{
                maskImage: "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black, transparent)",
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 h-32 z-[100] pointer-events-none backdrop-blur-md"
              style={{
                maskImage: "linear-gradient(to top, black, transparent)",
                WebkitMaskImage: "linear-gradient(to top, black, transparent)",
              }}
            />
          </>
        )}
      </AnimatePresence>
      {/*desktop sidebar*/}
      <AnimatePresence>
        {!settings.focusMode && page !== "no" && page !== "readme" && !is_mobile && (
          <motion.aside
            initial={{
              x: settings.sidebarFlipped ? 60 : -60,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
              width: settings.sidebarCollapsed
                ? settings.floatingSidebar
                  ? 144
                  : 96
                : settings.floatingSidebar
                  ? 350
                  : 320,
              paddingTop: settings.floatingSidebar ? "1.5rem" : "12px",
              paddingBottom: settings.floatingSidebar ? "1.5rem" : "12px",
              paddingLeft: settings.sidebarFlipped
                ? settings.floatingSidebar
                  ? "1.5rem"
                  : "12px"
                : settings.floatingSidebar
                  ? "1.5rem"
                  : "0px",
              paddingRight: settings.sidebarFlipped
                ? settings.floatingSidebar
                  ? "1.5rem"
                  : "0px"
                : settings.floatingSidebar
                  ? "1.5rem"
                  : "12px",
              borderTopLeftRadius:
                settings.floatingSidebar || settings.sidebarFlipped
                  ? "3rem"
                  : "0rem",
              borderBottomLeftRadius:
                settings.floatingSidebar || settings.sidebarFlipped
                  ? "3rem"
                  : "0rem",
              borderTopRightRadius:
                settings.floatingSidebar || !settings.sidebarFlipped
                  ? "3rem"
                  : "0rem",
              borderBottomRightRadius:
                settings.floatingSidebar || !settings.sidebarFlipped
                  ? "3rem"
                  : "0rem",
            }}
            style={{
              backgroundColor: settings.floatingSidebar
                ? "transparent"
                : "var(--outline-variant)",
            }}
            exit={{
              x: settings.sidebarFlipped ? 400 : -400, // get off screen
              opacity: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
              }
            }}
            transition={springConfig}
            layout
            className="flex-col sticky top-0 h-screen z-40 motion-gpu transition-colors duration-300"
          >
            <motion.div
              layout
              animate={{
                padding: settings.sidebarCollapsed
                  ? "0px"
                  : settings.floatingSidebar
                    ? "20px"
                    : "24px",
                borderRadius: settings.floatingSidebar
                  ? "2.5rem 2.5rem 2.5rem 2.5rem"
                  : settings.sidebarFlipped
                    ? "2.375rem 0 0 2.375rem"
                    : "0 2.375rem 2.375rem 0",
                backdropFilter:
                  scrolled || settings.floatingSidebar
                    ? "blur(24px)"
                    : "blur(0px)",
                borderWidth: settings.floatingSidebar ? "6px" : "0px",
                borderRightWidth:
                  !settings.floatingSidebar && !settings.sidebarFlipped
                    ? "1px"
                    : settings.floatingSidebar
                      ? "6px"
                      : "0px",
                borderLeftWidth:
                  !settings.floatingSidebar && settings.sidebarFlipped
                    ? "1px"
                    : settings.floatingSidebar
                      ? "6px"
                      : "0px",
                borderBottomWidth:
                  scrolled && !settings.floatingSidebar
                    ? "1px"
                    : settings.floatingSidebar
                      ? "6px"
                      : "0px",
                boxShadow: settings.floatingSidebar
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  : "0 0px 0px 0px rgba(0, 0, 0, 0)",
              }}
              style={{
                backgroundColor: "var(--surface)",
              }}
              transition={{
                ...springConfig,
                stiffness: settings.highHz ? 500 : 400,
                damping: settings.highHz ? 28 : 25,
              }}
              className={cn(
                "flex flex-col h-full w-full motion-gpu border-[var(--outline-variant)] transition-colors duration-300",
                scrolled &&
                !settings.floatingSidebar &&
                "border-b-[var(--outline-variant)]/30",
              )}
            >
              <div
                className={cn(
                  "flex items-center isolate",
                  settings.sidebarCollapsed
                    ? cn("justify-center px-0", is_short ? "mb-4 py-4" : "mb-10 py-10")
                    : show_pfp_container
                      ? cn("bg-[var(--surface-variant)]/20 ring-6 ring-[var(--outline-variant)]/30 rounded-[2.5rem] px-4 mx-2 gap-4", is_short ? "mb-4 py-3" : "mb-10 py-6")
                      : cn("px-4 mx-2 gap-4", is_short ? "mb-4 py-1" : "mb-8 py-2"),
                )}
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: -2,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.92, rotate: 5 }}
                  animate={{
                    rotate: do_wiggle ? [0, -10, 10, -10, 10, 0] : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                    mass: 0.6,
                  }}
                  onClick={() => goto("readme")}
                  className={cn(
                    "flex items-center justify-center shrink-0 relative group/pfp cursor-pointer isolate",
                    show_pfp_container
                      ? "w-24 h-24 rounded-[40px] shadow-xl"
                      : cn(
                        "w-24 h-24 rounded-[40px] shadow-none",
                        !settings.sidebarCollapsed && "-ml-5",
                      ),
                    settings.sidebarCollapsed && "w-16 h-16 rounded-[24px]",
                  )}
                >
                  <div className="absolute inset-0 rounded-[inherit] overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-0 z-20 rounded-[inherit] ring-inset transition-colors duration-250 pointer-events-none",
                        show_pfp_container
                          ? "ring-6 ring-[var(--outline-variant)] group-hover/pfp:ring-[var(--primary)]"
                          : "ring-6 ring-[var(--outline-variant)] group-hover/pfp:ring-[var(--primary)]",
                        settings.sidebarCollapsed && "ring-4",
                      )}
                    />
                    <div className="absolute inset-0 bg-[var(--surface-variant)]/50 -z-10" />
                    <img
                      src="/photography/pfp/main.png"
                      alt="virex"
                      className="w-full h-full object-cover rounded-[inherit] group-hover/pfp:scale-110 transition-transform duration-250"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const svg = document.createElement("img");
                        svg.src = "/2.svg";
                        svg.className =
                          "w-10 h-10 p-1 transition-transform group-hover/pfp:scale-110";
                        svg.style.color = "var(--on-primary)";
                        (
                          e.target as HTMLImageElement
                        ).parentElement!.appendChild(svg);
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
                {!settings.sidebarCollapsed && (
                  <div className="overflow-hidden whitespace-nowrap">
                    <div className="font-display font-black text-xl md:text-2xl tracking-tighter">
                      virex (美烈久)
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-black">
                      dev/cybersec
                    </div>
                  </div>
                )}
              </div>
              {!settings.sidebarCollapsed && !is_tiny && !is_short && (
                <div className="flex items-center gap-3 mb-6 px-4">
                  <div className="w-8 h-8 bg-[var(--surface-variant)]/60 text-[var(--on-surface-variant)]/80 rounded-[32%] flex items-center justify-center shadow-sm">
                    <Layers size={18} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-display font-black tracking-tighter text-[var(--on-surface-variant)]">
                    Pages
                  </h3>
                </div>
              )}
              <div
                className="flex-1 flex flex-col min-h-0 relative group/nav"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  setNavHoverSide(y < rect.height / 2 ? "top" : "bottom");
                }}
                onMouseLeave={() => setNavHoverSide(null)}
              >
                <nav
                  id="sidebar-nav"
                  className={cn(
                    "flex-1 flex flex-col overflow-y-auto min-h-0 py-12 scrollbar-hide scroll-smooth",
                    canScrollUp && canScrollDown
                      ? "mask-both"
                      : canScrollUp
                        ? "mask-top"
                        : canScrollDown
                          ? "mask-bottom"
                          : "",
                    is_short ? "gap-6" : "gap-6",
                    settings.sidebarCollapsed
                      ? "items-center px-2"
                      : "items-stretch px-4",
                      // oh my god there's too much unused code im gonna lose my mind in this unreadable hellhole
                  )}
                  data-rail-state={
                    settings.sidebarCollapsed ? "default" : "open"
                  }
                >
                  <SideItem
                    highHz={settings.highHz}
                    isFirst
                    glyph={Home}
                    text="Home"
                    isSelected={page === "home"}
                    onSelect={() => goto("home")}
                    isMini={settings.sidebarCollapsed}
                    isFloating={settings.floatingSidebar}
                    isShort={is_short}
                  />
                  <SideItem
                    highHz={settings.highHz}
                    glyph={Fingerprint}
                    text="Info"
                    isSelected={page === "readme"}
                    onSelect={() => goto("readme")}
                    isMini={settings.sidebarCollapsed}
                    isFloating={settings.floatingSidebar}
                    isShort={is_short}
                  />
                  <SideItem
                    highHz={settings.highHz}
                    glyph={BookText}
                    text="Blog"
                    isSelected={page === "blog"}
                    onSelect={() => goto("blog")}
                    isMini={settings.sidebarCollapsed}
                    isFloating={settings.floatingSidebar}
                    isShort={is_short}
                  />
                  <SideItem
                    highHz={settings.highHz}
                    glyph={Camera}
                    text="Lens"
                    isSelected={page === "lens"}
                    onSelect={() => goto("lens")}
                    isMini={settings.sidebarCollapsed}
                    isFloating={settings.floatingSidebar}
                    isShort={is_short}
                  />
                  <SideItem
                    highHz={settings.highHz}
                    glyph={Activity}
                    text="Tracker"
                    isSelected={page === "tracker"}
                    onSelect={() => goto("tracker")}
                    isMini={settings.sidebarCollapsed}
                    isFloating={settings.floatingSidebar}
                    isShort={is_short}
                  />
                  <SideItem
                    highHz={settings.highHz}
                    isLast
                    glyph={LinkIcon}
                    text="Short"
                    isSelected={page === "dash"}
                    onSelect={() => goto("dash")}
                    isMini={settings.sidebarCollapsed}
                    isFloating={settings.floatingSidebar}
                    isShort={is_short}
                  />
                  {/*<SideItem glyph={Terminal} text="Loom" isSelected={page === 'loom'} onSelect={() => goto('loom')} isMini={settings.sidebarCollapsed} isFloating={settings.floatingSidebar} />*/}

                  {IS_APR && (
                    <div className={cn("pt-4 border-t border-[var(--outline-variant)]/30 space-y-2", is_short ? "mt-2" : "mt-8")}>
                      {!settings.sidebarCollapsed && (
                        <div className="text-[1px] font-black uppercase tracking-[0.3em] opacity-40 px-4 mb-2">
                          FISH CHANNEL
                        </div>
                      )}
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => (window.location.href = "/fsh-spin.gif")}
                          className={cn(
                            "flex items-center gap-4 px-4 py-2 w-full hover:bg-[var(--surface-variant)] rounded-xl transition-all group",
                            settings.sidebarCollapsed && "justify-center px-0",
                          )}
                        >
                          <img
                            src="/fsh-spin.gif"
                            className="w-8 h-8 rounded-full group-hover:scale-125 transition-transform"
                          />
                          {!settings.sidebarCollapsed && (
                            <span className="font-bold text-xs uppercase tracking-widest text-blue-600 underline">
                              WATCH NOW! FISH #{i + 1}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </nav>

                {/* scroll indicator buttons for short screens */}
                <AnimatePresence>
                  {canScrollUp && navHoverSide === "top" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={squishySpring}
                      className="absolute top-2 left-0 right-0 pointer-events-none flex flex-col items-center z-[50]"
                    >
                      <button
                        onClick={() =>
                          document
                            .getElementById("sidebar-nav")
                            ?.scrollBy({ top: -150, behavior: "smooth" })
                        }
                        className="w-10 h-10 bg-[var(--primary)] text-[var(--on-primary)] rounded-full flex items-center justify-center shadow-lg pointer-events-auto border-2 border-white/10 transition-transform active:scale-90"
                      >
                        <ChevronLeft
                          size={18}
                          className="rotate-90 stroke-[3]"
                        />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {canScrollDown && navHoverSide === "bottom" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={squishySpring}
                      className="absolute bottom-2 left-0 right-0 pointer-events-none flex flex-col items-center z-[50]"
                    >
                      <button
                        onClick={() =>
                          document
                            .getElementById("sidebar-nav")
                            ?.scrollBy({ top: 150, behavior: "smooth" })
                        }
                        className="w-10 h-10 bg-[var(--primary)] text-[var(--on-primary)] rounded-full flex items-center justify-center shadow-lg pointer-events-auto border-2 border-white/10 transition-transform active:scale-90"
                      >
                        <ChevronLeft
                          size={18}
                          className="-rotate-90 stroke-[3]"
                        />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div
                className={cn(
                  "mt-auto flex flex-col pt-4",
                  settings.sidebarCollapsed
                    ? cn("items-center gap-6", is_short ? "pb-4" : "pb-10")
                    : cn("px-2 gap-4", is_short ? "pb-2" : "pb-4"),
                )}
                data-rail-state={settings.sidebarCollapsed ? "default" : "open"}
              >
                {/* idk */}
                <div className="mx-4 h-px bg-[var(--outline-variant)]" />

                <div
                  className={cn(
                    "flex flex-col",
                    settings.sidebarCollapsed ? "w-full items-center gap-6" : "gap-4",
                  )}
                >
                  <SideItem
                    highHz={settings.highHz}
                    glyph={SettingsIcon}
                    text="Settings"
                    onSelect={() => setSettingsOpen(true)}
                    isMini={settings.sidebarCollapsed}
                    isShort={is_short}
                    isFirst
                    isFloating={settings.floatingSidebar}
                    layoutId="settings-expansion"
                  />

                  {!settings.sidebarCollapsed && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <BounceButton
                        icon={Github}
                        label="GitHub"
                        url="https://github.com/hnpf"
                        className="flex items-center justify-center gap-2 border-6 border-[var(--outline-variant)]/40 py-4 px-3 rounded-[20px] bg-[var(--surface-variant)]/30 hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] text-[var(--on-surface-variant)] transition-colors text-sm font-black"
                      />
                      <BounceButton
                        icon={MessageSquare}
                        label="Discord"
                        url="https://conspiracy.rip/discord"
                        className="flex items-center justify-center gap-2 border-6 border-[var(--outline-variant)]/40 py-4 px-3 rounded-[20px] bg-[var(--surface-variant)]/30 hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] text-[var(--on-surface-variant)] transition-colors text-sm font-black"
                      />
                    </div>
                  )}

                  <div className={cn("w-full flex justify-center", settings.sidebarCollapsed && "px-0")}>
                    <motion.button
                      layout
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        updateSettings({
                          sidebarCollapsed: !settings.sidebarCollapsed,
                        })
                      }
                      className={cn(
                        "flex items-center justify-center ring-6 ring-[var(--outline-variant)]/30 outline-none cursor-pointer transition-all duration-300",
                        settings.sidebarCollapsed
                          ? "w-14 h-14 rounded-[18px] bg-[var(--surface-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)]"
                          : "w-full py-4 rounded-t-[15px] rounded-b-[28px] bg-[var(--surface-variant)]/30 hover:bg-[var(--surface-variant)] text-[var(--on-surface-variant)]",
                      )}
                      transition={springConfig}
                    >
                      {settings.sidebarCollapsed ? (
                        <ChevronRight size={20} />
                      ) : (
                        <ChevronLeft size={20} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/*<SideAction
                  onClick={() => updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })}
                  isMini={settings.sidebarCollapsed}
                  className="bg-transparent"
                  tooltip={settings.sidebarCollapsed ? "Expand" : "Collapse"}
                >
                  {settings.sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </SideAction>*/}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/*main*/}
      <motion.main
        className={cn(
          "flex-1 p-6 md:p-12 lg:p-16 overflow-x-hidden page-container",
          settings.forceDesktop || viewport.w >= 768 ? "pb-16" : "pb-40",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page + (blogPostId || "")}
            initial={settings.disableAnimations ? false : {
              opacity: 0,
              y: 15,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -15,
              scale: 0.98,
            }}
            transition={{
              duration: settings.disableAnimations
                ? 0
                : settings.highHz
                  ? 0.25
                  : 0.4,
              ease: [0.22, 1, 0.36, 1], // custom cubic for a somewhat fluid feel
              scale: {
                type: "spring",
                stiffness: settings.highHz ? 600 : 300,
                damping: settings.highHz ? 35 : 25,
              },
            }}
            className=""
          >
            {page === "home" && <HomePage setPage={goto} settings={settings} />}
            {page === "blog" && (
              <BlogPage targetId={blogPostId} navigateTo={goto} />
            )}
            {page === "lens" && <LensPage viewport={viewport} />}
            {page === "tracker" && <TrackerPage />}
            {page === "readme" && <ReadmePage setPage={goto} />}
            {/*{page === 'loom' && <LoomPage />}*/}
            {page === "changelog" && <ChangelogPage />}
            {page === "dash" && <DashPage />}
            {page === "no" && <NoPage />}
            {![
              "home",
              "blog",
              "lens",
              "tracker",
              "readme",
              "changelog",
              "dash",
              "no",
            ].includes(page) && <NotFound go={goto} />}
          </motion.div>
        </AnimatePresence>
        {/*exit focus mode main button*/}
        <AnimatePresence>
          {settings.focusMode && (
            <motion.button
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 20,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ focusMode: false })}
              className="fixed bottom-15 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[var(--primary)] text-[var(--on-primary)] rounded-full font-bold shadow-2xl flex items-center gap-3 border-2 border-white/20 backdrop-blur-md"
            >
              <EyeOff size={20} />
              <span>exit focus:</span>
              <span className="text-[10px] opacity-60 bg-black/20 px-2 py-0.5 rounded uppercase tracking-wider">
                Esc
              </span>
              <span>or click me!</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.main>
      <AnimatePresence>
        {!settings.focusMode && page !== "no" && page !== "readme" && is_mobile && (
          <motion.nav
            initial={{
              y: 100,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 100,
              opacity: 0,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed -bottom-4 left-0 right-0 bg-[var(--surface)] border-t border-[var(--outline-variant)] px-4 pt-1 pb-[calc(env(safe-area-inset-bottom,16px)+1.5rem)] flex justify-around z-40 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] motion-gpu"
            style={{ willChange: "transform" }}
          >
            <BotNav
              glyph={Home}
              text="Home"
              isSelected={page === "home"}
              onSelect={() => goto("home")}
            />
            <BotNav
              glyph={Fingerprint}
              text="Info"
              isSelected={page === "readme"}
              onSelect={() => goto("readme")}
            />
            <BotNav
              glyph={BookText}
              text="Blog"
              isSelected={page === "blog"}
              onSelect={() => goto("blog")}
            />
            <BotNav
              glyph={Camera}
              text="Lens"
              isSelected={page === "lens"}
              onSelect={() => goto("lens")}
            />
            <BotNav
              glyph={SettingsIcon}
              text="More"
              onSelect={() => setSettingsOpen(true)}
              layoutId="settings-expansion"
            />
          </motion.nav>
        )}
      </AnimatePresence>
      {/* the sidebar for when you wanna see the machine, kinda pointless but nice to have
      <AnimatePresence>
        {hwOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHwOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--surface)] z-[60] p-8 overflow-y-auto border-l border-[var(--outline)]"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold">Hardware</h2>
                <button
                  onClick={() => setHwOpen(false)}
                  className="p-2 hover:bg-[var(--surface-variant)] rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-8">
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">
                    Core System
                  </h3>
                  <div className="grid gap-4">
                    {HARDWARE_SPECS.core.map((spec) => (
                      <div
                        key={spec.label}
                        className="p-4 bg-[var(--surface-variant)] rounded-3xl"
                      >
                        <div className="text-xs opacity-50 mb-1">
                          {spec.label}
                        </div>
                        <div className="font-bold">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">
                    processors
                  </h3>
                  <div className="grid gap-4">
                    {HARDWARE_SPECS.processing.map((spec) => (
                      <div
                        key={spec.label}
                        className="p-4 bg-[var(--surface-variant)] rounded-3xl"
                      >
                        <div className="text-xs opacity-50 mb-1">
                          {spec.label}
                        </div>
                        <div className="font-bold">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">
                    Storage and memory
                  </h3>
                  <div className="grid gap-4">
                    {HARDWARE_SPECS.mem.map((spec) => (
                      <div
                        key={spec.label}
                        className="p-4 bg-[var(--surface-variant)] rounded-3xl"
                      >
                        <div className="text-xs opacity-50 mb-1">
                          {spec.label}
                        </div>
                        <div className="font-bold">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      */}
      {/* ^ dead now, rip! :( */}

      {/* the big settings modal */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md motion-gpu"
              style={{ willChange: "opacity" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
                transition: {
                  duration: 0.2
                }
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[var(--surface)] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[var(--outline-variant)] motion-gpu settings-modal-content"
              style={{ willChange: "transform, opacity" }}
            >
              <div
                className="flex flex-col h-full overflow-hidden"
              >
                <div
                  className="flex justify-between items-center p-6 md:p-8 border-b border-[var(--outline-variant)] bg-[var(--surface)] sticky top-0 z-10"
                >
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <SettingsIcon size={24} className="text-[var(--primary)]" />
                    <span>Settings</span>
                  </h2>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="p-2 hover:bg-[var(--surface-variant)] rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div
                  className="p-6 md:p-10 space-y-10 overflow-y-auto scrollbar-hide"
                >
                  {/*making things look pretty pretty */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Palette size={20} className="text-[var(--primary)]" />
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">
                        appearance
                      </h3>
                    </div>
                    <div className="relative grid grid-cols-3 gap-2 p-1.5 bg-[var(--surface-variant)] rounded-full overflow-hidden">
                      {/* sliding capsule - now using animate to stay locked to modal physics */}
                      <motion.div
                        initial={false}
                        animate={{
                          left:
                            settings.mode === "light"
                              ? "6px"
                              : settings.mode === "dark"
                                ? "33.33%"
                                : "66.66%",
                          marginLeft:
                            settings.mode === "dark"
                              ? "4px"
                              : settings.mode === "system"
                                ? "2px"
                                : "0px",
                        }}
                        transition={settingsSpring}
                        className="absolute inset-y-1.5 bg-[var(--primary)] rounded-full shadow-lg z-0"
                        style={{
                          width: "calc(33.33% - 8px)",
                        }}
                      />
                      {(["light", "dark", "system"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => updateSettings({ mode: m })}
                          className={cn(
                            "relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-full transition-colors capitalize text-sm font-bold",
                            settings.mode === m
                              ? "text-[var(--on-primary)]"
                              : "text-[var(--on-surface-variant)] hover:bg-black/5",
                          )}
                        >
                          {m === "light" && <Sun size={16} />}
                          {m === "dark" && <Moon size={16} />}
                          {m === "system" && <Monitor size={16} />}
                          <span className="hidden sm:inline">{m}</span>
                        </button>
                      ))}
                    </div>

                    <motion.div
                      initial={false}
                      animate={{
                        opacity: (settings.mode === "dark" || settings.mode === "system") ? 1 : 0,
                        height: (settings.mode === "dark" || settings.mode === "system") ? "auto" : 0,
                        marginBottom: (settings.mode === "dark" || settings.mode === "system") ? 24 : 0,
                      }}
                      transition={settingsSpring}
                      className="overflow-hidden"
                    >
                      <label
                        className={cn(
                          "flex items-center border-6 border-[var(--outline-variant)] justify-between p-5 transition-all text-left cursor-pointer rounded-[2rem]",
                          settings.amoledMode
                            ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                            : "bg-[var(--surface-variant)] hover:bg-[var(--outline-variant)]/30",
                        )}
                      >
                        <div>
                          <div className="font-bold">AMOLED Mode</div>
                          <div className="text-xs opacity-60 font-medium">
                            pure black backgrounds for OLED screens
                          </div>
                        </div>
                        <Switch
                          checked={settings.amoledMode}
                          onChange={(checked) =>
                            updateSettings({ amoledMode: checked })
                          }
                        />
                      </label>
                    </motion.div>

                    <div className="space-y-4">
                      <div className="text-sm font-bold text-[var(--on-surface)]">
                        Accent Color
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {(
                          [
                            "orange",
                            "blue",
                            "green",
                            "red",
                            "purple",
                            "custom",
                          ] as const
                        ).map((c) => (
                          <button
                            key={c}
                            onClick={() => updateSettings({ accent: c })}
                            className={cn(
                              "group relative w-12 h-12 rounded-[1rem] overflow-hidden transition-all duration-300 shadow-sm",
                              settings.accent === c
                                ? "ring-2 ring-[var(--on-surface)] ring-offset-4 ring-offset-[var(--surface)] scale-110"
                                : "hover:scale-105",
                            )}
                          >
                            {c === "custom" ? (
                              <div className="absolute inset-0 bg-[var(--surface-variant)] flex items-center justify-center">
                                <Pipette
                                  size={20}
                                  className="text-[var(--on-surface-variant)]"
                                />
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex">
                                <div
                                  className={cn(
                                    "w-1/2 h-full",
                                    c === "orange" && "bg-orange-500",
                                    c === "blue" && "bg-blue-500",
                                    c === "green" && "bg-emerald-500",
                                    c === "red" && "bg-rose-500",
                                    c === "purple" && "bg-purple-500",
                                  )}
                                />
                                <div className="w-1/2 h-full flex flex-col">
                                  <div
                                    className={cn(
                                      "h-1/2 w-full",
                                      c === "orange" && "bg-orange-300",
                                      c === "blue" && "bg-blue-300",
                                      c === "green" && "bg-emerald-300",
                                      c === "red" && "bg-rose-300",
                                      c === "purple" && "bg-purple-300",
                                    )}
                                  />
                                  <div
                                    className={cn(
                                      "h-1/2 w-full",
                                      c === "orange" && "bg-orange-700",
                                      c === "blue" && "bg-blue-700",
                                      c === "green" && "bg-emerald-700",
                                      c === "red" && "bg-rose-700",
                                      c === "purple" && "bg-purple-700",
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                            {settings.accent === c && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                <div className="bg-white rounded-full p-0.5 shadow-md">
                                  <Check
                                    size={14}
                                    className="text-black"
                                    strokeWidth={3}
                                  />
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      {settings.accent === "custom" && (
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="pt-2 space-y-3"
                        >
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-50 px-1">
                            <span>Hue Shift</span>
                          </div>
                          <Slider
                            value={settings.hue}
                            onChange={(v) => updateSettings({ hue: v })}
                            min={0}
                            max={360}
                            step={1}
                            size="s"
                            leadingIcon={<Pipette size={16} />}
                            format={(v) => `${v.toFixed(0)}°`}
                          />

                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-50 px-1 pt-2">
                            <span>Saturation</span>
                          </div>
                          <Slider
                            value={settings.saturation}
                            onChange={(v) => updateSettings({ saturation: v })}
                            min={0}
                            max={100}
                            step={1}
                            size="s"
                            leadingIcon={<Layers size={16} />}
                            format={(v) => `${v.toFixed(0)}%`}
                          />
                        </motion.div>
                      )}
                    </div>
                  </section>
                  {/* little toggles to change stuff */}
                  {[
                    {
                      title: "Customization",
                      icon: (
                        <Palette size={20} className="text-[var(--primary)]" />
                      ),
                      items: [
                        {
                          key: "helloAnimation",
                          label: "Hello Animation",
                          desc: "fluent language-cycling virex header",
                        },
                        {
                          key: "brutalistMode",
                          label: "Brutalist Mode",
                          desc: "sharp edges only",
                        },
                        {
                          key: "developerFont",
                          label: "Developer Font",
                          desc: "use JetBrains Mono!",
                        },
                        {
                          key: "focusMode",
                          label: "Focus Mode",
                          desc: "a minimal zen layout",
                        },
                        {
                          key: "highHz",
                          label: "120Hz Animations",
                          desc: "high-refresh snappiness",
                        },/*
                        {
                          key: "disableAnimations",
                          label: "Disable Animations",
                          desc: "attempts to disable (most) animations.",
                        },*/
                        // this is disabled for now because its indev!
                        {
                          key: "bentoTilt",
                          label: "3D Bento Tilt",
                          desc: "cursor tracking parallax tilt, WILL NOT WORK AS EXPECTED with certain cards.",
                        },
                      ],
                    },
                    {
                      title: "Sidebar",
                      icon: (
                        <Layers size={20} className="text-[var(--primary)]" />
                      ),
                      items: [
                        {
                          key: "sidebarFlipped",
                          label: "Flip Sidebar",
                          desc: "changes desktop sidebar orientation to the right",
                        },
                        {
                          key: "floatingSidebar",
                          label: "Floating Sidebar",
                          desc: "undock the sidebar with rounded corners",
                        },
                        {
                          key: "profileContainer",
                          label: "Profile Container",
                          desc: "show the ring and background around your profile",
                        },
                        {
                          key: "forceDesktop",
                          label: "Force Desktop",
                          desc: "prevent switching to mobile layout on small screens",
                        },
                      ],
                    },
                    {
                      title: "Debug",
                      icon: <Cpu size={20} className="text-[var(--primary)]" />,
                      items: [
                        {
                          key: "debugMode",
                          label: "Debug Mode",
                          desc: "show layout grid and build info",
                        },
                      ],
                    },
                  ].map((section) => (
                    <section key={section.title} className="space-y-6">
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <h3 className="text-md font-black tracking-[0.2em] text-[var(--on-surface-variant)]">
                          {section.title}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-1">
                        {section.items.map((tweak, index, array) => (
                          <label
                            key={tweak.key}
                            className={cn(
                              "flex items-center border-6 border-[var(--outline-variant)] justify-between p-5 transition-all text-left cursor-pointer",
                              array.length === 1
                                ? "rounded-[2rem]"
                                : index === 0
                                  ? "rounded-t-[2rem] rounded-b-[0.9rem]"
                                  : index === array.length - 1
                                    ? "rounded-b-[2rem] rounded-t-[0.9rem]"
                                    : "rounded-[0.9rem]",
                              settings[tweak.key as keyof typeof settings]
                                ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                                : "bg-[var(--surface-variant)] hover:bg-[var(--outline-variant)]/30",
                            )}
                          >
                            <div>
                              <div className="font-bold">{tweak.label}</div>
                              <div className="text-xs opacity-60 font-medium">
                                {tweak.desc}
                              </div>
                            </div>
                            <Switch
                              checked={
                                settings[
                                tweak.key as keyof typeof settings
                                ] as boolean
                              }
                              onChange={(checked) => {
                                if (tweak.key === "debugMode" && checked) {
                                  setShowDebugConfirm(true);
                                } else {
                                  updateSettings({ [tweak.key]: checked });
                                }
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    </section>
                  ))}

                  {/* sharing & backup config */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Fingerprint size={20} className="text-[var(--primary)]" />
                      <h3 className="text-md font-black tracking-[0.2em] text-[var(--on-surface-variant)]">
                        Share & Backup Config
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* export sharing */}
                      <button
                        onClick={() => {
                          try {
                            const str = btoa(JSON.stringify(settings));
                            const shareUrl = `${window.location.origin}/?theme=${str}`;
                            navigator.clipboard.writeText(shareUrl);
                            setToast("sharing link copied to clipboard!");
                          } catch (e) {
                            setToast("Failed to generate sharing link! :(");
                          }
                        }}
                        className="flex items-center justify-between border-6 border-[var(--outline-variant)] p-5 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all text-left rounded-[1.5rem] group cursor-pointer"
                      >
                        <div>
                          <div className="font-bold">Copy theme link</div>
                          <div className="text-xs opacity-60 font-medium">
                            share your config as a link
                          </div>
                        </div>
                        <ExternalLink
                          size={20}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </button>

                      {/* export json file */}
                      <button
                        onClick={() => {
                          try {
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
                            const downloadAnchor = document.createElement('a');
                            downloadAnchor.setAttribute("href", dataStr);
                            downloadAnchor.setAttribute("download", "virex-settings.json");
                            document.body.appendChild(downloadAnchor);
                            downloadAnchor.click();
                            downloadAnchor.remove();
                            setToast("backup downloaded!");
                          } catch (e) {
                            setToast("failed to download backup. :(");
                          }
                        }}
                        className="flex items-center justify-between border-6 border-[var(--outline-variant)] p-5 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all text-left rounded-[1.5rem] group cursor-pointer"
                      >
                        <div>
                          <div className="font-bold">Export config file</div>
                          <div className="text-xs opacity-60 font-medium">
                            download backup as JSON
                          </div>
                        </div>
                        <Download
                          size={20}
                          className="group-hover:translate-y-0.5 transition-transform"
                        />
                      </button>
                    </div>

                    {/* import config */}
                    <div className="border-6 border-[var(--outline-variant)] bg-[var(--surface-variant)] p-5 rounded-[1.5rem] space-y-4">
                      <div className="font-bold text-sm">Importing Your Config</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste your sharing link or code here..."
                          className="flex-1 bg-[var(--surface)] text-[var(--on-surface)] border border-[var(--outline-variant)] rounded-xl px-4 py-2 text-[13px] font-display-bold focus:outline-none focus:border-[var(--primary)]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = e.currentTarget.value.trim();
                              if (!val) return;
                              try {
                                let capsule = val;
                                // handle full URL if link is pastedd
                                if (val.includes("theme=")) {
                                  const urlParams = new URLSearchParams(val.substring(val.indexOf("?")));
                                  capsule = urlParams.get("theme") || val;
                                }
                                const decoded = JSON.parse(atob(capsule));
                                const validatedSettings: Partial<typeof settings> = {};
                                const keys: (keyof typeof settings)[] = [
                                  "mode", "accent", "hue", "saturation", "sidebarFlipped",
                                  "sidebarCollapsed", "profileContainer", "brutalistMode",
                                  "developerFont", "focusMode", "floatingSidebar", "debugMode",
                                  "helloAnimation", "disableAnimations", "highHz", "amoledMode",
                                  "bentoTilt"
                                ];
                                for (const k of keys) {
                                  if (decoded[k] !== undefined) {
                                    (validatedSettings as any)[k] = decoded[k];
                                  }
                                }
                                updateSettings(validatedSettings);
                                setToast("config has been loaded!");
                                e.currentTarget.value = "";
                              } catch (err) {
                                setToast("non valid capsule code or link :(");
                              }
                            }
                          }}
                        />
                        <label className="bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer">
                          Upload File
                          <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const decoded = JSON.parse(event.target?.result as string);
                                  const validatedSettings: Partial<typeof settings> = {};
                                  const keys: (keyof typeof settings)[] = [
                                    "mode", "accent", "hue", "saturation", "sidebarFlipped",
                                    "sidebarCollapsed", "profileContainer", "brutalistMode",
                                    "developerFont", "focusMode", "floatingSidebar", "debugMode",
                                    "helloAnimation", "disableAnimations", "highHz", "amoledMode",
                                    "bentoTilt"
                                  ];
                                  for (const k of keys) {
                                    if (decoded[k] !== undefined) {
                                      (validatedSettings as any)[k] = decoded[k];
                                    }
                                  }
                                  updateSettings(validatedSettings);
                                  setToast("settings have been restored from backup!");
                                } catch (err) {
                                  setToast("non valid backup JSON file :(");
                                }
                              };
                              reader.readAsText(file);
                            }}
                          />
                        </label>
                      </div>
                      <div className="text-[13px] opacity-50 font-medium">
                        Press Enter to apply pasted sharing link. Restoring settings updates your theme *immediately*.
                      </div>
                    </div>
                  </section>

                  {/* boring ver info stuff */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Terminal size={20} className="text-[var(--primary)]" />
                      <h3 className="text-md font-black tracking-[0.2em] text-[var(--on-surface-variant)]">
                        Other Info
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        goto("changelog");
                      }}
                      className="w-full flex items-center justify-between border-6 border-[var(--outline-variant)]  p-5 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all text-left rounded-[1.5rem] group"
                    >
                      <div>
                        <div className="font-bold">View changelog</div>
                        <div className="text-xs opacity-60 font-medium">
                          See what's new in v2026.05.25
                        </div>                    </div>
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDebugConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDebugConfirm(false)}
              className="absolute inset-0 backdrop-blur-[10px]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[var(--surface)] border-6 border-[var(--primary)] p-8 rounded-[2.5rem] shadow-2xl space-y-8"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-[var(--primary-container)] rounded-2xl flex items-center justify-center">
                  <Cpu size={32} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-3xl font-display font-black tracking-tight leading-tight">
                  wait, actually?
                </h3>
                <p className="text-xl opacity-70 font-medium leading-relaxed">
                  debug mode displays the layout grid and internal build
                  metrics. it's messy, distracting, and probably not what you
                  want!
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    updateSettings({ debugMode: true });
                    setShowDebugConfirm(false);
                  }}
                  className="m3-button-filled w-full h-16 !rounded-2xl text-[16px] font-black"
                >
                  yes, i want to turn it on!
                </button>
                <button
                  onClick={() => setShowDebugConfirm(false)}
                  className="m3-button-tonal w-full h-16 !rounded-2xl text-[15px] font-bold opacity-60 hover:opacity-100"
                >
                  nevermind, I'm scared.
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
