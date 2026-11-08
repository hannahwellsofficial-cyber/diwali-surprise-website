'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Flame } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const PETALS = [
  { angle: 20, size: 'w-10 h-4' },
  { angle: 140, size: 'w-9 h-4' },
  { angle: 205, size: 'w-10 h-[18px]' },
  { angle: 300, size: 'w-8 h-3.5' },
]

const DOTS = [
  { top: '19%', left: '65%', delay: '0s' },
  { top: '24%', left: '20%', delay: '1s' },
  { top: '30%', left: '89%', delay: '2s' },
  { top: '66%', left: '11%', delay: '0.5s' },
  { top: '73%', left: '96%', delay: '1.6s' },
  { top: '12%', left: '42%', delay: '2.4s' },
]

type Burst = { id: number; sparks: { angle: number; distance: number; size: number }[] }

export function InteractiveDiya() {
  const [lit, setLit] = useState(false)
  const [wishes, setWishes] = useState(0)
  const [bursts, setBursts] = useState<Burst[]>([])

  const handleTap = () => {
    if (!lit) {
      setLit(true)
    } else {
      setWishes((w) => w + 1)
    }
    const id = Date.now()
    const sparks = Array.from({ length: 16 }, (_, i) => ({
      angle: (i / 16) * Math.PI * 2 + Math.random() * 0.3,
      distance: 90 + Math.random() * 90,
      size: 3 + Math.random() * 4,
    }))
    setBursts((b) => [...b, { id, sparks }])
    window.setTimeout(() => setBursts((b) => b.filter((burst) => burst.id !== id)), 1400)
  }

  const label = !lit ? 'Light the diya' : wishes === 0 ? 'Tap again to make a wish' : 'Your wish is on its way'

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <motion.div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full"
        animate={{
          opacity: lit ? [0.55, 0.8, 0.55] : 0.12,
          scale: lit ? [1, 1.06, 1] : 1,
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle, rgba(244,190,110,0.55) 0%, rgba(233,189,93,0.15) 40%, transparent 70%)' }}
      />

      {['inset-0', 'inset-[9%]', 'inset-[19%]'].map((inset, i) => (
        <div
          key={inset}
          aria-hidden="true"
          className={cn(
            'absolute rounded-full border transition-colors duration-1000',
            inset,
            lit ? 'border-gold/45' : 'border-gold/20',
          )}
          style={{ transitionDelay: `${i * 150}ms` }}
        />
      ))}

      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: lit ? 30 : 60, repeat: Infinity, ease: 'linear' }}
      >
        {PETALS.map((petal) => (
          <span
            key={petal.angle}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${petal.angle}deg) translateX(min(50%, 250px)) translateX(-6px)` }}
          >
            <span className={cn('block -rotate-12 rounded-[100%] bg-gradient-to-r from-[#e9a066] to-[#f2c07f] opacity-80', petal.size)} />
          </span>
        ))}
      </motion.div>

      {DOTS.map((dot) => (
        <span
          key={dot.top + dot.left}
          aria-hidden="true"
          className="absolute size-1 animate-twinkle rounded-full bg-gold"
          style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
        />
      ))}

      <button
        type="button"
        onClick={handleTap}
        aria-label={lit ? 'Make a wish on the diya' : 'Light the diya'}
        className="group absolute inset-[26%] flex flex-col items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold"
      >
        <span className="relative mb-[-6%] flex h-[34%] w-full items-end justify-center">
          <span
            aria-hidden="true"
            className={cn(
              'absolute bottom-[4%] left-1/2 size-28 -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-1000',
              lit ? 'bg-[#ffcf73]/70 opacity-100' : 'opacity-0',
            )}
          />
          <span className={cn('relative block h-full w-[20%]', lit && 'animate-flicker')}>
            <svg viewBox="0 0 40 70" className="h-full w-full overflow-visible" aria-hidden="true">
              <defs>
                <radialGradient id="flame-lit" cx="50%" cy="70%" r="65%">
                  <stop offset="0%" stopColor="#fffbe8" />
                  <stop offset="35%" stopColor="#ffe28a" />
                  <stop offset="75%" stopColor="#f6a13f" />
                  <stop offset="100%" stopColor="#e2683a" />
                </radialGradient>
                <linearGradient id="flame-unlit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e9b07a" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f1c591" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <path
                d="M20 2C26 18 36 30 36 46c0 12-7 21-16 21S4 58 4 46C4 30 14 18 20 2Z"
                fill={lit ? 'url(#flame-lit)' : 'url(#flame-unlit)'}
                style={{ filter: lit ? 'drop-shadow(0 0 14px rgba(255,200,90,0.9))' : 'none', transition: 'all 0.8s' }}
              />
              <path d="M20 30c3 7 6 11 6 18 0 5-3 9-6 9s-6-4-6-9c0-7 3-11 6-18Z" fill={lit ? '#fffdf2' : '#f6dbe0'} opacity={lit ? 0.9 : 0.5} />
            </svg>
          </span>
        </span>

        <span className="relative block w-[80%] transition-transform duration-500 group-hover:scale-[1.03] group-active:scale-95">
          <span
            aria-hidden="true"
            className="relative z-10 block aspect-[6/1] w-full rounded-[50%] border border-[#f9dcb4] bg-[radial-gradient(ellipse_at_center,#8d3c33_0%,#a5503d_55%,#f3c79a_80%)]"
          />
          <span
            aria-hidden="true"
            className="-mt-[8%] block aspect-[2/1] w-full rounded-b-full bg-gradient-to-b from-[#f4bb86] via-[#e58c68] to-[#c9614f] shadow-[0_30px_50px_-20px_rgba(40,8,14,0.6)]"
          />
          <span aria-hidden="true" className="mx-auto -mt-[3%] block h-2 w-[30%] rounded-b-md bg-[#b85a49]" />
        </span>
      </button>

      <AnimatePresence>
        {bursts.map((burst) => (
          <span key={burst.id} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[40%]">
            {burst.sparks.map((spark, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-gold-soft"
                style={{ width: spark.size, height: spark.size, boxShadow: '0 0 8px rgba(255,214,120,0.9)' }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(spark.angle) * spark.distance,
                  y: Math.sin(spark.angle) * spark.distance,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            ))}
          </span>
        ))}
      </AnimatePresence>

      <p
        aria-live="polite"
        className="absolute bottom-[1%] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold sm:text-xs"
      >
        <Flame aria-hidden="true" className="size-3.5" />
        {label}
      </p>
    </div>
  )
}
