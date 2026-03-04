# StudyNotes Documentation

## 1. Project Overview

StudyNotes is a Vite + React SPA for focused note reading. Notes are authored in-repo as TSX files and discovered with `import.meta.glob`, then lazy-loaded by route.

Core stack:

- React 18 + React Router v6
- TypeScript strict mode
- Tailwind CSS + typography plugin
- shadcn-style UI primitives (Radix + utility wrappers)
- Framer Motion for subtle transitions
- KaTeX for math rendering
- Vitest for tests

## 2. File Structure

- `src/components/layout/*`: shell components (sidebar, top bar, TOC rail)
- `src/components/notes/*`: note rendering primitives (Section, SubSection, Math, Text)
- `src/components/search/CommandPalette.tsx`: Cmd/Ctrl+K note search
- `src/hooks/*`: localStorage, scroll spy, hash scrolling, debounce, reduced motion
- `src/notes/*`: note source files and registry
- `src/routes.tsx`: app route map
- `public/_redirects`: SPA fallback for Cloudflare Pages
- `worker/index.ts`: optional Worker proxy/fallback example with security headers

## 3. Adding a New Note

1. Create `src/notes/<subject-slug>/<topic-slug>.tsx`.
2. Export `meta` with:
   - `subject` (display name)
   - `title`
   - `slug` (URL topic segment)
   - `order` (sort order inside subject)
   - `updatedAt` (YYYY-MM-DD)
   - optional `description`
3. Export default component and compose content with:
   - `<Section title="...">` for H2
   - `<SubSection title="...">` for H3
   - `<Math>` for direct LaTeX
   - `<Text>` for inline math delimiters
4. Save and reload. The registry auto-discovers the file.

## 4. TOC and Heading System

- Headings are registered via `TOCContext` when `Section`/`SubSection` mount.
- IDs are generated from titles with collision-safe slugs.
- TOC highlights active section using `IntersectionObserver` (`useScrollSpy`).
- TOC clicks use smooth scrolling and update the URL hash without reload.

## 5. LaTeX Rendering

- KaTeX CSS is loaded globally from `src/index.css`.
- `<Math block>` renders display equations.
- `<Text>` supports delimiters:
  - inline: `$...$` and `\(...\)`
  - block: `$$...$$` and `\[...\]`

## 6. Development Workflow

- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production bundle: `npm run preview`
- Lint: `npm run lint`
- Test: `npm run test`

## 7. Cloudflare Pages Deployment

Use static output from `npm run build` and deploy `dist/`.

SPA fallback is configured with `public/_redirects`:

```
/* /index.html 200
```

Security and cache headers for Pages are configured in `public/_headers`.

## 8. Optional Cloudflare Worker Proxy

`worker/index.ts` demonstrates:

- static asset serving via bound `ASSETS`
- fallback to `/index.html` for non-asset routes
- common security headers

## 9. Caching and Security Headers

Recommended cache policy:

- `/assets/*`: `Cache-Control: public, max-age=31536000, immutable`
- `index.html`: `Cache-Control: no-cache`

Recommended CSP baseline:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

KaTeX requires inline styles, so `style-src 'unsafe-inline'` is necessary unless you redesign rendering strategy.
