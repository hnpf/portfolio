import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Info, 
  BookText, 
  Camera, 
  Activity, 
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
} from 'lucide-react';
import NotFound from './NotFound';
import { useTheme } from './ThemeContext';
import { cn, PROJECTS, BLOG_POSTS, TRACKER_ITEMS, HARDWARE_SPECS, TECH_STACK } from './constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Components ---

const HelloVirex = () => {
  const words = ['virex', 'вирекс', 'βίρεξ', 'וירקס', 'ヴィレックス', '维雷克斯', 'ڤيركس'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [index, words.length]);

  return (
    <div className="h-[8rem] md:h-[10rem] flex items-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[index]}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8, filter: 'blur(10px)' }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.5
          }}
          className="text-8xl md:text-[10rem] font-display font-black tracking-tighter leading-[0.8] text-balance"
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 px-4 py-3 rounded-[1.5rem] transition-all duration-150 group relative sidebar-item",
      active ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-lg" : "hover:bg-[var(--surface-variant)] text-[var(--on-surface-variant)]",
      collapsed && "justify-center px-0 w-14 mx-auto"
    )}
  >
    <Icon size={24} className={cn("shrink-0 transition-transform duration-150", active && "scale-110 rotate-3")} />
    {!collapsed && <span className="font-semibold tracking-tight">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-6 px-3 py-1.5 bg-[var(--on-surface)] text-[var(--surface)] text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-50 whitespace-nowrap shadow-xl motion-gpu">
        {label}
      </div>
    )}
  </button>
);

const BottomNavItem = ({ icon: Icon, label, active, onClick, image, initialWiggle }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 flex-1 pt-3 pb-2 transition-all duration-200 relative z-10 bottom-nav-item outline-none",
      active ? "text-[var(--on-surface)]" : "text-[var(--on-surface-variant)]"
    )}
  >
    <div className="relative flex items-center justify-center w-16 h-8 mb-1">
      <AnimatePresence mode="popLayout">
        {active && (
          <motion.div
            layoutId="active-pill"
            initial={{ opacity: 0, width: 32 }}
            animate={{ opacity: 1, width: 64 }}
            exit={{ opacity: 0, width: 32 }}
            className="absolute inset-0 bg-[var(--primary-container)] rounded-full -z-10 motion-gpu"
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          />
        )}
      </AnimatePresence>
      <motion.div
        animate={initialWiggle ? { 
          rotate: [0, -10, 10, -10, 10, 0],
          scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
        } : { rotate: 0, scale: 1 }}
        transition={initialWiggle ? {
          duration: 1.2,
          repeat: 1, // exactly twice
          repeatDelay: 0.1,
          ease: "easeInOut"
        } : { duration: 0.3 }} // snappy return
      >
        {image ? (
          <img 
            src={image} 
            alt={label} 
            className={cn(
              "w-6 h-6 rounded-full transition-transform duration-200 object-cover", 
              active ? "scale-110 ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-black/20" : "scale-100 grayscale opacity-60"
            )} 
          />
        ) : (
          <Icon 
            size={24} 
            className={cn("transition-transform duration-200", active ? "scale-110" : "scale-100")} 
            strokeWidth={active ? 2.5 : 2}
          />
        )}
      </motion.div>
    </div>
    <span className={cn(
      "text-[11px] font-bold tracking-tight transition-all duration-200",
      active ? "opacity-100" : "opacity-70"
    )}>{label}</span>
  </button>
);

const Card = ({ children, className, delay = 0, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
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
      duration: 0.4, 
      delay, 
      ease: [0.33, 1, 0.68, 1],
      scale: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }}
    onClick={onClick}
    className={cn("m3-card motion-gpu cursor-default", onClick && "cursor-pointer", className)}
  >
    {children}
  </motion.div>
);

const CodeBlock = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);
  
  // get text content from children (which is usually a <code> element)
  const getCodeText = (nodes: any): string => {
    if (typeof nodes === 'string') return nodes;
    if (Array.isArray(nodes)) return nodes.map(getCodeText).join('');
    if (nodes?.props?.children) return getCodeText(nodes.props.children);
    return '';
  };



  const code = getCodeText(children).replace(/\n$/, '');
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code">
      <button
        onClick={handleCopy}
        className="absolute right-4 top-4 p-2 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] text-[var(--on-surface-variant)] hover:text-[var(--on-primary-container)] rounded-xl transition-[background-color,opacity,transform,color] duration-150 opacity-0 group-hover/code:opacity-100 z-10 backdrop-blur-md border border-[var(--outline-variant)] active:scale-90"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>
      <pre className={cn(
        "bg-black/10 dark:bg-white/5 p-8 rounded-[2rem] overflow-x-auto font-mono text-sm my-8 border border-[var(--outline-variant)]",
        className
      )}>
        {children}
      </pre>
    </div>
  );
};

// --- Pages ---

