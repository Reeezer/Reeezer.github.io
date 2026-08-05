import { EntryCard } from '@/components/EntryCard'
import { Section } from '@/components/Section'
import { education } from '@/data/education'
import { STACK } from '@/sections/layout'

export function Education() {
  return (
    <Section id="education" title="Education" icon="education.png">
      <div className={STACK}>
        {education.map((entry) => (
          <EntryCard key={entry.id} entry={entry} variant="plain" />
        ))}
      </div>
    </Section>
  )
}
