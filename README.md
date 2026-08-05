# Léon Muller — Portfolio

Personal portfolio at [reeezer.github.io](https://reeezer.github.io), built with React, Vite,
TypeScript, Tailwind CSS and [shadcn/ui](https://ui.shadcn.com).

## Getting started

```bash
npm install     # also installs the git pre-commit hook via `prepare`
npm run dev     # http://localhost:5173
```

## Scripts

| Script                 | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Vite dev server with hot reload                     |
| `npm run build`        | Type-check and build to `dist/`                     |
| `npm run preview`      | Serve the production build locally                  |
| `npm run lint`         | TypeScript type-check                               |
| `npm run lint:eslint`  | ESLint                                              |
| `npm run format`       | Prettier, write                                     |
| `npm run format:check` | Prettier, check only                                |
| `npm run check`        | Everything CI runs: format, lint, type-check, build |

## Project layout

```
public/images/       Static artwork, served from /images/…
src/
  data/              All page content as typed records — edit here, not in JSX
  components/        Shared components
    ui/              shadcn/ui primitives (generated; not hand-edited)
  sections/          One component per page section
  hooks/             useActiveSection (nav scroll-spy)
  styles/global.css  Tailwind entry, design tokens, custom utilities
```

**Content lives in `src/data/`.** Adding a job, project or degree means adding one record to the
relevant file — no markup changes. The types in `src/data/types.ts` describe every available field.

## Design tokens

`src/styles/global.css` fills in the shadcn token contract (`--background`, `--primary`, `--border`,
…) with the portfolio's dark/blue palette, so every shadcn component inherits the site's identity
without per-component overrides. Brand aliases (`text-brand`, `bg-ink-raised`, `border-hairline`)
and the custom `bg-brand-gradient`, `shadow-glow`, `fade-x` and `material` utilities are defined in
the same file.

## Adding a shadcn component

```bash
npx shadcn@latest add <component>
```

Components land in `src/components/ui/` and are excluded from ESLint, since they are generated.

## Code quality

[prek](https://github.com/j178/prek) runs the hooks in `.pre-commit-config.yaml` (whitespace and
file hygiene, Prettier, ESLint, type-check) before each commit.

```bash
uv tool install prek      # or: pipx install prek
prek install              # npm install does this too
prek run --all-files
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to
GitHub Pages. Pull requests run `.github/workflows/ci.yml`.

> **One-time setup:** in the repository's _Settings → Pages_, set **Source** to **GitHub Actions**.
> The site previously served static files from the branch root; it is now built by CI.