const LoomDocsViewer = ({ onBack }: { onBack: () => void }) => {
  const [currentDoc, setCurrentDoc] = useState('tutorial.md');
  const [docContent, setDocContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [docsCache, setDocsCache] = useState<Record<string, string>>({});

  const docs = [
    { id: 'tutorial.md', label: 'Tutorial' },
    { id: 'benchmarks.md', label: 'Benchmarks' },
    { id: 'stdlib.md', label: 'Standard Library' },
    { id: 'concurrency.md', label: 'Concurrency' },
    { id: 'shell_scripting.md', label: 'Shell' },
    { id: 'expressive_comments.md', label: 'Comments' },
  ];

  // Pre-fetch all docs on mount for searching
  useEffect(() => {
    docs.forEach(doc => {
      fetch(`/loom/docs/markdown/${doc.id}`)
        .then(res => res.text())
        .then(text => setDocsCache(prev => ({ ...prev, [doc.id]: text })))
        .catch(console.error);
    });
  }, []);

  const filteredDocs = docs.filter(doc => {
    const query = searchQuery.toLowerCase();
    const labelMatch = doc.label.toLowerCase().includes(query);
    const contentMatch = docsCache[doc.id]?.toLowerCase().includes(query);
    return labelMatch || contentMatch;
  });

  useEffect(() => {
    setLoading(true);
    if (docsCache[currentDoc]) {
      setDocContent(docsCache[currentDoc]);
      setLoading(false);
    } else {
      fetch(`/loom/docs/markdown/${currentDoc}`)
        .then(res => res.text())
        .then(md => {
          setDocContent(md);
          setLoading(false);
        })
        .catch(err => {
          setDocContent('# Error\nCould not load the requested documentation.');
          setLoading(false);
        });
    }
  }, [currentDoc, docsCache]);

  const activeDoc = docs.find(d => d.id === currentDoc);
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Terminal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
        </div>
      </div>
      <div className="flex overflow-x-auto scrollbar-hide py-2 gap-3 px-2">
        {filteredDocs.map(doc => {
          const isContentMatch = searchQuery && !doc.label.toLowerCase().includes(searchQuery.toLowerCase()) && docsCache[doc.id]?.toLowerCase().includes(searchQuery.toLowerCase());
          return (
            <button
              key={doc.id}
              onClick={() => setCurrentDoc(doc.id)}
              className={cn(
                "px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 border-2 flex items-center gap-2",
                currentDoc === doc.id 
                  ? "bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] shadow-lg" 
                  : "bg-[var(--surface-variant)] text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--outline)]"
              )}
            >
              {doc.label}
              {isContentMatch && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" title="Match found in content" />}
            </button>
          );
        })}
      </div>
      <header className="space-y-6 pt-6">
        <div className="flex items-center gap-4">
          <span className="px-4 py-1.5 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-full text-xs font-black uppercase tracking-widest">
            loom documentation
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9]">{activeDoc?.label}</h1>
      </header>
      <motion.div
        key={currentDoc}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
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
              pre: ({ node, ...props }) => <CodeBlock {...props} />
            }}
          >
            {docContent}
          </ReactMarkdown>
        )}
      </motion.div>
    </div>
  );
};
const LoomPage = () => {
  const [copied, setCopied] = useState(false);
  const [viewDocs, setViewDocs] = useState(false);
  const installCmd = 'curl -s https://virex.lol/loom/install.sh | bash';

  const copyInstall = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewDocs) {
    return <LoomDocsViewer onBack={() => setViewDocs(false)} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-16 px-4 md:px-0 pb-20">
      <header className="space-y-6 pt-12 md:pt-0">
        <h1 className="text-8xl md:text-[10rem] font-display font-black tracking-tighter leading-[0.8] text-balance">
          LOOM
        </h1>
        <p className="text-2xl md:text-4xl font-display font-light text-[var(--on-surface-variant)] leading-tight max-w-4xl pt-4">
          A lightweight, expressive, and efficient programming language built for speed and simplicity.
        </p>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8 pt-8 border-t border-[var(--outline-variant)]">
        <Card delay={0.4} className="md:col-span-2 lg:col-span-1 xl:col-span-2 bg-[var(--primary)] text-[var(--on-primary)] border-none p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
          <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] tracking-tight">"Code with the speed of thought."</h2>
          <div>
            <br></br>
            <p className="text-xl md:text-2xl opacity-90 font-medium max-w-2xl mb-10 leading-snug">
              Loom combines low-level performance with a high-level, expressive syntax. 
              Designed for developers who demand both efficiency and readability.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setViewDocs(true)}
                className="m3-button-filled bg-white text-black text-xl h-16 px-10 rounded-2xl hover:scale-105"
              >
                Read the Docs <BookOpen size={24} />
              </button>
              <a 
                href="https://github.com/hnpf/LOOM_PROGRAMMING_LANGUAGE" 
                target="_blank"
                className="m3-button-tonal h-16 px-10 text-xl rounded-2xl border-white/20 border flex items-center gap-2"
              >
                GitHub <Github size={24} />
              </a>
            </div>
          </div>
        </Card>
        <Card delay={0.5} className="p-10 space-y-6">
          <h3 className="text-3xl font-display font-bold flex items-center gap-3">
            <Download className="text-[var(--primary)]" /> Install Loom
          </h3>
          <p className="text-xl opacity-70 leading-relaxed">
            Ready to start? Get the latest version of Loom with a single command.
          </p>
          <div className="relative group">
            <CodeBlock className="language-bash !my-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {installCmd}
            </CodeBlock>
          </div>
        </Card>
        <Card delay={0.6} className="p-10 space-y-6 bg-[var(--primary-container)] text-[var(--on-primary-container)]">
          <h3 className="text-3xl font-display font-bold flex items-center gap-3">
            <Terminal /> Hello World
          </h3>
          <CodeBlock className="language-loom !bg-black/5 !my-0 overflow-x-auto">
{`// Your first Loom program
act main() {
    print("Hello, world!")
}
main()`}
          </CodeBlock>
        </Card>
      </section>
    </div>
  );
};

