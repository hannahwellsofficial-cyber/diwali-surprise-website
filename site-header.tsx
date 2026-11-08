import { Volume2, VolumeX } from 'lucide-react'
import { AsteriskMark } from './decor'
import { RECIPIENT } from '@/lib/content'
import { MUSIC_TOGGLE_ATTR } from '@/lib/use-ambient-music'
import { cn } from '@/lib/utils'

type SiteHeaderProps = {
  step: number
  total: number
  onSelect: (step: number) => void
  playing: boolean
  onToggleMusic: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')

export function SiteHeader({ step, total, onSelect, playing, onToggleMusic }: SiteHeaderProps) {
  const musicProps = { [MUSIC_TOGGLE_ATTR]: '' }

  return (
    <header className="flex items-center justify-between gap-4 px-5 pb-6 pt-6 sm:px-8 lg:px-[70px] lg:pt-8">
      <button
        type="button"
        onClick={() => onSelect(0)}
        className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label={`${RECIPIENT}, back to the beginning`}
      >
        <AsteriskMark className="size-5 text-coral" />
        <span className="font-serif text-2xl leading-none text-maroon sm:text-[26px]">{RECIPIENT}</span>
      </button>

      <nav aria-label="Surprise progress" className="flex items-center gap-3 font-sans text-xs">
        <span className="hidden w-5 font-semibold tracking-widest text-maroon sm:inline">{pad(step + 1)}</span>
        <span aria-hidden="true" className="hidden h-px w-9 bg-gold md:block" />
        <ol className="flex items-center gap-2.5">
          {Array.from({ length: total }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Go to part ${i + 1} of ${total}`}
                aria-current={i === step ? 'step' : undefined}
                className="grid size-4 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span
                  className={cn(
                    'block size-2.5 rounded-full border transition-all duration-500',
                    i === step ? 'scale-110 border-maroon bg-maroon' : 'border-coral/70 bg-transparent hover:border-maroon',
                  )}
                />
              </button>
            </li>
          ))}
        </ol>
        <span className="hidden tracking-widest text-muted sm:inline">{pad(total)}</span>
      </nav>

      <button
        type="button"
        {...musicProps}
        onClick={onToggleMusic}
        aria-pressed={playing}
        aria-label={playing ? 'Mute background music' : 'Play background music'}
        className="grid size-11 place-items-center rounded-lg border border-gold/50 bg-cream text-maroon transition-colors hover:border-gold hover:bg-cream-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {playing ? <Volume2 aria-hidden="true" className="size-4" /> : <VolumeX aria-hidden="true" className="size-4" />}
      </button>
    </header>
  )
}
