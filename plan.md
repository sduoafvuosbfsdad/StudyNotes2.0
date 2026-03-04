# StudyNotes — Implementation Plan

## Problem Statement

Build a production-ready React SPA for calm, distraction-free study note reading. Notes are authored as TSX modules in-repo. The UI must feel minimal, typographically polished, and support LaTeX equations, interactive demos, code splitting, search, and Cloudflare deployment.

## Proposed Approach

Scaffold with Vite + React 18 + TypeScript strict. Use TailwindCSS with `@tailwindcss/typography` for prose styling, shadcn/ui (Radix-based) for all standard UI primitives, Framer Motion for minimal animations, KaTeX for LaTeX, and React Router v6 for client-side routing. Notes live as TSX files with metadata exports, discovered via `import.meta.glob`, lazy-loaded per route.

## Target Platforms

- **Primary development:** Ubuntu (Linux) and Windows
- All commands use `npm` (cross-platform); no bash-only scripts
- Path separators: Vite and Node handle `/` vs `\` automatically — no special handling needed
- Line endings: `.gitattributes` will enforce `lf` for source files (avoids CRLF issues on Windows)
- Tested terminal environments: Ubuntu terminal, Windows Terminal / PowerShell / Git Bash
- `package.json` scripts must be cross-platform (no `rm -rf`; use Vite's built-in clean or `rimraf` if needed)
- Font loading (KaTeX): works identically on both platforms since fonts are bundled by Vite

---

## Phase 1 — Project Scaffold & Tooling

### 1.1 Initialize Vite project
- `npm create vite@latest . -- --template react-ts`
- Ensure `tsconfig.json` has `strict: true`, path aliases (`@/` → `src/`)
- Add `tsconfig.app.json` and `tsconfig.node.json` as Vite template does

### 1.2 Install core dependencies
- **Runtime:** react@18, react-dom@18, react-router-dom@6, framer-motion, katex, clsx, tailwind-merge, lucide-react, fuse.js (optional, may use simple search)
- **Dev:** typescript, @types/react, @types/react-dom, @types/katex, tailwindcss, @tailwindcss/typography, postcss, autoprefixer, eslint, prettier, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, vitest, @testing-library/react, jsdom

### 1.3 Configure Tailwind CSS
- `tailwind.config.ts`:
  - `darkMode: 'class'`
  - content paths: `./index.html`, `./src/**/*.{ts,tsx}`
  - Extend theme: consistent spacing scale, zinc palette, one accent color (e.g., indigo-500), custom font stack
  - Plugins: `@tailwindcss/typography`
  - Add shadcn/ui CSS variable conventions for colors (background, foreground, primary, muted, accent, border, ring, etc.)
- `postcss.config.js`: tailwindcss + autoprefixer
- `src/index.css`: Tailwind directives (`@tailwind base/components/utilities`), CSS variable layer for light/dark themes, KaTeX CSS import strategy

### 1.4 Configure shadcn/ui foundation
- Create `src/lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)
- Create `components.json` shadcn config (or manual equivalent)
- Set up CSS variables in `:root` and `.dark` for shadcn/ui color tokens:
  - --background, --foreground, --card, --popover, --primary, --secondary, --muted, --accent, --destructive, --border, --input, --ring
  - Map to calm zinc/off-white palette (light) and dark zinc palette (dark)

### 1.5 ESLint + Prettier
- `.eslintrc.cjs` with: react-hooks, react-refresh, typescript-eslint, prettier
- `.prettierrc` with: singleQuote, semi, trailingComma, printWidth
- `package.json` scripts: `lint`, `format`

### 1.6 Vitest setup
- `vitest.config.ts` extending Vite config
- `src/test/setup.ts` for test globals
- `package.json` script: `test`

### 1.7 Package.json scripts
- `dev` → `vite`
- `build` → `tsc -b && vite build`
- `preview` → `vite preview`
- `test` → `vitest run`
- `lint` → `eslint . --ext ts,tsx`
- `format` → `prettier --write .`

---

## Phase 2 — Design Tokens & Global Styles