const YearProgress = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl font-black tabular-nums tracking-tighter">
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">
          {now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
          <span>Year Progress</span>
          <span className="text-[var(--primary)]">{progress.toFixed(4)}%</span>
        </div>
        <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[var(--primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ setPage, settings }: any) => (
  <div className="space-y-16 max-w-6xl mx-auto px-4 md:px-0 relative">
    <header className="space-y-8 pt-12 md:pt-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
      </motion.div>
      {settings.helloAnimation ? (
        <HelloVirex />
      ) : (
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="text-8xl md:text-[10rem] font-display font-black tracking-tighter leading-[0.8] text-balance"
        >
          virex
        </motion.h1>
      )}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="text-2xl md:text-4xl font-display font-light text-[var(--on-surface-variant)] leading-tight max-w-4xl"
      >
        An independent software researcher, and problem solver.
      </motion.p>
    </header>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
      <Card delay={0.4} className="md:col-span-2 lg:col-span-1 xl:col-span-2 bg-[var(--primary)] text-[var(--on-primary)] border-none p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
        <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] tracking-tight">"Pure logic is expression."</h2>
        <div>
          <br></br>
          <p className="text-xl md:text-2xl opacity-90 font-medium max-w-2xl mb-10 leading-snug">
            I believe code is as much about human expression as it is about data. 
            Building bridges between high-level experience and low-level efficiency.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setPage('info')}
            className="m3-button-filled bg-white text-black text-xl h-16 px-10 rounded-2xl flex items-center gap-2 group"
          >
            Explore Me 
            <motion.span 
              animate={{ x: [0, 5, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronRight size={24} />
            </motion.span>
          </motion.button>
        </div>
      </Card>
      <Card delay={0.5} className="flex flex-col justify-between">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-[var(--primary-container)] rounded-3xl flex items-center justify-center">
            <Activity size={32} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-3xl font-display font-bold">High Specs, Low standards :)</h3>
          <p className="text-xl opacity-70 leading-relaxed">where we build software that just works, but works exceptionally well.</p>
        </div>
      </Card>
      <Card delay={0.6} className="bg-[var(--primary-container)] text-[var(--on-primary-container)] flex flex-col justify-center p-10">
        <YearProgress />
      </Card>
      <div className="md:col-span-2 lg:col-span-1 xl:col-span-2 mt-8 mb-4 flex items-center gap-6 px-4">
        <div className="h-[1px] flex-1 bg-[var(--outline-variant)] opacity-30" />
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 whitespace-nowrap">Source Archive</h3>
          <div className="text-2xl font-display font-black tracking-tighter">Projects & Research</div>
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

const BlogPage = ({ selectedPostId, handlePageChange }: any) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [readPosts, setReadPosts] = useState<string[]>(() => {
    const saved = localStorage.getItem('virex-read-posts');
    return saved ? JSON.parse(saved) : [];
  });
  const selectedPost = BLOG_POSTS.find(p => p.id === selectedPostId || p.link === selectedPostId);

  useEffect(() => {
    if (!selectedPostId) {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
      if (scrolled > 95 && !readPosts.includes(selectedPost.id)) {
        setReadPosts(prev => {
          const next = [...prev, selectedPost.id];
          localStorage.setItem('virex-read-posts', JSON.stringify(next));
          return next;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedPostId, readPosts]);

  if (selectedPost) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-12 px-4 md:px-0 motion-gpu relative"
      >
        <div className="fixed top-0 left-0 right-0 h-1 z-[150] bg-[var(--surface-variant)]">
          <motion.div 
            className="h-full bg-[var(--primary)] shadow-[0_0_15px_var(--primary)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <div className="flex justify-between items-center sticky top-0 py-4 bg-[var(--surface)]/80 backdrop-blur-md z-40">
          <button 
            onClick={() => window.history.back()}
            className="m3-button-tonal w-fit group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Back to feed</span>
          </button>
          <div className="hidden md:flex items-center gap-3 opacity-50 text-xs font-black uppercase tracking-[0.2em]">
            {readPosts.includes(selectedPost.id) && <CheckCircle2 size={14} className="text-green-500" />}
            <span>{selectedPost.readTime}</span>
            <div className="w-1 h-1 rounded-full bg-current" />
            <span>{Math.round(scrollProgress)}% read</span>
          </div>
        </div>
        <header className="space-y-8 pt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="px-5 py-2 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
                {selectedPost.category}
              </span>
              <div className="flex items-center gap-2 opacity-50 text-sm font-bold">
                <Calendar size={14} />
                <span>{selectedPost.date}</span>
              </div>
              {readPosts.includes(selectedPost.id) && (
                <div className="flex items-center gap-2 text-green-500 text-xs font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <CheckCircle2 size={12} /> Read
                </div>
              )}
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] text-balance">
              {selectedPost.title}
            </h1>
          </div>
          <div className="p-8 bg-[var(--surface-variant)] rounded-[2.5rem] border border-[var(--outline-variant)]/30 italic opacity-80 text-xl leading-relaxed">
            {selectedPost.snippet}
          </div>
        </header>
        <div className="markdown-body py-12">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ node, ...props }) => <CodeBlock {...props} />
            }}
          >
            {selectedPost.content}
          </ReactMarkdown>
        </div>

        <footer className="pt-16 pb-24 border-t border-[var(--outline-variant)] flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h4 className="text-3xl font-display font-black">Enjoyed the deep dive?</h4>
            <p className="opacity-60 font-medium">Share this research with your network.</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/blog/${selectedPost.link}`);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            className={cn(
              "m3-button-filled h-20 px-16 text-xl rounded-[2rem] shadow-2xl transition-all relative overflow-hidden",
              isCopied ? "bg-green-600 shadow-green-500/20" : "hover:shadow-[var(--primary)]/20"
            )}
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <Check size={24} /> Link Copied
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <Copy size={24} /> Copy Research Link
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </footer>
      </motion.div>
    );
  }

  const spotlightPost = BLOG_POSTS[0];
  const remainingPosts = BLOG_POSTS.slice(1);
  return (
    <div className="max-w-6xl mx-auto space-y-20 px-4 md:px-0 pb-32">
      <header className="space-y-4">
        <h2 className="text-7xl md:text-9xl font-display font-black tracking-tighter leading-none">Journal</h2>
      </header>





      <section>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-[3.5rem] overflow-hidden bg-[var(--primary-container)] text-[var(--on-primary-container)] border-4 border-[var(--outline-variant)] shadow-2xl group cursor-pointer"
          onClick={() => handlePageChange('blog', spotlightPost.link)}
        >
          <div className="p-8 md:p-16 space-y-8 relative z-10">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-[var(--primary)] text-[var(--on-primary)] rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Featured Report
              </span>
              <span className="text-sm font-bold opacity-60 flex items-center gap-2">
                <Calendar size={14} /> {spotlightPost.date}
              </span>
              {readPosts.includes(spotlightPost.id) && <CheckCircle2 size={20} className="text-green-500 shadow-xl" />}
            </div>
            <div className="space-y-4 max-w-4xl">
              <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.95] group-hover:translate-x-2 transition-transform duration-500">
                {spotlightPost.title}
              </h3>
              <p className="text-xl md:text-2xl opacity-80 leading-relaxed font-medium text-pretty">
                {spotlightPost.snippet}
              </p>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="m3-button-filled !rounded-[1.5rem] !px-8 !py-4 group-hover:scale-105 transition-transform shadow-xl">
                Read Full Entry <ArrowUpRight size={20} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest opacity-40 italic">{spotlightPost.readTime}</span>
            </div>
          </div>
        </motion.div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {remainingPosts.map((post, i) => (
          <Card 
            key={post.id} 
            delay={i * 0.1} 
            className="cursor-pointer group relative overflow-hidden bg-[var(--surface-variant)]/30 hover:bg-[var(--primary-container)]/20 border-2 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] transition-all duration-300" 
            onClick={() => handlePageChange('blog', post.link)}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] px-2 py-1 bg-[var(--primary-container)]/30 rounded-md">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{post.date}</span>
                  {readPosts.includes(post.id) && <CheckCircle2 size={16} className="text-green-500" />}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[var(--surface)] border border-[var(--outline-variant)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-[var(--on-primary)] transition-all duration-500">
                  <ChevronRight size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-display font-black leading-tight group-hover:translate-x-1 transition-transform">
                  {post.title}
                </h4>
                <p className="text-lg opacity-60 leading-relaxed line-clamp-2 text-pretty">
                  {post.snippet}
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-[var(--outline-variant)] opacity-40 text-[10px] font-black uppercase tracking-widest">
                <span>Archive No. {BLOG_POSTS.length - i - 1}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
const LensPage = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // if you wish to use your own photos, replace them here:
  // public/photography/ 
  // OR 
  // photography/
  // just make sure you link everything, don't be dumb
  
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

  const nextPhoto = (e?: any) => {
    e?.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % photos.length);
  };
  const prevPhoto = (e?: any) => {
    e?.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      <header className="flex items-end gap-6 mb-16 px-4 md:px-0">
        <div className="space-y-2">
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter">Lens</h2>
        </div>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[350px] grid-flow-dense px-4 md:px-0">
        {photos.map((photo, i) => {
          const isPortrait = photo.orientation === 'portrait';
          const isLarge = i % 8 === 0 && !isPortrait; 
          const isWide = i % 5 === 2 && !isPortrait && !isLarge;
          
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 5) * 0.05 }}
              className={cn(
                "rounded-[2.5rem] overflow-hidden cursor-pointer relative group border-2 border-transparent hover:border-[var(--primary)] transition-all motion-gpu",
                isLarge ? "md:col-span-2 md:row-span-2" : 
                isWide ? "md:col-span-2" : 
                isPortrait ? "row-span-2" : ""
              )}
              onClick={() => setSelectedIndex(i)}
            >
              <img 
                src={photo.url} 
                alt={photo.description} 
                loading="lazy"
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
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm overflow-hidden"
            onClick={() => setSelectedIndex(null)}
          >

            <div className="flex items-start justify-between p-6 md:p-8 z-[210] gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">visual archive / data</div>
                <div className="text-white font-display font-black text-2xl md:text-4xl tracking-tight">
                  {photos[selectedIndex].description}
                </div>
              </div>
              <button 
                onClick={() => setSelectedIndex(null)}
                className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-white rounded-full flex items-center justify-center transition-all border border-white/10 active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 lg:p-20 overflow-hidden">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) prevPhoto();
                  else if (info.offset.x < -100) nextPhoto();
                }}
                className="relative max-w-full max-h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={photos[selectedIndex].url}
                  className="max-w-full max-h-full object-contain rounded-xl md:rounded-[2rem] shadow-2xl border border-white/5 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
            <div className="p-6 md:p-10 bg-black/40 border-t border-white/5 backdrop-blur-xl z-[210] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">position</span>
                  <div className="flex items-center gap-2 text-white font-mono">
                    <span className="text-[var(--primary)] font-bold">{String(selectedIndex + 1).padStart(2, '0')}</span>
                    <span className="opacity-20">/</span>
                    <span className="opacity-60">{String(photos.length).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col hidden sm:flex">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">archive node</span>
                  <span className="text-white/60 font-mono text-xs">VIREX-LENS-26</span>
                </div>
              </div>

              {/* Desktop Nav Arrows moved to center */}
              <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-3xl p-1.5 border border-white/5">
                <button 
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-[1.25rem] flex items-center justify-center transition-all border border-white/5 active:scale-90"
                  onClick={prevPhoto}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-[1.25rem] flex items-center justify-center transition-all border border-white/5 active:scale-90"
                  onClick={nextPhoto}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">use keys or arrows to cycle archive</span>
              </div>
              
              <div className="flex md:hidden items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">swipe left/right to cycle archive</span>
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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter">Tracker</h2>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {TRACKER_ITEMS.map((item, i) => (
          <Card key={item.id} delay={i * 0.1} className="relative overflow-hidden group border-2 border-[var(--outline-variant)] bg-[var(--surface)] hover:border-[var(--primary)] transition-all">
            <div className="relative z-10 space-y-6 p-2">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--primary)] text-[var(--on-primary)]">
                      {item.category}
                    </span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-2",
                      item.status === 'Active' || item.status === 'Researching' 
                        ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-container)]/10" 
                        : "border-[var(--outline-variant)] opacity-60"
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-4xl font-display font-black tracking-tight">{item.title}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--outline-variant)]">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                    <BookOpen size={14} /> Directives
                  </h4>
                  <ul className="space-y-2 text-[15px] font-medium leading-tight opacity-90">
                    {item.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-[var(--primary)] font-bold">›</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                    <Pipette size={14} /> Active Stack
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
      <header className="pt-8 md:pt-16 border-b border-[var(--outline-variant)] pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative overflow-visible">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter leading-none flex items-baseline">
              virex
              <motion.span className="text-[var(--primary)] select-none relative z-[60] inline-block">.</motion.span>
            </h1>
            <div className="group relative mt-4">
              <div className="text-[9px] font-black opacity-50 uppercase tracking-[0.3em] mb-1">
                PGP Fingerprint Auth
              </div>
              <div className="text-[11px] font-mono leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity select-all border-l-2 border-[var(--primary)] pl-3">
                1D4D 0BDB 03DA F87B 2151 <br />
                6AE8 A109 C97B 2AD5 C2E6
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-4 bg-[var(--primary-container)] text-[var(--on-primary-container)] rounded-lg text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
              <Activity size={17} /> Researcher
            </span>
            <span className="px-4 py-4 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-lg text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
              <MapPin size={17} /> Nederland
            </span>
            <span className="px-4 py-4 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-lg text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={17} /> 4+ Years XP
            </span>
            <span className="px-3 py-4 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-lg text-[12px] font-black uppercase tracking-widest flex items-center gap-2">He/They</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 lg:col-span-8">
          <div className="bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl h-full min-h-[450px] flex flex-col font-mono group">
            <div className="px-6 py-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between relative">
              <div className="flex gap-2">
              </div>
              <span className="absolute left-2/4 -translate-x-1/2 text-[12px] text-white/60 tracking-[0.2em] flex items-center font-black uppercase whitespace-nowrap">
              	kali@is-for-posers
              </span>
            </div>
            <div className="p-8 md:p-10 text-sm leading-relaxed space-y-6 flex-1 overflow-y-auto scrollbar-hide">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--primary)] font-black">❯</span>
                  <span className="text-white/80">./fetch_system_status.sh --verbose</span>
                </div>
                
                <div className="pl-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1">
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">OS</span>
                      <span className="text-white/60">Debian 13 (trixie) x86_64</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">KERNEL</span>
                      <span className="text-white/60">6.19.3-2-virex</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">HOST</span>
                      <span className="text-white/60">MSI MEG Z690 GODLIKE</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">UPTIME</span>
                      <span className="text-white/60">42d, 42h, 42m </span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">SHELL</span>
                      <span className="text-white/60">bash 5.2.37</span>
                    </div>                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">DE</span>
                      <span className="text-white/60">GNOME 49.1 (Wayland)</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">WM</span>
                      <span className="text-white/60">Mutter</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">TERMINAL</span>
                      <span className="text-white/60">kgx (gnome-console)</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">CPU</span>
                      <span className="text-white/60">Intel i5-14600K (20) @ 5.300GHz</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">GPU</span>
                      <span className="text-white/60">AMD Radeon RX 6800 XT [Discrete]</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">MEMORY</span>
                      <span className="text-white/60">12442MiB / 39854MiB (31%)</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[var(--primary)] font-bold">STORAGE</span>
                      <span className="text-white/60">65GB / 1.82TB (4%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="md:col-span-12 lg:col-span-4 p-10 flex flex-col justify-between bg-[var(--primary-container)] text-[var(--on-primary-container)] border-none relative overflow-hidden group">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_var(--primary)]" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Plans</h3>
            </div>
            <p className="text-2xl font-display font-black leading-tight tracking-tight">
              {"Working toward CEH while building out a vulnerability research archive. Wireshark, Metasploit, CTFs. Defensive security, hands-on"}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Activity size={160} />
          </div>
        </Card>


        <div className="md:col-span-12 lg:col-span-6">
          <Card className="p-10 space-y-8 h-full bg-[var(--surface-variant)]/40 border-none shadow-sm">
            <h3 className="text-3xl font-display font-black tracking-tight">Web Stack</h3>
            <div className="flex flex-wrap gap-2.5">
              {TECH_STACK.web.map(tech => (
                <span key={tech} className="px-4 py-2 bg-[var(--primary-container)]/30 text-[var(--on-surface)] rounded-xl text-sm font-bold border-2 border-transparent hover:border-[var(--primary)] transition-all">
                  {tech}
                </span>
              ))}
            </div>
          </Card>
        </div>
        <div className="md:col-span-12 lg:col-span-6">
          <Card className="p-10 space-y-8 h-full bg-[var(--surface-variant)]/40 border-none shadow-sm">
            <h3 className="text-3xl font-display font-black tracking-tight">Technical Stack</h3>
            <div className="flex flex-wrap gap-2.5">
              {TECH_STACK.technical.map(tech => (
                <span key={tech} className="px-4 py-2 bg-[var(--primary-container)]/30 text-[var(--on-surface)] rounded-xl text-sm font-bold border-2 border-transparent hover:border-[var(--primary)] transition-all">
                  {tech}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Evolution Section */}
        <div className="md:col-span-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3.5rem] overflow-hidden bg-[var(--primary-container)] text-[var(--on-primary-container)] border-4 border-[var(--outline-variant)] shadow-2xl group p-10 md:p-16 space-y-10"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-[var(--primary)] text-[var(--on-primary)] rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Career Evolution
                </span>
                <span className="text-sm font-bold opacity-60 flex items-center gap-2">
                  <Activity size={14} /> 2021 — PRESENT
                </span>
              </div>
              <h3 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.95] group-hover:translate-x-2 transition-transform duration-500">
                The Technical Journey
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 border-t border-[var(--on-primary-container)]/10 pt-10">
              <div className="space-y-6 text-xl opacity-80 leading-relaxed font-medium text-pretty">
                <p>
                  I started my <span className="font-bold text-[var(--primary)]">junior software researching</span> journey around 2021, focusing on exploratory security research and scripting.
                </p>
                <p>
                  What began as a curiosity for how binaries worked evolved into a passion for <span className="font-bold text-[var(--primary)]">full-stack development</span> and systems architecture.
                </p>
              </div>
              <div className="space-y-6 text-xl opacity-80 leading-relaxed font-medium text-pretty">
                <p>
                  Since then, I’ve evolved into a <span className="font-bold text-[var(--primary)]">full-stack developer</span> with a deep interest in cybersecurity and systems architecture.
                </p>
                <p>
                  By 2024, my focus shifted toward <span className="font-bold text-[var(--primary)]">social engineering methodology</span> and <span className="font-bold text-[var(--primary)]">vulnerability research</span>.
                </p>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <Activity size={320} />
            </div>
          </motion.div>
        </div>

        {/* Mission and Library */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-10 space-y-8 bg-[var(--surface-variant)]/30 border-2 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary-container)]/10 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] px-2 py-1 bg-[var(--primary-container)]/30 rounded-md">
                    Mission
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[var(--surface)] border border-[var(--outline-variant)] flex items-center justify-center text-[var(--primary)] transition-all duration-500">
                  <Check size={20} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-display font-black leading-tight">Software Integrity</h4>
                <p className="text-lg opacity-60 leading-relaxed text-pretty font-medium">
                  In a new world of dead internet and terrifying web standards, I advocate for minimalist, resilient software. My mission is to maintain efficient programming and build high-quality visual archives.
                </p>
              </div>
              <div className="pt-6 flex flex-wrap gap-2 border-t border-[var(--outline-variant)]/30">
                {['Research', 'Privacy', 'Performance', 'Aesthetics'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[var(--surface-variant)]/50 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-10 space-y-8 bg-[var(--surface-variant)]/30 border-2 border-[var(--outline-variant)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary-container)]/10 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] px-2 py-1 bg-[var(--primary-container)]/30 rounded-md">
                    Library
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[var(--surface)] border border-[var(--outline-variant)] flex items-center justify-center text-[var(--primary)] transition-all duration-500">
                  <BookOpen size={20} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-display font-black leading-tight">Digital Archival</h4>
                <p className="text-lg opacity-60 leading-relaxed text-pretty font-medium">
                  Digital hoarder by nature. I maintain a massive archive of legacy software and obscure documentation. If it's deprecated, it probably lives on my drives.
                </p>
                <p className="text-xs opacity-40 leading-relaxed italic">
                  On rotation: Black metal, Ethereal black metal, Doom metal, and DSBM.
                </p>
              </div>
              <div className="pt-6 flex flex-wrap gap-2 border-t border-[var(--outline-variant)]/30">
                {['Archival', 'Privacy', 'CEH', 'Aesthetics'].map(tag => (
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
          <h2 className="text-4xl font-display font-black tracking-tight">Establish Contact</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://github.com/hnpf" target="_blank" className="m3-button-tonal px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-black hover:text-white transition-all shadow-lg">
            <Github size={20} />
            GitHub
          </a>
          <a href="https://discord.gg/vixencommunity" target="_blank" className="m3-button-tonal px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#5865F2] hover:text-white transition-all shadow-lg">
            <MessageSquare size={20} />
            Discord
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

// --- Main app shell ---

export default function App() {
  const { settings, updateSettings, resolvedMode, cycleTheme } = useTheme();
  const [page, setPage] = useState('home');
  const [initialWiggle, setInitialWiggle] = useState(false);

  useEffect(() => {
    // wait a bit after load then wiggle once
    const timer = setTimeout(() => setInitialWiggle(true), 1200);
    // turn it off after it finishes its cycles (~2.5s duration)
    const stopTimer = setTimeout(() => setInitialWiggle(false), 4000);
    return () => {
      clearTimeout(timer);
      clearTimeout(stopTimer);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && settings.focusMode) {
        updateSettings({ focusMode: false });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.focusMode, updateSettings]);
  const [blogPostId, setBlogPostId] = useState<string | null>(null);
  const [hwOpen, setHwOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // effect 1: handle the path logic and popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setPage('home');
        setBlogPostId(null);
      } else if (path.startsWith('/blog/')) {
        const id = path.split('/')[2];
        setPage('blog');
        setBlogPostId(id);
      } else {
        const route = path.replace('/', '').toLowerCase();
        const validPages = ['home', 'blog', 'lens', 'tracker', 'readme', 'loom'];
        setPage(validPages.includes(route) ? route : '404');
        setBlogPostId(null);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // effect 2: update title and meta tags whenever 'page' or 'blogPostId' changes
  useEffect(() => {
    const cleanName = page === 'readme' ? 'Info' : page.charAt(0).toUpperCase() + page.slice(1);
    const siteTitle = (page === 'blog' && blogPostId) 
      ? `Virex | ${BLOG_POSTS.find(p => p.id === blogPostId || p.link === blogPostId)?.title || 'Post'}`
      : page === 'home' ? 'Virex' : `Virex | ${cleanName}`;
    document.title = siteTitle;

    // --- Dynamic Meta Tags ---
    let description = "Independent software researcher, innovator, and problem solver. Exploring systems programming, UI/UX architecture, and vulnerability research.";
    let ogTitle = siteTitle;
    let ogImage = "https://virex.lol/photography/pfp/main.png";

    if (page === 'blog' && blogPostId) {
      const post = BLOG_POSTS.find(p => p.id === blogPostId || p.link === blogPostId);
      if (post) {
        description = post.snippet;
        ogTitle = `Virex Blog | ${post.title}`;
      }
    } else if (page === 'readme') {
      description = "The README archive: A deep dive into the technical evolution, mission, and identity of Virex.";
    } else if (page === 'loom') {
      description = "Loom: A lightweight, expressive, and efficient programming language built for speed and simplicity.";
    } else if (page === 'lens') {
      description = "The Visual Archive: A collection of photography by Virex, exploring nature, technology, and light.";
    }

    // Update Meta Tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      let el = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', ogTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('twitter:title', ogTitle);
    updateMeta('twitter:description', description);

    // --- JSON-LD Structured Data ---
    const existingJsonLd = document.getElementById('json-ld-structured-data');
    if (existingJsonLd) existingJsonLd.remove();

    const jsonLd: any = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Virex",
      "url": "https://virex.lol",
      "author": {
        "@type": "Person",
        "name": "Virex"
      }
    };

    if (page === 'blog' && blogPostId) {
      const post = BLOG_POSTS.find(p => p.id === blogPostId || p.link === blogPostId);
      if (post) {
        jsonLd["@type"] = "BlogPosting";
        jsonLd["headline"] = post.title;
        jsonLd["description"] = post.snippet;
        jsonLd["datePublished"] = new Date(post.date).toISOString();
        jsonLd["author"] = { "@type": "Person", "name": "Virex" };
      }
    }

    const script = document.createElement('script');
    script.id = 'json-ld-structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

  }, [page, blogPostId, settings.accent, settings.mode]); 

  const handlePageChange = (newPage: string, postId: string | null = null) => {
    const url = newPage === 'home' ? '/' : postId ? `/blog/${postId}` : `/${newPage}`;
    window.history.pushState({}, '', url);
    setPage(newPage);
    setBlogPostId(postId);
    window.scrollTo(0, 0);
  };

  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn(
      "min-h-screen flex flex-col lg:flex-row font-sans relative",
      settings.sidebarFlipped && "lg:flex-row-reverse"
    )}>
      {/* Back to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-50 p-4 bg-[var(--primary)] text-[var(--on-primary)] rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-md"
          >
            <ArrowUpRight size={24} className="-rotate-45" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* some immersive focus mode overlays */}
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
      {/* desktop sidebar */}
      <AnimatePresence mode="popLayout">
        {!settings.focusMode && (
          <motion.aside 
            initial={{ x: settings.sidebarFlipped ? 400 : -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: settings.sidebarFlipped ? 400 : -400, opacity: 0 }}
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
              animate={initialWiggle ? { 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
              } : { rotate: 0, scale: 1 }}
              transition={initialWiggle ? {
                duration: 1.2,
                repeat: 1, // exactly twice
                repeatDelay: 0.1,
                ease: "easeInOut"
              } : { duration: 0.3 }} // snappy return
              onClick={() => handlePageChange('readme')}
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
                <div className="font-display font-black text-2xl tracking-tighter">virex</div>
                <div className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-black">CYBERSEC/DEV</div>
              </div>
            )}
          </div>
          <nav className="flex-1 flex flex-col gap-3">
            <SidebarItem icon={Home} label="Home" active={page === 'home'} onClick={() => handlePageChange('home')} collapsed={settings.sidebarCollapsed} />
            <SidebarItem icon={FileText} label="Info" active={page === 'readme'} onClick={() => handlePageChange('readme')} collapsed={settings.sidebarCollapsed} />
            <SidebarItem icon={BookText} label="Blog" active={page === 'blog'} onClick={() => handlePageChange('blog')} collapsed={settings.sidebarCollapsed} />
            <SidebarItem icon={Camera} label="Lens" active={page === 'lens'} onClick={() => handlePageChange('lens')} collapsed={settings.sidebarCollapsed} />
            <SidebarItem icon={Activity} label="Tracker" active={page === 'tracker'} onClick={() => handlePageChange('tracker')} collapsed={settings.sidebarCollapsed} />
            <SidebarItem icon={Terminal} label="Loom" active={page === 'loom'} onClick={() => handlePageChange('loom')} collapsed={settings.sidebarCollapsed} />
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
                {resolvedMode === 'light' && <Sun size={20} />}
                {resolvedMode === 'dark' && <Moon size={20} />}
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
            <SidebarItem icon={SettingsIcon} label="Settings" onClick={() => setSettingsOpen(true)} collapsed={settings.sidebarCollapsed} />
            
            <AnimatePresence>
              {!settings.sidebarCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
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
  {/* main content */}
  <motion.main 
    layout
    className="flex-1 p-6 md:p-12 lg:p-16 pb-40 lg:pb-16 overflow-x-hidden page-container"
  >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page + (blogPostId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: settings.disableAnimations ? 0 : 0.25, 
              ease: [0.33, 1, 0.68, 1] 
            }}
            className="motion-gpu"
          >
            {page === 'home' && <HomePage setPage={handlePageChange} settings={settings} />}
            {page === 'blog' && <BlogPage selectedPostId={blogPostId} handlePageChange={handlePageChange} />}
            {page === 'lens' && <LensPage />}
            {page === 'tracker' && <TrackerPage />}
            {page === 'readme' && <ReadmePage setPage={handlePageChange} />}
            {page === 'loom' && <LoomPage />}
            {!['home', 'blog', 'lens', 'tracker', 'readme', 'loom'].includes(page) && (
              <NotFound onNavigate={handlePageChange} />
            )}
          </motion.div>
        </AnimatePresence>
        {/* exit focus mode main button */}
        <AnimatePresence>
          {settings.focusMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ focusMode: false })}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[var(--primary)] text-[var(--on-primary)] rounded-full font-bold shadow-2xl flex items-center gap-3 border-2 border-white/20 backdrop-blur-md"
            >
              <EyeOff size={20} />
              <span>Exit Focus Mode</span>
              <span className="text-[10px] opacity-60 bg-black/20 px-2 py-0.5 rounded uppercase tracking-wider">Esc</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.main>
      <AnimatePresence>
        {!settings.focusMode && (
          <motion.nav 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--outline-variant)] px-4 pt-1 pb-[env(safe-area-inset-bottom,16px)] flex justify-around z-40 rounded-t-[1.75rem] shadow-[0_-8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl"
          >
            <BottomNavItem icon={Home} label="Home" active={page === 'home'} onClick={() => handlePageChange('home')} initialWiggle={initialWiggle} />
            <BottomNavItem icon={FileText} label="Info" active={page === 'readme'} onClick={() => handlePageChange('readme')} initialWiggle={initialWiggle} />
            <BottomNavItem icon={BookText} label="Blog" active={page === 'blog'} onClick={() => handlePageChange('blog')} initialWiggle={initialWiggle} />
            <BottomNavItem icon={Camera} label="Lens" active={page === 'lens'} onClick={() => handlePageChange('lens')} initialWiggle={initialWiggle} />
            <BottomNavItem icon={SettingsIcon} label="More" onClick={() => setSettingsOpen(true)} initialWiggle={initialWiggle} />
          </motion.nav>
        )}
      </AnimatePresence>
      {/* hardware sidebar overlay */}
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
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Processing Units</h3>
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

      {/* settings section */}
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
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
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
                {/* appearance section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Palette size={20} className="text-[var(--primary)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">Appearance</h3>
                  </div>
                  
                
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-[var(--surface-variant)] rounded-full">
                    {(['light', 'dark', 'system'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => updateSettings({ mode: m })}
                        className={cn(
                          "flex items-center justify-center gap-2 py-2.5 rounded-full transition-all capitalize text-sm font-bold",
                          settings.mode === m 
                            ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-md" 
                            : "hover:bg-black/5 text-[var(--on-surface-variant)]"
                        )}
                      >
                        {m === 'light' && <Sun size={16} />}
                        {m === 'dark' && <Moon size={16} />}
                        {m === 'system' && <Monitor size={16} />}
                        {m}
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
                                c === 'purple' && "bg-violet-500"
                              )} />
                              <div className="w-1/2 h-full flex flex-col">
                                <div className={cn(
                                  "h-1/2 w-full",
                                  c === 'orange' && "bg-orange-300",
                                  c === 'blue' && "bg-blue-300",
                                  c === 'green' && "bg-emerald-300",
                                  c === 'red' && "bg-rose-300",
                                  c === 'purple' && "bg-violet-300"
                                )} />
                                <div className={cn(
                                  "h-1/2 w-full",
                                  c === 'orange' && "bg-orange-700",
                                  c === 'blue' && "bg-blue-700",
                                  c === 'green' && "bg-emerald-700",
                                  c === 'red' && "bg-rose-700",
                                  c === 'purple' && "bg-violet-700"
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
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                        <input 
                          type="range" min="0" max="360" 
                          value={settings.hue} 
                          onChange={(e) => updateSettings({ hue: parseInt(e.target.value) })}
                          className="w-full h-1.5 bg-[var(--surface-variant)] rounded-full appearance-none cursor-pointer accent-[var(--primary)]"
                        />
                      </motion.div>
                    )}
                  </div>
                </section>
                {/* tweaks */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Layers size={20} className="text-[var(--primary)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">System Tweaks</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'helloAnimation', label: 'Hello Animation', desc: 'Fluent language-cycling header' },
                      { key: 'brutalistMode', label: 'Brutalist Mode', desc: 'Sharp edges only' },
                      { key: 'developerFont', label: 'Developer Font', desc: 'Switch to JetBrains Mono' },
                      { key: 'focusMode', label: 'Focus Mode', desc: 'Minimalist zen layout' },
                      { key: 'sidebarFlipped', label: 'Flip Sidebar', desc: 'Desktop layout orientation' },
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
                          "w-12 h-7 rounded-full relative transition-all duration-200",
                          settings[tweak.key as keyof typeof settings] ? "bg-[var(--primary)]" : "bg-black/20 dark:bg-white/20"
                        )}>
                          <motion.div 
                            animate={{ 
                              x: settings[tweak.key as keyof typeof settings] ? 24 : 4,
                              scale: settings[tweak.key as keyof typeof settings] ? 1 : 0.8
                            }}
                            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
