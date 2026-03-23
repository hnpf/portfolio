import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';
import NotFound from './NotFound';
import DashPage from './Dash';
import NoPage from './No';
import { useTheme } from './ThemeContext';
import { cn, PROJECTS, BLOG_POSTS, CHANGELOGS, TRACKER_ITEMS, HARDWARE_SPECS, TECH_STACK, type ChangelogEntry } from './constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- building blocks ---

const HelloVirex = () => {
  const words = ['virex', 'вирекс', 'βίρεξ', 'վիրեքս', 'וירקס', 'ვირექს', '비렉스', '维雷克斯', 'ڤيركس'];
  const [widx, setWidx] = useState(0);

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
            scale: 0.8
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.8,
            filter: 'blur(10px)'
          }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.5
          }}
          className="text-8xl md:text-[10rem] font-display font-black tracking-tighter leading-[0.8] text-balance"
        >
          {words[widx]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

const SideItem = ({ glyph: Icon, text, isSelected, onSelect, isMini }: any) => (
  <button
    onClick={onSelect}
    className={cn(
      "flex items-center gap-4 px-4 py-3 rounded-[1.5rem] transition-all duration-150 group relative sidebar-item",
      isSelected ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-lg" : "hover:bg-[var(--surface-variant)] text-[var(--on-surface-variant)]",
      isMini && "justify-center px-0 w-14 mx-auto"
    )}
  >
    <Icon size={24} className={cn("shrink-0 transition-transform duration-150", isSelected && "scale-110 rotate-3")} />
    {!isMini && <span className="font-semibold tracking-tight">{text}</span>}
    {isMini && (
      <div className="absolute left-full ml-6 px-3 py-1.5 bg-[var(--on-surface)] text-[var(--surface)] text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-50 whitespace-nowrap shadow-xl motion-gpu">
        {text}
      </div>
    )}
  </button>
);

const BotNav = ({ glyph: Icon, text, isSelected, onSelect, imgSrc, wiggle }: any) => (
  <button
    onClick={onSelect}
    className={cn(
      "flex flex-col items-center gap-1 flex-1 pt-3 pb-2 transition-all duration-200 relative z-10 bottom-nav-item outline-none",
      isSelected ? "text-[var(--on-surface)]" : "text-[var(--on-surface-variant)]"
    )}
  >
    <div className="relative flex items-center justify-center w-16 h-8 mb-1">
      <AnimatePresence mode="popLayout">
        {isSelected && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-[var(--primary-container)] rounded-full -z-10 motion-gpu"
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          />
        )}
      </AnimatePresence>
      <motion.div
        animate={wiggle ? { 
          rotate: [0, -10, 10, -10, 10, 0],
          scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
        } : { rotate: 0, scale: 1 }}
        transition={wiggle ? {
          duration: 1.2,
          repeat: 1,
          repeatDelay: 0.1,
          ease: "easeInOut"
        } : { duration: 0.3 }}
      >
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt={text} 
            className={cn(
              "w-6 h-6 rounded-full transition-transform duration-200 object-cover", 
              isSelected ? "scale-110 ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-black/20" : "scale-100 grayscale opacity-60"
            )} 
          />
        ) : (
          <Icon 
            size={24} 
            className={cn("transition-transform duration-200", isSelected ? "scale-110" : "scale-100")} 
            strokeWidth={isSelected ? 2.5 : 2}
          />
        )}
      </motion.div>
    </div>
    <span className={cn(
      "text-[11px] font-bold tracking-tight transition-all duration-200",
      isSelected ? "opacity-100" : "opacity-70"
    )}>{text}</span>
  </button>
);

const Card = ({ children, className, delay = 0, onClick }: any) => {
  const [fresh, setFresh] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFresh(false);
    }, (delay + 0.4) * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15
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
        duration: 0.2, 
        delay: fresh ? delay : 0,
        ease: [0.33, 1, 0.68, 1],
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      onClick={onClick}
      className={cn("m3-card motion-gpu cursor-default transition-none", onClick && "cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
};

const Code = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);
  
  // a quick hack to pull text from react nodes
  const get_code = (nodes: any): string => {
    if (typeof nodes === 'string') return nodes;
    if (Array.isArray(nodes)) return nodes.map(get_code).join('');
    if (nodes?.props?.children) return get_code(nodes.props.children);
    return '';
  };

  const code = get_code(children).replace(/\n$/, '');
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
        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      </button>
      <pre className={cn(
        "bg-black/10 dark:bg-white/5 p-6 rounded-l-3xl rounded-r-xl overflow-x-auto font-mono text-sm my-6 border border-[var(--outline-variant)] custom-scrollbar",
        className
      )}>
        {children}
      </pre>
    </div>
  );
};

// --- pages ---

const LoomDocs = ({ onBack }: { onBack: () => void }) => {
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

  return (
    <div className="w-full font-sans selection:bg-primary/30">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex flex-col gap-3">
          <span className="text-[14px] tracking-[0.2em] font-black opacity-50">
            our chronology
          </span>
          <h2 className="text-4xl font-black tracking-tighter leading-none">
            {year}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-tighter tabular-nums">
            {pct.toFixed(4)}%
          </div>
        </div>
      </div>

      {/* background track */}
      <div className="relative h-1 w-full bg-black/5 dark:bg-white/10 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-current"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      <div className="mt-3 flex justify-between text-[11px] font-bold opacity-40 tracking-tight">
        <span>{now.toLocaleTimeString().toLowerCase()}</span>
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
            y: 30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="page-title !text-8xl !md:text-[10rem] leading-[0.8] text-balance"
        >
          virex
        </motion.h1>
      )}
      <motion.p 
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{ 
        	delay: 0.2, 
        	duration: 0.6, 
        	ease: [0.33, 1, 0.68, 1] 
	}}
        className="text-2xl md:text-4xl font-display font-light text-[var(--on-surface-variant)] leading-tight max-w-4xl"
      >
        i am an independent software dev, and problem solver.
      </motion.p>
    </header>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
      <Card delay={0.4} className="md:col-span-2 lg:col-span-1 xl:col-span-2 bg-[var(--primary)] text-[var(--on-primary)] border-none p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
        <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] tracking-tight">"logic doesn't lie."</h2>
        <div>
          <p className="text-xl md:text-2xl opacity-90 font-medium max-w-2xl mb-14 leading-snug">
            software shouldn't be complicated.
          <br></br>
            build it clean, run it fast, skip the abstractions.
          </p>
          <motion.button
            whileHover={{
                scale: 1.05, 
                x: 5 
            }}
            whileTap={{
                scale: 0.95 
            }}
            transition={{ 
            	type: "spring", 
            	stiffness: 500, 
            	damping: 20,
            	mass: 0.5
            }}
            onClick={() => setPage('readme')}
            className="m3-button-filled bg-white text-black text-xl h-16 px-10 rounded-2xl flex items-center gap-2 group"
          >
            explore more!
            <motion.span>
              <ChevronRight size={24} />
            </motion.span>
          </motion.button>
        </div>
      </Card>
      <Card delay={0.0} className="flex flex-col justify-between">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-[var(--primary-container)] rounded-3xl flex items-center justify-center">
            <Activity size={32} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-3xl font-display font-bold">no half-measures.</h3>
          <p className="text-xl opacity-70 leading-relaxed">reliability isn't a feature, it's the bare minimum</p>
        </div>
      </Card>
      <Card delay={0.6} className="bg-[var(--primary-container)] text-[var(--on-primary-container)] flex flex-col justify-center p-10">
        <YearProg />
      </Card>
      <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 mt-8 mb-4 flex items-center gap-6 px-4">
        <div className="h-[1px] flex-1 bg-[var(--outline-variant)] opacity-30" />
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 whitespace-nowrap">made + contributed</h3>
          <div className="text-2xl font-display font-black tracking-tighter">projects and research</div>
        </div>
        <div className="h-[1px] flex-1 bg-[var(--outline-variant)] opacity-30" />
      </div>
      <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
        {PROJECTS.map((project, i) => (
          <Card key={project.id} delay={0.7 + i * 0.1} className="flex flex-col justify-between p-10 min-h-[350px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-3xl font-display font-bold leading-tight">{project.title}</h4>
                <div className="flex flex-wrap gap-2 justify-end">
                  {project.tags.map(tag => (
                    <span key={tag} className="m3-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="opacity-70 mb-8 text-xl leading-snug">{project.description}</p>
            </div>
            {project.link.startsWith('/') ? (
              <motion.button 
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(project.link.replace('/', ''))}
                className="inline-flex items-center gap-2 text-[var(--primary)] font-black uppercase tracking-widest text-xs hover:underline w-fit group"
              >
                View Project <motion.span initial={{ x: 0 }} whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}><ChevronRight size={14} /></motion.span>
              </motion.button>
            ) : (
              <motion.a 
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                href={project.link} 
                target="_blank" 
                className="inline-flex items-center gap-2 text-[var(--primary)] font-black uppercase tracking-widest text-xs hover:underline group"
              >
                View Project <motion.span initial={{ x: 0 }} whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}><ExternalLink size={14} /></motion.span>
              </motion.a>
            )}
          </Card>
        ))}
      </div>
    </section>
  </div>
);

