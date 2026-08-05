import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * `framed` draws the hairline border that lights up on hover (grid cards).
 * `plain` is borderless, for the full-width stacked lists.
 */
export type CardVariant = 'framed' | 'plain'

interface LinkCardProps {
  /** When set, the whole card becomes a link that opens in a new tab. */
  readonly href?: string
  readonly variant?: CardVariant
  readonly children: ReactNode
}

/**
 * A shadcn Card with the portfolio's gradient-border treatment. The outer
 * element is a 1px-padded box whose background shows through as the border,
 * so it can animate to a gradient that a real `border-color` cannot.
 */
export function LinkCard({ href, variant = 'framed', children }: LinkCardProps) {
  const framed = variant === 'framed'

  const className = cn(
    // `group` lets descendants react to hover; see EntryCard's link affordance.
    'group block h-full rounded-[var(--radius)] transition-all duration-300 ease-[var(--ease-out-soft)]',
    framed && [
      'bg-hairline p-px',
      // The border is a conic gradient whose start angle spins on hover.
      'hover:bg-brand-conic hover:animate-border-spin hover:shadow-glow hover:-translate-y-0.5',
      'focus-visible:bg-brand-conic focus-visible:animate-border-spin focus-visible:shadow-glow',
      'active:translate-y-0 active:scale-[0.995] active:duration-150',
      // Below the card grid the frame would only add visual noise.
      'max-md:bg-transparent max-md:p-0 max-md:hover:translate-y-0 max-md:hover:bg-transparent max-md:hover:shadow-none',
    ],
  )

  const card = (
    <Card
      className={cn(
        // shadcn's Card sets text-card-foreground (solid white); body copy in
        // this design is muted, with individual lines opting back into white.
        'h-full gap-4 rounded-[calc(var(--radius)-1px)] border-0 text-muted-foreground shadow-none',
        // Plain cards sit flush with the section; framed ones keep card padding.
        !framed && '[&_[data-slot=card-content]]:px-0 [&_[data-slot=card-header]]:px-0',
        'max-md:[&_[data-slot=card-content]]:px-0 max-md:[&_[data-slot=card-header]]:px-0',
      )}
    >
      {children}
    </Card>
  )

  if (!href) {
    return <div className={className}>{card}</div>
  }

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer noopener">
      {card}
    </a>
  )
}
