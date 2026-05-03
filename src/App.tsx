import React, { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
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

// --- building blocks ---

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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, rotate: -2 }}
      onClick={_on_click}
      disabled={loading}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
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

const TechChip = ({ label }: { label: string }) => {
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

const is_apr = () => {
  const now = new Date();
  // 3 is april. 1 is 1st.
  return now.getMonth() === 3 && now.getDate() === 1;
};

const FshBtn = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState(0);
  const active = is_apr();

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

  if (!is_apr()) return null;

  return (
    <Card className="fsh-ad flex flex-col items-center justify-center p-4 !bg-yellow-400">
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
  if (!is_apr()) return null;
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
            filter: "blur(10px)",
          }}
          transition={{
            type: "spring",
            stiffness: settings.highHz ? 500 : 300,
            damping: settings.highHz ? 25 : 20,
            duration: settings.highHz ? 0.3 : 0.5,
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
  }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const { settings } = useTheme();

    const rd = isFirst
      ? "rounded-t-[28px] rounded-b-[15px]"
      : isLast
        ? "rounded-t-[15px] rounded-b-[28px]"
        : "rounded-[15px]";

    return (
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex items-center justify-center gap-4 px-4 group relative sidebar-item outline-none cursor-pointer text-[16px] font-black motion-gpu ring-6 ring-[var(--outline-variant)]/30 isolate overflow-hidden",
          isFloating ? "py-3" : "py-4",
          rd,
          isMini && "px-0 w-14 mx-auto",
        )}
        style={{ transform: "translateZ(0)" }}
      >
        {/* flicker fix ehehe */}
        <motion.div
          className={cn("absolute inset-0 -z-20", rd)}
          initial={false}
          animate={{
            backgroundColor: "var(--surface-variant)",
            opacity: isSelected ? 0 : isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* moved out of AnimatePresence for a smoother shared transition */}
        {isSelected && (
          <motion.div
            layoutId="sidebar-pill-active"
            className={cn(
              "absolute inset-0 bg-[var(--primary-container)] -z-10 active-pill",
              rd,
            )}
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              mass: 0.4,
            }}
          />
        )}

        <motion.div
          animate={{
            scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
            rotate: isSelected ? -5 : isHovered ? -2 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{
            color: isSelected
              ? "var(--on-primary-container)"
              : isHovered
                ? "var(--primary)"
                : "var(--on-surface-variant)",
          }}
          className="relative z-10 shrink-0 transition-colors duration-200"
        >
          <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} fill="none" />
        </motion.div>

        {!isMini && (
          <motion.span
            animate={{
              x: isSelected ? 2 : 0,
              opacity: 1,
            }}
            style={{
              color: isSelected ? "var(--on-primary-container)" : "inherit",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="font-display font-black tracking-tighter text-lg relative z-10 transition-colors duration-200"
          >
            {text}
          </motion.span>
        )}

        {isMini && (
          <div className="absolute left-full ml-6 px-3 py-1.5 bg-[var(--on-surface)] text-[var(--surface)] text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-50 whitespace-nowrap shadow-xl">
            {text}
          </div>
        )}
      </motion.button>
    );
  },
);

const SideAction = ({ children, onClick, isMini, tooltip, className }: any) => {
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
};

