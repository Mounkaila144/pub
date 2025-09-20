# Repository Guidelines

## Project Structure & Module Organization
- The Next.js App Router front end sits in `app/`; `layout.tsx` wires providers and `app/globals.css`.
- Feature sections live under `components/`, primitives under `components/ui/`; compose pages by exporting client/server components.
- Shared helpers go in `lib/` and `hooks/`; mocked data sits in `data/*.json` for local content.
- Static assets and fonts belong in `public/`; Tailwind tokens in `tailwind.config.ts`; legacy global styles in `styles/`.
- A Laravel API prototype lives under `pubbackend/`; keep changes isolated and coordinate merges with backend owners.

## Build, Test, and Development Commands
- `npm install` installs dependencies pinned via `package-lock.json`.
- `npm run dev` starts Next.js with hot reload on :3000.
- `npm run build` compiles a static export as configured in `next.config.js`.
- `npm run start` serves the latest build for production checks.
- `npm run lint` runs the Next.js ESLint preset; fix or annotate failures before pushing.

## Coding Style & Naming Conventions
- Use TypeScript everywhere; prefer `.tsx` for components and `.ts` for utilities.
- Stick to 2-space indentation and order imports: framework, third-party, then local paths.
- Name components with PascalCase (`HeroSection.tsx`), hooks with `use`-prefixed camelCase, and shared helpers in `lib/` as camelCase exports.
- Favor Tailwind utility classes; extend design tokens in `tailwind.config.ts` instead of custom CSS.

## Testing Guidelines
- Automated tests are not wired up; when adding them, colocate `.test.ts(x)` files with the component or helper under test.
- Validate UI flows with `npm run dev` and confirm data mocks still resolve.
- Always run `npm run lint` before requesting review to catch drift.

## Commit & Pull Request Guidelines
- Write concise, present-tense commit subjects (e.g., `Add pricing hero`); use bodies for context or follow-up notes.
- PRs should explain intent, link relevant issues, and include screenshots or GIFs for visual tweaks.
- Call out config, data, or backend (`pubbackend/`) updates so reviewers can assess deployment impact.

## Security & Configuration Tips
- The site exports statically (`output: 'export'`); ensure assets dropped in `public/` are already optimized and sized.
- Keep `.env` usage minimal; prefer values in `data/` or `tailwind.config.ts`.
- Run dependency updates through `npm install` to respect the lockfile and avoid drifting SWC binaries.
