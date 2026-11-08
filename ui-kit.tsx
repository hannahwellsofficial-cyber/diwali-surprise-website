import { ArrowRight } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EyebrowProps = { children: ReactNode; tone?: 'coral' | 'gold'; className?: string }

export function Eyebrow({ children, tone = 'coral', className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] sm:text-xs',
        tone === 'coral' ? 'text-coral' : 'text-gold',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('h-px w-8', tone === 'coral' ? 'bg-coral/60' : 'bg-gold')} />
      {children}
    </p>
  )
}

type CtaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'maroon' | 'gold' | 'outline'
  serif?: boolean
  icon?: ReactNode
}

export function CtaButton({ children, variant = 'maroon', serif = false, icon, className, ...props }: CtaProps) {
  return (
    <button
      type="button"
      className={cn(
        'group inline-flex items-center gap-3 rounded-[2px] px-6 py-4 text-[15px] font-medium shadow-[0_10px_30px_-12px_rgba(116,50,61,0.55)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:translate-y-0',
        serif ? 'font-serif text-base' : 'font-sans',
        variant === 'maroon' && 'bg-maroon text-cream hover:bg-maroon-deep',
        variant === 'gold' && 'bg-gold text-maroon hover:bg-gold-soft',
        variant === 'outline' && 'border border-cream/40 text-cream shadow-none hover:border-gold hover:text-gold',
        className,
      )}
      {...props}
    >
      {children}
      {icon ?? <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  )
}