const BotNav = ({
  glyph: Icon,
  text,
  isSelected,
  onSelect,
  imgSrc,
  wiggle,
}: any) => (
  <button
    onClick={onSelect}
    className={cn(
      "flex flex-col items-center gap-1 flex-1 pt-3 pb-2 transition-all duration-200 relative z-10 bottom-nav-item outline-none",
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
        animate={
          wiggle
            ? {
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
              }
            : { rotate: 0, scale: 1 }
        }
        transition={
          wiggle
            ? {
                duration: 1.2,
                repeat: 1,
                repeatDelay: 0.1,
                ease: "easeInOut",
              }
            : { duration: 0.3 }
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
    <span
      className={cn(
        "text-[11px] font-bold tracking-tight transition-all duration-200",
        isSelected ? "opacity-100" : "opacity-70",
      )}
    >
      {text}
    </span>
  </button>
);

const Card = ({ children, className, delay = 0, onClick }: any) => {
  const [fresh, setFresh] = useState(true);
  const { settings } = useTheme();

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setFresh(false);
      },
      (delay + 0.4) * 1000,
    );

    return () => clearTimeout(timer);
  }, [delay]);

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
      whileHover={{
        y: -5,
        scale: 1.008,
      }}
      whileTap={{ scale: 0.99 }}
      transition={{
        duration: settings.disableAnimations ? 0 : settings.highHz ? 0.15 : 0.2,
        delay: fresh ? delay : 0,
        ease: [0.33, 1, 0.68, 1],
        type: "spring",
        stiffness: settings.highHz ? 800 : 500,
        damping: settings.highHz ? 40 : 30,
      }}
      onClick={onClick}
      className={cn(
        "m3-card readme-card motion-gpu cursor-default transition-none",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

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
        .catch(console.error);
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
        <Card delay={0.4} className="md:col-span-2 lg:col-span-1 xl:col-span-2 bg-[var(--primary)] text-[var(--on-primary)] border-none p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
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
        <Card delay={0.5} className="p-10 space-y-6">
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
        <Card delay={0.6} className="p-10 space-y-6 bg-[var(--primary-container)] text-[var(--on-primary-container)]">
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
        <div className="text-right flex flex-col items-end">
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
          thickness={7}
          height={20}
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

const HomePage = ({ setPage, settings }: any) => (
  <div className="space-y-16 max-w-6xl mx-auto px-4 md:px-0 relative">
    <header className="page-header space-y-8">
      {settings.helloAnimation ? (
        <HelloVirex />
      ) : (
        <motion.h1
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="page-title !text-8xl !md:text-[10rem] leading-[0.8] text-balance flex items-baseline"
        >
          virex
          <motion.span className="text-[var(--primary)] select-none relative z-[60] inline-block">
            .
          </motion.span>
        </motion.h1>
      )}
      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="text-2xl md:text-4xl font-display font-black text-[var(--on-surface-variant)] leading-tight max-w-4xl"
      >
        <br></br>i am an independent software dev, linux lover, and problem
        solver.
      </motion.p>
      {/* phase 2 button */}
      <FshBtn />
    </header>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
      <Card
        delay={0.4}
        className="md:col-span-2 lg:col-span-1 xl:col-span-2 bg-[var(--primary)] text-[var(--on-primary)] border-none p-12 md:p-16 flex flex-col justify-between min-h-[400px]"
      >
        <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] tracking-tight">
          "software should be readable, and reliable!"
        </h2>
        <div>
          <p className="text-xl md:text-3xl opacity-90 font-medium max-w-2xl mb-2 ">
            <br></br>i make things that work the way its supposed to.
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
        className="flex flex-col border-6 border-[var(--outline-variant)] justify-between hover:border-[var(--primary)] transition-all"
      >
        <div className="space-y-6">
          <div className="w-16 h-16 bg-[var(--primary-container)] rounded-3xl flex items-center justify-center">
            <Activity size={32} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-3xl font-display font-bold">
            i don't ship things i wouldn't use.
          </h3>
          <p className="text-xl opacity-70 leading-relaxed">
            done right, or not done at all.
          </p>
        </div>
      </Card>
      <Card
        delay={0.6}
        className="bg-[var(--primary-container)] text-[var(--on-primary-container)] flex flex-col justify-center p-10"
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
            className="flex border-6 border-[var(--outline-variant)]/40 flex-col justify-between p-10 min-h-[350px] hover:border-[var(--primary)] transition-all"
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
);

const BlogPage = ({ targetId, navigateTo }: any) => {
  // const [active_cat, setActiveCat] = useState<string | null>(null)
  // later: category filter, never got around to it rip
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
              <span className="px-5 py-2 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
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
              pre: ({ node, ...props }) => <Code {...props} />,
            }}
          >
            {post.content}
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
  const rest = BLOG_POSTS.slice(1);
  return (
    <div className="max-w-6xl mx-auto space-y-20 px-4 md:px-0 pb-32">
      <header className="page-header space-y-8">
        <h2 className="page-title">Blog</h2>
      </header>

      <section>
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="relative rounded-[3.5rem] overflow-hidden bg-[var(--primary-container)] text-[var(--on-primary-container)] border-6 border-[var(--outline-variant)] shadow-2xl group cursor-pointer hover:border-[var(--primary)] transition-all"
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
                <CheckCircle2 size={20} className="text-green-500 shadow-xl" />
              )}
            </div>
            <div className="space-y-4 max-w-4xl">
              <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.95] group-hover:translate-x-2 transition-transform duration-500">
                {featured.title}
              </h3>
              <p className="text-xl md:text-2xl opacity-80 leading-relaxed font-medium text-pretty">
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
                className="m3-button-filled ring-6 ring-[var(--on-primary-container)] !transition-none bg-white text-black text-[20px] font-display font-black tracking-tight h-18 px-12 rounded-[24px] flex items-center gap-3 group/btn"
              >
                read entry
                <motion.span
                  variants={{
                    hover: { x: 5 },
                  }}
                  transition={{ type: "spring", stiffness: 1000, damping: 15 }}
                >
                  <ArrowUpRight
                    size={28}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </motion.span>
              </motion.div>
              <span className="text-sm font-black uppercase tracking-widest opacity-40 italic">
                {featured.readTime}
              </span>
            </div>
          </div>
        </motion.div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {rest.map((p, i) => (
          <Card
            key={p.id}
            delay={i * 0.1}
            className="cursor-pointer group relative overflow-hidden bg-[var(--surface-variant)]/30 hover:bg-[var(--primary-container)]/20 border-6 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] transition-all"
            onClick={() => navigateTo("blog", p.link)}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] px-2 py-1 bg-[var(--primary-container)]/30 rounded-md">
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
                <h4 className="text-3xl font-display font-black leading-tight group-hover:translate-x-1 transition-transform">
                  {p.title}
                </h4>
                <p className="text-lg opacity-60 leading-relaxed line-clamp-2 text-pretty">
                  {p.snippet}
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-[var(--outline-variant)] opacity-40 text-[10px] font-black uppercase tracking-widest">
                <span>Post No. {BLOG_POSTS.length - i - 1}</span>
                <span>{p.readTime}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ChangelogPage = () => {
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {entry.changes.map((group) => (
                  <div key={group.category} className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
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
};

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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "200px", once: true }}
      transition={{
        duration: 0.4,
        delay: i < 6 ? i * 0.05 : 0,
      }}
      style={{ willChange: "transform, opacity" }}
      className={cn(
        "rounded-[2.5rem] overflow-hidden cursor-pointer relative group lens-item bg-[var(--surface-variant)]/20",
        large
          ? "md:col-span-2 md:row-span-2"
          : wide
            ? "md:col-span-2"
            : portrait
              ? "md:row-span-2"
              : "",
      )}
      onClick={onClick}
    >
      <img
        src={photo.url}
        alt={photo.description}
        loading={i < 4 ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "w-full h-full object-cover transition-transform group-hover:scale-110",
          settings.highHz ? "duration-300" : "duration-500",
        )}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-8 z-20">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xl font-bold leading-tight drop-shadow-lg">
            {photo.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

const LensPage = () => {
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
    const on_key = (e: KeyboardEvent) => {
      if (idx === null) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setIdx(null);
    };
    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, [idx]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      <header className="page-header flex flex-row items-end gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <h2 className="page-title">Lens</h2>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[350px] px-4 md:px-0">
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
            className="fixed inset-0 z-[200] flex flex-col bg-[var(--surface)] overflow-hidden"
            onClick={() => setIdx(null)}
          >
            <div className="flex items-start justify-between p-6 md:p-8 z-[210] gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]"></div>
                <div className="text-[var(--on-surface)] font-display font-black text-2xl md:text-4xl tracking-tight">
                  {LENS_PHOTOS[idx].description}
                </div>
              </div>
              <button
                onClick={() => setIdx(null)}
                className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-[var(--surface-variant)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface)] rounded-full flex items-center justify-center transition-all border border-[var(--outline-variant)]/30 active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* content area */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 lg:p-20 overflow-hidden">
              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) prev();
                  else if (info.offset.x < -100) next();
                }}
                className="relative max-w-full max-h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={LENS_PHOTOS[idx].url}
                  className="max-w-full max-h-full object-contain rounded-xl md:rounded-[2rem] shadow-2xl border border-[var(--outline-variant)]/20 pointer-events-none"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>
            </div>
            <div className="p-6 md:p-10 bg-[var(--surface-variant)] border-t border-[var(--outline-variant)]/20 z-[210] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--on-surface-variant)] opacity-40 mb-1">
                    position
                  </span>
                  <div className="flex items-center gap-2 text-[var(--on-surface)] font-mono">
                    <span className="text-[var(--primary)] font-bold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="opacity-20">/</span>
                    <span className="opacity-60">
                      {String(LENS_PHOTOS.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-[var(--outline-variant)]/30" />
              </div>

              {/* desktop nav arrows moved to center */}
              <div className="hidden md:flex items-center gap-2 bg-[var(--surface-variant)]/50 rounded-3xl p-1.5 border border-[var(--outline-variant)]/30">
                <button
                  className="w-12 h-12 bg-[var(--surface)]/50 hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface)] rounded-[1.25rem] flex items-center justify-center transition-all border border-[var(--outline-variant)]/30 active:scale-90"
                  onClick={prev}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="w-12 h-12 bg-[var(--surface)]/50 hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface)] rounded-[1.25rem] flex items-center justify-center transition-all border border-[var(--outline-variant)]/30 active:scale-90"
                  onClick={next}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--on-surface-variant)] opacity-40">
                  use keys or arrows to cycle images
                </span>
              </div>

              <div className="flex md:hidden items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--on-surface-variant)] opacity-40">
                  swipe left/right to cycle images
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrackerPage = () => {
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
            className="relative overflow-hidden group border-6 border-[var(--outline-variant)] bg-[var(--surface)] hover:border-[var(--primary)] transition-all"
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
};

