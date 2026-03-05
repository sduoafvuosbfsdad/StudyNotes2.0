# StudyNotes

Calm, distraction-free study note reading with React + TypeScript + Tailwind.

## Quick Start

```bash
npm install
npm run dev
```

## Docker Compose (Production)

Build and run the production container (Node runtime, no nginx):

```bash
docker compose up --build -d
```

Then open `http://localhost:8080`. The container builds the app and serves it with `vite preview` under `NODE_ENV=production`.

To stop and remove containers:

```bash
docker compose down
```

## Scripts

- `npm run dev` - start local development server
- `npm run build` - type-check and create production build
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint
- `npm run test` - run Vitest suite
- `npm run format` - run Prettier across the repo

## Notes Format

Each note is a TSX module in `src/notes/<subject>/<topic>.tsx` and exports:

- `meta`: note metadata used by navigation/search
- `default`: React component for the note body

See [DOCS.md](./DOCS.md) for full authoring and deployment documentation.
