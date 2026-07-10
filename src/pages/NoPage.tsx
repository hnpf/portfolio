import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// konami code sequence
const konami_sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const virexkey = 'virex';
// how long the mass click window is in ms
const masstimewindow = 1500;
const massclicklimit = 10;
// font stack for when text gets corrupted
const messy_fontstack = 'ui-monospace, "Cascadia Code", "Fira Code", monospace';
// tried doing this with a lookup object first but this is maybe cleaner.
const get_fontsize = (t: string) => {
  if (t === 'shinigami') return '11vw';
  if (t.length > 4) return '18rem';
  return '28rem';
};

const NoPage = () => {
  const [text, textset] = useState('no');
  const [clicks, setClicks] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [yes_total, setYesTotal] = useState(0);
  const [maybe_on, setMaybeOn] = useState(false);
  const [messy, setMessy] = useState(false);
  const [amber, setAmber] = useState(false);
  const recent_ts = useRef<number[]>([]);
  const konami_prog = useRef(0);
  const virex_prog = useRef(0);
  const longpress_t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revert_t = useRef<ReturnType<typeof setTimeout> | null>(null);
  // snapshots so closures inside timeouts can read current values
  const text_snap = useRef(text);
  const maybe_snap = useRef(maybe_on);
  text_snap.current = text;
  maybe_snap.current = maybe_on;

  // log something fun to the console for curious people
  useEffect(() => {
    console.log('%c you found the console.', 'color: #f97316; font-size: 14px; font-weight: bold');
    console.log('%c virex.lol // there is nothing here for you', 'color: #78716c; font-size: 11px');
    console.log('%c 7368696e6967616d69', 'color: #f97316; font-family: monospace; font-size: 10px');
  }, []);

  // keyboard listener for konami code and virex easter egg
  useEffect(() => {
    const on_key = (e: KeyboardEvent) => {
      const k = e.key;
      // check if theyre typing "virex" to toggle amber mode
      const vi = virex_prog.current;
      if (virexkey[vi] === k.toLowerCase()) {
        virex_prog.current = vi + 1;
        if (virex_prog.current === virexkey.length) {
          setAmber(prev => !prev);
          virex_prog.current = 0;
        }
      } else {
        virex_prog.current = k.toLowerCase() === virexkey[0] ? 1 : 0;
      }

      // check konami code progress
      const ki = konami_prog.current;
      if (konami_sequence[ki] === k) {
        konami_prog.current = ki + 1;
        if (konami_prog.current === konami_sequence.length) {
          textset('shinigami');
          setClicks(0);
          konami_prog.current = 0;
        }
      } else {
        konami_prog.current = konami_sequence[0] === k ? 1 : 0;
      }
    };

    window.addEventListener('keydown', on_key);
    return () => window.removeEventListener('keydown', on_key);
  }, []);

  // auto-revert from "yes" back to "no" after 10 seconds
  useEffect(() => {
    if (text !== 'yes') return;
    revert_t.current = setTimeout(() => {
      textset('no');
      setClicks(0);
      setCycles(prev => {
        const n = prev + 1;
        if (n >= 3) setMaybeOn(true);
        return n;
      });
    }, 10000);
    return () => clearTimeout(revert_t.current!);
  }, [text]);

  const inc_cycles = () =>
    setCycles(prev => {
      const n = prev + 1;
      if (n >= 3) setMaybeOn(true);
      return n;
    });

  const go_yes = () => {
    setYesTotal(prev => {
      const n = prev + 1;
      // mess w the font after saying yes 5 times im lowk bored
      if (n >= 5) setMessy(true);
      return n;
    });
    textset('yes');
    setClicks(0);
  };

  const on_click = () => {
    const now = Date.now();
    // filter clicks to only those within the mass click thing window
    recent_ts.current = [...recent_ts.current, now].filter(t => now - t < masstimewindow);

    // mass click detect
    if (recent_ts.current.length >= massclicklimit) {
      recent_ts.current = [];
      clearTimeout(revert_t.current!);
      textset('FINE');
      setClicks(0);
      setTimeout(() => textset(t => t === 'FINE' ? 'no' : t), 2000);
      return;
    }

    if (text === 'FINE' || text === '...') return;
    if (text === 'shinigami') {
      textset('no');
      setClicks(0);
      return;
    }
    if (text === 'why') {
      textset('no');
      setClicks(0);
      return;
    }
    if (text === 'maybe') {
      textset('no');
      setClicks(0);
      return;
    }
    if (text === 'yes') {
      clearTimeout(revert_t.current!);
      if (maybe_snap.current) {
        textset('maybe');
      } else {
        textset('no');
        inc_cycles();
      }
      setClicks(0);
      return;
    }

    // og "no" logic, need 5 clicks to get yes
    if (text === 'no') {
      const n = clicks + 1;
      if (n >= 5) {
        go_yes();
      } else {
        setClicks(n);
      }
    }
  };

  // long press shows "why" after 3 secs
  const on_ptr_down = useCallback(() => {
    longpress_t.current = setTimeout(() => {
      if (text_snap.current !== 'no') return;
      textset('...');
      setTimeout(() => {
        if (text_snap.current !== '...') return;
        textset('why');
        // revert why back to no after 2 seconds
        setTimeout(() => {
          if (text_snap.current === 'why') textset('no');
        }, 2000);
      }, 1500);
    }, 3000);
  }, []);

  const on_ptr_up = useCallback(() => clearTimeout(longpress_t.current!), []);

  // apply dumb font when corrupted
  const messy_style = messy
    ? { fontFamily: messy_fontstack, filter: 'blur(0.35px)', letterSpacing: '-0.01em' }
    : {};

  return (
    <div
      className="flex flex-col min-h-[85vh] w-full text-center relative overflow-hidden rounded-[3rem] bg-[var(--surface)] p-6 md:p-12 items-center justify-center cursor-pointer select-none"
      style={amber ? { backgroundColor: 'color-mix(in srgb, var(--surface) 50%, #f97316 50%)', transition: 'background-color 0.9s ease' } : {}}
      onClick={on_click}
      onPointerDown={on_ptr_down}
      onPointerUp={on_ptr_up}
      onPointerLeave={on_ptr_up}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={text}
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
          transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.5 }}
          className="font-display font-black tracking-tighter leading-none select-none"
          style={{ fontSize: get_fontsize(text), ...messy_style }}
        >
          {text}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

export default NoPage;