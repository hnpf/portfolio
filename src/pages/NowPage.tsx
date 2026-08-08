// @ts-nocheck
import React, { memo } from "react";
import { Card } from "../components/Card";
import { materialIcon } from "../components/MaterialIcon";

const BuildIcon = materialIcon("terminal");
const LearnIcon = materialIcon("school");
const ListenIcon = materialIcon("headphones");
const MusicIcon = materialIcon("music_note");
const ArtistIcon = materialIcon("person");
const ListIcon = materialIcon("chevron_right");

export const NowPage = memo(() => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 pb-24">
      <header className="page-header flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-4">
          <h2 className="page-title !text-6xl md:!text-9xl font-expressive-bold italic">Now</h2>
          <p className="text-xl md:text-2xl font-display font-medium text-[var(--on-surface-variant)] opacity-60 max-w-2xl leading-tight">
            What I'm currently building, learning, and listening to right now.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {/* SECTION 1: BUILDING */}
        <Card
          delay={0.1}
          innerClassName="p-8 md:p-12 border-6 border-[var(--outline-variant)]/90 transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="flex items-center gap-4 text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
                <BuildIcon size={42} fill className="text-[var(--primary)] shrink-0" />
                Now Building
              </h3>
            </div>
            <div className="space-y-6 border-t border-[var(--outline-variant)]/90 pt-10">
              <ul className="space-y-4">
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Helping the community and becoming more open to PR's and contributions
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Tinkering with personal base workflows and tools/scripts.
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Frequently updating and reworking virex.lol for the best user experience i can possibly make
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card
          delay={0.2}
          innerClassName="p-8 md:p-12 border-6 border-[var(--outline-variant)]/90 transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="flex items-center gap-4 text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
                <LearnIcon size={42} fill className="text-[var(--primary)] shrink-0" />
                Now Learning
              </h3>
            </div>
            <div className="space-y-6 border-t border-[var(--outline-variant)]/90 pt-10">
              <ul className="space-y-4">
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Sound design & synthesis: wave architectures, fm synthesis basics, etc.
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Hardware interfaces: managing low latency audio pipelines
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Hyprland plug-ins: experimenting with plugins like "Infinite canvas" and Gloview in my primary configs along with quickshell.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card
          delay={0.4}
          className="md:col-span-2"
          innerClassName="bg-[var(--primary)] text-[var(--on-primary)] p-8 md:p-12 border-6 border-[var(--outline-variant)]/40 transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="flex items-center gap-4 text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
                <ListenIcon size={42} fill className="text-[var(--on-primary)] shrink-0" />
                Now Listening
              </h3>
            </div>
            
            {/* grid splits columns on desktop, stacks on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 border-t border-[var(--on-primary)]/20 pt-10">
              
              {/* left column: genres / artists */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-xs text-[13px] tracking-widest font-bold opacity-60 mb-5"><MusicIcon size={18} fill /> Genres on Rotation</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <ListIcon size={18} fill className="mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                    Rotations of bm, screamo, etc.
                  </li>
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <ListIcon size={18} fill className="mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                    Digicore tracks, witch house, ambient pop
                  </li>
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <ListIcon size={18} fill className="mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                    Frequent rage, hip-hop, trap
                  </li>
                </ul>
              </div>

              {/* right column: artists */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-xs text-[13px] tracking-widest font-bold opacity-60 mb-5"><ArtistIcon size={18} fill /> Artists on Repeat</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <ListIcon size={18} fill className="mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                    Lifelover, Blade and Bath, Far From Forgiven
                  </li>
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip mb-7">
                    <ListIcon size={18} fill className="mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                    Sensi Affect, Soft Blade, Chernoburkv
                  </li>
                  <li className="flex gap-3 text-[17px] opacity-90 leading-relaxed group/tip">
                    <ListIcon size={18} fill className="mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
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
