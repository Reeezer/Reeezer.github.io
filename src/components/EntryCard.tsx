import { ExternalLink, Trophy } from 'lucide-react'
import { LinkCard } from '@/components/LinkCard'
import { TagList } from '@/components/TagList'
import { CardAction, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import type { Entry } from '@/data/types'

interface EntryCardProps {
  readonly entry: Entry
  readonly variant?: 'framed' | 'plain'
}

/** Renders one Education / Experience / Project / Volunteering record. */
export function EntryCard({ entry, variant = 'framed' }: EntryCardProps) {
  const { title, org, period, body, tags, award, detail, note, image, href } = entry

  return (
    <LinkCard href={href} variant={variant}>
      <CardHeader>
        {/* A real heading rather than shadcn's CardTitle div, so the page keeps
            a navigable outline; the card-title slot styling is applied here. */}
        <h3
          data-slot="card-title"
          className="text-lg leading-snug font-semibold tracking-tight md:text-xl"
        >
          {title}
          {org && (
            <>
              {' @ '}
              <span className="text-brand">{org}</span>
            </>
          )}
        </h3>

        {period && <CardDescription className="text-base">{period}</CardDescription>}

        {href && (
          <CardAction>
            <ExternalLink
              className="size-5 text-foreground/50 transition-colors duration-300 ease-[var(--ease-out-soft)] group-hover:text-foreground"
              aria-hidden="true"
            />
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="flex w-full flex-col items-start gap-6 md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
          <p>{body}</p>
          {tags && <TagList tags={tags} />}
          {note && <p className="text-foreground">{note}</p>}
          {award && (
            <p className="flex items-center gap-2 text-foreground">
              <Trophy className="size-5 shrink-0 text-amber-400" aria-hidden="true" />
              <span>{award}</span>
            </p>
          )}
          {detail && <p className="text-base text-foreground/45">{detail}</p>}
        </div>

        {image && (
          <img
            className="h-44 w-full shrink-0 rounded-xl border border-hairline object-cover md:size-40"
            src={`/images/${image.src}`}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            width={160}
            height={160}
          />
        )}
      </CardContent>
    </LinkCard>
  )
}
