import { cn } from '@/lib/utils'

interface AuroraBackdropProps {
  /** Each variant places the same four lights differently. */
  readonly variant: 'hero' | 'contact'
}

/** Position and opacity for each blurred light, per variant. */
const LAYOUTS = {
  hero: [
    'w-[60vw] h-[40vh] left-[-40vw] top-[10vh] opacity-20',
    'w-[50vw] h-[70vh] left-[-25vw] top-[50vh] opacity-35',
    'w-[45vw] h-[35vh] left-[15vw] top-[20vh] opacity-15',
    'w-[60vw] h-[70vh] left-[30vw] top-[55vh] opacity-25',
  ],
  contact: [
    'w-[60vw] h-[40vh] left-[-10vw] top-[15vh] opacity-20',
    'w-[50vw] h-[70vh] left-[-35vw] top-[40vh] opacity-35',
    'w-[45vw] h-[35vh] left-[30vw] top-[20vh] opacity-15',
    'w-[60vw] h-[70vh] left-[10vw] top-[55vh] opacity-25',
  ],
} as const

/** A slow drift keeps the lights from reading as a flat painted gradient. */
const DRIFT = [
  'motion-safe:animate-drift',
  'motion-safe:animate-drift [animation-duration:34s] [animation-delay:-8s]',
  'motion-safe:animate-drift [animation-duration:30s] [animation-delay:-14s]',
  'motion-safe:animate-drift [animation-duration:38s] [animation-delay:-4s]',
]

/** Decorative blurred blue lights behind the hero and contact panels. */
export function AuroraBackdrop({ variant }: AuroraBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {LAYOUTS[variant].map((placement, index) => (
        <span
          key={placement}
          className={cn(
            'absolute rounded-full bg-primary blur-[200px] will-change-transform',
            placement,
            DRIFT[index],
          )}
        />
      ))}
    </div>
  )
}
