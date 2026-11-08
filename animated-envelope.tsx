'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { AsteriskMark } from './decor'
import { HandwrittenLetter } from './handwritten-letter'
import { LETTER } from '@/lib/content'

const EASE = [0.65, 0, 0.35, 1] as const
const LETTER_TRAVEL = 1.4
const UNFOLD_AFTER_MS = 1700

export function AnimatedEnvelope() {
  const [open, setOpen] = useState(false)
  const [reading, setReading] = useState(false)
  const unfoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (unfoldTimer.current) clearTimeout(unfoldTimer.current)
  }, [])

  const openEnvelope = () => {
    setOpen(true)
    if (unfoldTimer.current) clearTimeout(unfoldTimer.current)
    unfoldTimer.current = setTimeout(() => setReading(true), UNFOLD_AFTER_MS)
  }

  const foldAway = () => {
    if (unfoldTimer.current) clearTimeout(unfoldTimer.current)
    setReading(false)
    setOpen(false)
  }

  const letterDelay = open ? 0.55 : 0
  const flapDelay = open ? 0 : LETTER_TRAVEL - 0.1

  return (
    <div className="mx-auto flex w-full max-w-[540px] flex-col items-center">
      <div className="relative w-full pt-[38%]">
        <div className="relative -rotate-2">
          <div
            aria-hidden="true"
            className="absolute -inset-[5%] border border-gold/60 bg-gradient-to-br from-[#fdf3e6] to-[#fbe6d8] shadow-[0_40px_70px_-35px_rgba(116,50,61,0.45)]"
          />

          <div className="relative aspect-[3/2] w-full" style={{ perspective: 1400 }}>
            <div aria-hidden="true" className="absolute inset-0 border border-gold/40 bg-gradient-to-b from-[#f9e3cf] to-[#f6d8c6]" />

            <motion.div
              aria-hidden="true"
              className="absolute inset-x-[7%] top-[5%] flex h-[92%] flex-col overflow-hidden border border-gold/50 bg-[#fffaf2] px-[6%] py-[5%] text-center shadow-[0_20px_40px_-25px_rgba(116,50,61,0.5)]"
              initial={false}
              animate={{ y: open ? ['0%', '-78%', '-44%'] : ['-44%', '-78%', '0%'], zIndex: open ? 40 : 10 }}
              transition={{
                y: { duration: LETTER_TRAVEL, times: [0, 0.55, 1], ease: EASE, delay: letterDelay },
                zIndex: { duration: 0, delay: open ? letterDelay + LETTER_TRAVEL * 0.55 : LETTER_TRAVEL * 0.55 },
              }}
            >
              <p className="font-hand text-[clamp(1.35rem,3.4vw,1.9rem)] leading-tight text-maroon">{LETTER.greeting}</p>
              <p className="relative mt-[3%] font-hand text-[clamp(1rem,2.4vw,1.3rem)] leading-snug text-muted [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
                {LETTER.paragraphs[0]} {LETTER.paragraphs[1]}
              </p>
            </motion.div>

            <svg
              aria-hidden="true"
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
              className="absolute inset-0 z-20 h-full w-full drop-shadow-[0_-6px_10px_rgba(116,50,61,0.08)]"
            >
              <defs>
                <linearGradient id="pocket" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fdf0e2" />
                  <stop offset="100%" stopColor="#f8d9c8" />
                </linearGradient>
              </defs>
              <path d="M0 70 L150 150 L300 70 L300 200 L0 200 Z" fill="url(#pocket)" />
              <path d="M0 70 L150 150 L300 70" fill="none" stroke="#e9bd5d" strokeOpacity="0.55" strokeWidth="0.8" />
              <path d="M0 200 L120 128 M300 200 L180 128" fill="none" stroke="#e9bd5d" strokeOpacity="0.25" strokeWidth="0.6" />
            </svg>

            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-full origin-top"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 60%)', transformPerspective: 1400 }}
              initial={false}
              animate={{ rotateX: open ? 180 : 0, zIndex: open ? 5 : 30 }}
              transition={{
                rotateX: { duration: 0.7, ease: EASE, delay: flapDelay },
                zIndex: { duration: 0, delay: flapDelay + 0.35 },
              }}
            >
              <div className="h-full w-full bg-gradient-to-b from-[#fbeedd] via-[#f9e6cf] to-[#f4d6bb]" />
            </motion.div>

            <AnimatePresence>
              {!open && (
                <motion.button
                  type="button"
                  onClick={openEnvelope}
                  aria-label="Open the envelope"
                  className="absolute left-1/2 top-[60%] z-50 grid size-[clamp(3rem,9vw,3.75rem)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#8e3d49] to-[#5e2630] text-gold-soft shadow-[0_8px_20px_-6px_rgba(94,38,48,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: [1, 1.06, 1] }}
                  exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.3 } }}
                  transition={{
                    opacity: { duration: 0.4, delay: 1.4 },
                    scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  whileHover={{ rotate: 12 }}
                >
                  <AsteriskMark className="size-1/2" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={open ? foldAway : openEnvelope}
        aria-expanded={open}
        className="mt-14 rounded-sm font-sans text-xs font-medium uppercase tracking-[0.22em] text-muted underline-offset-8 transition-colors hover:text-maroon hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {open ? 'Fold the letter away' : 'Tap the seal to open'}
      </button>

      <AnimatePresence>{reading && <HandwrittenLetter onClose={foldAway} />}</AnimatePresence>
    </div>
  )
}
