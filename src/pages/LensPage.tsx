// @ts-ignore
import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "../constants";
import { useTheme } from "../ThemeContext";
import { TiltContainer } from "../components/TiltContainer";

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
  
  // dynamic bento logic - more conservative to prevent gaps
  const isHero = i === 0;
  const isWorkstation = photo.description.includes("workstation");
  
  // Controlled variety for better packing
  const isLarge = isHero && !portrait; // Only hero is 2x2
  const isWide = !isLarge && !portrait && (i === 2 || i === 7 || i === 13 || i === 18);
  const isTall = !isLarge && !isWide && (portrait || isWorkstation || i === 5 || i === 11);

  return (
    <TiltContainer
      settings={settings}
      onClick={() => onClick(i)}
      initial={settings.disableAnimations ? false : { opacity: 0, y: 10 }}
      whileInView={settings.disableAnimations ? false : { opacity: 1, y: 0 }}
      viewport={{ margin: "100px", once: true }}
      whileHover={settings.disableAnimations ? undefined : {
        y: -8,
        scale: 1.01,
      }}
      whileTap={settings.disableAnimations ? undefined : { scale: 0.98 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        isLarge
          ? "md:col-span-2 md:row-span-2"
          : isWide
            ? "md:col-span-2"
            : isTall
              ? "md:row-span-2"
              : "",
      )}
      innerClassName="rounded-[2.5rem] cursor-pointer relative group lens-item bg-[var(--surface-variant)]/20 overflow-hidden border-6 border-[var(--outline-variant)] hover:border-[var(--primary)] transition-colors duration-300"
    >
      <div className="absolute inset-0 rounded-[1.8rem] overflow-hidden m-0.5">
        <img
          src={photo.url}
          alt={photo.description}
          loading={i < 2 ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "w-full h-full object-cover transition-transform group-hover:scale-105",
            settings.highHz ? "duration-500" : "duration-700",
          )}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8 z-20">
        <p className="text-white text-lg font-bold leading-tight drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {photo.description}
        </p>
      </div>
    </TiltContainer>
  );
});

export const LensPage = memo(({ viewport }: { viewport: any }) => {
  const [idx, setIdx] = useState<number | null>(null);
  const { settings } = useTheme();

  const handlePhotoClick = React.useCallback((i: number) => {
    setIdx(i);
  }, []);

  const next = React.useCallback((e?: any) => {
    e?.stopPropagation();
    setIdx((prev) => (prev !== null ? (prev + 1) % LENS_PHOTOS.length : null));
  }, []);

  const prev = React.useCallback((e?: any) => {
    e?.stopPropagation();
    setIdx((prev) => (prev !== null ? (prev - 1 + LENS_PHOTOS.length) % LENS_PHOTOS.length : null));
  }, []);

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
      // preload next and prev images sparingly
      const next_idx = (idx + 1) % LENS_PHOTOS.length;
      const prev_idx = (idx - 1 + LENS_PHOTOS.length) % LENS_PHOTOS.length;
      [next_idx, prev_idx].forEach(i => {
        const img = new window.Image();
        img.src = LENS_PHOTOS[i].url;
      });
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", on_key);
      document.body.style.overflow = "";
    };
  }, [idx, next, prev]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      <header className="page-header flex flex-row items-end italic gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <h2 className="page-title font-expressive-bold italic">Lens</h2>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-[280px] md:auto-rows-[380px] px-4 md:px-0 grid-flow-dense">
        {LENS_PHOTOS.map((photo, i) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            i={i}
            settings={settings}
            onClick={handlePhotoClick}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
