import { Badge } from '@/components/ui/badge'

interface TagListProps {
  readonly tags: readonly string[]
}

export function TagList({ tags }: TagListProps) {
  return (
    <ul className="flex list-none flex-row flex-wrap gap-2 p-0">
      {tags.map((tag) => (
        <li key={tag}>
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-primary/20 px-3 py-1.5 text-base font-normal text-brand"
          >
            {tag}
          </Badge>
        </li>
      ))}
    </ul>
  )
}
