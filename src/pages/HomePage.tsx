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

export const HomePage = memo(({ setPage, settings }: any) => {
  const IS_JUNE = new Date().getMonth() === 5;
  return (
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
            <motion.span 
              animate={IS_JUNE ? { 
                color: ["#E40303", "#FF8C00", "#FFED00", "#008026", "#24408E", "#732982", "#E40303"] 
              } : {}}
              transition={IS_JUNE ? { duration: 10, repeat: Infinity, ease: "linear" } : {}}
              className="text-[var(--primary)] select-none relative z-[60] inline-block"
            >
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
  );
});
