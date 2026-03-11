# Bazam Solo Mode: "Quiz Meets Balatro"

## Product Vision

Turn trivia into a roguelike deckbuilder where knowledge is your superpower, strategy is your edge, and every run tells a different story. A single-player quiz experience so deep and replayable that players keep saying "one more run."

**Target Audience:** Ages 8-20
**Core Promise:** You're not just answering questions — you're building a knowledge engine.

---

## Expert Review Panel

| Expert | Role | Lens |
|--------|------|------|
| **Mara** | Game Designer | Core loop, systems, balance |
| **Joris** | UX/Juice Designer | Feel, feedback, onboarding |
| **Priya** | Roguelike Specialist | Run variety, replayability |
| **Daan** | Trivia/Quiz Expert | Question design, difficulty, categories |
| **Lena** | Child Development & Psychology | Age-appropriate design, cognitive load, motivation |
| **Suki** | Child Safety & Regulatory | COPPA, GDPR-K, dark pattern avoidance, app store compliance |
| **Kai** | Technical Architect | Feasibility, performance, data |

---

## Review Summary: What Changed and Why

### Things We Cut

| Cut | Reason | Expert |
|-----|--------|--------|
| **"Double or Nothing" Brain** | 50/50 point gambling is a simulated gambling mechanic. PEGI and ESRB flag this. Apple/Google may reject. Multiple EU countries have restrictions on gambling-like mechanics targeting minors. | Suki (7/7) |
| **Booster Packs** | Randomized paid loot boxes. Belgium banned them, Netherlands restricts them, EU is moving toward broader regulation. Even as an in-game-only mechanic, it trains loot box behavior. Replace with deterministic rewards. | Suki (7/7) |
| **Daily Login Tracking & Streaks** | Dark pattern targeting minors. UK Age Appropriate Design Code and proposed US KOSA legislation both call out streak mechanics as manipulative toward children. | Suki (7/7) |
| **Push Notifications** | Same regulatory concern. No push notifications for a game targeting 8-year-olds. | Suki (6/7) |
| **Social Brain** ("share to guilt a friend") | Social pressure mechanic targeting minors. Removed. | Suki, Lena (7/7) |
| **Ghost Rivals system** | Real-time competitive pressure against other players' ghosts creates anxiety, especially ages 8-12. Keep seed sharing for voluntary comparison instead. | Lena (5/7) |
| **Friend Activity Feed** | Social pressure. "Your friend just beat your score!" is toxic for younger players. | Lena (6/7) |
| **"Ego" Brain** | Name and concept (rewarding restraint through deprivation) is confusing for kids and poorly named. | Lena (5/7) |
| **Data Miner Brain** | Meta-gaming ("see what % got it right") undermines the knowledge-building goal. It's a crutch, not a strategy. | Daan (5/7) |
| **Cache Hit Brain** | Cross-run memory exploitation. Rewards repetition over learning. Confusing for younger players. | Daan, Lena (5/7) |
| **Question Author Mode** | Content moderation for user-generated content from minors is a massive liability. Would need age verification, review queues, and legal compliance. Not feasible. | Suki, Kai (7/7) |
| **Interest Mechanic** (as default) | Compound interest optimization is too abstract for ages 8-12. Moved to a Voucher unlock for older/experienced players only. | Lena (5/7) |
| **Spectral "Amnesia" card** | Destroying your entire deck is too punishing and confusing for younger players. One bad click = run ruined. | Lena, Mara (6/7) |
| **Monetization Expert role** | Replaced with Child Safety expert. For a game targeting minors, safety expertise is more important than engagement optimization. | Panel (7/7) |

### Terminology Changes

| Before (Poker) | After (Kid-Friendly) | Reason |
|----------------|---------------------|--------|
| Ante | **Level** | "Ante" is poker jargon. No 8-year-old knows what it means. |
| Small Blind | **Warm-Up Round** | "Blind" is poker-specific and potentially insensitive. |
| Big Blind | **Challenge Round** | Clear, descriptive, exciting. |
| Boss Blind | **Boss Round** | Keeps "Boss" (universally understood by kids from gaming). |
| $ (dollars) | **Sparks** (⚡) | Non-monetary in-game currency. Themed to the "brain/electricity" metaphor. No dollar signs in a kids' game. |

**Lena:** These aren't cosmetic changes. If an 8-year-old has to Google what an "ante" is before they can play, we've already lost them. Every term should be self-explanatory.

### Structure Changes

| Before | After | Reason |
|--------|-------|--------|
| 8 Antes, 3 blinds each | **8 Levels, 2 rounds + Boss** | 3 rounds per level was too long per cycle. 2 + Boss keeps the rhythm tighter — especially for younger attention spans. Total ~12-20 min per run. |
| Draw 7, play 5 | **Draw 5, play 3** (ages 8-12) / **Draw 7, play 5** (ages 13+) | Cognitive load. An 8-year-old evaluating 7 cards for combo potential while considering Brain synergies is too much. Offer both via difficulty selection. |
| 5★ difficulty scale | **3-tier difficulty: Bronze/Silver/Gold** | 5 stars is granular for no reason. 3 tiers maps cleanly to age bands and is easier to communicate visually. |
| 10 MVP Brains | **8 MVP Brains** | Removed gambling-adjacent Brains. 8 is enough to create synergies without overwhelming new players. |
| Booster Packs in shop | **Boss Rewards** | Beating a boss = choose 1 of 3 rewards (deterministic, no random purchase). Feels earned, not bought. |

