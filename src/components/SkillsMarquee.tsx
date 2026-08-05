import type { CSSProperties } from 'react'
import type { Skill, SkillRow } from '@/data/types'
import { cn } from '@/lib/utils'

/** Seconds each item spends crossing the track — keeps every row at one speed. */
const SECONDS_PER_ITEM = 3.2

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
  const style = {
    '--marquee-duration': `${row.skills.length * SECONDS_PER_ITEM}s`,
    '--marquee-gap': '1rem',
  } as CSSProperties

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        // Fade both edges instead of painting two gradient overlays.
        'fade-x',
      )}
    >
      <ul
        style={style}
        className={cn(
          'm-0 flex w-max list-none flex-row gap-[var(--marquee-gap)] p-0',
          // Always animates: a slow linear drift of small chips is part of the
          // site's character, not the kind of motion reduced-motion targets.
          'animate-marquee',
          reversed && '[animation-direction:reverse]',
        )}
      >
        {row.skills.map((skill) => (
          <SkillChip key={skill.name} skill={skill} />
        ))}
        {/* Second pass makes the -50% loop seamless; hidden from assistive tech. */}
        {row.skills.map((skill) => (
          <SkillChip key={`${skill.name}-clone`} skill={skill} aria-hidden />
        ))}
      </ul>
    </div>
  )
}

function SkillChip({ skill, ...rest }: { readonly skill: Skill } & { 'aria-hidden'?: boolean }) {
  return (
    <li
      {...rest}
      className="flex shrink-0 flex-row items-center gap-3 rounded-xl border border-hairline bg-ink-raised p-3 whitespace-nowrap"
    >
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
