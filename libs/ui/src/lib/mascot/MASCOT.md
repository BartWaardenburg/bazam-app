# Bazam Buddy — Mascot Design Document

The Bazam Buddy is the app's cartoony mascot character: a friendly, round red blob with oversized eyes and a "?" badge. It appears throughout the app to add personality, guide users, and reinforce the quiz theme.

---

## 1. Anatomy

```
                    ┌──────────┐
                    │  ? badge │  ← Yellow accent circle, Bangers font
                    └────┬─────┘
                         │
        ┌────────────────┴────────────────┐
        │           BODY                  │
        │  ┌─────┐          ┌─────┐       │
        │  │ EYE │          │ EYE │       │  ← White ellipses, black pupils
        │  │ ●   │          │ ●   │       │     with highlight dots
        │  └─────┘          └─────┘       │
        │       (blush)  (blush)          │  ← Rosy cheek circles
        │          ╰──smile──╯            │  ← Quadratic bezier curve
        └─────────────────────────────────┘
                    │ shadow │                ← 3px offset, comic-style
```

### SVG Reference (viewBox `0 0 100 100`)

All coordinates below are for a normalized 100x100 viewBox. Scale uniformly to any target size.

| Part | Element | Position | Size | Fill | Stroke |
|------|---------|----------|------|------|--------|
| **Body shadow** | `ellipse` | cx=53 cy=55 | rx=36 ry=30 | `--bzm-black` @ 18% | — |
| **Body** | `ellipse` | cx=50 cy=52 | rx=34 ry=28 | `--bzm-color-primary` | `--bzm-black` 4px |
| **Left cheek** | `circle` | cx=22 cy=56 | r=6 | `--bzm-red-200` @ 55% | — |
| **Right cheek** | `circle` | cx=78 cy=56 | r=6 | `--bzm-red-200` @ 55% | — |
| **Left eye white** | `ellipse` | cx=38 cy=44 | rx=11 ry=12 | `--bzm-white` | `--bzm-black` 2.5px |
| **Left pupil** | `circle` | cx=40 cy=46 | r=5 | `--bzm-black` | — |
| **Left highlight** | `circle` | cx=36 cy=41 | r=2.5 | `--bzm-white` | — |
| **Left highlight sm** | `circle` | cx=42 cy=40 | r=1.2 | `--bzm-white` @ 60% | — |
| **Right eye white** | `ellipse` | cx=62 cy=44 | rx=11 ry=12 | `--bzm-white` | `--bzm-black` 2.5px |
| **Right pupil** | `circle` | cx=64 cy=46 | r=5 | `--bzm-black` | — |
| **Right highlight** | `circle` | cx=60 cy=41 | r=2.5 | `--bzm-white` | — |
| **Right highlight sm** | `circle` | cx=66 cy=40 | r=1.2 | `--bzm-white` @ 60% | — |
| **Smile** | `path` | M38 62 Q50 72 62 62 | — | none | `--bzm-black` 2.5px round |
| **Badge shadow** | `circle` | cx=77 cy=28 | r=13 | `--bzm-black` @ 18% | — |
| **Badge** | `circle` | cx=75 cy=26 | r=12 | `--bzm-color-accent` | `--bzm-black` 2.5px |
| **Badge "?"** | `text` | x=75 y=31 | 16px | `--bzm-black` | — |

### SVG Template (copy-paste ready)

```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Body shadow -->
  <ellipse cx="53" cy="55" rx="36" ry="30" fill="var(--bzm-black)" opacity="0.18"/>
  <!-- Body -->
  <ellipse cx="50" cy="52" rx="34" ry="28"
    fill="var(--bzm-color-primary)" stroke="var(--bzm-black)" stroke-width="4"/>
  <!-- Cheeks -->
  <circle cx="22" cy="56" r="6" fill="var(--bzm-red-200)" opacity="0.55"/>
  <circle cx="78" cy="56" r="6" fill="var(--bzm-red-200)" opacity="0.55"/>
  <!-- Left eye -->
  <ellipse cx="38" cy="44" rx="11" ry="12"
    fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
  <circle cx="40" cy="46" r="5" fill="var(--bzm-black)"/>
  <circle cx="36" cy="41" r="2.5" fill="var(--bzm-white)"/>
  <circle cx="42" cy="40" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>
  <!-- Right eye -->
  <ellipse cx="62" cy="44" rx="11" ry="12"
    fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
  <circle cx="64" cy="46" r="5" fill="var(--bzm-black)"/>
  <circle cx="60" cy="41" r="2.5" fill="var(--bzm-white)"/>
  <circle cx="66" cy="40" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>
  <!-- Smile -->
  <path d="M38 62 Q50 72 62 62"
    fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Badge -->
  <circle cx="77" cy="28" r="13" fill="var(--bzm-black)" opacity="0.18"/>
  <circle cx="75" cy="26" r="12"
    fill="var(--bzm-color-accent)" stroke="var(--bzm-black)" stroke-width="2.5"/>
  <text x="75" y="31" text-anchor="middle"
    style="font-family: var(--bzm-font-heading); font-size: 16px;"
    fill="var(--bzm-black)">?</text>
</svg>
```