### Things We Added

| Addition | Reason | Expert |
|----------|--------|--------|
| **Age Band Selection** | At first launch, pick your age band (8-10, 11-13, 14-16, 17-20). Affects question pool, terminology complexity, and default game mode. | Lena (7/7) |
| **Explorer Mode** (ages 8-12 default) | Draw 5 play 3, more generous scoring, Bazam mascot as guide, only 6 levels, "Learn More" popups after wrong answers. | Lena, Joris (7/7) |
| **Champion Mode** (ages 13+ default) | Draw 7 play 5, full 8 levels, all Brains available, tighter scoring. The "real" Balatro experience. | Mara, Priya (6/7) |
| **"Learn More" Moments** | After a wrong answer, optionally show a fun one-line fact about the correct answer. Turns failure into learning. Toggle-able for players who find it annoying. | Daan (7/7) |
| **Streak Shield Brain** (replaces Double or Nothing) | Protects your streak for one wrong answer per round. Strategic, not luck-based. No gambling. | Mara (6/7) |
| **Session Time Reminders** | After 30 min, gentle in-game nudge: "You've been playing for a while! Great job today." Not a hard lock — just awareness. Required by UK AADC. | Suki (7/7) |
| **Parental Dashboard** | View play time, categories practiced, learning stats. No in-game purchases to monitor (no IAP in MVP). | Suki (6/7) |

---

## Finalized Game Design

### Core Game Loop

```
┌─────────────────────────────────────────────────────────┐
│                    START NEW RUN                         │
│  Choose: Age Band → Mode (Explorer/Champion) → Deck     │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  LEVEL (1 of 6-8)                        │
│                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │  Warm-Up      │─▶│  Challenge    │─▶│    Boss     │  │
│  │  Round        │  │  Round        │  │  Round (+mod)│ │
│  │  (skip=bonus) │  │  (skip=bonus) │  │  (must play) │ │
│  └───────────────┘  └───────────────┘  └─────────────┘  │
│                                                          │
│  Each Round:                                             │
│  1. Draw category cards (5 in Explorer, 7 in Champion)   │
│  2. Pick which to play (3 in Explorer, 5 in Champion)    │
│  3. Answer questions (one per chosen category)           │
│  4. Watch score cascade with Brain multipliers           │
│  5. Hit the target score → advance. Miss → run ends.    │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   BOSS REWARD                            │
│  Choose 1 of 3 rewards: Brain / Consumable / Sparks     │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                     SHOP                                 │
│                                                          │
│  [Brain] [Brain] [Study Card] [Wildcard] [Voucher]      │
│                                                          │
│  Sell Brains | Buy | Reroll (5⚡, +1⚡ each time)        │
│  Manage deck: view categories, check combos              │
└──────────────────────┬──────────────────────────────────┘
                       ▼
              Next Level (repeat)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   RUN COMPLETE                           │
│                                                          │
│  Final Score | Learning Stats | Unlocks | Seed           │
│  [Share Score Card] [Play Again] [Daily Challenge]       │
└─────────────────────────────────────────────────────────┘
```

### Two Modes

| | Explorer Mode | Champion Mode |
|--|--------------|---------------|
| **Default for** | Ages 8-12 | Ages 13-20 |
| **Levels per run** | 6 | 8 |
| **Hand / Play** | Draw 5, play 3 | Draw 7, play 5 |
| **Questions per round** | 3 | 5 |
| **Brain slots** | 3 | 5 |
| **Scoring** | More generous targets | Tight targets, requires synergies |
| **Wrong answer** | "Learn More" shown by default | "Learn More" off by default |
| **Run length** | ~10-12 min | ~15-20 min |
| **Mascot guide** | Active — tips & encouragement | Hidden (can re-enable in settings) |
| **Difficulty tiers** | Bronze & Silver questions only | Bronze, Silver & Gold |
| **Combos required?** | No — combos are a bonus | Yes — later levels need combos to hit targets |

**Mara:** Both modes use the exact same underlying systems. Explorer just dials down the numbers. A player can switch modes any time. Progress/unlocks carry across both.

**Lena:** This is critical for the age range. An 8-year-old and a 17-year-old are at completely different cognitive stages. One-size-fits-all will either bore the teen or overwhelm the child.

### Scoring Formula

```
Question Score = Base Points × Category Multiplier × Brain Multipliers × Combo Bonus

Where:
  Base Points      = 100 (Bronze) / 250 (Silver) / 500 (Gold)
  Category Mult    = 1.0x (★) / 1.5x (★★) / 2.5x (★★★)
  Brain Mults      = Applied sequentially (each Brain's effect)
  Combo Bonus      = 1.0x (no combo) / 2.0x-3.0x (Knowledge Combo triggered)

Round Score = Sum of all Question Scores
Target Score must be met to pass the round.
```

**Change from v1:** Simplified from 5 star tiers to 3 (Bronze/Silver/Gold). The multiplier jumps are larger and easier to understand visually. A kid sees gold card = big points. Done.

### Category Deck

Your deck contains **Category Cards** with star levels (★ to ★★★). Higher stars = harder questions = more base points.

**8 MVP Categories:**

