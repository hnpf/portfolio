// @ts-ignore
// @ts-nocheck
import React, { memo } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "motion/react";
import {
  Settings as SettingsIcon,
  X,
  Palette,
  Sun,
  Moon,
  Monitor,
  Pipette,
  Check,
  Layers,
  Cpu,
  Fingerprint,
  ExternalLink,
  Download,
  Terminal,
  ChevronRight,
  ChevronLeft,
  Bug,
  Activity,
  Link as LinkIcon,
  Compass,
} from "lucide-react";
import { cn } from "../constants";
import Switch from "./M3Switch";
import Slider from "./M3Slider";

export const SettingsDialog = memo(({ 
  settingsOpen, 
  setSettingsOpen, 
  settings, 
  updateSettings, 
  setShowDebugConfirm, 
  setShowRefreshConfirm,
  setToast, 
  goto,
  is_mobile,
  onReportBug,
  onOpenKnownIssuess,
}: any) => {
  const settingsSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8
  };

  const [defaultY, setDefaultY] = React.useState(() => is_mobile ? window.innerHeight * 0.12 : 0);
  const y = useMotionValue(is_mobile ? window.innerHeight : 0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);

  const dragStartY = React.useRef(0);
  const dragStartModalY = React.useRef(0);
  const isDraggingSheet = React.useRef(false);
  const touchTimes = React.useRef<{ y: number; t: number }[]>([]);

  React.useEffect(() => {
    if (!is_mobile) return;
    const handleResize = () => {
      setDefaultY(window.innerHeight * 0.12);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [is_mobile]);

  React.useEffect(() => {
    if (settingsOpen && is_mobile) {
      y.set(window.innerHeight);
    }
  }, [settingsOpen, is_mobile, y]);

  const handleClose = React.useCallback(() => {
    setSettingsOpen(false);
  }, [setSettingsOpen]);

  React.useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl || !is_mobile) return;

    const handleTouchStartRaw = (e: TouchEvent) => {
      const touch = e.touches[0];
      dragStartY.current = touch.clientY;
      dragStartModalY.current = y.get();
      
      const isInsideScroll = scrollRef.current && scrollRef.current.contains(e.target as Node);
      const scrollTop = scrollRef.current ? scrollRef.current.scrollTop : 0;
      
      if (!isInsideScroll) {
        isDraggingSheet.current = true;
      } else if (dragStartModalY.current > 0) {
        isDraggingSheet.current = true;
      } else if (scrollTop <= 0) {
        isDraggingSheet.current = false;
      } else {
        isDraggingSheet.current = false;
      }
      
      touchTimes.current = [{ y: touch.clientY, t: Date.now() }];
    };

    const handleTouchMoveRaw = (e: TouchEvent) => {
      const touch = e.touches[0];
      const clientY = touch.clientY;
      const deltaY = clientY - dragStartY.current;
      const scrollTop = scrollRef.current ? scrollRef.current.scrollTop : 0;
      
      touchTimes.current.push({ y: clientY, t: Date.now() });
      if (touchTimes.current.length > 5) {
        touchTimes.current.shift();
      }

      if (dragStartModalY.current === 0 && scrollTop <= 0 && !isDraggingSheet.current) {
        if (deltaY > 0) {
          isDraggingSheet.current = true;
          dragStartY.current = clientY;
          dragStartModalY.current = 0;
        }
      }

      if (!isDraggingSheet.current && scrollTop <= 0 && deltaY > 0) {
        isDraggingSheet.current = true;
        dragStartY.current = clientY;
        dragStartModalY.current = 0;
      }

      if (isDraggingSheet.current) {
        if (e.cancelable) {
          e.preventDefault();
        }
        
        let newY = dragStartModalY.current + deltaY;
        if (newY < 0) {
          newY = newY * 0.2; // pull resistance
        }
        y.set(newY);
      }
    };

    const handleTouchEndRaw = (e: TouchEvent) => {
      if (!isDraggingSheet.current) return;
      isDraggingSheet.current = false;

      const currentY = y.get();
      let velocityY = 0;
      if (touchTimes.current.length >= 2) {
        const first = touchTimes.current[0];
        const last = touchTimes.current[touchTimes.current.length - 1];
        const dt = last.t - first.t;
        if (dt > 0) {
          velocityY = ((last.y - first.y) / dt) * 1000;
        }
      }

      if (velocityY > 600 || currentY > defaultY + 150) {
        handleClose();
      } else if (velocityY < -400) {
        animate(y, 0, {
          type: "spring",
          damping: 30,
          stiffness: 300,
          mass: 0.8
        });
      } else {
        const targetY = currentY < defaultY * 0.5 ? 0 : defaultY;
        animate(y, targetY, {
          type: "spring",
          damping: 30,
          stiffness: 300,
          mass: 0.8
        });
      }
    };

    modalEl.addEventListener("touchstart", handleTouchStartRaw, { passive: false });
    modalEl.addEventListener("touchmove", handleTouchMoveRaw, { passive: false });
    modalEl.addEventListener("touchend", handleTouchEndRaw, { passive: false });

    return () => {
      modalEl.removeEventListener("touchstart", handleTouchStartRaw);
      modalEl.removeEventListener("touchmove", handleTouchMoveRaw);
      modalEl.removeEventListener("touchend", handleTouchEndRaw);
    };
  }, [is_mobile, y, defaultY, handleClose, settingsOpen]);

  return (
    <AnimatePresence>
      {settingsOpen && (
        <div className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden",
          is_mobile ? "p-0 bg-black/20" : "p-4"
        )}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md motion-gpu"
            style={{ willChange: "opacity" }}
          />
          <motion.div
            ref={modalRef}
            initial={is_mobile ? { y: window.innerHeight } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={is_mobile ? { y: defaultY } : { opacity: 1, scale: 1, y: 0 }}
            exit={is_mobile ? { 
              y: window.innerHeight,
              transition: { type: "spring", damping: 30, stiffness: 300, mass: 0.8 }
            } : {
              opacity: 0,
              scale: 0.9,
              y: 20,
              transition: {
                duration: 0.2
              }
            }}
            transition={is_mobile ? { type: "spring", damping: 30, stiffness: 350, mass: 0.8 } : settingsSpring}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col motion-gpu settings-modal-content",
              is_mobile 
                ? "w-full h-[100dvh] max-w-none max-h-none rounded-t-[2rem] border-none" 
                : "w-full max-w-xl rounded-[2rem] md:rounded-[2.5rem] max-h-[90vh] border border-[var(--outline-variant)]"
            )}
            style={is_mobile ? { 
              y,
              willChange: "transform",
              touchAction: "pan-y"
            } : { 
              willChange: "transform, opacity"
            }}
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* drag handle for mobile */}
              {is_mobile && (
                <div 
                  className="w-full flex justify-center pt-3 pb-1 shrink-0 bg-[var(--surface)]"
                >
                  <div className="w-12 h-1.5 bg-[var(--outline-variant)] rounded-full opacity-40" />
                </div>
              )}

              <div 
                className={cn(
                  "flex justify-between items-center border-b border-[var(--outline-variant)] bg-[var(--surface)] sticky top-0 z-10 shrink-0",
                  is_mobile ? "p-4" : "p-6 md:p-8"
                )}
              >
                <div className="flex items-center gap-4">
                  <SettingsIcon size={24} className="text-[var(--primary)]" />
                  <h2 className={cn(
                    "font-bold flex items-center gap-3",
                    is_mobile ? "text-xl" : "text-2xl"
                  )}>
                    {!is_mobile && <span>Settings</span>}
                    {is_mobile && <span className="text-2xl font-expressive italic font-black uppercase tracking-tight">Settings</span>}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[var(--surface-variant)] rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div 
                ref={scrollRef}
                className={cn(
                  "space-y-10 overflow-y-auto scrollbar-hide flex-1",
                  is_mobile ? "p-6 pb-32" : "p-6 md:p-10"
                )}
              >
                

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Palette size={20} className="text-[var(--primary)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">
                      appearance
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {(["light", "dark", "system"] as const).map((m) => {
                      const isActive = settings.mode === m;
                      let roundedClass = "";
                      if (m === "light") {
                        roundedClass = "rounded-l-[2rem] rounded-r-[0.6rem]";
                      } else if (m === "dark") {
                        roundedClass = "rounded-[0.6rem]";
                      } else {
                        roundedClass = "rounded-r-[2rem] rounded-l-[0.6rem]";
                      }
                      
                      return (
                        <motion.button
                          key={m}
                          onClick={() => updateSettings({ mode: m })}
                          whileTap={{ scale: 0.94 }}
                          animate={{
                            scale: isActive ? 1.04 : 1,
                            borderColor: isActive ? "var(--primary)" : "var(--outline-variant)",
                            color: isActive ? "var(--on-primary)" : "var(--on-surface-variant)"
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }}
                          className={cn(
                            "relative overflow-hidden flex items-center justify-center gap-2.5 py-4 border-[3px] transition-colors capitalize text-sm font-black tracking-wide cursor-pointer select-none",
                            roundedClass,
                            !isActive && "bg-[var(--surface-variant)]/30 hover:bg-black/5"
                          )}
                          style={{
                            willChange: "transform, border-color"
                          }}
                        >
                          <motion.div
                            initial={false}
                            animate={{
                              opacity: isActive ? 1 : 0,
                              scale: isActive ? 1 : 0.85
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 22
                            }}
                            className={cn(
                              "absolute -inset-[3px] bg-[var(--primary)] -z-10",
                              roundedClass
                            )}
                          />
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            {m === "light" && <Sun size={18} />}
                            {m === "dark" && <Moon size={18} />}
                            {m === "system" && <Monitor size={18} />}
                            <span className="font-bold">{m}</span>
                          </div>
                        </motion.button>
                      );
                    })}
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
                          onChange={(v: number) => updateSettings({ hue: v })}
                          min={0}
                          max={360}
                          step={1}
                          size="s"
                          leadingIcon={<Pipette size={16} />}
                          format={(v: number) => `${v.toFixed(0)}°`}
                        />

                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-50 px-1 pt-2">
                          <span>Saturation</span>
                        </div>
                        <Slider
                          value={settings.saturation}
                          onChange={(v: number) => updateSettings({ saturation: v })}
                          min={0}
                          max={100}
                          step={1}
                          size="s"
                          leadingIcon={<Layers size={16} />}
                          format={(v: number) => `${v.toFixed(0)}%`}
                        />
                      </motion.div>
                    )}
                  </div>
                </section>
                {is_mobile && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Compass size={20} className="text-[var(--primary)]" />
                      <h3 className="text-[14] font-black tracking-[0.2em] text-[var(--on-surface-variant)]">
                        Extra navigation
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          handleClose();
                          goto("now");
                        }}
                        className="flex flex-col items-center justify-center gap-3 border-6 border-[var(--outline-variant)] py-6 bg-[var(--surface-variant)]/50 hover:bg-[var(--primary-container)] hover:border-[var(--primary)]/30 text-[var(--on-surface-variant)] hover:text-[var(--on-primary-container)] transition-all rounded-[1.5rem] group"
                      >
                        <Activity size={28} className="text-[var(--primary)] group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm tracking-wide">Now</span>
                      </button>
                      <button
                        onClick={() => {
                          handleClose();
                          goto("dash");
                        }}
                        className="flex flex-col items-center justify-center gap-3 border-6 border-[var(--outline-variant)] py-6 bg-[var(--surface-variant)]/50 hover:bg-[var(--primary-container)] hover:border-[var(--primary)]/30 text-[var(--on-surface-variant)] hover:text-[var(--on-primary-container)] transition-all rounded-[1.5rem] group"
                      >
                        <LinkIcon size={28} className="text-[var(--primary)] group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm tracking-wide">Short</span>
                      </button>
                    </div>
                  </section>
                )}
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
                      {
                        key: "disableAnimations",
                        label: "Disable Animations",
                        desc: "turn off motion & transition effects",
                      },
                      {
                        key: "bentoTilt",
                        label: "3D Bento Tilt",
                        desc: "cursor tracking parallax tilt effect",
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
                      {
                        key: "infoFullscreen",
                        label: "Info Page Fullscreen",
                        desc: "hide navigation bars when on the info page",
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
                              } else if (tweak.key === "disableAnimations") {
                                updateSettings({ disableAnimations: checked });
                                setShowRefreshConfirm(true);
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

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Fingerprint size={20} className="text-[var(--primary)]" />
                    <h3 className="text-md font-black tracking-[0.2em] text-[var(--on-surface-variant)]">
                      Share & Backup Config
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                              if (val.includes("theme=")) {
                                const urlParams = new URLSearchParams(val.substring(val.indexOf("?")));
                                capsule = urlParams.get("theme") || val;
                              }
                              const decoded = JSON.parse(atob(capsule));
                              const validatedSettings: Partial<typeof settings> = {};
                              const keys: (keyof typeof settings)[] = [
                                "mode", "accent", "hue", "saturation", "sidebarFlipped",
                                "sidebarCollapsed", "profileContainer", "brutalistMode",
                                "developerFont", "focusMode", "floatingSidebar", "infoFullscreen", "debugMode",
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
                                  "developerFont", "focusMode", "floatingSidebar", "infoFullscreen", "debugMode",
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

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Terminal size={20} className="text-[var(--primary)]" />
                    <h3 className="text-md font-black tracking-[0.2em] text-[var(--on-surface-variant)]">
                      Other Info
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      handleClose();
                      goto("changelog");
                    }}
                    className="w-full flex items-center justify-between border-6 border-[var(--outline-variant)]  p-5 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all text-left rounded-[1.5rem] group"
                  >
                    <div>
                      <div className="font-bold">View changelog</div>
                      <div className="text-xs opacity-60 font-medium">
                        See what's new in 2026.07.14-stable
                      </div>                    </div>
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Bug size={20} className="text-[var(--primary)]" />
                    <h3 className="text-md font-black tracking-[0.2em] text-[var(--on-surface-variant)]">
                      Feedback
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        handleClose();
                        onReportBug();
                      }}
                      className="w-full flex items-center justify-between border-6 border-[var(--outline-variant)] p-5 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all text-left rounded-[1.5rem] group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold">Report a bug</div>
                        <div className="text-xs opacity-60 font-medium">
                          Help us make virex.lol better by reporting issues
                        </div>
                      </div>
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                    <button
                      onClick={() => {
                        handleClose();
                        onOpenKnownIssuess();
                      }}
                      className="w-full flex items-center justify-between border-6 border-[var(--outline-variant)] p-5 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all text-left rounded-[1.5rem] group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold">Known issues</div>
                        <div className="text-xs opacity-60 font-medium">
                          View bugs that have already been reported
                        </div>
                      </div>
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