const BlogPage = ({ targetId, navigateTo }: any) => {
  const [copied, setCopied] = useState(false);
  // const [active_cat, setActiveCat] = useState<string | null>(null)  
  // later: category filter, never got around to it rip
  const [read, setRead] = useState<string[]>(() => {
    const saved = localStorage.getItem('virex-read-posts');
    return saved ? JSON.parse(saved) : [];
  });
  const post = BLOG_POSTS.find(p => p.id === targetId || p.link === targetId);

  useEffect(() => {
    if (!targetId || !post) {
      return;
    }

    const on_scroll = () => {
      const scrolled = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = (scrolled / height) * 100;
      if (pct > 95 && !read.includes(post.id)) {
        setRead(prev => {
          const next = [...prev, post.id];
          localStorage.setItem('virex-read-posts', JSON.stringify(next));
          return next;
        });
      }
    };
    window.addEventListener('scroll', on_scroll);
    return () => window.removeEventListener('scroll', on_scroll);
  }, [targetId, read, post]);

  if (post) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 15
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="max-w-4xl mx-auto space-y-12 px-4 md:px-0 motion-gpu relative"
      >
        <div className="flex justify-between items-center sticky top-0 py-4 bg-[var(--surface)]/80 backdrop-blur-md z-40">
          <button
            onClick={() => window.history.back()}
            className="m3-button-tonal w-fit group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to feed</span>
          </button>
          <div className="hidden md:flex items-center gap-3 opacity-50 text-xs font-black uppercase tracking-[0.2em]">
            {read.includes(post.id) && <CheckCircle2 size={14} className="text-green-500" />}
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
              pre: ({ node, ...props }) => <Code {...props} />
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="pt-16 pb-24 border-t border-[var(--outline-variant)] flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h4 className="text-3xl font-display font-black">enjoyed the deep dive?</h4>
            <p className="opacity-60 font-medium">share this post with your friends!</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/blog/${post.link}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={cn(
              "m3-button-filled h-20 px-16 text-xl rounded-[2rem] shadow-2xl transition-all relative overflow-hidden",
              copied ? "bg-green-600 shadow-green-500/20" : "hover:shadow-[var(--primary)]/20"
            )}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <Check size={24} /> link copied!
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <Copy size={24} /> copy post link
                </motion.div>
              )}
            </AnimatePresence>
          </button>
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
            scale: 0.98
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          className="relative rounded-[3.5rem] overflow-hidden bg-[var(--primary-container)] text-[var(--on-primary-container)] border-4 border-[var(--outline-variant)] shadow-2xl group cursor-pointer"
          onClick={() => navigateTo('blog', featured.link)}
        >
          <div className="p-8 md:p-16 space-y-8 relative z-10">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-[var(--primary)] text-[var(--on-primary)] rounded-full text-[13px] font-black tracking-widest shadow-lg">
                Featured post!
              </span>
              <span className="text-sm font-bold opacity-60 flex items-center gap-2">
                <Calendar size={14} /> {featured.date}
              </span>
              {read.includes(featured.id) && <CheckCircle2 size={20} className="text-green-500 shadow-xl" />}
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
              <div className="m3-button-filled !rounded-[1.5rem] !px-8 !py-4 group-hover:scale-105 transition-transform shadow-xl">
                read full entry <ArrowUpRight size={20} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest opacity-40 italic">{featured.readTime}</span>
            </div>
          </div>
        </motion.div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {rest.map((p, i) => (
          <Card 
            key={p.id} 
            delay={i * 0.1} 
            className="cursor-pointer group relative overflow-hidden bg-[var(--surface-variant)]/30 hover:bg-[var(--primary-container)]/20 border-2 border-[var(--outline-variant)]/50 hover:border-[var(--primary)]" 
            onClick={() => navigateTo('blog', p.link)}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] px-2 py-1 bg-[var(--primary-container)]/30 rounded-md">
                    {p.category}
                  </span>
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{p.date}</span>
                  {read.includes(p.id) && <CheckCircle2 size={16} className="text-green-500" />}
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
        <p className="text-2xl opacity-60 font-medium">Tracking virex changes.</p>
      </header>

      <div className="space-y-24">
        {CHANGELOGS.map((entry, i) => (
          <motion.section 
            key={entry.id}
            initial={{
              opacity: 0,
              x: -20
            }}
            whileInView={{
              opacity: 1,
              x: 0
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
                  <span className="text-sm font-bold opacity-40 uppercase tracking-widest">{entry.date}</span>
                </div>
                <h3 className="text-4xl font-display font-black tracking-tight">{entry.title}</h3>
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
                        <li key={index} className="text-lg opacity-80 leading-relaxed flex gap-3">
                          <span className="text-[var(--primary)] font-bold mt-1">/</span>
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

const LensPage = () => {
  const [idx, setIdx] = useState<number | null>(null);
  // const swipe_start = useRef<number | null>(null)  
  // switched to framer drag,dead maybe
  
  // if you wish to use your own photos, replace them here:
  // public/photography/ 
  // OR 
  // photography/
  // just make sure you link everything correctly, don't be dumb
  
  const photos = [
    { id: '1', url: '/photography/20250524_125754_optimized_optimized_optimized.webp', description: 'light at the end of the brick tunnel', orientation: '' },
    { id: '2', url: '/photography/20250526_104032_optimized_optimized_optimized.webp', description: 'aerial smoke trails in formation', orientation: 'landscape' },
    { id: '3', url: '/photography/20250628_124853_optimized_optimized.webp', description: 'solitary boat with shallow depth of field', orientation: 'landscape' },
    { id: '4', url: '/photography/20250704_194559_optimized.webp', description: 'sunset framed by summer leaves', orientation: 'landscape' },
    { id: '5', url: '/photography/20250704_203117_optimized.webp', description: 'fourth of july sparks', orientation: 'landscape' },
    { id: '6', url: '/photography/20250705_091012_optimized.webp', description: 'ducks drifting on the water', orientation: 'landscape' },
    { id: '7', url: '/photography/20251106_151437.webp', description: 'random street sign in the lake', orientation: 'landscape' },
    { id: '8', url: '/photography/20251221_035746.webp', description: 'a. seemanni face-to-face', orientation: 'landscape' },
    { id: '9', url: '/photography/IMG_20251101_1654442.webp', description: 'palm tree against the vibrant sun', orientation: 'landscape' },
    { id: '10', url: '/photography/PXL_20251225_142558068~2.webp', description: 'dewy webs on the rocks', orientation: 'landscape' },
    { id: '11', url: '/photography/PXL_20251230_074304887.PORTRAIT.webp', description: 'the workstation aesthetic', orientation: 'landscape' },
    { id: '12', url: '/photography/PXL_20251231_013358426.PORTRAIT~2.webp', description: 'feline toes', orientation: 'landscape' },
    { id: '13', url: '/photography/PXL_20251231_235312192.webp', description: 'fiery red sky behind the treeline', orientation: 'landscape' },
    { id: '14', url: '/photography/PXL_20260108_040856251.webp', description: 'p. audax carrying a droplet', orientation: 'landscape' },
    { id: '15', url: '/photography/PXL_20260108_042253119.webp', description: 'tarantula being a menace', orientation: 'landscape' },
    { id: '16', url: '/photography/PXL_20260115_062158733.PORTRAIT.webp', description: 'tarantula at the watering hole', orientation: 'landscape' },
    { id: '17', url: '/photography/PXL_20260129_045632703.PORTRAIT~2.webp', description: 'silly silly / pure chaos..', orientation: 'landscape' },
    { id: '18', url: '/photography/PXL_20260131_233605673.BURST-01.webp', description: 'the moon in broad daylight', orientation: 'landscape' },
    { id: '19', url: '/photography/SGCAM_20251127_134227019.webp', description: 'cat on patrol', orientation: 'landscape' },
    { id: '20', url: '/photography/SGCAM_20251127_134233696.webp', description: 'morning stretches on the hood', orientation: 'landscape' },
    { id: '21', url: '/photography/PXL_20260301_211813696.webp', description: 'A cute wild Tan jumping spider!' }
  ];

  const next = (e?: any) => {
    e?.stopPropagation();
    if (idx !== null) setIdx((idx + 1) % photos.length);
  };
  const prev = (e?: any) => {
    e?.stopPropagation();
    if (idx !== null) setIdx((idx - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    const on_key = (e: KeyboardEvent) => {
      if (idx === null) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') setIdx(null);
    };
    window.addEventListener('keydown', on_key);
    return () => window.removeEventListener('keydown', on_key);
  }, [idx]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      <header className="page-header flex flex-row items-end gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <h2 className="page-title">Lens</h2>
        </div>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[350px] grid-flow-dense px-4 md:px-0">
        {photos.map((photo, i) => {
          const portrait = photo.orientation === 'portrait';
          const large = i % 8 === 0 && !portrait; 
          const wide = i % 5 === 2 && !portrait && !large;
          
          return (
            <motion.div
              key={photo.id}
              initial={{
                opacity: 0,
                scale: 0.95
              }}
              whileInView={{
                opacity: 1,
                scale: 1
              }}
              viewport={{ margin: "200px" }}
              transition={{ 
                duration: 0.4,
                delay: i < 6 ? 0 : (i % 5) * 0.05 
              }}
              className={cn(
                "rounded-[2.5rem] overflow-hidden cursor-pointer relative group border-2 border-transparent hover:border-[var(--primary)] transition-all motion-gpu",
                large ? "md:col-span-2 md:row-span-2" :
                wide ? "md:col-span-2" :
                portrait ? "row-span-2" : ""
              )}
              onClick={() => setIdx(i)}
            >
              <img
                src={photo.url}
                alt={photo.description}
                loading={i < 6 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xl font-bold leading-tight drop-shadow-lg">{photo.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {idx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-[var(--surface)]/95 backdrop-blur-xl overflow-hidden"
            onClick={() => setIdx(null)}
          >
            <div className="flex items-start justify-between p-6 md:p-8 z-[210] gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]"></div>
                <div className="text-[var(--on-surface)] font-display font-black text-2xl md:text-4xl tracking-tight">
                  {photos[idx].description}
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
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95
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
                  src={photos[idx].url}
                  className="max-w-full max-h-full object-contain rounded-xl md:rounded-[2rem] shadow-2xl border border-[var(--outline-variant)]/20 pointer-events-none"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>
            </div>
            <div className="p-6 md:p-10 bg-[var(--surface-variant)]/40 border-t border-[var(--outline-variant)]/20 backdrop-blur-xl z-[210] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--on-surface-variant)] opacity-40 mb-1">position</span>
                  <div className="flex items-center gap-2 text-[var(--on-surface)] font-mono">
                    <span className="text-[var(--primary)] font-bold">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="opacity-20">/</span>
                    <span className="opacity-60">{String(photos.length).padStart(2, '0')}</span>
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
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--on-surface-variant)] opacity-40">use keys or arrows to cycle images</span>
              </div>
              
              <div className="flex md:hidden items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--on-surface-variant)] opacity-40">swipe left/right to cycle images</span>
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
          <Card key={item.id} delay={i * 0.1} className="relative overflow-hidden group border-2 border-[var(--outline-variant)] bg-[var(--surface)] hover:border-[var(--primary)]">
            <div className="relative z-10 space-y-6 p-2">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--primary)] text-[var(--on-primary)]">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-4xl font-display font-black tracking-tight">{item.title}</h3>
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
                        <span className="text-[var(--primary)] font-bold">›</span>
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
                    {item.tools.map(tool => (
                      <span key={tool} className="px-3 py-1 rounded-lg bg-[var(--surface-variant)] text-[var(--on-surface)] text-xs font-bold border border-[var(--outline-variant)]">
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
  const pets = [
    { 
      name: 'INK', 
      species: 'Phidippus audax', 
      type: 'Jumping Spider', 
      desc: 'The curious one, she really likes staring at me. Dont tell anyone else, but shes my favorite..',
      image: '/photography/PXL_20260108_040856251.webp'
    },
    { 
      name: 'Rune', 
      species: 'Aphonopelma seemanni', 
      type: 'Tarantula', 
      desc: 'Costa Rican Zebra. Spends most of the time being a professional interior decorator (spilling her water and hiding).',
      image: '/photography/20251221_035746.webp'
    },
  ];

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
              className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-12"
            >
              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  y: 20
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
                        <span key={tag} className="px-4 py-2 bg-[var(--surface-variant)]/50 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
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
              <motion.span className="text-[var(--primary)] select-none relative z-[60] inline-block">.</motion.span>
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
            <span className="px-3 py-3 md:px-4 md:py-4 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-lg text-[10px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 md:w-[17px] md:h-[17px]" /> Researching
            </span>
            <span className="px-3 py-3 md:px-4 md:py-4 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-lg text-[10px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 md:w-[17px] md:h-[17px]" /> Nederland
            </span>
            <span className="px-3 py-3 md:px-4 md:py-4 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-lg text-[10px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-[17px] md:h-[17px]" /> 4+ Years XP
            </span>
            <span className="px-3 py-3 md:px-3 md:py-4 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-lg text-[10px] md:text-[13px] font-black tracking-widest flex items-center gap-2">He/Him They/Them</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 lg:col-span-8">
          <div className="relative group/terminal h-full">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="bg-[#0a0a0a] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl h-full min-h-[300px] md:min-h-[400px] flex flex-col font-mono relative"
            >
              {/* term head */}
              <div className="px-6 py-3 md:py-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-center relative">
                <span className="text-[10px] md:text-sm text-white/40 tracking-[0.2em] flex items-center font-black uppercase whitespace-nowrap">
                  virex@shinigami
                </span>
              </div>

              {/* term body */}
              <div className="p-6 md:p-10 text-[12px] md:text-[15px] leading-relaxed space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[var(--primary)] font-black">❯</span>
                    <span className="text-white/90">./info_util.sh --verbose</span>
                  </div>

                  <div className="pl-4 md:pl-6 space-y-2 md:space-y-1">
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">OS</span>
                      <span className="text-white/60 text-right sm:text-left">Alpine Linux (v3.23) x86_64</span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">Shell</span>
                      <span className="text-white/60 text-right sm:text-left">zsh</span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">Kernel</span>
                      <span className="text-white/60 text-right sm:text-left">6.18.19-0-lts</span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">CPU</span>
                      <span className="text-white/60 text-right sm:text-left">i5-14600K (20) @ 5.3GHz</span>
                    </div>
                    <div className="flex justify-between sm:justify-start gap-4">
                      <span className="text-[var(--primary)] font-bold opacity-80 uppercase text-[10px] md:text-[13px] min-w-[65px] md:min-w-[80px]">GPU</span>
                      <span className="text-white/60 text-right sm:text-left">AMD Radeon RX 6800 XT</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
            </motion.div>
          </div>
        </div>
        <Card className="md:col-span-12 lg:col-span-4 p-10 flex flex-col justify-between bg-[var(--primary-container)] text-[var(--on-primary-container)] border-none relative overflow-hidden group">
          <div className="space-y-6 relative z-10">
            <p className="text-2xl font-display font-black leading-tight tracking-tight">
              {"security isnt a feature you just jump on. the only honest way to defend something is to know exactly how it falls apart."}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Fingerprint size={160} />
          </div>
        </Card>

        <div className="md:col-span-12 grid grid-cols-2 gap-4 md:gap-6">
          <Card className="p-6 md:p-10 space-y-4 md:space-y-8 h-full bg-[var(--surface-variant)]/40 border-none shadow-sm flex flex-col justify-between">
            <h3 className="text-xl md:text-3xl font-display font-black tracking-tight">Web</h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2.5">
              {TECH_STACK.web.map(tech => (
                <span key={tech} className="px-2 py-1 md:px-4 md:py-2 bg-[var(--primary-container)]/30 text-[var(--on-surface)] rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold border-2 border-transparent transition-all">
                  {tech}
                </span>
              ))}
            </div>
          </Card>
          <Card className="p-6 md:p-10 space-y-4 md:space-y-8 h-full bg-[var(--surface-variant)]/40 border-none shadow-sm flex flex-col justify-between">
            <h3 className="text-xl md:text-3xl font-display font-black tracking-tight">Tech</h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2.5">
              {TECH_STACK.technical.map(tech => (
                <span key={tech} className="px-2 py-1 md:px-4 md:py-2 bg-[var(--primary-container)]/30 text-[var(--on-surface)] rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold border-2 border-transparent transition-all">
                  {tech}
                </span>
              ))}
            </div>
          </Card>
        </div>
        <div className="md:col-span-12">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{ once: true }}
            className="relative rounded-[3.5rem] overflow-hidden bg-[var(--primary-container)] text-[var(--on-primary-container)] border-4 border-[var(--outline-variant)] shadow-2xl group p-10 md:p-16 space-y-10"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-md font-bold opacity-60 flex items-center gap-2">
                    <Activity size={14} /> 2021 —  present
                  </span>
                </div>
                <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.95] group-hover:translate-x-2 transition-transform duration-500">
                  virex lore
                </h3>
              </div>
              <button 
                onClick={() => setExpanded({
                  category: 'evolution',
                  title: 'virex lore',
                  icon: <Activity size={320} />,
                  content: (
                    <div className="space-y-6">
                      <p>
                        i started my <span className="font-bold text-[var(--primary)]">junior software researching</span> around 2021, focusing on security and scripting.
                      </p>
                      <p>
                        what started as a curiosity for how software worked quickly turned into a huge interest for <span className="font-bold text-[var(--primary)]">programming</span> and hardware interest.
                      </p>
                      <p>
                        since then, i became a <span className="font-bold text-[var(--primary)]">semi-fullstack developer</span> with a big interest in cybersecurity and programming.
                      </p>
                    </div>
                  )
                })}
                className="md:hidden w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all group/btn shrink-0"
              >
                <Maximize2 size={20} className="group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 border-t border-[var(--on-primary-container)]/10 pt-10">
            {/* copy and paste */}
              <div className="space-y-6 text-xl opacity-80 leading-relaxed font-medium text-pretty">
                <p>
                  i started my <span className="font-bold text-[var(--primary)]">junior software researching</span> around 2021, focusing on security and scripting.
                </p>
                <p className="hidden md:block">
                  what started as a curiosity for how software worked quickly turned into a huge interest for <span className="font-bold text-[var(--primary)]">programming</span> and hardware interest.
                </p>
              </div>
              <div className="hidden md:block space-y-6 text-xl opacity-80 leading-relaxed font-medium text-pretty">
                <p>
                  since then, i became a <span className="font-bold text-[var(--primary)]">semi-fullstack developer</span> with a big interest in cybersecurity and programming.
                </p>
                <p>
                  by the end of 2023, my focus shifted toward <span className="font-bold text-[var(--primary)]">linux</span> and <span className="font-bold text-[var(--primary)]">programming languages</span>.
                </p>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <Activity size={320} />
            </div>
          </motion.div>
        </div>

        <div className="md:col-span-12 grid grid-cols-2 gap-4 md:gap-8">
          <Card className="p-5 md:p-10 space-y-4 md:space-y-8 bg-[var(--surface-variant)]/30 border-2 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary-container)]/10">
            <div className="space-y-3 md:space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 md:gap-3">
                  
                </div>
                <button 
                  onClick={() => setExpanded({
                    category: 'mission',
                    title: 'my personal take',
                    tags: ['research', 'privacy', 'performance', 'aesthetics'],
                    content: (
                      <div className="space-y-6">
                        <p>the internet went to shit, and i push back!</p>
                        <p>
                          using minimal libraries, durable design, even software that just does what it says and nothing else.
                          good code can be used as a form of protest.
                        </p>
                      </div>
                    )
                  })}
                  className="md:hidden w-8 h-8 rounded-xl bg-[var(--surface)] border border-[var(--outline-variant)] flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-container)]/20 transition-all group/btn"
                >
                  <Maximize2 size={16} className="group-hover/btn:scale-110" />
                </button>
              </div>
              <div className="space-y-2 md:space-y-4">
                <h4 className="text-lg md:text-3xl font-display font-black leading-tight">my personal take</h4>
                <p className="text-xs md:text-lg opacity-60 leading-tight md:leading-relaxed text-pretty font-medium line-clamp-4 md:line-clamp-none">
                  the internet went to shit, and i push back! using minimal libraries, durable design, even software that just does what it says and nothing else.
                </p>
              </div>
              <div className="pt-4 hidden md:flex flex-wrap gap-2 border-t border-[var(--outline-variant)]/30">
                {['research', 'privacy', 'performance', 'aesthetics'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[var(--surface-variant)]/50 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-5 md:p-10 space-y-4 md:space-y-8 bg-[var(--surface-variant)]/30 border-2 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary-container)]/10">
            <div className="space-y-3 md:space-y-6">
              <div className="flex justify-between items-start">
                <button 
                  onClick={() => setExpanded({
                    category: 'library',
                    title: '..and archival!',
                    tags: ['archival', 'privacy', 'aesthetics'],
                    content: (
                      <div className="space-y-6">
                        <p>preservation by nature.</p>
                        <p>
                          i collect legacy software, old documentation, and i keep backups of everything i find.
                        </p>
                      </div>
                    )
                  })}
                  className="md:hidden w-8 h-8 rounded-xl bg-[var(--surface)] border border-[var(--outline-variant)] flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-container)]/20 transition-all group/btn"
                >
                  <Maximize2 size={16} className="group-hover/btn:scale-110" />
                </button>
              </div>
              <div className="space-y-2 md:space-y-4">
                <h4 className="text-lg md:text-3xl font-display font-black leading-tight">.. and archival!</h4>
                <p className="text-xs md:text-lg opacity-60 leading-tight md:leading-relaxed text-pretty font-medium line-clamp-4 md:line-clamp-none">
                  preservation by nature. i collect legacy software, old documentation, and i keep backups of everything i find.
                </p>
              </div>
              <div className="pt-4 hidden md:flex flex-wrap gap-2 border-t border-[var(--outline-variant)]/30">
                {['archival', 'privacy', 'aesthetics'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[var(--surface-variant)]/50 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
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
          <h2 className="text-4xl font-display font-black tracking-tight">you can find me here!</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://github.com/hnpf" target="_blank" className="m3-button-tonal px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-black hover:text-white transition-all shadow-lg">
            <Github size={20} />
            GitHub
          </a>
          <a href="https://discord.gg/vixencommunity" target="_blank" className="m3-button-tonal px-8 h-14 rounded-2xl font- tracking-widest text-md flex items-center gap-3 hover:bg-[#5865F2] hover:text-white transition-all shadow-lg">
            <MessageSquare size={20} />
            vixen
          </a>
          <a href="mailto:deprecated@virex.lol" className="m3-button-tonal px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-all shadow-lg">
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
  const [page, setPage] = useState('home');
  const [do_wiggle, setDoWiggle] = useState(false);

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
      if (e.key === 'Escape' && settings.focusMode) {
        updateSettings({ focusMode: false });
      }
    };
    window.addEventListener('keydown', on_key);
    return () => window.removeEventListener('keydown', on_key);
  }, [settings.focusMode, updateSettings]);

  const [blogPostId, setBlogPostId] = useState<string | null>(null);
  const [hwOpen, setHwOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // keeping the address bar in sync with state so the back button actually fucking works
  useEffect(() => {
    const sync_url = () => {
      const loc = window.location.pathname;
      if (loc === '/' || loc === '') {
        setPage('home');
        setBlogPostId(null);
      } else if (loc.startsWith('/blog/')) {
        const id = loc.split('/')[2];
        setPage('blog');
        setBlogPostId(id);
      } else {
        const path = loc.replace('/', '').toLowerCase();
        const ALLOWED_SECTIONS = ['home', 'blog', 'lens', 'tracker', 'readme', 'loom', 'changelog', 'dash', 'no'];
        setPage(ALLOWED_SECTIONS.includes(path) ? path : '404');
        setBlogPostId(null);
      }
    };

    sync_url();
    window.addEventListener('popstate', sync_url);
    return () => window.removeEventListener('popstate', sync_url);
  }, []);

  // updating the title so people know where they are lol
  // console.log('page:', page, blogPostId)
  useEffect(() => {
    const name = page === 'readme' ? 'Info' : page.charAt(0).toUpperCase() + page.slice(1);
    const title = (page === 'blog' && blogPostId) 
      ? `Virex | ${BLOG_POSTS.find(p => p.id === blogPostId || p.link === blogPostId)?.title || 'Post'}`
      : page === 'home' ? 'Virex' : `Virex | ${name}`;
    document.title = title;

    // gotta also update the social tags for the seo ppl
    let desc = "i am virex. a software researcher and problem solver, i explore systems and programming, UI/UX, and security research.";
    let og_title = title;
    let og_img = "https://virex.lol/photography/pfp/main.png";
    if (page === 'blog' && blogPostId) {
      const p = BLOG_POSTS.find(p => p.id === blogPostId || p.link === blogPostId);
      if (p) {
        desc = p.snippet;
        og_title = `Virex Blog | ${p.title}`;
      }
    } else if (page === 'readme') {
      desc = "README: my personal biography, a quick summary about my mission, and identity.";
    } else if (page === 'loom') {
      desc = "loom: a small, expressive, and efficient programming language built for speed and readability.";
    } else if (page === 'lens') {
      desc = "lens: my photography collection, all done with a literal phone.";
    }

    const set_meta = (key: string, val: string, is_prop = false) => {
      let el = document.querySelector(is_prop ? `meta[property="${key}"]` : `meta[name="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (is_prop) el.setAttribute('property', key);
        else el.setAttribute('name', key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };
    set_meta('description', desc);
    set_meta('og:title', og_title, true);
    set_meta('og:description', desc, true);
    set_meta('og:image', og_img, true);
    set_meta('twitter:title', og_title);
    set_meta('twitter:description', desc);

    // --- JSON-LD structured stuff ---
    const old_ld = document.getElementById('json-ld-structured-data');
    if (old_ld) old_ld.remove();

    const ld: any = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Virex",
      "url": "https://virex.lol",
      "author": {
        "@type": "Person",
        "name": "virex"
      }
    };
    // ok

    if (page === 'blog' && blogPostId) {
      const p = BLOG_POSTS.find(p => p.id === blogPostId || p.link === blogPostId);
      if (p) {
        ld["@type"] = "BlogPosting";
        ld["headline"] = p.title;
        ld["description"] = p.snippet;
        ld["datePublished"] = new Date(p.date).toISOString();
        ld["author"] = { "@type": "Person", "name": "Virex" };
      }
    }

    const script = document.createElement('script');
    script.id = 'json-ld-structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);

  }, [page, blogPostId, settings.accent, settings.mode]); 

  const goto = (newPage: string, postId: string | null = null) => {
    const url = newPage === 'home' ? '/' : postId ? `/blog/${postId}` : `/${newPage}`;
    window.history.pushState({}, '', url);
    setPage(newPage);
    setBlogPostId(postId);
    window.scrollTo(0, 0);
  };

  const [show_top, setShowTop] = useState(false);
  useEffect(() => {
    const on_scroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', on_scroll);
    return () => window.removeEventListener('scroll', on_scroll);
  }, []);

  // back to top
  return (
    <div className={cn(
      "min-h-screen flex flex-col lg:flex-row font-sans relative",
      settings.sidebarFlipped && "lg:flex-row-reverse"
    )}>
      <AnimatePresence>
        {show_top && (
          <motion.button
            key={settings.sidebarFlipped ? 'flipped' : 'normal'}
            layout
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 20
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn(
              "fixed bottom-24 lg:bottom-12 z-50 p-4 bg-[var(--primary)] text-[var(--on-primary)] rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-md",
              settings.sidebarFlipped 
                ? "right-6 lg:right-auto lg:left-12" 
                : "right-6 lg:right-12"
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
              className="fixed top-0 left-0 right-0 h-32 z-[100] pointer-events-none backdrop-blur-xl"
              style={{ maskImage: 'linear-gradient(to bottom, black, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)' }}
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 h-32 z-[100] pointer-events-none backdrop-blur-xl"
              style={{ maskImage: 'linear-gradient(to top, black, transparent)', WebkitMaskImage: 'linear-gradient(to top, black, transparent)' }}
            />
          </>
        )}
      </AnimatePresence>
      {/*desktop sidebar*/}
      <AnimatePresence mode="popLayout">
        {!settings.focusMode && page !== 'no' && (
          <motion.aside 
            initial={{
              x: settings.sidebarFlipped ? 400 : -400,
              opacity: 0
            }}
            animate={{
              x: 0,
              opacity: 1
            }}
            exit={{
              x: settings.sidebarFlipped ? 400 : -400,
              opacity: 0
            }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className={cn(
              "hidden lg:flex flex-col sticky top-0 h-screen z-40 bg-[var(--outline-variant)] transition-[width] duration-300 ease-in-out",
              settings.sidebarCollapsed ? "w-28" : "w-80",
              settings.sidebarFlipped 
                ? "pl-[var(--sidebar-border)] py-[var(--sidebar-border)] rounded-l-[3rem]" 
                : "pr-[var(--sidebar-border)] py-[var(--sidebar-border)] rounded-r-[3rem]"
            )}
          >
            <div className={cn(
              "flex flex-col h-full w-full bg-[var(--surface)] transition-all duration-300",
              settings.sidebarCollapsed ? "p-4" : "p-6",
              settings.sidebarFlipped ? "rounded-l-[2.375rem]" : "rounded-r-[2.375rem]"
            )}>
              <div className={cn(
                "flex items-center gap-4 py-6 mb-10",
                settings.sidebarCollapsed ? "justify-center px-0" : "px-2"
              )}>
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  animate={do_wiggle ? { 
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
                  } : { rotate: 0, scale: 1 }}
                  transition={do_wiggle ? {
                    duration: 1.2,
                    repeat: 1, // nvm // exactly twice? 
                    repeatDelay: 0.1,
                    ease: "easeInOut"
                  } : { duration: 0.3 }} // snappy return.
                  onClick={() => goto('readme')}
                  className="w-14 h-14 rounded-3xl bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-black text-3xl shadow-xl shrink-0 overflow-hidden group/pfp cursor-pointer"
                >
                  <img 
                    src="/photography/pfp/main.png" 
                    alt="virex" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const svg = document.createElement('img');
                      svg.src = '/2.svg';
                      svg.className = 'w-10 h-10 p-1 transition-transform group-hover/pfp:scale-110';
                      svg.style.color = 'var(--on-primary)';
                      (e.target as HTMLImageElement).parentElement!.appendChild(svg);
                    }}
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                {!settings.sidebarCollapsed && (
                  <div className="overflow-hidden whitespace-nowrap">
                    <div className="font-display font-black text-2xl tracking-tighter">virex (美烈久)</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-black">dev/cybersec</div>
                  </div>
                )}
              </div>
              <nav className="flex-1 flex flex-col gap-3">
                <SideItem glyph={Home} text="Home" isSelected={page === 'home'} onSelect={() => goto('home')} isMini={settings.sidebarCollapsed} />
                <SideItem glyph={Fingerprint} text="Info" isSelected={page === 'readme'} onSelect={() => goto('readme')} isMini={settings.sidebarCollapsed} />
                <SideItem glyph={BookText} text="Blog" isSelected={page === 'blog'} onSelect={() => goto('blog')} isMini={settings.sidebarCollapsed} />
                <SideItem glyph={Camera} text="Lens" isSelected={page === 'lens'} onSelect={() => goto('lens')} isMini={settings.sidebarCollapsed} />
                <SideItem glyph={Activity} text="Tracker" isSelected={page === 'tracker'} onSelect={() => goto('tracker')} isMini={settings.sidebarCollapsed} />
                <SideItem glyph={LinkIcon} text="Short" isSelected={page === 'dash'} onSelect={() => goto('dash')} isMini={settings.sidebarCollapsed} />
                {/*<SideItem glyph={Terminal} text="Loom" isSelected={page === 'loom'} onSelect={() => goto('loom')} isMini={settings.sidebarCollapsed} />*/}
              </nav>
              <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-[var(--outline-variant)]">
                <div className={cn("flex gap-2", settings.sidebarCollapsed && "flex-col items-center")}>
                  <button 
                    onClick={cycleTheme}
                    className={cn(
                      "flex items-center justify-center p-4 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] rounded-2xl transition-all group relative",
                      settings.sidebarCollapsed ? "w-14 h-14" : "flex-1"
                    )}
                  >
                    {actualTheme === 'light' && <Sun size={20} />}
                    {actualTheme === 'dark' && <Moon size={20} />}
                    <div className="absolute bottom-full mb-4 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none uppercase font-black">Cycle Theme</div>
                  </button>
                  <button 
                    onClick={() => setHwOpen(true)}
                    className={cn(
                      "flex items-center justify-center p-4 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] rounded-2xl transition-all group relative",
                      settings.sidebarCollapsed ? "w-14 h-14" : "flex-1"
                    )}
                  >
                    <Cpu size={20} />
                    <div className="absolute bottom-full mb-4 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none uppercase font-black">Hardware</div>
                  </button>
                </div>
                <SideItem glyph={SettingsIcon} text="Settings" onSelect={() => setSettingsOpen(true)} isMini={settings.sidebarCollapsed} />
                
                <AnimatePresence>
                  {!settings.sidebarCollapsed && (
                    <motion.div 
                      initial={{
                        opacity: 0,
                        height: 0
                      }}
                      animate={{
                        opacity: 1,
                        height: 'auto'
                      }}
                      exit={{
                        opacity: 0,
                        height: 0
                      }}
                      className="flex gap-2 overflow-hidden"
                    >
                      <a href="https://github.com/hnpf" target="_blank" className="flex items-center justify-center p-4 hover:bg-[var(--surface-variant)] rounded-2xl transition-all flex-1"><Github size={20} /></a>
                      <a href="https://discord.gg/vixencommunity" target="_blank" className="flex items-center justify-center p-4 hover:bg-[var(--surface-variant)] rounded-2xl transition-all flex-1"><MessageSquare size={20} /></a>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={() => updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })}
                  className={cn(
                    "flex items-center justify-center p-4 hover:bg-[var(--surface-variant)] rounded-2xl transition-all",
                    settings.sidebarCollapsed && "w-14 mx-auto"
                  )}
                >
                  {settings.sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/*main*/}
      <motion.main 
        layout
        className="flex-1 p-6 md:p-12 lg:p-16 pb-40 lg:pb-16 overflow-x-hidden page-container"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page + (blogPostId || '')}
            initial={{
              opacity: 0,
              y: 15,
              scale: 0.98
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: -15,
              scale: 0.98
            }}
            transition={{
              duration: settings.disableAnimations ? 0 : 0.4,
              ease: [0.22, 1, 0.36, 1], // custom cubic for a somewhat fluid feel
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 25,
              }
            }}
            className="motion-gpu"
          >
            {page === 'home' && <HomePage setPage={goto} settings={settings} />}
            {page === 'blog' && <BlogPage targetId={blogPostId} navigateTo={goto} />}
            {page === 'lens' && <LensPage />}
            {page === 'tracker' && <TrackerPage />}
            {page === 'readme' && <ReadmePage setPage={goto} />}
            {page === 'loom' && <LoomPage />}
            {page === 'changelog' && <ChangelogPage />}
            {page === 'dash' && <DashPage />}
            {page === 'no' && <NoPage />}
            {!['home', 'blog', 'lens', 'tracker', 'readme', 'loom', 'changelog', 'dash', 'no'].includes(page) && (
              <NotFound go={goto} />
            )}
          </motion.div>
        </AnimatePresence>
        {/*exit focus mode main button*/}
        <AnimatePresence>
          {settings.focusMode && (
            <motion.button
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 20
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 20
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ focusMode: false })}
              className="fixed bottom-15 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[var(--primary)] text-[var(--on-primary)] rounded-full font-bold shadow-2xl flex items-center gap-3 border-2 border-white/20 backdrop-blur-md"
            >
              <EyeOff size={20} />
              <span>exit focus:</span>
              <span className="text-[10px] opacity-60 bg-black/20 px-2 py-0.5 rounded uppercase tracking-wider">Esc</span>
              <span>or click me!</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.main>
      <AnimatePresence>
        {(!settings.focusMode && page !== 'no') && (
          <motion.nav 
            initial={{
              y: 100,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            exit={{
              y: 100,
              opacity: 0
            }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--outline-variant)] px-4 pt-1 pb-[env(safe-area-inset-bottom,16px)] flex justify-around z-40 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] motion-gpu"
            style={{ willChange: 'transform' }}
          >
            <BotNav glyph={Home} text="Home" isSelected={page === 'home'} onSelect={() => goto('home')} />
            <BotNav glyph={Fingerprint} text="Info" isSelected={page === 'readme'} onSelect={() => goto('readme')} />
            <BotNav glyph={BookText} text="Blog" isSelected={page === 'blog'} onSelect={() => goto('blog')} />
            <BotNav glyph={Camera} text="Lens" isSelected={page === 'lens'} onSelect={() => goto('lens')} />
            <BotNav glyph={SettingsIcon} text="More" onSelect={() => setSettingsOpen(true)} />
          </motion.nav>
        )}
      </AnimatePresence>
      {/* the sidebar for when you wanna see the machine, kinda pointless but nice to have*/}
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--surface)] z-[60] p-8 overflow-y-auto border-l border-[var(--outline)]"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold">Hardware</h2>
                <button onClick={() => setHwOpen(false)} className="p-2 hover:bg-[var(--surface-variant)] rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-8">
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Core System</h3>
                  <div className="grid gap-4">
                    {HARDWARE_SPECS.core.map(spec => (
                      <div key={spec.label} className="p-4 bg-[var(--surface-variant)] rounded-3xl">
                        <div className="text-xs opacity-50 mb-1">{spec.label}</div>
                        <div className="font-bold">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">processors</h3>
                  <div className="grid gap-4">
                    {HARDWARE_SPECS.processing.map(spec => (
                      <div key={spec.label} className="p-4 bg-[var(--surface-variant)] rounded-3xl">
                        <div className="text-xs opacity-50 mb-1">{spec.label}</div>
                        <div className="font-bold">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Storage and memory</h3>
                  <div className="grid gap-4">
                    {HARDWARE_SPECS.mem.map(spec => (
                      <div key={spec.label} className="p-4 bg-[var(--surface-variant)] rounded-3xl">
                        <div className="text-xs opacity-50 mb-1">{spec.label}</div>
                        <div className="font-bold">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* the big settings modal */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
                y: 10
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: 10
              }}
              className="relative w-full max-w-xl bg-[var(--surface)] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[var(--outline-variant)]"
            >
              <div className="flex justify-between items-center p-6 md:p-8 border-b border-[var(--outline-variant)] bg-[var(--surface)] sticky top-0 z-10">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <SettingsIcon size={24} className="text-[var(--primary)]" />
                  Settings
                </h2>
                <button onClick={() => setSettingsOpen(false)} className="p-2 hover:bg-[var(--surface-variant)] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 md:p-10 space-y-10 overflow-y-auto scrollbar-hide">
                {/*making things look pretty pretty */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Palette size={20} className="text-[var(--primary)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">appearance</h3>
                  </div>
                  <div className="relative grid grid-cols-3 gap-2 p-1.5 bg-[var(--surface-variant)] rounded-full overflow-hidden">
                    {/* sliding shit */}
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        layoutId="active-mode-bg"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute inset-y-1.5 bg-[var(--primary)] rounded-full shadow-lg z-0"
                        style={{
                          left: settings.mode === 'light' ? '6px' : settings.mode === 'dark' ? '33.33%' : '66.66%',
                          width: 'calc(33.33% - 8px)',
                          marginLeft: settings.mode === 'dark' ? '4px' : settings.mode === 'system' ? '2px' : '0px'
                        }}
                      />
                    </AnimatePresence>
                    {(['light', 'dark', 'system'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => updateSettings({ mode: m })}
                        className={cn(
                          "relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-full transition-colors capitalize text-sm font-bold",
                          settings.mode === m
                            ? "text-[var(--on-primary)]"
                            : "text-[var(--on-surface-variant)] hover:bg-black/5"
                        )}
                      >
                        {m === 'light' && <Sun size={16} />}
                        {m === 'dark' && <Moon size={16} />}
                        {m === 'system' && <Monitor size={16} />}
                        <span className="hidden sm:inline">{m}</span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="text-sm font-bold text-[var(--on-surface)]">Accent Color</div>
                    <div className="flex flex-wrap gap-4">
                      {(['orange', 'blue', 'green', 'red', 'purple', 'custom'] as const).map(c => (
                        <button
                          key={c}
                          onClick={() => updateSettings({ accent: c })}
                          className={cn(
                            "group relative w-12 h-12 rounded-[1rem] overflow-hidden transition-all duration-300 shadow-sm",
                            settings.accent === c 
                              ? "ring-2 ring-[var(--on-surface)] ring-offset-4 ring-offset-[var(--surface)] scale-110" 
                              : "hover:scale-105"
                          )}
                        >
                          {c === 'custom' ? (
                            <div className="absolute inset-0 bg-[var(--surface-variant)] flex items-center justify-center">
                              <Pipette size={20} className="text-[var(--on-surface-variant)]" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex">
                              <div className={cn(
                                "w-1/2 h-full",
                                c === 'orange' && "bg-orange-500",
                                c === 'blue' && "bg-blue-500",
                                c === 'green' && "bg-emerald-500",
                                c === 'red' && "bg-rose-500",
                                c === 'purple' && "bg-purple-500"
                              )} />
                              <div className="w-1/2 h-full flex flex-col">
                                <div className={cn(
                                  "h-1/2 w-full",
                                  c === 'orange' && "bg-orange-300",
                                  c === 'blue' && "bg-blue-300",
                                  c === 'green' && "bg-emerald-300",
                                  c === 'red' && "bg-rose-300",
                                  c === 'purple' && "bg-purple-300"
                                )} />
                                <div className={cn(
                                  "h-1/2 w-full",
                                  c === 'orange' && "bg-orange-700",
                                  c === 'blue' && "bg-blue-700",
                                  c === 'green' && "bg-emerald-700",
                                  c === 'red' && "bg-rose-700",
                                  c === 'purple' && "bg-purple-700"
                                )} />
                              </div>
                            </div>
                          )}
                          {settings.accent === c && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                              <div className="bg-white rounded-full p-0.5 shadow-md">
                                <Check size={14} className="text-black" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {settings.accent === 'custom' && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0
                        }}
                        animate={{
                          opacity: 1,
                          height: 'auto'
                        }}
                        className="pt-2 space-y-3"
                      >
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-50 px-1">
                          <span>Hue Shift</span>
                          <span className="text-[var(--primary)] font-bold">{settings.hue}°</span>
                        </div>
                        <div className="relative h-8 flex items-center">
                          <input 
                            type="range" min="0" max="360" 
                            value={settings.hue} 
                            onChange={(e) => updateSettings({ hue: parseInt(e.target.value) })}
                            className="w-full h-3 rounded-full appearance-none cursor-pointer bg-transparent relative z-10 
                                      [&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:rounded-full
                                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                                      [&::-webkit-slider-thumb]:border-[4px] [&::-webkit-slider-thumb]:border-[var(--primary)]
                                      [&::-webkit-slider-thumb]:-mt-[6px] [&::-webkit-slider-thumb]:shadow-xl
                                      [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
                                      active:[&::-webkit-slider-thumb]:scale-110"
                            style={{
                              background: 'linear-gradient(to right, oklch(0.6 0.15 0), oklch(0.6 0.15 60), oklch(0.6 0.15 120), oklch(0.6 0.15 180), oklch(0.6 0.15 240), oklch(0.6 0.15 300), oklch(0.6 0.15 360))'
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </section>
                {/* little toggles to change stuff */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Layers size={20} className="text-[var(--primary)]" />
                    <h3 className="text-md font-black tracking-[0.2em] text-[var(--on-surface-variant)]">Extras</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'helloAnimation', label: 'Hello Animation', desc: 'fluent language-cycling virex header' },
                      { key: 'brutalistMode', label: 'Brutalist Mode', desc: 'sharp edges only' },
                      { key: 'developerFont', label: 'Developer Font', desc: 'use JetBrains Mono!' },
                      { key: 'focusMode', label: 'Focus Mode', desc: 'a minimal zen layout' },
                      { key: 'sidebarFlipped', label: 'Flip Sidebar', desc: 'changes desktop sidebar orientation to the right' },
                    ].map((tweak, index, array) => (
                      <button
                        key={tweak.key}
                        onClick={() => updateSettings({ [tweak.key]: !settings[tweak.key as keyof typeof settings] })}
                        className={cn(
                          "flex items-center justify-between p-5 transition-all text-left",
                          index === 0 ? "rounded-t-[1.5rem] rounded-b-[0.5rem]" : 
                          index === array.length - 1 ? "rounded-b-[1.5rem] rounded-t-[0.5rem]" : 
                          "rounded-[0.5rem]",
                          settings[tweak.key as keyof typeof settings] 
                            ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]" 
                            : "bg-[var(--surface-variant)] hover:bg-[var(--outline-variant)]/30"
                        )}
                      >
                        <div>
                          <div className="font-bold">{tweak.label}</div>
                          <div className="text-xs opacity-60 font-medium">{tweak.desc}</div>
                        </div>
                        <div className={cn(
                          "w-12 h-7 rounded-full relative transition-all duration-200 flex items-center px-[5px]",
                          settings[tweak.key as keyof typeof settings] ? "bg-[var(--primary)]" : "bg-black/20 dark:bg-white/20"
                        )}>
                          <motion.div
                            animate={{
                              x: settings[tweak.key as keyof typeof settings] ? 14 : 0,
                              scale: settings[tweak.key as keyof typeof settings] ? 1 : 0.8
                            }}
                            className="w-5 h-5 bg-white rounded-full shadow-md"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* boring ver info stuff */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Terminal size={20} className="text-[var(--primary)]" />
                    <h3 className="text-md font-black tracking-[0.2em] text-[var(--on-surface-variant)]">Other Info</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      goto('changelog');
                    }}
                    className="w-full flex items-center justify-between p-5 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all text-left rounded-[1.5rem] group"
                  >
                    <div>
                      <div className="font-bold">View changelog</div>
                      <div className="text-xs opacity-60 font-medium">See what's new in v2026.03.16</div>
                    </div>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}