### 2.1 Color palette definition
- Light mode: zinc-50 bg, zinc-900 text, zinc-100 sidebar bg, zinc-200 borders, indigo-600 accent
- Dark mode: zinc-950 bg, zinc-100 text, zinc-900 sidebar bg, zinc-800 borders, indigo-400 accent
- Map to CSS custom properties used by both Tailwind and shadcn/ui

### 2.2 Typography scale
- Base: 16px (1rem)
- H1: text-3xl font-bold (note title)
- H2: text-2xl font-semibold (Section)
- H3: text-xl font-medium (SubSection)
- Body: text-base leading-relaxed
- Small/caption: text-sm text-muted-foreground
- Code: font-mono text-sm

### 2.3 Spacing scale
- Use only: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24 (Tailwind units)
- Section gap: `space-y-8`
- Paragraph gap: `space-y-4`
- Sidebar items: `py-1.5 px-3`

### 2.4 KaTeX CSS strategy
- Import `katex/dist/katex.min.css` in `src/index.css` via `@import`
- Ensure fonts are bundled or loaded from CDN (Vite handles static assets in node_modules)
- CSP note: KaTeX uses inline styles — document in DOCS.md

### 2.5 Reduced motion CSS
- Add `@media (prefers-reduced-motion: reduce)` override in global CSS
- Framer Motion: use `useReducedMotion()` hook to conditionally disable animations

---

## Phase 3 — shadcn/ui Components (Manual Setup)

Since we're not using the shadcn CLI in this context, we manually create each component following shadcn/ui patterns (Radix + Tailwind + cn utility).

### 3.1 Button component
- `src/components/ui/button.tsx`
- Variants: default, ghost, outline, link
- Sizes: default, sm, icon
- Uses `cva` (class-variance-authority) or manual variant map

### 3.2 Input component
- `src/components/ui/input.tsx`
- Styled input with focus ring, border, placeholder styling

### 3.3 ScrollArea component
- `src/components/ui/scroll-area.tsx`
- Based on Radix ScrollArea (`@radix-ui/react-scroll-area`)
- Custom scrollbar styling (thin, subtle)

### 3.4 Separator component
- `src/components/ui/separator.tsx`
- Radix Separator (`@radix-ui/react-separator`)

### 3.5 Sheet (Drawer) component
- `src/components/ui/sheet.tsx`
- Radix Dialog as sheet overlay for mobile sidebar
- Slide animation from left

### 3.6 Dialog component
- `src/components/ui/dialog.tsx`
- Radix Dialog for command palette modal
- Overlay + centered content

### 3.7 Command component
- `src/components/ui/command.tsx`
- Based on `cmdk` package (the library shadcn/ui Command wraps)
- Command.Input, Command.List, Command.Empty, Command.Group, Command.Item

### 3.8 DropdownMenu component
- `src/components/ui/dropdown-menu.tsx`
- Radix DropdownMenu

### 3.9 Tooltip component
- `src/components/ui/tooltip.tsx`
- Radix Tooltip

### 3.10 Tabs component
- `src/components/ui/tabs.tsx`
- Radix Tabs

### 3.11 Skeleton component
- `src/components/ui/skeleton.tsx`
- Simple animated placeholder div

### 3.12 Badge component (optional)
- `src/components/ui/badge.tsx`
- For subject labels or status indicators

---

## Phase 4 — Application Shell & Layout

### 4.1 Router setup
- `src/main.tsx`: BrowserRouter wrapping App
- `src/App.tsx`: Routes definition
  - `/` → redirect to first subject/topic
  - `/:subject/:topic` → NotePage
  - `*` → NotFoundPage

### 4.2 Layout component
- `src/components/layout/Layout.tsx`
- Three-column grid: sidebar | main content | TOC rail
- Responsive breakpoints:
  - Desktop (lg+): sidebar visible, TOC rail visible
  - Tablet (md): sidebar collapsible, TOC inline above content
  - Mobile (sm): sidebar as Sheet overlay, TOC inline

### 4.3 Sidebar component
- `src/components/layout/Sidebar.tsx`
- Content:
  - App logo/title at top
  - Subject groups (collapsible sections)
  - Topic links within each subject
  - Active topic: subtle bg + left border indicator (2px indigo bar)
