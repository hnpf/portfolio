// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ExternalLink, Link as LinkIcon, Hash, Globe, AlertTriangle, Loader2, ArrowRight } from '../components/MaterialIcon';
import { cn } from '../constants';
import { useTheme } from '../ThemeContext';
import { Card } from '../components/Card';
import { haptic } from '../haptics';

export default function DashPage() {
  const [url, setUrl] = useState('');
  const [path, setpath] = useState('');
  const [links, setLinks] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [copypath, setCopypath] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState('https://keep.google.com/');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { settings } = useTheme();

  const weirdlinkpresets = [
    'https://virex.lol/lens',
    'https://archlinux.org/download/',
    'https://news.ycombinator.com/',
    'https://en.wikipedia.org/wiki/Social_engineering_(security)',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ];

  const loadlink = async () => {
    try {
      const res = await fetch('/api/urls');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setLinks(data);
      }
    } catch (e: any) {
      console.error('failed to load links');
    }
  };

  useEffect(() => {
    loadlink();
    setPlaceholder(weirdlinkpresets[Math.floor(Math.random() * weirdlinkpresets.length)]);
    // auti-focus the input on start
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const submitlinkhandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, path })
      });

      const data = await res.json();
      if (!res.ok) {
        haptic.error();
        setError(data.error || 'failed to shorten url');
        setIsLoading(false);
        return;
      }

      haptic.success();
      setUrl('');
      setpath('');
      loadlink();
    } catch (e: any) {
      haptic.error();
      setError('backend is unreachable');
    } finally {
      setIsLoading(false);
    }
  };

  const copylinkhandler = (p: string) => {
    haptic.medium();
    const full = `${window.location.protocol}//${window.location.host}/r/${p}`;
    navigator.clipboard.writeText(full);
    setCopypath(p);
    setTimeout(() => setCopypath(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 md:space-y-24 pb-32 relative pt-8 md:pt-16">
      
      {/* hero input */}
      <div className="flex flex-col items-center justify-center px-4 md:px-0 relative z-20">
        <header className="page-header space-y-4 text-center mb-10 md:mb-16 flex flex-col items-center">
          <motion.h1 
            initial={settings.disableAnimations ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: settings.disableAnimations ? 0 : 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="page-title !text-6xl md:!text-8xl leading-[0.9] text-balance font-expressive-bold italic"
          >
            Create short links.
          </motion.h1>
          <motion.p 
            initial={settings.disableAnimations ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ duration: settings.disableAnimations ? 0 : 0.6, delay: settings.disableAnimations ? 0 : 0.1, ease: [0.33, 1, 0.68, 1] }}
            className="text-xl md:text-2xl font-display font-medium text-[var(--on-surface-variant)] opacity-60 max-w-2xl leading-tight"
          >
            HTTPS is only a suggestion!
          </motion.p>
        </header>

        <motion.div 
          initial={settings.disableAnimations ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: settings.disableAnimations ? 0 : 0.6, delay: settings.disableAnimations ? 0 : 0.2, ease: [0.33, 1, 0.68, 1] }}
          className="w-full max-w-5xl"
        >
          <form onSubmit={submitlinkhandler} className="relative group">
            <div className={cn(
              "absolute -inset-4 from-[var(--primary)] to-[var(--primary-container)] rounded-[3.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200",
              isFocused ? "opacity-50 duration-200" : ""
            )}></div>
            
            <div className={cn(
              "relative bg-[var(--surface)] border-6 border-[var(--outline-variant)]/60 rounded-[3rem] p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center transition-all duration-300",
              isFocused ? "border-[var(--primary)]/50 scale-[1.01]" : "hover:border-[var(--primary)]/30"
            )}>
              
              <div className="flex-1 w-full flex items-center bg-[var(--surface-variant)]/40 rounded-[2rem] px-4 sm:px-6 py-3 sm:py-4 border-4 border-transparent focus-within:bg-[var(--surface-variant)] focus-within:border-[var(--primary)]/20 transition-all min-h-[5rem]">
                <Globe className={cn("transition-colors duration-300 mr-3 sm:mr-4", isFocused ? "text-[var(--primary)]" : "text-[var(--primary)] opacity-40")} size={24} />
                <input
                  ref={inputRef}
                  type="url"
                  placeholder={placeholder}
                  className="w-full h-full bg-transparent text-xl sm:text-2xl md:text-4xl outline-none font-sans placeholder:opacity-20 leading-loose"
                  style={{ 
                    fontVariationSettings: `"wght" ${Math.min(900, Math.max(400, 400 + url.length * 40))}`,
                    fontWeight: Math.min(900, Math.max(400, 400 + url.length * 40))
                  }}
                  value={url}
                  onChange={e => {
                    setUrl(e.target.value);
                    haptic.light();
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                />
              </div>

              <div className="w-full md:w-auto flex items-center bg-[var(--surface-variant)]/40 rounded-[2rem] px-4 sm:px-6 py-3 sm:py-4 border-4 border-transparent focus-within:bg-[var(--surface-variant)] focus-within:border-[var(--primary)]/20 transition-all min-h-[5rem]">
                <Hash className="text-[var(--primary)] opacity-40 mr-2 md:mr-3" size={22} />
                <span className="text-xl sm:text-2xl font-mono opacity-30 mr-1">/</span>
                <input
                  type="text"
                  placeholder="custom"
                  className="w-full h-full bg-transparent text-xl sm:text-2xl font-mono outline-none placeholder:opacity-30 placeholder:font-medium leading-loose"
                  value={path}
                  onChange={e => {
                    setpath(e.target.value);
                    haptic.light();
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !url}
                className="w-full md:w-auto min-h-[5rem] h-auto bg-[var(--primary)] text-[var(--on-primary)] px-10 py-4 rounded-[2rem] flex items-center justify-center hover:scale-[1.02] active:scale-[0.95] disabled:opacity-50 disabled:scale-100 transition-all shadow-xl shadow-[var(--primary)]/20 group/btn"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={32} />
                ) : (
                  <ArrowRight size={36} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="relative top-full mt-8 left-0 right-0 mx-auto max-w-2xl text-red-500 font-bold flex items-center justify-center gap-3 bg-red-500/30 px-6 py-4 rounded-2xl mb-3 border-4 border-red-500/20 text-lg backdrop-blur-md z-30"
                >
                  <AlertTriangle size={24} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:gap-16 px-4 md:px-0 mt-20 relative z-10">
        <div className="space-y-8">
          <motion.div 
            initial={settings.disableAnimations ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: settings.disableAnimations ? 0 : 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-8 gap-4"
          >
            <h2 className="text-3xl md:text-4xl font-expressive-bold italic tracking-tight opacity-80">Recent Links</h2>
            <div className="h-px w-full sm:flex-1 sm:w-auto bg-[var(--outline-variant)]/30" />
            <span className="text-[14px] sm:text-[16px] font-black tracking-[0.2em] italic opacity-30 whitespace-nowrap">{links.length} total</span>
          </motion.div>

          <Card delay={0.5} className="w-full" innerClassName="p-0 overflow-hidden bg-[var(--surface-variant)]/10 backdrop-blur-md">
            {/* desktop table view */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-[var(--outline-variant)]/40 bg-[var(--surface)]/50">
                    <th className="px-8 py-8 text-[15px] border-r border-[var(--surface-variant)]/50 font-black tracking-[0.2em] opacity-50">Path</th>
                    <th className="px-8 py-8 text-[15px] border-r border-[var(--surface-variant)]/50 font-black tracking-[0.2em] opacity-50 w-[40%]">Destination</th>
                    <th className="px-8 py-8 text-[15px] border-r border-[var(--surface-variant)]/50 font-black tracking-[0.2em] opacity-50 text-center">Visits</th>
                    <th className="px-8 py-8 text-[15px]font-black tracking-[0.2em] opacity-50 text-right">Created</th>
                    <th className="px-4 py-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--outline-variant)]/20">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-[var(--primary-container)]/10 transition-colors group">
                      <td className="px-8 py-8 font-mono font-bold text-2xl text-[var(--primary)] tracking-tighter break-all">/{link.path}</td>
                      <td className="px-8 py-8 opacity-60 font-display font-medium text-xl break-all">{link.original_url}</td>
                      <td className="px-8 py-8 font-black text-2xl text-center tabular-nums opacity-80">{link.visits}</td>
                      <td className="px-8 py-8 opacity-40 text-sm font-bold text-right uppercase tracking-widest whitespace-nowrap">
                        {new Date(link.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-8 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copylinkhandler(link.path)}
                            className={cn(
                              "p-3 bg-[var(--surface)] rounded-xl hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition-all active:scale-90 border-4 border-[var(--outline-variant)]/30 hover:border-[var(--primary)]/20",
                              copypath === link.path && "bg-green-500 text-white border-green-500/20 hover:bg-green-600 hover:text-white"
                            )}
                          >
                            {copypath === link.path ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                          <a
                            href={`/r/${link.path}`}
                            target="_blank"
                            className="p-3 bg-[var(--surface)] rounded-xl hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] transition-all active:scale-90 border-4 border-[var(--outline-variant)]/30 hover:border-[var(--primary-container)]/20"
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
            <div className="md:hidden">
              {links.map((link, index) => (
                <div key={link.id} className={cn(
                  "px-5 py-5",
                  index === links.length - 1 ? "pb-6" : "pb-0"
                )}>
                  <div className="flex flex-col gap-4 rounded-[2rem] bg-[var(--surface)]/70 border border-[var(--outline-variant)]/30 p-5 shadow-sm shadow-[var(--surface)]/40">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5 overflow-hidden">
                        <div className="font-mono font-bold text-2xl text-[var(--primary)] tracking-tighter break-words">/{link.path}</div>
                        <div className="text-sm opacity-70 font-display break-words leading-6">
                          {link.original_url}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => copylinkhandler(link.path)}
                          className={cn(
                            "p-3 bg-[var(--surface)] rounded-xl active:scale-90 transition-all border-4 border-[var(--outline-variant)]/30",
                            copypath === link.path && "bg-green-500 text-white border-transparent"
                          )}
                        >
                          {copypath === link.path ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                        <a
                          href={`/r/${link.path}`}
                          target="_blank"
                          className="p-3 bg-[var(--surface)] rounded-xl active:scale-90 transition-all border-4 border-[var(--outline-variant)]/30"
                        >
                          <ExternalLink size={20} />
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-4 border-t border-[var(--outline-variant)]/20 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm font-bold opacity-60 bg-[var(--surface)] px-3 py-2 rounded-lg inline-block">
                        {link.visits} visits
                      </div>
                      <div className="text-xs font-bold opacity-40 uppercase tracking-widest">
                        {new Date(link.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {links.length === 0 && (
              <div className="px-10 py-32 text-center opacity-30 font-display text-3xl font-black italic tracking-tighter">
                Db is quiet, for now :(
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* some extra bg decor :) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-[0.02] dark:opacity-[0.03]">
        <LinkIcon size={800} className="text-[var(--primary)] -rotate-12 scale-150" />
      </div>
    </div>
  );
}
