# StudyNotes

Calm, distraction-free study note reading with React + TypeScript + Tailwind.

## Quick Start

```bash
npm install
npm run dev
```

## One-command Setup

Run the setup script to install Docker Engine/CLI and Docker Compose plugin:

```bash
bash setup.sh
```

## Docker Compose

### Production

Build and run the production container (Node runtime, no nginx):

```bash
docker compose up --build -d web
```

Then open `http://localhost:3007`. The production image serves the built app from `dist` using a lightweight Node static file server under `NODE_ENV=production`.

### Development profile

Run the hot-reload development server in Docker:

```bash
docker compose --profile dev up --build web-dev
```

Then open `http://localhost:3007`. This profile mounts the repo into the container and runs `vite dev` under `NODE_ENV=development`.

### Backend profile (Django + PostgreSQL + Redis)

Start the backend stack:

```bash
docker compose --profile backend up --build api worker db redis
```

Run migrations and create an initial admin user:

```bash
docker compose --profile backend exec api python manage.py migrate
docker compose --profile backend exec api python manage.py createsuperuser
```

Backend API is exposed at `http://localhost:8000`.

- Health check: `GET /api/health/`
- JWT login (username/password): `POST /api/auth/token/`
- JWT refresh: `POST /api/auth/token/refresh/`
- Protected resources:
  - `/api/documents/`
  - `/api/document-versions/`
  - `/api/html-snippets/`

`html-snippets` supports storing custom HTML experiment snippets; write operations are admin-only by default.

Dependencies are installed during image build with `npm ci` (from `package-lock.json`). After lockfile changes, re-run the compose command with `--build` to refresh dependencies.

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
