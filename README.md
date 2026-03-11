# Bazam

Real-time multiplayer quiz platform — create quizzes, share a room code, and play together live. Built as a fullstack showcase of modern web technologies.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 21 (zoneless, signals, standalone components) |
| **Backend** | Bun + Elysia (WebSocket real-time communication) |
| **Database** | PostgreSQL 17 + Drizzle ORM |
| **UI Library** | `@bazam/ui` — 42 components, atomic design, Storybook |
| **Web Components** | Vanilla Custom Elements (quiz-timer, quiz-progress-bar, quiz-avatar) |
| **State Management** | Angular Signals (no RxJS for state) |
| **Shared Types** | `@bazam/shared-types` — type-safe WebSocket protocol |
| **Monorepo** | Nx 22 + pnpm workspaces |
| **Containerization** | Docker Compose (PostgreSQL + server) |
| **Deployment** | Fly.io (Amsterdam region) |

## Key Technical Highlights

### Modern Angular (v21)
- **Zoneless** change detection — no Zone.js overhead
- **Signals** for reactive state management throughout the app
- **Standalone components** — no NgModules
- `OnPush` change detection on all UI components

### Custom Web Components
Vanilla Custom Elements with full lifecycle management (`connectedCallback`, `disconnectedCallback`), Shadow DOM encapsulation, ARIA roles, and `prefers-reduced-motion` support.

### Component Library (`@bazam/ui`)
42 components organized in atomic design (14 atoms, 14 molecules, 14 organisms), each with Storybook stories. Design token system with CSS custom properties (`--bzm-*`). Every component is accessible (ARIA labels, semantic HTML, keyboard navigation).

### Real-time Architecture
WebSocket server with a `ConnectionRegistry` pattern that decouples transport from game logic. `RoomManager` uses abstract connection IDs, making the game engine testable independently from WebSocket internals. Shared TypeScript types (`@bazam/shared-types`) enforce a type-safe message protocol between client and server.

### TypeScript Throughout
Strict TypeScript across the entire stack — client, server, shared types, and UI library. Branded types like `AnswerIndex = 0 | 1 | 2 | 3` for compile-time safety on domain values.

### Accessibility & Motion
All components include ARIA labels and semantic HTML. Global `prefers-reduced-motion` media query disables animations. Web Components respect motion preferences at the element level.

### Containerization & Deployment
Docker Compose for local development (PostgreSQL + server). Fly.io deployment with health checks and HTTPS enforcement. Drizzle Kit for type-safe database migrations.

## Project Structure

```
bazam.app/
├── apps/
│   ├── client/                    # Angular 21 frontend
│   │   └── src/app/
│   │       ├── pages/
│   │       │   ├── home/          # Landing page
│   │       │   ├── host/          # Quiz host flow (create → lobby → game → results)
│   │       │   └── player/        # Player flow (join → lobby → game → results)
│   │       └── services/          # WebSocket, game state, routing
│   └── server/                    # Bun + Elysia backend
│       └── src/
│           ├── game/
│           │   ├── connection-registry.ts
│           │   ├── room-manager.ts
│           │   └── scoring.ts
│           └── db/                # Drizzle ORM schema & migrations
├── libs/
│   ├── shared-types/              # TypeScript message & game types
│   └── ui/                        # @bazam/ui component library
│       └── src/lib/
│           ├── atoms/             # 14 primitives (Button, Input, Card, Spinner, ...)
│           ├── molecules/         # 14 compositions (AnswerOption, RoomCode, Timer, ...)
│           ├── organisms/         # 14 features (Leaderboard, QuestionEditor, Hero, ...)
│           └── tokens/            # Design tokens (CSS custom properties)
├── docker-compose.yml             # PostgreSQL + server containers
├── fly.toml                       # Fly.io deployment config
└── STYLE_GUIDE.md                 # Design language documentation
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

### Development

```bash
# Start everything (client + server)
pnpm dev

# Or individually
pnpm dev:client    # Angular dev server
pnpm dev:server    # Bun server with --watch

# Storybook (component library)
npx nx storybook ui
```

### Database

```bash
# Start PostgreSQL
docker compose up -d postgres

# Run migrations
cd apps/server && bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

### Build

```bash
pnpm build
```

### Deploy

```bash
fly deploy
```

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Angular Signals over RxJS | Simpler mental model for UI state, less boilerplate, better performance with zoneless |
| Vanilla Web Components | Demonstrates native platform APIs alongside framework components |
| ConnectionRegistry pattern | Decouples WebSocket transport from game logic for testability |
| Atomic design for UI library | Enforces composition hierarchy and reusability across pages |
| Bun + Elysia | Fast runtime with native WebSocket support, TypeScript-first |
| Monorepo with shared types | Single source of truth for the client-server protocol |
| CSS custom properties | Runtime-themeable design tokens without build-time tooling |

## License

MIT License — see [LICENSE](LICENSE).
