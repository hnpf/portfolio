// @ts-nocheck

import React, { memo } from "react";
import { cn, TRACKER_ITEMS } from "../constants";
import { Card } from "../components/Card";

export const TrackerPage = memo(() => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
      <header className="page-header flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-4">
          <h2 className="page-title !text-6xl md:!text-9xl font-expressive-bold italic">Tracker</h2>
          <p className="text-xl md:text-2xl font-display font-medium text-[var(--on-surface-variant)] opacity-60 max-w-2xl leading-tight">
            current status of my research projects, tools, and ongoing explorations.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-0">
        {TRACKER_ITEMS.map((item, i) => (
          <Card
            key={item.id}
            delay={i * 0.1}
            innerClassName="p-8 md:p-12 border-6 border-[var(--outline-variant)]/40 hover:border-[var(--primary)] transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/tracker"
          >
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border-2",
                    item.category === 'Cybersec' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    item.category === 'Dev' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    item.category === 'Research' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                    "bg-orange-500/10 text-orange-500 border-orange-500/20"
                  )}>
                    {item.category}
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/tracker:translate-x-1 transition-transform duration-300">
                  {item.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[var(--outline-variant)]/30 pt-10">
                <div className="space-y-6">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--primary)] opacity-80 italic">
                    key focus
                  </h4>
                  <ul className="space-y-4">
                    {item.tips.map((tip, index) => (
                      <li key={index} className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                        <span className="text-[var(--primary)] font-black group-hover/tip:scale-125 transition-transform duration-200">/</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--primary)] opacity-80 italic">
                    the stack
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {item.tools.map((tool, index) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 bg-[var(--surface-variant)]/50 text-[var(--on-surface-variant)] rounded-xl text-xs font-bold border-4 border-[var(--outline-variant)]/30 hover:border-[var(--primary)]/40 hover:bg-[var(--primary-container)]/10 transition-all cursor-default"
                      >
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
});
