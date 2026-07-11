// @ts-nocheck
import React, { useState, useEffect, memo } from "react";
import { motion } from "motion/react";
import { Activity, MapPin, History, Target, SquareTerminal, Code2, Archive, Github, MessageSquare, Home } from "lucide-react";
import { GitHubCalendar } from 'react-github-calendar';
import { cn, TECH_STACK } from "../constants";
import { useTheme } from "../ThemeContext";
import { Card } from "../components/Card";
import { BounceButton, TechChip } from "../components/TechStack";

const Badge = ({ icon: Icon, children, className }: any) => (
  <span className={cn(
    "px-6 py-3 bg-[var(--surface-variant)]/40 text-[var(--on-surface-variant)] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border-4 border-[var(--outline-variant)]/40 italic",
    className
  )}>
    {Icon && <Icon size={16} />}
    {children}
  </span>
);

const BullshitMatrix = ({ onBack, setPage, is_mobile }: { onBack: () => void; setPage: (p: string) => void, is_mobile: boolean }) => {
  const letters = "virex".split("");
  const [flickering, setFlick] = useState<number[]>([]);
  const [swoopDone, setSwoopDone] = useState(false);
  const { settings, actualTheme } = useTheme();

  const glass_class = is_mobile ? "" : "backdrop-blur-md";

  useEffect(() => {
    if (is_mobile) {
      console.log("you're on mobile, now cutting non-useful blurs, filters and anims to save battery");
    }
  }, [is_mobile]);

  useEffect(() => {
    if (!swoopDone || is_mobile) return;
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
      className={cn(
        "flex flex-col selection:bg-[var(--primary)] selection:text-[var(--on-primary)] transition-all duration-300",
        settings.infoFullscreen 
          ? "fixed inset-0 z-[500] bg-[var(--surface)] overflow-y-auto custom-scrollbar overflow-x-hidden" 
          : "relative w-full overflow-x-hidden z-10"
      )}
    >
      {/* bg effecting stuff*/}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={cn("absolute inset-0 z-[-1]", !is_mobile && !settings.disableAnimations)}>
          {/* bigg star */}
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={(!is_mobile && !settings.disableAnimations) ? {
              scale: [1, 1.05, 1],
              opacity: [0.12, 0.16, 0.12]
            } : {}}
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
              initial={{ opacity: 0.08 }}
              animate={(!is_mobile && !settings.disableAnimations) ? {
                scale: [1, 1.1, 1],
                opacity: [0.08, 0.12, 0.08]
              } : {}}
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
          <div className="flex gap-1 md:gap-6 mb-8 flex-wrap justify-center">
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
                  "text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] tracking-[-0.05em] transition-all duration-150 select-none font-expressive-bold font-black italic",
                  flickering.includes(i) ? "text-[var(--primary)] scale-105" : "text-[var(--on-surface)]"
                )}
              >
                {flickering.includes(i) ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : char}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mt-12 md:mt-4"
          >
            <Badge icon={Activity} className="bg-[var(--primary-container)]/60 text-[var(--on-primary-container)] border-[var(--primary)]/20 shadow-lg">
              Researching
            </Badge>
            <Badge icon={MapPin}>Nederland</Badge>
            <Badge>He / They</Badge>
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
            <span className="text-2xl font-black tracking-[0.4em] text-[var(--primary)] italic">Bio</span>
            <div className="-ml-2 h-px w-12 bg-[var(--primary)] opacity-30" />
          </div>
          <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-[1.05] max-w-4xl mx-auto italic">
            <br /> Semi <span className="text-[var(--primary)]">full-stack developer</span> and <span className="text-[var(--primary)]">Cybersecurity nerd</span> building things at virex.lol. <br /> <br /> Obsessed with minimal software bases, archival, clean user experiences, and aesthetics.
          </h2>
          <p className="text-xl md:text-3xl opacity-60 font-medium max-w-4xl mx-auto leading-relaxed italic">
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
            innerClassName={cn("px-6 py-8 md:p-12 bg-[var(--surface-variant)]/60 rounded-[3.5rem] border-6 border-[var(--outline-variant)]/40 relative overflow-hidden group hover:border-[var(--primary)] transition-colors duration-200", glass_class)}
          >
            <h3 className="text-2xl md:text-4xl font-display font-black mb-8 md:mb-10 tracking-tight transition-colors group-hover:text-[var(--primary)] flex items-center gap-3 italic">
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
            innerClassName={cn("px-8 py-10 bg-gradient-to-br from-[var(--primary-container)]/90 to-[var(--primary)]/10 text-[var(--on-primary-container)] rounded-[3.5rem] border-6 border-[var(--primary)]/30 flex flex-col justify-between gap-8 group hover:border-[var(--primary)] transition-colors duration-200 relative overflow-hidden", glass_class)}
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <Target className="text-[var(--primary)] w-8 h-8" strokeWidth={2.5} />
                <span className="text-xl font-black tracking-[0.4em] opacity-60 italic uppercase">A Mission...</span>
              </div>
              <p className="text-2xl md:text-4xl leading-[0.95] tracking-tighter font-expressive font-black italic text-balance">
                "good code can be used as a form of <span className="text-[var(--primary)]">protest.</span>"
              </p>
            </div>
            <p className="text-sm md:text-xl opacity-80 font-bold leading-tight italic relative z-10">
              the internet is proprietary, and we can fight back! using code as a form of expression and resistance, to create a more open and free digital world.
            </p>
            <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
              <Target size={180} />
            </div>
          </Card>

          {/* terminal specs card idk */}
          <Card noDefaultStyles
            delay={1.3}
            whileHover={{ y: -12, scale: 1.01 }}
            className="col-span-2 md:col-span-12 lg:col-span-6"
            innerClassName="bg-[#0a0a0a] text-white/90 px-5 py-8 md:p-10 rounded-[3.5rem] border-6 border-white/5 font-mono relative group overflow-hidden hover:border-[var(--primary)] transition-colors duration-200 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 transition-opacity group-hover:opacity-100 mb-4">
              <SquareTerminal className="text-[var(--primary)] w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase italic">virex@virex</span>
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
                  <span className="text-[var(--primary)] font-bold min-w-[60px] md:min-w-[80px] italic">{s.k}</span>
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
            innerClassName={cn("px-6 py-8 md:p-12 bg-[var(--surface-variant)]/60 rounded-[3.5rem] border-6 border-[var(--outline-variant)]/40 hover:border-[var(--primary)] transition-colors duration-200 group flex flex-col gap-8", glass_class)}
          >
            <div className="flex items-center gap-3">
              <Code2 className="text-[var(--primary)] w-5 h-5 md:w-6 md:h-6" />
              <h4 className="text-xl md:text-2xl font-display font-black transition-colors group-hover:text-[var(--primary)] italic">The stack..</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-4">
                <div className="text-[13px] font-black tracking-[0.4em] opacity-40 uppercase italic">Web Stack</div>
                <div className="flex flex-wrap gap-2.5">
                  {TECH_STACK.web.sort().map(t => (
                    <TechChip key={t} label={t} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[13px] font-black tracking-[0.4em] opacity-40 uppercase italic">Technical Stack</div>
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
            innerClassName={cn("px-6 py-8 md:p-12 bg-[var(--surface-variant)]/60 rounded-[3.5rem] border-6 border-[var(--outline-variant)]/40 border-dashed flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-[var(--primary)]/50 transition-colors duration-200", glass_class)}
          >
            <div className="space-y-4 text-center md:text-left">
              <h4 className="text-2xl md:text-3xl font-display font-black tracking-tight flex items-center justify-center md:justify-start gap-3 transition-colors group-hover:text-[var(--primary)] italic">
                <Archive className="text-[var(--primary)] w-6 h-6 md:w-8 md:h-8" /> Archival
              </h4>
              <p className="text-xl opacity-70 font-medium max-w-2xl group-hover:opacity-100 transition-opacity italic">
                just my instinct. I love collecting legacy software, old documentation, and keeping backups of everything of interest that I find.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
              <div className="text-[13px] font-black tracking-[0.4em] opacity-40 mb-2 uppercase italic">Fingerprint!</div>
              <div className="text-[11px] md:text-sm font-mono opacity-100 select-all p-4 bg-[var(--surface-variant)] rounded-2xl border-2 border-[var(--outline-variant)]/40 leading-relaxed text-center md:text-right group-hover:border-[var(--primary)]/30 transition-all">
                1D4D 0BDB 03DA F87B 2151 <br />
                6AE8 A109 C97B 2AD5 C2E6
              </div>
            </div>
          </Card>

          {/* contrib gh heatmap */}
          <Card noDefaultStyles
            delay={1.6}
            whileHover={{ y: -8, scale: 1.01 }}
            className="col-span-2 md:col-span-12"
            innerClassName={cn("px-6 py-8 md:p-12 bg-[var(--surface-variant)]/60 rounded-[3.5rem] border-6 border-[var(--outline-variant)]/40 flex flex-col gap-8 group hover:border-[var(--primary)]/50 transition-colors duration-200 overflow-hidden", glass_class)}
          >
            <div className="flex items-center gap-3">
              <Github className="text-[var(--primary)] w-6 h-6 md:w-8 md:h-8" />
              <h4 className="text-2xl md:text-3xl font-display font-black tracking-tight flex items-center transition-colors group-hover:text-[var(--primary)] italic">
                GitHub activity
              </h4>
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="min-w-[750px] font-display text-sm opacity-80">
                <GitHubCalendar 
                  username="hnpf" 
                  colorScheme={actualTheme}
                  theme={{
                    light: [
                      'rgba(0, 0, 0, 0.05)', 
                      'color-mix(in oklch, var(--primary) 30%, transparent)', 
                      'color-mix(in oklch, var(--primary) 55%, transparent)', 
                      'color-mix(in oklch, var(--primary) 80%, transparent)', 
                      'var(--primary)'
                    ],
                    dark: [
                      'rgba(255, 255, 255, 0.05)', 
                      'color-mix(in oklch, var(--primary) 30%, transparent)', 
                      'color-mix(in oklch, var(--primary) 55%, transparent)', 
                      'color-mix(in oklch, var(--primary) 80%, transparent)', 
                      'var(--primary)'
                    ]
                  }}
                  labels={{
                    totalCount: '{{count}} contributions in the last year',
                  }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* foooootters */}
        <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
          <div className="h-1 w-20 bg-[var(--primary)] rounded-full opacity-40" />
          <div className="flex flex-wrap justify-center gap-10">
            <BounceButton
              icon={Github}
              label="GitHub"
              url="https://github.com/hnpf"
              className="m3-button-tonal ring-8 ring-[var(--outline-variant)]/30 w-64 h-16 rounded-3xl font-black tracking-[0.2em] text-sm active:scale-95 uppercase italic"
            />
            <BounceButton
              icon={MessageSquare}
              label="Discord"
              url="https://conspiracy.rip/discord"
              className="m3-button-tonal ring-8 ring-[var(--outline-variant)]/30 w-64 h-16 rounded-3xl font-black tracking-[0.2em] text-sm active:scale-95 uppercase italic"
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              y: -4,
              borderRadius: "40px",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              mass: 1
            }}
            onClick={onBack}
            className="m3-button-filled ring-6 ring-[var(--primary)]/10 !bg-[var(--on-surface)] !text-[var(--surface)] h-18 px-12 rounded-[28px] tracking-[0.12em] text-2xl font-expressive font-sans font-black flex items-center gap-4 transition-colors "
          >
            <Home size={28} />
            Go home
          </motion.button>
          
          {/* spacer for when not fullscreen */}
          {!settings.infoFullscreen && (
             <div className="h-16" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ReadmePage = memo(({ setPage, is_mobile }: { setPage: (page: string) => void, is_mobile: boolean }) => {
  return (
    <BullshitMatrix
      onBack={() => setPage("home")}
      setPage={setPage}
      is_mobile={is_mobile}
    />
  );
});
