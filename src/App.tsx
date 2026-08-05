import { Nav } from '@/components/Nav'
import { SkillsMarquee } from '@/components/SkillsMarquee'
import { profile } from '@/data/profile'
import { skillRows } from '@/data/skills'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Education } from '@/sections/Education'
import { Experience } from '@/sections/Experience'
import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { Volunteering } from '@/sections/Volunteering'

export function App() {
  return (
    <div className="mx-auto flex w-full max-w-[1424px] flex-col items-center p-3 md:p-8">
      <a
        href="#about"
        className="absolute -left-[9999px] z-200 rounded-lg bg-ink-raised px-6 py-3 text-foreground focus:top-8 focus:left-8"
      >
        Skip to content
      </a>

      <Nav />

      <main className="flex w-full flex-col items-center">
        <Hero />
        <About />
        <Education />
        <Experience />
        <SkillsMarquee rows={skillRows} />
        <Projects />
        <Volunteering />
        <Contact />
      </main>

      <footer className="w-full max-w-[1424px] py-8">
        <p>
          {profile.name} {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
