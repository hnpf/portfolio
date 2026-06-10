// @ts-ignore

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ExternalLink, Link as LinkIcon, Plus, Hash, Globe, AlertTriangle } from 'lucide-react';
import { cn } from '../constants';

const Uppercasecard = ({ children, className, delay = 0 }: any) => {
  const [hasEntered, setHasEntered] = useState(false);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { 
          duration: 0.4, 
          delay: hasEntered ? 0 : delay, 
          ease: [0.33, 1, 0.68, 1] 
        }
      }}
      onAnimationComplete={() => setHasEntered(true)}
      className={cn("bg-[var(--surface-variant)]/20 border-6 border-[var(--outline-variant)]/50 rounded-[2.5rem] p-8 md:p-12", className)}
    >
      {children}
    </motion.div>
  );
};

export default function DashPage() {
  const [url, setUrl] = useState('');
  const [path, setpath] = useState('');
  const [links, setLinks] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [copypath, setCopypath] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState('https://keep.google.com/');
  // const [loading, setLoading] = useState(false)  
  // i was personally gonna add a spinner to the button, never did !
  const [show_top, setShowTop] = useState(false);

  useEffect(() => {
    const on_scroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', on_scroll);
    return () => window.removeEventListener('scroll', on_scroll);
  }, []);

  const weirdlinkpresets = [
    'https://github.com/hnpf/LOOM_PROGRAMMING_LANGUAGE',
    'https://virex.lol/lens',
    'https://archlinux.org/download/',
    'https://news.ycombinator.com/',
    'https://en.wikipedia.org/wiki/Social_engineering_(security)',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ];

  const loadlink = async () => {
    try {
      const res = await fetch('/api/urls');
      const ct = res.headers.get('content-type');
      if (ct && ct.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLinks(data);
        } else if (data.error) {
          setError(data.error);
        }
      }
    } catch (e: any) {
      setError('failed to load links');
    }
  };

  useEffect(() => {
    loadlink();
    setPlaceholder(weirdlinkpresets[Math.floor(Math.random() * weirdlinkpresets.length)]);
  }, []);

  const submitlinkhandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, path })
      });

      const ct = res.headers.get('content-type');
      if (ct && ct.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'failed to shorten url');
          return;
        }
      } else {
        setError(`server error: ${res.status} ${res.statusText}`);
        return;
      }

      setUrl('');
      setpath('');
      loadlink();
    } catch (e: any) {
      setError('backend is unreachable');
    }
  };

  // const _del = async (id: string) => {
  //   await fetch(`/api/urls/${id}`, { method: 'DELETE' })
  //   loadlink()
  // }

  const copylinkhandler = (p: string) => {
    const full = `${window.location.protocol}//${window.location.host}/r/${p}`;
    navigator.clipboard.writeText(full);
    setCopypath(p);
    setTimeout(() => setCopypath(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 md:space-y-20 pb-32 relative">
      <header className="page-header italic font-expressive-bold space-y-6 md:space-y-8 px-4 md:px-0">
        <h1 className="page-title text-6xl md:text-[100px]">Shorten</h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="text-lg md:text-3xl font-display font-medium text-[var(--on-surface-variant)] opacity-60 max-w-4xl leading-tight"
        >
          HTTPS is only a suggestion! <span className="italic opacity-40 text-sm md:text-xl ml-2">// quick and dirty links.</span>
        </motion.p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:gap-16 px-4 md:px-0">
        <Uppercasecard className="bg-[var(--primary-container)]/10 border-6 border-[var(--primary)]/20 relative overflow-hidden group p-8 md:p-16">
          <form onSubmit={submitlinkhandler} className="relative z-10 space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <Globe size={16} className="text-[var(--primary)]" />
                  <label className="text-[10px] md:text-[12px] font-black tracking-[0.4em] opacity-50 uppercase italic">Destination URL</label>
                </div>
                <input
                  type="url"
                  placeholder={placeholder}
                  className="w-full bg-[var(--surface)] border-6 border-[var(--outline-variant)]/60 focus:border-[var(--primary)] rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-10 py-4 md:py-6 text-xl md:text-2xl outline-none transition-all shadow-inner font-display font-bold"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-4 space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <Hash size={16} className="text-[var(--primary)]" />
                  <label className="text-[10px] md:text-[12px] font-black tracking-[0.4em] opacity-50 uppercase italic">Custom path</label>
                </div>
                <input
                  type="text"
                  placeholder="optional"
                  className="w-full bg-[var(--surface)] border-6 border-[var(--outline-variant)]/60 focus:border-[var(--primary)] rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-10 py-4 md:py-6 text-xl md:text-2xl font-mono outline-none transition-all shadow-inner"
                  value={path}
                  onChange={e => setpath(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 md:pt-10 border-t border-[var(--outline-variant)]/30">
              <div className="flex-1 w-full">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-red-500 font-bold flex items-center gap-3 bg-red-500/10 px-4 md:px-6 py-3 rounded-2xl border-4 border-red-500/20 text-sm md:text-base"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto bg-[var(--primary)] text-[var(--on-primary)] font-black tracking-[0.2em] uppercase px-12 md:px-16 h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center gap-4 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl shadow-[var(--primary)]/30 group/btn text-md md:text-lg"
              >
                Create Link
                <Plus size={24} className="group-hover/btn:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </form>
          
          <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 text-[var(--primary)]">
            <LinkIcon size={450} />
          </div>
        </Uppercasecard>

        <Uppercasecard delay={0.1} className="p-0 overflow-hidden border-6 border-[var(--outline-variant)]/40">
          {/* desktop table view */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--outline-variant)]/40 bg-[var(--surface-variant)]/10">
                  <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] opacity-50 uppercase italic">Path</th>
                  <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] opacity-50 uppercase italic">Destination</th>
                  <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] opacity-50 uppercase italic text-center">Visits</th>
                  <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] opacity-50 uppercase italic text-right">Created</th>
                  <th className="px-10 py-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--outline-variant)]/20">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-[var(--primary-container)]/5 transition-colors group">
                    <td className="px-10 py-8 font-mono font-bold text-2xl text-[var(--primary)] tracking-tighter">/{link.path}</td>
                    <td className="px-10 py-8 max-w-xs truncate opacity-60 font-display font-medium text-lg">{link.original_url}</td>
                    <td className="px-10 py-8 font-black text-2xl text-center tabular-nums">{link.visits}</td>
                    <td className="px-10 py-8 opacity-40 text-sm font-bold text-right uppercase tracking-widest">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => copylinkhandler(link.path)}
                          className={cn(
                            "p-4 bg-[var(--surface-variant)] rounded-2xl hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-all active:scale-90 border-4 border-transparent hover:border-[var(--primary)]/20",
                            copypath === link.path && "bg-green-500 text-white border-green-500/20"
                          )}
                        >
                          {copypath === link.path ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                        <a
                          href={`/r/${link.path}`}
                          target="_blank"
                          className="p-4 bg-[var(--surface-variant)] rounded-2xl hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all active:scale-90 border-4 border-transparent hover:border-[var(--primary-container)]/20"
                        >
                          <ExternalLink size={20} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile view */}
          <div className="md:hidden divide-y divide-[var(--outline-variant)]/20">
            {links.map((link) => (
              <div key={link.id} className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-3xl text-[var(--primary)] tracking-tighter">/{link.path}</div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => copylinkhandler(link.path)}
                      className={cn(
                        "p-5 bg-[var(--surface-variant)] rounded-[1.5rem] active:scale-90 transition-all border-4 border-transparent",
                        copypath === link.path && "bg-green-500 text-white"
                      )}
                    >
                      {copypath === link.path ? <Check size={24} /> : <Copy size={24} />}
                    </button>
                    <a
                      href={`/r/${link.path}`}
                      target="_blank"
                      className="p-5 bg-[var(--surface-variant)] rounded-[1.5rem] active:scale-90 transition-all border-4 border-transparent"
                    >
                      <ExternalLink size={24} />
                    </a>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase italic">Destination</div>
                  <div className="truncate opacity-80 text-md font-bold bg-[var(--surface)] px-5 py-4 rounded-2xl border-4 border-[var(--outline-variant)]/30 font-display">
                    {link.original_url}
                  </div>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div className="flex gap-8">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase italic">Visits</div>
                      <div className="font-black text-2xl tabular-nums">{link.visits}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase italic">Date</div>
                      <div className="font-bold opacity-60 text-md tracking-wider">{new Date(link.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {links.length === 0 && (
            <div className="px-10 py-32 text-center opacity-30 font-display text-3xl font-black italic tracking-tighter">
              database is silent.
            </div>
          )}
        </Uppercasecard>
      </div>
    </div>
  );
}
