---
active: true
iteration: 1
session_id: 
max_iterations: 50
completion_promise: "ROADMAP PHASES 1-5 COMPLETE"
started_at: "2026-03-10T14:48:01Z"
---

You are building out the Bazam.app UI component library following ROADMAP.md. Read ROADMAP.md to see the full plan and check which items are already completed (marked [x]).

## Rules
- Work through phases IN ORDER (Phase 1 → 2 → 3 → 4 → 5). Do NOT skip ahead.
- Pick the FIRST unchecked item in the current phase.
- Each iteration: build ONE component with its Storybook story.
- After completing a component, mark it [x] in ROADMAP.md and commit.
- When a phase is fully checked off, move to the next phase.

## Per Component Checklist
1. Read existing UI components in libs/ui/src/ for patterns (naming, file structure, story format)
2. Create the component in the correct atomic design folder (atoms/molecules/organisms)
3. Use Angular signals, standalone, OnPush change detection
4. Use @bazam/ui design tokens (--bzm-* CSS custom properties) — no hardcoded colors
5. Add ARIA labels, semantic HTML, keyboard support
6. Support prefers-reduced-motion for animations
7. Create a comprehensive Storybook story with all variants and states
8. Export from libs/ui/src/index.ts
9. Verify it compiles: cd apps/client && npx nx build client --skip-nx-cache 2>&1 | head -30
10. Mark [x] in ROADMAP.md
11. Commit with conventional commit message (e.g. feat(ui): add BzmCard atom with story)

## Phase 4 Special Rules
When refactoring pages, replace ALL inline UI with @bazam/ui imports. The page component should have ZERO custom CSS for visual elements — only layout wiring and service injection.
Delete the old app/components/ after migrating.

## Phase 5 Special Rules
Delete web-components/, clean up dead CSS in styles.css, verify build still passes.

## Completion
When ALL items in Phases 1-5 are checked [x] in ROADMAP.md, output <promise>ROADMAP PHASES 1-5 COMPLETE</promise>.