---

## 2. Expressions

The mascot's emotion is communicated through **eyes**, **mouth**, and **badge text**. The body shape stays the same.

| Expression | Eyes | Mouth | Badge | Use case |
|------------|------|-------|-------|----------|
| **Neutral / Thinking** | Pupils center | Gentle smile curve | `?` | Loading, waiting, idle |
| **Happy / Correct** | Pupils up, squeezed shut (arcs) | Wide open smile (fill white) | `!` | Correct answer, success |
| **Sad / Incorrect** | Pupils down, slightly smaller | Frown (inverted curve) | `X` | Wrong answer, error |
| **Excited / Hype** | Pupils large (r=6), star highlights | Open smile with tongue | `!` | Countdown, streak, winner |
| **Surprised** | Pupils tiny (r=2.5), eyes taller (ry=14) | Small open "O" circle | `?!` | Time running out, twist |
| **Sleeping / Idle** | Closed (horizontal lines) | Tiny flat line, "z z z" | `z` | Session timeout, AFK |

### Expression SVG Variants

**Happy (eyes squeezed shut):**
```svg
<!-- Replace eye whites + pupils with arc paths -->
<path d="M28 44 Q38 36 48 44" fill="none" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round"/>
<path d="M52 44 Q62 36 72 44" fill="none" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round"/>
<!-- Wide smile with white fill -->
<path d="M34 60 Q50 76 66 60" fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round"/>
```

**Sad (frown):**
```svg
<!-- Pupils shifted down -->
<circle cx="40" cy="49" r="5" fill="var(--bzm-black)"/>
<circle cx="64" cy="49" r="5" fill="var(--bzm-black)"/>
<!-- Frown -->
<path d="M38 66 Q50 58 62 66" fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round"/>
```

**Excited (big pupils, star highlights):**
```svg
<!-- Big pupils -->
<circle cx="40" cy="46" r="6.5" fill="var(--bzm-black)"/>
<circle cx="64" cy="46" r="6.5" fill="var(--bzm-black)"/>
<!-- Star-shaped highlights instead of circle -->
<polygon points="36,39 37,41 39,41 37.5,42.5 38,44.5 36,43 34,44.5 34.5,42.5 33,41 35,41"
  fill="var(--bzm-white)"/>
<!-- Open smile with tongue -->
<path d="M34 60 Q50 76 66 60" fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
<ellipse cx="50" cy="68" rx="6" ry="4" fill="var(--bzm-color-primary-light)"/>
```

---

## 3. Color Rules

The mascot always uses design token variables — never hardcoded hex values.

| Part | Token | Hex |
|------|-------|-----|
| Body fill | `--bzm-color-primary` | #FF3B30 |
| All outlines | `--bzm-black` | #000000 |
| Eye whites | `--bzm-white` | #FFFFFF |
| Cheek blush | `--bzm-red-200` | #FFB3AE |
| Badge fill | `--bzm-color-accent` | #FFD60A |
| Badge text | `--bzm-black` | #000000 |
| Hard shadow | `--bzm-black` @ 18% opacity | — |

### Contextual recoloring

The body can be recolored for specific contexts while keeping the same structure:

| Context | Body fill | Badge fill |
|---------|-----------|------------|
| Default | `--bzm-color-primary` (red) | `--bzm-color-accent` (yellow) |
| Answer A | `--bzm-color-answer-a` (cyan) | `--bzm-color-accent` |
| Answer B | `--bzm-color-answer-b` (yellow) | `--bzm-color-primary` |
| Answer C | `--bzm-color-answer-c` (red) | `--bzm-color-accent` |
| Answer D | `--bzm-color-answer-d` (green) | `--bzm-color-accent` |
| Success | `--bzm-color-success` (green) | `--bzm-color-accent` |
| Error | `--bzm-color-error` (red) | `--bzm-white` |

---

## 4. Comic-Book Style Rules

These rules apply to every mascot rendering to stay consistent with the Bazam design system.

