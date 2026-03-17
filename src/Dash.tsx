import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ExternalLink, Link as LinkIcon, Plus, Hash, Globe, AlertTriangle } from 'lucide-react';
import { cn } from './constants';

const _Card = ({ children, className, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.33, 1, 0.68, 1] }}
    className={cn("bg-[var(--surface-variant)]/20 border-2 border-[var(--outline-variant)]/50 rounded-[2.5rem] p-8 md:p-12", className)}
  >
    {children}
  </motion.div>
);

export default function DashPage() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [links, setLinks] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [copySlug, setCopySlug] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState('https://keep.google.com/');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const _EXAMPLES = [
    'https://github.com/hnpf/LOOM_PROGRAMMING_LANGUAGE',
    'https://virex.lol/lens',
    'https://archlinux.org/download/',
    'https://news.ycombinator.com/',
    'https://en.wikipedia.org/wiki/Social_engineering_(security)',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ];

  const _vxFetchLinks = async () => {
    try {
      const res = await fetch('/api/urls');
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setLinks(data);
      }
    } catch {}
  };

  useEffect(() => {
    _vxFetchLinks();
    setPlaceholder(_EXAMPLES[Math.floor(Math.random() * _EXAMPLES.length)]);
  }, []);

  const _vxHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, slug })
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
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
      setSlug('');
      _vxFetchLinks();
    } catch (e: any) {
      setError('backend is unreachable');
    }
  };

  const _vxCopy = (slug: string) => {
    const full = `${window.location.protocol}//${window.location.host}/r/${slug}`;
    navigator.clipboard.writeText(full);
    setCopySlug(slug);
    setTimeout(() => setCopySlug(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20 relative">
      {/* my ominous disclaimer */}
      <AnimatePresence>
        {!showScrollTop && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-50 group"
            onClick={() => setShowDisclaimer(!showDisclaimer)}
          >
            <div className={cn(
              "flex items-center bg-[var(--surface-variant)] border-2 border-[var(--outline-variant)] text-[var(--on-surface-variant)] rounded-full shadow-2xl backdrop-blur-xl transition-all duration-500 ease-[0.33,1,0.68,1] overflow-hidden h-[60px] active:scale-95 cursor-help group-hover:border-[var(--primary)] group-hover:bg-[var(--surface)]",
              showDisclaimer ? "w-auto pr-8 border-[var(--primary)] bg-[var(--surface)]" : "w-[60px] group-hover:w-auto group-hover:pr-8"
            )}>
              <div className="w-[56px] h-[56px] flex items-center justify-center shrink-0">
                <AlertTriangle size={22} className="text-[var(--primary)]" />
              </div>
              <span className={cn(
                "text-[12px] font-black tracking-[0.2em] whitespace-nowrap transition-all duration-500 pointer-events-none pr-8",
                showDisclaimer ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                links will vanish on vercel.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="page-header space-y-4">
        <h1 className="page-title !text-8xl !md:text-[10rem] leading-[0.8]">Shorten</h1>
        	<br></br>
        	<motion.p 
			initial={{ opacity: 0, y: 20 }}
        			animate={{ opacity: 1, y: 0 }}
       			 	transition={{ delay: 0.2, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        			className="md:text-2xl font-display font-light text-[var(--on-surface-variant)] leading-tight max-w-4xl"
     			 >
        			  pLZ USe HTTPS!11!
     		 </motion.p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <_Card className="bg-[var(--primary-container)]/10 border-[var(--primary)]/20 relative overflow-hidden group">
          <form onSubmit={_vxHandleSubmit} className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Globe size={14} className="text-[var(--primary)]" />
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Destination URL</label>
                </div>
                <input
                  type="url"
                  placeholder={placeholder}
                  className="w-full bg-[var(--surface)] border-2 border-[var(--outline-variant)] focus:border-[var(--primary)] rounded-3xl px-8 py-5 text-xl outline-none transition-all shadow-inner"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-4 space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Hash size={14} className="text-[var(--primary)]" />
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Custom Slug</label>
                </div>
                <input
                  type="text"
                  placeholder="optional"
                  className="w-full bg-[var(--surface)] border-2 border-[var(--outline-variant)] focus:border-[var(--primary)] rounded-3xl px-8 py-5 text-xl font-mono outline-none transition-all shadow-inner"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-[var(--outline-variant)]/20">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
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
                className="w-full md:w-auto bg-[var(--primary)] text-[var(--on-primary)] font-black uppercase tracking-widest px-12 h-16 rounded-[1.5rem] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[var(--primary)]/20 group/btn"
              >
                Create Link
                <Plus size={22} className="group-hover/btn:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </form>
          
          <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <LinkIcon size={400} />
          </div>
        </_Card>

        <_Card delay={0.1} className="p-0 overflow-hidden border-0 md:border-2">
          {/* desktop yable view */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--outline-variant)]/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Slug</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Original URL</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Visits</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Created</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40"></th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-b border-[var(--outline-variant)]/10 hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 font-mono font-bold text-[var(--primary)]">/{link.slug}</td>
                    <td className="px-8 py-6 max-w-xs truncate opacity-60 font-medium">{link.original_url}</td>
                    <td className="px-8 py-6 font-bold">{link.visits}</td>
                    <td className="px-8 py-6 opacity-40 text-sm">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => _vxCopy(link.slug)}
                          className={cn(
                            "p-3 bg-[var(--surface-variant)] rounded-xl hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-all active:scale-90",
                            copySlug === link.slug && "bg-green-500 text-white"
                          )}
                        >
                          {copySlug === link.slug ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        <a
                          href={`/r/${link.slug}`}
                          target="_blank"
                          className="p-3 bg-[var(--surface-variant)] rounded-xl hover:bg-[var(--primary-container)] transition-all active:scale-90"
                        >
                          <ExternalLink size={18} />
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
              <div key={link.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-2xl text-[var(--primary)]">/{link.slug}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => _vxCopy(link.slug)}
                      className={cn(
                        "p-4 bg-[var(--surface-variant)] rounded-2xl active:scale-90 transition-all",
                        copySlug === link.slug && "bg-green-500 text-white"
                      )}
                    >
                      {copySlug === link.slug ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                    <a
                      href={`/r/${link.slug}`}
                      target="_blank"
                      className="p-4 bg-[var(--surface-variant)] rounded-2xl active:scale-90 transition-all"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-widest opacity-30">Destination</div>
                  <div className="truncate opacity-70 text-sm font-medium bg-[var(--surface)] p-3 rounded-xl border border-[var(--outline-variant)]/20">
                    {link.original_url}
                  </div>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-30">Visits</div>
                      <div className="font-bold text-lg">{link.visits}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-30">Date</div>
                      <div className="font-bold opacity-60 text-sm">{new Date(link.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {links.length === 0 && (
            <div className="px-8 py-20 text-center opacity-30 font-display text-2xl font-black italic">
              the database is empty or lambda has restarted.
            </div>
          )}
        </_Card>
      </div>
    </div>
  );
}
