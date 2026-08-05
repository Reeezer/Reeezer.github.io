/** Shared content types. Every section renders one of these records. */

export interface ExternalLink {
  readonly href: string
  readonly label: string
  /** Path under /images, e.g. "others/github.svg". */
  readonly icon: string
}

export interface EntryImage {
  readonly src: string
  readonly alt: string
}

/**
 * A card in Education / Experience / Volunteering / Projects.
 * `title` is the role or subject; `org` is rendered as the accented "@ Organisation".
 */
export interface Entry {
  readonly id: string
  readonly title: string
  readonly org?: string
  readonly period?: string
  readonly body: string
  readonly tags?: readonly string[]
  /** Highlighted distinction, shown with a trophy. */
  readonly award?: string
  /** Small trailing detail, e.g. "Grade - 5.60/6.00". */
  readonly detail?: string
  /** Attribution line, e.g. "Based on Gemini API". */
  readonly note?: string
  readonly image?: EntryImage
  readonly href?: string
}

export type ProjectCategory = 'genai' | 'ml' | 'robotics' | 'web-soft-games'

/** A projects-section filter tab: one category, or the "All" reset. */
export type ProjectFilter = ProjectCategory | 'all'

export interface Project extends Entry {
  readonly categories: readonly ProjectCategory[]
}

/** The three identity cards in the About section. */
export interface AboutCard {
  readonly id: string
  readonly title: string
  readonly body: string
  readonly link: ExternalLink
}

export interface Skill {
  readonly name: string
  /** Path under /images/skills. */
  readonly icon: string
}

export interface SkillRow {
  readonly id: string
  readonly skills: readonly Skill[]
}

export interface NavItem {
  readonly id: string
  readonly label: string
}
