'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link2, Check } from './MaterialIcon'
import { haptic } from '../haptics'

export default function CopyLinkCapsule() {
  const [copied, setCopied] = useState(false)

  const handle_copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      console.log("link copied lol:", window.location.href)
      haptic.medium()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("oh shit, clipboard write failed:", err)
      haptic.error()
    }
  }

  return (
    <motion.button
      onClick={handle_copy}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate={copied ? "copied" : "rest"}
      variants={{
        rest:   { scale: 1,    y: 0,  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)" },
        hover:  { scale: 1.05, y: -4, boxShadow: "0 20px 40px -8px rgba(0,0,0,0.25)" },
        tap:    { scale: 0.93, y: 0,  boxShadow: "0 5px 12px -4px rgba(0,0,0,0.12)" },
        copied: { scale: [1, 1.18, 0.9, 1.06, 1], y: 0, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)" },
      }}
      style={{
        backgroundColor: copied ? 'var(--primary-container)' : 'var(--surface-variant)',
      }}
      transition={{
        scale:     copied
          ? { duration: 0.55, times: [0, 0.2, 0.45, 0.7, 1], ease: ["easeOut", "easeInOut", "easeOut", "easeOut"] }
          : { type: "spring", stiffness: 500, damping: 22, mass: 0.6 },
        y:         { type: "spring", stiffness: 500, damping: 22, mass: 0.6 },
        boxShadow: { type: "spring", stiffness: 300, damping: 24 },
      }}
      className={`inline-flex items-center gap-3 px-10 py-5 rounded-full font-black text-[17px] border border-[var(--outline)]/15 shadow-xl transition-colors duration-300 ${
        copied ? 'text-[var(--on-primary-container)]' : 'text-[var(--on-surface)]'
      }`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0,   opacity: 1 }}
            exit={{    scale: 0, rotate:  45,  opacity: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 18, mass: 0.5 }}
          >
            <Check size={24} strokeWidth={3} />
          </motion.div>
        ) : (
          <motion.div
            key="link"
            initial={{ scale: 0, rotate: 45,  opacity: 0 }}
            animate={{ scale: 1, rotate: 0,   opacity: 1 }}
            exit={{    scale: 0, rotate: -45,  opacity: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 18, mass: 0.5 }}
          >
            <Link2 size={24} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.span
          key={copied ? "copied-text" : "copy-text"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{    opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 500, damping: 22, mass: 0.5 }}
          className="min-w-[110px] tracking-wider"
        >
          {copied ? 'link copied!' : 'copy link'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
