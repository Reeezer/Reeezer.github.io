import { expect, test, type Page } from '@playwright/test'

const SECTIONS = [
  'about',
  'education',
  'experience',
  'projects',
  'volunteering',
  'contact',
] as const

/**
 * SkillsMarquee's animated rail, findable by the inline custom property the
 * component sets once a row is measured. Passed into page.evaluate as an
 * argument because those callbacks are serialized and cannot close over it.
 */
const MARQUEE_RAIL = '[style*="--marquee-distance"]'

/** One rail per row in src/data/skills.ts. */
const MARQUEE_ROW_COUNT = 5

/** Fail the test on any console error or uncaught exception. */
function trackPageErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  return errors
}

test.describe('portfolio', () => {
  test('loads without console errors and sets page metadata', async ({ page }) => {
    const errors = trackPageErrors(page)

    await page.goto('/')

    await expect(page).toHaveTitle(/Léon Muller/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Machine Learning Engineer/,
    )
    expect(errors).toEqual([])
  })

  test('renders every section with a heading', async ({ page }) => {
    await page.goto('/')

    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }

    await expect(page.getByRole('heading', { name: 'About me' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Volunteering' })).toBeVisible()
  })

  test('every referenced image is served', async ({ page }) => {
    await page.goto('/')

    // Most artwork is lazy-loaded, so asking the browser whether it has painted
    // is timing-dependent. Request each src directly instead — this is really a
    // check that the move to public/images left no stale paths.
    const sources = await page.evaluate(() => [
      ...new Set([...document.querySelectorAll('img')].map((img) => img.src)),
    ])

    expect(sources.length).toBeGreaterThan(20)

    const failures: string[] = []
    for (const src of sources) {
      const response = await page.request.get(src)
      if (!response.ok()) failures.push(`${response.status()} ${src}`)
    }

    expect(failures).toEqual([])
  })

  test('every image carries an alt attribute', async ({ page }) => {
    await page.goto('/')

    const missing = await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter((img) => img.getAttribute('alt') === null)
        .map((img) => img.getAttribute('src') ?? '(no src)'),
    )

    expect(missing).toEqual([])
  })

  test('external links open safely in a new tab', async ({ page }) => {
    await page.goto('/')

    const unsafe = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="http"]')]
        .filter((a) => {
          const rel = a.getAttribute('rel') ?? ''
          return (
            a.getAttribute('target') !== '_blank' ||
            !rel.includes('noopener') ||
            !rel.includes('noreferrer')
          )
        })
        .map((a) => a.getAttribute('href') ?? '(no href)'),
    )

    expect(unsafe).toEqual([])
  })

  test('scroll-spy marks the section in view as current', async ({ page }) => {
    await page.goto('/')

    const experienceLink = page.getByRole('link', { name: 'Experience', exact: true })
    await expect(experienceLink).not.toHaveAttribute('aria-current', 'true')

    await page.locator('#experience').scrollIntoViewIfNeeded()
    await expect(experienceLink).toHaveAttribute('aria-current', 'true')

    // And it hands off rather than sticking.
    await page.locator('#volunteering').scrollIntoViewIfNeeded()
    await expect(experienceLink).not.toHaveAttribute('aria-current', 'true')
    await expect(page.getByRole('link', { name: 'Volunteering', exact: true })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  test('nav links stay reachable at every viewport', async ({ page }) => {
    await page.goto('/')

    // The original stylesheet hid all nav links below 768px.
    for (const id of SECTIONS) {
      const link = page.locator(`header a[href="#${id}"]`)
      await expect(link).toHaveCount(1)
      await expect(link).toBeVisible()
    }
  })

  test('project filter narrows the list and survives re-pressing the active tab', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#projects').scrollIntoViewIfNeeded()

    const filters = page.getByRole('radiogroup', { name: /Filter projects/ })
    const cards = page.locator('#projects h3')

    const total = await cards.count()
    expect(total).toBeGreaterThan(3)

    await filters.getByText('Robotics', { exact: true }).click()
    await expect(cards).toHaveText(['Autonomous Pilot & Target Tracking'])

    // Radix clears a single-select ToggleGroup when the active item is pressed
    // again; the component guards against falling through to an empty list.
    await filters.getByText('Robotics', { exact: true }).click()
    await expect(cards).toHaveText(['Autonomous Pilot & Target Tracking'])

    await filters.getByText('All', { exact: true }).click()
    await expect(cards).toHaveCount(total)
  })

  test('every marquee row repeats enough to overrun its track', async ({ page }) => {
    await page.goto('/')
    await page.locator('#projects').scrollIntoViewIfNeeded()

    const rows = await page.evaluate(
      (railSelector) =>
        [...document.querySelectorAll(railSelector)].map((rail) => {
          const track = rail.parentElement as HTMLElement
          const sets = [...rail.children] as HTMLElement[]
          return {
            first: sets[0]?.textContent?.slice(0, 12) ?? '',
            railWidth: rail.getBoundingClientRect().width,
            trackWidth: track.getBoundingClientRect().width,
            setWidth: sets[0]?.getBoundingClientRect().width ?? 0,
            sets: sets.length,
            exposedSets: sets.filter((s) => s.getAttribute('aria-hidden') !== 'true').length,
          }
        }),
      MARQUEE_RAIL,
    )

    expect(rows).toHaveLength(MARQUEE_ROW_COUNT)

    for (const row of rows) {
      // A hole appears whenever the rail is not at least one full set wider
      // than the track: the tail runs out before the loop restarts.
      expect(
        row.railWidth,
        `row "${row.first}" leaves a gap: rail ${row.railWidth} < track ${row.trackWidth} + set ${row.setWidth}`,
      ).toBeGreaterThanOrEqual(row.trackWidth + row.setWidth)

      // Repeats must not be announced twice to assistive tech.
      expect(row.exposedSets).toBe(1)
      expect(row.sets).toBeGreaterThanOrEqual(2)
    }
  })

  test('anchor navigation reaches the target section', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Contact', exact: true }).click()
    await expect(page).toHaveURL(/#contact$/)
    await expect(page.getByRole('link', { name: /muller\.leonchristian/ })).toBeInViewport()
  })
})

test.describe('navigation progress', () => {
  const MUTED = 'rgba(255, 255, 255, 0.6)'
  const LIT = 'rgb(255, 255, 255)'

  async function linkColours(page: Page) {
    return page.evaluate(() =>
      [...document.querySelectorAll('header nav a')].map((a) => getComputedStyle(a).color),
    )
  }

  test('starts with every link unlit', async ({ page }) => {
    await page.goto('/')
    expect(await linkColours(page)).toEqual(Array(SECTIONS.length).fill(MUTED))
  })

  test('lights links cumulatively and keeps them lit once passed', async ({ page }) => {
    await page.goto('/')

    // Scrolling is smooth, so the page is still moving right after the call;
    // poll rather than sampling a single frame mid-animation.
    await page.locator('#experience').scrollIntoViewIfNeeded()
    await expect.poll(async () => (await linkColours(page)).slice(0, 3)).toEqual(Array(3).fill(LIT))

    // About, Education and Experience are behind us; the rest are not.
    expect((await linkColours(page)).slice(3)).toEqual(Array(3).fill(MUTED))

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect
      .poll(async () => (await linkColours(page)).every((colour) => colour === LIT))
      .toBe(true)

    // Scrolling back to the top resets the trail.
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect
      .poll(async () => (await linkColours(page)).every((colour) => colour === MUTED))
      .toBe(true)
  })
})

test.describe('motion', () => {
  test('spins the card border on hover', async ({ page, isMobile }) => {
    // The gradient frame is a pointer affordance; below md it is turned off
    // entirely, and touch contexts have no hover state to assert against.
    test.skip(!!isMobile, 'desktop-only affordance')

    await page.goto('/')

    // Select on the structural card contract, not the `group` styling hook —
    // data-slot="card" is set by the shadcn primitive and survives restyling.
    const card = page.locator('#experience a:has([data-slot="card"])').first()
    await card.scrollIntoViewIfNeeded()
    await card.hover()

    await expect
      .poll(() => card.evaluate((el) => getComputedStyle(el).animationName))
      .toBe('border-spin')
  })

  test('every marquee row actually travels', async ({ page }) => {
    await page.goto('/')
    await page.locator('#projects').scrollIntoViewIfNeeded()

    // Asserting animationName is not enough: a row with a 0s duration reports
    // the right name and never moves. Measure displacement over real time.
    const positions = () =>
      page.evaluate(
        (railSelector) =>
          [...document.querySelectorAll(railSelector)].map((rail) => ({
            x: rail.getBoundingClientRect().x,
            duration: getComputedStyle(rail).animationDuration,
          })),
        MARQUEE_RAIL,
      )

    const before = await positions()
    expect(before).toHaveLength(MARQUEE_ROW_COUNT)
    for (const row of before) {
      expect(row.duration).not.toBe('0s')
    }

    await page.waitForTimeout(1200)
    const after = await positions()

    after.forEach((row, index) => {
      expect(row.x, `marquee row ${index} did not move`).not.toBe(before[index]?.x)
    })
  })

  test('keeps smooth scrolling and the marquee under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const state = await page.evaluate((railSelector) => {
      const rail = document.querySelector(railSelector)
      return {
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
        marquee: rail ? getComputedStyle(rail).animationName : null,
      }
    }, MARQUEE_RAIL)

    expect(state).toEqual({ scrollBehavior: 'smooth', marquee: 'marquee' })
  })

  test('still suppresses the backdrop drift and scroll cue under reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const names = await page.evaluate(() =>
      [...document.querySelectorAll('#top svg, #top [aria-hidden="true"] span')].map(
        (el) => getComputedStyle(el).animationName,
      ),
    )

    expect(names.length).toBeGreaterThan(0)
    expect(names.every((name) => name === 'none')).toBe(true)
  })
})
