import { EntryCard } from '@/components/EntryCard'
import { Section } from '@/components/Section'
import { experience } from '@/data/experience'
import { GRID } from '@/sections/layout'

export function Experience() {
  return (
    <Section id="experience" title="Experience" icon="experience.png">
      <div className={GRID}>
        {experience.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </Section>
  )
}
