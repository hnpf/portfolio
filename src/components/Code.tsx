import React, { useState, useEffect, useRef } from "react";
import { Check, Copy } from "./MaterialIcon";
import { motion, AnimatePresence } from "motion/react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import rust from "highlight.js/lib/languages/rust";
import c from "highlight.js/lib/languages/c";

// register only the languages actually going to be used in blog posts (will update if more are used ofc)
hljs.registerLanguage("python", python);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("c", c);


const extractText = (node: any): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node?.props?.children) return extractText(node.props.children);
  return "";
};

const getLang = (node: any): string | null => {
  const cls: string =
    node?.props?.className ||
    (Array.isArray(node)
      ? node.find((c: any) => c?.props?.className)?.props?.className
      : "") ||
    "";
  const match = cls.match(/language-(\w+)/);
  return match ? match[1] : null;
};

export const Code = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const raw = extractText(children).replace(/\n$/, "");
  const lang = getLang(children);

  useEffect(() => {
    if (codeRef.current && lang) {
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
    }
  }, [raw, lang]);

  const copy = () => {
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper relative group/code my-8 rounded-[1.75rem] overflow-hidden border border-[var(--outline-variant)]">
      {/* top bar */}
      <div className="code-block-topbar flex items-center justify-between px-5 py-3 border-b border-[var(--outline-variant)]">
        <div className="flex items-center gap-3">
          {lang && (
            <span className="text-[12px] font-mono font-black tracking-[0.18em] text-[var(--primary)] opacity-80">
              {lang}
            </span>
          )}
        </div>

        {/* copy button */}
        <motion.button
          onClick={copy}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 600, damping: 20 }}
          className="m3-button-tonal !h-8 !px-4 !text-[12px] !rounded-xl gap-1.5 flex items-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                className="flex items-center gap-1.5 text-green-500"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <Check size={11} />
                copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <Copy size={11} />
                copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* code */}
      <div className="overflow-x-auto custom-scrollbar">
        <pre className="code-block-pre p-6 m-0 text-sm leading-7">
          {lang ? (
            <code ref={codeRef} className={`hljs language-${lang}`}>
              {raw}
            </code>
          ) : (
            <code className="opacity-80">{raw}</code>
          )}
        </pre>
      </div>
    </div>
  );
};
