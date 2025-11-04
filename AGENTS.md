# Repository Guidelines

## Project Structure & Module Organization
The Next.js app lives in `app/`, with `layout.tsx` and `page.tsx` orchestrating the UI. Global styling is in `app/globals.css`, powered by TailwindCSS v4 and DaisyUI. Reusable UI lives in `components/` (e.g. `MainAccountCard.tsx`), while persistence logic sits in `services/` and uses the Dexie wrapper defined in `libs/db.ts`. Data contracts are centralized in `models/` to keep component props aligned with IndexedDB schemas. Static assets belong in `public/`.

## Build, Test, and Development Commands
Use `npm install` before the first run. Core commands:
```
npm run dev    # start Next.js with hot reload
npm run build  # create a production build
npm run start  # serve the compiled app
npm run lint   # run ESLint with Next.js core-web-vitals rules
```
Keep builds clean; fix lint warnings before pushing.

## Coding Style & Naming Conventions
TypeScript files use 4-space indentation and strict typing for public functions. React components follow PascalCase (`MainAccountCard`), services and helpers use camelCase (`getSubAccountsByMainId`). Prefer descriptive prop names over abbreviated ones. Stick with Tailwind utility classes plus DaisyUI themes; place shared theme tokens in `globals.css`. Run `npm run lint` after non-trivial edits to validate formatting and accessibility rules.

## Testing Guidelines
Automated tests are not yet committed. New tests should live alongside the code under `__tests__/` or using the `.test.tsx` suffix. Favor React Testing Library for components and Dexie-mocked unit tests for services. Target high-usage flows: main account CRUD, linking sub-accounts, and tag assignment. Ensure each test suite can run with `npm test` (add the script when introducing tests) and document coverage expectations in the PR.

## Commit & Pull Request Guidelines
Follow the existing Git history: concise, sentence-case summaries that explain the intent and scope (e.g. “Refactor account management: update MainAccountCard…”). One feature or fix per commit. PRs should include: purpose, UI or data changes, test coverage status, manual verification steps, and screenshots/GIFs for visual updates. Link GitHub issues when applicable, and request review once linting (and tests, if present) pass.

## Data & Configuration Notes
Dexie persists to IndexedDB under `GameAccountManagerDB`; version bumps require migration handling in `libs/db.ts`. Environment-specific tweaks belong in `next.config.ts`; avoid committing secrets.
