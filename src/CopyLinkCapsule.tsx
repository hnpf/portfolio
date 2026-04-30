'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link2, Check } from 'lucide-react'

export default function CopyLinkCapsule() {
  const [copied, setCopied] = useState(false)

  const handle_copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clip unavailable, rip
    }
  }

  return (
    <motion.button
      onClick={handle_copy}
      initial={false}
      animate={{
        backgroundColor: copied ? 'var(--primary-container)' : 'var(--surface-variant)',
        scale: copied ? [1, 1.2, 0.95, 1.05, 1] : 1,
      }}
      transition={{
        backgroundColor: { duration: 0.3 },
        scale: { duration: 1, times: [0, 0.2, 0.4, 0.7, 1] },
      }}
      className={`inline-flex items-center gap-3 px-10 py-5 rounded-full font-black text-[17px] border border-[var(--outline)]/15 shadow-xl ${
        copied ? 'text-[var(--on-primary-container)]' : 'text-[var(--on-surface)]'
      }`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={24} />
          </motion.div>
        ) : (
          <motion.div
            key="link"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link2 size={24} />
          </motion.div>
        )}
      </AnimatePresence>

      <span className="min-w-[110px] tracking-wider">
        {copied ? 'link copied!' : 'copy link'}
      </span>
    </motion.button>
  )
}