- State:
  - Collapsed/expanded persisted in localStorage key `sidebar-collapsed`
  - Subject sections open/closed in localStorage key `sidebar-sections`
- Accessibility:
  - `nav` landmark with `aria-label="Notes navigation"`
  - Keyboard navigable links
  - `aria-current="page"` on active topic
- Animation:
  - Framer Motion `AnimatePresence` for sidebar width transition (desktop)
  - Sheet slide for mobile

### 4.4 Sidebar toggle button
- `src/components/layout/SidebarToggle.tsx`
- lucide-react `PanelLeftClose` / `PanelLeftOpen` icons
- Tooltip on hover
- Keyboard shortcut hint

### 4.5 Top bar component
- `src/components/layout/TopBar.tsx`
- Sticky `header` element
- Contents (left to right):
  - Mobile sidebar trigger (hamburger icon → opens Sheet)
  - Breadcrumb: Subject > Topic (subtle text)
  - Spacer
  - Search trigger button (lucide `Search` icon + `⌘K` badge)
  - Theme toggle button (lucide `Sun`/`Moon`)
- Minimal height (h-14), subtle bottom border

### 4.6 Theme provider & toggle
- `src/components/ThemeProvider.tsx`
  - Context for theme state (`light` | `dark` | `system`)
  - Reads/writes localStorage key `theme`
  - Applies `.dark` class to `<html>` element
- `src/components/ThemeToggle.tsx`
  - Button cycling light → dark → system
  - Icon: Sun, Moon, Monitor

### 4.7 Skip-to-content link
- `src/components/layout/SkipToContent.tsx`
- Visually hidden unless focused
- Links to `#main-content`

### 4.8 Main content wrapper
- `src/components/layout/MainContent.tsx`
- `<main id="main-content">` with `max-w-3xl mx-auto` centered reading column
- Consistent padding: `px-6 py-10 lg:px-8`
- `prose` class from typography plugin for rich text styling

### 4.9 TOC rail component
- `src/components/layout/TOCRail.tsx`
- Desktop: sticky right column, `top-20` offset
- Lists H2/H3 entries with indentation for H3
- Current section highlighted (subtle bg + left border or bold text)
- Click scrolls to section smoothly
- Mobile: collapsible inline block above main content

### 4.10 Footer (minimal)
- Optional subtle footer with "Built with React" or similar
- Or no footer at all for maximum calm

---

## Phase 5 — Note Registry & Routing

### 5.1 Note meta type definition
- `src/notes/types.ts`:
  ```ts
  export interface NoteMeta {
    subject: string;
    title: string;
    slug: string;
    order: number;
    updatedAt: string;
    description?: string;
  }
  ```

### 5.2 Note registry using import.meta.glob
- `src/notes/registry.ts`:
  - Use `import.meta.glob('./*//*.tsx', { eager: false })` for lazy component loading
  - Use `import.meta.glob('./*//*.tsx', { eager: true, import: 'meta' })` for metadata
  - Runtime validation of meta in dev mode:
    - Check required fields: subject, title, slug, order, updatedAt
    - Check types: string, string, string, number, string
    - Throw descriptive error if invalid
  - Build navigation data structure:
    ```ts
    type SubjectGroup = {
      subject: string;
      topics: NoteMeta[];
    };
    ```
  - Sort subjects alphabetically, topics by order then title
  - Export: `subjects: SubjectGroup[]`, `getTopicBySlug(subject, topic): NoteMeta | undefined`, `getTopicComponent(subject, topic): () => Promise<Component>`

### 5.3 Lazy route integration
- `src/routes.tsx`:
  - For each registered topic, create a lazy route
  - Use `React.lazy()` wrapping the glob import function
  - Wrap in `<Suspense fallback={<NoteLoadingSkeleton />}>`

### 5.4 Note loading skeleton
- `src/components/NoteLoadingSkeleton.tsx`
- Skeleton placeholders mimicking note layout:
  - Title skeleton (wide)
  - Description skeleton (medium)
  - Several paragraph skeletons (varying widths)
  - Section heading skeleton

### 5.5 Route-level page fade animation
- Framer Motion `AnimatePresence` + `motion.div` wrapping route outlet
- Fade-in on mount, subtle (opacity 0→1, 150ms)
- Respect reduced motion

