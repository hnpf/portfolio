import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ExternalLink, Link as LinkIcon, Plus, Hash, Globe, AlertTriangle } from 'lucide-react';
import { cn } from './constants';

const Uppercasecard = ({ children, className, delay = 0 }: any) => (
  <motion.div
    initial={{
      opacity: 0,
      y: 15
    }}
    animate={{
      opacity: 1,
      y: 0
    }}
    transition={{ duration: 0.4, delay, ease: [0.33, 1, 0.68, 1] }}
    className={cn("bg-[var(--surface-variant)]/20 border-6 border-[var(--outline-variant)]/50 rounded-[2.5rem] p-8 md:p-12", className)}
  >
    {children}
  </motion.div>
);

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
    <div className="max-w-6xl mx-auto space-y-16 pb-20 relative">
      <header className="page-header space-y-4">
        <h1 className="page-title !text-8xl !md:text-[10rem] leading-[0.8]">Shorten</h1>
        <br></br>
        <motion.p 
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="md:text-2xl font-display font-light text-[var(--on-surface-variant)] leading-tight max-w-4xl"
        >
          HTTPS is only a suggestion!
        </motion.p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <Uppercasecard className="bg-[var(--primary-container)]/10 border-[var(--primary)]/20 relative overflow-hidden group">
          <form onSubmit={submitlinkhandler} className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Globe size={14} className="text-[var(--primary)]" />
                  <label className="text-[13px] font-black tracking-[0.3em] opacity-40">Destination URL</label>
                </div>
                <input
                  type="url"
                  placeholder={placeholder}
                  className="w-full bg-[var(--surface)] border-6 border-[var(--outline-variant)] focus:border-[var(--primary)] rounded-3xl px-8 py-5 text-xl outline-none transition-all shadow-inner"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-4 space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Hash size={14} className="text-[var(--primary)]" />
                  <label className="text-[13px] font-black tracking-[0.3em] opacity-40">Custom path</label>
                </div>
                <input
                  type="text"
                  placeholder="optional"
                  className="w-full bg-[var(--surface)] border-6 border-[var(--outline-variant)] focus:border-[var(--primary)] rounded-3xl px-8 py-5 text-xl font-mono outline-none transition-all shadow-inner"
                  value={path}
                  onChange={e => setpath(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-[var(--outline-variant)]/20">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{
                        opacity: 0,
                        x: -10
                      }}
                      animate={{
                        opacity: 1,
                        x: 0
                      }}
                      exit={{
                        opacity: 0,
                        x: 10
                      }}
                      className="text-red-500 font-bold flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto bg-[var(--primary)] text-[var(--on-primary)] font-black tracking-widest px-13 h-16 rounded-[1.5rem] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[var(--primary)]/20 group/btn"
              >
                Create Link
                <Plus size={22} className="group-hover/btn:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </form>
          
          <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <LinkIcon size={400} />
          </div>
        </Uppercasecard>

        <Uppercasecard delay={0.1} className="p-0 overflow-hidden border-0 md:border-6">
          {/* desktop table view */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--outline-variant)]/30">
                  <th className="px-8 py-6 text-[12px] font-black tracking-[0.3em] opacity-40">Path</th>
                  <th className="px-8 py-6 text-[12px] font-black tracking-[0.3em] opacity-40">Original URL</th>
                  <th className="px-8 py-6 text-[12px] font-black tracking-[0.3em] opacity-40">Visits</th>
                  <th className="px-8 py-6 text-[12px] font-black tracking-[0.3em] opacity-40">Created</th>
                  <th className="px-8 py-6 text-[12px] font-black tracking-[0.3em] opacity-40"></th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-b border-[var(--outline-variant)]/10 hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 font-mono font-bold text-[var(--primary)]">/{link.path}</td>
                    <td className="px-8 py-6 max-w-xs truncate opacity-60 font-medium">{link.original_url}</td>
                    <td className="px-8 py-6 font-bold">{link.visits}</td>
                    <td className="px-8 py-6 opacity-40 text-sm">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => copylinkhandler(link.path)}
                          className={cn(
                            "p-3 bg-[var(--surface-variant)] rounded-xl hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-all active:scale-90",
                            copypath === link.path && "bg-green-500 text-white"
                          )}
                        >
                          {copypath === link.path ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        <a
                          href={`/r/${link.path}`}
                          target="_blank"
                          className="p-3 bg-[var(--surface-variant)] rounded-xl hover:bg-[var(--primary-container)] transition-all active:scale-90"
                        >
                          <ExternalLink size={18} />
                        </a>
                        {/* delete button was here, pulled it bc too easy to misclick */}
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
              <div key={link.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-2xl text-[var(--primary)]">/{link.path}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copylinkhandler(link.path)}
                      className={cn(
                        "p-4 bg-[var(--surface-variant)] rounded-2xl active:scale-90 transition-all",
                        copypath === link.path && "bg-green-500 text-white"
                      )}
                    >
                      {copypath === link.path ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                    <a
                      href={`/r/${link.path}`}
                      target="_blank"
                      className="p-4 bg-[var(--surface-variant)] rounded-2xl active:scale-90 transition-all"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-black tracking-widest opacity-30">Destination</div>
                  <div className="truncate opacity-70 text-sm font-medium bg-[var(--surface)] p-3 rounded-xl border border-[var(--outline-variant)]/20">
                    {link.original_url}
                  </div>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black tracking-widest opacity-30">Visits</div>
                      <div className="font-bold text-lg">{link.visits}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black tracking-widest opacity-30">Date</div>
                      <div className="font-bold opacity-60 text-sm">{new Date(link.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {links.length === 0 && (
            <div className="px-8 py-20 text-center opacity-30 font-display text-2xl font-black">
              db is empty or lambda has restarted.
            </div>
          )}
        </Uppercasecard>
      </div>
    </div>
  );
}
