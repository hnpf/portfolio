import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookText, Ghost, Cpu, X, Terminal } from 'lucide-react';

const NotFound = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const [debugOpen, setDebugOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full text-center relative overflow-hidden rounded-[3rem] bg-[var(--surface)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.12, scale: 0.8 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[800px] h-[800px] bg-[var(--primary)] rounded-full blur-[160px]" />
      </motion.div>
      <div className="relative z-10 w-full max-w-5xl px-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-[3rem] bg-[var(--surface-variant)] text-[var(--primary)] shadow-2xl border border-[var(--outline-variant)]">
            <Ghost size={40} strokeWidth={1.5} className="animate-pulse" />
            <span className="text-xl font-display font-bold tracking-tight opacity-90 border-l border-[var(--outline-variant)] pl-6">
              How did we get here?
            </span>
          </div>
        </motion.div>
        <div className="relative">
          {/* mass bg 404 */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.04, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 flex items-center justify-center text-[18rem] md:text-[32rem] font-display font-black tracking-tighter leading-none select-none -z-10"
          >
            404
          </motion.h1>
          <motion.div 
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 pt-16 md:pt-24"
          >
            <h2 className="text-6xl md:text-9xl font-display font-black tracking-tight mb-8 text-balance leading-[0.85]">
              Endpoint <br/> non-existent.
            </h2>
            <p className="text-xl md:text-2xl text-[var(--on-surface-variant)] mb-16 opacity-70 font-light max-w-2xl mx-auto leading-tight">
              the data you're requesting has been purged or never existed in this sector of the grid.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <motion.button 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="m3-button-tonal text-2xl px-12 py-8 rounded-[2.5rem] group border border-[var(--outline-variant)]"
              >
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform duration-300" size={28} />
                Return
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('blog')}
                className="m3-button-filled text-2xl px-12 py-8 rounded-[2.5rem] shadow-2xl group"
              >
                Check Blog
                <BookText className="group-hover:translate-x-2 transition-transform duration-300" size={28} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* cool fab */}
      <div className="absolute bottom-1 right-12 z-50">
        <motion.div
          animate={{ 
            width: debugOpen ? 340 : 64, 
            height: debugOpen ? 220 : 64,
            borderRadius: debugOpen ? '1.5rem' : '2.2rem' 
          }}
          className="bg-[var(--surface-variant)] border border-[var(--outline-variant)] shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <button 
            onClick={() => setDebugOpen(!debugOpen)}
            className="w-full h-16 flex items-center justify-center px-5 shrink-0 hover:bg-[var(--primary-container)] transition-colors relative"
          >
            <div className="flex items-center gap-4 w-full">
              <Cpu size={28} className={debugOpen ? "text-[var(--primary)]" : "opacity-60"} />
              {debugOpen && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 flex-1 text-left">
                  Trace Logs
                </span>
              )}
              {debugOpen && <X size={20} className="opacity-40" />}
            </div>
          </button>
          <AnimatePresence>
            {debugOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 pt-0 font-mono text-[11px] text-left space-y-1.5 overflow-y-auto flex-1 scrollbar-hide"
              >
                <div className="text-green-500/80 flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full animate-ping"/> [OK] session_active</div>
                <div className="text-[var(--primary)] opacity-90">[INFO] path_resolv: {window.location.pathname}</div>
                <div className="opacity-40 font-italic">// looking for {window.location.pathname.split('/')[1] || 'root'}?</div>
                <div className="text-rose-500/80">[ERR] page_null: 0x404_NOT_FOUND</div>
                <div className="text-amber-500/60">[WARN] integrity_check_failed</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
    </div>
  );
};

export default NotFound;