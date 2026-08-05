import type { Entry } from './types'

export const volunteering: readonly Entry[] = [
  {
    id: 'students-games',
    title: 'IT Manager',
    org: "Students' Games",
    period: 'Sep 2022 - Aug 2025',
    body: "Managing IT infrastructure for Switzerland's largest inter-university sports tournament, enhancing the event platform and developing a mobile application to improve the user experience for 800+ participants. Also, overseeing real-time coordination of the volleyball tournament, ensuring efficient logistics and communication.",
    tags: ['Project management', 'Event organization', 'Web development', 'Mobile applications'],
    image: { src: 'volunteering/sg.png', alt: "Students' Games event photo" },
    href: 'https://studentsgames.ch/',
  },
  {
    id: 'scouts',
    title: 'Scout Unit Head',
    org: 'Scouts et Guides de France',
    period: 'Jun 2020 - Aug 2022',
    body: 'Led a youth group in weekly sessions focused on building independence, teamwork, and leadership through group projects and community activities. During summer camp, we lived outdoors in challenging conditions, where the group applied these skills in real-life situations, managing daily life, teamwork, and shared responsibilities.',
    tags: ['Leadership', 'Team Management', 'Communication', 'Teaching'],
    image: { src: 'volunteering/scouts.png', alt: 'Scouts group at summer camp' },
    href: 'https://sgdf.fr/',
  },
]