### 5.6 Registry validation test
- `src/notes/__tests__/registry.test.ts`
- Vitest test that:
  - Imports registry
  - Checks all metas have required fields
  - Checks no duplicate slugs
  - Checks subjects are sorted

---

## Phase 6 — Section & TOC System

### 6.1 TOC context store
- `src/components/notes/TOCContext.tsx`
  - React context providing:
    ```ts
    type TOCEntry = { id: string; title: string; level: 2 | 3 };
    type TOCContextValue = {
      entries: TOCEntry[];
      registerEntry: (entry: TOCEntry) => void;
      unregisterEntry: (id: string) => void;
      activeId: string | null;
      setActiveId: (id: string | null) => void;
    };
    ```
  - Provider resets entries on route change

### 6.2 Slugify utility
- `src/lib/slugify.ts`
  - Convert title to URL-safe slug
  - Handle collision: append `-2`, `-3`, etc. if duplicate id exists on page
  - Stable: same input → same output

### 6.3 `<Section>` component (H2)
- `src/components/notes/Section.tsx`
  - Props: `title: string`, `children: ReactNode`
  - Renders `<h2>` with generated id
  - Registers into TOC context on mount, unregisters on unmount
  - Consistent styling: `text-2xl font-semibold mt-12 mb-4`
  - Anchor link icon on hover (lucide `Link` icon)

### 6.4 `<SubSection>` component (H3)
- `src/components/notes/SubSection.tsx`
  - Same pattern as Section but renders `<h3>`, level 3
  - Styling: `text-xl font-medium mt-8 mb-3`

### 6.5 Scroll spy hook
- `src/hooks/useScrollSpy.ts`
  - Uses IntersectionObserver to track which section heading is in view
  - Updates `activeId` in TOC context
  - Threshold tuning for accurate "current section" detection
  - Cleans up observers on unmount

### 6.6 Smooth scroll + hash update
- `src/hooks/useHashScroll.ts`
  - On TOC click: `element.scrollIntoView({ behavior: 'smooth' })`
  - Update `window.location.hash` via `history.replaceState` (no reload)
  - On initial load: scroll to hash if present

---

## Phase 7 — LaTeX Rendering

### 7.1 KaTeX render utility
- `src/lib/katex-render.ts`
  - Wrapper around `katex.renderToString()`
  - Options: throwOnError: false, displayMode: true/false
  - Returns HTML string

### 7.2 `<Math>` component
- `src/components/notes/Math.tsx`
  - Props: `children: string` (the LaTeX expression), `block?: boolean`
  - Renders KaTeX output via `dangerouslySetInnerHTML` (safe: input is local TSX string, not user-generated)
  - `block` → wraps in `div` with `displayMode: true`
  - `inline` (default) → wraps in `span` with `displayMode: false`
  - Memoized rendering

### 7.3 `<Text>` component (auto-detect delimiters)
- `src/components/notes/Text.tsx`
  - Props: `children: string`
  - Parses string for delimiters:
    - Block: `$$...$$` and `\[...\]`
    - Inline: `$...$` and `\(...\)`
  - Splits into segments: plain text vs math
  - Renders plain text as `<span>`, math via `<Math>`
  - Careful regex to avoid false matches (e.g., `$` in code)
  - Memoized parsing

### 7.4 Performance considerations
- KaTeX is imported and used only in components that need it
- Math components are memoized to avoid re-rendering on parent updates
- katex.min.css loaded once globally

---

## Phase 8 — Search System

### 8.1 Search index
- `src/hooks/useSearchIndex.ts`
  - Builds search index from registry metadata on first use
  - Memoized via `useMemo`
  - Simple normalized string matching (lowercase, trim)
  - Searches: title, description, subject
  - Returns matched topics sorted by relevance (title match > description match)

### 8.2 Command palette
- `src/components/search/CommandPalette.tsx`
  - Uses shadcn/ui Dialog + Command components
  - Trigger: `⌘K` / `Ctrl+K` keyboard shortcut
  - Framer Motion for open/close animation
  - Shows search results grouped by subject
  - Navigate with arrow keys, Enter to go to topic
  - `useNavigate` from React Router on selection

