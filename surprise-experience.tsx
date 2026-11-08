'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { SiteHeader } from './site-header'
import { WelcomeScreen } from './screens/welcome-screen'
import { SparkleScreen } from './screens/sparkle-screen'
import { LetterScreen } from './screens/letter-screen'
import { WishesScreen } from './screens/wishes-screen'
import { FinaleScreen } from './screens/finale-screen'
import { RECIPIENT, TOTAL_SCREENS } from '@/lib/content'
import { useAmbientMusic } from '@/lib/use-ambient-music'

export function SurpriseExperience() {
  const [step, setStep] = useState(0)
  const music = useAmbientMusic()

  const goTo = useCallback((next: number) => {
    setStep(Math.max(0, Math.min(TOTAL_SCREENS - 1, next)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea')) return
      if (event.key === 'ArrowRight') setStep((s) => Math.min(TOTAL_SCREENS - 1, s + 1))
      if (event.key === 'ArrowLeft') setStep((s) => Math.max(0, s - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const next = () => goTo(step + 1)

  const screens = [
    <WelcomeScreen key="welcome" onNext={next} />,
    <SparkleScreen key="sparkle" onNext={next} />,
    <LetterScreen key="letter" onNext={next} />,
    <WishesScreen key="wishes" onNext={next} />,
    <FinaleScreen key="finale" onRestart={() => goTo(0)} />,
  ]

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-cream">
      <SiteHeader step={step} total={TOTAL_SCREENS} onSelect={goTo} playing={music.playing} onToggleMusic={music.toggle} />

      <main className="flex flex-1 flex-col px-5 sm:px-8 lg:px-[70px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="flex flex-1 flex-col"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {screens[step]}
          </motion.div>
        </AnimatePresence>
        <p className="sr-only" aria-live="polite">
          {`Part ${step + 1} of ${TOTAL_SCREENS}`}
        </p>
      </main>

      <footer className="px-5 sm:px-8 lg:px-[70px]">
        <div className="mt-2 border-t border-line py-5">
          <p className="font-serif text-lg text-muted">{`A little light, for ${RECIPIENT}`}</p>
        </div>
      </footer>
    </div>
  )
}