const ReadmePage = ({ setPage }: { setPage: (page: string) => void }) => {
  const [screenshot, setScreenshot] = useState(false);
  const [expanded, setExpanded] = useState<any>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-16 px-4 md:px-0 pb-24">
      {/* this is the big popup modal for when you click a card to read more */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-12"
            >
              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  y: 20,
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto overflow-x-hidden bg-[var(--surface)] rounded-l-[2.5rem] rounded-r-[1rem] relative shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-[var(--outline-variant)]/50 custom-scrollbar overscroll-contain"
              >
                <div className="p-8 md:p-16">
                  <div className="sticky top-0 float-right z-10 -mr-4 -mt-4 md:-mr-8 md:-mt-8">
                    <button
                      onClick={() => setExpanded(null)}
                      className="p-3 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] text-[var(--on-surface-variant)] hover:text-[var(--on-primary-container)] rounded-2xl transition-all shadow-lg backdrop-blur-md"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] px-3 py-1.5 bg-[var(--primary-container)]/30 rounded-lg">
                        {expanded.category}
                      </span>
                      <h3 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-tight pt-2">
                        {expanded.title}
                      </h3>
                    </div>

                    <div className="text-xl md:text-2xl opacity-70 leading-relaxed font-medium text-pretty space-y-6">
                      {expanded.content}
                    </div>

                    <div className="pt-8 flex flex-wrap gap-2 border-t border-[var(--outline-variant)]/30">
                      {expanded.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-[var(--surface-variant)]/50 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="absolute -right-12 -bottom-12 opacity-[0.03] pointer-events-none">
                      {expanded.icon}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <header className="page-header border-b border-[var(--outline-variant)] pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative overflow-visible">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h1 className="page-title flex items-baseline">
              virex
              <motion.span className="text-[var(--primary)] select-none relative z-[60] inline-block">
                .
              </motion.span>
            </h1>
            <div className="group relative mt-4">
              <div className="text-[16px] md:text-[23px] font-display opacity-50 font-black leading-tight tracking-tight">
                PGP fingerprint
              </div>
              <div className="text-[9px] md:text-[11px] font-mono leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity select-all border-l-2 border-[var(--primary)] pl-3">
                1D4D 0BDB 03DA F87B 2151 <br />
                6AE8 A109 C97B 2AD5 C2E6
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <span className="px-3 py-3 md:px-4 md:py-4 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-[20px] text-[10px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-2 border-6 border-[var(--primary)] hover:scale-105 transition-all">
              <Activity className="w-3.5 h-3.5 md:w-[17px] md:h-[17px]" />{" "}
              Researching
            </span>
            <span className="px-3 py-3 md:px-4 md:py-4 bg-[var(--surface-variant)] border-6 border-[var(--outline-variant)] text-[var(--on-surface-variant)] rounded-[20px] text-[10px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-[var(--primary)] hover:scale-105 transition-all">
              <MapPin className="w-3.5 h-3.5 md:w-[17px] md:h-[17px]" />{" "}
              Nederland
            </span>
            <span className="px-3 py-3 md:px-4 md:py-4 bg-[var(--surface-variant)] border-6 border-[var(--outline-variant)] text-[var(--on-surface-variant)] rounded-[20px] text-[10px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-[var(--primary)] hover:scale-105 transition-all">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-[17px] md:h-[17px]" />{" "}
              4+ Years XP
            </span>
            <span className="px-3 py-3 md:px-3 md:py-4 bg-[var(--surface-variant)] border-6 border-[var(--outline-variant)] text-[var(--on-surface-variant)] rounded-[20px] text-[10px] md:text-[13px] font-black tracking-widest flex items-center gap-2 hover:border-[var(--primary)] hover:scale-105 transition-all">
              He/They
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 lg:col-span-8">
          <div className="relative group/terminal h-full">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-[#0d0d0d] rounded-[3.5rem] border-6 border-[var(--outline-variant)]/40 overflow-hidden shadow-2xl h-full min-h-[300px] md:min-h-[400px] flex flex-col font-mono relative hover:border-[var(--primary)]/40 transition-all group"
            >
              {/* term head */}
              <div className="px-8 py-5 bg-white/[0.04] border-b border-white/5 flex items-center relative">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full shadow-inner" />
                </div>

                {/* >_< */}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-sans font-black text-[15px] md:text-[17px] text-white/20 tracking-[0.2em] flex items-center whitespace-nowrap">
                    <SquareTerminal size={22} className="mr-3 opacity-40" />
                    root@marx
                  </span>
                </div>
              </div>

              {/* term body */}
              <div className="p-8 md:p-12 text-[12px] md:text-[15px] leading-relaxed space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[var(--primary)] font-black">❯</span>
                    <span className="text-white/90">
                      ./info_util.sh --verbose
                    </span>
                  </div>

                  <div className="pl-4 md:pl-6 space-y-2 md:space-y-1">
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">
                        OS
                      </span>
                      <span className="text-white/60 text-right sm:text-left">
                        Arch Linux x86_64
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">
                        Shell
                      </span>
                      <span className="text-white/60 text-right sm:text-left">
                        fish 4.5.0
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">
                        Kernel
                      </span>
                      <span className="text-white/60 text-right sm:text-left">
                        Linux 6.19.10-zen1-1-zen
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">
                        CPU
                      </span>
                      <span className="text-white/60 text-right sm:text-left">
                        i5-14600K (20) @ 5.3GHz
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">
                        GPU
                      </span>
                      <span className="text-white/60 text-right sm:text-left">
                        AMD Radeon RX 6800 XT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
            </motion.div>
          </div>
        </div>

        <Card className="md:col-span-12 lg:col-span-4 p-10 flex flex-col justify-between bg-[var(--primary-container)] text-[var(--on-primary-container)] border-6 border-[var(--outline-variant)] relative overflow-hidden group hover:border-[var(--primary)] transition-all">
          <div className="flex flex-col gap-3 relative z-10">
            {/* cute ahh eyebrow label instead of old giant faded text!! :) */}
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <span className="text-[18px] tracking-[0.2em] font-black text-[var(--primary)] opacity-80">
                threat model
              </span>
            </div>

            {/* making the quote the actual hero element */}
            <p className="text-3xl md:text-4xl font-display font-black leading-[1.1] tracking-tight">
              {`"security isnt a feature you just jump on. the only honest way to defend something is to know exactly how it falls apart."`}
            </p>
          </div>

          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Fingerprint size={160} />
          </div>
        </Card>

        <div className="md:col-span-12 grid grid-cols-2 gap-4 md:gap-6">
          <Card className="p-6 md:p-10 space-y-4 md:space-y-8 h-full bg-[var(--surface-variant)]/40 border-6 border-[var(--outline-variant)] shadow-sm flex flex-col justify-between hover:border-[var(--primary)] transition-all">
            <h3 className="text-xl md:text-3xl font-display font-black tracking-tight">
              Web
            </h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2.5">
              {TECH_STACK.web.map((tech) => (
                <TechChip key={tech} label={tech} />
              ))}
            </div>
          </Card>
          <Card className="p-6 md:p-10 space-y-4 md:space-y-8 h-full bg-[var(--surface-variant)]/40 border-6 border-[var(--outline-variant)] shadow-sm flex flex-col justify-between hover:border-[var(--primary)] transition-all">
            <h3 className="text-xl md:text-3xl font-display font-black tracking-tight">
              Tech
            </h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2.5">
              {TECH_STACK.technical.map((tech) => (
                <TechChip key={tech} label={tech} />
              ))}
            </div>
          </Card>
        </div>
        <div className="md:col-span-12">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true }}
            className="relative rounded-[3.5rem] overflow-hidden bg-[var(--primary-container)] text-[var(--on-primary-container)] border-6 border-[var(--outline-variant)] shadow-2xl group p-10 md:p-16 space-y-10 hover:border-[var(--primary)] transition-all"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-md font-bold opacity-60 flex items-center gap-2">
                    <Activity size={14} /> 2021 — present
                  </span>
                </div>
                <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.95] group-hover:translate-x-2 transition-transform duration-500">
                  virex lore
                </h3>
              </div>
              <button
                onClick={() =>
                  setExpanded({
                    category: "evolution",
                    title: "virex lore",
                    icon: <Activity size={320} />,
                    content: (
                      <div className="space-y-6">
                        <p>
                          i started my{" "}
                          <span className="font-bold text-[var(--primary)]">
                            junior software researching
                          </span>{" "}
                          around 2021, focusing on security and scripting.
                        </p>
                        <p>
                          what started as a curiosity for how software worked
                          quickly turned into a huge interest for{" "}
                          <span className="font-bold text-[var(--primary)]">
                            programming
                          </span>{" "}
                          and hardware interest.
                        </p>
                        <p>
                          since then, i became a{" "}
                          <span className="font-bold text-[var(--primary)]">
                            semi-fullstack developer
                          </span>{" "}
                          with a big interest in cybersecurity and programming.
                        </p>
                      </div>
                    ),
                  })
                }
                className="md:hidden w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all group/btn shrink-0"
              >
                <Maximize2
                  size={20}
                  className="group-hover/btn:scale-110 transition-transform"
                />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 border-t border-[var(--on-primary-container)]/10 pt-10">
              {/* copy and paste */}
              <div className="space-y-6 text-xl opacity-80 leading-relaxed font-medium text-pretty">
                <p>
                  i started my{" "}
                  <span className="font-bold text-[var(--primary)]">
                    junior software researching
                  </span>{" "}
                  around 2021, focusing on security and scripting.
                </p>
                <p className="hidden md:block">
                  what started as a curiosity for how software worked quickly
                  turned into a huge interest for{" "}
                  <span className="font-bold text-[var(--primary)]">
                    programming
                  </span>{" "}
                  and hardware interest.
                </p>
              </div>
              <div className="hidden md:block space-y-6 text-xl opacity-80 leading-relaxed font-medium text-pretty">
                <p>
                  since then, i became a{" "}
                  <span className="font-bold text-[var(--primary)]">
                    semi-fullstack developer
                  </span>{" "}
                  with a big interest in cybersecurity and programming.
                </p>
                <p>
                  by the end of 2023, my focus shifted toward{" "}
                  <span className="font-bold text-[var(--primary)]">linux</span>{" "}
                  and{" "}
                  <span className="font-bold text-[var(--primary)]">
                    programming languages
                  </span>
                  .
                </p>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <Activity size={320} />
            </div>
          </motion.div>
        </div>

        <div className="md:col-span-12 grid grid-cols-2 gap-4 md:gap-8">
          <Card className="p-5 md:p-10 space-y-4 md:space-y-8 bg-[var(--surface-variant)]/30 border-6 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary-container)]/10 transition-all">
            <div className="space-y-3 md:space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 md:gap-3"></div>
                <button
                  onClick={() =>
                    setExpanded({
                      category: "mission",
                      title: "my opinion",
                      tags: [
                        "research",
                        "privacy",
                        "performance",
                        "aesthetics",
                      ],
                      content: (
                        <div className="space-y-6">
                          <p>
                            the internet is modernized, and we should fight
                            back!
                          </p>
                          <p>
                            using minimal libraries, durable design, even
                            software that just does what it says and nothing
                            else. good code can be used as a form of protest.
                          </p>
                        </div>
                      ),
                    })
                  }
                  className="md:hidden w-8 h-8 rounded-xl bg-[var(--surface)] border-2 border-[var(--outline-variant)] flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-container)]/20 transition-all group/btn"
                >
                  <Maximize2 size={16} className="group-hover/btn:scale-110" />
                </button>
              </div>
              <div className="space-y-2 md:space-y-4">
                <h4 className="text-lg md:text-3xl font-display font-black leading-tight">
                  my opinion
                </h4>
                <p className="text-xs md:text-lg opacity-60 leading-tight md:leading-relaxed text-pretty font-medium line-clamp-4 md:line-clamp-none">
                  the internet is modernized, and we should fight back! using
                  minimal libraries, durable design, even software that just
                  does what it says and nothing else.
                </p>
              </div>
              <div className="pt-4 hidden md:flex flex-wrap gap-2 border-t border-[var(--outline-variant)]/30">
                {["research", "privacy", "performance", "aesthetics"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--surface-variant)]/50 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </Card>
          <Card className="p-5 md:p-10 space-y-4 md:space-y-8 bg-[var(--surface-variant)]/30 border-6 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary-container)]/10 transition-all">
            <div className="space-y-3 md:space-y-6">
              <div className="flex justify-between items-start">
                <button
                  onClick={() =>
                    setExpanded({
                      category: "library",
                      title: "..and archival!",
                      tags: ["archival", "privacy", "aesthetics"],
                      content: (
                        <div className="space-y-6">
                          <p>preservation by nature.</p>
                          <p>
                            i collect legacy software, old documentation, and i
                            keep backups of everything i find.
                          </p>
                        </div>
                      ),
                    })
                  }
                  className="md:hidden w-8 h-8 rounded-xl bg-[var(--surface)] border-2 border-[var(--outline-variant)] flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-container)]/20 transition-all group/btn"
                >
                  <Maximize2 size={16} className="group-hover/btn:scale-110" />
                </button>
              </div>
              <div className="space-y-2 md:space-y-4">
                <h4 className="text-lg md:text-3xl font-display font-black leading-tight">
                  .. and archival!
                </h4>
                <p className="text-xs md:text-lg opacity-60 leading-tight md:leading-relaxed text-pretty font-medium line-clamp-4 md:line-clamp-none">
                  preservation by nature. i collect legacy software, old
                  documentation, and i keep backups of everything i find.
                </p>
              </div>
              <div className="pt-4 hidden md:flex flex-wrap gap-2 border-t border-[var(--outline-variant)]/30">
                {["archival", "privacy", "aesthetics"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[var(--surface-variant)]/50 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <footer className="pt-24 pb-12 border-t border-[var(--outline-variant)] flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-display font-black tracking-tight">
            you can find me here!
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <BounceButton
            icon={Github}
            label="GitHub"
            url="https://github.com/hnpf"
            className="m3-button-tonal ring-6 ring-[var(--outline-variant)]/40 px-8 h-14 rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-black hover:text-white transition-all shadow-lg"
          />
          <BounceButton
            icon={MessageSquare}
            label="vixen"
            url="https://conspiracy.rip/discord"
            className="m3-button-tonal ring-6 ring-[var(--outline-variant)]/40 px-8 h-14 rounded-[20px] font-black tracking-widest text-md flex items-center gap-3 hover:bg-[#5865F2] hover:text-white transition-all shadow-lg"
          />
          <a
            href="mailto:deprecated@virex.lol"
            className="m3-button-tonal ring-6 ring-[var(--outline-variant)]/40 px-8 h-14 rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-all shadow-lg"
          >
            <Mail size={20} />
            Email
          </a>
        </div>
      </footer>
    </div>
  );
};

