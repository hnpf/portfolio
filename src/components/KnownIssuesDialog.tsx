import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bug, X, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info, Construction } from "lucide-react";
import { cn, KNOWN_ISSUES, KnownIssues } from "../constants";

interface KnownIssuesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const KnownIssuesDialog = ({
  isOpen,
  onClose,
  isMobile,
}: KnownIssuesDialogProps) => {
  const [expandedBugId, setExpandedBugId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedBugId(expandedBugId === id ? null : id);
  };

  const getStatusBadge = (status: KnownIssues["status"]) => {
    switch (status) {
      case "investigating":
        return {
          icon: <Info size={12} />,
          text: "Investigating",
          classes: "bg-amber-500/10 text-amber-500 border border-amber-500/30",
        };
      case "identified":
        return {
          icon: <AlertCircle size={12} />,
          text: "Identified",
          classes: "bg-orange-500/10 text-orange-500 border border-orange-500/30",
        };
      case "fixing":
        return {
          icon: <Construction size={12} />,
          text: "Fixing",
          classes: "bg-blue-500/10 text-blue-500 border border-blue-500/30",
        };
      case "resolved":
        return {
          icon: <CheckCircle size={12} />,
          text: "Resolved",
          classes: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30",
        };
      case "wontfix":
      default:
        return {
          icon: <X size={12} />,
          text: "Declined",
          classes: "bg-neutral-500/10 text-neutral-500 border border-neutral-500/30",
        };
    }
  };

  const getSeverityBadge = (severity: KnownIssues["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-rose-500/15 text-rose-500 font-black";
      case "medium":
        return "bg-orange-500/15 text-orange-500 font-bold";
      case "low":
      default:
        return "bg-sky-500/15 text-sky-500 font-medium";
    }
  };

  const dialogSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={cn(
          "fixed inset-0 z-[110] flex items-center justify-center overflow-hidden",
          isMobile ? "p-0 bg-black/20" : "p-4"
        )}>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md motion-gpu"
          />

          {/* modal container */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
            transition={isMobile ? { type: "spring", damping: 30, stiffness: 350, mass: 0.8 } : dialogSpring}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col motion-gpu border-[var(--outline-variant)]",
              isMobile 
                ? "w-full h-[100dvh] max-w-none max-h-none rounded-none border-none" 
                : "w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] max-h-[85vh] border"
            )}
            style={{ touchAction: "none" }}
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* drag handle for mobile */}
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1 shrink-0 bg-[var(--surface)]">
                  <div className="w-12 h-1.5 bg-[var(--outline-variant)] rounded-full opacity-40" />
                </div>
              )}

              {/* header */}
              <div className={cn(
                "flex justify-between items-center border-b border-[var(--outline-variant)] bg-[var(--surface)] sticky top-0 z-10 shrink-0",
                isMobile ? "p-4" : "p-6 md:p-8"
              )}>
                <div className="flex items-center gap-3">
                  <Bug size={24} className="text-[var(--primary)]" />
                  <h2 className="font-black text-xl md:text-2xl font-expressive uppercase tracking-tight">
                    Known Issues
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--surface-variant)] rounded-full transition-colors cursor-pointer text-[var(--on-surface)]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* list of bugs */}
              <div className={cn(
                "space-y-4 overflow-y-auto scrollbar-hide flex-1",
                isMobile ? "p-6 pb-32" : "p-6 md:p-8"
              )}>
                {KNOWN_ISSUES.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--on-surface-variant)]/60">
                    <CheckCircle size={70} className="mb-7 text-emerald-500/80" />
                    <p className="font-bold">No known bugs or issues have been reported!</p>
                    <p className="text-xs font-display mt-1">Everything seems to be running fine. If this is wrong, make a report!</p>
                  </div>
                ) : (
                  KNOWN_ISSUES.map((bug) => {
                    const statusBadge = getStatusBadge(bug.status);
                    const isExpanded = expandedBugId === bug.id;
                    
                    return (
                      <div
                        key={bug.id}
                        onClick={() => toggleExpand(bug.id)}
                        className={cn(
                          "border-6 border-[var(--outline-variant)] bg-[var(--surface-variant)]/40 hover:bg-[var(--surface-variant)]/70 transition-all rounded-[1.5rem] overflow-hidden cursor-pointer",
                          isExpanded && "bg-[var(--surface-variant)]/80 ring-2 ring-[var(--primary)]/20"
                        )}
                      >
                        {/* bug header sum */}
                        <div className="p-4 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-bold text-sm text-[var(--on-surface)] flex-1 leading-tight">
                              {bug.title}
                            </h3>
                            <div className="shrink-0 transition-transform duration-200">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 items-center text-[10px] pt-1">
                            {/* status badge */}
                            <span className={cn(
                              "flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider",
                              statusBadge.classes
                            )}>
                              {statusBadge.icon}
                              <span>{statusBadge.text}</span>
                            </span>

                            {/* severity badge */}
                            <span className={cn(
                              "px-2.5 py-1 rounded-full uppercase tracking-wider font-bold border border-black/5",
                              getSeverityBadge(bug.severity)
                            )}>
                              {bug.severity} severity
                            </span>

                            {/* date */}
                            <span className="text-[var(--on-surface-variant)]/60 ml-auto font-medium">
                              {bug.date}
                            </span>
                          </div>
                        </div>

                        {/* expanded details */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden bg-[var(--surface)] border-t border-[var(--outline-variant)]/50"
                            >
                              <div className="p-4 text-xs text-[var(--on-surface-variant)] leading-relaxed space-y-2">
                                <p className="font-medium">{bug.description}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>

              {/* footer */}
              <div className="p-6 border-t border-[var(--outline-variant)] shrink-0">
                <button
                  onClick={onClose}
                  className="w-full bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary)]/90 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer text-center shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