### 8.3 Search trigger button
- In TopBar: button with Search icon + keyboard shortcut hint
- Opens CommandPalette dialog

### 8.4 Debounced input
- Debounce search input by ~200ms to avoid excessive filtering
- Use a small `useDebounce` hook

---

## Phase 9 — Error Handling & Edge Cases

### 9.1 ErrorBoundary
- `src/components/ErrorBoundary.tsx`
  - Class component catching render errors
  - Displays friendly error message with retry button
  - Logs error to console

### 9.2 NotFound page
- `src/pages/NotFoundPage.tsx`
  - Clean 404 message
  - Link back to home
  - Matches the calm aesthetic

### 9.3 Fallback for missing notes
- If a route matches `/:subject/:topic` but no note exists → render NotFound
- Registry lookup returns undefined → handled gracefully

---

## Phase 10 — Sample Notes Content

### 10.1 Subject 1: Linear Algebra
- **Topic 1: Vectors and Spaces** (`src/notes/linear-algebra/vectors-and-spaces.tsx`)
  - Sections: Introduction, Vector Operations, Span and Basis, Practice
  - Equations: dot product, cross product, basis definition (inline + block)
  - Image: coordinate plane diagram (placeholder SVG or external)
  - Interactive demo: vector addition visualizer (simple canvas or SVG)

- **Topic 2: Matrix Transformations** (`src/notes/linear-algebra/matrix-transformations.tsx`)
  - Sections: Matrix Multiplication, Determinants, Eigenvalues
  - Equations: matrix multiply, determinant formula, eigenvalue equation
  - Image: transformation visualization
  - Interactive demo: 2×2 matrix transformation on a unit square

### 10.2 Subject 2: Calculus
- **Topic 1: Limits and Continuity** (`src/notes/calculus/limits-and-continuity.tsx`)
  - Sections: Epsilon-Delta, Squeeze Theorem, Types of Discontinuity
  - Equations: limit definition, squeeze theorem
  - Image: graph showing limit behavior
  - Interactive demo: epsilon-delta visualization with sliders

- **Topic 2: Derivatives** (`src/notes/calculus/derivatives.tsx`)
  - Sections: Definition, Rules, Chain Rule, Applications
  - Equations: derivative definition, power rule, chain rule
  - Image: tangent line illustration
  - Interactive demo: derivative explorer (function + tangent line)

### 10.3 Note file template pattern
```tsx
import { Section, SubSection } from '@/components/notes/Section';
import { Math } from '@/components/notes/Math';
import { Text } from '@/components/notes/Text';

export const meta = {
  subject: 'Linear Algebra',
  title: 'Vectors and Spaces',
  slug: 'vectors-and-spaces',
  order: 1,
  updatedAt: '2026-03-01',
  description: 'Fundamentals of vector spaces, span, and basis.',
};

export default function VectorsAndSpaces() {
  return (
    <>
      <Section title="Introduction">
        <Text>A vector in \(\mathbb{R}^n\) is an ordered tuple...</Text>
      </Section>
      ...
    </>
  );
}
```

---

## Phase 11 — Animations (Framer Motion)

### 11.1 Reduced motion hook
- `src/hooks/useReducedMotion.ts`
  - Wraps Framer Motion's `useReducedMotion()` or custom `matchMedia` check
  - Returns boolean

### 11.2 Animation variants
- `src/lib/animations.ts`
  - Define reusable variants:
    - `fadeIn`: opacity 0→1, 150ms
    - `slideInLeft`: x: -20→0, opacity 0→1, 200ms
    - `scaleIn`: scale 0.95→1, opacity 0→1, 150ms
  - Each variant has a `reducedMotion` alternative (instant, no movement)

### 11.3 Sidebar animation
- Desktop: `motion.aside` with width transition (w-64 ↔ w-0 or w-16)
- Mobile: Sheet component handles its own slide animation

### 11.4 Page transition
- `<AnimatePresence mode="wait">` wrapping route outlet
- Keyed by current route path
- Fade variant

### 11.5 Command palette animation
- Dialog overlay: fade in
- Dialog content: scale + fade in

---

## Phase 12 — Accessibility

