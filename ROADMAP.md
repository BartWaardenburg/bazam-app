# Bazam.app Roadmap

## Current State

The `@bazam/ui` library has 21 components, but the **9 page components** still contain significant inline UI: custom CSS for cards, inputs, spinners, error messages, layout patterns, and decorative elements. Three components in `apps/client/src/app/components/` (RoomCode, PlayerList, Leaderboard) should live in the UI library. The web components (quiz-timer, quiz-progress-bar, quiz-avatar) are redundant with existing UI library equivalents.

**Goal**: Zero custom UI in page components. Every visual element comes from `@bazam/ui` with a Storybook story.

---

## Phase 1: Foundation Atoms

New atoms in `libs/ui/src/lib/atoms/` — each with Storybook stories.

- [x] **BzmCard** — Comic-bordered container with configurable border color. Extracts `.card` class used in every page via `styles.css`.
- [x] **BzmInput** — Text input with comic border styling, label slot, validation state. Extracts from create-quiz and join-game (`.name-input`, `label` styles).
- [x] **BzmPinInput** — 6-digit numeric code entry, large centered digits, auto-focus next. Extracts from join-game (`.code-input`).
- [x] **BzmSpinner** — Loading spinner with size variants. Extracts from player-lobby and player-game (`.spinner`).
- [x] **BzmErrorMessage** — Comic-styled error alert with `role="alert"`. Extracts from create-quiz and join-game (`.error`).
- [x] **BzmPageTitle** — Heading with comic text-shadow, configurable color. Extracts from every page (`h2` with `text-shadow`).
- [x] **BzmSplat** — Decorative comic splat shape, configurable color/size/clip-path. Extracts from home (`.splat-1`, `.splat-2`).

## Phase 2: Game Molecules

Move existing app components + extract inline patterns into `libs/ui/src/lib/molecules/`.

- [x] **BzmRoomCode** — 6-digit room code display with animated digits. Migrates from `apps/client/src/app/components/room-code/`.
- [x] **BzmPlayerList** — Player grid with avatars, optional scores, empty state. Migrates from `apps/client/src/app/components/player-list/`.
- [x] **BzmAnswerGrid** — 2x2 responsive grid of BzmAnswerOptions. Extracts from host-game, player-game, create-quiz (`.answers-grid`).
- [x] **BzmQuestionHeader** — Question text + timer in flex layout. Extracts from host-game and player-game (`.question-header`).
- [x] **BzmAnswerFeedback** — Correct/incorrect result card with score. Extracts from player-game (`.result-feedback`).
- [x] **BzmScoreDisplay** — Large score/rank with label text. Extracts from player-game (`.total-score`) and player-results (`.rank`).
- [x] **BzmWaitingState** — Spinner + message text combo. Extracts from player-lobby and player-game (`.waiting-spinner`).
- [x] **BzmActionBar** — Flex row of buttons, centered, wrapping. Extracts from home, host-results, create-quiz (`.actions`).

## Phase 3: Game Organisms

Compose molecules into larger game-specific components in `libs/ui/src/lib/organisms/`.

- [x] **BzmLeaderboard** — Podium top-3 + full ranking list with BzmLeaderboardItem. Migrates from `apps/client/src/app/components/leaderboard/`.
- [x] **BzmWinnerCard** — Winner display: label, name, score. Extracts from host-results (`.winner-card`).
- [x] **BzmCountdownView** — Full-width "Maak je klaar!" countdown state. Extracts from host-game and player-game (`.countdown`).
- [x] **BzmQuestionEditor** — Question text + answer inputs with radio + time slider. Extracts from create-quiz (`.question-card`).
- [x] **BzmHero** — Title with comic text-shadow + splat decorations + subtitle. Extracts from home (`.hero`, `.title-wrapper`).
- [x] **BzmComicBackground** — Animated halftone/starburst/speed-line background decorations. Extracts from app.ts (`.bg-comic`).

## Phase 4: Page Refactoring

Replace all inline UI in the 9 page components with `@bazam/ui` imports. After this phase, page components should be **thin containers** with only layout orchestration and service wiring — zero custom CSS for visual elements.

- [x] **Home** → BzmHero, BzmActionBar, BzmButton
- [ ] **Create Quiz** → BzmPageTitle, BzmCard, BzmQuestionEditor, BzmErrorMessage, BzmActionBar, BzmButton
- [ ] **Host Lobby** → BzmPageTitle, BzmCard, BzmRoomCode, BzmPlayerList, BzmButton
- [ ] **Host Game** → BzmCountdownView, BzmProgressBar, BzmQuestionHeader, BzmAnswerGrid, BzmCard, BzmLeaderboard, BzmButton
- [ ] **Host Results** → BzmPageTitle, BzmWinnerCard, BzmLeaderboard, BzmActionBar, BzmButton
- [ ] **Player Join** → BzmPageTitle, BzmCard, BzmPinInput, BzmInput, BzmErrorMessage, BzmButton
- [ ] **Player Lobby** → BzmPageTitle, BzmWaitingState, BzmCard, BzmPlayerList
- [ ] **Player Game** → BzmCountdownView, BzmProgressBar, BzmQuestionHeader, BzmAnswerGrid, BzmAnswerFeedback, BzmScoreDisplay, BzmWaitingState
- [ ] **Player Results** → BzmCard, BzmScoreDisplay, BzmLeaderboard, BzmButton
- [ ] **App Shell** → BzmComicBackground

## Phase 5: Cleanup

- [ ] Delete `apps/client/src/app/components/` (moved to `@bazam/ui`)
- [ ] Delete `apps/client/src/web-components/` (replaced by BzmTimer, BzmProgressBar, BzmAvatar)
- [ ] Move `animate-in`, `animate-scale` utility classes into UI components
- [ ] Audit `styles.css` for dead CSS (`.card` class, etc.)

## Phase 6: Database Integration

- [ ] Wire Drizzle schema (`quizzes`, `game_sessions`, `game_results`) into game flow
- [ ] Persist quiz creation → `quizzes` table
- [ ] Save game sessions and results on game end
- [ ] Add quiz browsing/history page (uses BzmQuizCard, BzmQuizList)

## Phase 7: Game Features

- [ ] Proper countdown timer (3-2-1-GO with server sync)
- [ ] Sound effects / haptic feedback
- [ ] Reconnection handling (WebSocket drops)
- [ ] Score animation/transitions between questions
- [ ] Confetti on win

## Phase 8: Production Polish

- [ ] PWA setup (installable on mobile)
- [ ] Error boundaries and offline state
- [ ] Performance audit (bundle splitting per route)
- [ ] E2E tests (Playwright for game flow)
- [ ] Deploy to Fly.io

---

## Implementation Guidelines

- Every UI component gets a Storybook story with all variants/states
- Follow atomic design: atoms → molecules → organisms
- Components use Angular signals, `OnPush` change detection, standalone
- Use `@bazam/ui` design tokens (`--bzm-*` CSS custom properties) — no hardcoded colors
- All components must have ARIA labels, semantic HTML, keyboard navigation
- Support `prefers-reduced-motion` in all animations
- Export everything from `libs/ui/src/index.ts`