| Category | Why It Works for 8-20 |
|----------|----------------------|
| **Science & Nature** | Universal curiosity, scales from "what do bees make?" to "what's the half-life of Carbon-14?" |
| **History** | Stories, not dates — "who built the pyramids?" to "what triggered WW1?" |
| **Geography** | Visual (flags, maps), intuitive, globally relatable |
| **Film & TV** | Pixar for young, MCU/streaming for teens. Huge engagement. |
| **Music** | Universal. Can include audio clips in v1.1. |
| **Sports** | High engagement for the segment that cares, safe to skip for those who don't. |
| **Animals & Nature** | *Replaces Technology.* 8-year-olds are obsessed with animals. Universal appeal across the full age range. Far richer question variety for younger tiers. |
| **Gaming & Internet Culture** | *Replaces Food & Drink.* This audience lives online. Minecraft, Roblox, YouTube, memes. Massive engagement for 8-20. Food & Drink skews adult. |

**Panel vote on category changes:**

| Change | Votes | Argument |
|--------|-------|----------|
| Animals replacing Technology | 6/7 | Lena: "Technology questions for 8-year-olds are either trivially easy or impossibly hard. Animals are rich at every difficulty level." |
| Gaming replacing Food & Drink | 5/7 | Daan: "Ask a 10-year-old about Minecraft and their eyes light up. Ask them about cuisine and they shrug. We're serving this audience." |

**Reserve for v1.1:** Technology, Food & Drink, Literature, Art, Math & Logic, Mythology

### Brains (8 MVP)

| # | Brain | Rarity | Effect | Notes |
|---|-------|--------|--------|-------|
| 1 | **Streak Engine** | Common | +0.5x mult per consecutive correct answer (resets on wrong) | Core Balatro feel. Easy to understand: "keep getting them right, score goes up." |
| 2 | **Snowball** | Uncommon | +0.2x permanent mult per correct answer in the entire run | Long-term satisfaction. Visually satisfying as the number grows. |
| 3 | **Speed Star** | Common | +3x mult if answered in under 5 seconds | *Renamed from Speed Demon.* Skill expression. Timer NOT halved (that was too punishing for young players). Just a bonus for fast answers. |
| 4 | **Specialist** | Uncommon | Choose 1 category: +3x mult for that category | *Removed the -1x penalty on other categories.* Penalty mechanics frustrate young players. Pure upside, still creates build identity. |
| 5 | **All-Rounder** | Common | +1x mult for each different category answered correctly this round | Counterpart to Specialist. Rewards variety. |
| 6 | **Helping Hand** | Common | Eliminate 1 wrong answer per question | *Renamed from Educated Guess.* More intuitive name for kids. Most accessible Brain — great safety net. |
| 7 | **Streak Shield** | Uncommon | Your streak survives one wrong answer per round (then breaks on the next) | *Replaces Double or Nothing.* Strategic protection instead of gambling. Do you rely on the shield early or save it? |
| 8 | **Study Buddy** | Common | After a wrong answer, see the correct answer AND next question in that category gets +1x mult | Learning mechanic. Wrong answers become investments. The best Brain for younger players. |

**Cut from MVP with reasoning:**

| Brain | Why Cut |
|-------|---------|
| Adrenaline Rush ("answer in last 25% of timer") | Encourages running down the clock, which looks like disengagement. Also frustrating for younger players who just need more time. |
| Comeback Kid | "Below 50% target with 2 questions left" is a very specific conditional that young players won't plan around. Feels random when it triggers. Add in v1.1. |
| Double or Nothing | Gambling mechanic. Replaced by Streak Shield. |

### Boss Round Modifiers (8 MVP)

| Boss | Effect | Age-Appropriate? | Notes |
|------|--------|-------------------|-------|
| **Blackout** | Answer options hidden for 2s, then revealed | Yes | Builds anticipation. 8-year-olds find this exciting, not stressful. |
| **Time Crunch** | Timer reduced by 30% | Yes (adjusted) | *Changed from 50% to 30%.* Half timer was too punishing for younger players. |
| **The Scrambler** | Answer positions shuffle every 2 seconds | Yes | Fun visual chaos. Teaches reading carefully under mild pressure. |
| **Fog of War** | One answer option is hidden | Yes | Reduces from 4 to 3 options. Actually makes it slightly easier — but feels harder. Great design. |
| **The Taxman** | Lose 2⚡ for every wrong answer | Yes (adjusted) | *Changed from $2 to 2⚡.* Economy impact is real but not devastating. |
| **Silent Treatment** | No right/wrong feedback until end of round | Yes | Unanimously voted most interesting. Forces trust in your own knowledge. |
| **The Trickster** | Two answer options are worded to seem equally correct | Yes | *Renamed from The Debater.* Tests careful reading. Great for older players, only appears at Level 4+ for Explorer mode. |
| **Flip** | Questions are displayed with scrambled word order | Yes (13+ only) | *Renamed from Mirror.* Only appears in Champion mode. Too reading-intensive for 8-year-olds. |

**Cut:**
- **Amnesia** (Brains hidden) — Confusing name, frustrating mechanic for kids who are still learning what their Brains do.
- **Lockout** (category banned on wrong answer) — Too punishing. Removes player agency.
- **The Minimizer** (Brains give half effect) — Abstract. Young players can't calculate what "half of +0.5x per streak" means.

### Knowledge Combos

When you answer questions from specific category combinations in the same round, you trigger a **Knowledge Combo** — a bonus multiplier with a fun name.

