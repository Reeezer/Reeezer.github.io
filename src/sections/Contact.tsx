import { AuroraBackdrop } from '@/components/AuroraBackdrop'
import { profile } from '@/data/profile'

/** Zero-width space lets the long address wrap after the local part. */
const WRAP_POINT = '​'

export function Contact() {
  const [localPart = '', domain = ''] = profile.email.split('@')

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative flex w-full flex-col items-center py-36 text-center md:py-56"
    >
      <AuroraBackdrop variant="contact" />

      <h1
        id="contact-heading"
        className="max-w-[848px] text-4xl leading-[1.12] font-bold tracking-tight break-words text-balance md:text-5xl"
      >
        Get in touch with me
        <br />
        <a
          href={`mailto:${profile.email}`}
          className="text-brand transition-colors duration-300 ease-[var(--ease-out-soft)] hover:text-brand-bright"
        >
          {localPart}
          {WRAP_POINT}@{domain}
        </a>
      </h1>
    </section>
  )
}
