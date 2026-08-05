import { useState } from 'react'
import { EntryCard } from '@/components/EntryCard'
import { Section } from '@/components/Section'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { projectFilters, projects } from '@/data/projects'
import type { ProjectFilter } from '@/data/types'
import { STACK } from '@/sections/layout'

export function Projects() {
  const [filter, setFilter] = useState<ProjectFilter>('all')

  const visible =
    filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter))

  return (
    <Section id="projects" title="Projects" icon="projects.png">
      <ToggleGroup
        type="single"
        value={filter}
        // Radix clears the value when the active item is pressed again; keep
        // the last filter rather than falling through to an empty state.
        onValueChange={(next) => next && setFilter(next as ProjectFilter)}
        aria-label="Filter projects by category"
        className="w-full justify-start gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projectFilters.map((option) => (
          <ToggleGroupItem
            key={option.id}
            value={option.id}
            className="shrink-0 rounded-full! border border-transparent px-4 py-2 text-base whitespace-nowrap text-muted-foreground transition-all duration-300 ease-[var(--ease-out-soft)] hover:border-hairline-faint hover:bg-ink-raised hover:text-foreground active:scale-97 active:duration-100 data-[state=on]:border-hairline data-[state=on]:bg-ink-raised data-[state=on]:text-foreground"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className={STACK}>
        {visible.map((project) => (
          <EntryCard key={project.id} entry={project} variant="plain" />
        ))}
      </div>
    </Section>
  )
}
