// @ts-nocheck

import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ChevronRight, ExternalLink, ArrowUpRight, Loader2, Download, Terminal, ArrowDown, Tag, Folder } from "lucide-react";
import { cn, PROJECTS, BLOG_POSTS } from "../constants";
import { useTheme } from "../ThemeContext";
import { Card } from "../components/Card";
import WavyProgress from "../components/WavyProgress";

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
        alt="ad"
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

const HelloVirex = ({ tickIndex }: { tickIndex: number }) => {
  const words = [
    "virex",
    "вирекс",
    "维雷克斯",
    "비렉스",
    "ڤيركس",
  ];
  const widx = tickIndex % words.length;
  const { settings } = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLHeadingElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const checkSize = () => {
      if (!containerRef.current || !textRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.scrollWidth;
      if (textWidth > 0 && containerWidth > 0) {
        if (textWidth > containerWidth) {
          const fitScale = Math.min(1, Math.max(0.35, containerWidth / textWidth));
          setScale(fitScale);
        } else {
          setScale(1);
        }
      }
    };

    checkSize();
    const timer = setTimeout(checkSize, 50);

    const observer = new ResizeObserver(checkSize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [widx]);

  return (
    <div ref={containerRef} className="w-full min-h-[5.5rem] sm:min-h-[8.5rem] md:min-h-[15rem] flex items-center overflow-visible py-4">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[widx]}
          ref={textRef}
          initial={{
            opacity: 0,
            y: 40,
            rotate: -2,
            scale: scale,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 0,
            scale: scale,
          }}
          exit={{
            opacity: 0,
            y: -40,
            rotate: 2,
            scale: scale,
          }}
          transition={{
            type: settings.disableAnimations ? "tween" : "spring",
            duration: settings.disableAnimations ? 0 : undefined,
            stiffness: settings.highHz ? 600 : 400,
            damping: settings.highHz ? 25 : 22,
            mass: 1,
          }}
          style={{ transformOrigin: "left center" }}
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-expressive italic tracking-[-0.08em] leading-[0.85] whitespace-nowrap flex items-baseline origin-left py-2"
        >
          {words[widx]}
          <motion.span className="text-[var(--primary)] select-none relative z-[60] inline-block ml-[0.05em]">
            .
          </motion.span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

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
    <div className="flex flex-col h-full justify-between relative isolate">
      <div>
        <div className="flex flex-col -space-y-2">
          <span className="text-7xl md:text-8xl font-expressive-bold italic font-black tracking-[-0.08em] mb-3 leading-none text-[var(--primary)]">
            {year}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-5xl font-display font-black italic tracking-tighter">
              {pct.toFixed(2)}
            </span>
            <span className="text-xl font-expressive-bold italic opacity-40">%</span>
          </div>
        </div>
      </div>

      <div className="py-4 pt-7">
        <WavyProgress
          percent={pct}
          className="text-[var(--primary)]"
          thickness={6}
          height={16}
        />
      </div>

      <div className="mt-4 flex items-center justify-between relative z-10  border-[var(--outline-variant)]/20">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-display font-black italic">{days_left}</span>
          <span className="text-[15px] ml-1 font-black font-sans italic font-display opacity-30 tracking-widest">days left</span>
        </div>
        <div className="text-[13px] font-black font-display font-sans opacity-40
          tracking-widest">
          {now.toLocaleTimeString().toLowerCase()}
        </div>
      </div>
    </div>
  );
};

