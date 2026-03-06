# Bazam

Real-time multiplayer quiz platform. Create quizzes, share a room code, and play together live.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21 (zoneless, signals, standalone) |
| Backend | Bun + Elysia (WebSocket) |
| Database | PostgreSQL 17 + Drizzle ORM |
| UI Library | `@bazam/ui` (atomic design, Storybook) |
| Monorepo | Nx 22 + pnpm workspaces |
| Deployment | Fly.io (Amsterdam) |

## Project Structure

```
bazam.app/
├── apps/
│   ├── client/          # Angular frontend
│   └── server/          # Bun + Elysia API & WebSocket server
├── libs/
│   ├── shared-types/    # Shared TypeScript types
│   └── ui/              # Component library (Storybook)
├── docker-compose.yml   # Local PostgreSQL + server
└── fly.toml             # Fly.io deployment config
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9+
- [Bun](https://bun.sh/) 1.1+
- [Docker](https://www.docker.com/) (for PostgreSQL)

### Install Dependencies

```bash
# Client + root
pnpm install

# Server
cd apps/server && bun install
```

### Run Development Servers

```bash
# Start everything (client + server)
pnpm dev

# Or individually
pnpm dev:client    # Angular dev server
pnpm dev:server    # Bun server with watch
```

### Database

```bash
# Start PostgreSQL
docker compose up -d postgres

# Run migrations
cd apps/server
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

### Storybook

```bash
npx nx storybook ui
```

## Build

```bash
pnpm build
```

## Deployment

Deployed on [Fly.io](https://fly.io) in the Amsterdam region.

```bash
fly deploy
```

## License

Private - All rights reserved.