| Combo | Categories | Bonus | Flavor Text |
|-------|-----------|-------|-------------|
| **Nature Explorer** | Science + Animals + Geography | +3x | "You know this planet inside out!" |
| **Blockbuster** | Film + Music + Gaming | +2x | "Main character energy!" |
| **Time Traveler** | History + Geography + Science | +2x | "Past, present, future — you've got it all!" |
| **Pop Star** | Film + Music + Sports | +2x | "Trending worldwide!" |
| **Wild Safari** | Animals + Geography + Sports | +2x | "Adventure awaits!" |
| **Full House** | Any 5 different categories (Champion only) | +4x | "A true know-it-all!" |

**Panel note:** Combos only require categories to be *played and answered correctly* — not just played. This is the skill check. You need to actually know the answers, not just pick the right cards.

**Mara:** In Explorer mode (play 3 cards), combos are 2-category pairs instead of 3-category sets. Easier to trigger, keeps the dopamine flowing.

| Explorer Combo | Categories | Bonus |
|----------------|-----------|-------|
| **Lab Partners** | Science + Animals | +2x |
| **World Tour** | Geography + History | +2x |
| **Screen Time** | Film + Gaming | +2x |
| **Rockstar** | Music + Sports | +2x |

### The Shop

Between levels, visit the shop.

**Shop Layout:**
- **2 Brain slots** — Buy new Brains
- **2 Consumable slots** — Study Cards or Wildcards
- **1 Voucher slot** — Persistent run upgrade

**Study Cards** (level up a category):
- "Field Guide" — Level up Animals by 1 star
- "History Book" — Level up History by 1 star
- One exists per category. Found in shops and Boss Rewards.

**Wildcards** (modify your category deck):
- **Add** — Add a new category to your deck
- **Remove** — Remove a category card from your deck
- **Copy** — Duplicate a category card (draw it more often)
- **Swap** — Change one category into another random one

**Vouchers** (persistent run upgrades):
- **Extra Time** — +5 seconds to all timers
- **Bargain Hunter** — All shop items cost 1⚡ less
- **Spark Saver** — Earn 1⚡ interest per 5⚡ held at end of each level (max 3⚡). *(The interest mechanic, gated behind a Voucher so only experienced players encounter it.)*
- **Big Hand** — Draw 1 extra category card each round
- **Free Spin** — First reroll per shop is free
- **Brain Boost** — +1 Brain slot

