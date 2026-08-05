import type { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'

interface SectionProps {
  readonly id: string
  readonly title: string
  /** Filename under /images/sections. */
  readonly icon: string
  readonly children: ReactNode
}

export function Section({ id, title, icon, children }: SectionProps) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="flex w-full max-w-[1136px] flex-col items-center gap-6 px-3 py-24 md:px-16 md:py-36 lg:py-48"
    >
      <div className="flex w-full flex-row items-center gap-4">
        <img
          className="size-9 shrink-0 object-contain"
          src={`/images/sections/${icon}`}
          alt=""
          aria-hidden="true"
          width={36}
          height={36}
        />
        <h2 id={headingId} className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>

      <Separator className="h-px w-full border-0 bg-brand-gradient" />

      {children}
    </section>
  )
}
