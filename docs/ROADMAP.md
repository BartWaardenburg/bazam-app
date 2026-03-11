# Bazam Roadmap: From Quiz App to Party Game Platform

> **Vision**: Transform Bazam from a standard Kahoot-style quiz into an unpredictable, social, laugh-out-loud party game where knowledge is just one weapon in your arsenal.
>
> **Target audience**: Ages 8-20 (classrooms, birthday parties, game nights, school events)

---

## Design Principles

1. **Chaos is fun** — The best party games (Mario Party, Jackbox, Fall Guys) thrive on reversals, surprise, and "NO WAY" moments. Every round should have potential for drama.
2. **Skill + luck** — Pure knowledge rewards the same people every time. Inject variance so anyone can win, but consistency still matters.
3. **Safe by default** — The game should be safe for the youngest player in the room with zero configuration. Competitive/chaotic features are opt-in, never opt-out.
4. **30-second dopamine loops** — Every action should give immediate, satisfying feedback. No dead air.
5. **Accessible chaos** — Complex under the hood, dead simple to play. One tap to answer, one tap to use a power-up. No tutorials needed.
6. **Everyone keeps playing** — No one sits idle. Eliminated players get side games. Spectators can influence the action. There is always something to do.

---

## Epic 0: Foundation & Safety (Pre-Requisites)

_Before any new features ship, the base game needs these safeguards for an 8-20 audience._

### Stories

#### 0.1 Nickname Content Filter
**As a** host running a classroom quiz, **I want** inappropriate nicknames to be blocked **so that** the game stays safe.

- Server-side profanity/slur filter in `RoomManager.joinRoom()`
- Block PII patterns (phone numbers, emails)
- Reject and return a friendly error: "Kies een andere naam!"
- Maintain a configurable blocklist

#### 0.2 Party Mode / Klas Mode Toggle
**As a** host, **I want** to select an age-appropriate preset **so that** the game is safe for my group.

Two presets when creating a room:

| Setting | Party Mode (default) | Competitive Mode (opt-in) |
|---|---|---|
| Power-up targeting | Random/AoE only | Player can choose targets |
| Scoring | Compressed (leader earns less per Q) | Standard speed-based |
| Reactions | Positive cheers only | Full emoji set |
| Elimination modes | Hidden | Available |
| Timers | Min 15 seconds | No minimum |
| Free text input | Host approval required | Open |

Party Mode is the default. Competitive Mode requires explicit host opt-in.

#### 0.3 Fair Scoring System
**As a** younger/slower-reading player, **I want** the scoring to not punish me for reading speed **so that** I have a fair chance.

Rework `calculateScore` with two changes:

**Rank-based scoring compression** — the leader earns from a narrower band:
```
compressionFactor = 0.7 + (rankPercentile * 0.45)
// 1st place: max ~783 pts/question
// Last place: max ~1,135 pts/question
```