// --- main app shell ---

export default function App() {
  const { settings, updateSettings, actualTheme, cycleTheme } = useTheme();
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
    if (!is_apr()) return;

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
    if (is_apr()) return;
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

  const goto = (newPage: string, postId: string | null = null) => {
    const url =
      newPage === "home" ? "/" : postId ? `/blog/${postId}` : `/${newPage}`;
    window.history.pushState({}, "", url);
    React.startTransition(() => {
      setPage(newPage);
      setBlogPostId(postId);
    });
    window.scrollTo(0, 0);
  };

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
        "min-h-screen flex  flex-col lg:flex-row font-sans relative",
        settings.sidebarFlipped && "lg:flex-row-reverse",
        settings.debugMode && "debug-mode",
      )}
    >
      {is_apr() && <div className="fsh-tiled-bg" />}
      {popup && (
        <CursedPopup content={popup} onResolve={() => setPopup(null)} />
      )}

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
              <span>v.1.6.1-stable (v2026.05.02)</span>
            </div>
          </div>
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
      <AnimatePresence mode="popLayout">
        {!settings.focusMode && page !== "no" && (
          <motion.aside
            initial={{
              x: settings.sidebarFlipped ? 400 : -400,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
              width: settings.sidebarCollapsed
                ? settings.floatingSidebar
                  ? 170
                  : 112
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
              x: settings.sidebarFlipped ? 400 : -400,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 28,
              mass: 1,
              restDelta: 0.001,
            }}
            layout
            className={cn(
              "hidden lg:flex flex-col sticky top-0 h-screen z-40 motion-gpu transition-colors duration-300",
            )}
          >
            <motion.div
              layout
              animate={{
                padding: settings.sidebarCollapsed
                  ? "12px"
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
                type: "spring",
                stiffness: 220,
                damping: 28,
                mass: 1,
                restDelta: 0.001,
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
                  "flex items-center gap-4 isolate",
                  settings.sidebarCollapsed
                    ? "justify-center px-0 mb-10 py-6"
                    : show_pfp_container
                      ? "bg-[var(--surface-variant)]/20 ring-6 ring-[var(--outline-variant)]/30 rounded-[2.5rem] px-4 mx-2 mb-10 py-6"
                      : "px-4 mx-2 mb-8 py-2",
                )}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.1,
                    rotate: -2,
                    y: -2
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
                      ? "w-24 h-24 rounded-[32px] shadow-xl"
                      : cn("w-24 h-24 rounded-[32px] shadow-none", !settings.sidebarCollapsed && "-ml-5"),
                  )}
                >
                  <div className="absolute inset-0 rounded-[inherit] overflow-hidden">
                    <div 
                      className={cn(
                        "absolute inset-0 z-20 rounded-[inherit] ring-inset transition-colors duration-250 pointer-events-none",
                        show_pfp_container 
                          ? "ring-6 ring-[var(--outline-variant)] group-hover/pfp:ring-[var(--primary)]" 
                          : "ring-6 ring-[var(--outline-variant)] group-hover/pfp:ring-[var(--primary)]"
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
              {!settings.sidebarCollapsed && (
                <div className="flex items-center gap-3 mb-6 px-4">
                  <div className="h-6 w-1 bg-[var(--primary)] rounded-full" />
                  <h3 className="text-xl font-display font-black tracking-tighter text-[var(--on-surface-variant)]">
                    Pages
                  </h3>
                </div>
              )}
              <nav className="flex-1 flex flex-col gap-5">
                <SideItem
                  isFirst
                  glyph={Home}
                  text="Home"
                  isSelected={page === "home"}
                  onSelect={() => goto("home")}
                  isMini={settings.sidebarCollapsed}
                  isFloating={settings.floatingSidebar}
                />
                <SideItem
                  glyph={Fingerprint}
                  text="Info"
                  isSelected={page === "readme"}
                  onSelect={() => goto("readme")}
                  isMini={settings.sidebarCollapsed}
                  isFloating={settings.floatingSidebar}
                />
                <SideItem
                  glyph={BookText}
                  text="Blog"
                  isSelected={page === "blog"}
                  onSelect={() => goto("blog")}
                  isMini={settings.sidebarCollapsed}
                  isFloating={settings.floatingSidebar}
                />
                <SideItem
                  glyph={Camera}
                  text="Lens"
                  isSelected={page === "lens"}
                  onSelect={() => goto("lens")}
                  isMini={settings.sidebarCollapsed}
                  isFloating={settings.floatingSidebar}
                />
                <SideItem
                  glyph={Activity}
                  text="Tracker"
                  isSelected={page === "tracker"}
                  onSelect={() => goto("tracker")}
                  isMini={settings.sidebarCollapsed}
                  isFloating={settings.floatingSidebar}
                />
                <SideItem
                  isLast
                  glyph={LinkIcon}
                  text="Short"
                  isSelected={page === "dash"}
                  onSelect={() => goto("dash")}
                  isMini={settings.sidebarCollapsed}
                  isFloating={settings.floatingSidebar}
                />
                {/*<SideItem glyph={Terminal} text="Loom" isSelected={page === 'loom'} onSelect={() => goto('loom')} isMini={settings.sidebarCollapsed} isFloating={settings.floatingSidebar} />*/}

                {is_apr() && (
                  <div className="mt-8 pt-4 border-t border-[var(--outline-variant)]/30 space-y-2">
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
              <div className="mt-auto flex flex-col pt-6 pb-4 text-[15px] border-t border-[var(--outline-variant)]">
                <div className="flex flex-col gap-5">
                  <SideItem
                    glyph={SettingsIcon}
                    text="Settings"
                    onSelect={() => setSettingsOpen(true)}
                    isMini={settings.sidebarCollapsed}
                    isFirst
                    isLast
                    isFloating={settings.floatingSidebar}
                  />

                  {!settings.sidebarCollapsed && (
                    <div className="grid grid-cols-2 gap-2">
                      <BounceButton
                        icon={Github}
                        label="GitHub"
                        url="https://github.com/hnpf"
                        className="flex items-center justify-center gap-2 border-6 border-[var(--outline-variant)]/40 py-5 px-4 rounded-[20px] bg-[var(--surface-variant)]/30 hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] text-[var(--on-surface-variant)] transition-all"
                      />
                      <BounceButton
                        icon={MessageSquare}
                        label="Discord"
                        url="https://conspiracy.rip/discord"
                        className="flex items-center justify-center gap-2 border-6 border-[var(--outline-variant)]/40 py-5 px-4 rounded-[20px] bg-[var(--surface-variant)]/30 hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] text-[var(--on-surface-variant)] transition-all"
                      />
                    </div>
                  )}

                  <button
                    onClick={() =>
                      updateSettings({
                        sidebarCollapsed: !settings.sidebarCollapsed,
                      })
                    }
                    className={cn(
                      "flex items-center justify-center py-4 rounded-t-[15px] rounded-b-[28px] bg-[var(--surface-variant)]/30 hover:bg-[var(--surface-variant)] text-[var(--on-surface-variant)] transition-all ring-6 ring-[var(--outline-variant)]/30 outline-none cursor-pointer",
                      settings.sidebarCollapsed ? "w-14 mx-auto" : "w-full",
                    )}
                  >
                    {settings.sidebarCollapsed ? (
                      <ChevronRight size={20} />
                    ) : (
                      <ChevronLeft size={20} />
                    )}
                  </button>
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
      <motion.main className="flex-1 p-6 md:p-12 lg:p-16 pb-40 lg:pb-16 overflow-x-hidden page-container">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page + (blogPostId || "")}
            initial={{
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
            className="motion-gpu"
          >
            {page === "home" && <HomePage setPage={goto} settings={settings} />}
            {page === "blog" && (
              <BlogPage targetId={blogPostId} navigateTo={goto} />
            )}
            {page === "lens" && <LensPage />}
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
        {!settings.focusMode && page !== "no" && (
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
            className="lg:hidden fixed -bottom-4 left-0 right-0 bg-[var(--surface)] border-t border-[var(--outline-variant)] px-4 pt-1 pb-[calc(env(safe-area-inset-bottom,16px)+1.5rem)] flex justify-around z-40 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] motion-gpu"
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
      </AnimatePresence>      */}
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
              initial={{
                scale: 0.92,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.92,
                opacity: 0,
                y: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 38,
                mass: 0.8,
              }}
              className="relative w-full max-w-xl bg-[var(--surface)] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[var(--outline-variant)] motion-gpu settings-modal-content"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex justify-between items-center p-6 md:p-8 border-b border-[var(--outline-variant)] bg-[var(--surface)] sticky top-0 z-10">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <SettingsIcon size={24} className="text-[var(--primary)]" />
                  Settings
                </h2>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 hover:bg-[var(--surface-variant)] rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 md:p-10 space-y-10 overflow-y-auto scrollbar-hide">
                {/*making things look pretty pretty */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Palette size={20} className="text-[var(--primary)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">
                      appearance
                    </h3>
                  </div>
                  <div className="relative grid grid-cols-3 gap-2 p-1.5 bg-[var(--surface-variant)] rounded-full overflow-hidden">
                    {/* sliding shit */}
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        layoutId="active-mode-bg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute inset-y-1.5 bg-[var(--primary)] rounded-full shadow-lg z-0"
                        style={{
                          left:
                            settings.mode === "light"
                              ? "6px"
                              : settings.mode === "dark"
                                ? "33.33%"
                                : "66.66%",
                          width: "calc(33.33% - 8px)",
                          marginLeft:
                            settings.mode === "dark"
                              ? "4px"
                              : settings.mode === "system"
                                ? "2px"
                                : "0px",
                        }}
                      />
                    </AnimatePresence>
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
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
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
                        See what's new in v2026.05.02
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </section>
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
