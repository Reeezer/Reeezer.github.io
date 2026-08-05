import type { AboutCard, NavItem } from './types'

export const profile = {
  name: 'Léon Muller',
  handle: '@Reeezer/',
  tagline: 'Machine Learning Engineer from EPFL, passionate about machine learning research.',
  email: 'muller.leonchristian@gmail.com',
} as const

export const navItems: readonly NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'volunteering', label: 'Volunteering' },
  { id: 'contact', label: 'Contact' },
]

export const aboutCards: readonly AboutCard[] = [
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    body: 'AI/ML Engineer focused on designing and deploying machine learning solutions that matter.',
    link: {
      href: 'https://www.linkedin.com/in/muller-leon/',
      label: 'See my LinkedIn profile',
      icon: 'others/linkedin.svg',
    },
  },
  {
    id: 'game-developer',
    title: 'Indie Game Developer',
    body: 'I am also a game developer, creating indie games. I like exploring new game mechanics that challenge players.',
    link: {
      href: 'https://reeezer.itch.io',
      label: 'See my Itch.io profile',
      icon: 'others/itchdotio.svg',
    },
  },
  {
    id: 'open-source',
    title: 'Open Source Contributor',
    body: 'I maintain and contribute to machine learning, games, and software projects on GitHub, both academic and personal.',
    link: {
      href: 'https://github.com/Reeezer',
      label: 'See my GitHub profile',
      icon: 'others/github.svg',
    },
  },
]
