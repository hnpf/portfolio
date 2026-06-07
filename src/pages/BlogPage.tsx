// @ts-nocheck
import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, ArrowUpRight, Filter } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn, BLOG_POSTS } from "../constants";
import CopyLinkCapsule from "../components/CopyLinkCapsule";
import { Card } from "../components/Card";
import { Code } from "../components/Code";
import { SplitButton } from "../components/SplitButton";

export const BlogPage = memo(({ targetId, navigateTo }: any) => {
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
            <h1 className="page-title !text-6xl !md:text-8xl leading-[0.9] text-balance font-expressive italic">
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
  const categories = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
  const filtered_posts = BLOG_POSTS.filter(
    (p) => !active_cat || p.category === active_cat,
  );

  const show_featured = !active_cat || featured.category === active_cat;
  const filtered_rest = filtered_posts.filter((p) => p.id !== featured.id);

  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4 md:px-0 pb-32">
      <header className="page-header font-expressive-bold space-y-8">
        <h2 className="page-title">Blog</h2>
      </header>

      <div className="flex flex-wrap items-center gap-4 mb-12">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCat(null)}
          className={cn(
            "h-11 px-8 text-[13px] font-expressive font-black tracking-[0.3em] border-4 shadow-sm transition-none duration-200 block pt-0.5",
            !active_cat
              ? "bg-[var(--primary)]  italic text-[var(--on-primary)] border-[var(--primary)]/30 rounded-full shadow-lg"
              : "bg-[var(--surface-variant)] italic text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 rounded-[1.5rem] opacity-60 hover:opacity-100",
          )}
        >
          All
        </motion.button>

        <SplitButton
          variant={active_cat ? "filled" : "tonal"}
          icon={<Filter size={16} />}
          label={<span className="block pt-0.5">{active_cat ? `Topic: ${active_cat}` : "Browse Topics"}</span>}
          onClick={() => {}}
          menu={categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={cn(
                "w-full text-left px-5 py-3 text-[13px] font-black tracking-[0.03em] rounded-xl transition-all duration-200",
                active_cat === cat
                  ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-md"
                  : "hover:bg-[var(--primary-container)] text-[var(--on-surface-variant)]"
              )}
            >
              {cat}
            </button>
          ))}
        />
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
                  <h3 className="text-4xl md:text-7xl font-expressive font-black tracking-tighter leading-[0.95] group-hover:translate-x-2 transition-transform duration-500 italic">
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
                    className="m3-button-filled ring-6 ring-[var(--on-primary-container)] !transition-none bg-white text-black text-md md:text-2xl h-14 md:h-18 px-8 md:px-14 rounded-[24px] flex items-center gap-3 group/btn whitespace-nowrap"
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
                      <h4 className="text-2xl md:text-3xl font-expressive font-black leading-tight group-hover:translate-x-1 transition-transform italic">
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
