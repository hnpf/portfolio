// @ts-nocheck
import React, { memo } from "react";
import { Card } from "../components/Card";

export const NowPage = memo(() => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 pb-24">
      <header className="page-header flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-4">
          <h2 className="page-title !text-6xl md:!text-9xl font-expressive-bold italic">Now</h2>
          <p className="text-xl md:text-2xl font-display font-medium text-[var(--on-surface-variant)] opacity-60 max-w-2xl leading-tight">
            what i'm actively building, learning, reading, and listening to right now.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {/* SECTION 1: BUILDING */}
        <Card
          delay={0.1}
          innerClassName="p-8 md:p-12 border-6 border-[var(--outline-variant)]/90 hover:border-[var(--primary)] transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
                Now Building
              </h3>
            </div>
            <div className="space-y-6 border-t border-[var(--outline-variant)]/90 pt-10">
              <ul className="space-y-4">
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <span className="text-[var(--primary)] font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                  Helping the community and becoming more open to PR's and contributions
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <span className="text-[var(--primary)] font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                  Tinkering with personal base workflows and tools/scripts.
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <span className="text-[var(--primary)] font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                  Frequently updating and reworking virex.lol for the best user experience i can possibly make
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card
          delay={0.2}
          innerClassName="p-8 md:p-12 border-6 border-[var(--outline-variant)]/90 hover:border-[var(--primary)] transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
                Now Learning
              </h3>
            </div>
            <div className="space-y-6 border-t border-[var(--outline-variant)]/90 pt-10">
              <ul className="space-y-4">
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <span className="text-[var(--primary)] font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                  Sound design & synthesis: wave architectures, fm synthesis basics, etc.
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <span className="text-[var(--primary)] font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                  Hardware interfaces: managing low latency audio pipelines
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <span className="text-[var(--primary)] font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                  Hyprland plug-ins: experimenting with plugins like "Infinite canvas" and Gloview in my primary configs along with quickshell.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card
          delay={0.4}
          className="md:col-span-2"
          innerClassName="bg-[var(--primary)] text-[var(--on-primary)] p-8 md:p-12 border-6 border-[var(--outline-variant)]/40 hover:border-[var(--surface-variant)] transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
                Now Listening
              </h3>
            </div>
            
            {/* grid splits columns on desktop, stacks on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 border-t border-[var(--on-primary)]/20 pt-10">
              
              {/* left column: genres / artists */}
              <div className="space-y-4">
                <h4 className="text-xs text-[13px] tracking-widest font-bold opacity-60 mb-5">Genres on Rotation</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <span className="font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                    Rotations of bm, screamo, etc.
                  </li>
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <span className="font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                    Digicore tracks, witch house, ambient pop
                  </li>
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <span className="font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                    Frequent rage, hip-hop, trap
                  </li>
                </ul>
              </div>

              {/* right column: artists */}
              <div className="space-y-4">
                <h4 className="text-xs text-[13px] tracking-widest font-bold opacity-60 mb-5">Artists on Repeat</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <span className="font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                    Lifelover, Blade and Bath, Far From Forgiven
                  </li>
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <span className="font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                    Sensi Affect, Soft Blade, Chernoburkv
                  </li>
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip">
                    <span className="font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                    OsamaSon, Che, skaiwater, Dani Kiyoko
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </Card>
      </div>
    </div>
  );
});