**Boss Rewards** (replaces Booster Packs):
After beating a Boss Round, choose 1 of 3 rewards:
- A specific Brain (shown face-up, you know what you're getting)
- A Study Card for a random category
- A Sparks bonus (8-15⚡)

**Suki:** This is the critical change from the original plan. No randomized purchases. Every reward is earned and every choice is informed. The player always knows what they're getting before they choose. This avoids loot box regulations entirely.

### Economy

| Source | Sparks (⚡) |
|--------|------------|
| Correct answer | 1-3⚡ (based on difficulty) |
| Speed bonus (answered in < 5s) | +1⚡ |
| Streak bonus (3+ streak) | +1⚡ |
| Beating a round | 3⚡ (warm-up), 4⚡ (challenge), 5⚡ (boss) |
| Skipping a round | Tag reward (specific bonus item) |

| Cost | Sparks (⚡) |
|------|------------|
| Brain (common) | 4-6⚡ |
| Brain (uncommon) | 7-9⚡ |
| Consumable | 2-4⚡ |
| Voucher | 8-10⚡ |
| Reroll shop | 5⚡ (+1⚡ each reroll) |
| Sell a Brain | Half purchase price |

### Difficulty Scaling

**Explorer Mode (6 levels):**

| Level | Question Tier | Target (Warm-Up / Challenge / Boss) |
|-------|--------------|--------------------------------------|
| 1 | Bronze | 200 / 350 / 500 |
| 2 | Bronze | 350 / 600 / 900 |
| 3 | Bronze-Silver | 600 / 1,000 / 1,500 |
| 4 | Silver | 1,000 / 1,800 / 2,800 |
| 5 | Silver | 1,800 / 3,000 / 5,000 |
| 6 | Silver | 3,000 / — / 8,000 (final boss) |

**Champion Mode (8 levels):**

| Level | Question Tier | Target (Warm-Up / Challenge / Boss) |
|-------|--------------|--------------------------------------|
| 1 | Bronze | 300 / 500 / 800 |
| 2 | Bronze-Silver | 500 / 800 / 1,200 |
| 3 | Silver | 800 / 1,300 / 2,000 |
| 4 | Silver | 1,200 / 2,000 / 3,500 |
| 5 | Silver-Gold | 2,000 / 3,500 / 6,000 |
| 6 | Gold | 3,500 / 6,000 / 10,000 |
| 7 | Gold | 6,000 / 10,000 / 18,000 |
| 8 | Gold | 10,000 / — / 30,000 (double boss modifier) |

### Age-Adaptive Questions

Questions are tagged with both a **difficulty tier** (Bronze/Silver/Gold) and an **age band** (8-10, 11-13, 14-16, 17-20).

| | Bronze | Silver | Gold |
|--|--------|--------|------|
| **8-10** | "What sound does a cat make?" | "How many legs does a spider have?" | "What is the largest ocean?" |
| **11-13** | "What planet is closest to the sun?" | "In which country are the pyramids?" | "What gas do plants absorb?" |
| **14-16** | "Who painted the Mona Lisa?" | "What year did WW2 end?" | "What is the chemical formula for water?" |
| **17-20** | "Which organ produces insulin?" | "Who wrote '1984'?" | "What is the half-life of Carbon-14?" |

**Daan:** This is the biggest content investment but it's non-negotiable. A quiz game where an 8-year-old faces questions meant for a 17-year-old is just frustrating — and vice versa. The age band doesn't change the game mechanics, just the question pool.

### Meta-Progression (Across Runs)

**Principle (Priya):** Unlocks add variety, never power. Every run starts equal. You can always win with skill.

**Unlockable Brains (10 post-MVP):**

| Unlock Condition | Brain Unlocked |
|------------------|----------------|
| Win a run | **Victory Lap** — First question of each round gives double points |
| Win without buying any Brains | **Natural Talent** — Base points +50% |
| Get a 10-streak | **On Fire** — +1x mult per streak (upgrade of Streak Engine) |
| Beat every Boss type at least once | **Boss Slayer** — +2x mult during Boss Rounds |
| Answer 100 Gold questions correctly (lifetime) | **Gold Standard** — Gold questions give +2x additional mult |
| Complete a run in under 10 minutes | **Speedrunner** — +3x mult if full round completed in under 60s |
| Use all 8 categories in a single run | **Generalist** — All combos give +1x extra bonus |
| Win with only 1 Brain equipped | **Minimalist** — Your single Brain's effect is tripled |
| Answer 50 Animals questions correctly (lifetime) | **Zookeeper** — Animals category always at ★★★ |
| Complete 3 Daily Challenges | **Regular** — Start every run with +3⚡ |

**Starter Decks (unlocked progressively):**

| Deck | Unlock | Effect |
|------|--------|--------|
| **Standard** | Default | Balanced mix of all categories |
| **Nature Deck** | Win 3 runs | Heavy on Science + Animals. Start with Study Buddy. |
| **Pop Culture Deck** | Answer 200 Film/Music/Gaming questions | Heavy on Film + Music + Gaming. Start with +5⚡. |
| **Speed Deck** | Win a run in under 12 minutes | -3 seconds on all timers. Start with Speed Star Brain. |
| **Challenge Deck** | Win on Champion Mode | All bosses have 2 modifiers. Start with a random Uncommon Brain. |

**Collection:**
- Track all discovered Brains (found/not found), Boss types (beaten/not beaten), Combos (triggered/not triggered)
- Completion percentage visible on profile
- No gameplay rewards for completion — it's intrinsic motivation

### Daily & Weekly Challenges

- **Daily Challenge** — Same seed for all players in same age band. One attempt per day. Score goes on a leaderboard.
- **Weekly Challenge** — Fixed seed + specific modifiers (e.g., "All bosses are Scramblers this week"). Global leaderboard.
- **Shareable Score Cards** — Spoiler-free image: score, level reached, Brains used, seed code. Can be shared to classmates/friends.

**Suki:** No "beat your friends" framing. The share card says "I scored 24,000 — can you beat this seed?" It's a challenge, not a social hierarchy.

---

## Development Roadmap

### Phase 0: Foundation (2 weeks)

> **Goal:** Core run loop playable end-to-end with placeholder content.

#### Epic 0.1: Run Infrastructure
| Story | Pts | Description |
|-------|-----|-------------|
| 0.1.1 | 3 | Create `RunState` model — current level, round, score, economy, deck, brains, mode (Explorer/Champion), age band |
| 0.1.2 | 2 | Implement run lifecycle: start → level → rounds → boss reward → shop → next level → end |
| 0.1.3 | 3 | Implement category deck system — draw/select/discard (configurable for Explorer 5/3 and Champion 7/5) |
| 0.1.4 | 2 | Implement round target score system with pass/fail |
| 0.1.5 | 3 | Create seed-based RNG for deterministic runs |
| 0.1.6 | 2 | Implement level progression (6 or 8 levels based on mode, targets per difficulty table) |

#### Epic 0.2: Question Engine
| Story | Pts | Description |
|-------|-----|-------------|
| 0.2.1 | 3 | Design question data model: category, difficulty (Bronze/Silver/Gold), age band, type, text, options, correct, metadata, "learn more" fact |
| 0.2.2 | 8 | Build initial question pool — 40 questions × 8 categories × 3 difficulties × 4 age bands. Aim for 800 seed questions, accept shared overlap between adjacent age bands |
| 0.2.3 | 3 | Question selection: given category + difficulty + age band, pick random unseen question |
| 0.2.4 | 2 | Answer validation with timing capture |
| 0.2.5 | 2 | Question deduplication per run |

#### Epic 0.3: Scoring Engine
| Story | Pts | Description |
|-------|-----|-------------|
| 0.3.1 | 3 | Base scoring formula: base points × category mult |
| 0.3.2 | 5 | Brain modifier pipeline — sequential application of effects |
| 0.3.3 | 3 | Knowledge Combo detection — check played categories against combo table (2-cat for Explorer, 3-cat for Champion) |
| 0.3.4 | 2 | Streak tracking (consecutive correct answers) |
| 0.3.5 | 2 | Economy: earn Sparks per answer and per round completion |

---

### Phase 1: Core Experience (3 weeks)

> **Goal:** Full game with 8 Brains, 8 bosses, shop, and polished question flow.

#### Epic 1.1: Brain System
| Story | Pts | Description |
|-------|-----|-------------|
| 1.1.1 | 5 | Brain data model: name, rarity, description, effect function, icon |
| 1.1.2 | 5 | Implement 8 MVP Brains with effects and edge cases |
| 1.1.3 | 2 | Brain slots (3 in Explorer, 5 in Champion) with add/remove/sell |
| 1.1.4 | 3 | Brain rarity tiers: Common, Uncommon — affects shop pricing and spawn rates |
| 1.1.5 | 2 | Brain combination tests — verify all Brains work correctly together |

#### Epic 1.2: Boss Rounds
| Story | Pts | Description |
|-------|-----|-------------|
| 1.2.1 | 3 | Boss modifier framework — modifiers that alter question presentation or scoring rules |
| 1.2.2 | 5 | Implement 8 Boss modifiers (Blackout, Time Crunch, Scrambler, Fog of War, Taxman, Silent Treatment, Trickster, Flip) |
| 1.2.3 | 2 | Boss assignment per level (deterministic per seed, no repeats). Flip only in Champion. Trickster only at Level 4+. |
| 1.2.4 | 2 | Final level double-modifier boss (Champion mode only) |

#### Epic 1.3: Shop & Rewards
| Story | Pts | Description |
|-------|-----|-------------|
| 1.3.1 | 3 | Shop generation — seed-based item selection per visit |
| 1.3.2 | 3 | Shop UI — browse, buy, sell, reroll |
| 1.3.3 | 3 | Study Cards (category star level up) |
| 1.3.4 | 3 | Wildcards (add/remove/copy/swap categories) |
| 1.3.5 | 3 | Vouchers (6 types, max 1 per shop) |
| 1.3.6 | 3 | Boss Reward screen — choose 1 of 3 shown rewards after boss |
| 1.3.7 | 2 | Sell mechanic — sell Brains for half purchase price |

#### Epic 1.4: Question Flow UI
| Story | Pts | Description |
|-------|-----|-------------|
| 1.4.1 | 5 | Category selection screen — drawn cards, pick to play, combo preview |
| 1.4.2 | 3 | Question screen — category badge, timer, answer options, Brain indicators |
| 1.4.3 | 3 | Answer feedback — correct/wrong animation. "Learn More" expandable fact on wrong answer. |
| 1.4.4 | 2 | Timer with configurable duration per difficulty and mode |
| 1.4.5 | 3 | Round summary — score vs target, pass/fail, per-question breakdown |

---

### Phase 2: Juice & Feel (2 weeks)

> **Goal:** Make it feel incredible. The game feel IS the game.

#### Epic 2.1: Score Cascade
| Story | Pts | Description |
|-------|-----|-------------|
| 2.1.1 | 5 | Sequential scoring animation — base → category mult → each Brain triggers with delay and sound |
| 2.1.2 | 3 | Screen shake on multiplier (intensity scales with mult value). Respects `prefers-reduced-motion`. |
| 2.1.3 | 3 | Particle effects on correct answer — category-themed colors |
| 2.1.4 | 2 | Score counter "rolling number" animation |
| 2.1.5 | 3 | Knowledge Combo announcement — special animation + combo name |
| 2.1.6 | 2 | Progress bar toward round target — smooth fill with overshoot bounce |

#### Epic 2.2: Audio
| Story | Pts | Description |
|-------|-----|-------------|
| 2.2.1 | 3 | Correct answer sound (pitch increases with streak) |
| 2.2.2 | 3 | Multiplier trigger sounds (unique per Brain, escalating) |
| 2.2.3 | 2 | Wrong answer sound (gentle, never punishing — important for 8-year-olds) |
| 2.2.4 | 3 | Shop ambience — chill, contemplative |
| 2.2.5 | 2 | Boss round intro sting |
| 2.2.6 | 2 | Victory/defeat jingles |

#### Epic 2.3: Visual Polish
| Story | Pts | Description |
|-------|-----|-------------|
| 2.3.1 | 3 | Brain card art — each Brain has a distinct, friendly illustration |
| 2.3.2 | 3 | Category card art — vibrant, instantly recognizable per category |
| 2.3.3 | 2 | Boss round visual treatment — screen tint, animated border per boss type |
| 2.3.4 | 3 | Shop visual design — inviting, themed |
| 2.3.5 | 2 | Level progress map — see your path through levels, current position |
| 2.3.6 | 2 | Card hover/selection micro-interactions — tilt, glow, satisfying tap |

---

### Phase 3: Onboarding & Accessibility (2 weeks)

> **Goal:** Any 8-year-old can pick this up and understand it within one run. Moved up from Phase 6 — this is not polish, it's core for this audience.

#### Epic 3.1: Onboarding
| Story | Pts | Description |
|-------|-----|-------------|
| 3.1.1 | 3 | Age band selection screen at first launch (8-10, 11-13, 14-16, 17-20) |
| 3.1.2 | 5 | Tutorial run — guided first run (Explorer mode) with Bazam mascot explaining each step. Simplified: only 3 Brains offered, guaranteed Helping Hand in first shop. |
| 3.1.3 | 3 | "What's this?" — long-press/hover any card, Brain, or modifier for an explanation tooltip |
| 3.1.4 | 2 | Combo preview — when selecting categories, highlight which combos are possible |
| 3.1.5 | 2 | Brain effect preview — before buying a Brain, show an example of how it changes scoring |

#### Epic 3.2: Accessibility
| Story | Pts | Description |
|-------|-----|-------------|
| 3.2.1 | 3 | Full keyboard + gamepad navigation |
| 3.2.2 | 2 | Color-blind mode — pattern/shape differentiation, not just color |
| 3.2.3 | 2 | Reduced motion mode — disable shake, simplify animations (respect OS setting by default) |
| 3.2.4 | 2 | Screen reader support for all game elements |
| 3.2.5 | 2 | Dyslexia-friendly font toggle (OpenDyslexic or similar) |
| 3.2.6 | 2 | Text size options — important for younger readers |

#### Epic 3.3: Child Safety
| Story | Pts | Description |
|-------|-----|-------------|
| 3.3.1 | 3 | Session time awareness — gentle in-game nudge after 30 min ("Great session! Take a break?"). Not a lock. |
| 3.3.2 | 3 | Parental dashboard — view play time, categories practiced, accuracy stats per category |
| 3.3.3 | 2 | No external links from within the game |
| 3.3.4 | 2 | Share cards are pre-rendered images only — no links to user profiles or social accounts |

---

### Phase 4: Meta & Replayability (2 weeks)

> **Goal:** Unlocks, daily challenges, collection.

#### Epic 4.1: Unlock System
| Story | Pts | Description |
|-------|-----|-------------|
| 4.1.1 | 3 | Unlock condition framework — track milestones per run and lifetime |
| 4.1.2 | 3 | 10 unlockable Brains with conditions |
| 4.1.3 | 3 | 4 Starter Decks with unlock conditions |
| 4.1.4 | 2 | Unlock celebration animation |
| 4.1.5 | 2 | Player profile — total runs, wins, best scores, favorite category |

#### Epic 4.2: Daily & Weekly Challenges
| Story | Pts | Description |
|-------|-----|-------------|
| 4.2.1 | 3 | Daily seed generation per age band |
| 4.2.2 | 3 | Daily challenge mode — one attempt per day |
| 4.2.3 | 3 | Leaderboard (score-based, per age band — never cross-age competition) |
| 4.2.4 | 3 | Weekly challenge — fixed seed + modifier set |
| 4.2.5 | 3 | Shareable score cards — pre-rendered image with score, level, Brains, seed code |

#### Epic 4.3: Collection
| Story | Pts | Description |
|-------|-----|-------------|
| 4.3.1 | 3 | Collection screen — all Brains (found/not found), rarity, effects |
| 4.3.2 | 2 | Boss gallery — all boss types encountered, win rate |
| 4.3.3 | 2 | Combo codex — discovered combos |
| 4.3.4 | 2 | Stats dashboard — accuracy per category, streaks, totals |
| 4.3.5 | 2 | Completion percentage tracker |

---

### Phase 5: Content Expansion (3 weeks)

> **Goal:** More depth. New categories, new Brains, Brain Lab.

#### Epic 5.1: Brain Lab (Fusion)
| Story | Pts | Description |
|-------|-----|-------------|
| 5.1.1 | 3 | Brain Lab unlocks after beating Level 4 in Champion mode |
| 5.1.2 | 5 | Fusion system — combine 2 Brains into a new unique Brain |
| 5.1.3 | 5 | 8 fusion Brains with unique effects |
| 5.1.4 | 3 | Hidden fusion recipes — discovered through experimentation |
| 5.1.5 | 2 | Brain Lab UI with fusion animation |

| Brain 1 | Brain 2 | Fusion Result |
|---------|---------|---------------|
| Streak Engine | Speed Star | **Hyperdrive** — +1x per streak, doubled if answered fast |
| Specialist | All-Rounder | **Shapeshifter** — +3x for your most-answered category this round |
| Helping Hand | Study Buddy | **Professor** — Eliminate 2 wrong answers + see a hint |
| Streak Shield | Snowball | **Fortress** — Streak never breaks, but Snowball grows at half rate |
| Speed Star | All-Rounder | **Blitz** — +0.5x for each question answered under 5s this round |
| Study Buddy | Specialist | **Apprentice** — Wrong answers in your specialist category still give half points |
| Streak Engine | Snowball | **Avalanche** — Streak bonus is permanent (like Snowball) but only +0.1x per correct |
| Helping Hand | Streak Shield | **Safety Net** — Eliminate 1 wrong answer AND survive 1 wrong answer per round |

#### Epic 5.2: Category Expansion
| Story | Pts | Description |
|-------|-----|-------------|
| 5.2.1 | 5 | Add 4 new categories: Technology, Food & Drink, Math & Logic, Mythology |
| 5.2.2 | 8 | Content: 40 questions × 4 categories × 3 difficulties × 4 age bands (shared overlap) |
| 5.2.3 | 3 | New Knowledge Combos for expanded categories |

#### Epic 5.3: Advanced Content
| Story | Pts | Description |
|-------|-----|-------------|
| 5.3.1 | 5 | 8 additional Brains (Comeback Kid, Slow & Steady, Perfectionist, Zen Master, Phoenix, Polymath, Chaos Theory, Binary Brain) |
| 5.3.2 | 3 | Rare rarity tier for Brains |
| 5.3.3 | 3 | 4 new Boss modifiers |
| 5.3.4 | 2 | Balance pass — playtest all Brain/Boss interactions across both modes |

---

### Phase 6: Social & Seed Sharing (2 weeks)

> **Goal:** Share-friendly features without social pressure.

#### Epic 6.1: Seed System
| Story | Pts | Description |
|-------|-----|-------------|
| 6.1.1 | 2 | Generate shareable seed codes per run |
| 6.1.2 | 2 | "Play this seed" — enter a code to replay someone else's run |
| 6.1.3 | 3 | Seed comparison — after both complete a seed, compare builds and scores |
| 6.1.4 | 3 | Enhanced share cards — visual summary with seed code |

#### Epic 6.2: Classroom Mode
| Story | Pts | Description |
|-------|-----|-------------|
| 6.2.1 | 3 | Teacher dashboard — generate a seed, assign to a class, view all results |
| 6.2.2 | 3 | Class leaderboard (opt-in, teacher-controlled) |
| 6.2.3 | 2 | Category filter — teacher can restrict which categories appear |
| 6.2.4 | 2 | Export learning stats as CSV |

**Daan:** Classroom Mode is the sleeper feature. If teachers adopt this, it drives organic growth through schools. A quiz roguelike that teachers actively encourage kids to play is the dream.

**Suki:** Classroom Mode also gives us a clean distribution channel that doesn't require social media accounts or contact list access from minors.

#### Epic 6.3: Performance & Infrastructure
| Story | Pts | Description |
|-------|-----|-------------|
| 6.3.1 | 3 | Offline support — runs playable offline, synced on reconnect |
| 6.3.2 | 3 | Save/resume — save run state mid-run, continue later |
| 6.3.3 | 2 | Analytics — question difficulty calibration data (aggregate, anonymized) |
| 6.3.4 | 2 | Leaderboard score verification (server-side) |

---

## Summary Timeline

| Phase | Duration | Focus | Key Deliverable |
|-------|----------|-------|-----------------|
| **Phase 0** | 2 weeks | Foundation | Playable run loop |
| **Phase 1** | 3 weeks | Core Experience | Full game: 8 Brains, 8 bosses, shop |
| **Phase 2** | 2 weeks | Juice & Feel | Score cascades, audio, visual polish |
| **Phase 3** | 2 weeks | Onboarding & Safety | Tutorial, a11y, child safety, age bands |
| **Phase 4** | 2 weeks | Meta & Replayability | Unlocks, dailies, collection |
| **Phase 5** | 3 weeks | Content Expansion | Brain Lab, 4 categories, 8 Brains |
| **Phase 6** | 2 weeks | Social & Classroom | Seed sharing, classroom mode, infrastructure |
| **Total** | **~16 weeks** | | |

---

## Appendix A: Brain Quick Reference (MVP)

| # | Brain | Rarity | Effect |
|---|-------|--------|--------|
| 1 | Streak Engine | Common | +0.5x mult per consecutive correct |
| 2 | Snowball | Uncommon | +0.2x permanent mult per correct (whole run) |
| 3 | Speed Star | Common | +3x mult if answered in under 5 seconds |
| 4 | Specialist | Uncommon | Choose 1 category: +3x mult |
| 5 | All-Rounder | Common | +1x per unique category answered this round |
| 6 | Helping Hand | Common | Eliminate 1 wrong answer per question |
| 7 | Streak Shield | Uncommon | Streak survives 1 wrong answer per round |
| 8 | Study Buddy | Common | See correct answer on wrong + next attempt at that category +1x |

## Appendix B: Content Requirements

**MVP (Phase 0-1):**

| Category | Bronze | Silver | Gold | Per Age Band | Total (shared overlap) |
|----------|--------|--------|------|-------------|----------------------|
| Science & Nature | 30 | 30 | 30 | ~60 unique per band | ~120 |
| History | 30 | 30 | 30 | ~60 | ~120 |
| Geography | 30 | 30 | 30 | ~60 | ~120 |
| Film & TV | 30 | 30 | 30 | ~60 | ~120 |
| Music | 30 | 30 | 30 | ~60 | ~120 |
| Sports | 30 | 30 | 30 | ~60 | ~120 |
| Animals & Nature | 30 | 30 | 30 | ~60 | ~120 |
| Gaming & Internet | 30 | 30 | 30 | ~60 | ~120 |
| **MVP Total** | | | | | **~960** |

**Phase 5 (+4 categories):** ~480 additional questions
**Grand Total:** ~1,440 questions

*Note: Adjacent age bands share ~40% of questions (e.g., an 11-13 Silver question often works for 14-16 Bronze). Actual unique questions needed is lower than the raw matrix suggests.*

## Appendix C: Regulatory Compliance Checklist

| Regulation | Status | Notes |
|-----------|--------|-------|
| **COPPA** (US, under 13) | Addressed | No personal data collection from children. No social features requiring accounts for under-13. Parental dashboard. |
| **GDPR-K** (EU, under 16) | Addressed | Age band selection. Minimal data. No behavioral targeting. |
| **UK AADC** (Age Appropriate Design Code) | Addressed | Session time nudges. No dark patterns. No urgency mechanics. No loot boxes. |
| **Apple App Store (kids category)** | Addressed | No gambling mechanics. No external links. No ads. No data collection. |
| **Google Play (Families)** | Addressed | Same as Apple. Teacher-approved content potential. |
| **Belgium/Netherlands loot box laws** | Addressed | No randomized paid purchases. Boss Rewards are earned, deterministic. |
| **PEGI/ESRB rating** | Target: PEGI 3 / ESRB E | No violence, no gambling, no fear-inducing content. Competitive elements are optional. |
