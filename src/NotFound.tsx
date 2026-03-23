import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Ghost, Terminal, Home } from 'lucide-react';

// might be worth adding a search box here at some point but maybe useless??
const NotFound = ({ go }: { go?: (page: string) => void }) => {
  // read once, never changes, no need for state
  const missing = (() => {
    try { return new URLSearchParams(window.location.search).get('missing'); }
    catch { return null; }
  })();

  return (
    <div className="flex flex-col min-h-[85vh] w-full text-center relative overflow-hidden rounded-[3rem] bg-[var(--surface)] p-6 md:p-12">
      {/* bg 404 pushed up on mobile to avoid overlapping the text */}
      <div className="absolute inset-0 flex items-start justify-center pt-24 md:items-center md:pt-0 pointer-events-none select-none">
        <motion.h1 
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            opacity: 0.03,
            scale: 1
          }}
          transition={{ duration: 1.5 }}
          className="text-[12rem] md:text-[28rem] font-display font-black tracking-tighter leading-none"
        >
          404
        </motion.h1>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between h-full flex-1 w-full max-w-5xl mx-auto gap-12 md:gap-0">
        {/* little floating banner at the top */}
        <motion.div
          initial={{
            y: -20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{ duration: 0.6 }}
          className="mt-4 md:mt-0"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-[var(--surface-variant)]/80 backdrop-blur-md text-[var(--primary)] shadow-xl border border-[var(--outline-variant)]/50">
            <Ghost className="w-5 h-5 md:w-8 md:h-8 shrink-0 opacity-80" strokeWidth={1.5} />
            <span className="text-xs md:text-lg font-display font-bold tracking-widest opacity-80 border-l border-[var(--outline-variant)] pl-4">
              how did we get here?
            </span>
          </div>
        </motion.div>

        {/* actual error text */}
        <motion.div 
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="py-4 md:py-0"
        >
          <h2 className="text-5xl md:text-9xl font-display font-black tracking-tight mb-6 text-balance leading-[0.85]">
            {missing ? "link's dead." : "nothing here."}
          </h2>
          <p className="text-lg md:text-2xl text-[var(--on-surface-variant)] opacity-70 font-light max-w-xl mx-auto leading-tight px-4 text-pretty">
            {missing 
              ? `/${missing} doesn't exist or got deleted.`
              : "whatever you were looking for isn't here. might never have been."}
          </p>
        </motion.div>

        {/* buttons */}
        <motion.div 
          initial={{
            y: 40,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center pb-8 md:pb-0"
        >
          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => missing ? go?.('dash') : window.history.back()}
            className="w-full sm:w-64 py-5 md:py-8 rounded-3xl font-display font-bold text-lg md:text-2xl bg-[var(--surface-variant)] text-[var(--on-surface-variant)] border-2 border-[var(--outline-variant)] flex items-center justify-center gap-3 transition-colors hover:bg-[var(--primary-container)] hover:text-[var(--on-primary-container)] group"
          >
            {missing
              ? <Terminal className="w-5 h-5 md:w-7 md:h-7" />
              : <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 group-hover:-translate-x-2 transition-transform duration-300" />
            }
            {missing ? "Dashboard" : "Go Back"}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => go?.('home')}
            className="w-full sm:w-64 py-5 md:py-8 rounded-3xl font-display font-bold text-lg md:text-2xl bg-[var(--primary)] text-[var(--on-primary)] shadow-2xl flex items-center justify-center gap-3 group"
          >
            go home
            <Home className="w-5 h-5 md:w-7 md:h-7 group-hover:scale-110 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%] z-20" />
    </div>
  );
};

export default NotFound;