- **Thick black outlines**: Body stroke 4px, eyes 2.5px, badge 2.5px. Never use thin or colored strokes.
- **Hard offset shadow**: Always 3px right, 3px down, black, 18% opacity. No blur, no soft shadows.
- **No gradients**: Flat fills only. Depth comes from outlines and shadows, not shading.
- **Cheek blush**: Always present. Uses `--bzm-red-200` at 55% opacity, regardless of body color.
- **Eye highlights**: Two per eye (large circle + small circle). Creates the glossy cartoon look.
- **Badge font**: Always `var(--bzm-font-heading)` (Bangers). Single character only.

---

## 5. Animation Principles

When the mascot is animated, follow these rules for consistency.

### Bounce (primary motion)
- **Timing**: 1.8s cycle
- **Physics**: Per-keyframe easing — `ease-out` for launch, `ease-in-out` for hang, `ease-in` for fall
- **Squash & stretch**: Max 8% deviation from neutral (scaleX: 0.92–1.08, scaleY: 0.92–1.08)
- **Transform origin**: Center-bottom of body

### Badge follow-through
- Badge peaks 2% earlier than body and overshoots by ~4px
- Wobble rotation: -5deg at ground, +8deg at peak
- Same 1.8s cycle, same per-keyframe easing

### Pupil look-around
- 3.5s cycle, `ease-in-out`
- Max 2px translation in any direction
- Figure-eight path

### Expression transitions
- Use `transition: 300ms var(--bzm-transition-playful)` for swapping expressions
- Scale the whole mascot to 0.9 then back to 1.0 during swap for a "pop" effect

### Reduced motion
- All motion collapses to a gentle opacity pulse (2s, 0.5–1.0)
- Mascot remains visible and static — never hidden

---

## 6. Sizing

The mascot scales uniformly via SVG `viewBox`. Use these recommended sizes:

| Context | Size | Notes |
|---------|------|-------|
| Inline icon | 24–32px | Body only, no badge, no shadow |
| Spinner / loading | 48–120px | Full mascot with badge and effects |
| Empty state | 120–160px | Full mascot, possibly with speech bubble |
| Hero / splash | 200–300px | Full mascot with effects and accessories |
| Favicon | 32x32 | Body + eyes only, simplified outlines |

---

## 7. Planned Usage Across App

| Location | Expression | Animation | Notes |
|----------|-----------|-----------|-------|
| `bzm-spinner` | Neutral | Bounce + orbit dots + sparkles | Already implemented |
| `bzm-waiting-state` | Neutral | Gentle bounce | Replace current spinner-only state |
| `bzm-answer-feedback` (correct) | Happy | Pop-in scale | Appears next to "Goed zo!" |
| `bzm-answer-feedback` (incorrect) | Sad | Subtle head shake | Appears next to "Helaas!" |
| `bzm-countdown-view` | Excited | Bouncing with increasing speed | Appears during 3-2-1 countdown |
| `bzm-winner-card` | Excited | Celebration bounce + confetti | Next to winner name |
| `bzm-hero` | Neutral | Idle float | Landing page decoration |
| Empty quiz list | Sleeping | Breathing pulse | "Nog geen quizzen" state |
| Error page | Surprised | Subtle shake | 404 / connection lost |
| Player lobby (waiting) | Neutral | Slow bounce | Waiting for host to start |

---

## 8. Accessories

The badge circle can be swapped or the mascot can gain accessories for special contexts.

| Accessory | Visual | Context |
|-----------|--------|---------|
| **? badge** (default) | Yellow circle + "?" | Quiz/loading contexts |
| **! badge** | Yellow circle + "!" | Success/hype contexts |
| **Crown** | Yellow triangle crown on top of body | Winner display |
| **Timer ring** | Circular progress around body | Active question timer |
| **Streak flames** | Small orange flame shapes behind body | Streak banner |

---

## 9. Do's and Don'ts

**Do:**
- Always use the SVG template from this doc as the source of truth
- Scale uniformly — never stretch or skew the mascot
- Use design token variables for all colors
- Include `aria-hidden="true"` on decorative mascot instances
- Provide alt text via parent `role="status"` or `aria-label` when the mascot communicates state

**Don't:**
- Add gradients, drop-shadow filters, or blur effects
- Change the eye-to-body ratio (the oversized eyes are the character's identity)
- Use more than one character of text in the badge
- Animate at speeds faster than 0.8s per bounce cycle
- Place the mascot on busy backgrounds without sufficient contrast
- Use the mascot as a button or interactive element (it's decorative/informational)
