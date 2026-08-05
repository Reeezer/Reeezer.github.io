import { EntryCard } from '@/components/EntryCard'
import { Section } from '@/components/Section'
import { volunteering } from '@/data/volunteering'
import { STACK } from '@/sections/layout'

export function Volunteering() {
  return (
    <Section id="volunteering" title="Volunteering" icon="volunteering.png">
      <div className={STACK}>
        {volunteering.map((entry) => (
          <EntryCard key={entry.id} entry={entry} variant="plain" />
        ))}
      </div>
    </Section>
  )
}
