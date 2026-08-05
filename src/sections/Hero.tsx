import { ArrowDown } from 'lucide-react'
import { AuroraBackdrop } from '@/components/AuroraBackdrop'
import { profile } from '@/data/profile'

export function Hero() {
  return (
    <div id="top" className="relative flex w-full flex-col items-center py-36 md:py-56">
      <AuroraBackdrop variant="hero" />

      <div className="flex max-w-[848px] flex-col items-center gap-24 text-center md:gap-32">
        <h1 className="text-4xl leading-[1.12] font-bold tracking-tight text-balance md:text-5xl">
          I am <span className="text-brand">{profile.name}</span>,<br />
          {profile.tagline}
        </h1>

        <a
          href="#about"
          aria-label="Scroll to About"
          className="group grid size-12 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 ease-[var(--ease-spring)] hover:translate-y-1 active:scale-92 active:duration-100"
        >
          {/* A small idle bob signals the page continues below the fold. */}
          <ArrowDown
            className="size-6 motion-safe:animate-bob group-hover:[animation-play-state:paused]"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  )
}
