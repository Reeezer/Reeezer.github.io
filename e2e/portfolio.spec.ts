import { expect, test, type Page } from '@playwright/test'

const SECTIONS = [
  'about',
  'education',
  'experience',
  'projects',
  'volunteering',
  'contact',
] as const

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

  test('skills marquee duplicates its rail and hides the clones', async ({ page }) => {
    await page.goto('/')

    const firstRail = page.locator('ul').filter({ hasText: 'PyTorch' }).first()
    const visibleChips = firstRail.locator('li:not([aria-hidden="true"])')
    const clonedChips = firstRail.locator('li[aria-hidden="true"]')

    // The seamless -50% loop depends on the list being present exactly twice.
    await expect(clonedChips).toHaveCount(await visibleChips.count())
  })

  test('anchor navigation reaches the target section', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Contact', exact: true }).click()
    await expect(page).toHaveURL(/#contact$/)
    await expect(page.getByRole('link', { name: /muller\.leonchristian/ })).toBeInViewport()
  })
})

test.describe('reduced motion', () => {
  test('suppresses the marquee animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const rail = page.locator('ul').filter({ hasText: 'PyTorch' }).first()
    const animationName = await rail.evaluate((el) => getComputedStyle(el).animationName)

    expect(animationName).toBe('none')
  })

  test('suppresses the hero scroll cue and backdrop drift', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const names = await page.evaluate(() =>
      [...document.querySelectorAll('#top svg, #top [aria-hidden="true"] span')].map(
        (el) => getComputedStyle(el).animationName,
      ),
    )

    expect(names.every((name) => name === 'none')).toBe(true)
  })
})
