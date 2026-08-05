import { navItems, profile } from '@/data/profile'
import { useSectionProgress } from '@/hooks/useSectionProgress'
import { cn } from '@/lib/utils'

// Module-scoped on purpose: this array is the effect dependency inside
// useSectionProgress, so a per-render copy would re-subscribe the scroll
// listener on every render.
const sectionIds = navItems.map((item) => item.id)

export function Nav() {
  const { reached, current } = useSectionProgress(sectionIds)

  return (
    <header
      className={cn(
        'fixed top-3 z-100 flex w-[calc(100vw-1.5rem)] max-w-[1424px] flex-row items-center',
        // Pill-shaped bar with pill-shaped items: an inner radius of
        // (outer − padding) nests exactly, which a fixed radius pair does not.
        'justify-between gap-4 rounded-full border border-hairline p-1.5',
        // Translucent material the page scrolls under; a brighter top edge
        // reads as light catching the surface.
        'material border-t-white/25',
        'md:top-8 md:w-[calc(100vw-4rem)]',
      )}
    >
      <a
        href="#top"
        className="shrink-0 rounded-full px-4 py-2 font-semibold tracking-tight text-foreground"
      >
        {profile.handle}
      </a>

      {/*
        The original hid every link below 768px, leaving the site with no
        navigation. Scrolling the menu keeps all sections reachable instead.
      */}
      <nav
        aria-label="Sections"
        className="flex min-w-0 flex-row items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={current === item.id ? 'true' : undefined}
            className={cn(
              'shrink-0 rounded-full border border-transparent px-3 py-2 text-base whitespace-nowrap',
              'text-muted-foreground transition-all duration-300 ease-[var(--ease-out-soft)]',
              'hover:border-hairline-faint hover:bg-ink-raised hover:text-foreground',
              // Feedback lands on press, not on release.
              'active:scale-97 active:duration-100',
              // Stays lit once its section has been reached, so the bar reads
              // as a progress trail rather than a single highlight.
              reached.has(item.id) && 'text-foreground',
              'md:px-6 md:text-lg',
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
