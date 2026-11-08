import { cn } from '@/lib/utils'

type DecorProps = { className?: string }

export function AsteriskMark({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-5', className)} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
    </svg>
  )
}

export function SparkleMark({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-5', className)} fill="currentColor">
      <path d="M12 0c.9 7.4 3.6 10.6 12 12-8.4 1.4-11.1 4.6-12 12-.9-7.4-3.6-10.6-12-12C8.4 10.6 11.1 7.4 12 0Z" />
    </svg>
  )
}

export function FlowerMark({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true" className={cn('size-16', className)}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <circle key={angle} cx="30" cy="16" r="11" fill="currentColor" transform={`rotate(${angle} 30 30)`} />
      ))}
      <circle cx="30" cy="30" r="7" fill="var(--color-cream)" />
    </svg>
  )
}

export function PaisleyMark({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 64 48" aria-hidden="true" className={cn('h-12 w-16', className)}>
      <path
        d="M30 40c-7 3-15-1-15-9 0-7 6-12 13-11 4 1 6 5 4 8-2 2-5 1-5-1"
        fill="none"
        stroke="currentColor"
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <path
        d="M34 38c-2-10 4-22 15-22 8 0 13 6 11 13-2 8-10 12-19 12-3 0-6-1-7-3Z"
        fill="currentColor"
      />
      <path d="M44 14c0-5 3-9 8-10" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}
