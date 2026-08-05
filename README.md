# Léon Muller — Portfolio

Personal portfolio at [reeezer.github.io](https://reeezer.github.io), built with React, Vite,
TypeScript, Tailwind CSS and [shadcn/ui](https://ui.shadcn.com).

## Getting started

```bash
npm install     # also installs the git pre-commit hook via `prepare`
npm run dev     # http://localhost:5173
```

## Scripts

| Script                 | What it does                                |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Vite dev server with hot reload             |
| `npm run build`        | Type-check and build to `dist/`             |
| `npm run preview`      | Serve the production build locally          |
| `npm run typecheck`    | TypeScript type-check                       |
| `npm run lint`         | ESLint                                      |
| `npm run format`       | Prettier, write                             |
| `npm run format:check` | Prettier, check only                        |
| `npm run knip`         | Unused files, exports and dependencies      |
| `npm run test:e2e`     | Playwright E2E against the production build |
| `npm run test:e2e:ui`  | Playwright in UI mode                       |
| `npm run check`        | Everything CI runs, end to end              |

## Project layout

```
public/images/       Static artwork, served from /images/…
src/
  data/              All page content as typed records — edit here, not in JSX
  components/        Shared components
    ui/              shadcn/ui primitives (generated; not hand-edited)
  sections/          One component per page section
  hooks/             useSectionProgress (nav trail)
  styles/global.css  Tailwind entry, design tokens, custom utilities
```

**Content lives in `src/data/`.** Adding a job, project or degree means adding one record to the
relevant file — no markup changes. The types in `src/data/types.ts` describe every available field.

## Design tokens

`src/styles/global.css` fills in the shadcn token contract (`--background`, `--primary`, `--border`,
…) with the portfolio's dark/blue palette, so every shadcn component inherits the site's identity
without per-component overrides. Brand aliases (`text-brand`, `bg-ink-raised`, `border-hairline`)
and the custom `bg-brand-gradient`, `bg-brand-conic`, `shadow-glow`, `fade-x` and `material`
utilities are defined in the same file.

## Adding a shadcn component

```bash
npx shadcn@latest add <component>
```

Components land in `src/components/ui/` and are excluded from ESLint, since they are generated.

## Code quality

[prek](https://github.com/j178/prek) runs the hooks in `.pre-commit-config.yaml` (whitespace and
file hygiene, Prettier, ESLint, type-check) before each commit. [knip](https://knip.dev) guards
against unused files, exports and dependencies; it runs in `npm run check` and CI, configured by
`knip.jsonc`.

```bash
uv tool install prek      # or: pipx install prek
prek install              # npm install does this too
prek run --all-files
```

## Tests

`e2e/portfolio.spec.ts` runs against the real production bundle — `playwright.config.ts` starts
`vite preview` first — across a desktop and a mobile viewport. It covers the behaviour that broke
in the original site: the progressive nav trail, project filtering, asset paths, alt text,
external-link safety, and the motion policy below.

```bash
npx playwright install chromium   # once
npm run test:e2e
```

## Motion policy

`prefers-reduced-motion` is handled per component rather than with a blanket override, because a
blanket rule also removes motion that carries meaning:

| Motion                    | Under `prefers-reduced-motion: reduce` |
| ------------------------- | -------------------------------------- |
| Drifting backdrop lights  | Off — a large moving background        |
| Hero scroll-cue bob       | Off                                    |
| Skills marquee            | On — small chips, slow linear drift    |
| Smooth scrolling          | On                                     |
| Hover states, border spin | On — pointer-driven, never ambient     |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to
GitHub Pages. Pull requests run `.github/workflows/ci.yml`.

> **One-time setup:** in the repository's _Settings → Pages_, set **Source** to **GitHub Actions**.
> The site previously served static files from the branch root; it is now built by CI.
