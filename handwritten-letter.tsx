'use client'

import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { AsteriskMark } from './decor'
import { LETTER } from '@/lib/content'

const RULE = '2.25rem'
const UNFOLD_EASE = [0.22, 1, 0.36, 1] as const
const greetingWords = LETTER.greeting.split(' ')
const greetingTail = greetingWords.slice(-2).join(' ')
const greetingLead = greetingWords.slice(0, -2).join(' ')

export function HandwrittenLetter({ onClose }: { onClose: () => void }) {
  const paperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    paperRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-maroon-deep/35 p-4 backdrop-blur-[3px] sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.15 } }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
    >
      <motion.div
        ref={paperRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="letter-greeting"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[88svh] w-full max-w-[600px] origin-top overflow-y-auto border border-gold/50 bg-[#fffaf1] shadow-[0_40px_80px_-30px_rgba(94,38,48,0.6)] outline-none"
        style={{
          backgroundImage: `linear-gradient(to right, transparent 3.25rem, rgba(220,122,91,0.28) 3.25rem, rgba(220,122,91,0.28) calc(3.25rem + 1px), transparent calc(3.25rem + 1px)), repeating-linear-gradient(to bottom, transparent 0, transparent calc(${RULE} - 1px), rgba(233,189,93,0.32) calc(${RULE} - 1px), rgba(233,189,93,0.32) ${RULE}), radial-gradient(ellipse at 20% 0%, rgba(249,232,214,0.9), transparent 60%), radial-gradient(ellipse at 100% 100%, rgba(248,217,200,0.55), transparent 55%)`,
          backgroundAttachment: 'local',
        }}
        initial={{ opacity: 0, y: 60, scaleY: 0.35, rotate: -2 }}
        animate={{ opacity: 1, y: 0, scaleY: 1, rotate: -0.6 }}
        exit={{ opacity: 0, y: 60, scaleY: 0.4, rotate: -2, transition: { duration: 0.5, ease: UNFOLD_EASE } }}
        transition={{ duration: 0.9, ease: UNFOLD_EASE }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fold the letter away"
          className="sticky top-3 z-10 float-right mr-3 mt-3 grid size-9 place-items-center rounded-full border border-gold/50 bg-[#fffaf1]/90 text-maroon transition-colors hover:bg-cream-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="py-[2.25rem] pl-[4.25rem] pr-6 font-hand text-maroon sm:pr-12">
          <h2 id="letter-greeting" className="text-[clamp(1.85rem,5vw,2.4rem)] font-semibold leading-[4.5rem]">
            {greetingLead} <span className="whitespace-nowrap">{greetingTail}</span>
          </h2>

          <div className="space-y-[2.25rem] text-[clamp(1.3rem,3.6vw,1.6rem)] leading-[2.25rem] text-[#5a2a33]">
            {LETTER.paragraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6 + index * 0.25, ease: UNFOLD_EASE }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.p
            className="mt-[2.25rem] text-[clamp(1.4rem,3.8vw,1.75rem)] font-semibold leading-[2.25rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 + LETTER.paragraphs.length * 0.25 }}
          >
            {LETTER.signOff}
          </motion.p>

          <AsteriskMark className="mt-[2.25rem] size-5 text-coral" />
        </div>
      </motion.div>
    </motion.div>
  )
}
