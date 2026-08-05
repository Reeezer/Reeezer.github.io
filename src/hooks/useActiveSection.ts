import { useEffect, useRef, useState } from 'react'

/**
 * Tracks which section currently sits in the middle band of the viewport.
 * Returns the active section id, or null before the first section is reached.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  // IntersectionObserver only reports sections whose visibility *changed*, so we
  // keep the full picture here and re-derive the active one on every callback.
  const visibility = useRef(new Map<string, boolean>())

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const seen = visibility.current

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting)
        }
        // First in document order wins, so scrolling never flickers between
        // two sections that both straddle the band.
        setActiveId(ids.find((id) => seen.get(id) === true) ?? null)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
