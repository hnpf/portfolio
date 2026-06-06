import React, { memo } from "react";
import { cn, TRACKER_ITEMS } from "../constants";
import { Card } from "../components/Card";

export const TrackerPage = memo(() => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="page-header flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="page-title">Tracker</h2>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {TRACKER_ITEMS.map((item, i) => (
          <Card
            key={item.id}
            delay={i * 0.1}
            innerClassName="p-10 border-6 border-[var(--outline-variant)]/40 hover:border-[var(--primary)] transition-colors flex flex-col justify-between min-h-[400px]"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                    item.category === 'Cybersec' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                    item.category === 'Dev' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                    item.category === 'Research' ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" :
                    "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                  )}>
                    {item.category}
                  </span>
                </div>
                <h3 className="text-4xl font-display font-black tracking-tight">
                  {item.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">
                    key focus
                  </h4>
                  <ul className="space-y-3">
                    {item.tips.map((tip, index) => (
                      <li key={index} className="flex gap-3 text-lg opacity-80 italic">
                        <span className="text-[var(--primary)] font-bold">~</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">
                    tools / stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tools.map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] rounded-lg text-xs font-bold border border-[var(--outline-variant)]/30">
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
