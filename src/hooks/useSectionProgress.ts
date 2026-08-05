import { useEffect, useRef, useState } from 'react'

/** How far down the viewport a section's top must travel to count as reached. */
const REACHED_AT = 0.5

export interface SectionProgress {
  /** Every section whose top has passed the midpoint, in document order. */
  readonly reached: ReadonlySet<string>
  /** The last reached section — the one being read. Null above the first. */
  readonly current: string | null
}

function sameMembers(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a.size !== b.size) return false
  for (const value of a) {
    if (!b.has(value)) return false
  }
  return true
}

/**
 * Tracks how far the reader has come. Sections stay "reached" once scrolled
 * past, so the navigation fills in progressively rather than highlighting a
 * single entry — this mirrors the original site's behaviour.
 */
export function useSectionProgress(ids: readonly string[]): SectionProgress {
  const [reached, setReached] = useState<ReadonlySet<string>>(() => new Set())
  const frame = useRef(0)

  useEffect(() => {
    const measure = () => {
      frame.current = 0
      const threshold = window.innerHeight * REACHED_AT
      const next = new Set<string>()

      for (const id of ids) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top < threshold) {
          next.add(id)
        }
      }

      // Keep the previous Set when membership is unchanged so scrolling does
      // not re-render the navigation on every frame.
      setReached((previous) => (sameMembers(previous, next) ? previous : next))
    }

    const schedule = () => {
      if (frame.current === 0) frame.current = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame.current !== 0) cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ids])

  let current: string | null = null
  for (const id of ids) {
    if (reached.has(id)) current = id
  }

  return { reached, current }
}