**Momentum bonus** — +100 points for any player who improves their rank between rounds. The leader can never earn this (can't improve from 1st). Uses the existing `previousRanks` tracking.

This closes the score ratio from 4:1 to ~2.5:1 over 10 questions. The best player still has an edge, but trailing players can realistically catch up.

#### 0.4 QR Code Quick Join
**As a** player, **I want** to scan a QR code **so that** joining is instant.

- Host screen displays QR code alongside the room code
- QR links to join page with room code pre-filled
- Reduces friction for large groups (events, classrooms)
- Highest value-to-effort ratio feature on the entire roadmap

#### 0.5 Question Type System Refactor
**As a** developer, **I need** a flexible question type system **so that** new question formats can be added cleanly.

- Replace fixed `AnswerIndex = 0 | 1 | 2 | 3` with a discriminated union:
  ```
  MultipleChoice | NumericGuess | Ranking | Bluff
  ```
- Each type has its own scoring logic, validation, and client component
- Foundation that unblocks Epics 4 and beyond

---

## Epic 1: Power-Ups

_Inspired by: Mario Kart items, Splatoon specials, Fall Guys obstacles_

The single biggest lever to transform the game from "quiz" to "party game." Key design rule from game balance review: **trailing players earn power-ups faster** (inverted Mario Kart item distribution).

### Stories

#### 1.1 Power-Up Inventory & Economy
**As a** player, **I want** to earn and hold power-ups **so that** I have strategic choices beyond just answering correctly.

**Earning (rank-based — the most impactful balance decision):**

| Position | Earn condition |
|---|---|
| 1st place | 4 correct in a row |
| 2nd-3rd | 3 correct in a row |
| 4th-6th | 2 correct in a row |
| Bottom 25% | Any correct answer |
| Everyone | 3 wrong in a row = guaranteed "pity" power-up |

- Max 2 power-ups held at a time (forces use-it-or-lose-it)
- Power-ups visible to the holder only
- UI: inventory bar below the answer grid
- Server validates all usage (anti-cheat)
- Power-ups included in reconnection state snapshot

#### 1.2 Chaos Power-Ups (Non-Targeted)
**As a** player, **I want** to create chaos **so that** the game stays unpredictable.

All offensive power-ups affect everyone or are randomly assigned — **no player-chosen targeting** in Party Mode.

| Power-Up | Effect | Notes |
|---|---|---|
| **Scramble** | Randomizes answer order for all players | Cognitive, not motor-skill disruption. Fair for all ages. |
| **Fog of War** | Partially hides question text for one random opponent | Duration: 30% of time limit, clamped 2-5s. Scales fairly across timer lengths. |
| **Time Crunch** | Removes 3 seconds from all opponents' timers | AoE, not targeted. Reduced from 5s to 3s to prevent question-killing. |

#### 1.3 Boost Power-Ups
**As a** player, **I want** to help myself **so that** correct play is rewarded.

| Power-Up | Effect | Notes |
|---|---|---|
| **Shield** | Blocks the next chaos power-up aimed at you | Clean, always useful, no grief potential |
| **Peek** | Eliminates one wrong answer | Huge for younger players narrowing down. Accessible. |
| **Freeze Frame** | Pauses your personal timer for 3 seconds | Great for slower readers. Compensates for age gap. |
| **Second Chance** | If wrong, get one retry at 50% points | Teaches that mistakes are recoverable. Best power-up for younger players. |
| **Double Down** | 2x points if correct, 25% points if wrong | Floor raised from 0 to 25% to prevent feel-bad moments for kids. |
| **Equalizer** | For next question, all scores calculated at median speed — only correctness matters | Rare drop, only for bottom 50%. Removes speed advantage for one round. |

#### 1.4 Blind Commitment UX
**As a** player, **I want** a simple one-tap power-up activation **so that** using them doesn't slow me down.

- Power-ups are committed **before** the question is revealed (during the 3s countdown)
- Player sees "Use [power-up]?" and decides blind — creates prediction/bluffing layer
- Prevents the dominant strategy of "always use offensive when ahead"
- All players see a brief anonymous flash: "A power-up was activated!" (tension without info)
- Sound effect per power-up type
- Host screen shows power-up activity in real-time feed

**What was cut and why:**
- ~~Spotlight~~ — Publicly reveals another player's answer. All four reviewers flagged this as the worst feature: public humiliation mechanic, bullying vector, zero strategic depth. Unanimously cut.
- ~~Mirror~~ — Swaps answer buttons for one player. Motor-skill disruption that punishes younger players and players with accessibility needs. Replaced by Scramble (cognitive, not motor).
- ~~Player-chosen targeting~~ — Enables coordinated bullying ("everyone attack Emma"). All offensive effects are now AoE or random-target in Party Mode.

---

## Epic 2: Game Modes

_Inspired by: Mario Party variety, Fall Guys rounds, Jackbox variety packs_

### Stories

#### 2.1 Classic Mode (Current — Enhanced)
**As a** host, **I want** a standard quiz with optional power-ups **so that** I have a familiar baseline.

- Current behavior + power-ups (toggle on/off per host preference)
- Party Mode scoring compression active by default
- The "safe" default for classrooms and first-time hosts

#### 2.2 Team Battle Mode
**As a** group of friends, **we want** to play in teams **so that** we can collaborate and compete together.

- Host sets 2-4 teams in lobby (or auto-balance by player count)
- Players pick team color/name
- Team score = average of individual scores (prevents team size advantage)
- Team emoji reactions during questions
- Power-ups affect entire opposing teams (AoE)
- Leaderboard shows team standings + individual MVP
- **Best mode for ages 8-12** — reduces individual performance anxiety, teaches collaboration

#### 2.3 Boss Battle Mode (Co-op)
**As a** group, **we want** a cooperative challenge **so that** we can work together against the game.

- All players vs. "De Baas" — a themed boss character with personality (not generic AI)
- Boss has a health bar scaled to player count
- Correct answers deal damage (speed-based)
- Wrong answers heal the boss slightly
- **Boss targets the leader**: attacks (timer reduction, scrambled answers) hit the highest-scoring player. Creates a natural tank/DPS dynamic where strong players absorb pressure while weaker players contribute safely.
- **Rescue mechanic**: When a player answers wrong, a teammate who answers correctly can "rescue" them — the wrong answer is neutralized. Prevents younger players from feeling they're dragging the team down. Limit: 1 rescue per player per round.
- Win: defeat the boss before running out of questions
- **Highest priority co-op mode** — best for mixed-age groups, no individual failure

#### 2.4 Blitz Mode
**As a** player, **I want** a fast-paced rapid-fire mode **so that** sessions are short and intense.

- Questions auto-advance every 10 seconds (no host control)
- No leaderboard breaks — continuous flow
- Points decay exponentially with time (rewards instant reactions)
- Power-ups auto-deploy randomly (pure chaos)
- Timer minimum: 15 seconds when Party Mode is active, 8 seconds in Competitive
- Perfect for quick rounds during breaks or between other modes

#### 2.5 Survival Mode
**As a** player, **I want** a high-stakes endurance mode **so that** every question matters.

_Reworked from "Elimination" based on expert review — no public removal._

- Every player starts with 3 lives (hearts)
- Wrong answer = lose a heart. Correct answer when at 1 heart = regain a heart.
- When you lose all hearts, you enter "Comeback Round" — answer 2 in a row correctly to earn a heart back and rejoin
- Last player(s) with hearts remaining after all questions wins
- Players are never fully removed or idle — always one answer away from getting back in
- Host screen shows dramatic "final heart!" moments

#### 2.6 Survival Royale (Large Groups)
**As a** player in a large group (10-50+), **I want** a battle royale format **so that** big groups stay competitive.

- Uses the hearts/lives system from Survival Mode (not public elimination)
- Questions start easy, get progressively harder
- Timer stays constant for most rounds, only shrinks in final 2 rounds
- Players who run out of hearts become Spectators with voting power (see Epic 3)
- Gradual elimination: bottom 15% lose a heart every 3 questions (rounds 1-3), then 25% (rounds 4+)
- Final 4 players: sudden-death round
- Winner gets crowned with fanfare

**What was cut and why:**
- ~~Ghost mechanic~~ — Eliminated players sabotaging remaining players. All reviewers agreed: teaches spite, creates dogpile dynamics, punishes success. Replaced with Spectator voting on game events (positive influence, not targeted sabotage).
- ~~Hard elimination~~ — Public removal while others continue triggers rejection/shame for ages 8-12. Replaced with hearts/lives system where you're always one answer away from getting back in.
- ~~Alliance/Betrayal system~~ — Rewarding players for breaking social contracts is developmentally inappropriate for ages 8-14. Cut entirely.

---

## Epic 3: Social Layer

_Inspired by: Jackbox audience participation, Fall Guys emotes, Twitch chat_

### Stories

#### 3.1 Cheers & Reactions
**As a** player, **I want** to react during the game **so that** it feels social and alive.

- Quick emoji reactions during leaderboard phase
- Curated emoji set: faces, celebrations, animals, objects (no combinations that spell slurs)
- Reactions float on the host's shared screen
- "Cheers" system (renamed from "Taunts"): exclusively positive messages
  - "Nice one!", "So close!", "You've got this!", "Wow!", "Unstoppable!"
  - No mocking messages. Context makes the message — even "Better luck next time" is pile-on when 3 people send it to a struggling 8-year-old.
- Rate-limited: 1 cheer per player per question
- Players can mute incoming cheers

#### 3.2 Confidence Wager
**As a** player, **I want** to bet on my own performance **so that** there's a risk/reward decision each round.

_Replaces "Prediction Betting" — experts unanimously flagged betting on others' outcomes as simulated gambling, inappropriate for ages 8+._

- Before each question, optionally commit: 100, 200, or 300 points from your own score
- Correct answer: earn wager back + wager as bonus (net +wager)
- Wrong answer: lose the wagered points
- Cap: max 30% of current score (prevents desperate all-in plays)
- Simple 3-button UI during countdown (small/medium/large)
- This is self-assessment, not gambling on others — fundamentally different

#### 3.3 Spectator Mode
**As a** spectator, **I want** to watch and influence the game **so that** watching is fun too.

- Spectators join with a separate "watch" code
- Spectators vote on **game events only** (never on individual players):
  - Which category comes next
  - Which power-up gets injected into the game
- Spectator hype meter: shows audience excitement level on the host screen
- Perfect for streaming, events, or eliminated players in Survival Royale
- Lower update frequency for efficient broadcasting

**What was cut and why:**
- ~~Prediction Betting~~ — Players wagering score on who will win/lose. UK Gambling Commission research shows simulated betting in games increases real gambling behavior in teens. Replaced with Confidence Wager (self-assessment only).
- ~~Targeted taunts~~ — Even pre-set taunts become bullying when multiple players pile on one person. Replaced with positive-only Cheers.
- ~~Spectator betting~~ — Same gambling concerns. Spectators now vote on events instead.

---

## Epic 4: Question Variety

_Inspired by: Jackbox prompt system, Fibbage, pub quiz traditions_

### Stories

#### 4.1 Closest Wins (Numeric Questions)
**As a** host, **I want** numeric guess questions **so that** there's variety beyond multiple choice.

- "How many bones in the human body?" — players type a number
- Closest answer wins max points, further away = fewer points (logarithmic scale)
- Fun reveal: show all guesses on a number line, then reveal the answer
- Host screen shows live histogram of guesses
- Intuitive from age 6+ ("guess the number" is universally understood)

#### 4.2 Fibbage-Style Bluff Rounds
**As a** player, **I want** to write fake answers to fool others **so that** creativity is rewarded over pure knowledge.

_Technically a separate game mode/round type, not just a question format._

**Flow:**
1. Host poses an obscure question
2. Each player submits a plausible-sounding fake answer
3. All fakes + the real answer are shuffled and displayed
4. Players vote for what they think is real
5. Scoring: correct guess = 500 pts, each player you fool = 250 pts

**Age safeguards (required):**
- Content filter on all submitted text (profanity, slurs, PII)
- In Party Mode: host approval screen before fake answers are displayed
- Character limit on answers
- Recommended for ages 12+ (requires theory of mind + creative writing)
- Creates the single best social moments in the game

#### 4.3 Image & Media Questions
**As a** host, **I want** to include images in questions **so that** quizzes are more visual and engaging.

- Image URLs in questions (show above question text)
- Image upload in quiz creation UI
- More accessible for younger players who struggle with text-heavy questions
- Defer audio/video to later — media sync across devices is a known hard problem

#### 4.4 AI-Generated Questions
**As a** host, **I want** to auto-generate questions on a topic **so that** I can create quizzes instantly.

- Host enters a topic ("dinosaurs", "Dutch geography", "Marvel movies")
- AI generates 10-20 questions with difficulty tags (1-5)
- **Host always reviews before starting** — never auto-generated directly into a live game
- Age-bracket tagging: 8-10, 11-13, 14-17, 18+
- "Surprise me" button for random topics
- Simple REST API integration (low complexity)

**What was cut and why:**
- ~~Ranking/ordering questions~~ — Drag-and-drop is problematic for 8-9 year olds (motor skills, small screens, abstract concept). Deferred to future consideration.
- ~~Audio/video questions~~ — Media synchronization across devices in real-time is a known hard problem. Ship image support first, revisit audio/video later.

---

## Epic 5: Progression

_Inspired by: Duolingo streaks, Fall Guys cosmetics, Brawl Stars progression_

### Stories

#### 5.1 Player Profiles (Guest-First)
**As a** player, **I want** a persistent profile **so that** my history is tracked across sessions.

- **Guest play remains the primary path** — no account required to play
- Optional sign-up: nickname + avatar (no real name, no photo for safety)
- Profile page: total games, win rate, avg score, best streak
- Match history: recent games with scores
- Under-13 accounts: avatar-only, not publicly searchable, no direct messaging (COPPA)

#### 5.2 Achievement System
**As a** player, **I want** to earn achievements **so that** I have goals beyond winning.

| Category | Examples |
|---|---|
| **Knowledge** | "Brainiac" (10 perfect games), "Specialist" (90%+ in a category) |
| **Teamwork** | "Team Player" (win 10 team battles), "Rescue Hero" (rescue 20 teammates in Boss Battle) |
| **Clutch** | "Comeback Kid" (win from last place), "Photo Finish" (win by <100 points) |
| **Explorer** | "Mode Master" (play all game modes), "Category King" (play 10 different categories) |
| **Dedication** | "Regular" (play 7 days in a row), "Veteran" (100 games played) |

**All achievements reward positive play.** No achievements for sabotage, betrayal, or anti-social behavior.

#### 5.3 Custom Avatars & Cosmetics
**As a** player, **I want** to customize my appearance **so that** I express myself.

- Avatar builder: face shape, eyes, mouth, hair, accessories
- Unlockable items from achievements and gameplay milestones
- "Victory dance" animations (shown when you win)
- Name colors based on tier
- **All cosmetics earnable through play** — no purchase-only items (prevents economic exclusion)

#### 5.4 Weekly Leaderboards
**As a** competitive player, **I want** a fresh leaderboard **so that** there's always a new competition.

- **Weekly reset** (not monthly — keeps it fresh, reduces social comparison anxiety)
- Show only top 10 + the player's own position (never expose the full bottom)
- In classroom mode: replaced with "personal best" tracking ("You beat your score!")
- Rank tiers: Bronze, Silver, Gold, Diamond, Champion
- Separate leaderboards per game mode

**What was cut and why:**
- ~~XP & Leveling~~ — Adds complexity without meaningful fun. Level numbers visible in lobbies create "I'm level 50, you're level 3" social hierarchy that discourages new players. Achievements and cosmetics provide progression without the hierarchy.
- ~~Seasonal system~~ — Too complex for the audience. Weekly leaderboards provide the same fresh-competition feeling with less infrastructure.
- ~~Rivalry tracker~~ — Head-to-head stats between specific players can fuel real-world conflicts in school settings.

---

## Epic 6: Party & Event Features

_Inspired by: Jackbox party packs, pub quiz night traditions_

### Stories

#### 6.1 Music & Sound Design
**As** everyone in the room, **we want** great audio **so that** the game feels alive.

_Game designer flagged this as the single highest-impact low-effort feature._

- Background music that builds tension during questions
- Music tempo increases as timer runs down
- Dramatic reveal sounds for correct answer
- Crowd reaction sounds (cheering/gasping) based on answer distribution
- Streak sound effects (increasing intensity with streak length)
- Power-up activation sounds
- Victory fanfare / "Final heart!" tension music
- **Prominent mute/volume control** — sensory-sensitive children may find sounds overwhelming
- Respect `prefers-reduced-motion` (already in codebase CSS)

#### 6.2 Multi-Round Party Sessions
**As a** group, **we want** to play multiple rounds in one session **so that** we can have a full game night.

- Host creates a "party" with multiple quiz rounds
- Mix game modes across rounds (Round 1: Classic, Round 2: Blitz, Round 3: Boss Battle)
- Running total across all rounds
- "Intermission" screens between rounds with current standings
- Final championship standings combining all rounds
- Quick rematch button at end of any round

#### 6.3 Host Tools
**As a** quiz host at an event, **I want** pacing and commentary tools **so that** I can MC the game.

- Pause button with custom message ("Even pauze! Over 5 minuten verder")
- Quick stat overlays on host screen: "Player X has 5 in a row!", "Nobody got that one!"
- Manual point adjustments (for verbal bonus rounds)
- Host screen designed as a **spectacle** — big animations, dramatic reveals, particle effects
- The host screen IS the show. Every answer reveal, every power-up, every elimination should look great projected on a wall.

#### 6.4 Custom Themes
**As a** host, **I want** to customize the look **so that** quizzes match my event.

- Pre-built themes: "Pub Quiz", "Classroom", "Birthday Party", "Holiday Special"
- Theme picker: color scheme, background pattern
- Upload custom logo (shown on host screen)

**What was cut and why:**
- ~~Host voice broadcast~~ — Building real-time voice streaming is essentially building VoIP from scratch. Massive effort, unclear value when the host is typically in the same room. Use Discord/Zoom for remote events.
- ~~Tournament mode~~ — Requires cross-room orchestration (fundamentally different architecture). Multi-round party sessions deliver 80% of the value at 20% of the complexity. Revisit if there's clear demand.
- ~~Highlight reel~~ — Cool idea but very high effort (recording, editing, playback infrastructure). Not worth it at this stage.

---

## Epic 7: Smart Question Engine

_Inspired by: Adaptive difficulty in games, rubber-banding mechanics_

### Stories

#### 7.1 Category Wheel
**As** players, **we want** to influence which category comes next **so that** we have strategic control.

- Every 3 questions, a spin-the-wheel appears
- Players vote on next category (majority wins)
- Or: random spin with dramatic animation (visual spectacle, 8-year-olds love it)
- Players in bottom half get extra voting weight (rubber-banding)
- Creates strategic moments: "I know animals, vote animals!"

#### 7.2 Streak Breaker
**As** the game, **I want** to challenge dominant players **so that** the game stays competitive.

- Triggers at 3 consecutive correct (lowered from 5 — intervenes before the game is decided)
- Player on streak faces a harder question with a shorter timer
- If they clear it: 1.25x bonus points (reward, not just punishment)
- Creates dramatic "can they keep it going?!" moments
- Natural catch-up mechanic the whole room watches together

#### 7.3 Invisible Adaptive Scoring
**As** the game, **I want** to subtly help struggling players **so that** mixed-age groups stay fun.

Server-side only — **never revealed to players** (feels patronizing if visible):

```
// Struggling players (< 40% correct) get a gentler time curve
// Effect: ~80 extra points per question, cumulative but invisible
adaptiveTimeFraction = max(0, 1 - pow(responseTime/timeLimit, curve))
where curve = correctRate < 0.4 ? 0.6 : correctRate < 0.6 ? 0.8 : 1.0
```

Combined with rank-based scoring compression (Epic 0.3), this ensures an 8-year-old playing against teenagers has a genuine chance at a mid-table finish rather than automatic last place.

#### 7.4 Question Memory
**As a** returning player, **I want** fresh questions each time **so that** repeat sessions stay fun.

- Track which questions each player has seen (requires profiles from Epic 5.1)
- Avoid repeats across sessions
- Analytics for hosts: which questions are too easy/hard
- Low effort after auth infrastructure exists

**What was cut and why:**
- ~~Per-player adaptive difficulty (different questions per player)~~ — Breaks the shared social experience. Everyone must see the same question for the "did YOU get it?!" moments to work. Adaptive scoring achieves the same fairness goal without splitting the experience.

---

## Implementation Phases

### Phase 0: Foundation (Weeks 1-2)
_Make the game safe and fair before adding features_

| Story | Impact | Effort | Why First |
|---|---|---|---|
| 0.1 Nickname content filter | Safety | Low | Required for any audience under 18 |
| 0.2 Party Mode toggle | Safety | Medium | Architecture for all future feature gates |
| 0.3 Fair scoring (compression + momentum) | Fairness | Low | 3 changes to `calculateScore`, huge balance impact |
| 0.4 QR Code quick join | UX | Low | Half-day win, biggest friction reducer |
| 0.5 Question type system refactor | Foundation | Medium | Unblocks all of Epic 4 |

### Phase 1: Power-Ups & Sound (Weeks 3-6)
_The biggest fun multiplier — transforms quiz into party game_

| Story | Impact | Effort | Why Now |
|---|---|---|---|
| 1.1 Power-up inventory & economy | High | Medium | Core system everything else builds on |
| 1.3 Boost power-ups (all 6) | High | Medium | Safe, universally positive, ship first |
| 1.2 Chaos power-ups (all 3) | High | Medium | Ship after boosts are proven fun |
| 1.4 Blind commitment UX | High | Medium | Makes power-ups strategic, not just reactive |
| 6.1 Music & sound design | High | Low | Highest impact-to-effort ratio. The game should sound amazing. |
| 3.1 Cheers & reactions | Medium | Low | Social texture with minimal risk |

### Phase 2: Game Modes (Weeks 7-10)
_Multiple ways to play keeps sessions fresh_

| Story | Impact | Effort | Why Now |
|---|---|---|---|
| 2.2 Team Battle | High | High | Best mode for young players, reduces anxiety |
| 2.3 Boss Battle (co-op) | High | High | Best mode for mixed-age groups |
| 2.4 Blitz Mode | High | Low | Minimal new logic, just timing changes |
| 2.5 Survival Mode (hearts) | High | Medium | High-stakes without the cruelty of elimination |
| 7.1 Category Wheel | Medium | Medium | Adds player agency and spectacle between questions |

### Phase 3: Question Variety & Social (Weeks 11-14)
_New question types and social features_

| Story | Impact | Effort | Why Now |
|---|---|---|---|
| 4.1 Closest Wins (numeric) | Medium | Medium | First new question type, visual reveal is great |
| 4.2 Fibbage bluff rounds | High | High | Creates the best social moments, needs content filter |
| 4.3 Image questions | Medium | Medium | Visual questions help younger players |
| 3.2 Confidence Wager | Medium | Medium | Adds decision layer without gambling mechanics |
| 7.2 Streak Breaker | Medium | Low | Natural catch-up, dramatic moments |

### Phase 4: Progression & Events (Weeks 15-18)
_Reasons to come back_

| Story | Impact | Effort | Why Now |
|---|---|---|---|
| 5.1 Player profiles (guest-first) | High | High | Gates all progression features |
| 5.2 Achievement system | Medium | Medium | Goals beyond winning |
| 5.3 Avatars & cosmetics | Medium | Medium | Self-expression, earnable rewards |
| 6.2 Multi-round party sessions | High | Medium | Full game night support |
| 5.4 Weekly leaderboards | Medium | Medium | Fresh competition cycle |

### Phase 5: Scale & Polish (Weeks 19-22)
_Ready for big moments_

| Story | Impact | Effort | Why Now |
|---|---|---|---|
| 2.6 Survival Royale (large groups) | High | High | Needs Survival Mode proven first |
| 4.4 AI-generated questions | High | Medium | Instant quiz creation for any topic |
| 3.3 Spectator mode | Medium | High | Event/streaming support |
| 7.3 Invisible adaptive scoring | Medium | Medium | Subtle fairness for mixed-age |
| 6.3 Host tools | Medium | Medium | Event MC features |
| 6.4 Custom themes | Low | Medium | Visual polish |
| 7.4 Question memory | Low | Low | Quality of life after profiles exist |

---

## Expert Review Summary

This roadmap was reviewed by four specialists. Their consensus shaped every decision above:

| Expert | Key Contribution |
|---|---|
| **Game Designer** | Cut features that don't work in 10-30s rounds. Prioritized sound design. Replaced elimination with hearts/lives. Added "host screen as spectacle" principle. |
| **Child/Teen Psychologist** | Cut Spotlight, Ghost mechanic, Prediction Betting, Alliance/Betrayal. Designed Party Mode toggle. Flagged nickname filtering, positive-only cheers, and COPPA requirements. |
| **Technical Architect** | Identified question type refactor as critical foundation. Cut host voice broadcast (VoIP complexity). Validated 50-player capacity on current Fly.io infra. Ordered dependencies correctly. |
| **Game Balance Designer** | Inverted power-up economy (trailing players earn faster). Added scoring compression + momentum bonus. Designed blind commitment mechanic. Cut all player-targeted offensive power-ups. |

### Features Unanimously Cut (Will Not Work)

| Feature | Why |
|---|---|
| **Spotlight power-up** | Public humiliation mechanic. Weaponized for bullying. Zero strategic depth. |
| **Ghost sabotage** | Teaches spite. Dogpile dynamics. Punishes remaining players for succeeding. |
| **Prediction Betting** | Simulated gambling. Research links to real gambling behavior in teens. |
| **Alliance/Betrayal** | Rewards breaking social trust. Developmentally inappropriate for ages 8-14. |
| **XP/Leveling** | Creates visible hierarchy that discourages new/young players. |
| **Phone Gestures** | Accessibility barrier. Unreliable across devices. Dropped phones. |
| **Host Voice Broadcast** | Building VoIP from scratch. Enormous effort, host is usually in the room. |
| **Per-Player Adaptive Difficulty** | Different questions per player breaks the shared social experience. |

---

## Technical Architecture Notes

### New WebSocket Messages
```
USE_POWERUP, POWERUP_EFFECT, POWERUP_EARNED
EMOJI_REACTION, CHEER_SENT
CONFIDENCE_WAGER, WAGER_RESULT
CATEGORY_VOTE, CATEGORY_SELECTED
SUBMIT_BLUFF, BLUFF_REVEAL, BLUFF_VOTE
SPECTATOR_VOTE
BOSS_ATTACK, BOSS_DAMAGE, BOSS_DEFEATED
HEART_LOST, HEART_REGAINED, COMEBACK_START
```

### State Management
- Power-up inventory as part of player state (included in reconnection snapshots)
- Game mode as a strategy pattern configuration object on Room
- `roomSettings` object for Party/Competitive mode feature gates
- Achievement tracking: pub/sub event system on game events

### Database Schema Additions
- `users` table (profiles, auth — COPPA-compliant for under-13)
- `achievements` table (user_id, achievement_id, unlocked_at)
- `question_stats` table (per-question analytics, difficulty tracking)
- Expand `game_sessions` with mode, config, round info
- Content filter blocklist table

### Performance Targets
- Power-up effects: sub-100ms server processing
- Spectator broadcast: separate channel, lower update frequency
- 50+ player support: optimized leaderboard calculation, consider VM upgrade
- WebSocket compression for large player counts

### Critical Build Order
```
Question type refactor (0.5) → enables Epic 4
Party Mode toggle (0.2)     → gates all age-sensitive features
Fair scoring (0.3)           → independent, ship immediately
User accounts (5.1)          → gates all progression
Multi-round (6.2)            → required before any tournament features
Content filter (0.1)         → required before Fibbage
```

---

## Key Metrics

| Metric | Target | Why |
|---|---|---|
| Avg session length | >12 min (up from ~8) | Power-ups and modes increase engagement |
| Games per user per week | >3 | Progression drives repeat play |
| Power-up usage rate | >60% of earned | Validates the system is intuitive |
| Mode diversity | >40% of sessions use non-Classic modes | Variety is working |
| Completion rate | >85% of players finish the game | Nobody is rage-quitting or disengaging |
| Host satisfaction | >4/5 post-game rating | The host experience matters most for growth |

---

*Bazam should feel like the love child of Kahoot and Mario Party — a game where knowing the answer is great, but the real fun is what happens around the answer. Every feature in this roadmap was pressure-tested for one question: "Would this make an 8-year-old laugh AND a 16-year-old come back for more?"*