### 12.1 Skip-to-content
- First focusable element in DOM
- Links to `#main-content`

### 12.2 Focus management
- Focus rings: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- All interactive elements keyboard accessible
- Sidebar links, TOC links, search

### 12.3 ARIA labels
- Sidebar nav: `aria-label="Notes navigation"`
- TOC nav: `aria-label="Table of contents"`
- Search button: `aria-label="Search notes"`
- Theme toggle: `aria-label="Toggle theme"`
- Active topic: `aria-current="page"`

### 12.4 Semantic HTML
- `<header>`, `<nav>`, `<main>`, `<aside>` landmarks
- Proper heading hierarchy (h1 for page title, h2/h3 for sections)

---

## Phase 13 — Cloudflare Deployment

### 13.1 Cloudflare Pages SPA config
- `public/_redirects` file: `/* /index.html 200`
- Or `_routes.json` approach
- Document in DOCS.md

### 13.2 Cloudflare Worker reverse proxy example
- `worker/index.ts` example:
  - Serves static assets from KV/R2
  - Falls back to index.html for SPA routes
  - Adds security headers

### 13.3 Security headers guidance
- CSP: `default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; script-src 'self'`
  - Note: KaTeX uses inline styles → `'unsafe-inline'` for style-src is needed
  - Document this tradeoff
- Other headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy

### 13.4 Cache guidance
- Hashed assets (`/assets/*`): `Cache-Control: public, max-age=31536000, immutable`
- `index.html`: `Cache-Control: no-cache` (always revalidate)
- KaTeX fonts: long cache (immutable hash in Vite build)

---

## Phase 14 — Documentation (DOCS.md)

### 14.1 Project overview section
### 14.2 File/folder structure explanation
### 14.3 How to add a new note (step-by-step)
### 14.4 TOC & headings system explanation
### 14.5 LaTeX delimiters & components docs
### 14.6 Running locally (dev/build/preview)
### 14.7 Testing & linting
### 14.8 Cloudflare Pages deployment guide
### 14.9 Optional Cloudflare Worker proxy
### 14.10 Caching & security headers (CSP)

---

## Phase 15 — Final QA

### 15.1 Run `npm install` — verify clean install
### 15.2 Run `npm run dev` — verify app loads, navigation works
### 15.3 Run `npm run build` — verify production build succeeds
### 15.4 Run `npm run preview` — verify production build serves correctly
### 15.5 Run `npm run lint` — verify no lint errors
### 15.6 Run `npm run test` — verify tests pass
### 15.7 Visual check: spacing alignment, typography consistency
### 15.8 Accessibility check: keyboard navigation, focus rings
### 15.9 Dark mode toggle works
### 15.10 Search works (Cmd+K, type, navigate)
### 15.11 TOC scroll spy works
### 15.12 LaTeX renders correctly (inline + block)
### 15.13 Sidebar collapse persists across reload
### 15.14 404 page for invalid routes
### 15.15 Reduced motion: animations disabled

---

## Complete File Tree (Planned)

