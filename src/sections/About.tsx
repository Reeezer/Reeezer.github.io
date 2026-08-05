import { ExternalLink } from 'lucide-react'
import { LinkCard } from '@/components/LinkCard'
import { Section } from '@/components/Section'
import { CardAction, CardContent, CardHeader } from '@/components/ui/card'
import { aboutCards } from '@/data/profile'
import { GRID } from '@/sections/layout'

export function About() {
  return (
    <Section id="about" title="About me" icon="about.png">
      <div className={GRID}>
        {aboutCards.map((card) => (
          <LinkCard key={card.id} href={card.link.href}>
            <CardHeader>
              <h3
                data-slot="card-title"
                className="text-lg leading-snug font-semibold tracking-tight md:text-xl"
              >
                {card.title}
              </h3>
              <CardAction>
                <ExternalLink
                  className="size-5 text-foreground/50 transition-colors duration-300 ease-[var(--ease-out-soft)] group-hover:text-foreground"
                  aria-hidden="true"
                />
              </CardAction>
            </CardHeader>

            <CardContent className="flex h-full flex-col items-start gap-4">
              {/* mb-auto pins the link label to the bottom so cards align. */}
              <p className="mb-auto">{card.body}</p>

              <p className="flex flex-row items-center gap-2 text-foreground">
                <img
                  src={`/images/${card.link.icon}`}
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                  className="size-6 shrink-0 object-contain brightness-0 invert"
                />
                <span>{card.link.label}</span>
              </p>
            </CardContent>
          </LinkCard>
        ))}
      </div>
    </Section>
  )
}
