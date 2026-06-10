// @ts-ignore

import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ChevronRight, ExternalLink, ArrowUpRight, Loader2, Download, Terminal } from "lucide-react";
import { cn, PROJECTS } from "../constants";
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

const HelloVirex = () => {
  const words = [
    "вирекс",
    "virex",
    "维雷克斯",
    "비렉스",
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
    <div className="h-[12rem] md:h-[14rem] flex items-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[widx]}
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
          className="text-7xl md:text-9xl lg:text-[14rem] font-expressive italic tracking-[-0.08em] leading-[0.7] text-balance flex items-baseline"
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

const RoleTicker = ({ settings }: { settings: any }) => {
  const roles = [
    "independent software developer",
    "linux enthusiast",
    "cybersecurity student"
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const ticker = setInterval(() => {
      setIdx((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(ticker);
  }, [roles.length]);

  return (
    <div className="h-12 flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={roles[idx]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
          className="text-xl md:text-3xl font-display font-black text-[var(--on-surface-variant)] leading-none uppercase tracking-[0.1em]"
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

export const HomePage = memo(({ setPage, settings }: any) => {
  const IS_JUNE = new Date().getMonth() === 5;
  return (
    <div className="space-y-16 max-w-6xl mx-auto px-4 md:px-0 relative">
      <header className="page-header space-y-12">
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
            className="page-title !text-9xl !md:text-[14rem] leading-[0.7] text-balance flex items-baseline font-expressive-bold italic tracking-[-0.08em]"
          >
            вирекс
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
        <RoleTicker settings={settings} />
        <FshBtn />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
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
              <h2 className="text-3xl md:text-6xl italic font-expressive-bold ml-15 leading-none tracking-[-0.05em] mt-8 opacity-40">
                period.
              </h2>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-12 relative z-10">
            <p className="text-xl md:text-2xl opacity-80 font-display font-black italic max-w-xl leading-snug">
              I make stuff that works the way it's supposed to. simple, efficient, and intentional.
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

        <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 mt-16 mb-8 flex flex-col items-center gap-2">
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
    </div>
  );
});
