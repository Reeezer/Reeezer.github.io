import { cn } from '@/lib/utils'

interface AuroraBackdropProps {
  /** Each variant places the same four lights differently. */
  readonly variant: 'hero' | 'contact'
}

/**
 * The four blurred lights. Placement (per variant) and drift timing live in
 * one record per light so a light can never lose its animation to an
 * off-by-one between parallel arrays. The drift keeps the lights from
 * reading as a flat painted gradient.
 */
const LIGHTS = [
  {
    hero: 'w-[60vw] h-[40vh] left-[-40vw] top-[10vh] opacity-20',
    contact: 'w-[60vw] h-[40vh] left-[-10vw] top-[15vh] opacity-20',
    drift: 'motion-safe:animate-drift',
  },
  {
    hero: 'w-[50vw] h-[70vh] left-[-25vw] top-[50vh] opacity-35',
    contact: 'w-[50vw] h-[70vh] left-[-35vw] top-[40vh] opacity-35',
    drift: 'motion-safe:animate-drift [animation-duration:34s] [animation-delay:-8s]',
  },
  {
    hero: 'w-[45vw] h-[35vh] left-[15vw] top-[20vh] opacity-15',
    contact: 'w-[45vw] h-[35vh] left-[30vw] top-[20vh] opacity-15',
    drift: 'motion-safe:animate-drift [animation-duration:30s] [animation-delay:-14s]',
  },
  {
    hero: 'w-[60vw] h-[70vh] left-[30vw] top-[55vh] opacity-25',
    contact: 'w-[60vw] h-[70vh] left-[10vw] top-[55vh] opacity-25',
    drift: 'motion-safe:animate-drift [animation-duration:38s] [animation-delay:-4s]',
  },
] as const

/** Decorative blurred blue lights behind the hero and contact panels. */
export function AuroraBackdrop({ variant }: AuroraBackdropProps) {
  return (
    // No overflow clipping: a 200px blur cut to the section bounds reads as a
    // hard-edged rectangle. The lights bleed past on purpose; body's
    // overflow-x: hidden stops them creating a horizontal scrollbar.
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {LIGHTS.map((light) => (
        <span
          key={light[variant]}
          className={cn(
            'absolute rounded-full bg-primary blur-[200px] will-change-transform',
            light[variant],
            light.drift,
          )}
        />
      ))}
    </div>
  )
}
