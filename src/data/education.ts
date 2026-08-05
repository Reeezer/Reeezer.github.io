import type { Entry } from './types'

export const education: readonly Entry[] = [
  {
    id: 'epfl',
    title: 'MSc Data Science',
    org: 'EPFL',
    period: '2022 - 2025',
    body: "Completed a Master's degree in Data Science at EPFL, focusing on research and scientific fundamentals in AI and machine learning.",
    tags: ['Machine Learning', 'GenAI', 'Algorithms', 'Research'],
    detail: 'Grade - 5.60/6.00',
    href: 'https://www.epfl.ch/',
  },
  {
    id: 'hes-so',
    title: 'BSc Computer Science & Imaging',
    org: 'HES-SO Arc Ingénierie',
    period: '2020 - 2022',
    body: "Completed a Bachelor's degree in Computer Science at HES-SO Arc Ingénierie, specialized in Software & Full Stack Development.",
    tags: ['Databases', 'Computer Vision', 'Software Development', 'Mobile Applications'],
    award: 'Award - Top Student of the entire School (Valedictorian)',
    detail: 'Grade - 5.73/6.00',
    href: 'https://www.he-arc.ch/',
  },
  {
    id: 'utbm',
    title: 'BSc Computer Science & Engineering',
    org: 'UTBM',
    period: '2019 - 2022',
    body: "Completed a Bachelor's degree in Engineering at UTBM, focused in foundational skills in Engineering and Computer Science.",
    tags: ['Computer Science', 'Engineering', 'Mathematics'],
    award: 'Award - DEUTEC Prize for the Best Students',
    detail: 'Grade - 5.06/6.00',
    href: 'https://www.utbm.fr/',
  },
]