```
StudyNotes/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── postcss.config.js
├── tailwind.config.ts
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── public/
│   ├── _redirects                    # Cloudflare Pages SPA fallback
│   └── favicon.svg
├── worker/
│   └── index.ts                      # Optional Cloudflare Worker proxy example
├── src/
│   ├── main.tsx                      # Entry point: BrowserRouter + App
│   ├── App.tsx                       # Routes + Layout
│   ├── index.css                     # Tailwind directives + CSS vars + KaTeX CSS
│   ├── vite-env.d.ts                 # Vite client types
│   ├── lib/
│   │   ├── utils.ts                  # cn() helper (clsx + twMerge)
│   │   ├── slugify.ts               # Title → slug utility
│   │   ├── katex-render.ts          # KaTeX renderToString wrapper
│   │   └── animations.ts            # Framer Motion variants
│   ├── hooks/
│   │   ├── useLocalStorage.ts       # Typed localStorage hook
│   │   ├── useScrollSpy.ts          # IntersectionObserver for TOC
│   │   ├── useHashScroll.ts         # Smooth scroll + hash update
│   │   ├── useSearchIndex.ts        # Search index from registry
│   │   ├── useDebounce.ts           # Debounce hook
│   │   └── useReducedMotion.ts      # prefers-reduced-motion hook
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── command.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── badge.tsx
│   │   ├── layout/
│   │   │   ├── Layout.tsx            # Three-column shell
│   │   │   ├── Sidebar.tsx           # Left nav
│   │   │   ├── SidebarToggle.tsx     # Collapse button
│   │   │   ├── TopBar.tsx            # Sticky header
│   │   │   ├── MainContent.tsx       # Centered reading column
│   │   │   ├── TOCRail.tsx           # Right TOC
│   │   │   └── SkipToContent.tsx     # a11y skip link
│   │   ├── notes/
│   │   │   ├── TOCContext.tsx         # TOC state context
│   │   │   ├── Section.tsx            # <Section> (h2) + <SubSection> (h3)
│   │   │   ├── Math.tsx               # KaTeX <Math> component
│   │   │   ├── Text.tsx               # Auto-delimiter <Text>
│   │   │   └── NotePage.tsx           # Note page wrapper (title, meta, children)
│   │   ├── search/
│   │   │   └── CommandPalette.tsx     # ⌘K search dialog
│   │   ├── ThemeProvider.tsx          # Dark/light theme context
│   │   ├── ThemeToggle.tsx            # Theme switch button
│   │   ├── ErrorBoundary.tsx          # Error boundary
│   │   └── NoteLoadingSkeleton.tsx    # Suspense fallback
│   ├── pages/
│   │   └── NotFoundPage.tsx           # 404 page
│   ├── notes/
│   │   ├── types.ts                   # NoteMeta interface
│   │   ├── registry.ts               # import.meta.glob registry
│   │   ├── __tests__/
│   │   │   └── registry.test.ts       # Registry validation test
│   │   ├── linear-algebra/
│   │   │   ├── vectors-and-spaces.tsx
│   │   │   └── matrix-transformations.tsx
│   │   └── calculus/
│   │       ├── limits-and-continuity.tsx
│   │       └── derivatives.tsx
│   └── test/
│       └── setup.ts                   # Vitest setup
├── DOCS.md                            # Full documentation
└── README.md                          # Quick start
```

---

## Dependency Summary

### Runtime
| Package | Purpose |
|---------|---------|
| react, react-dom | UI framework |
| react-router-dom | Client routing |
| framer-motion | Animations |
| katex | LaTeX rendering |
| clsx | Conditional classes |
| tailwind-merge | Tailwind class dedup |
| class-variance-authority | Component variants |
| lucide-react | Icons |
| cmdk | Command palette |
| @radix-ui/react-scroll-area | ScrollArea |
| @radix-ui/react-separator | Separator |
| @radix-ui/react-dialog | Dialog + Sheet |
| @radix-ui/react-dropdown-menu | DropdownMenu |
| @radix-ui/react-tooltip | Tooltip |
| @radix-ui/react-tabs | Tabs |
| @radix-ui/react-slot | Slot (for Button asChild) |
| @radix-ui/react-visually-hidden | a11y helper |

### Dev
| Package | Purpose |
|---------|---------|
| typescript | Type checking |
| @types/react, @types/react-dom | React types |
| @types/katex | KaTeX types |
| vite | Build tool |
| @vitejs/plugin-react | React plugin |
| tailwindcss | Utility CSS |
| @tailwindcss/typography | Prose plugin |
| postcss, autoprefixer | CSS processing |
| eslint, related plugins | Linting |
| prettier, eslint-config-prettier | Formatting |
| vitest, @testing-library/react, jsdom | Testing |

---

## Risk Notes

1. **KaTeX CSS + CSP**: KaTeX injects inline styles. Must use `'unsafe-inline'` in `style-src` or consider extracting styles. Documented.
2. **import.meta.glob paths**: Must match exact pattern. Test that adding/removing files updates correctly in dev.
3. **ScrollSpy accuracy**: IntersectionObserver thresholds need tuning — test with varying content lengths.
4. **Bundle size**: KaTeX is ~300KB minified. It's tree-shakeable to some extent. Lazy loading helps.
5. **Radix dependencies**: Many small packages. Ensure version compatibility.
