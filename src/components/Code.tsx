import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../constants";

export const Code = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);

  // a quick hack to pull text from react nodes
  const get_code = (nodes: any): string => {
    if (typeof nodes === "string") return nodes;
    if (Array.isArray(nodes)) return nodes.map(get_code).join("");
    if (nodes?.props?.children) return get_code(nodes.props.children);
    return "";
  };

  const code = get_code(children).replace(/\n$/, "");
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code">
      <button
        onClick={copy}
        className="absolute right-3 top-3 p-2 bg-[var(--surface-variant)] hover:bg-[var(--primary-container)] text-[var(--on-surface-variant)] hover:text-[var(--on-primary-container)] rounded-xl transition-all duration-150 opacity-0 group-hover/code:opacity-100 z-10 backdrop-blur-md border border-[var(--outline-variant)] active:scale-90"
      >
        {copied ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <Copy size={14} />
        )}
      </button>
      <pre
        className={cn(
          "bg-black/10 dark:bg-white/5 p-6 rounded-l-3xl rounded-r-xl overflow-x-auto font-mono text-sm my-6 border border-[var(--outline-variant)] custom-scrollbar",
          className,
        )}
      >
        {children}
      </pre>
    </div>
  );
};
