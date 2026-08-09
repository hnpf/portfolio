// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../constants";
import { Search, Home, Info, ImageIcon, Monitor, Settings as SettingsIcon, Layers, Palette, Moon, Sun, ArrowRight, ArrowUp, ArrowDown, MessageSquare, X, ViewModule, ViewList } from "./MaterialIcon";
import { M3ScrollBar } from "./M3ScrollBar";
import M3Switch from "./M3Switch";

const normalize = (value: string) => value.trim().toLowerCase();

export function CommandPalette({
  open,
  onClose,
  goto,
  settings,
  cycleTheme,
  updateSettings,
  onOpenSettings,
  onOpenGuestbook,
  blogPosts,
}: any) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [viewMode, setViewMode] = useState<"lists" | "cards">("lists");
  const [searchFocus, setSearchFocus] = useState(false);
  const [ignoreMouseHover, setIgnoreMouseHover] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    const pageActions = [
      {
        id: "go-home",
        label: "Go home",
        description: "Jump to the homepage",
        category: "Navigation",
        icon: Home,
        action: () => goto("home"),
        tags: ["home", "start", "landing"],
      },
      {
        id: "go-info",
        label: "Open info page",
        description: "Visit the about / info page",
        category: "Navigation",
        icon: Info,
        action: () => goto("readme"),
        tags: ["info", "about", "readme"],
      },
      {
        id: "go-blog",
        label: "Open blog",
        description: "Browse the blog feed",
        category: "Navigation",
        icon: Layers,
        action: () => goto("blog"),
        tags: ["blog", "posts", "articles"],
      },
      {
        id: "go-lens",
        label: "Open lens",
        description: "Explore the Lens photo page",
        category: "Navigation",
        icon: ImageIcon,
        action: () => goto("lens"),
        tags: ["lens", "photo", "camera"],
      },
      {
        id: "go-now",
        label: "Open now",
        description: "See what I'm doing now",
        category: "Navigation",
        icon: Monitor,
        action: () => goto("now"),
        tags: ["now", "status", "live"],
      },
      {
        id: "go-changelog",
        label: "Open changelog",
        description: "View recent site updates",
        category: "Navigation",
        icon: ArrowRight,
        action: () => goto("changelog"),
        tags: ["changelog", "updates", "release"],
      },
      {
        id: "open-settings",
        label: "Open settings",
        description: "Adjust theme, nav, and site options",
        category: "Tools",
        icon: SettingsIcon,
        action: () => onOpenSettings(),
        tags: ["settings", "options", "prefs"],
      },
      {
        id: "open-guestbook",
        label: "Open guestbook",
        description: "Read and sign the guestbook",
        category: "Tools",
        icon: MessageSquare,
        action: () => onOpenGuestbook(),
        tags: ["guestbook", "guest", "book"],
      },
      {
        id: "theme-cycle",
        label: `Toggle theme (${settings.mode})`,
        description: "Flip between light and dark mode",
        category: "Appearance",
        icon: Palette,
        action: () => cycleTheme(),
        tags: ["theme", "dark", "light", "mode"],
      },
      {
        id: "theme-light",
        label: "Set light theme",
        description: "Switch the site to light mode",
        category: "Appearance",
        icon: Sun,
        action: () => updateSettings({ mode: "light" }),
        tags: ["light", "theme", "mode"],
      },
      {
        id: "theme-dark",
        label: "Set dark theme",
        description: "Switch the site to dark mode",
        category: "Appearance",
        icon: Moon,
        action: () => updateSettings({ mode: "dark" }),
        tags: ["dark", "theme", "mode"],
      },
      {
        id: "theme-system",
        label: "Set system theme",
        description: "Follow the OS theme setting",
        category: "Appearance",
        icon: Palette,
        action: () => updateSettings({ mode: "system" }),
        tags: ["system", "theme", "mode"],
      },
    ];

    const postActions = Array.isArray(blogPosts)
      ? blogPosts.map((post: any) => ({
          id: `blog-${post.id}`,
          label: `Blog: ${post.title}`,
          description: post.snippet,
          category: "Blog posts",
          icon: Layers,
          action: () => goto("blog", post.link),
          tags: [post.title, post.snippet, post.category, post.link],
        }))
      : [];

    return [...pageActions, ...postActions];
  }, [goto, settings.mode, cycleTheme, updateSettings, onOpenSettings, onOpenGuestbook, blogPosts]);

  useEffect(() => {
    const stored = window.localStorage.getItem("virex-command-palette-recent");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentIds(parsed.filter((id) => typeof id === "string"));
        }
      } catch (error) {
        console.warn("Failed to parse recent command palette items", error);
      }
    }
  }, []);

  const filteredItems = useMemo(() => {
    const queryText = normalize(query);
    const scope = settings.paletteSearchScope;
    const scopedItems = items.filter((item) => {
      if (scope === "pages") return item.category === "Navigation";
      if (scope === "commands") return item.category !== "Blog posts";
      if (scope === "blog") return item.category === "Blog posts";
      return true;
    });

    const sortedItems = !queryText && settings.paletteShowRecentActions && recentIds.length
      ? [
          ...recentIds
            .map((id) => scopedItems.find((item) => item.id === id))
            .filter(Boolean) as typeof items,
          ...scopedItems.filter((item) => !recentIds.includes(item.id)),
        ]
      : scopedItems;

    if (!queryText) {
      return sortedItems.slice(0, settings.paletteResultsLimit);
    }

    return sortedItems
      .filter((item) => {
        const haystack = [item.label, item.description, ...(item.tags || [])].join(" ").toLowerCase();
        return haystack.includes(queryText);
      })
      .slice(0, settings.paletteResultsLimit);
  }, [items, query, recentIds, settings.paletteSearchScope, settings.paletteResultsLimit, settings.paletteShowRecentActions]);

  const showRecentHeader = !normalize(query) && settings.paletteShowRecentActions && recentIds.length > 0;
  const isRecentItem = (itemId: string) => !normalize(query) && settings.paletteShowRecentActions && recentIds.includes(itemId);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    if (settings.paletteDefaultView === "cards") {
      setViewMode("cards");
    } else {
      setViewMode("lists");
    }
  }, [open, settings.paletteDefaultView]);

  useEffect(() => {
    if (!open) return;
    setCursor((current) => Math.min(current, Math.max(filteredItems.length - 1, 0)));
  }, [filteredItems.length, open]);

  useEffect(() => {
    if (!open || !ignoreMouseHover) return;
    const onPointerMove = () => setIgnoreMouseHover(false);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [open, ignoreMouseHover]);

      const shouldSuppressHover = settings.paletteSuppressHover;
      const shouldWrapNav = settings.paletteKeyboardNavBehavior === "wrap";
      const isGridNav = settings.paletteKeyboardNavBehavior === "grid";

      useEffect(() => {
        if (!open) return;

        const clampIndex = (next: number) => {
          if (filteredItems.length === 0) return 0;
          if (shouldWrapNav) {
            return (next + filteredItems.length) % filteredItems.length;
          }
          return Math.max(0, Math.min(next, filteredItems.length - 1));
        };

        const moveAmount = viewMode === "cards" && isGridNav ? 2 : 1;

        const onKeyDown = (event: KeyboardEvent) => {
          const suppress = shouldSuppressHover;

          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (suppress) setIgnoreMouseHover(true);
            setCursor((current) => clampIndex(current + moveAmount));
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            if (suppress) setIgnoreMouseHover(true);
            setCursor((current) => clampIndex(current - moveAmount));
          }

          if (viewMode === "cards" && event.key === "ArrowRight") {
            event.preventDefault();
            if (suppress) setIgnoreMouseHover(true);
            setCursor((current) => {
              const next = current + 1;
              return shouldWrapNav ? clampIndex(next) : (next < filteredItems.length ? next : current);
            });
          }

          if (viewMode === "cards" && event.key === "ArrowLeft") {
            event.preventDefault();
            if (suppress) setIgnoreMouseHover(true);
            setCursor((current) => {
              const next = current - 1;
              return shouldWrapNav ? clampIndex(next) : (next >= 0 ? next : current);
            });
          }

          if (event.key === "Enter") {
            event.preventDefault();
            const item = filteredItems[cursor] || filteredItems[0];
            if (item) {
              const updated = [item.id, ...recentIds.filter((id) => id !== item.id)].slice(0, 6);
              setRecentIds(updated);
              window.localStorage.setItem("virex-command-palette-recent", JSON.stringify(updated));
              item.action();
              onClose();
            }
          }

          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
      }, [open, filteredItems, cursor, viewMode, onClose, recentIds, shouldWrapNav, shouldSuppressHover, isGridNav]);

  useEffect(() => {
    if (!open) return;
    const active = scrollRef.current?.querySelector<HTMLButtonElement>("[data-command-active='true']");
    active?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [cursor, filteredItems, open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed left-1/2 top-1/2 z-[10010] w-[min(92vw,720px)] max-h-[86vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-[var(--surface)] border-4 border-[var(--outline-variant)]/30 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="flex flex-col h-full">
          <div className="px-5 py-6 border-b-4 border-[var(--outline-variant)]/20 bg-[var(--surface-variant)]">
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[13px] font-black uppercase tracking-[0.24em] italic opacity-70">Command palette</div>
                  <h2 className="mt-3 text-3xl md:text-4xl font-expressive tracking-[-0.03em]">Quick jump across pages, settings, and blog posts.</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 opacity-50">Search everything from one place, then select with keyboard or mouse.</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="group w-10 h-10 rounded-full bg-[var(--surface-variant)]/60 hover:bg-[var(--surface-variant)] border-3 border-[var(--outline-variant)]/50 flex items-center justify-center transition-all cursor-pointer text-[var(--on-surface)] active:scale-95 shrink-0 shadow-sm"
                  aria-label="Close command palette"
                >
                  <X size={20} className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180 group-hover:scale-110" />
                </button>
              </div>
              <motion.div
                className="relative"
                animate={searchFocus ? { y: -3, scale: 1.002 } : { y: 0, scale: 1 }}
                whileHover={{ y: -2, scale: 1.002 }}
                transition={{ type: "spring", stiffness: 360, damping: 20, mass: 1 }}
              >
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] opacity-70 z-10" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  placeholder="Search commands, pages, posts..."
                  className="h-14 w-full rounded-[20px] border-2 border-[var(--outline-variant)]/40 bg-[var(--surface)] py-4 pl-14 pr-4 text-sm font-semibold text-[var(--on-surface)] outline-none shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow,background-color] duration-200 ease-out focus:border-[var(--primary)] focus:border-4 focus:ring-0 focus:shadow-[0_0_0_0.35rem_rgba(79,70,229,0.12)]"
                  aria-label="Search command palette"
                />
              </motion.div>
            </div>
          </div>
          <div className="relative min-h-0 flex-1 overflow-visible p-4">
            {filteredItems.length === 0 ? (
              <div className="rounded-[15px] border border-[var(--outline-variant)]/40 bg-[var(--surface-variant)] p-6 text-center text-sm opacity-80">
                No matches found. Try another word or page name.
              </div>
            ) : (
              <div className="relative">
                <div
                  ref={scrollRef}
                  className="scrollbar-hide max-h-[calc(72vh-16rem)] overflow-y-auto overscroll-contain pr-8 pb-4 pt-5"
                >
                  <div className={viewMode === "lists" ? "grid gap-2" : "grid grid-cols-2 gap-4"}>
                    {filteredItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = index === cursor;
                      const isRecent = isRecentItem(item.id);
                      const isFirst = index === 0;
                      const isLast = index === filteredItems.length - 1;
                      const isSingle = filteredItems.length === 1;
                      const roundedClass = viewMode === "lists"
                        ? isSingle
                          ? "rounded-[2rem]"
                          : isFirst
                            ? "rounded-t-[2rem] rounded-b-[0.9rem]"
                            : isLast
                              ? "rounded-b-[2rem] rounded-t-[0.9rem]"
                              : "rounded-[0.9rem]"
                        : "rounded-[2rem]";
                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            item.action();
                            onClose();
                          }}
                          onMouseEnter={() => {
                            if (!ignoreMouseHover) setCursor(index);
                          }}
                          data-command-active={isActive}
                          style={{ transformOrigin: "left center" }}
                          whileHover={
                            ignoreMouseHover
                              ? undefined
                              : {
                                  y: -3,
                                  scale: 1.01,
                                  transition: { type: "spring", stiffness: 550, damping: 58, mass: 0.7 },
                                }
                          }
                          whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 900, damping: 40, mass: 0.5 } }}
                          animate={isActive ? { scale: 1.01 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 620, damping: 30, mass: 0.65 }}
                          className={cn(
                            "group relative w-full text-left transition-colors duration-150",
                            viewMode === "lists"
                              ? cn(
                                  "grid grid-cols-[auto_1fr] items-center gap-4 border-6 bg-[var(--surface)] px-5 py-5 shadow-[0_18px_46px_-28px_rgba(0,0,0,0.16)]",
                                  roundedClass
                                )
                              : cn(
                                  "flex items-start gap-3 border-6 px-4 py-4 bg-[var(--surface)]",
                                  roundedClass
                                ),
                            isActive
                              ? "border-[var(--primary)] bg-[var(--primary-container)] text-[var(--on-primary-container)] shadow-[0_20px_48px_-24px_rgba(79,70,229,0.24)]"
                              : cn(
                                  "border-[var(--outline-variant)]/30",
                                  !ignoreMouseHover && "hover:border-[var(--primary)]/30 hover:bg-[var(--surface-variant)]"
                                )
                          )}
                        >
                          <div className={cn(
                            "grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border-2",
                            isActive
                              ? "border-3 border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]"
                              : "border-3  border-[var(--outline-variant)]/30 bg-[var(--surface-variant)] text-[var(--on-surface-variant)]"
                          )}>
                            <Icon size={20} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-[16px] font-semibold tracking-tight opacity-85">{item.label}</div>
                              {isRecent && (
                                <span className="rounded-full bg-[var(--primary-container)] px-2 py-0.5 text-[11px] font-black  tracking-[0.1em] text-[var(--on-primary-container)]">
                                  Recent
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-[12px] opacity-50 leading-5">{item.description}</div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                <M3ScrollBar scrollEl={scrollRef} thinOnly colorful className="absolute top-0 right-0 h-full" />
              </div>
            )}
          </div>
          <div className="border-t border-[var(--outline-variant)]/30 bg-[var(--surface-variant)] px-5 py-4 text-[13px] text-[var(--on-surface-variant)] opacity-80">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Tip:</span>
                <ArrowUp size={14} className="inline-block align-middle" />
                <ArrowDown size={14} className="inline-block align-middle" />
                <span className="inline-flex items-center justify-center rounded-[0.45rem] border-3 border-[var(--primary)]/30 bg-[var(--surface)]/50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">Enter</span>
                to select.
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] tracking-[0.05em] opacity-70">View</span>
                <M3Switch
                  checked={viewMode === "lists"}
                  onChange={(checked) => setViewMode(checked ? "lists" : "cards")}
                  icons="both"
                  checkedIcon={<ViewList size={12} />}
                  uncheckedIcon={<ViewModule size={12} />}
                  className="h-9 w-16"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