const RoleTicker = ({ settings, tickIndex }: { settings: any; tickIndex: number }) => {
  const roles = [
    "independent software developer",
    "linux enthusiast",
    "cybersecurity student"
  ];
  const idx = tickIndex % roles.length;

  return (
    <div className="h-12 flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={roles[idx]}
          initial={{
            opacity: 0,
            y: 40,
            rotate: -2,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 0,
          }}
          exit={{
            opacity: 0,
            y: -40,
            rotate: 2,
          }}
          transition={{
            type: settings.disableAnimations ? "tween" : "spring",
            duration: settings.disableAnimations ? 0 : undefined,
            stiffness: settings.highHz ? 600 : 400,
            damping: settings.highHz ? 25 : 22,
            mass: 1,
          }}
          className="text-xl md:text-3xl capitalize font-black text-[var(--on-surface-variant)] leading-none tracking-[0.1em] mt-4"
        >
          {roles[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const WeatherWidget = () => {
  return (
    <div className="flex flex-col h-full justify-between relative isolate overflow-hidden">
      <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
        <motion.div
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Activity size={260} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-8xl md:text-9xl font-expressive-bold italic font-black tracking-[-0.08em] leading-[0.7]">
            74
          </span>
          <span className="text-4xl md:text-5xl font-expressive-bold italic opacity-30 ml-1">°</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col -space-y-1 relative z-10">
        <span className="text-4xl md:text-6xl font-expressive-bold italic font-black tracking-[-0.05em] uppercase leading-none text-[var(--primary)]">
          Partly
        </span>
        <span className="text-3xl md:text-5xl font-display font-black italic uppercase tracking-[-0.02em] leading-none opacity-60">
          Cloudy
        </span>
      </div>

      <div className="mt-8 flex items-center gap-6 relative z-10 pt-6 border-t-4 border-[var(--outline-variant)]/20">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-display font-black italic">42</span>
          <span className="text-[15px] font-black ml-1 italic font-display font-sans opacity-30 tracking-widest">hum</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-display font-black italic">12</span>
          <span className="text-[15px] font-black ml-1 italic font-display font-sans opacity-30 tracking-widest">mph</span>
        </div>
      </div>
    </div>
  );
};

const AncBar = ({ setPage, settings }: { setPage: (page: string, postId: string | null) => void, settings: any }) => {
  const latestPost = BLOG_POSTS[0];
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (settings.disableAnimations) {
      setShouldAnimate(true);
      return;
    }
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 800); // 0.8s delay
    return () => clearTimeout(timer);
  }, [settings.disableAnimations]);

  const initialValues = settings.disableAnimations ? false : { opacity: 0, y: 15 };

  if (!latestPost) return null;

  return (
    <motion.div
      initial={initialValues}
      animate={
        shouldAnimate || settings.disableAnimations
          ? { opacity: 1, y: 0 }
          : initialValues
      }
      transition={settings.disableAnimations ? { duration: 0 } : {
        type: "spring",
        stiffness: settings.highHz ? 800 : 700,
        damping: settings.highHz ? 30 : 28,
        mass: 0.8,
      }}
      whileHover={settings.disableAnimations ? {} : {
        y: settings.bentoTilt ? -6 : -10,
        scale: settings.bentoTilt ? 1.015 : 1.005,
        transition: { type: "spring", stiffness: 400, damping: 15 }
      }}
      whileTap={settings.disableAnimations ? {} : { scale: 0.98 }}
      onClick={() => setPage("blog", latestPost.id)}
      className="flex flex-col sm:flex-row items-stretch justify-between gap-4 p-5 sm:p-6 border-6 border-[var(--outline-variant)] rounded-[2.5rem] bg-[var(--surface-variant)] hover:border-[var(--primary)] hover:shadow-2xl transition-[border-color,box-shadow] duration-200 relative overflow-hidden group cursor-pointer select-none"
    >
      {/* left: badges, title, + snippet filling desktop wid */}
      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="px-3 py-1 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-full text-[11px] font-expressive italic font-bold tracking-widest border border-[var(--primary)]/30 shadow-xs flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            New Post!
          </span>
          {latestPost.category && (
            <span className="px-2.5 py-1 bg-[var(--surface)]/80 text-[var(--on-surface-variant)] rounded-full text-[11px] font-expressive italic font-bold border border-[var(--outline-variant)]/30 shadow-2xs flex items-center gap-1.5 shrink-0 tracking-wider">
              <Tag size={11} className="text-[var(--primary)] shrink-0 opacity-80" />
              <span className="capitalize">{latestPost.category}</span>
            </span>
          )}
          {latestPost.readTime && (
            <span className="text-[11px] font-display font-black opacity-50 shrink-0 hidden md:inline-block ml-1">
              • {latestPost.readTime}
            </span>
          )}
        </div>

        <div className="min-w-0 w-full space-y-1">
          <h4 className="text-[18px] sm:text-[20px] md:text-[22px] font-display font-black italic text-[var(--on-surface-variant)] group-hover:text-[var(--primary)] transition-colors duration-200 truncate min-w-0 w-full leading-snug">
            {latestPost.title}
          </h4>
          <p className="text-[13px] sm:text-[14px] opacity-70 font-sans line-clamp-1 sm:line-clamp-2 min-w-0 w-full leading-relaxed max-w-4xl">
            {latestPost.snippet}
          </p>
        </div>
      </div>

      {/* date top right; post link bottom right */}
      <div className="shrink-0 flex sm:flex-col justify-between items-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--outline-variant)]/20 sm:border-none">
        <span className="text-[12px] font-display font-black opacity-60 shrink-0 bg-[var(--surface)]/50 px-3 py-0.5 rounded-full border border-[var(--outline-variant)]/20 self-start sm:self-end">
          {latestPost.date}
        </span>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--on-primary)] transition-all duration-300 border border-[var(--primary)]/20 shadow-xs font-expressive-bold italic font-black text-[12px] uppercase tracking-wider shrink-0 self-end">
          <span>Read Post</span>
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export const HomePage = memo(({ setPage, settings, onOpenGuestbook }: any) => {
  const [latestEntry, setLatestEntry] = useState<any>(null);
  const [tickIndex, setTickIndex] = useState(0);

  useEffect(() => {
    const ticker = setInterval(() => {
      setTickIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    fetch("/api/guestbook")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLatestEntry(data[0]);
        }
      })
      .catch(err => console.error("Error loading guestbook preview:", err));
  }, []);

  const IS_JUNE = new Date().getMonth() === 5;
  return (
    <div className="space-y-16 max-w-6xl mx-auto px-4 md:px-0 relative">
      <header className="page-header space-y-12">
        {settings.helloAnimation ? (
          <HelloVirex tickIndex={tickIndex} />
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
            className="page-title !text-6xl sm:!text-8xl md:!text-9xl lg:!text-[12rem] xl:!text-[14rem] leading-[0.7] text-balance flex items-baseline font-expressive-bold italic tracking-[-0.08em]"
          >
            virex
            <motion.span 
              animate={IS_JUNE ? { 
                color: ["#E40303", "#FF8C00", "#FFED00", "#008026", "#24408E", "#732982", "#E40303"] 
              } : {}}
              transition={IS_JUNE ? { duration: 10, repeat: Infinity, ease: "linear" } : {}}
              className="text-[var(--primary)] select-none relative z-[60] inline-block ml-[-0.05em]"
            >
              .
            </motion.span>
          </motion.h1>
        )}
        <RoleTicker settings={settings} tickIndex={tickIndex} />
        <FshBtn />
      </header>

      <section id="works-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
        <Card
          delay={0.7}
          className="md:col-span-2 lg:col-span-1 xl:col-span-2"
          innerClassName="bg-[var(--primary)] text-[var(--on-primary)] border-none p-12 md:p-16 flex flex-col justify-between min-h-[500px] overflow-hidden group"
        >
          <div className="relative isolate">
            <div className="absolute -top-20 -left-10 text-[20rem] font-expressive-bold italic opacity-10 pointer-events-none select-none tracking-tighter leading-none group-hover:scale-110 transition-transform duration-700">
              "
            </div>
            <div className="flex flex-col gap-4 relative z-10">
              <h2 className="text-6xl md:text-[7rem] opacity-90 italic font-expressive-bold leading-[0.75] tracking-[-0.08em]">
                software should <br /> be readable.
              </h2>
              <h2 className="text-3xl md:text-6xl italic font-expressive-bold md:ml-15 ml-3 leading-none tracking-[-0.05em] mt-8 opacity-40">
                period.
              </h2>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-12 relative z-10">
            <p className="text-xl md:text-2xl opacity-80 font-display font-black italic max-w-xl leading-snug">
              i like simple, non-stressful setups and code that doesn't need a manual :)
            </p>
            <motion.button
              whileHover={{
                scale: 1.02,
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
              className="m3-button-filled ring-6 ring-[var(--on-primary-container)] !transition-none bg-white text-black text-[20px] font-expressive-bold italic font-black tracking-tight h-18 px-12 rounded-[24px] flex items-center gap-3 group shrink-0"
            >
              explore more!
              <ChevronRight
                size={28}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </div>
        </Card>

        {/* anc bar / active site indicator (act 2 gate) */}
        <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
          <AncBar setPage={setPage} settings={settings} />
        </div>

        <Card
          delay={0.6}
          className="flex-1"
          innerClassName="flex flex-col border-6 border-[var(--outline-variant)] justify-center p-8 md:p-12 min-h-[450px] hover:border-[var(--primary)] group overflow-hidden relative items-start" /*no transitiopn-all cat*/
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={120} className="-rotate-10" />
          </div>
          <div className="relative isolate flex flex-col -space-y-3 md:-space-y-4">
            <span className="text-2xl md:text-3xl font-display font-black italic uppercase tracking-tight opacity-40">I don't</span>
            <span className="text-6xl mt-2 md:text-[6.5rem] font-expressive-bold italic font-black tracking-[-0.08em] leading-none uppercase">Ship</span>
            <span className="text-4xl mt-2 md:text-5xl font-display font-black italic uppercase tracking-[-0.02em] mt-2">Things</span>
            <span className="text-xl mt-2 md:text-2xl font-display font-black italic uppercase tracking-[0.1em] opacity-40 mt-4">I wouldn't</span>
            <span className="text-6xl mt-2 md:text-[6.5rem] font-expressive-bold italic font-black tracking-[-0.08em] leading-none uppercase text-[var(--primary)]">Use .</span>
          </div>
        </Card>

        <div className="flex flex-col gap-8">
          <Card
            delay={0.6}
            className="flex-1"
            innerClassName="border-6 border-[var(--outline-variant)]/40 flex flex-col justify-center p-10 min-h-[250px] hover:border-[var(--primary)] transition-colors"
          >
            <YearProg />
          </Card>
          <Card
            delay={0.7}
            className="flex-1"
            innerClassName="border-6 border-[var(--outline-variant)]/40 p-10 min-h-[200px] hover:border-[var(--primary)] transition-colors"
          >
            <WeatherWidget />
          </Card>
        </div>

        <div id="projects-section" className="md:col-span-2 lg:col-span-1 xl:col-span-2 mt-16 mb-8 flex flex-col items-center gap-2">
          <div className="text-[15px] font-black font-display font-sans italic tracking-[0.2em] opacity-30">index / select works</div>
          <h3 className="text-4xl md:text-6xl font-expressive-bold italic font-black tracking-[-0.05em] uppercase text-center">
            Projects & Research
          </h3>
          <div className="h-1 w-24 bg-[var(--primary)] mt-4" />
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
                  <h4 className="text-[40px] font-bold font-black tracking-[0.04em] leading-tight italic">
                    {project.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {project.tags.map((tag) => (
                      <span key={tag} className="m3-chip uppercase italic tracking-widest font-black text-[10px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="opacity-70 mt-13 mb-8 text-xl font-medium italic leading-snug">
                  {project.description}
                </p>
              </div>
              {project.link.startsWith("/") ? (
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(project.link.replace("/", ""))}
                  className="inline-flex items-center gap-2 text-[var(--primary)] font-black tracking-widest text-[16px] w-fit group uppercase italic"
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
                  className="inline-flex items-center gap-2 text-[var(--primary)] font-black italic tracking-widest text-[17px] group uppercase"
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

      {/* guestbook */}
      <section className="mt-20 flex flex-col items-center gap-6">
        <div className="text-[15px] font-black font-display font-sans italic tracking-[0.2em] opacity-30">community / more feedback</div>
        <h3 className="text-4xl md:text-6xl font-expressive-bold italic font-black tracking-[-0.05em] uppercase text-center">
          The Guestbook
        </h3>
        <div className="h-1 w-24 bg-[var(--primary)] mt-2 mb-4" />
        <Card
          delay={0.8}
          onClick={onOpenGuestbook}
          className="w-full max-w-4xl cursor-pointer"
          innerClassName="border-6 border-[var(--outline-variant)]/40 p-8 md:p-12 hover:border-[var(--primary)] hover:shadow-2xl transition-[border-color,box-shadow] duration-150 flex flex-col md:flex-row justify-between items-center gap-6 w-full"
        >
          <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
            <h4 className="text-3xl font-display font-black italic">Leave a note!</h4>
            <p className="opacity-70 text-lg max-w-xl font-medium leading-relaxed">
              Drop by and leave your thoughts, a greeting, or tell me what you think of this site. Click to view all entries and sign!
            </p>
            {latestEntry && (
              <div className="inline-flex flex-col sm:flex-row sm:items-center gap-2 mt-2 p-3 bg-[var(--surface-variant)]/40 rounded-2xl border border-[var(--outline-variant)]/20 text-sm max-w-md w-full text-left">
                <span className="font-black text-[var(--primary)] shrink-0">@{latestEntry.name}:</span>
                <span className="opacity-85 truncate flex-1 font-medium italic">"{latestEntry.message}"</span>
              </div>
            )}
          </div>
          <div className="w-full md:w-16 h-14 md:h-16 rounded-2xl md:rounded-3xl shrink-0 flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--on-primary)] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--primary)]/20">
            <span className="md:hidden font-expressive text-sm tracking-wider pt-0.5">Open guestbook</span>
            <ChevronRight size={24} className="md:w-8 md:h-8" />
          </div>
        </Card>
      </section>
    </div>
  );
});
