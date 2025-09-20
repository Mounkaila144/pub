# Repository Guidelines

## Project Structure & Module Organization
- The Next.js App Router entrypoint lives in `app/`, with `layout.tsx` and `page.tsx` wiring global providers and styles from `app/globals.css`.
- Page-level building blocks live in `components/`, while reusable primitives from shadcn/ui are colocated under `components/ui/`.
- Client-side utilities sit in `lib/utils.ts`, shared hooks in `hooks/`, and mocked datasets in `data/*.json` for local development.
- Static assets (logos, favicons, fonts) reside in `public/`; update paths in components rather than mutating build output.

## Build, Test, and Development Commands
- `npm install` — install dependencies pinned by `package-lock.json`.
- `npm run dev` — start the Next.js dev server on port 3000 with hot reloading.
- `npm run build` — create the production static export configured in `next.config.js`.
- `npm run start` — serve the last build to validate production behavior.
- `npm run lint` — run ESLint with the Next.js config; keep it clean before pushing.

## Coding Style & Naming Conventions
- Use TypeScript throughout; prefer `.tsx` for JSX and `.ts` for utilities.
- Follow 2-space indentation; keep imports sorted by module path, then local files.
- Name React components and files with PascalCase (`components/Header.tsx`), hooks with `use`-prefixed camelCase, and helpers in `lib/` as camelCase exports.
- Favor Tailwind utility classes defined in `tailwind.config.ts` over ad-hoc CSS; extend design tokens there when needed.

## Testing Guidelines
- Automated tests are not set up yet; when adding them, place files next to the code under test and suffix with `.test.ts(x)`.
- Validate new UI manually in `npm run dev`; add lightweight data checks or component stories when touching `data/` or `components/ui/`.
- Always run `npm run lint` before requesting review to catch common issues.

## Commit & Pull Request Guidelines
- Write concise, present-tense commit messages (e.g., `Add CTA section layout`); include details in the body if context is non-trivial.
- PRs should describe the change, reference related issues, and include screenshots or GIFs for visual updates.
- Highlight any config or data changes and note follow-up tasks so reviewers can assess deployment impact.

## Deployment & Configuration Notes
- The site exports statically (`output: 'export'`) and skips Next image optimization; ensure assets placed in `public/` are already optimized.
- Keep `.env` usage minimal; prefer static data in `data/` unless runtime configuration is required.
