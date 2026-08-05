import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import type { Skill, SkillRow } from '@/data/types'
import { cn } from '@/lib/utils'

/** Gap between chips and between repeated sets, in px. Must match `gap-4`. */
const GAP = 16

/** Scroll speed, so every row moves at the same rate regardless of length. */
const PIXELS_PER_SECOND = 45

interface SkillsMarqueeProps {
  readonly rows: readonly SkillRow[]
}

export function SkillsMarquee({ rows }: SkillsMarqueeProps) {
  return (
    <div className="flex w-full max-w-[1136px] flex-col items-center gap-4">
      {rows.map((row, index) => (
        <MarqueeRow key={row.id} row={row} reversed={index % 2 === 1} />
      ))}
    </div>
  )
}

function MarqueeRow({ row, reversed }: { readonly row: SkillRow; readonly reversed: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLUListElement>(null)
  // `copies` starts at 2 so the first paint already scrolls; the measured value
  // takes over before the browser paints, via useLayoutEffect.
  const [{ distance, copies }, setMetrics] = useState({ distance: 0, copies: 2 })

  useLayoutEffect(() => {
    const track = trackRef.current
    const set = setRef.current
    if (!track || !set) return

    const measure = () => {
      const setWidth = set.getBoundingClientRect().width
      const trackWidth = track.getBoundingClientRect().width
      if (setWidth === 0) return

      // Travelling exactly one set plus one gap lands the next copy where the
      // previous one started, so the wrap is invisible.
      const nextDistance = setWidth + GAP
      // Short rows need more copies: the rail must always overrun the track by
      // a full set, otherwise the tail leaves a hole before the loop restarts.
      const nextCopies = Math.max(2, Math.ceil(trackWidth / nextDistance) + 1)

      setMetrics((previous) =>
        previous.distance === nextDistance && previous.copies === nextCopies
          ? previous
          : { distance: nextDistance, copies: nextCopies },
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(set)
    return () => observer.disconnect()
  }, [])

  const style = {
    '--marquee-distance': `${distance}px`,
    '--marquee-duration': `${distance / PIXELS_PER_SECOND}s`,
  } as CSSProperties

  return (
    <div
      ref={trackRef}
      className={cn(
        'relative w-full overflow-hidden',
        // Fade both edges instead of painting two gradient overlays.
        'fade-x',
      )}
    >
      <div
        style={style}
        className={cn(
          'flex w-max flex-row gap-4',
          // Always animates: a slow linear drift of small chips is part of the
          // site's character, not the kind of motion reduced-motion targets.
          'animate-marquee',
          reversed && '[animation-direction:reverse]',
        )}
      >
        {Array.from({ length: copies }, (_, index) => (
          <ul
            key={index}
            ref={index === 0 ? setRef : undefined}
            // Only the first set is real content; the repeats are decorative.
            aria-hidden={index > 0 || undefined}
            className="m-0 flex shrink-0 flex-row gap-4 p-0"
          >
            {row.skills.map((skill) => (
              <SkillChip key={skill.name} skill={skill} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

function SkillChip({ skill }: { readonly skill: Skill }) {
  return (
    <li className="flex shrink-0 list-none flex-row items-center gap-3 rounded-xl border border-hairline bg-ink-raised p-3 whitespace-nowrap">
      <img
        src={`/images/skills/${skill.icon}`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        width={24}
        height={24}
        className="size-6 shrink-0 object-contain"
      />
      <span className="text-base">{skill.name}</span>
    </li>
  )
}
