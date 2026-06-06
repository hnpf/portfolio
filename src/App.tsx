import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  BookText,
  Camera,
  Activity,
  Fingerprint,
  Settings as SettingsIcon,
  Cpu,
  Github,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Terminal,
  ArrowUpRight,
  Link as LinkIcon,
  Layers,
  EyeOff,
  Check,
  Palette,
} from "lucide-react";

import { useTheme } from "./ThemeContext";
import { cn, BLOG_POSTS } from "./constants";

// Pages
import { HomePage } from "./pages/HomePage";
import { BlogPage } from "./pages/BlogPage";
import { ChangelogPage } from "./pages/ChangelogPage";
import { LensPage } from "./pages/LensPage";
import { ReadmePage } from "./pages/ReadmePage";
import { TrackerPage } from "./pages/TrackerPage";
import DashPage from "./pages/DashPage";
import NoPage from "./pages/NoPage";
import NotFound from "./pages/NotFound";

// Components
import { SideItem, BotNav } from "./components/Navigation";
import { SettingsDialog } from "./components/SettingsDialog";
import { DebugConfirmDialog } from "./components/DebugConfirmDialog";
import { CursedPopup } from "./components/CursedPopup";
import { BounceButton } from "./components/TechStack";

import "./navigation/navigation-rail.css";

const IS_APR = (() => {
  const now = new Date();
  return now.getMonth() === 3 && now.getDate() === 1;
})();

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
        
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {
        console.error("oh shit, capsule decoding failed! probably corrupted.", e);
      }
    }
  }, [updateSettings]);

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

  const [page, setPage] = useState(() => {
    const loc = window.location.pathname;
    const path = loc.replace("/", "").toLowerCase();

    if (path === "readme") return "home";

    if (loc === "/" || loc === "") return "home";
    if (loc.startsWith("/blog/")) return "blog";
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

    document.body.classList.add("fsh-mode");

    const hijack = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("a, button, .sidebar-item, .bottom-nav-item")) {
        window.location.href = "/fsh-spin.gif";
      }
    };
    window.addEventListener("click", hijack);

    const flip_it = () => {
      const els = document.querySelectorAll("div, p, h1, h2, h3, img, span");
      const target = els[Math.floor(Math.random() * els.length)];
      if (target && !target.closest(".sidebar-item")) {
        target.classList.toggle("fsh-flip");
      }
    };
    const interval = setInterval(flip_it, 3000);

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
    const timer = setTimeout(() => setDoWiggle(true), 1200);
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

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showDebugConfirm, setShowDebugConfirm] = useState(false);
  const [viewport, set_viewport] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
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
    if (settingsOpen || showDebugConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [settingsOpen, showDebugConfirm]);

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

  const [show_grid, set_show_grid] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "debug-grid-active",
      settings.debugMode && show_grid,
    );
  }, [settings.debugMode, show_grid]);

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
              <span>v2.4.0-stable (v2026.06.01)</span>
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
              x: settings.sidebarFlipped ? 400 : -400,
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
                    "gap-6",
                    settings.sidebarCollapsed
                      ? "items-center px-2"
                      : "items-stretch px-4",
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
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.main
        className={cn(
          "flex-1 overflow-x-hidden page-container",
          page === "readme" ? "p-0" : "p-6 md:p-12 lg:p-16",
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
              ease: [0.22, 1, 0.36, 1],
              scale: {
                type: "spring",
                stiffness: settings.highHz ? 600 : 300,
                damping: settings.highHz ? 35 : 25,
              },
            }}
          >
            {page === "home" && <HomePage setPage={goto} settings={settings} />}
            {page === "blog" && (
              <BlogPage targetId={blogPostId} navigateTo={goto} />
            )}
            {page === "lens" && <LensPage viewport={viewport} />}
            {page === "tracker" && <TrackerPage />}
            {page === "readme" && <ReadmePage setPage={goto} is_mobile={is_mobile} />}
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

      <SettingsDialog
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        settings={settings}
        updateSettings={updateSettings}
        setShowDebugConfirm={setShowDebugConfirm}
        setToast={setToast}
        goto={goto}
      />

      <DebugConfirmDialog
        showDebugConfirm={showDebugConfirm}
        setShowDebugConfirm={setShowDebugConfirm}
        updateSettings={updateSettings}
      />

      {settings.debugMode && (
        <div className="fixed top-4 right-4 z-[150] p-4 bg-black/80 text-white font-mono text-[10px] rounded-2xl backdrop-blur-xl border border-white/10 pointer-events-none space-y-1">
          <div className="text-[var(--primary)] font-bold mb-2 flex items-center gap-2">
            <Cpu size={12} />
            BUILD INFO
          </div>
          <div>PLATFORM: {viewport.w}x{viewport.h}</div>
          <div>PAGE: {page.toUpperCase()}</div>
          <div>THEME: {actualTheme.toUpperCase()}</div>
          <div>ANIM: {settings.disableAnimations ? "OFF" : "ON"}</div>
          <div className="pt-2 opacity-40">v2026.06.01-PROD</div>
        </div>
      )}
    </div>
  );
}
